/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMServerSession.h"

#if NOT_IMPLEMENTED

/**
 * A ServerSessionPool object is an object implemented by an 
 * application server to provide a pool of ServerSession objects 
 * for processing the messages of a ConnectionConsumer (optional).
 *
 * Its only method is getServerSession. The JMS API does not 
 * architect how the pool is implemented. It could be a static pool of 
 * ServerSession objects, or it could use a sophisticated 
 * algorithm to dynamically create ServerSession objects as 
 * needed.
 *
 * If the ServerSessionPool is out of 
 * ServerSession objects, the getServerSession call 
 * may block. If a ConnectionConsumer is blocked, it cannot 
 * deliver new messages until a ServerSession is 
 * eventually returned.
 *
 *
 * @see KMServerSession
 */
@interface KMServerSessionPool : KCObject

/**
 * Return a server session from the pool.
 *
 * @return a server session from the pool
 *  
 * @exception KMJMSException if an application server fails to
 *                         return a ServerSession out of its
 *                         server session pool.
 */
- (KMServerSession *) serverSession;

@end

#endif
