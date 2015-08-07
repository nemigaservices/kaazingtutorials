/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMJMSException.h"

/**
 *
 *  This exception must be thrown when a 
 *     client attempts to set a connection's client ID to a value that 
 *     is rejected by a provider.
 *
 */
@interface KMInvalidClientIDException : KMJMSException

	/**
	 * Initializes a KMInvalidClientIDException with the specified 
	 *  reason and error code.
	 *
	 *  @param reason a description of the exception
	 *  @param errorCode a string specifying the vendor-specific
	 *                        error code
	 *                        
	 */
- (KMInvalidClientIDException *) initWithReason:(NSString*)reason errorCode:(NSString*)errorCode;

	/**
	 * Initializes a KMInvalidClientIDException with the specified 
	 *  reason. The error code defaults to nil.
	 *
	 *  @param reason a description of the exception
	 */
- (KMInvalidClientIDException *) initWithReason:(NSString*)reason;

@end
