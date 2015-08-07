/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMSession.h"
#import "KMTopicPublisher.h"

#ifdef NOT_IMPLEMENTED

/**
 * A TopicSession object provides methods for creating 
 * TopicPublisher, TopicSubscriber, and 
 * TemporaryTopic objects. It also provides a method for 
 * deleting its client's durable subscribers.
 *
 * _*KMTopicSession is a JMS 1.0 API. KMSession should be used instead.*_
 *
 * A TopicSession is used for creating Pub/Sub specific
 * objects. In general, use the  Session object, and 
 * use TopicSession  only to support
 * existing code. Using the Session object simplifies the 
 * programming model, and allows transactions to be used across the two 
 * messaging domains.
 * 
 * A TopicSession cannot be used to create objects specific to the 
 * point-to-point domain. The following methods inherit from 
 * Session, but must throw an 
 * KMIllegalStateException 
 * if used from TopicSession:
 *
 *   - createBrowser
 *   - createQueue
 *   - createTemporaryQueue
 *
 * @see KMSession
 * @see [KMConnection createSession:transacted:]
 */
@interface KMTopicSession : KMSession

/**
 * Creates a topic identity given a Topic name.
 *
 * This facility is provided for the rare cases where clients need to
 * dynamically manipulate topic identity. This allows the creation of a
 * topic identity with a provider-specific name. Clients that depend 
 * on this ability are not portable.
 *
 * Note that this method is not for creating the physical topic. 
 * The physical creation of topics is an administrative task and is not
 * to be initiated by the JMS API. The one exception is the
 * creation of temporary topics, which is accomplished with the 
 * createTemporaryTopic method.
 *  
 * @param topicName the name of this Topic
 *
 * @return a Topic with the given name
 *
 * @exception KMJMSException if the session fails to create a topic
 *                         due to some internal error.
 */
- (KMTopic *) createTopic:(NSString*)topicName;

/**
 * Creates a nondurable subscriber to the specified topic.
 *  
 * A client uses a TopicSubscriber object to receive 
 * messages that have been published to a topic.
 *
 * Regular TopicSubscriber objects are not durable. 
 * They receive only messages that are published while they are active.
 *
 * In some cases, a connection may both publish and subscribe to a 
 * topic. The subscriber NoLocal attribute allows a subscriber
 * to inhibit the delivery of messages published by its own connection.
 * The default value for this attribute is false.
 *
 * @param topic the Topic to subscribe to
 *  
 * @exception KMJMSException if the session fails to create a subscriber
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid topic is specified.
 */
- (KMTopicSubscriber *) createSubscriber:(KMTopic *)topic;

/**
 * Creates a nondurable subscriber to the specified topic, using a
 * message selector or specifying whether messages published by its
 * own connection should be delivered to it.
 *
 * A client uses a TopicSubscriber object to receive 
 * messages that have been published to a topic.
 *  
 * Regular TopicSubscriber objects are not durable. 
 * They receive only messages that are published while they are active.
 *
 * Messages filtered out by a subscriber's message selector will 
 * never be delivered to the subscriber. From the subscriber's 
 * perspective, they do not exist.
 *
 * In some cases, a connection may both publish and subscribe to a 
 * topic. The subscriber NoLocal attribute allows a subscriber
 * to inhibit the delivery of messages published by its own connection.
 * The default value for this attribute is false.
 *
 * @param topic the Topic to subscribe to
 * @param messageSelector only messages with properties matching the
 * message selector expression are delivered. A value of null or
 * an empty string indicates that there is no message selector 
 * for the message consumer.
 * @param noLocal if set, inhibits the delivery of messages published
 * by its own connection
 * 
 * @exception KMJMSException if the session fails to create a subscriber
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid topic is specified.
 * @exception KMInvalidSelectorException if the message selector is invalid.
 */
- (KMTopicSubscriber *) createSubscriber:(KMTopic *)topic
                         messageSelector:(NSString*)messageSelector
                                 noLocal:(BOOL)noLocal;

/**
 * Creates a durable subscriber to the specified topic.
 *  
 * If a client needs to receive all the messages published on a 
 * topic, including the ones published while the subscriber is inactive,
 * it uses a durable TopicSubscriber. The JMS provider
 * retains a record of this 
 * durable subscription and insures that all messages from the topic's 
 * publishers are retained until they are acknowledged by this 
 * durable subscriber or they have expired.
 *
 * Sessions with durable subscribers must always provide the same 
 * client identifier. In addition, each client must specify a name that 
 * uniquely identifies (within client identifier) each durable 
 * subscription it creates. Only one session at a time can have a 
 * TopicSubscriber for a particular durable subscription.
 *
 * A client can change an existing durable subscription by creating 
 * a durable TopicSubscriber with the same name and a new 
 * topic and/or 
 * message selector. Changing a durable subscriber is equivalent to 
 * unsubscribing (deleting) the old one and creating a new one.
 *
 * In some cases, a connection may both publish and subscribe to a 
 * topic. The subscriber NoLocal attribute allows a subscriber
 * to inhibit the delivery of messages published by its own connection.
 * The default value for this attribute is false.
 *
 * @param topic the non-temporary Topic to subscribe to
 * @param name the name used to identify this subscription
 *  
 * @exception KMJMSException if the session fails to create a subscriber
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid topic is specified.
 */
- (KMTopicSubscriber *) createDurableSubscriber:(KMTopic *)topic
                                           name:(NSString*)name;

/**
 * Creates a durable subscriber to the specified topic, using a
 * message selector or specifying whether messages published by its
 * own connection should be delivered to it.
 *  
 * If a client needs to receive all the messages published on a 
 * topic, including the ones published while the subscriber is inactive,
 * it uses a durable TopicSubscriber. The JMS provider
 * retains a record of this 
 * durable subscription and insures that all messages from the topic's 
 * publishers are retained until they are acknowledged by this 
 * durable subscriber or they have expired.
 *
 * Sessions with durable subscribers must always provide the same
 * client identifier. In addition, each client must specify a name which
 * uniquely identifies (within client identifier) each durable
 * subscription it creates. Only one session at a time can have a
 * TopicSubscriber for a particular durable subscription.
 * An inactive durable subscriber is one that exists but
 * does not currently have a message consumer associated with it.
 *
 * A client can change an existing durable subscription by creating 
 * a durable TopicSubscriber with the same name and a new 
 * topic and/or 
 * message selector. Changing a durable subscriber is equivalent to 
 * unsubscribing (deleting) the old one and creating a new one.
 *
 * @param topic the non-temporary Topic to subscribe to
 * @param name the name used to identify this subscription
 * @param messageSelector only messages with properties matching the
 * message selector expression are delivered.  A value of null or
 * an empty string indicates that there is no message selector 
 * for the message consumer.
 * @param noLocal if set, inhibits the delivery of messages published
 * by its own connection
 *  
 * @exception KMJMSException if the session fails to create a subscriber
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid topic is specified.
 * @exception KMInvalidSelectorException if the message selector is invalid.
 */
- (KMTopicSubscriber *) createDurableSubscriber:(KMTopic *)topic
                                           name:(NSString*)name
                                messageSelector:(NSString*)messageSelector
                                        noLocal:(BOOL)noLocal;

/**
 * Creates a publisher for the specified topic.
 *
 * A client uses a TopicPublisher object to publish 
 * messages on a topic.
 * Each time a client creates a TopicPublisher on a topic, it
 * defines a 
 * new sequence of messages that have no ordering relationship with the 
 * messages it has previously sent.
 *
 * @param topic the Topic to publish to, or null if this is an
 * unidentified producer
 *
 * @exception KMJMSException if the session fails to create a publisher
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid topic is specified.
 */
- (KMTopicPublisher *) createPublisher:(KMTopic *)topic;

/**
 * Creates a TemporaryTopic object. Its lifetime will be that 
 * of the TopicConnection unless it is deleted earlier.
 *
 * @return a temporary topic identity
 *
 * @exception KMJMSException if the session fails to create a temporary
 *                         topic due to some internal error.
 */
- (KMTemporaryTopic *) createTemporaryTopic;

/**
 * Unsubscribes a durable subscription that has been created by a client.
 *  
 * This method deletes the state being maintained on behalf of the 
 * subscriber by its provider.A
 *
 * It is erroneous for a client to delete a durable subscription
 * while there is an active TopicSubscriber for the 
 * subscription, or while a consumed message is part of a pending 
 * transaction or has not been acknowledged in the session.
 *
 * @param name the name used to identify this subscription
 *  
 * @exception KMJMSException if the session fails to unsubscribe to the 
 *                         durable subscription due to some internal error.
 * @exception KMInvalidDestinationException if an invalid subscription name
 *                                        is specified.
 */
- (void) unsubscribe:(NSString*)name;

@end

#endif
