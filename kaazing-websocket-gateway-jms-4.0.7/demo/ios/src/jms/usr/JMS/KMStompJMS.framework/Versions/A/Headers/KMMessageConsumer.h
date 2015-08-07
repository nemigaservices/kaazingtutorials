/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMMessageListener.h"
#import "KMMessage.h"

/**
 * A client uses a MessageConsumer object to receive messages 
 * from a destination.  A MessageConsumer object is created by 
 * passing a Destination object to a message-consumer creation
 * method supplied by a session.
 *
 * MessageConsumer is the parent interface for all message 
 * consumers.
 *
 * A message consumer can be created with a message selector. A message
 * selector allows 
 * the client to restrict the messages delivered to the message consumer to 
 * those that match the selector.
 *
 * A client may either synchronously receive a message consumer's messages 
 * or have the consumer asynchronously deliver them as they arrive.
 *
 * For synchronous receipt, a client can request the next message from a 
 * message consumer using one of its receive methods. There are 
 * several variations of receive that allow a 
 * client to poll or wait for the next message.
 *
 * For asynchronous delivery, a client can register a 
 * MessageListener object with a message consumer. 
 * As messages arrive at the message consumer, it delivers them by calling the 
 * MessageListener's onMessage method.
 *
 * It is a client programming error for a MessageListener to 
 * throw an exception.
 *
 *
 * @see KMQueueReceiver
 * @see KMTopicSubscriber
 * @see KMSession
 */
@interface KMMessageConsumer : KCObject

/**
 * Gets this message consumer's message selector expression.
 *  
 * @return this message consumer's message selector, or null if no
 *         message selector exists for the message consumer (that is, if 
 *         the message selector was not set or was set to null or the 
 *         empty string)
 *  
 * @exception KMJMSException if the JMS provider fails to get the message
 *                         selector due to some internal error.
 */
- (NSString *) messageSelector;

/**
 * Gets the message consumer's MessageListener.
 *  
 * @return the listener for the message consumer, or null if no listener
 * is set
 *  
 * @exception KMJMSException if the JMS provider fails to get the message
 *                         listener due to some internal error.
 * @see setMessageListener:
 */
- (id <KMMessageListener>) messageListener;

/**
 * Sets the message consumer's MessageListener.
 * 
 * Setting the message listener to null is the equivalent of 
 * unsetting the message listener for the message consumer.
 *
 * The effect of calling MessageConsumer.setMessageListener
 * while messages are being consumed by an existing listener
 * or the consumer is being used to consume messages synchronously
 * is undefined.
 *  
 * @param listener the listener to which the messages are to be 
 *                 delivered
 *  
 * @exception KMJMSException if the JMS provider fails to set the message
 *                         listener due to some internal error.
 * @see messageListener
 */
- (void) setMessageListener:(id <KMMessageListener>)listener;

/**
 * Receives the next message produced for this message consumer.
 *  
 * This call blocks indefinitely until a message is produced
 * or until this message consumer is closed.
 *
 * If this receive is done within a transaction, the 
 * consumer retains the message until the transaction commits.
 *  
 * @return the next message produced for this message consumer, or 
 * null if this message consumer is concurrently closed
 *  
 * @exception KMJMSException if the JMS provider fails to receive the next
 *                         message due to some internal error.
 */
- (KMMessage *) receive;

/**
 * Receives the next message that arrives within the specified
 * timeout interval.
 *  
 * This call blocks until a message arrives, the
 * timeout expires, or this message consumer is closed.
 * A timeout of zero never expires, and the call blocks 
 * indefinitely.
 *
 * @param timeout the timeout value (in milliseconds)
 *
 * @return the next message produced for this message consumer, or 
 * null if the timeout expires or this message consumer is concurrently 
 * closed
 *
 * @exception KMJMSException if the JMS provider fails to receive the next
 *                         message due to some internal error.
 */
- (KMMessage *) receive:(long long)timeout;

/**
 * Receives the next message if one is immediately available.
 *
 * @return the next message produced for this message consumer, or 
 * null if one is not available
 *  
 *
 * @return the next message produced for this message consumer, or 
 * null if one is not available
 *  
 * @exception KMJMSException if the JMS provider fails to receive the next
 *                         message due to some internal error.
 */
- (KMMessage *) receiveNoWait;

/**
 * Closes the message consumer.
 *
 * Since a provider may allocate some resources on behalf of a
 * MessageConsumer outside the Java virtual machine, clients 
 * should close them when they
 * are not needed. Relying on garbage collection to eventually reclaim
 * these resources may not be timely enough.
 *
 * This call blocks until a receive or message listener in 
 * progress has completed. A blocked receive call
 * returns nil when this message consumer is closed.
 *  
 * @exception KMJMSException if the JMS provider fails to close the consumer
 *                         due to some internal error.
 */
- (void) close;

@end
