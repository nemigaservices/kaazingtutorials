/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

package com.kaazing.gateway.jms.client.demo;

import java.awt.Color;
import java.awt.Frame;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.net.PasswordAuthentication;
import java.net.URI;
import java.net.URL;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.LinkedList;
import java.util.Map;

import javax.jms.BytesMessage;
import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.Destination;
import javax.jms.ExceptionListener;
import javax.jms.JMSException;
import javax.jms.MapMessage;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.swing.AbstractListModel;
import javax.swing.ImageIcon;
import javax.swing.JList;

import com.kaazing.gateway.jms.client.ConnectionDisconnectedException;
import com.kaazing.gateway.jms.client.ConnectionFailedException;
import com.kaazing.gateway.jms.client.JmsConnectionFactory;
import com.kaazing.gateway.jms.client.JmsInitialContext;
import com.kaazing.net.auth.BasicChallengeHandler;
import com.kaazing.net.auth.ChallengeHandler;
import com.kaazing.net.auth.LoginHandler;
import com.kaazing.net.http.HttpRedirectPolicy;
import com.kaazing.net.ws.WebSocketFactory;

public class JmsPanel extends javax.swing.JPanel implements ActionListener, MessageListener, ExceptionListener {

    private static final long serialVersionUID = -2638459382096381608L;

    private Context jndiInitialContext;
    private ConnectionFactory connectionFactory;
    private Connection connection;     // JMS Connection

    private Session session;           // JMS Session
    private Session transactedSession; // JMS Transacted Session
    private int messageCount = 0;

    private Map<String, LinkedList> consumers;

    private javax.swing.JButton abort;
    private javax.swing.JButton begin;
    private javax.swing.JButton clear;
    private javax.swing.JButton commit;
    private javax.swing.JButton connect;
    private javax.swing.JButton disconnect;
    private javax.swing.JButton send;
    private javax.swing.JButton subscribe;
    private javax.swing.JButton unsubscribe;
    private javax.swing.JButton txnSend;
    private JList logList;
    javax.swing.JTextField location;
    private javax.swing.JTextField message;
    private javax.swing.JPasswordField password;
    private javax.swing.JTextField destination;
    private javax.swing.JTextField messageSelector;
    private javax.swing.JTextField transaction;
    private javax.swing.JTextField txnDestination;
    private javax.swing.JTextField txnMessage;
    private javax.swing.JTextField username;
    private CircularListModel logModel = new CircularListModel(50);
    private javax.swing.JCheckBox binary;
    private javax.swing.JCheckBox binaryTransaction;

    /** Creates new form StompPanel */
    public JmsPanel() {
        initComponents();
        this.setBackground(Color.WHITE);
        connect.addActionListener(this);
        disconnect.addActionListener(this);
        begin.addActionListener(this);
        txnSend.addActionListener(this);
        commit.addActionListener(this);
        abort.addActionListener(this);
        subscribe.addActionListener(this);
        send.addActionListener(this);
        unsubscribe.addActionListener(this);
        clear.addActionListener(this);

        location.setText("ws://localhost:8001/jms");

        destination.setText("/topic/destination");
        message.setText("Hello, message");
        transaction.setText("transaction#1");
        txnMessage.setText("Hello, transaction");
        txnDestination.setText("/topic/destination");

        updateButtonsForClosed();

    }

    void initJndi(Hashtable<Object,Object> env) throws NamingException {
        jndiInitialContext = new InitialContext(env);
        env.put(JmsInitialContext.CONNECTION_TIMEOUT, "15000");
        connectionFactory = (ConnectionFactory)jndiInitialContext.lookup("ConnectionFactory");

        System.out.println("JNDI initialization complete");
    }

    private ChallengeHandler createChallengeHandler(String location) {
    	final LoginHandler loginHandler = new LoginHandler() {
            private String username;
            private char[] password;
            @Override
            public PasswordAuthentication getCredentials() {
                try {
                    LoginDialog dialog = new LoginDialog(Frame.getFrames()[0]);
                    if (dialog.isCanceled()) {
                        return null;
                    }
                    username = dialog.getUsername();
                    password = dialog.getPassword();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return new PasswordAuthentication(username, password);
            }
        };
        BasicChallengeHandler challengeHandler = BasicChallengeHandler.create();
        challengeHandler.setLoginHandler(loginHandler);
        return challengeHandler;
    }

    @Override
    public void onMessage(Message message) {
        try {
            if (message instanceof TextMessage) {
                logMessage("RECEIVED TextMessage: " + ((TextMessage)message).getText());
            }
            else if (message instanceof BytesMessage) {
                BytesMessage bytesMessage = (BytesMessage)message;

                long len = bytesMessage.getBodyLength();
                byte b[] = new byte[(int)len];
                bytesMessage.readBytes(b);

                logMessage("RECEIVED BytesMessage: " + hexDump(b));
            }
            else if (message instanceof MapMessage) {
                MapMessage mapMessage = (MapMessage)message;
                Enumeration mapNames = mapMessage.getMapNames();
                while (mapNames.hasMoreElements()) {
                    String key = (String)mapNames.nextElement();
                    Object value = mapMessage.getObject(key);

                    if (value == null) {
                        logMessage(key + ": null");
                    } else if (value instanceof byte[]) {
                        byte[] arr = (byte[])value;
                        StringBuilder s = new StringBuilder();
                        s.append("[");
                        for (int i = 0; i < arr.length; i++) {
                            if (i > 0) {
                                s.append(",");
                            }
                            s.append(arr[i]);
                        }
                        s.append("]");
                        logMessage(key + ": "+ s.toString() + " (Byte[])");
                    } else {
                        logMessage(key + ": " + value.toString() + " (" + value.getClass().getSimpleName() + ")");
                    }
                }
                logMessage("RECEIVED MapMessage: ");
            }
            else {
                logMessage("UNKNOWN MESSAGE TYPE: "+message.getClass().getSimpleName());
            }

            messageCount++;
            if (messageCount % 500 == 0) {
                System.out.println("PROCESSED : " + messageCount + " messages");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onException(JMSException e) {
        handleException(e);
    }

    public void actionPerformed(ActionEvent arg0) {
        try {
            if (arg0.getSource() == connect) {

                final ExceptionListener applet = this;
                Thread connectThread = new Thread() {

                    @Override
                    public void run() {
                        try {
                            String url = location.getText();
                            logMessage("CONNECT: " + url);
                            
                            if (connectionFactory instanceof JmsConnectionFactory) {
                                JmsConnectionFactory stompConnectionFactory = (JmsConnectionFactory)connectionFactory;
                            	// initialize the login handler for the target location
                                ChallengeHandler challengeHandler = createChallengeHandler(url);
                                stompConnectionFactory.setGatewayLocation(new URI(url));
                                WebSocketFactory webSocketFactory = stompConnectionFactory.getWebSocketFactory();
                                webSocketFactory.setDefaultChallengeHandler(challengeHandler);
                                webSocketFactory.setDefaultRedirectPolicy(HttpRedirectPolicy.SAME_DOMAIN);
                            }
                            
                            String username0 = (username.getText().length() != 0) ? username.getText() : null;
                            String password0 = (password.getPassword().length != 0) ? String
                                    .valueOf(password.getPassword())
                                    : null;
                            
                            updateButtonsForConnecting();
                            connection = connectionFactory.createConnection(username0, password0);
                            connection.setExceptionListener(applet);
                            consumers = new HashMap<String, LinkedList>();
                            session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
                            transactedSession = connection.createSession(true, Session.SESSION_TRANSACTED);

                            connection.start();
                            updateButtonsForConnected();
                            logMessage("CONNECTED");

                        } catch (ConnectionFailedException e) {
                            updateButtonsForClosed();
                            handleException(e);
                        } catch (Exception e) {
                            updateButtonsForClosed();
                            handleException(e);
                        }
                    }
                };
                connectThread.start();

            } else if (arg0.getSource() == clear) {
                logModel.clear();
            } else if (arg0.getSource() == disconnect) {
                logMessage("CLOSE");
                close();
            } else {
                if (arg0.getSource() == subscribe) {
                	try {
	                    String destinationName = destination.getText();
	                    String selectorText = messageSelector.getText();
                        //String durableSubscriberName = durableName.getText();
                        //boolean hasDurableSubscriberName = (durableSubscriberName != null && !durableSubscriberName.isEmpty());
	                    boolean hasSelector = (selectorText != null && !selectorText.isEmpty());
                        logMessage("SUBSCRIBE: " + destinationName + " " + selectorText);

	                    Destination destination = (Destination)jndiInitialContext.lookup(destinationName);
                            MessageConsumer consumer;

                            if (hasSelector) {
                                consumer = session.createConsumer(destination, selectorText, false);
                            }
                            else {
                                consumer = session.createConsumer(destination);
                            }
                            consumer.setMessageListener(this);
                            LinkedList consumerlist =  consumers.get(destinationName);
                        if (consumerlist == null){
                                consumerlist = new LinkedList<MessageConsumer>();
                            }
                            consumerlist.add(consumer);
                            consumers.put(destinationName, consumerlist);
                	} catch (Exception e) {
                       	handleException(e);
                	}

                } else if (arg0.getSource() == unsubscribe) {
                    try {
                        boolean foundConsumer = false;
                            String destinationName = destination.getText();
                            logMessage("UNSUBSCRIBE: " + destinationName);

                            LinkedList consumerlist = consumers.get(destinationName);
                            if (consumerlist != null) {
                                int consumerlistSize = consumerlist.size();
                                if(consumerlistSize > 0) {
                                    MessageConsumer consumer = (MessageConsumer) consumerlist.get(consumerlistSize-1);
                                    consumerlist.remove(consumerlistSize-1);
                                    if (consumer != null) {
                                        consumer.close();
                                        if(consumerlist.size() == 0) {
                                            consumers.remove(consumerlist);
                                        }
                                        foundConsumer = true;
                                    }
                                    else {
                                        logMessage("ERROR: Destination not found: " + destinationName);
                                    }
                                }
                                else {
                                    logMessage("ERROR: Destination not found: " + destinationName);
                                }
                            }
                            else {
                                logMessage("ERROR: Destination not found: " + destinationName);
                            }
                        }
                    catch (Exception e) {
                       	handleException(e);
                    }

                } else if (arg0.getSource() == send) {
                    String destinationName = destination.getText();
                    Destination destination = (Destination)jndiInitialContext.lookup(destinationName);
                    MessageProducer producer = session.createProducer(destination);

                    String text = message.getText();
                    try {
                    	if (binary.isSelected()) {
    						logMessage("SEND BytesMessage: " + hexDump(text.getBytes()) + " : " + destinationName);
                            BytesMessage bytesMessage = session.createBytesMessage();
                            bytesMessage.writeUTF(text);
                            producer.send(bytesMessage);
                        }
                        else {
    						logMessage("SEND TextMessage: " + text + " : " + destinationName);
                            TextMessage textMessage = session.createTextMessage(text);
                            producer.send(textMessage);
                        }
                    }
                    catch (Exception exception) {
                    	handleException(exception);
                    }
                    
                    producer.close();
                } else if (arg0.getSource() == begin) {
                    logMessage("BEGIN: " + transaction.getText());
                    updateTransactionButtons(true);
                } else if (arg0.getSource() == commit) {
                    logMessage("COMMIT: " + transaction.getText());
                    transactedSession.commit();
                    updateTransactionButtons(false);
                } else if (arg0.getSource() == abort) {
                    logMessage("ABORT: " + transaction.getText());
                    transactedSession.rollback();
                    updateTransactionButtons(false);
                } else if (arg0.getSource() == txnSend) {
                    String destinationName = txnDestination.getText();
                    Destination destination = (Destination)jndiInitialContext.lookup(destinationName);
                    MessageProducer producer = transactedSession.createProducer(destination);
                    String text = txnMessage.getText();
                    
                    try {
                    	if(binaryTransaction.isSelected()) {
    						logMessage("SEND BytesMessage: " + hexDump(text.getBytes()) + " : " + destinationName);
                            BytesMessage bytesMessage = transactedSession.createBytesMessage();
                            bytesMessage.writeUTF(text);
                            producer.send(bytesMessage);
                        }
                        else {
    						logMessage("SEND TextMessage: " + text + " : " + destinationName);
                            TextMessage textMessage = transactedSession.createTextMessage(text);
                            producer.send(textMessage);
                        }
                    }
                    catch (Exception exception) {
                    	handleException(exception);
                    }
                    
                    producer.close();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void close() {
        new Thread() {
            @Override
            public void run() {
                try {
                    connection.close();
                    logMessage("CLOSED");
                    updateButtonsForClosed();
                }
                catch (Exception e) {
                    handleException(e);
                }
            };
        }.start();
    }

    private void handleException(Exception e) {
        String message = e.getMessage();
        String exception = e.getClass().getSimpleName();
        logMessage(exception + (message != null ? ": "+message:""));

        if (e instanceof ConnectionDisconnectedException) {
            updateButtonsForClosed();
        }
    }

    private void updateTransactionButtons(boolean enabled) {
        txnSend.setEnabled(enabled);
        commit.setEnabled(enabled);
        abort.setEnabled(enabled);
    }

    private void updateButtonsForClosed() {
        connect.setEnabled(true);
        disconnect.setEnabled(false);
        send.setEnabled(false);
        subscribe.setEnabled(false);
        unsubscribe.setEnabled(false);
        txnSend.setEnabled(false);
        begin.setEnabled(false);
        commit.setEnabled(false);
        abort.setEnabled(false);
    }

    private void updateButtonsForConnecting() {
        connect.setEnabled(false);
        disconnect.setEnabled(false);
    }

    private void updateButtonsForConnected() {
        connect.setEnabled(false);
        disconnect.setEnabled(true);
        send.setEnabled(true);
        subscribe.setEnabled(true);
        unsubscribe.setEnabled(true);
        begin.setEnabled(true);
        commit.setEnabled(false);
        abort.setEnabled(false);
        txnSend.setEnabled(false);
    }

    private void logMessage(String message) {
        logModel.addFirst(message);
    }

    private class CircularListModel extends AbstractListModel {

        private static final long serialVersionUID = 8555597233245564935L;

        private final Object[] elements;
        private int offset;

        public CircularListModel(int fixedSize) {
            this.elements = new Object[fixedSize];
        }

        public void addFirst(Object element) {
            offset = (offset - 1 + elements.length) % elements.length;
            elements[offset] = element;
            fireContentsChanged(this, 0, elements.length);
        }

        @Override
        public Object getElementAt(int index) {
            return elements[(offset + index) % elements.length];
        }

        @Override
        public int getSize() {
            return elements.length;
        }

        public void clear() {
            Arrays.fill(elements, null);
            fireContentsChanged(this, 0, elements.length);
        }
    }

    /**
     * Returns a hex dump of this buffer.
     *
     * @return the hex dump
     */
    public String hexDump(byte[] b) {
        if (b.length == 0) {
            return "empty";
        }

        StringBuilder out = new StringBuilder();
        for (int i=0; i < b.length; i++) {
        	out.append(Integer.toHexString(b[i])).append(' ');
        }
        return out.toString();
    }

    /**
     * This method is called from within the constructor to initialize the
     * form. WARNING: Do NOT modify this code. The content of this method is
     * always regenerated by the Form Editor.
     */
    private void initComponents() {

        URL imageLocation = getClass().getClassLoader().getResource("images/status-info.png"); // NOI18N

        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        location = new javax.swing.JTextField();
        connect = new javax.swing.JButton();
        disconnect = new javax.swing.JButton();
        jLabel4 = new javax.swing.JLabel();
        jLabel6 = new javax.swing.JLabel();
        username = new javax.swing.JTextField();
        jLabel7 = new javax.swing.JLabel();
        password = new javax.swing.JPasswordField();
        jLabel2 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        logList = new JList(logModel);
        clear = new javax.swing.JButton();
        jPanel3 = new javax.swing.JPanel();
        jLabel8 = new javax.swing.JLabel();
        transaction = new javax.swing.JTextField();
        begin = new javax.swing.JButton();
        txnSend = new javax.swing.JButton();
        jLabel9 = new javax.swing.JLabel();
        jLabel10 = new javax.swing.JLabel();
        txnDestination = new javax.swing.JTextField();
        jLabel11 = new javax.swing.JLabel();
        txnMessage = new javax.swing.JTextField();
        commit = new javax.swing.JButton();
        abort = new javax.swing.JButton();
        jPanel2 = new javax.swing.JPanel();
        jLabel3 = new javax.swing.JLabel();
        destination = new javax.swing.JTextField();
        jLabel17 = new javax.swing.JLabel();
        messageSelector = new javax.swing.JTextField();

        subscribe = new javax.swing.JButton();
        send = new javax.swing.JButton();
        jLabel12 = new javax.swing.JLabel();
        jLabel13 = new javax.swing.JLabel();
        message = new javax.swing.JTextField();
        unsubscribe = new javax.swing.JButton();
        jLabel14 = new javax.swing.JLabel();
        jLabel15 = new javax.swing.JLabel();
        binary = new javax.swing.JCheckBox();
        binaryTransaction = new javax.swing.JCheckBox();
        binary.setBackground(Color.WHITE);
        binaryTransaction.setBackground(Color.WHITE);

        setBorder(javax.swing.BorderFactory
                .createTitledBorder("Java Message Service Demo"));
        setPreferredSize(new java.awt.Dimension(920, 650));
        setRequestFocusEnabled(false);

        jPanel1.setBorder(javax.swing.BorderFactory.createTitledBorder(""));

        jLabel1.setText("Location");
        jLabel1.setToolTipText("");

        location.setToolTipText("");
        location.setName("location");

        connect.setText("Connect");
        connect.setToolTipText("");
        connect.setName("connect");

        disconnect.setText("Disconnect");
        disconnect.setToolTipText("");
        disconnect.setName("disconnect");

        jLabel4.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        jLabel4.setIcon((imageLocation != null) ? new ImageIcon(imageLocation) : null);
        jLabel4.setText("User name and password values are optional.");
        jLabel4.setFocusable(false);

        jLabel6.setText("User Name");
        jLabel6.setToolTipText("");

        username.setToolTipText("");
        username.setName("username");

        jLabel7.setLabelFor(jLabel8);
        jLabel7.setText("Password");
        jLabel7.setToolTipText("");

        password.setName("password");



        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(
                jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout
                .setHorizontalGroup(jPanel1Layout
                        .createParallelGroup(
                                javax.swing.GroupLayout.Alignment.LEADING)
                        .addGroup(
                                jPanel1Layout
                                        .createSequentialGroup()
                                        .addGroup(
                                                jPanel1Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.LEADING)
                                                        .addGroup(
                                                                jPanel1Layout
                                                                        .createSequentialGroup()
                                                                        .addGap(
                                                                                96,
                                                                                96,
                                                                                96)
                                                                        .addComponent(
                                                                                connect)
                                                                        .addPreferredGap(
                                                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                                        .addComponent(
                                                                                disconnect))
                                                        .addGroup(
                                                                javax.swing.GroupLayout.Alignment.TRAILING,
                                                                jPanel1Layout
                                                                        .createSequentialGroup()
                                                                        .addContainerGap()
                                                                        .addComponent(
                                                                                jLabel4,
                                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                                387,
                                                                                Short.MAX_VALUE))
                                                        .addGroup(
                                                                jPanel1Layout
                                                                        .createParallelGroup(
                                                                                javax.swing.GroupLayout.Alignment.TRAILING,
                                                                                false)
                                                                        .addGroup(
                                                                                javax.swing.GroupLayout.Alignment.LEADING,
                                                                                jPanel1Layout
                                                                                        .createSequentialGroup()
                                                                                        .addGap(
                                                                                                18,
                                                                                                18,
                                                                                                18)
                                                                                        .addComponent(
                                                                                                jLabel7)
                                                                                        .addPreferredGap(
                                                                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                                                        .addComponent(
                                                                                                password))
                                                                        .addGroup(
                                                                                javax.swing.GroupLayout.Alignment.LEADING,
                                                                                jPanel1Layout
                                                                                        .createSequentialGroup()
                                                                                        .addContainerGap()
                                                                                        .addGroup(
                                                                                                jPanel1Layout
                                                                                                        .createParallelGroup(
                                                                                                                javax.swing.GroupLayout.Alignment.TRAILING)
                                                                                                        .addComponent(
                                                                                                                jLabel6)
                                                                                                        .addComponent(
                                                                                                                jLabel1))
                                                                                        .addPreferredGap(
                                                                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                                                        .addGroup(
                                                                                                jPanel1Layout
                                                                                                        .createParallelGroup(
                                                                                                                javax.swing.GroupLayout.Alignment.LEADING)
                                                                                                        .addComponent(
                                                                                                                username,
                                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                                                203,
                                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                                                                        .addComponent(
                                                                                                                location,
                                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                                                203,
                                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE)))))
                                        .addContainerGap()));

        jPanel1Layout.linkSize(javax.swing.SwingConstants.HORIZONTAL,
                new java.awt.Component[] { connect, disconnect });

        jPanel1Layout
                .setVerticalGroup(jPanel1Layout
                        .createParallelGroup(
                                javax.swing.GroupLayout.Alignment.LEADING)
                        .addGroup(
                                javax.swing.GroupLayout.Alignment.TRAILING,
                                jPanel1Layout
                                        .createSequentialGroup()
                                        .addComponent(
                                                jLabel4,
                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                44,
                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(
                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addGroup(
                                                jPanel1Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(
                                                                location,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(
                                                                jLabel1))
                                        .addPreferredGap(
                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addGroup(
                                                jPanel1Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(
                                                                jLabel6)
                                                        .addComponent(
                                                                username,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE))
                                        .addPreferredGap(
                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addGroup(
                                                jPanel1Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(
                                                                jLabel7)
                                                        .addComponent(
                                                                password,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE))
                                        .addPreferredGap(
                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED,
                                                30, Short.MAX_VALUE)
                                        .addGroup(
                                                jPanel1Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(
                                                                disconnect)
                                                        .addComponent(
                                                                connect))));

        jPanel1Layout.linkSize(javax.swing.SwingConstants.VERTICAL,
                new java.awt.Component[] { connect, disconnect });

        jLabel2.setFont(new java.awt.Font("Dialog", 1, 14));
        jLabel2.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        jLabel2.setIcon((imageLocation != null) ? new ImageIcon(imageLocation) : null);
        jLabel2.setText("<html>This is a demo of a JMS client that communicates directly with a message broker to subscribe to destinations, send and receive messages, and process transactions.</html>");
        jLabel2.setFocusable(false);

        jLabel5.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        jLabel5.setIcon((imageLocation != null) ? new ImageIcon(imageLocation) : null);
        jLabel5.setText("Log messages.");
        jLabel5.setFocusable(false);

        logList.setName("log");
        logList.setVisibleRowCount(50);
        logList.addPropertyChangeListener(new java.beans.PropertyChangeListener() {
                    public void propertyChange(
                            java.beans.PropertyChangeEvent evt) {
                        logListPropertyChange(evt);
                    }
                });

        clear.setText("Clear");
        clear.setToolTipText("");
        clear.setName("clear");

        jPanel3.setBorder(javax.swing.BorderFactory.createTitledBorder(""));

        jLabel8.setText("Transaction");
        jLabel8.setToolTipText("");

        transaction.setToolTipText("");
        transaction.setName("transaction");

        begin.setText("Begin");
        begin.setToolTipText("");
        begin.setName("connect");
        begin.setPreferredSize(null);

        txnSend.setText("Send");
        txnSend.setToolTipText("");
        txnSend.setName("disconnect");

        jLabel9.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        jLabel9.setIcon((imageLocation != null) ? new ImageIcon(imageLocation) : null);
        jLabel9
                .setText("<html>Begin, send messages to, and commit or abort a transaction. Subscribe to see committed transactions.<html>");
        jLabel9.setFocusable(false);

        jLabel10.setText("Destination");
        jLabel10.setToolTipText("");

        txnDestination.setToolTipText("");
        txnDestination.setName("txnDestination");

        jLabel11.setText("Message");
        jLabel11.setToolTipText("");

        txnMessage.setToolTipText("");
        txnMessage.setName("txnMessage");

        commit.setText("Commit");
        commit.setToolTipText("");
        commit.setName("disconnect");

        abort.setText("Abort");
        abort.setToolTipText("");
        abort.setName("disconnect");

        jLabel15.setText("Binary");

        jPanel1.setBackground(Color.WHITE);
        jPanel2.setBackground(Color.WHITE);
        jPanel3.setBackground(Color.WHITE);

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(
                jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout
                .setHorizontalGroup(jPanel3Layout
                        .createParallelGroup(
                                javax.swing.GroupLayout.Alignment.LEADING)
                        .addGroup(
                                jPanel3Layout
                                        .createSequentialGroup()
                                        .addContainerGap()
                                        .addGroup(
                                                jPanel3Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.LEADING)
                                                        .addComponent(
                                                                jLabel9,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                387,
                                                                Short.MAX_VALUE)
                                                        .addGroup(
                                                                jPanel3Layout
                                                                        .createSequentialGroup()
                                                                        .addGroup(
                                                                                jPanel3Layout
                                                                                        .createParallelGroup(
                                                                                                javax.swing.GroupLayout.Alignment.TRAILING)
                                                                                        .addComponent(
                                                                                                jLabel10)
                                                                                        .addComponent(
                                                                                                jLabel8)
                                                                                        .addComponent(
                                                                                                jLabel11)
                                                                                        .addComponent(
                                                                                                jLabel15)
                                                                                        .addGroup(
                                                                                                jPanel3Layout
                                                                                                        .createSequentialGroup()
                                                                                                        .addGap(
                                                                                                                10,
                                                                                                                10,
                                                                                                                10)
                                                                                                        .addComponent(
                                                                                                                begin,
                                                                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                                                                83,
                                                                                                                Short.MAX_VALUE)))
                                                                        .addPreferredGap(
                                                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                                        .addGroup(
                                                                                jPanel3Layout
                                                                                        .createParallelGroup(
                                                                                                javax.swing.GroupLayout.Alignment.LEADING)
                                                                                        .addComponent(
                                                                                                binaryTransaction,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                                203,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                                                        .addComponent(
                                                                                                txnMessage,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                                203,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                                                        .addComponent(
                                                                                                txnDestination,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                                203,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                                                        .addComponent(
                                                                                                transaction,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                                203,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                                                        .addGroup(
                                                                                                jPanel3Layout
                                                                                                        .createSequentialGroup()
                                                                                                        .addComponent(
                                                                                                                txnSend,
                                                                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                                                                73,
                                                                                                                Short.MAX_VALUE)
                                                                                                        .addPreferredGap(
                                                                                                                javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                                                                                        .addComponent(
                                                                                                                commit,
                                                                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                                                                73,
                                                                                                                Short.MAX_VALUE)
                                                                                                        .addPreferredGap(
                                                                                                                javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                                                                                        .addComponent(
                                                                                                                abort,
                                                                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                                                                73,
                                                                                                                Short.MAX_VALUE)
                                                                                                        .addGap(
                                                                                                                6,
                                                                                                                6,
                                                                                                                6)))
                                                                        .addGap(
                                                                                14,
                                                                                14,
                                                                                14)))
                                        .addContainerGap()));
        jPanel3Layout
                .setVerticalGroup(jPanel3Layout
                        .createParallelGroup(
                                javax.swing.GroupLayout.Alignment.LEADING)
                        .addGroup(
                                jPanel3Layout
                                        .createSequentialGroup()
                                        .addContainerGap()
                                        .addComponent(
                                                jLabel9,
                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                61,
                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(18, 18, 18)
                                        .addGroup(
                                                jPanel3Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(
                                                                transaction,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(
                                                                jLabel8))
                                        .addPreferredGap(
                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addGroup(
                                                jPanel3Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(
                                                                jLabel10)
                                                        .addComponent(
                                                                txnDestination,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE))
                                        .addPreferredGap(
                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addGroup(
                                                jPanel3Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(
                                                                txnMessage,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(
                                                                jLabel11))
                                        .addPreferredGap(
                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addGroup(
                                                jPanel3Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(
                                                                binaryTransaction,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(
                                                                jLabel15))
                                        .addGap(18, 18, 18)
                                        .addGroup(
                                                jPanel3Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(
                                                                begin,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(
                                                                txnSend,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                Short.MAX_VALUE)
                                                        .addComponent(
                                                                commit,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                Short.MAX_VALUE)
                                                        .addComponent(
                                                                abort,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                Short.MAX_VALUE))
                                        .addContainerGap()));

        jPanel2.setBorder(javax.swing.BorderFactory.createTitledBorder(""));

        jLabel3.setText("Destination");
        jLabel3.setToolTipText("");

        destination.setHorizontalAlignment(javax.swing.JTextField.LEFT);
        destination.setToolTipText("");
        destination.setName("destination");

        jLabel17.setText("Message Selector");
        jLabel17.setToolTipText("");

        messageSelector.setHorizontalAlignment(javax.swing.JTextField.LEFT);
        messageSelector.setToolTipText("");
        messageSelector.setName("selector");

        subscribe.setText("Subscribe");
        subscribe.setToolTipText("");
        subscribe.setName("connect");

        send.setText("Send");
        send.setToolTipText("");
        send.setName("disconnect");

        jLabel12.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        jLabel12.setIcon((imageLocation != null) ? new ImageIcon(imageLocation) : null);
        jLabel12.setText("<html>Subscribe, send messages, and unsubscribe to a particular destination.</html>");
        jLabel12.setFocusable(false);

        jLabel13.setText("Message");
        jLabel13.setToolTipText("");

        message.setToolTipText("");
        message.setName("message");

        unsubscribe.setText("Unsubscribe");
        unsubscribe.setToolTipText("");
        unsubscribe.setName("disconnect");

        jLabel14.setText("Send As Binary");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(
                jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout
                .setHorizontalGroup(jPanel2Layout
                        .createParallelGroup(
                                javax.swing.GroupLayout.Alignment.LEADING)
                        .addGroup(
                                jPanel2Layout
                                        .createSequentialGroup()
                                        .addContainerGap()
                                        .addGroup(
                                                jPanel2Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.LEADING)
                                                        .addGroup(
                                                                jPanel2Layout
                                                                        .createSequentialGroup()
                                                                        .addGap(
                                                                                12,
                                                                                12,
                                                                                12)
                                                                        .addGroup(
                                                                                jPanel2Layout
                                                                                        .createParallelGroup(
                                                                                                javax.swing.GroupLayout.Alignment.TRAILING)
                                                                                        .addComponent(
                                                                                                jLabel3)
                                                                                        .addComponent(
                                                                                                jLabel17)
                                                                                        .addGroup(
                                                                                                jPanel2Layout
                                                                                                        .createSequentialGroup()
                                                                                                        .addComponent(
                                                                                                                jLabel13))
                                                                                        .addGroup(
                                                                                                jPanel2Layout
                                                                                                        .createSequentialGroup()
                                                                                                        .addComponent(
                                                                                                                jLabel14)))
                                                                        .addPreferredGap(
                                                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                                        .addGroup(
                                                                                jPanel2Layout
                                                                                        .createParallelGroup(
                                                                                                javax.swing.GroupLayout.Alignment.LEADING)
                                                                                        .addComponent(
                                                                                                binary,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                                203,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                                                        .addComponent(
                                                                                                message,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                                203,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                                                        .addComponent(
                                                                                                destination,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                                203,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                                                        .addComponent(
                                                                                                messageSelector,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                                203,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                                                        ))
                                                                                        .addComponent(
                                                                jLabel12,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                436,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGroup(
                                jPanel2Layout.createSequentialGroup()
                                        .addGap(59, 59, 59).addComponent(
                                                subscribe).addGap(18, 18,
                                                18).addComponent(send)
                                        .addGap(18, 18, 18).addComponent(
                                                unsubscribe)));
        jPanel2Layout
                .setVerticalGroup(jPanel2Layout
                        .createParallelGroup(
                                javax.swing.GroupLayout.Alignment.LEADING)
                        .addGroup(
                                javax.swing.GroupLayout.Alignment.TRAILING,
                                jPanel2Layout
                                        .createSequentialGroup()
                                        .addComponent(
                                                jLabel12,
                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                65,
                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(
                                                javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                        .addGroup(
                                                jPanel2Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(
                                                                destination,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(
                                                                jLabel3))
                                        .addPreferredGap(
                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addGroup(
                                                jPanel2Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(
                                                                messageSelector,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addComponent(
                                                                jLabel17))
                                        .addPreferredGap(
                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addGroup(
                                                jPanel2Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        )
                                        .addPreferredGap(
                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addGroup(
                                                jPanel2Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(
                                                                jLabel13)
                                                        .addComponent(
                                                                message,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE))
                                        .addPreferredGap(
                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addGroup(
                                                jPanel2Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(
                                                                jLabel14)
                                                        .addComponent(
                                                                binary,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE))
                                        .addGap(18, 18, 18)
                                        .addGroup(
                                                jPanel2Layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.BASELINE)
                                                        .addComponent(
                                                                subscribe)
                                                        .addComponent(send)
                                                        .addComponent(
                                                                unsubscribe))
                                        .addContainerGap(17,
                                                Short.MAX_VALUE)));

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(this);
        this.setLayout(layout);
        layout
                .setHorizontalGroup(layout
                        .createParallelGroup(
                                javax.swing.GroupLayout.Alignment.LEADING)
                        .addGroup(
                                layout
                                        .createSequentialGroup()
                                        .addContainerGap()
                                        .addGroup(
                                                layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.LEADING)
                                                        .addComponent(
                                                                jLabel2,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                714,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addGroup(
                                                                layout
                                                                        .createSequentialGroup()
                                                                        .addGroup(
                                                                                layout
                                                                                        .createParallelGroup(
                                                                                                javax.swing.GroupLayout.Alignment.LEADING,
                                                                                                false)
                                                                                        .addComponent(
                                                                                                jPanel1,
                                                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                                                Short.MAX_VALUE)
                                                                                        .addComponent(
                                                                                                jPanel3,
                                                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                                                Short.MAX_VALUE))
                                                                        .addPreferredGap(
                                                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                                        .addGroup(
                                                                                layout
                                                                                        .createParallelGroup(
                                                                                                javax.swing.GroupLayout.Alignment.LEADING)
                                                                                        .addComponent(
                                                                                                jPanel2,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                                                        .addGroup(
                                                                                                layout
                                                                                                        .createSequentialGroup()
                                                                                                        .addComponent(
                                                                                                                jLabel5,
                                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                                                293,
                                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                                                                        .addGap(
                                                                                                                32,
                                                                                                                32,
                                                                                                                32)
                                                                                                        .addComponent(
                                                                                                                clear))
                                                                                        .addComponent(
                                                                                                logList,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                                433,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE))))
                                        .addGap(21, 21, 21)));
        layout
                .setVerticalGroup(layout
                        .createParallelGroup(
                                javax.swing.GroupLayout.Alignment.LEADING)
                        .addGroup(
                                layout
                                        .createSequentialGroup()
                                        .addComponent(
                                                jLabel2,
                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                44,
                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(17, 17, 17)
                                        .addGroup(
                                                layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.LEADING,
                                                                false)
                                                        .addComponent(
                                                                jPanel2,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                Short.MAX_VALUE)
                                                        .addComponent(
                                                                jPanel1,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                Short.MAX_VALUE))
                                        .addGap(12, 12, 12)
                                        .addGroup(
                                                layout
                                                        .createParallelGroup(
                                                                javax.swing.GroupLayout.Alignment.LEADING)
                                                        .addComponent(
                                                                jPanel3,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                javax.swing.GroupLayout.DEFAULT_SIZE,
                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                        .addGroup(
                                                                layout
                                                                        .createSequentialGroup()
                                                                        .addGroup(
                                                                                layout
                                                                                        .createParallelGroup(
                                                                                                javax.swing.GroupLayout.Alignment.LEADING)
                                                                                        .addComponent(
                                                                                                jLabel5,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                                43,
                                                                                                javax.swing.GroupLayout.PREFERRED_SIZE)
                                                                                        .addComponent(
                                                                                                clear))
                                                                        .addPreferredGap(
                                                                                javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                                                        .addComponent(
                                                                                logList,
                                                                                javax.swing.GroupLayout.PREFERRED_SIZE,
                                                                                172,
                                                                                javax.swing.GroupLayout.PREFERRED_SIZE)))
                                        .addContainerGap(15,
                                                Short.MAX_VALUE)));
    }// </editor-fold>

    private void logListPropertyChange(java.beans.PropertyChangeEvent evt) {
    }

    // Variables declaration - do not modify
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel12;
    private javax.swing.JLabel jLabel13;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel17;

    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JLabel jLabel14;
    private javax.swing.JLabel jLabel15;
    // End of variables declaration

}