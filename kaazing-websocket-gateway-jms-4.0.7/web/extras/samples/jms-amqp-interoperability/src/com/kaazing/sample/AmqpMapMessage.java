/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

package com.kaazing.sample;

import java.util.Map;

public class AmqpMapMessage {
    
    static final String MESSAGE_TYPE_IDENTIFIER = "com.rabbitmq.jms.client.message.RMQMapMessage";
    
    private Map<String, Object> messageData;
    private Map<String, Object> messageProperties;
    
    public AmqpMapMessage(Map<String, Object> messageData) {
        this(messageData, null);
    }
    
    public AmqpMapMessage(Map<String, Object> messageData, Map<String, Object> messageProperties) {
        this.messageData = messageData;
        this.messageProperties = messageProperties;
    }
    
    public void setMessageData(Map<String, Object> messageData) {
        this.messageData = messageData;
    }
    
    public void setMessageProperties(Map<String, Object> messageProperties) {
        this.messageProperties = messageProperties;
    }
    
    public Map<String, Object> getMessageProperties() {
        return this.messageProperties;
    }
    
    public Map<String, Object> getMessageData() {
        return this.messageData;
    }

}
