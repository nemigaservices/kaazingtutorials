/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

package com.kaazing.sample;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectInputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;

import com.rabbitmq.client.AMQP.BasicProperties;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Consumer;
import com.rabbitmq.client.Envelope;
import com.rabbitmq.client.ShutdownSignalException;

//A sample application that uses AMQP client to consume JMS message from 
//rabbitmq server.
// The JMS Message send published to the Kaazing JMS Gateway connected to that rabbitmq server

//Use Case: Create consumer using AMQP client that will receive JMS Message on a topic 'destination'
public class AmqpJmsMessageConsumerApp {
    
    public enum MessageKind {
        TEXT,
        BYTES,
        MAP
    }

    public static void main(String[] args) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setUsername("guest");
        factory.setPassword("guest");
        factory.setVirtualHost("/");
        factory.setHost("localhost");
        factory.setPort(5672);
        Connection connection = factory.newConnection();
        
        // Consume message on a topic - 'destination'
        // exchange name: jms.durable.topic
        // routing key: 'destination'
        // exchange type: topic
        String topicName = "destination";
        String exchangeName = "jms.durable.topic";
        String exchangeType = "topic";
        Channel channel = connection.createChannel();
        createConsumer(channel, topicName, exchangeName, exchangeType);
    }
    
    private static void createConsumer(final Channel channel, String destinationName, String exchangeName, String exchangeType) throws Exception {
        String internalQueueName = "jms-cons-" + UUID.randomUUID();
        
        // declare topic
        channel.exchangeDeclare(exchangeName, exchangeType, true, false, false, null);
        
        // declare queue internally for topic using the consumer tag
        channel.queueDeclare(internalQueueName, false, true, false, null);
        
        // bind to the queue
        channel.queueBind(internalQueueName, exchangeName, destinationName);
        
        String consumerTag = "jms-consumer-" + UUID.randomUUID();
        
        /*
        queue - the name of the queue
        autoAck - true if the server should consider messages acknowledged once delivered; false if the server should expect explicit acknowledgements
        consumerTag - a client-generated consumer tag to establish context
        noLocal - true if the server should not deliver to this consumer messages published on this channel's connection
        exclusive - true if this is an exclusive consumer
        arguments - a set of arguments for the consume
        callback - an interface to the consumer object
        */
        channel.basicConsume(internalQueueName, false, consumerTag, false, false, null, new Consumer() {
            
            @Override
            public void handleShutdownSignal(String consumerTag , ShutdownSignalException signal) {
               // TODO: do something
            }
            
            @Override
            public void handleRecoverOk(String consumerTag) {
                // TODO: do something
            }
            
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, BasicProperties properties, byte[] messageBody) throws IOException {
                try {
                    
                    System.out.println("Message Received");
                    
                    // amqp message body is opaque and client-specific byte array
                    // We need to construct JMS Message from the amqp message body
                    ObjectInputStream inputStream = new ObjectInputStream(new ByteArrayInputStream(messageBody));
                    
                    String messageKindIdentifier = inputStream.readUTF();
                    
                    String internalMessageId = inputStream.readUTF();
                    
                    Map<String, Object> jmsMessageHeaders = new HashMap<String, Object>();
                    int jmsMessageHeadersSize = inputStream.readInt();
                    for (int i = 0; i < jmsMessageHeadersSize; i++) {
                        String name = inputStream.readUTF();
                        Object value = readPrimitive(inputStream);
                        jmsMessageHeaders.put(name, value);
                    }
                    
                    Map<String, Object> jmsMessageProperties = new HashMap<String, Object>();
                    int jmsMessagePropertiesSize = inputStream.readInt();
                    for (int i = 0; i < jmsMessagePropertiesSize; i++) {
                        String name = inputStream.readUTF();
                        Object value = readPrimitive(inputStream);
                        jmsMessageProperties.put(name, value);
                    }
                    
                    MessageKind messageKind = getMessageKind(messageKindIdentifier);
                    switch(messageKind) {
                        case TEXT:
                            System.out.println("Text Message Received - " + decodeTextMessageData(inputStream));
                            break;
                        case MAP:
                            System.out.println("Map Message Received");
                            Map<String, Object> mapMessageData = decodeMapMessageData(inputStream);
                            for (Entry<String, Object> mapEntry : mapMessageData.entrySet()) {
                                System.out.println(mapEntry.toString());
                            }
                            break;
                        case BYTES:
                            System.out.println("Bytes Message Received");
                            break;
                    }
                    
                    // acknowledge the message
                    long deliveryTag = envelope.getDeliveryTag();
                    channel.basicAck(deliveryTag, false);
                    
                }catch (Exception exception) {
                    exception.printStackTrace();
                }
            }
            
            @Override
            public void handleConsumeOk(String consumerTag) {
                // TODO: do something
            }
            
            @Override
            public void handleCancelOk(String consumerTag) {
                // TODO: do something
            }
            
            @Override
            public void handleCancel(String consumerTag) throws IOException {
                // TODO: do something
            }
        });
    }
    
    
    public static Object readPrimitive(ObjectInput in) throws Exception {
        byte b = in.readByte();
        switch (b) {
            case -1:
                return null;
            case 1:
                return Boolean.valueOf(in.readBoolean());
            case 2:
                return Byte.valueOf(in.readByte());
            case 3:
                return Short.valueOf(in.readShort());
            case 4:
                return Integer.valueOf(in.readInt());
            case 5:
                return Long.valueOf(in.readLong());
            case 6:
                return Float.valueOf(in.readFloat());
            case 7:
                return Double.valueOf(in.readDouble());
            case 8:
                return in.readUTF();
            case 9:
                return Character.valueOf(in.readChar());
            case 10:
                int length = in.readInt();
                byte[] buf = new byte[length];
                in.read(buf);
                return buf;
            case 127:
                // This requries the object class to be available in the classpath or it will 
                // throw ClassNotFoundException
                return in.readObject();
            default:
                throw new Exception("Invalid type identifier - " + b);
        }
    }
    
    public static MessageKind getMessageKind(String messageKindIdentifier) throws Exception {
        switch (messageKindIdentifier) {
        case "com.rabbitmq.jms.client.message.RMQMapMessage":
            return MessageKind.MAP;
        case "com.rabbitmq.jms.client.message.RMQTextMessage":
            return MessageKind.TEXT;
        case "com.rabbitmq.jms.client.message.RMQBytesMessage":
            return MessageKind.BYTES;
        default:
            throw new Exception("unsupported message - " + messageKindIdentifier);
        }
    }
    
    public static String decodeTextMessageData(ObjectInput inputStream) throws Exception {
        boolean isNull = inputStream.readBoolean();
        if (isNull) {
            return null;
        }
        return inputStream.readUTF();
    }
    
    public static Map<String, Object> decodeMapMessageData(ObjectInput inputStream) throws Exception {
        int mapMessageDataSize = inputStream.readInt();
        Map<String, Object> mapMessageData = new HashMap<String, Object>();
        for (int i = 0; i < mapMessageDataSize; i++) {
            String name = inputStream.readUTF();
            Object value = readPrimitive(inputStream);
            mapMessageData.put(name, value);
        }
        return mapMessageData;
    }
    
    public static byte[] decodeBytesMessageData(ObjectInput inputStream) {
        throw new UnsupportedOperationException();
    }

}
