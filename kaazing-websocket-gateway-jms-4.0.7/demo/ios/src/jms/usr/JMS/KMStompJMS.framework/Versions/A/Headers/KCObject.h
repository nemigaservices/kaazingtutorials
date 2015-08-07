/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import <Foundation/Foundation.h>

/**
 * Common base protocol
 */
@protocol KCObject <NSObject>

- (void) init0;

/**
 * Returns a string representation of the object,
 * defaulting to invoking [NSObject description]
 */
- (NSString *) toString;

@end

/**
 * Common base class
 */
@interface KCObject : NSObject <KCObject>

- (void) init0;

- (void) wait;

- (void) wait:(long)millis;

- (void) notify;

- (void) notifyAll;

- (NSString *) toString;

@end
