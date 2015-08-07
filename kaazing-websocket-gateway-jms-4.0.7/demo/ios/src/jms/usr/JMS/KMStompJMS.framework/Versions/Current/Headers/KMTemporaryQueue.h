/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMQueue.h"

/**
 * A TemporaryQueue object is a unique Queue object 
 * created for the duration of a Connection. It is a 
 * system-defined queue that can be consumed only by the 
 * Connection that created it.
 * 
 * A TemporaryQueue object can be created at either the 
 * Session or QueueSession level. Creating it at the
 * Session level allows to the TemporaryQueue to 
 * participate in transactions with objects from the Pub/Sub  domain. 
 * If it is created at the QueueSession, it will only
 * be able participate in transactions with objects from the PTP domain.
 *
 * @warning TemporaryQueue objects are destroyed when the client loses
 * its connection to the Gateway, or the Gateway connection to the message
 * broker or other back-end system is interrupted.  A new TemporaryQueue
 * must be created.  Monitor [KMConnection exceptionListener] to handle
 * recovery for your application based on reported exceptions:
 *
 * - KMConnectionDroppedException
 * - KMConnectionInterruptedException
 * - KMConnectionRestoredException
 *
 * @see [KMSession createTemporaryQueue]
 */
@interface KMTemporaryQueue : KMQueue

/**
 * Deletes this temporary queue. If there are existing receivers
 * still using it, a KMJMSException will be thrown.
 *  
 * @exception KMJMSException if the JMS provider fails to delete the 
 *                         temporary queue due to some internal error.
 */
- (void) delete;

@end
