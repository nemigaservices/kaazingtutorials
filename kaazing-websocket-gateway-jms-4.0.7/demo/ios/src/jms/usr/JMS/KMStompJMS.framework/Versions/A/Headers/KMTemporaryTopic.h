/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMTopic.h"

/**
 * A TemporaryTopic object is a unique Topic object 
 * created for the duration of a Connection. It is a 
 * system-defined topic that can be consumed only by the 
 * Connection that created it.
 *
 * A TemporaryTopic object can be created either at the 
 * Session or TopicSession level. Creating it at the
 * Session level allows the TemporaryTopic to participate
 * in the same transaction with objects from the PTP domain. 
 * If a TemporaryTopic is created at the TopicSession, it will only
 * be able participate in transactions with objects from the Pub/Sub domain.
 *
 * @warning TemporaryTopic objects are destroyed when the client loses
 * its connection to the Gateway, or when the Gateway connection to the message
 * broker or other back-end system is interrupted.  A new TemporaryTopic
 * must be created.  Monitor [KMConnection exceptionListener] to handle
 * recovery for your application based on reported exceptions:
 *
 * - KMConnectionDroppedException
 * - KMConnectionInterruptedException
 * - KMConnectionRestoredException
 *
 * @see [KMSession createTemporaryTopic]
 */
@interface KMTemporaryTopic : KMTopic

/**
 * Deletes this temporary topic. If there are existing subscribers
 * still using it, a KMJMSException will be thrown.
 *  
 * @exception KMJMSException if the JMS provider fails to delete the
 *                         temporary topic due to some internal error.
 */
- (void) delete;

@end

