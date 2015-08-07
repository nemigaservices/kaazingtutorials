/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMTopicSession.h"
#import "KMMessage.h"

#if NOT_IMPLEMENTED

/**
 * The TopicRequestor helper class simplifies
 * making service requests.
 *
 * _*KMTopicRequestor is a JMS 1.0 API. KMMessageConsumer or KMTopicSubscriber should be used instead.*_
 *
 * The TopicRequestor constructor is given a non-transacted 
 * KMTopicSession and a destination KMTopic. It creates a 
 * KMTemporaryTopic for the responses and provides a 
 * request method that sends the request message and waits 
 * for its reply.
 *
 * This is a basic request/reply abstraction that should be sufficient 
 * for most uses. JMS providers and clients are free to create more 
 * sophisticated versions.
 *
 * @see KMQueueRequestor 
 */
@interface KMTopicRequestor : KCObject

/**
 * Constructor for the TopicRequestor class.
 * 
 * _KMMessageConsumer or KMTopicSubscriber should be used instead._
 *
 * This implementation assumes the session parameter to be non-transacted,
 * with a delivery mode of either AUTO_ACKNOWLEDGE or 
 * DUPS_OK_ACKNOWLEDGE.
 *
 * @param session the KMTopicSession the topic belongs to
 * @param topic the topic to perform the request/reply call on
 *
 * @exception KMJMSException if the JMS provider fails to create the
 *                         TopicRequestor due to some internal
 *                         error.
 * @exception KMInvalidDestinationException if an invalid topic is specified.
 */
- (KMTopicRequestor *) initWithSession:(KMTopicSession *)session topic:(KMTopic *)topic;

/**
 * Sends a request and waits for a reply. The temporary topic is used for
 * the JMSReplyTo destination; the first reply is returned, 
 * and any following replies are discarded.
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
 * Closes the TopicRequestor and its session.
 *
 * Since a provider may allocate some resources on behalf of a 
 * TopicRequestor, clients 
 * should close them when they 
 * are not needed. Relying on garbage collection to eventually reclaim 
 * these resources may not be timely enough.
 *
 * Note that this method closes the KMTopicSession object 
 * passed to the TopicRequestor constructor.
 *  
 * @exception KMJMSException if the JMS provider fails to close the
 *                         TopicRequestor due to some internal
 *                         error.
 */
- (void) close;

@end

#endif

