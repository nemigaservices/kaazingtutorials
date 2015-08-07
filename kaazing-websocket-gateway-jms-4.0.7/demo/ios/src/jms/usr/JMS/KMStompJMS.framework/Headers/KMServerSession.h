/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMSession.h"

#if NOT_IMPLEMENTED

/**
 * A ServerSession object is an application server object that 
 * is used by a server to associate a thread with a JMS session (optional).
 *
 * A ServerSession implements two methods:
 *
 *   - getSession - returns the ServerSession's 
 *       JMS session.
 *   - start - starts the execution of the 
 *       ServerSession 
 *       thread and results in the execution of the JMS session's 
 *       run method.
 *
 * A ConnectionConsumer implemented by a JMS provider uses a 
 * ServerSession to process one or more messages that have 
 * arrived. It does this by getting a ServerSession from the 
 * ConnectionConsumer's ServerSessionPool; getting 
 * the ServerSession's JMS session; loading it with the messages; 
 * and then starting the ServerSession.
 *
 * In most cases the ServerSession will register some object 
 * it provides as the ServerSession's thread run object. The 
 * ServerSession's start method will call the 
 * thread's start method, which will start the new thread, and 
 * from it, call the run method of the 
 * ServerSession's run object. This object will do some 
 * housekeeping and then call the Session's run 
 * method. When run returns, the ServerSession's run 
 * object can return the ServerSession to the 
 * ServerSessionPool, and the cycle starts again.
 *
 * Note that the JMS API does not architect how the 
 * ConnectionConsumer loads the Session with 
 * messages. Since both the ConnectionConsumer and 
 * Session are implemented by the same JMS provider, they can 
 * accomplish the load using a private mechanism.
 *
 *
 * @see KMServerSessionPool
 * @see KMConnectionConsumer
 */
@interface KMServerSession : KCObject

/**
 * Return the ServerSession's Session. This must 
 * be a Session created by the same Connection 
 * that will be dispatching messages to it. The provider will assign one or
 * more messages to the Session 
 * and then call start on the ServerSession.
 *
 * @return the server session's session
 *  
 * @exception KMJMSException if the JMS provider fails to get the associated
 *                         session for this ServerSession due
 *                         to some internal error.
 */
- (KMSession *) session;

/**
 * Cause the Session's run method to be called 
 * to process messages that were just assigned to it.
 *  
 * @exception KMJMSException if the JMS provider fails to start the server
 *                         session to process messages due to some internal
 *                         error.
 */
- (void) start;

@end

#endif
