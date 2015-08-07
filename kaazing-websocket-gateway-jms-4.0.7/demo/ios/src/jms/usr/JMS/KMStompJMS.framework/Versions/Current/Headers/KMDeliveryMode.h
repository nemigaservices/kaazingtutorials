/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import <Foundation/Foundation.h>

#define KMDeliveryModeNonPersistent 1
#define KMDeliveryModePersistent    2

/**
 * The delivery modes supported by the JMS API are _KMDeliveryModePersistent_
 * (PERSISTENT) and _KMDeliveryModeNonPersistent_ (NON_PERSISTENT).
 *
 * A client marks a message as persistent if it feels that the 
 * application will have problems if the message is lost in transit.
 * A client marks a message as non-persistent if an occasional
 * lost message is tolerable. Clients use delivery mode to tell a
 * JMS provider how to balance message transport reliability with throughput.
 *
 * Delivery mode covers only the transport of the message to its 
 * destination. Retention of a message at the destination until
 * its receipt is acknowledged is not guaranteed by a PERSISTENT 
 * delivery mode. Clients should assume that message retention 
 * policies are set administratively. Message retention policy
 * governs the reliability of message delivery from destination
 * to message consumer. For example, if a client's message storage 
 * space is exhausted, some messages may be dropped in accordance with 
 * a site-specific message retention policy.
 *
 * A message is guaranteed to be delivered once and only once
 * by a JMS provider if the delivery mode of the message is 
 * PERSISTENT 
 * and if the destination has a sufficient message retention policy.
 *
 * <H2>Delivery Mode Constants</H2>
 *
 * _KMDeliveryModeNonPersistent_
 *
 * This is the lowest-overhead delivery mode because it does not require 
 * that the message be logged to stable storage. The level of JMS provider
 * failure that causes a NON_PERSISTENT message to be lost is 
 * not defined.
 *
 * A JMS provider must deliver a NON_PERSISTENT message with an
 * at-most-once guarantee. This means that it may lose the message, but it 
 * must not deliver it twice.
 *
 * _KMDeliveryModePersistent_
 *
 * This delivery mode instructs the JMS provider to log the message to stable 
 * storage as part of the client's send operation. Only a hard media 
 * failure should cause a PERSISTENT message to be lost.
 */
@interface KMDeliveryMode : NSObject
@end
