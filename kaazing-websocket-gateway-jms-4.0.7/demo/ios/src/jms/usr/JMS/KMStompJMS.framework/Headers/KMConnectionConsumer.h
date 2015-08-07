/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#include "KMServerSessionPool.h"

#if NOT_IMPLEMENTED

/**
 * For application servers, Connection objects provide a special 
 * facility for creating a ConnectionConsumer (optional). The messages it 
 * is to consume are specified by a Destination and a message selector. 
 * In addition, a ConnectionConsumer must be given a 
 * ServerSessionPool to use for processing its messages.
 *
 * Normally, when traffic is light, a ConnectionConsumer gets a
 * ServerSession from its pool, loads it with a single message, and
 * starts it. As traffic picks up, messages can back up. If this happens, 
 * a ConnectionConsumer can load each ServerSession
 * with more than one 
 * message. This reduces the thread context switches and minimizes resource 
 * use at the expense of some serialization of message processing.
 *
 * @see [KMConnection createConnectionConsumer:messageSelector:sessionPool:maxMessages:]
 * @see [KMConnection createDurableConnectionConsumer:subscriptionName:messageSelector:sessionPool:maxMessages:]
 */
@interface KMConnectionConsumer : KCObject

/**
 * Gets the server session pool associated with this connection consumer.
 *  
 * @return the server session pool used by this connection consumer
 *  
 * @exception KMJMSException if the JMS provider fails to get the server 
 *                         session pool associated with this consumer due
 *                         to some internal error.
 */
- (KMServerSessionPool *) serverSessionPool;

/**
 * Closes the connection consumer.
 *
 * Since a provider may allocate some resources on behalf of a 
 * connection consumer outside the Java virtual machine, clients should 
 * close these resources when
 * they are not needed. Relying on garbage collection to eventually 
 * reclaim these resources may not be timely enough.
 *  
 * @exception KMJMSException if the JMS provider fails to release resources 
 *                         on behalf of the connection consumer or fails
 *                         to close the connection consumer.
 */
- (void) close;

@end

#endif
