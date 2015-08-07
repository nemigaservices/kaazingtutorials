/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMDestination.h"

/**
 * A Queue object encapsulates a provider-specific queue name. 
 * It is the way a client specifies the identity of a queue to JMS API methods.
 * For those methods that use a Destination as a parameter, a 
 * Queue object used as an argument. For example, a queue can
 * be used  to create a MessageConsumer and a 
 * MessageProducer by calling:
 *
 * -  [KMSession createConsumer:]
 * -  [KMSession createProducer:]
 *
 * The actual length of time messages are held by a queue and the 
 * consequences of resource overflow are not defined by the JMS API.
 *
 * @warning Queue names should be prefixed with `/queue/` regardless of the 
 * message broker in use.
 *
 * `KMQueue *queue = [session createQueue:@"/queue/destination"]`
 *
 * For example, `/queue/destination` can be passed
 * to [KMSession createQueue:].
 *
 * See the Gateway configuration for details
 * on how queue names are mapped to specific JMS Brokers.
 *
 * @see [KMSession createConsumer:]
 * @see [KMSession createProducer:]
 * @see [KMSession createQueue:]
 */
@interface KMQueue : KMDestination

/**
 * Gets the name of this queue.
 *  
 * Clients that depend upon the name are not portable.
 *  
 * @return the queue name
 *  
 * @exception KMJMSException if the JMS provider implementation of 
 *                         Queue fails to return the queue
 *                         name due to some internal
 *                         error.
 */
- (NSString*) queueName;

/**
 * Returns a string representation of this object.
 *
 * @return the provider-specific identity values for this queue
 */
- (NSString*) toString;

@end
