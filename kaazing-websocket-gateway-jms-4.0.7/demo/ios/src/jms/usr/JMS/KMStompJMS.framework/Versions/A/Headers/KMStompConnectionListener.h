/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMConnection.h"

/**
 * Protocol to observe connect, start, stop, and close events on a KMConnection.
 *
 * @see KMStompConnectionFactory
 */
@protocol KMStompConnectionListener <NSObject>

/**
 * Invoked when the connection is established with the Gateway via
 * [KMConnectionFactory createConnection].
 *
 * @param connection the connection to the Gateway
 */
- (void) onConnect:(KMConnection *)connection;

/**
 * Invoked when a call to [KMConnection start] completes to 
 * start the flow of messages.
 *
 * @param connection the connection to the Gateway
 */
- (void) onStart:(KMConnection *)connection;

/**
 * Invoked when a call to [KMConnection stop] completes to 
 * stop the flow of messages.
 *
 * @param connection the connection to the Gateway
 */
- (void) onStop:(KMConnection *)connection;

/**
 * Invoked when [KMConnection close] has completed and the connection
 * to the Gateway has closed.
 *
 * @param connection the connection to the Gateway
 */
- (void) onClose:(KMConnection *)connection;

@end
