/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KCException.h"

/*
 * Thrown when the application attempts to fetch the 
 * results of an asynchronous operation before it has completed.
 */
@interface KMUnfulfilledFutureException : KCException
@end
