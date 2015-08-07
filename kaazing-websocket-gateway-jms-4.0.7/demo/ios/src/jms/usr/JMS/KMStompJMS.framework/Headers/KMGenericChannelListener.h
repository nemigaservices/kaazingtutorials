/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import <KGWebSocket/KGByteBuffer.h>

/**
 * Internal: Do not use.
 */
@protocol KMGenericChannelListener <NSObject>

- (void) onOpen;

- (void) onClose;

- (void) onClose:(NSException *)ex;

- (void) onMessage:(KGByteBuffer *)message;

- (void) onError:(NSError *)error;

@end
