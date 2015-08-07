/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMJMSException.h"

/**
 *
 *  This exception must be thrown when a JMS client attempts to read a 
 *     write-only message.
 *
 */
@interface KMMessageNotReadableException : KMJMSException

	/**
	 * Initializes a KMMessageNotReadableException with the specified 
	 *  reason and error code.
	 *
	 *  @param reason a description of the exception
	 *  @param errorCode a string specifying the vendor-specific
	 *                        error code
	 */
- (KMMessageNotReadableException *) initWithReason:(NSString*)reason errorCode:(NSString*)errorCode;

	/**
	 * Initializes a KMMessageNotReadableException with the specified 
	 *  reason. The error code defaults to nil.
	 *
	 *  @param reason a description of the exception
	 */
- (KMMessageNotReadableException *) initWithReason:(NSString*)reason;

@end
