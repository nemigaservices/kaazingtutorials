/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMTopicConnection.h"
#import "KMXAConnection.h"

#if NOT_IMPLEMENTED

@interface KMXATopicConnection : KMTopicConnection

- (KMXATopicSession *) createXATopicSession;

- (KMTopicSession *) createTopicSession:(int)acknowledgeMode transacted:(BOOL)transacted;

@end
 
#endif
