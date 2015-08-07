/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMConnection.h"

#if NOT_IMPLEMENTED

/**
 * A TopicConnection object is an active connection to a 
 * publish/subscribe JMS provider. A client uses a TopicConnection 
 * object to create one or more TopicSession objects
 * for producing and consuming messages.
 *
 * _*KMTopicConnection is a JMS 1.0 API. KMConnection should be used instead.*_
 *
 * A TopicConnection can be used to create a TopicSession, from which
 * specialized topic-related objects can be created. 
 * A more general, and recommended approach is to use the 
 * Connection object. 
 *
 * @see KMConnection
 * @see KMConnectionFactory
 */
@interface KMTopicConnection : KMConnection

/**
 * Creates a TopicSession object.
 *
 * @param acknowledgeMode indicates whether the consumer or the
 *   client will acknowledge any messages it receives; ignored if the session
 *   is transacted. Legal values are KMSessionAutoAcknowledge,
 *   KMSessionClientAcknowledge, and KMSessionDupsOKAcknowledge.
 * @param transacted indicates whether the session is transacted
 *  
 * @return a newly created topic session
 *  
 * @exception KMJMSException if the TopicConnection object fails
 *                         to create a session due to some internal error or
 *                         lack of support for the specific transaction
 *                         and acknowledgement mode.
 *
 * @see KMSession
 */
- (KMTopicSession *) createTopicSession:(int)acknowledgeMode transacted:(BOOL)transacted;

/**
 * Creates a connection consumer for this connection (optional operation).
 * This is an expert facility not used by regular JMS clients.
 *  
 * @param topic the topic to access
 * @param messageSelector only messages with properties matching the
 * message selector expression are delivered.  A value of null or
 * an empty string indicates that there is no message selector  
 * for the message consumer.
 * @param sessionPool the server session pool to associate with this 
 * connection consumer
 * @param maxMessages the maximum number of messages that can be
 * assigned to a server session at one time
 *
 * @return the connection consumer
 *
 * @exception KMJMSException if the TopicConnection object fails
 *                         to create a connection consumer due to some
 *                         internal error or invalid arguments for 
 *                         sessionPool and 
 *                         messageSelector.
 * @exception KMInvalidDestinationException if an invalid topic is specified.
 * @exception KMInvalidSelectorException if the message selector is invalid.
 * @see KMConnectionConsumer
 */
- (KMConnectionConsumer *) createConnectionConsumer:(KMTopic *)topic messageSelector:(NSString*)messageSelector
    sessionPool:(KMServerSessionPool *)sessionPool maxMessages:(int)maxMessages;

/**
 * Create a durable connection consumer for this connection (optional operation). 
 * This is an expert facility not used by regular JMS clients.
 *                
 * @param topic the topic to access
 * @param subscriptionName durable subscription name
 * @param messageSelector only messages with properties matching the
 * message selector expression are delivered.  A value of null or
 * an empty string indicates that there is no message selector 
 * for the message consumer.
 * @param sessionPool the server session pool to associate with this 
 * durable connection consumer
 * @param maxMessages the maximum number of messages that can be
 * assigned to a server session at one time
 *
 * @return the durable connection consumer
 *  
 * @exception KMJMSException if the TopicConnection object fails
 *                         to create a connection consumer due to some
 *                         internal error or invalid arguments for 
 *                         sessionPool and 
 *                         messageSelector.
 * @exception KMInvalidDestinationException if an invalid topic is specified.
 * @exception KMInvalidSelectorException if the message selector is invalid.
 * @see KMConnectionConsumer
 */
- (KMConnectionConsumer *) createDurableConnectionConsumer:(KMTopic *)topic subscriptionName:(NSString*)subscriptionName
    messageSelector:(NSString*)messageSelector sessionPool:(KMServerSessionPool *)sessionPool maxMessages:(int)maxMessages;

@end

#endif

