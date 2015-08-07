/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMConnection.h"

#if NOT_IMPLEMENTED

@interface KMXAConnection : KMConnection

- (KMXASession *) createXASession;

- (KMSession *) createSession:(int)acknowledgeMode transacted:(BOOL)transacted;

@end

#endif
