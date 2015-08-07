/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

package com.kaazing.sample;

import java.io.ByteArrayOutputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

// A sample application that uses AMQP client to send an AMQP message to the 
// rabbitmq server that will be manifasted as JMS Map Message in our JMS Gateway 
// connected to that rabbitmq server
// Use Case: Send an AMQP message that will be received as a Map Message on a topic 'destination' in JMS Gateway
public class AmqpJmsMessageProducerApp {
    
    public static void main(String[] args) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setUsername("guest");
        factory.setPassword("guest");
        factory.setVirtualHost("/");
        factory.setHost("localhost");
        factory.setPort(5672);
        Connection connection = factory.newConnection();
        
        // Send map message to topic - 'destination'
        // exchange name: jms.durable.topic for topic. 
        //                If queue is used, exchange name should be 'jms.durable.queues'
        // routing key: 'destination'
        // exchange type: topic
        //                If queue is used, exchange type should be 'direct'
        String topicName = "destination";
        String exchangeName = "jms.durable.topic";
        String exchangeType = "topic";
        
        // build map message data: name-value pairs
        HashMap<String, Object> mapMessageData = new HashMap<String, Object>();
        mapMessageData.put("string_map_item", "string_value");
        mapMessageData.put("interger_map_item", Integer.valueOf(200));
        
        // build message properteis: name-value pairs
        HashMap<String, Object> messageProperties = new HashMap<String, Object>();
        messageProperties.put("string_property", "string property value");
        messageProperties.put("integer_property", Integer.valueOf(200));
        
        AmqpMapMessage mapMessage = new AmqpMapMessage(mapMessageData, messageProperties);
        
        Channel channel = connection.createChannel();
        channel.exchangeDeclare(exchangeName, exchangeType, true, false, false, null);
        
        sendMapMessage(channel, exchangeName, topicName, mapMessage);
        
        connection.close();
        
    }
    
    private static void sendMapMessage(Channel channel, String exchangeName, String topicName, AmqpMapMessage mapMessage) throws Exception {
        sendMapMessage(channel, exchangeName, topicName, mapMessage, 1, 4, 0L);
    }
    
    private static void sendMapMessage(Channel channel, String exchangeName, String topicName, AmqpMapMessage mapMessage, int deliveryMode, int priority, long timeToLive) throws Exception {
        
        // ensure that delivery mode is either 1 or 2
        if (deliveryMode != 2) {
            deliveryMode = 1;
        }
        
        long currentTime = System.currentTimeMillis();
        long expiration = (timeToLive == 0L) ? 0L : currentTime + timeToLive;
        
        // Generate JMS message id
        // JMS message id is the internal message id prefixed with "ID:"
        String internalId = UUID.randomUUID().toString();
        String jmsMessageId = "ID:" + internalId;
        
        // build AMQP properties
        AMQP.BasicProperties.Builder amqpPropertiesBuilder = new AMQP.BasicProperties.Builder();
        amqpPropertiesBuilder.contentType("application/octet-stream");
        amqpPropertiesBuilder.deliveryMode(Integer.valueOf(deliveryMode));
        amqpPropertiesBuilder.priority(Integer.valueOf(priority));
        amqpPropertiesBuilder.expiration(amqpExpiration(timeToLive));
        
        // headers table
        Map<String, Object> headersTable = new HashMap<String, Object>();
        if (mapMessage.getMessageProperties() != null) {
            for (Entry<String, Object> headerEntry : mapMessage.getMessageProperties().entrySet()) {
                putIfNotNull(headersTable, headerEntry.getKey(), headerEntry.getValue());
            }
        }
        
        headersTable.put("JMSDeliveryMode", (deliveryMode == 2) ? "PERSISTENT" : "NON_PERSISTENT");
        putIfNotNull(headersTable, "JMSMessageID", jmsMessageId);
        headersTable.put("JMSTimestamp", Long.valueOf(currentTime));
        headersTable.put("JMSPriority", Integer.valueOf(priority));
        
        amqpPropertiesBuilder.headers(headersTable);
        
        // build amqp content body
        ByteArrayOutputStream bout = new ByteArrayOutputStream(512);
        ObjectOutputStream out = new ObjectOutputStream(bout);
        out.writeUTF(AmqpMapMessage.MESSAGE_TYPE_IDENTIFIER);
        out.writeUTF(internalId);
        
        // encode jms message headers to the amqp content body
        // jms message headers are prefixed with rmq.jms..
        
        //encode the size of jms message headers
        out.writeInt(5);
        
        out.writeUTF("rmq.jms.message.expiration");
        writePrimitive(Long.valueOf(expiration), out);
        
        out.writeUTF("rmq.jms.message.timestamp");
        writePrimitive(Long.valueOf(currentTime), out);
        
        out.writeUTF("rmq.jms.message.priority");
        writePrimitive(Integer.valueOf(priority), out);
        
        out.writeUTF("rmq.jms.message.id");
        writePrimitive(jmsMessageId, out);
        
        out.writeUTF("rmq.jms.message.delivery.mode");
        writePrimitive(Integer.valueOf(deliveryMode), out);
        
        // encode jms message propeties if any
        if (mapMessage.getMessageProperties() != null && !mapMessage.getMessageProperties().isEmpty()) {
            out.writeInt(mapMessage.getMessageProperties().size());
            for (Entry<String, Object> messagePropertyEntry : mapMessage.getMessageProperties().entrySet()) {
                out.writeUTF(messagePropertyEntry.getKey());
                writePrimitive(messagePropertyEntry.getValue(), out);
            }
        }
        else {
            out.writeInt(0);
        }
        
        // encode map message data
        if (mapMessage.getMessageData() != null && !mapMessage.getMessageData().isEmpty()) {
            out.writeInt(mapMessage.getMessageData().size());
            for (Entry<String, Object> mapDataEntry : mapMessage.getMessageData().entrySet()) {
                out.writeUTF(mapDataEntry.getKey());
                writePrimitive(mapDataEntry.getValue(), out);
            }
        }
        else {
            out.writeInt(0);
        }
        
        out.flush();
        byte[] amqpContentBody = bout.toByteArray();
        
        channel.basicPublish(exchangeName, topicName, amqpPropertiesBuilder.build(), amqpContentBody);
    }
    
    // Encode the primitive type object
    // 1. Encode the type identifier as byte
    // 2. For fixed length type, encode the value
    // 3. For Variable length type (byte array or String), encode the length followed by the data
    private static void writePrimitive(Object obj, ObjectOutput out) throws Exception {
        if (obj == null) {
            out.writeByte(-1);
        } else if (obj instanceof Boolean) {
            out.writeByte(1);
            out.writeBoolean(((Boolean) obj).booleanValue());
        } else if (obj instanceof Byte) {
            out.writeByte(2);
            out.writeByte(((Byte) obj).byteValue());
        } else if (obj instanceof Short) {
            out.writeByte(3);
            out.writeShort(((Short) obj).shortValue());
        } else if (obj instanceof Integer) {
            out.writeByte(4);
            out.writeInt(((Integer) obj).intValue());
        } else if (obj instanceof Long) {
            out.writeByte(5);
            out.writeLong(((Long) obj).longValue());
        } else if (obj instanceof Float) {
            out.writeByte(6);
            out.writeFloat(((Float) obj).floatValue());
        } else if (obj instanceof Double) {
            out.writeByte(7);
            out.writeDouble(((Double) obj).doubleValue());
        } else if (obj instanceof String) {
            out.writeByte(8);
            out.writeUTF((String) obj);
        } else if (obj instanceof Character) {
            out.writeByte(9);
            out.writeChar(((Character) obj).charValue());
        } else if (obj instanceof byte[]) {
            out.writeByte(10);
            out.writeInt(((byte[]) (byte[]) obj).length);
            out.write((byte[]) (byte[]) obj);
        } else {
            throw new IllegalArgumentException("invalid type - " + obj.getClass());
        }
    }
    
    private static void putIfNotNull(Map<String, Object> hdrs, String key, Object val) {
        if (val == null)
            return;
        hdrs.put(key, val);
    }
    
    // expiration field in amqp message properties needs to be 
    // parseable as an integer if it's set at all
    private static final String amqpExpiration(long ttl) {
        if (ttl == 0L)
            return null;
        
        return String.valueOf((ttl > 4294967295L) ? 4294967295L : (ttl < 0L) ? 0L : ttl);
    }
}
