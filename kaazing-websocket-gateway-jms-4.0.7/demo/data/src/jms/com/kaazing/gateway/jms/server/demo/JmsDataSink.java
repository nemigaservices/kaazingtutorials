/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

package com.kaazing.gateway.jms.server.demo;

import java.io.File;
import java.util.Hashtable;

import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.naming.Context;
import javax.naming.InitialContext;

import org.apache.log4j.xml.DOMConfigurator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JmsDataSink {

	private static final String LOG4J_CONFIG_PROPERTY = "LOG4J_CONFIG";

	/**
	 * @param args
	 */
	public static void main(String... args) throws Exception {
		String providerURL = (args.length > 0) ? args[0] : "tcp://localhost:61616";

		Hashtable<String, String> env = new Hashtable<String, String>();
		env.put(Context.INITIAL_CONTEXT_FACTORY, "org.apache.activemq.jndi.ActiveMQInitialContextFactory");
		env.put(Context.PROVIDER_URL, providerURL);
		env.put("topic.stock", "stock");
		
		String log4jConfigProperty = System.getProperty(LOG4J_CONFIG_PROPERTY);
		if (log4jConfigProperty != null) {
			File log4jConfigFile = new File(log4jConfigProperty);
			DOMConfigurator.configure(log4jConfigFile.toURI().toURL());
		}
		
		final Logger logger = LoggerFactory.getLogger(JmsDataSink.class);

		InitialContext initialContext = new InitialContext(env);
		ConnectionFactory connectionFactory = (ConnectionFactory)initialContext.lookup("ConnectionFactory");
		Connection connection = connectionFactory.createConnection();
		Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
		
		Destination destination = (Destination)initialContext.lookup("stock");
		MessageConsumer messageConsumer = session.createConsumer(destination);
		messageConsumer.setMessageListener(new MessageListener() {
			public void onMessage(Message message) {
				try {
					logger.info(((TextMessage)message).getText());
				} catch (JMSException e) {
					throw new RuntimeException(e);
				}
			}
		});
		
		connection.start();

		logger.info("Started listening");
	}

}
