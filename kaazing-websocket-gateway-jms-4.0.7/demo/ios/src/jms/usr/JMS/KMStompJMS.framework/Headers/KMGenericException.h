/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMJMSException.h"

/**
 * Wraps a generic NSException inside a KMJMSException 
 */
@interface KMGenericException : KMJMSException

+ (KMJMSException *) wrapException:(NSException *)e;

@end
