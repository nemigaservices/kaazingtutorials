/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMJMSException.h"

/**
 * This exception is thrown when a method is 
 * invoked at an illegal or inappropriate time or if the provider is 
 * not in an appropriate state for the requested operation. For example, 
 * this exception must be thrown if [KMSession commit] is 
 * called on a non-transacted session.
 */
@interface KMIllegalStateException : KMJMSException

	/**
	 * Initializes a KMIllegalStateException with the specified reason
	 * and error code.
	 *
	 *  @param reason a description of the exception
	 *  @param errorCode a string specifying the vendor-specific
	 *                        error code
	 */
- (KMIllegalStateException *) initWithReason:(NSString*)reason errorCode:(NSString*)errorCode;

	/**
	 * Initializes a KMIllegalStateException with the specified 
	 *  reason. The error code defaults to nil.
	 *
	 *  @param reason a description of the exception
	 */
- (KMIllegalStateException *) initWithReason:(NSString*)reason;

@end
