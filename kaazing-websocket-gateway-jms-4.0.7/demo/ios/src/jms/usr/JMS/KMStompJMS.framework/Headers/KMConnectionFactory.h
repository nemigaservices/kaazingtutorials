/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import "KCObject.h"
#import "KMConnection.h"

/**
 * A KMConnectionFactory object encapsulates a set of connection 
 * configuration parameters that has been defined by an administrator.
 * A client uses it to create a connection with a JMS provider.
 *
 * A KMConnectionFactory object is a JMS administered object and
 * supports concurrent use.
 *
 * JMS administered objects are objects containing configuration 
 * information that are created by an administrator and later used by 
 * JMS clients. They make it practical to administer the JMS API in the 
 * enterprise.
 *
 * Clients should think of administered objects as local objects. 
 * Looking them up should not have any hidden side effects or use surprising 
 * amounts of local resources.
 *
 * @warning Use KMStompConnectionFactory to create JMS Connections.
 *
 * @see KMConnection
 * @see KMStompConnectionFactory
 */
@interface KMConnectionFactory : KCObject

/**
 * Creates a connection with the default user identity.
 * The connection is created in stopped mode. No messages 
 * will be delivered until the [KMConnection start] method
 * is explicitly called.
 *
 * @return a newly created connection
 *
 * @exception KMJMSException if the JMS provider fails to create the
 *                         connection due to some internal error.
 * @exception KMJMSSecurityException if client authentication fails due to 
 *                         an invalid user name or password.
 */
- (KMConnection *) createConnection;

/**
 * Creates a connection with the specified user identity.
 * The connection is created in stopped mode. No messages 
 * will be delivered until the [KMConnection start] method
 * is explicitly called.
 *  
 * @return a newly created  connection
 * @param userName the caller's user name
 * @param password the caller's password
 * @exception KMJMSException if the JMS provider fails to create the 
 *                         connection due to some internal error.
 * @exception KMJMSSecurityException if client authentication fails due to 
 *                         an invalid user name or password.
 */
- (KMConnection *) createConnectionWithUsername:(NSString *)userName password:(NSString *)password;

@end
