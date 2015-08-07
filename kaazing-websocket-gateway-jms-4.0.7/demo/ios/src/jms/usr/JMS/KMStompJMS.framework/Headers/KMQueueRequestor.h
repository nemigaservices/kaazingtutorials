/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMQueue.h"
#import "KMQueueSession.h"
#import "KMTemporaryQueue.h"
#import "KMQueueSender.h"
#import "KMQueueReceiver.h"
#import "KMMessage.h"

#if NOT_IMPLEMENTED

/**
 * The QueueRequestor helper class simplifies
 * making service requests.
 *
 * _*KMQueueRequestor is a JMS 1.0 API. KMMessageConsumer or KMTopicSubscriber should be used instead.*_
 *
 * The QueueRequestor constructor is given a non-transacted 
 * KMQueueSession and a destination KMQueue. It creates a
 * KMTemporaryQueue for the responses and provides a 
 * request method that sends the request message and waits 
 * for its reply.
 *
 * This is a basic request/reply abstraction that should be sufficient 
 * for most uses. JMS providers and clients are free to create more 
 * sophisticated versions.
 *
 * @see KMTopicRequestor 
 */
@interface KMQueueRequestor : KCObject

/**
 * Associated Session
 */
- (KMQueueSession *) session;

/**
 * Associated Queue
 */
- (KMQueue *) queue;

/**
 * Associated Temporary Queue
 */
- (KMTemporaryQueue *) tempQueue;

/**
 * Associated sender
 */
- (KMQueueSender *) sender;

/**
 * Associated receiver
 */
- (KMQueueReceiver *) receiver;

/**
 * Init using a session and queue.  This implementation assumes the session
 * parameter to be non-transacted,with a delivery mode of either AUTO_ACKNOWLEDGE or 
 * DUPS_OK_ACKNOWLEDGE.
 *
 * @param session the KMQueueSession the queue belongs to
 * @param queue the queue to perform the request/reply call on
 *  
 * @exception KMJMSException if the JMS provider fails to create the
 *                         QueueRequestor due to some internal
 *                         error.
 * @exception KMInvalidDestinationException if an invalid queue is specified.
 */
- (KMQueueRequestor *) initWithSession:(KMQueueSession *)session queue:(KMQueue *)queue;

/**
 * Sends a request and waits for a reply. The temporary queue is used for
 * the JMSReplyTo destination, and only one reply per request 
 * is expected.
 *  
 * @param message the message to send
 *  
 * @return the reply message
 *  
 * @exception KMJMSException if the JMS provider fails to complete the
 *                         request due to some internal error.
 */
- (KMMessage *) request:(KMMessage *)message;

/**
 * Closes the QueueRequestor and its session.
 *
 * Since a provider may allocate some resources on behalf of a 
 * QueueRequestor, clients 
 * should close them when they 
 * are not needed. Relying on garbage collection to eventually reclaim 
 * these resources may not be timely enough.
 *  
 * Note that this method closes the KMQueueSession object 
 * passed to the QueueRequestor constructor.
 *
 * @exception KMJMSException if the JMS provider fails to close the
 *                         QueueRequestor due to some internal
 *                         error.
 */
- (void) close;

@end

#endif
