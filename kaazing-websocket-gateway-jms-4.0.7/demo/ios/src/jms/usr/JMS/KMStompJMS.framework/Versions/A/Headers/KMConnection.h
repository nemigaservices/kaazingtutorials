/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KCObject.h"
#import "KMDestination.h"
#import "KMSession.h"
#import "KMConnectionMetaData.h"
#import "KMExceptionListener.h"
#import "KMConnectionConsumer.h"
#import "KMServerSessionPool.h"

/**
 * A KMConnection object is a client's active connection to its JMS 
 * provider.
 *
 * Connections support concurrent use.
 *
 * A connection serves several purposes:
 *
 * - It encapsulates an open connection with a JMS provider. It 
 *     typically represents an open TCP/IP socket between a client and 
 *     the service provider software.
 * - Its creation is where client authentication takes place.
 * - It can specify a unique client identifier.
 * - It provides a KMConnectionMetaData object.
 * - It supports an optional KMExceptionListener object.
 *
 * Because the creation of a connection involves setting up authentication 
 * and communication, a connection is a relatively heavyweight 
 * object. Most clients will do all their messaging with a single connection.
 * Other more advanced applications may use several connections. The JMS API
 * does not architect a reason for using multiple connections; however, there
 * may be operational reasons for doing so.
 *
 * A JMS client typically creates a connection, one or more sessions, 
 * and a number of message producers and consumers. When a connection is
 * created, it is in stopped mode. That means that no messages are being
 * delivered.
 *
 * It is typical to leave the connection in stopped mode until setup 
 * is complete (that is, until all message consumers have been 
 * created).  At that point, the client calls 
 * the connection's start method, and messages begin arriving at 
 * the connection's consumers. This setup
 * convention minimizes any client confusion that may result from 
 * asynchronous message delivery while the client is still in the process 
 * of setting itself up.
 *
 * A connection can be started immediately, and the setup can be done 
 * afterwards. Clients that do this must be prepared to handle asynchronous 
 * message delivery while they are still in the process of setting up.
 *
 * A message producer can send messages while a connection is stopped.
 *
 *
 * @see KMConnectionFactory
 * @see KMStompConnectionFactory
 */
@interface KMConnection : KCObject

/**
 * Creates a Session object.
 *  
 * @param acknowledgeMode indicates whether the consumer or the
 *   client will acknowledge any messages it receives; ignored if the session
 *   is transacted. Legal values are KMSessionAutoAcknowledge,
 *   KMSessionClientAcknowledge, and KMSessionDupsOKAcknowledge.
 * @param transacted indicates whether the session is transacted
 *  
 * @return a newly created session
 *  
 * @exception KMJMSException if the Connection object fails
 *                         to create a session due to some internal error or
 *                         lack of support for the specific transaction
 *                         and acknowledgement mode.
 *
 * @see KMSession
 */ 
- (KMSession *) createSession:(int)acknowledgeMode transacted:(BOOL)transacted;

/**
 * Gets the client identifier for this connection.
 *  
 * This value is specific to the JMS provider.  It is either preconfigured 
 * by an administrator in a ConnectionFactory object
 * or assigned dynamically by the application by calling the
 * setClientID method.
 * 
 * @return the unique client identifier
 *  
 * @exception KMJMSException if the JMS provider fails to return
 *                         the client ID for this connection due
 *                         to some internal error.
 */ 
- (NSString*) clientID;

/**
 * Sets the client identifier for this connection.
 *  
 * The preferred way to assign a JMS client's client identifier is for
 * it to be configured in a client-specific ConnectionFactory
 * object and transparently assigned to the Connection object
 * it creates.
 * 
 * Alternatively, a client can set a connection's client identifier
 * using a provider-specific value. The facility to set a connection's
 * client identifier explicitly is not a mechanism for overriding the
 * identifier that has been administratively configured. It is provided
 * for the case where no administratively specified identifier exists.
 * If one does exist, an attempt to change it by setting it must throw a
 * KMIllegalStateException. If a client sets the client identifier
 * explicitly, it must do so immediately after it creates the connection 
 * and before any other
 * action on the connection is taken. After this point, setting the
 * client identifier is a programming error that should throw a
 * KMIllegalStateException.
 *
 * The purpose of the client identifier is to associate a connection and
 * its objects with a state maintained on behalf of the client by a 
 * provider. The only such state identified by the JMS API is that required
 * to support durable subscriptions.
 *
 * If another connection with the same clientID is already running when
 * this method is called, the JMS provider should detect the duplicate ID and throw
 * a KMInvalidClientIDException.
 *
 * @param clientID the unique client identifier
 * 
 * @exception KMJMSException if the JMS provider fails to
 *                         set the client ID for this connection due
 *                         to some internal error.
 *
 * @exception KMInvalidClientIDException if the JMS client specifies an
 *                         invalid or duplicate client ID.
 * @exception KMIllegalStateException if the JMS client attempts to set
 *       a connection's client ID at the wrong time or
 *       when it has been administratively configured.
 */ 
- (void) setClientID:(NSString*)clientID;

/**
 * Gets the metadata for this connection.
 *  
 * @return the connection metadata
 *  
 * @exception KMJMSException if the JMS provider fails to
 *                         get the connection metadata for this connection.
 *
 * @see KMConnectionMetaData
 */ 
- (KMConnectionMetaData *) metaData;

/**
 * Gets the ExceptionListener object for this connection. 
 * Not every Connection has an ExceptionListener
 * associated with it.
 *
 * @return the ExceptionListener for this connection, or null. 
 *              if no ExceptionListener is associated
 *              with this connection.
 *
 * @exception KMJMSException if the JMS provider fails to
 *                         get the ExceptionListener for this 
 *                         connection. 
 * @see setExceptionListener:
 */ 
- (id <KMExceptionListener>) exceptionListener;

/**
 * Sets an exception listener for this connection.
 *
 * If a JMS provider detects a serious problem with a connection, it
 * informs the connection's ExceptionListener, if one has been
 * registered. It does this by calling the listener's
 * onException method, passing it a KMJMSException
 * object describing the problem.
 *
 * An exception listener allows a client to be notified of a problem
 * asynchronously.
 * Some connections only consume messages, so they would have no other 
 * way to learn their connection has failed.
 *
 * A connection serializes execution of its
 * ExceptionListener.
 *
 * A JMS provider should attempt to resolve connection problems 
 * itself before it notifies the client of them.
 *
 * @param listener the exception listener
 *
 * @exception KMJMSException if the JMS provider fails to
 *                         set the exception listener for this connection.
 *
 * @see exceptionListener
 */ 
- (void) setExceptionListener:(id <KMExceptionListener>)listener;

/**
 * Starts (or restarts) a connection's delivery of incoming messages.
 * A call to start on a connection that has already been
 * started is ignored.
 * 
 * @exception KMJMSException if the JMS provider fails to start
 *                         message delivery due to some internal error.
 *
 * @see stop
 */ 
- (void) start;

/**
 * Temporarily stops a connection's delivery of incoming messages.
 * Delivery can be restarted using the connection's start
 * method. When the connection is stopped,
 * delivery to all the connection's message consumers is inhibited:
 * synchronous receives block, and messages are not delivered to message
 * listeners.
 *
 * This call blocks until receives and/or message listeners in progress
 * have completed.
 *
 * Stopping a connection has no effect on its ability to send messages.
 * A call to stop on a connection that has already been
 * stopped is ignored.
 *
 * A call to stop must not return until delivery of messages
 * has paused. This means that a client can rely on the fact that none of 
 * its message listeners will be called and that all threads of control 
 * waiting for receive calls to return will not return with a 
 * message until the
 * connection is restarted. The receive timers for a stopped connection
 * continue to advance, so receives may time out while the connection is
 * stopped.
 * 
 * If message listeners are running when stop is invoked, 
 * the stop call must
 * wait until all of them have returned before it may return. While these
 * message listeners are completing, they must have the full services of the
 * connection available to them.
 *  
 * @exception KMJMSException if the JMS provider fails to stop
 *                         message delivery due to some internal error.
 *
 * @see start
 */ 
- (void) stop;


/**
 * Closes the connection.
 *
 * Since a provider typically allocates significant resources outside 
 * the JVM on behalf of a connection, clients should close these resources
 * when they are not needed. Relying on garbage collection to eventually 
 * reclaim these resources may not be timely enough.
 *
 * There is no need to close the sessions, producers, and consumers
 * of a closed connection.
 *
 * Closing a connection causes all temporary destinations to be
 * deleted.
 *
 * When this method is invoked, it should not return until message
 * processing has been shut down in an orderly fashion. This means that all
 * message 
 * listeners that may have been running have returned, and that all pending 
 * receives have returned. A close terminates all pending message receives 
 * on the connection's sessions' consumers. The receives may return with a 
 * message or with null, depending on whether there was a message available 
 * at the time of the close. If one or more of the connection's sessions' 
 * message listeners is processing a message at the time when connection 
 * close is invoked, all the facilities of the connection and 
 * its sessions must remain available to those listeners until they return 
 * control to the JMS provider. 
 *
 * Closing a connection causes any of its sessions' transactions
 * in progress to be rolled back. In the case where a session's
 * work is coordinated by an external transaction manager, a session's 
 * commit and rollback methods are
 * not used and the result of a closed session's work is determined
 * later by the transaction manager.
 *
 * Closing a connection does NOT force an 
 * acknowledgment of client-acknowledged sessions.
 * 
 * Invoking the acknowledge method of a received message 
 * from a closed connection's session must throw a
 * KMIllegalStateException.  Closing a closed connection must 
 * NOT throw an exception.
 *  
 * @exception KMJMSException if the JMS provider fails to close the
 *                         connection due to some internal error. For 
 *                         example, a failure to release resources
 *                         or to close a socket connection can cause
 *                         this exception to be thrown.
 */ 
- (void) close;

#if NOT_IMPLEMENTED
/**
 * Creates a connection consumer for this connection (optional operation).
 * This is an expert facility not used by regular JMS clients.
 *  
 * @param destination the destination to access
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
 * @exception KMJMSException if the Connection object fails
 *                         to create a connection consumer due to some
 *                         internal error or invalid arguments for 
 *                         sessionPool and 
 *                         messageSelector.
 * @exception KMInvalidDestinationException if an invalid destination is specified.
 * @exception KMInvalidSelectorException if the message selector is invalid.
 *
 * @see KMConnectionConsumer
 */ 
- (KMConnectionConsumer *) createConnectionConsumer:(KMDestination *)destination
                                     messageSelector:(NSString*)messageSelector
                                         sessionPool:(KMServerSessionPool *)sessionPool
                                         maxMessages:(int)maxMessages;

/**
 * Create a durable connection consumer for this connection (optional operation). 
 * This is an expert facility not used by regular JMS clients.
 *                
 * @param topic topic to access
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
 * @exception KMJMSException if the Connection object fails
 *                         to create a connection consumer due to some
 *                         internal error or invalid arguments for 
 *                         sessionPool and 
 *                         messageSelector.
 * @exception KMInvalidDestinationException if an invalid destination
 *             is specified.
 * @exception KMInvalidSelectorException if the message selector is invalid.
 * @see KMConnectionConsumer
 */ 
- (KMConnectionConsumer *) createDurableConnectionConsumer:(KMTopic *)topic
                                           subscriptionName:(NSString*)subscriptionName
                                            messageSelector:(NSString*)messageSelector
                                                sessionPool:(KMServerSessionPool *)sessionPool
                                                maxMessages:(int)maxMessages;
#endif

@end
