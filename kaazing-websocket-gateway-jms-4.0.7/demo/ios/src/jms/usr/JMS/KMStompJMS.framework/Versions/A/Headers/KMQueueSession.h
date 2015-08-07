/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMSession.h"
#import "KMQueue.h"
#import "KMQueueReceiver.h"
#import "KMQueueSender.h"

#if NOT_IMPLEMENTED

/**
 * A QueueSession object provides methods for creating 
 * QueueReceiver, QueueSender, 
 * QueueBrowser, and TemporaryQueue objects.
 *
 * _*KMQueueSession is a JMS 1.0 API. KMSession should be used instead.*_
 *
 * If there are messages that have been received but not acknowledged 
 * when a QueueSession terminates, these messages will be retained 
 * and redelivered when a consumer next accesses the queue.
 *
 * A QueueSession is used for creating Point-to-Point specific
 * objects. In general, use the KMSession object. 
 * Using the KMSession object simplifies the 
 * programming model, and allows transactions to be used across the two 
 * messaging domains.
 * 
 * A QueueSession cannot be used to create objects specific to the 
 * publish/subscribe domain. The following methods inherit from 
 * Session, but must throw a KMIllegalStateException 
 * if they are used from QueueSession:
 *
 *   - createDurableSubscriber
 *   - createTemporaryTopic
 *   - createTopic
 *   - unsubscribe
 *
 * @see KMSession
 */
@interface KMQueueSession : KMSession

/**
 * Creates a queue identity given a Queue name.
 *
 * This facility is provided for the rare cases where clients need to
 * dynamically manipulate queue identity. It allows the creation of a
 * queue identity with a provider-specific name. Clients that depend 
 * on this ability are not portable.
 *
 * Note that this method is not for creating the physical queue. 
 * The physical creation of queues is an administrative task and is not
 * to be initiated by the JMS API. The one exception is the
 * creation of temporary queues, which is accomplished with the 
 * createTemporaryQueue method.
 *
 * @param queueName the name of this Queue
 *
 * @return a Queue with the given name
 *
 * @exception KMJMSException if the session fails to create a queue
 *                         due to some internal error.
 */
- (KMQueue *) createQueue:(NSString*)queueName;

/**
 * Creates a QueueReceiver object to receive messages from the
 * specified queue.
 *
 * @param queue the Queue to access
 *
 * @exception KMJMSException if the session fails to create a receiver
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid queue is specified.
 */
- (KMQueueReceiver *) createReceiver:(KMQueue *)queue;

/**
 * Creates a QueueReceiver object to receive messages from the 
 * specified queue using a message selector.
 *  
 * @param queue the Queue to access
 * @param messageSelector only messages with properties matching the
 * message selector expression are delivered. A value of null or
 * an empty string indicates that there is no message selector 
 * for the message consumer.
 *  
 * @exception KMJMSException if the session fails to create a receiver
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid queue is specified.
 * @exception KMInvalidSelectorException if the message selector is invalid.
 *
 */
- (KMQueueReceiver *) createReceiver:(KMQueue *)queue
                     messageSelector:(NSString *)messageSelector;

/**
 * Creates a QueueSender object to send messages to the 
 * specified queue.
 *
 * @param queue the Queue to access, or null if this is an 
 * unidentified producer
 *
 * @exception KMJMSException if the session fails to create a sender
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid queue is specified.
 */
- (KMQueueSender *) createSender:(KMQueue *)queue;

/**
 * Creates a QueueBrowser object to peek at the messages on 
 * the specified queue.
 *
 * @param queue the Queue to access
 *
 * @exception KMJMSException if the session fails to create a browser
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid queue is specified.
 */
- (KMQueueBrowser *) createBrowser:(KMQueue *)queue;

/**
 * Creates a QueueBrowser object to peek at the messages on 
 * the specified queue using a message selector.
 *  
 * @param queue the Queue to access
 * @param messageSelector only messages with properties matching the
 * message selector expression are delivered. A value of null or
 * an empty string indicates that there is no message selector 
 * for the message consumer.
 *  
 * @exception KMJMSException if the session fails to create a browser
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid queue is specified.
 * @exception KMInvalidSelectorException if the message selector is invalid.
 */
- (KMQueueBrowser *) createBrowser:(KMQueue *)queue
                    messageSelector:(NSString *)messageSelector;

/**
 * Creates a TemporaryQueue object. Its lifetime will be that 
 * of the QueueConnection unless it is deleted earlier.
 *
 * @return a temporary queue identity
 *
 * @exception KMJMSException if the session fails to create a temporary queue
 *                         due to some internal error.
 */
- (KMTemporaryQueue *) createTemporaryQueue;

@end

#endif
