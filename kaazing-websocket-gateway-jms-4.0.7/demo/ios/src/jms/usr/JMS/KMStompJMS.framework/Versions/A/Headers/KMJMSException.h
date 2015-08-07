/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KCException.h"

/**
 *
 * This is the root class of all JMS API exceptions.
 *
 * It provides the following information:
 *
 *   -  A provider-specific string describing the error. This string is 
 *        the standard exception message and is available via the
 *        getMessage method.
 *   -  A provider-specific string error code 
 *   -  A reference to another exception. Often a JMS API exception will 
 *        be the result of a lower-level problem. If appropriate, this 
 *        lower-level exception can be linked to the JMS API exception.
 */
@interface KMJMSException : KCException

/**
 * Initializes the exception with the specified reason and 
 *  error code.
 *
 *  @param reason a description of the exception
 *  @param errorCode a string specifying the vendor-specific
 *                        error code
 */
- (KMJMSException *) initWithReason:(NSString *)reason errorCode:(NSString *)errorCode;

/**
 * Initializes the exception with the specified reason and with
 * the error code defaulting to nil.
 *
 *  @param reason a description of the exception
 */
- (KMJMSException *) initWithReason:(NSString *)reason;

/**
 * Initializes using another exception 
 8
 *  @param exception the nested exception
 */
- (KMJMSException *) initWithException:(NSException *)exception;

/**
 * Gets the vendor-specific error code.
 *
 * @return a string specifying the vendor-specific
 *                        error code
 */
- (NSString *) errorCode;

/**
 *
 * Gets the exception linked to this one.
 *
 * @return the linked Exception, nil if none
 */
- (NSException *) linkedException;

/**
 * Adds a linked Exception.
 *
 * @param exception the linked Exception, or nil to unset
 */
- (void) setLinkedException:(NSException *)exception;

@end

@interface KMJMSIllegalStateException : KMJMSException
@end
