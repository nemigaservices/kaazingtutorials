/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMGenericException.h"

/**
 * Exception raised when a JMS Transaction has reported back as not
 * committed prior to connection close. It is possible that the
 * transaction was committed by the broker, but a network interruption
 * caused the receipt to be lost in flight.
 */
@interface KMTransactionNotCommittedException : KMGenericException

@end
