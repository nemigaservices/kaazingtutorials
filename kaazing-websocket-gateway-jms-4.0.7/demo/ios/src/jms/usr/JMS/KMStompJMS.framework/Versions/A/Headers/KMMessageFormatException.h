/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMJMSException.h"

/**
 *
 *  This exception must be thrown when a JMS client 
 *     attempts to use a data type not supported by a message or attempts to 
 *     read data in a message as the wrong type. It must also be thrown when 
 *     equivalent type errors are made with message property values. For 
 *     example, this exception must be thrown if 
 *     [KMStreamMessage writeObject:] is given an unsupported class or 
 *     if [KMStreamMessage readShort] is used to read a 
 *     bool value. Note that the special case of a failure 
 *     caused by an attempt to read improperly formatted String 
 *     data as numeric values must throw the 
 *     KMNumberFormatException.
 */
@interface KMMessageFormatException : KMJMSException

	/**
	 * Initializes a KMMessageFormatException with the specified 
	 *  reason and error code.
	 *
	 *  @param reason a description of the exception
	 *  @param errorCode a string specifying the vendor-specific
	 *                        error code
	 */
- (KMMessageFormatException *) initWithReason:(NSString*)reason errorCode:(NSString*)errorCode;

	/**
	 * Initializes a KMMessageFormatException with the specified 
	 *  reason. The error code defaults to nil.
	 *
	 *  @param reason a description of the exception
	 */
- (KMMessageFormatException *) initWithReason:(NSString*)reason;

@end
