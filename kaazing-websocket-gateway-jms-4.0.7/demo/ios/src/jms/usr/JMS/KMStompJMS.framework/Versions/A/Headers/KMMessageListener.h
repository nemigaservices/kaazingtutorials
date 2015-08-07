/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMMessage.h"

/**
 * A KMMessageListener asynchronously receives delivered messages.
 *
 * Each session must insure that it passes messages serially to the
 * listener. This means that a listener assigned to one or more consumers
 * of the same session can assume that the onMessage method 
 * is not called with the next message until the session has completed the 
 * last call.
 */
@protocol KMMessageListener <NSObject>

/**
 * Passes a message to the listener.
 *
 * @param message the message passed to the listener
 */
- (void) onMessage:(KMMessage *)message;

@end
