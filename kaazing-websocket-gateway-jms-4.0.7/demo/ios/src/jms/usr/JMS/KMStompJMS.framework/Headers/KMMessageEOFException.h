/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMJMSException.h"

/**
 *  This exception must be thrown when an unexpected 
 *  end of stream has been reached when a KMStreamMessage or 
 *  KMBytesMessage is being read.
 */
@interface KMMessageEOFException : KMJMSException

	/**
	 * Initializes a KMMessageEOFException with the specified 
	 *  reason and error code.
	 *
	 *  @param reason a description of the exception
	 *  @param errorCode a string specifying the vendor-specific
	 *                        error code
	 */
- (KMMessageEOFException *) initWithReason:(NSString*)reason errorCode:(NSString*)errorCode;

	/**
	 * Initializes a KMMessageEOFException with the specified 
	 *  reason. The error code defaults to nil.
	 *
	 *  @param reason a description of the exception
	 */
- (KMMessageEOFException *) initWithReason:(NSString*)reason;

@end
