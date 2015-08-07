/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMMessageConsumer.h"
#import "KMQueue.h"

#if NOT_IMPLEMENTED

/**
 * A client uses a QueueReceiver object to receive messages that 
 * have been delivered to a queue.
 *
 * _*KMQueueReceiver is a JMS 1.0 API. KMMessageConsumer should be used instead.*_
 *
 * Although it is possible to have multiple QueueReceivers 
 * for the same queue, the JMS API does not define how messages are 
 * distributed between the QueueReceivers.
 *
 * If a QueueReceiver specifies a message selector, the 
 * messages that are not selected remain on the queue. By definition, a message
 * selector allows a QueueReceiver to skip messages. This 
 * means that when the skipped messages are eventually read, the total ordering
 * of the reads does not retain the partial order defined by each message 
 * producer. Only QueueReceivers without a message selector
 * will read messages in message producer order.
 *
 * Creating a MessageConsumer provides the same features as
 * creating a QueueReceiver. A MessageConsumer object is 
 * recommended for creating new code.
 *
 * @see [KMSession createConsumer:]
 * @see KMMessageConsumer
 */
@interface KMQueueReceiver : KMMessageConsumer

/**
 * Gets the Queue associated with this queue receiver.
 *  
 * @return this receiver's Queue 
 *  
 * @exception KMJMSException if the JMS provider fails to get the queue for
 *                         this queue receiver
 *                         due to some internal error.
 */
- (KMQueue *) queue;

@end

#endif
