/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMGenericChannelListener.h"

/**
 * Internal: Do not use.
 */
@protocol KMGenericChannel <NSObject>

- (void) connect; /* throws Exception */

- (void) send:(KGByteBuffer *)buf; /* throws IOException */

- (void) close; /* throws Exception */

- (void) setListener:(id <KMGenericChannelListener>)listener;

@end
