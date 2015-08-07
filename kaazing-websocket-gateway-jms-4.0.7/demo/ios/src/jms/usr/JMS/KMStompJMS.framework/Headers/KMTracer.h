/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KCObject.h"

/**
 * Set KMTracerDebug to true to log messages between the JMS Client and Gateway.
 */
extern BOOL KMTracerDebug;

@interface KMTracer : KCObject

/**
 * Logs messages when KMTracerDebug is set to true.
 *
 * @param message the message to log.
 */
+ (void) trace:(NSString*)message;

@end
