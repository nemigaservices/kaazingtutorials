/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMJMSException.h"

/**
 *
 *  This exception must be thrown when a 
 *     JMS client attempts to give a provider a message selector with 
 *     invalid syntax.
 *
 */
@interface KMInvalidSelectorException : KMJMSException

	/**
	 * Initializes a KMInvalidSelectorException with the specified 
	 *  reason and error code.
	 *
	 *  @param reason a description of the exception
	 *  @param errorCode a string specifying the vendor-specific
	 *                        error code
	 *                        
	 */
- (KMInvalidSelectorException *) initWithReason:(NSString*)reason errorCode:(NSString*)errorCode;

	/**
	 * Initializes a KMInvalidSelectorException with the specified 
	 *  reason. The error code defaults to nil.
	 *
	 *  @param reason a description of the exception
	 */
- (KMInvalidSelectorException *) initWithReason:(NSString*)reason;

@end
