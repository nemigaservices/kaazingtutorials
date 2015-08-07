/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMSession.h"

#if NOT_IMPLEMENTED

@interface KMXASession : KMSession

- (KMSession *) session;

- (KMXAResource *) XAResource;

- (BOOL) transacted;

- (void) commit;

- (void) rollback;

@end

@interface KMXAResource : KCObject
@end

#endif
