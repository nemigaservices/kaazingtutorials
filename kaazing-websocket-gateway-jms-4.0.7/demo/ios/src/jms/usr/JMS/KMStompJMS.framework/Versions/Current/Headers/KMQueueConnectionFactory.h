/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMConnectionFactory.h"

#if NOT_IMPLEMENTED

/**
 * A client uses a QueueConnectionFactory object to create 
 * QueueConnection objects with a point-to-point JMS provider.
 *
 * _*KMQueueConnectionFactory is a JMS 1.0 API. KMConnectionFactory should be used instead.*_
 *
 * QueueConnectionFactory can be used to create a 
 * QueueConnection, from which specialized queue-related objects
 * can be  created. A more general, and recommended,  approach 
 * is to use the ConnectionFactory object.
 *
 * @warning Use KMStompConnectionFactory to create JMS Connections.
 *
 * @see KMConnectionFactory
 * @see KMStompConnectionFactory
 */
@interface KMQueueConnectionFactory : KMConnectionFactory

/**
 * Creates a queue connection with the default user identity.
 * The connection is created in stopped mode. No messages 
 * will be delivered until the Connection.start method
 * is explicitly called.
 *
 *
 * @return a newly created queue connection
 *
 * @exception KMJMSException if the JMS provider fails to create the queue 
 *                         connection due to some internal error.
 * @exception KMJMSSecurityException if client authentication fails due to 
 *                         an invalid user name or password.
 */
- (KMQueueConnection *) createQueueConnection;

/**
 * Creates a queue connection with the specified user identity.
 * The connection is created in stopped mode. No messages 
 * will be delivered until the Connection.start method
 * is explicitly called.
 *  
 * @param userName the caller's user name
 * @param password the caller's password
 *  
 * @return a newly created queue connection
 *
 * @exception KMJMSException if the JMS provider fails to create the queue 
 *                         connection due to some internal error.
 * @exception KMJMSSecurityException if client authentication fails due to 
 *                         an invalid user name or password.
 */
- (KMQueueConnection *) createQueueConnection:(NSString*)userName password:(NSString*)password;

@end

#endif

