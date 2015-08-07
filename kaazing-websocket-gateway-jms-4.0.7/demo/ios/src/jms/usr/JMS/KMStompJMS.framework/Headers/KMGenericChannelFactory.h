/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import <Foundation/Foundation.h>

#import "KMGenericChannel.h"
#import "KMGenericChannelListener.h"

/**
 * Internal: Do not use.
 */
@protocol KMGenericChannelFactory <NSObject>

- (id<KMGenericChannel>) createChannel:(id<KMGenericChannelListener>)listener; /* throws Exception */

@end
