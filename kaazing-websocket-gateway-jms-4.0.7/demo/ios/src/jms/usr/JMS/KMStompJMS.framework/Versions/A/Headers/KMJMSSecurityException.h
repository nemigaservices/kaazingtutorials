/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMJMSException.h"

/**
 *
 *  This exception must be thrown when a provider rejects a user 
 *     name/password submitted by a client. It may also be thrown for any case 
 *     where a security restriction prevents a method from completing.
 *
 */
@interface KMJMSSecurityException : KMJMSException

	/**
	 * Initializes a KMJMSSecurityException with the specified 
	 *  reason and error code.
	 *
	 *  @param reason a description of the exception
	 *  @param errorCode a string specifying the vendor-specific
	 *                        error code
	 *                        
	 */
- (KMJMSSecurityException *) initWithReason:(NSString*)reason errorCode:(NSString*)errorCode;

	/**
	 * Initializes a KMJMSSecurityException with the specified 
	 *  reason. The error code defaults to nil.
	 *
	 *  @param reason a description of the exception
	 */
- (KMJMSSecurityException *) initWithReason:(NSString*)reason;

@end
