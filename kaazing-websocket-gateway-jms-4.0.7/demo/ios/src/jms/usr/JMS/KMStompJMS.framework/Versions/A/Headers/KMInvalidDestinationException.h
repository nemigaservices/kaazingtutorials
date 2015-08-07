/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMJMSException.h"

/**
 *
 *  This exception must be thrown when a 
 *     destination either is not understood by a provider or is no 
 *     longer valid.
 *
 */
@interface KMInvalidDestinationException : KMJMSException

	/**
	 * Initializes a KMInvalidDestinationException with the specified 
	 *  reason and error code.
	 *
	 *  @param reason a description of the exception
	 *  @param errorCode a string specifying the vendor-specific
	 *                        error code
	 *                        
	 */
- (KMInvalidDestinationException *) initWithReason:(NSString*)reason errorCode:(NSString*)errorCode;

	/**
	 * Initializes a KMInvalidDestinationException with the specified 
	 *  reason. The error code defaults to nil.
	 *
	 *  @param reason a description of the exception
	 */
- (KMInvalidDestinationException *) initWithReason:(NSString*)reason;

@end
