/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KCObject.h"

/**
 * Connection properties to set connection timeout, shutdown delay on connection close,
 * reconnect delay, and set a maximum number of reconnect attempts
 *
 * @see KMStompConnectionFactory
 * @see KMConnection
 */
@interface KMStompConnectionProperties : KCObject {

    @public

    /**
     * Set the length of time allowed to connect before the connection
     * fails, in milliseconds.  
     * Set to zero (0) for no timeout (wait indefinitely for connection).
     * Default is 5000 ms.
     */
    int _connectionTimeout;

    /**
     * Set the length of time to wait for the Gateway to close the
     * underlying transport after sending DISCONNECT, in milliseconds.
     * After the delay, the client will forcibly close the connection.
     * Default is 5000 ms.
     */
    int _shutdownDelay;

    /**
     * Set the length of time to wait for the underlying connection
     * to shutdown before forcibly closing the connection, in milliseconds.
     * Default is 3000 ms.
     */
    int _reconnectDelay;

    /**
     * Set the maximum number of times to attempt to reconnect before
     * closing the connection.  Set to zero (0) to prevent any attempts to
     * reconnect.  Set to -1 for unlimited reconnect attempts (default).
     */
    int _reconnectAttemptsMax;
}

@end

