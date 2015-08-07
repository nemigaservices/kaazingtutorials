/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMQueueConnectionFactory.h"
#import "KMXAConnectionFactory.h"

#if NOT_IMPLEMENTED

@interface KMXAQueueConnectionFactory : KMQueueConnectionFactory

- (KMXAQueueConnection *) createXAQueueConnection;

- (KMXAQueueConnection *) createXAQueueConnectionWithUsername:(NSString*)userName password:(NSString*)password;

@end
 
#endif
