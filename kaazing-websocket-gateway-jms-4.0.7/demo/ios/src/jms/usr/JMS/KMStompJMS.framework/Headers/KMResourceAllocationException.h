/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMJMSException.h"

/**
 * This exception is thrown when a provider is unable to allocate the 
 * resources required by a method. For example, this exception should be 
 * thrown when a call to [KMTopicConnectionFactory createTopicConnection]
 * fails due to a lack of JMS provider resources.
 */
@interface KMResourceAllocationException : KMJMSException

/**
 * Initializes a KMResourceAllocationException with the specified 
 *  reason and error code.
 *
 *  @param reason a description of the exception
 *  @param errorCode a string specifying the vendor-specific
 *                        error code
 *                        
 */
- (KMResourceAllocationException *) initWithReason:(NSString*)reason errorCode:(NSString*)errorCode;

/**
 * Initializes a KMResourceAllocationException with the specified 
 *  reason. The error code defaults to nil.
 *
 *  @param reason a description of the exception
 */
- (KMResourceAllocationException *) initWithReason:(NSString*)reason;

@end
