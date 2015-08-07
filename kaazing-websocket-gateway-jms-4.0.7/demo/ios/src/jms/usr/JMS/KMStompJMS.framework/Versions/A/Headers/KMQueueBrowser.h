/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import "KMQueue.h"

/**
 * A client uses a KMQueueBrowser object to look at messages on a 
 * queue without removing them.
 *
 * The getEnumeration method returns an NSEnumerator to scan 
 * the queue's messages. It may be an enumeration of the entire content of a 
 * queue, or it may contain only the messages matching a message selector.
 *
 * Messages may be arriving and expiring while the scan is done. The JMS API
 * does not require the content of an enumeration to be a static snapshot of
 * queue content. Whether these changes are visible or not depends on the JMS 
 * provider.
 *
 * A KMQueueBrowser can be created from either a Session.
 *
 * @see [KMSession createBrowser:]
 */
@interface KMQueueBrowser : KCObject

/**
 * Gets the queue associated with this queue browser.
 * 
 * @return the queue
 *  
 * @exception KMJMSException if the JMS provider fails to get the
 *                         queue associated with this browser
 *                         due to some internal error.
 */
- (KMQueue *) queue;

/**
 * Gets this queue browser's message selector expression.
 *  
 * @return this queue browser's message selector, or null if no
 *         message selector exists for the message consumer (that is, if 
 *         the message selector was not set or was set to null or the 
 *         empty string)
 *
 * @exception KMJMSException if the JMS provider fails to get the
 *                         message selector for this browser
 *                         due to some internal error.
 */
- (NSString*) messageSelector;

/**
 * Gets an enumeration for browsing the current queue messages in the
 * order they would be received.
 *
 * @return an enumeration for browsing the messages
 *  
 * @exception KMJMSException if the JMS provider fails to get the
 *                         enumeration for this browser
 *                         due to some internal error.
 */
- (NSEnumerator*) enumeration;

/**
 * Closes the QueueBrowser.
 *
 * Since a provider may allocate some resources on behalf of a 
 * QueueBrowser outside the Java virtual machine, clients should close them
 * when they 
 * are not needed. Relying on garbage collection to eventually reclaim 
 * these resources may not be timely enough.
 *
 * @exception KMJMSException if the JMS provider fails to close this
 *                         browser due to some internal error.
 */
- (void) close;

@end

