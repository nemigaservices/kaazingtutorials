/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMConnection.h"

#if NOT_IMPLEMENTED

/**
 * A QueueConnection object is an active connection to a 
 * point-to-point JMS provider. A client uses a QueueConnection 
 * object to create one or more QueueSession objects
 * for producing and consuming messages.
 *
 * _*KMQueueConnection is a JMS 1.0 API. KMConnection should be used instead.*_
 *
 * A QueueConnection can be used to create a
 * QueueSession, from which specialized  queue-related objects
 * can be created.
 * A more general, and recommended, approach is to use the 
 * Connection object.
 * 
 * A QueueConnection cannot be used to create objects 
 * specific to the   publish/subscribe domain. The
 * createDurableConnectionConsumer method inherits
 * from  Connection, but must throw a
 * KMIllegalStateException
 * if used from QueueConnection.
 *
 *
 * @see KMConnection
 * @see KMConnectionFactory
 */
@interface KMQueueConnection : KMConnection

/**
 * Creates a QueueSession object.
 *  
 * @return a newly created queue session
 *  
 *  
 * @param transacted indicates whether the session is transacted
 * @param acknowledgeMode indicates whether the consumer or the
 * client will acknowledge any messages it receives; ignored if the session
 * is transacted. Legal values are KMSessionAutoAcknowledge,
 * KMSessionClientAcknowledge, and KMSessionDupsOKAcknowledge.
 *
 * @exception KMJMSException if the QueueConnection object fails
 *                         to create a session due to some internal error or
 *                         lack of support for the specific transaction
 *                         and acknowledgement mode.
 *
 * @see KMSession
 */
- (KMQueueSession *) createQueueSession:(int)acknowledgeMode transacted:(BOOL)transacted;

/**
 * Creates a connection consumer for this connection (optional operation).
 * This is an expert facility not used by regular JMS clients.
 *
 * @param queue the queue to access
 * @param messageSelector only messages with properties matching the
 * message selector expression are delivered. A value of null or
 * an empty string indicates that there is no message selector 
 * for the message consumer.
 * @param sessionPool the server session pool to associate with this 
 * connection consumer
 * @param maxMessages the maximum number of messages that can be
 * assigned to a server session at one time
 *
 * @return the connection consumer
 *  
 * @exception KMJMSException if the QueueConnection object fails
 *                         to create a connection consumer due to some
 *                         internal error or invalid arguments for 
 *                         sessionPool and 
 *                         messageSelector.
 * @exception KMInvalidDestinationException if an invalid queue is specified.
 * @exception KMInvalidSelectorException if the message selector is invalid.
 * @see KMConnectionConsumer
 */
- (KMConnectionConsumer *) createConnectionConsumer:(KMQueue *)queue messageSelector:(NSString*)messageSelector
                                        sessionPool:(KMServerSessionPool *)sessionPool
                                        maxMessages:(int)maxMessages;

@end
#endif

