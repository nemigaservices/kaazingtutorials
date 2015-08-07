/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import "KCObject.h"

/**
 * Common base class for exceptions
 */
@interface KCException : NSException <KCObject>

- (id) initWithReason:(NSString *)reason;

- (void) printStackTrace;

- (void) setLinkedException:(NSException *)linkedException;

- (NSException *) linkedException;

- (void) setStackTrace:(id)stackTrace;

- (id) stackTrace;

@end
