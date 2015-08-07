/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

package com.kaazing.gateway.jms.server.demo;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.security.SecureRandom;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;
import java.util.Random;
import java.util.ServiceLoader;
import java.util.concurrent.TimeUnit;

import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.DeliveryMode;
import javax.jms.Destination;
import javax.jms.ExceptionListener;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import com.kaazing.gateway.demo.DemoServiceConfig;
import com.kaazing.gateway.demo.KaazingDOMConfigurator;

/**
 * Publish stock messages to the following topics:
 * 
 *     Topic: stock
 *     This is the top-level topic to which all stocks are published to.
 *     This is the original topic and is kept for backward compatibility.
 *     The message of type TextMessage. The body contains a string concatenating
 *     the company, symbol, and price.
 *     
 *     Topic: ticker
 *     This is the top-level topic to which all stocks are published to.
 *     This is a new topic. A client can subscribe to this topic and see all
 *     stock prices.
 *     The message of type Message. The data are added as properties to the
 *     message: company, symbol, price, change (from the previous price) 
 * 
 *     Topic: ticker.<SYMBOL>
 *     Each stock is also published to its on individual topic. For example, ORCL is
 *     published to both stocks and stocks.ORCL. This lets clients subscribe to
 *     individual stocks.
 *     The message of type Message. The data are added as properties to the
 *     message: company, symbol, price, change (from the previous price) 
 *     
 * Consumers listen on the following queues:
 * 
 *     Queue: tickerCommand
 *     Send commands to the stock feed to change the behavior. Commands are listed
 *     below.
 *     
 * Commands:
 * 
 * Send commands to the ticker.command queue with any combination of the following
 * properties:
 * 
 *     setMessagesPerSecond (float)
 *     The number of messages the 
 *
 *     reset
 *     Reset prices to the original prices. Useful if the random data of different
 *     symbols has converged over time.
 *     There is no value for this property, you only need to send the property name.
 *      
 */     
public class JmsDataSource implements Runnable {


    private static final String LOG4J_CONFIG_PROPERTY = "LOG4J_CONFIG";
    private static final ServiceLoader<DemoServiceConfig> loader = ServiceLoader.load(DemoServiceConfig.class);
    
    private enum TickerCommands {setMessagesPerSecond, reset};

    /**
     * @param args may contain an optional URL for connecting to the message broker in element zero.
     * @throws Exception if anything goes wrong (generally caught internally)
     */
    public static void main(String... args) throws Exception {
        Properties demoServiceConfigProps = null;
        if (loader != null) {
            Iterator<DemoServiceConfig> iter = loader.iterator();
            if ((iter != null) && iter.hasNext()) {
                DemoServiceConfig demoServiceConfig = iter.next();
                demoServiceConfigProps = demoServiceConfig.configure();
            }
        }

        if (demoServiceConfigProps == null) {
            demoServiceConfigProps = new Properties();
            demoServiceConfigProps.putAll(System.getProperties());
        }

        String log4jConfigProperty = demoServiceConfigProps.getProperty(LOG4J_CONFIG_PROPERTY);
        if (log4jConfigProperty != null) {
            // configure log4j
            File log4jConfigFile = new File(log4jConfigProperty);
            KaazingDOMConfigurator configurator = new KaazingDOMConfigurator(demoServiceConfigProps);
            configurator.doConfigure(log4jConfigFile.toURI().toURL(), LogManager.getLoggerRepository());
        }
        _logger = Logger.getLogger(JmsDataSource.class);

        Properties properties = new Properties();
        // Set default values to work with ActiveMQ (backward compatible with the original demo)
        properties.setProperty("providerURL", "tcp://localhost:61616");
        properties.setProperty("initialConnectionFactory", "org.apache.activemq.jndi.ActiveMQInitialContextFactory");
        properties.setProperty("connectionFactory", "ConnectionFactory");
        // Override with values from the file
        try {
            InputStream propfile = JmsDataSource.class.getResourceAsStream("/StockService.properties");
            if (propfile != null) {
                properties.load(propfile);
                _logger.trace(LOG_PREFIX+"Loaded StockService.properties from JAR");
            } else {
                _logger.warn(LOG_PREFIX+"Could not find StockService.properties. Using hard-coded values for ActiveMQ.");
            }
        } catch (IOException e) {
            _logger.error(LOG_PREFIX+e);
        }
        
        if (args.length > 0) properties.setProperty("providerURL", args[0]); // let the command line override this (backward compatibility)
        
        String providerURL = properties.getProperty("providerURL");
        Hashtable<String, String> env = new Hashtable<String, String>();
        env.put(Context.INITIAL_CONTEXT_FACTORY, properties.getProperty("initialConnectionFactory")); 
        env.put(Context.PROVIDER_URL, providerURL);
        
        InitialContext initialContext = new InitialContext(env);
        final ConnectionFactory connectionFactory = (ConnectionFactory) initialContext.lookup(properties.getProperty("connectionFactory"));
        final JmsDataSource service = new JmsDataSource(initialContext, connectionFactory);
        System.out.println(LOG_PREFIX+"Stock Ticker demo connected to " + providerURL);
        _logger.info(LOG_PREFIX+"Stock Ticker demo connected to " + providerURL);
        service.run();
    }

    public JmsDataSource(InitialContext initialContext, ConnectionFactory connectionFactory) {
        _connectionFactory = connectionFactory;
        _initialContext = initialContext;
    }
    
    public void run() {
        _random = new SecureRandom(new SecureRandom().generateSeed(20));
        System.arraycopy(_STOCKS_ORIG, 0, _STOCKS, 0, _STOCKS.length);
        try {
            connect();
            // No-inspection InfiniteLoopStatement
            while (true) {
                _changeStock();
                Thread.sleep((long)(1000/_messagesPerSecond));
            }
        }
        catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void connect() throws InterruptedException {
        try {
            final Connection connection = _connectionFactory.createConnection();
            connection.setExceptionListener(new ExceptionListener() {
                @Override
                public void onException(JMSException exception) {
                    try {
                        connection.close();
                    }
                    catch (JMSException e) {
                        // ignore
                    }
                    
                    try {
                        Thread.sleep(TimeUnit.SECONDS.toMillis(10));
                        connect();
                    }
                    catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            });
            
            _session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
            
            // Create an unidentified message producer, which can send on different destinations.
            _producer = _session.createProducer(null);
            
            final String stockDestinationName = "stock";
            final String tickerDestinationName = "ticker";
            final String commandQueueName = "tickerCommand";

            // Create the top-level destinations.
            _stockDestination = createTopic(stockDestinationName);
            System.out.println(LOG_PREFIX+"Publishing to topic: "+stockDestinationName);

            _tickerDestination = createTopic(tickerDestinationName);
            System.out.println(LOG_PREFIX+"Publishing to topic: "+tickerDestinationName);
            
            // Create the symbol destinations for "ticker" topic.
            _tickerSymbolDestinations = new HashMap<String, Destination>();
            for (int i=0; i<_STOCKS.length/STOCK_COLUMN_COUNT; i++) {
                String symbol = (String) _STOCKS[(i * STOCK_COLUMN_COUNT) + SYMBOL_COLUMN_INDEX];
                                
                Destination symbolDestination = createTopic(tickerDestinationName+"."+symbol);
                _tickerSymbolDestinations.put(symbol, symbolDestination);
            }
            System.out.println(LOG_PREFIX+"Publishing to topic: "+tickerDestinationName+".<SYMBOL>");
            
            final Destination commandQueue = createQueue(commandQueueName);
            _commandConsumer = _session.createConsumer(commandQueue);
            _commandConsumer.setMessageListener(new MessageListener() {
                @Override
                public void onMessage(Message message) {
                    handleCommandMessage(message);
                }
            });
            System.out.println(LOG_PREFIX+"Listening to queue: "+commandQueueName);
            System.out.print(LOG_PREFIX+"Commands: ");
            boolean isNotFirst = false;
            for (TickerCommands command : TickerCommands.values()) {
                if (isNotFirst) {
                    System.out.print(", ");
                }
                System.out.print(command);
                isNotFirst = true;
            }
            System.out.println();
            
            connection.start();
            
        }
        catch (JMSException e) {
            Thread.sleep(TimeUnit.SECONDS.toMillis(10));
            connect();
        }
    }
    
    private Destination createTopic(String destinationName) throws JMSException {
        Destination destination = null;
        try {
            destination = (Destination)_initialContext.lookup(destinationName);
        } catch (NamingException e) {
            // don't worry, any exception here will be fixed by creating the topic dynamically
        }
        if (destination == null) {
            destination = _session.createTopic(destinationName);
        }
        return destination;
    }

    private Destination createQueue(String destinationName) throws JMSException {
        Destination destination = null;
        try {
            destination = (Destination)_initialContext.lookup(destinationName);
        } catch (NamingException e) {
            // don't worry, any exception here will be fixed by creating the topic dynamically
        }
        if (destination == null) {
            destination = _session.createQueue(destinationName);
        }
        return destination;
    }

    private void _changeStock()
    {
        // pick the stock to update
        int stockIndex = _random.nextInt(STOCK_ROW_COUNT);

        float oldPrice = (Float)_STOCKS[(stockIndex * STOCK_COLUMN_COUNT) + PRICE_COLUMN_INDEX];
        
        // Set volatility between 2 and 12.
        float volatility = _random.nextFloat() * 10 + 2;
        
        float rnd = _random.nextFloat();
        
        float changePercent = 2 * volatility * rnd;
        
        if (changePercent > volatility) {
            changePercent -= (2 * volatility);
        }
        float change = oldPrice * changePercent/100;
        float newPrice = oldPrice + change;

        // if a stock ever falls too low or gets too high, reset it to original value
        float originalPrice = (Float) _STOCKS_ORIG[(stockIndex * STOCK_COLUMN_COUNT) + PRICE_COLUMN_INDEX];
        float percentageChange = Math.abs((newPrice - originalPrice)/originalPrice);
        if (percentageChange > MAX_PERCENTAGE_CHANGE) {
            newPrice = originalPrice;
            change = newPrice - oldPrice;
        }
        
        _STOCKS[(stockIndex * STOCK_COLUMN_COUNT) + PRICE_COLUMN_INDEX] = newPrice;
        _STOCKS[(stockIndex * STOCK_COLUMN_COUNT) + CHANGE_COLUMN_INDEX] = change;
        
        _sendStock(stockIndex);

    }

    private void _sendStock(int stockIndex)
    {
        String company = (String) _STOCKS[(stockIndex * STOCK_COLUMN_COUNT)];
        String symbol = (String) _STOCKS[(stockIndex * STOCK_COLUMN_COUNT) + SYMBOL_COLUMN_INDEX];
        float price = (Float) _STOCKS[(stockIndex * STOCK_COLUMN_COUNT) + PRICE_COLUMN_INDEX];
        float change = (Float) _STOCKS[(stockIndex * STOCK_COLUMN_COUNT) + CHANGE_COLUMN_INDEX];
        
        String body =   company + ":" + symbol + ":" + _displayFormat.format(price);

        try {
            // Send a TextMessage to the stock topic, plus the symbol topic.
            Message message = _session.createTextMessage(body);
            message.setStringProperty("symbol", symbol);
            _producer.send(_stockDestination, message, DeliveryMode.NON_PERSISTENT, Message.DEFAULT_PRIORITY, 0L);

            // Send Message to the ticker topic, plus the symbol topic.
            message = _session.createMapMessage(); // Should be createMessage(), but something doesn't work.
            message.setStringProperty("company", company);
            message.setStringProperty("symbol", symbol);
            message.setFloatProperty("price", price);
            message.setFloatProperty("change", change);
            _producer.send(_tickerDestination, message, DeliveryMode.NON_PERSISTENT, Message.DEFAULT_PRIORITY, 0L);
            Destination symbolDestination = _tickerSymbolDestinations.get(symbol);
            _producer.send(symbolDestination, message, DeliveryMode.NON_PERSISTENT, Message.DEFAULT_PRIORITY, 0L);
        }
        catch (JMSException e) {
            _logger.error("Failure to send message: " + body);
        }
    }

    private void handleCommandMessage(Message commandMessage) {
        try {
            
            String mps = commandMessage.getStringProperty(TickerCommands.setMessagesPerSecond.toString());
            if (mps != null) {
                String s = LOG_PREFIX+"Setting messagesPerSecond to "+mps;
                System.out.println(s);
                _logger.info(s);
                _messagesPerSecond = Float.valueOf(mps);
            }
            
            String reset = commandMessage.getStringProperty(TickerCommands.reset.toString());
            if (reset != null) {
                String s = LOG_PREFIX+"Resetting to original prices";
                System.out.println(s);
                _logger.info(s);
                
                for (int i=0; i<_STOCKS.length/STOCK_COLUMN_COUNT; i++) {
                    float currentPrice = (Float) _STOCKS[(i * STOCK_COLUMN_COUNT) + PRICE_COLUMN_INDEX];
                    float originalPrice = (Float) _STOCKS_ORIG[(i * STOCK_COLUMN_COUNT) + PRICE_COLUMN_INDEX];
                    _STOCKS[(i * STOCK_COLUMN_COUNT) + PRICE_COLUMN_INDEX] = originalPrice;
                    _STOCKS[(i * STOCK_COLUMN_COUNT) + CHANGE_COLUMN_INDEX] = currentPrice - originalPrice;
                }
            }
            
        }
        catch (JMSException e) {
            e.printStackTrace();
            _logger.error(LOG_PREFIX+"Error with command message", e);
        }
        catch (NumberFormatException e) {
            e.printStackTrace();
            _logger.error(LOG_PREFIX+"Expected an integer, but got a string", e);
        }
        catch (Exception e) {
            e.printStackTrace();
            _logger.error(LOG_PREFIX+"Got an exception", e);
        }
    }
    
    static final private Object[] _STOCKS_ORIG =
    {
        "Adobe Systems"                  , "ADBE", 68.49F  , 0F,
        "Akamai Technologies"            , "AKAM", 61.02F  , 0F,
        "Apple"                          , "AAPL", 528.61F , 0F,
        "Bank of America"                , "BAC" , 17.31F  , 0F,
        "Cisco Systems"                  , "CSCO", 21.72F  , 0F,
        "Citigroup"                      , "C"   , 49.37F  , 0F,
        "Dell"                           , "DELL", 14.49F  , 0F,
        "Facebook"                       , "FB"  , 69.75F  , 0F,
        "Google"                         , "GOOG", 1197.17F, 0F,
        "Hewlett-Packard"                , "HPQ" , 36.53F  , 0F,
        "HSBC"                           , "HSBC", 19.60F  , 0F,
        "Informatica"                    , "INFA", 40.20F  , 0F,
        "Intel"                          , "INTC", 25.42F  , 0F,
        "International Business Machines", "IBM" , 187.41F , 0F,
        "JPMorgan Chase"                 , "JPM" , 59.30F  , 0F,
        "Kaazing"                        , "KZNG", 33.73F  , 0F,
        "Microsoft"                      , "MSFT", 40.84F  , 0F,
        "Oracle"                         , "ORCL", 38.81F  , 0F,
        "TIBCO"                          , "TIBX", 22.37F  , 0F,
        "Wells Fargo"                    , "WFC" , 47.86F  , 0F
    };
    
    static private Object[] _STOCKS = new Object[_STOCKS_ORIG.length];

    private static final int STOCK_COLUMN_COUNT = 4;
    private static final int STOCK_ROW_COUNT = _STOCKS.length / STOCK_COLUMN_COUNT;
    private static final int SYMBOL_COLUMN_INDEX = 1;
    private static final int PRICE_COLUMN_INDEX = 2;
    private static final int CHANGE_COLUMN_INDEX = 3;

    // The largest percentage the new price can change from the original
    // before being reset to the original price.
    private static final float MAX_PERCENTAGE_CHANGE = 0.75F;

    private static final String LOG_PREFIX = "[Stock Feed] ";

    static private Session _session;
    static private MessageProducer _producer;
    // Top-level topic for "stock".
    static private Destination _stockDestination;
    // Top-level topic for "ticker".
    static private Destination _tickerDestination;
    // Map of individual symbol topics under "ticker".
    static private Map<String, Destination> _tickerSymbolDestinations;
    // Consumer for command messages.
    static private MessageConsumer _commandConsumer;
    
    
    static private Random _random;
    // formatter used to send prices as decimal currency (Locale.ENGLISH allows us to always use period as separator)
    static private DecimalFormat _displayFormat = new DecimalFormat("####.00", new DecimalFormatSymbols(Locale.ENGLISH));

    private static Logger _logger;

    private InitialContext _initialContext;
    private ConnectionFactory _connectionFactory;
    
    /**
     * The number of messages to publish per second.
     * 
     * 1 = 1 message per second.
     * 20 = 20 messages per second.
     * 0.5 = 1 message every 2 seconds.
     * 
     * Represents the total number of messages to send per second. This is
     * split across the total number of symbols. If this setting is 20 and there
     * are 20 different symbols, then on average each symbol will be updated once
     * per second.
     */
    private float _messagesPerSecond = 20;
}
