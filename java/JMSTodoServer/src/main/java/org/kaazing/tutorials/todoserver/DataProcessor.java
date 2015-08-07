package org.kaazing.tutorials.todoserver;

import java.io.IOException;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class DataProcessor {
	private final static String SND_Topic="testWSTodoSnd";
	private final static String RCV_Topic="testWSTodoRcv";
	
	@Autowired
	private JmsTemplate jmsTemplate;
    /**
     * Get a copy of the application context
     */
    @Autowired
    ConfigurableApplicationContext context;

    private ObjectMapper mapper = new ObjectMapper();
    /**
     * When you receive a message, print it out, then shut down the application.
     * Finally, clean up any ActiveMQ server stuff.
     */
    @JmsListener(destination = SND_Topic, containerFactory = "myJmsContainerFactory")
    public void receiveMessage(final String message) {
    	System.out.println("Received a new message: "+message);
    	
    	// TODO: Add any database update code here! 
    	
        // Send a message
        MessageCreator messageCreator = new MessageCreator() {
            @Override
            public Message createMessage(Session session) throws JMSException {
            	try {
					KaazingTestMessageData rcvdValue = mapper.readValue(message, KaazingTestMessageData.class);
	            	TextMessage textMessage = session.createTextMessage(message);
	            	textMessage.setStringProperty("appId", rcvdValue.getFrom());
	                return textMessage;

				} catch (IOException e) {
					throw new JMSException(e.getMessage());
				}
            }
        };
                
        jmsTemplate.send(RCV_Topic, messageCreator);
        System.out.println("Sending a new message.");
    }
}