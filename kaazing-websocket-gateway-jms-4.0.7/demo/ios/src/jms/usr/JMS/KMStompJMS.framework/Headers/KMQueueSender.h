/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMMessageProducer.h"
#import "KMQueue.h"

#if NOT_IMPLEMENTED

/**
 * A client uses a QueueSender object to send messages to a queue.
 * 
 * _*KMQueueSender is a JMS 1.0 API. KMMessageProducer should be used instead.*_
 *
 * Normally, the Queue is specified when a 
 * QueueSender is created.  In this case, an attempt to use
 * the send methods for an unidentified 
 * QueueSender will throw a 
 * KMUnsupportedOperationException.
 * 
 * If the QueueSender is created with an unidentified 
 * Queue, an attempt to use the send methods that 
 * assume that the Queue has been identified will throw a
 * KMUnsupportedOperationException.
 *
 * During the execution of its send method, a message 
 * must not be changed by other threads within the client. 
 * If the message is modified, the result of the send is 
 * undefined.
 * 
 * After sending a message, a client may retain and modify it
 * without affecting the message that has been sent. The same message
 * object may be sent multiple times.
 * 
 * The following message headers are set as part of sending a 
 * message: JMSDestination, JMSDeliveryMode, 
 * JMSExpiration, JMSPriority, 
 * JMSMessageID and JMSTimeStamp.
 * When the message is sent, the values of these headers are ignored. 
 * After the completion of the send, the headers hold the values 
 * specified by the method sending the message. It is possible for the 
 * send method not to set JMSMessageID and 
 * JMSTimeStamp if the 
 * setting of these headers is explicitly disabled by the 
 * MessageProducer.setDisableMessageID or
 * MessageProducer.setDisableMessageTimestamp method.
 *
 * Creating a MessageProducer provides the same features as
 * creating a QueueSender. A MessageProducer object is 
 * recommended when creating new code.
 *
 * @see KMMessageProducer
 * @see [KMSession createProducer:]
 */
@interface KMQueueSender : KMMessageProducer

/**
 * Gets the queue associated with this QueueSender.
 *  
 * @return this sender's queue 
 *  
 * @exception KMJMSException if the JMS provider fails to get the queue for
 *                         this QueueSender
 *                         due to some internal error.
 */
- (KMQueue *) queue;

/**
 * Sends a message to the queue. Uses the QueueSender's 
 * default delivery mode, priority, and time to live.
 *
 * @param message the message to send 
 *  
 * @exception KMJMSException if the JMS provider fails to send the message 
 *                         due to some internal error.
 * @exception KMMessageFormatException if an invalid message is specified.
 * @exception KMInvalidDestinationException if a client uses
 *                         this method with a QueueSender with
 *                         an invalid queue.
 * 
 * @see [KMMessageProducer deliveryMode]
 * @see [KMMessageProducer timeToLive]
 * @see [KMMessageProducer priority]
 */
- (void) send:(KMMessage *)message;

/**
 * Sends a message to the queue, specifying delivery mode, priority, and 
 * time to live.
 *
 * @param message the message to send
 * @param deliveryMode the delivery mode to use
 * @param priority the priority for this message
 * @param timeToLive the message's lifetime (in milliseconds)
 *  
 * @exception KMJMSException if the JMS provider fails to send the message 
 *                         due to some internal error.
 * @exception KMMessageFormatException if an invalid message is specified.
 * @exception KMInvalidDestinationException if a client uses
 *                         this method with a QueueSender with
 *                         an invalid queue.
 */
- (void) send:(KMMessage *)message
 deliveryMode:(int)deliveryMode
     priority:(int)priority
   timeToLive:(long long)timeToLive;

/**
 * Sends a message to a queue for an unidentified message producer.
 * Uses the QueueSender's default delivery mode, priority,
 * and time to live.
 *
 * Typically, a message producer is assigned a queue at creation 
 * time; however, the JMS API also supports unidentified message producers,
 * which require that the queue be supplied every time a message is
 * sent.
 *  
 * @param queue the queue to send this message to
 * @param message the message to send
 *  
 * @exception KMJMSException if the JMS provider fails to send the message 
 *                         due to some internal error.
 * @exception KMMessageFormatException if an invalid message is specified.
 * @exception KMInvalidDestinationException if a client uses
 *                         this method with an invalid queue.
 * 
 * @see [KMMessageProducer deliveryMode]
 * @see [KMMessageProducer timeToLive]
 * @see [KMMessageProducer priority]
 */
- (void) send:(KMQueue *)queue message:(KMMessage *)message;

/**
 * Sends a message to a queue for an unidentified message producer, 
 * specifying delivery mode, priority and time to live.
 *  
 * Typically, a message producer is assigned a queue at creation 
 * time; however, the JMS API also supports unidentified message producers,
 * which require that the queue be supplied every time a message is
 * sent.
 *  
 * @param queue the queue to send this message to
 * @param message the message to send
 * @param deliveryMode the delivery mode to use
 * @param priority the priority for this message
 * @param timeToLive the message's lifetime (in milliseconds)
 *  
 * @exception KMJMSException if the JMS provider fails to send the message 
 *                         due to some internal error.
 * @exception KMMessageFormatException if an invalid message is specified.
 * @exception KMInvalidDestinationException if a client uses
 *                         this method with an invalid queue.
 */
- (void) send:(KMQueue *)queue
      message:(KMMessage *)message
 deliveryMode:(int)deliveryMode
     priority:(int)priority
   timeToLive:(long long)timeToLive;

@end

#endif
