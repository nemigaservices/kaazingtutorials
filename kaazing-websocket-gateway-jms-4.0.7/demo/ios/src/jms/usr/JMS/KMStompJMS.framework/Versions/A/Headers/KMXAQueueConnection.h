/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMQueueConnection.h"
#import "KMXAConnection.h"

#if NOT_IMPLEMENTED

@interface KMXAQueueConnection : KMQueueConnection

- (KMXAQueueSession *) createXAQueueSession;

- (KMQueueSession *) createQueueSession:(int)acknowledgeMode transacted:(BOOL)transacted;

@end
 
#endif

