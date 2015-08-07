/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMJMSException.h"

/**
 * This exception is thrown when an operation is invalid because
 * a transaction is in progress.  For instance, an attempt to call
 * [KMSession commit] when a session is part of a distributed
 * transaction should throw a KMTransactionInProgressException.
 */
@interface KMTransactionInProgressException : KMJMSException

	/**
	 * Initializes a KMTransactionInProgressException with the 
	 * specified reason and error code.
	 *
	 * @param reason a description of the exception
	 * @param errorCode a string specifying the vendor-specific
	 *                        error code
   * @returns the exception
	 */
- (KMTransactionInProgressException *) initWithReason:(NSString*)reason errorCode:(NSString*)errorCode;

	/**
	 * Initializes a KMTransactionInProgressException with the 
	 * specified reason. The error code defaults to nil.
	 *
	 * @param reason a description of the exception
   * @returns the exception
	 */
- (KMTransactionInProgressException *) initWithReason:(NSString*)reason;

@end
