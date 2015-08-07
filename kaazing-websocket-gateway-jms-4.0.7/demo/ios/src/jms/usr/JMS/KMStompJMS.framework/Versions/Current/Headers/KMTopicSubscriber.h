/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMMessageConsumer.h"
#import "KMTopic.h"

/**
 * A client uses a TopicSubscriber object to receive messages that
 * have been published to a topic. A TopicSubscriber object is the
 * publish/subscribe form of a message consumer. A durable TopicSubscriber can
 * be created using Session.createDurableSubscriber.
 *
 * If a client needs to receive all the messages published on a topic, 
 * including the ones published while the subscriber is inactive, it uses 
 * a durable TopicSubscriber. The JMS provider retains a record of
 * this durable subscription and insures that all messages from the topic's
 * publishers are retained until they are acknowledged by this durable 
 * subscriber or they have expired.
 *
 * A Session allows the creation of multiple 
 * TopicSubscriber objects per topic.  It will deliver each 
 * message for a topic to each
 * subscriber eligible to receive it. Each copy of the message
 * is treated as a completely separate message. Work done on one copy has
 * no effect on the others; acknowledging one does not acknowledge the
 * others; one message may be delivered immediately, while another waits
 * for its subscriber to process messages ahead of it.
 *
 * Messages filtered out by a subscriber's message selector will never 
 * be delivered to the subscriber. From the subscriber's perspective, they 
 * do not exist.
 *
 * In some cases, a connection may both publish and subscribe to a topic.
 * The subscriber NoLocal attribute allows a subscriber to inhibit
 * the delivery of messages published by its own connection.
 *
 * Sessions with durable subscribers must always provide the same client 
 * identifier. In addition, each client must specify a name that uniquely 
 * identifies (within client identifier) each durable subscription it creates.
 * Only one session at a time can have a TopicSubscriber for a 
 * particular durable subscription. 
 *
 * A client can change an existing durable subscription by creating a 
 * durable TopicSubscriber with the same name and a new topic 
 * and/or message 
 * selector. Changing a durable subscription is equivalent to unsubscribing 
 * (deleting) the old one and creating a new one.
 *
 * The unsubscribe method is used to delete a durable 
 * subscription. The unsubscribe method can be used at the 
 * Session or TopicSession level.
 * This method deletes the state being 
 * maintained on behalf of the subscriber by its provider.
 *
 * @see [KMSession createConsumer:]
 * @see [KMSession createDurableSubscriber:name:]
 * @see KMMessageConsumer
 */
@interface KMTopicSubscriber : KMMessageConsumer

/**
 * Gets the Topic associated with this subscriber.
 *  
 * @return this subscriber's Topic
 *  
 * @exception KMJMSException if the JMS provider fails to get the topic for
 *                         this topic subscriber
 *                         due to some internal error.
 */
- (KMTopic *) topic;

/**
 * Gets the NoLocal attribute for this subscriber. 
 * The default value for this attribute is false.
 *  
 * @return true if locally published messages are being inhibited
 *  
 * @exception KMJMSException if the JMS provider fails to get the
 *                         NoLocal attribute for
 *                         this topic subscriber
 *                         due to some internal error.
 */
- (BOOL) noLocal;

@end

