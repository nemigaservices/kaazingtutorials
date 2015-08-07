/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMTopicConnectionFactory.h"
#import "KMXAConnectionFactory.h"

#if NOT_IMPLEMENTED

@interface KMXATopicConnectionFactory : KMTopicConnectionFactory

- (KMXATopicConnection *) createXATopicConnection;

- (KMXATopicConnection *) createXATopicConnectionWithUsername:(NSString*)userName password:(NSString*)password;

@end

#endif
