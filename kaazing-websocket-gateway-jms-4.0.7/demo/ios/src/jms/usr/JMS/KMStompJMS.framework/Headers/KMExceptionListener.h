/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMJMSException.h"

/**
 * If a JMS provider detects a serious problem with a Connection
 * object, it informs the Connection object's 
 * ExceptionListener, if one has been registered. 
 * It does this by calling the listener's onException method, 
 * passing it a KMJMSException argument describing the problem.
 *
 * An exception listener allows a client to be notified of a problem 
 * asynchronously. Some connections only consume messages, so they would have no
 * other way to learn that their connection has failed.
 *
 * A JMS provider should attempt to resolve connection problems 
 * itself before it notifies the client of them.
 *
 *
 * @see [KMConnection exceptionListener]
 */
@protocol KMExceptionListener <NSObject>

/**
 * Notifies user of a JMS exception.
 *
 * @param exception the JMS exception
 */
- (void) onException:(KMJMSException *)exception;

@end
