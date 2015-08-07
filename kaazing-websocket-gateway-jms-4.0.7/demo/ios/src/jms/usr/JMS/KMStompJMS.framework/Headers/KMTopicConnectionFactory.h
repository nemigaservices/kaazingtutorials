/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMConnectionFactory.h"

#if NOT_IMPLEMENTED

/**
 * A client uses a TopicConnectionFactory object to create 
 * TopicConnection objects with a publish/subscribe JMS provider.
 *
 * _*KMTopicConnectionFactory is a JMS 1.0 API. KMConnectionFactory should be used instead.*_
 *
 * A TopicConnectionFactory can be used to create a 
 * TopicConnection, from which specialized topic-related objects
 * can be  created. A more general, and recommended approach 
 * is to use the ConnectionFactory object.
 *  
 * @warning Use KMStompConnectionFactory to create JMS Connections.
 *
 * @see KMConnectionFactory
 * @see KMStompConnectionFactory
 */
@interface KMTopicConnectionFactory : KMConnectionFactory

/**
 * Creates a topic connection with the default user identity.
 * The connection is created in stopped mode. No messages 
 * will be delivered until the Connection.start method
 * is explicitly called.
 *
 * @return a newly created topic connection
 *
 * @exception KMJMSException if the JMS provider fails to create a topic 
 *                         connection due to some internal error.
 * @exception KMJMSSecurityException if client authentication fails due to 
 *                                 an invalid user name or password.
 */
- (KMTopicConnection *) createTopicConnection;

/**
 * Creates a topic connection with the specified user identity.
 * The connection is created in stopped mode. No messages 
 * will be delivered until the Connection.start method
 * is explicitly called.
 *  
 * @param userName the caller's user name
 * @param password the caller's password
 *  
 * @return a newly created topic connection
 *
 * @exception KMJMSException if the JMS provider fails to create a topic 
 *                         connection due to some internal error.
 * @exception KMJMSSecurityException if client authentication fails due to 
 *                                 an invalid user name or password.
 */
- (TopicConnection *) createTopicConnection:(NSString*)userName password:(NSString*)password;

@end

#endif

