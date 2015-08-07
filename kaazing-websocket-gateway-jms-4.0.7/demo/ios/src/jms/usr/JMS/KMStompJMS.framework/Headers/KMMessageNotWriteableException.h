/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMJMSException.h"

/**
 *
 *  This exception must be thrown when a JMS client attempts to write to a 
 *     read-only message.
 *
 */
@interface KMMessageNotWriteableException : KMJMSException

	/**
	 * Initializes a KMMessageNotWriteableException with the specified 
	 *  reason and error code.
	 *
	 *  @param reason a description of the exception
	 *  @param errorCode a string specifying the vendor-specific
	 *                        error code
	 */
- (KMMessageNotWriteableException *) initWithReason:(NSString*)reason errorCode:(NSString*)errorCode;

	/**
	 * Initializes a KMMessageNotWriteableException with the specified 
	 *  reason. The error code defaults to nil.
	 *
	 *  @param reason a description of the exception
	 */
- (KMMessageNotWriteableException *) initWithReason:(NSString*)reason;

@end
