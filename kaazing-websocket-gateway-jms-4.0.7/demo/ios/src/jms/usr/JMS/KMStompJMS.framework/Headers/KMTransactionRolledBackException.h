/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMJMSException.h"

/**
 * This exception must be thrown when a call to [KMSession commit]
 * results in a rollback of the current transaction.
 */
@interface KMTransactionRolledBackException : KMJMSException

/**
 * Initializes a KMTransactionRolledBackException with the 
 * specified reason and error code.
 *
 * @param reason a description of the exception
 * @param errorCode a string specifying the vendor-specific
 *                        error code
 *                        
 */
- (KMTransactionRolledBackException *) initWithReason:(NSString*)reason errorCode:(NSString*)errorCode;

/**
 * Initializes a KMTransactionRolledBackException with the 
 * specified reason. The error code defaults to nil.
 *
 * @param reason a description of the exception
 */
- (KMTransactionRolledBackException *) initWithReason:(NSString*)reason;

@end
