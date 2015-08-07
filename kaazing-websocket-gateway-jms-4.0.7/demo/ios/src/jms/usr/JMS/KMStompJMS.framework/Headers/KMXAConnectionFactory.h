/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import <Foundation/Foundation.h>

#if NOT_IMPLEMENTED

@interface KMXAConnectionFactory : KCObject

- (KMXAConnection *) createXAConnection;

- (KMXAConnection *) createXAConnectionWithUsername:(NSString*)userName password:(NSString*)password;

@end

#endif

