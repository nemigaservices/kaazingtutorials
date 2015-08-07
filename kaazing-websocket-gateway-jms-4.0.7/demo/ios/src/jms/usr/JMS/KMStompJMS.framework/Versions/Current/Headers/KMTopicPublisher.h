/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMMessageProducer.h"
#import "KMTopic.h"

#if NOT_IMPLEMENTED

/**
 * A client uses a TopicPublisher object to publish messages on a 
 * topic. A TopicPublisher object is the publish-subscribe form
 * of a message producer.
 *
 * _*KMTopicPublisher is a JMS 1.0 API. KMMessageProducer should be used instead.*_
 *
 * Normally, the Topic is specified when a 
 * TopicPublisher is created.  In this case, an attempt to use 
 * the publish methods for an unidentified 
 * TopicPublisher will throw a KMUnsupportedOperationException.
 *
 * If the TopicPublisher is created with an unidentified 
 * Topic, an attempt to use the publish methods that 
 * assume that the Topic has been identified will throw a
 * KMUnsupportedOperationException.
 *
 * During the execution of its publish method,
 * a message must not be changed by other threads within the client. 
 * If the message is modified, the result of the publish is 
 * undefined.
 * 
 * After publishing a message, a client may retain and modify it
 * without affecting the message that has been published. The same message
 * object may be published multiple times.
 * 
 * The following message headers are set as part of publishing a 
 * message: JMSDestination, JMSDeliveryMode, 
 * JMSExpiration, JMSPriority, 
 * JMSMessageID and JMSTimeStamp.
 * When the message is published, the values of these headers are ignored. 
 * After completion of the publish, the headers hold the values 
 * specified by the method publishing the message. It is possible for the 
 * publish method not to set JMSMessageID and JMSTimeStamp if the 
 * setting of these headers is explicitly disabled by the 
 * MessageProducer.setDisableMessageID or
 * MessageProducer.setDisableMessageTimestamp method.
 *
 * Creating a MessageProducer provides the same features as
 * creating a TopicPublisher. A MessageProducer object is 
 * recommended when creating new code.
 *
 * Because TopicPublisher inherits from 
 * MessageProducer, it inherits the
 * send methods that are a part of the MessageProducer 
 * interface. Using the send methods will have the same
 * effect as using the
 * publish methods: they are functionally the same.
 * 
 * @see [KMSession createProducer:]
 */
@interface KMTopicPublisher : KMMessageProducer

/**
 * Gets the topic associated with this TopicPublisher.
 *
 * @return this publisher's topic
 *  
 * @exception KMJMSException if the JMS provider fails to get the topic for
 *                         this TopicPublisher
 *                         due to some internal error.
 */
- (KMTopic *) topic;

/**
 * Publishes a message to the topic.
 * Uses the TopicPublisher's default delivery mode, priority,
 * and time to live.
 *
 * @param message the message to publish
 *
 * @exception KMJMSException if the JMS provider fails to publish the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if an invalid message is specified.
 * @exception KMInvalidDestinationException if a client uses this method
 *                         with a TopicPublisher with
 *                         an invalid topic.
 * 
 * @see [KMMessageProducer deliveryMode]
 * @see [KMMessageProducer timeToLive]
 * @see [KMMessageProducer priority]
 */
- (void) publish:(KMMessage *)message;

/**
 * Publishes a message to the topic, specifying delivery mode,
 * priority, and time to live.
 *
 * @param message the message to publish
 * @param deliveryMode the delivery mode to use
 * @param priority the priority for this message
 * @param timeToLive the message's lifetime (in milliseconds)
 *
 * @exception KMJMSException if the JMS provider fails to publish the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if an invalid message is specified.
 * @exception KMInvalidDestinationException if a client uses this method
 *                         with a TopicPublisher with
 *                         an invalid topic.
 */
- (void) publish:(KMMessage *)message deliveryMode:(int)deliveryMode priority:(int)priority
                                        timeToLive:(long long)timeToLive;

/**
 * Publishes a message to a topic for an unidentified message producer. 
 * Uses the TopicPublisher's default delivery mode, 
 * priority, and time to live.
 * 
 * Typically, a message producer is assigned a topic at creation 
 * time; however, the JMS API also supports unidentified message producers,
 * which require that the topic be supplied every time a message is
 * published.
 * 
 *
 * @param topic the topic to publish this message to
 * @param message the message to publish
 *  
 * @exception KMJMSException if the JMS provider fails to publish the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if an invalid message is specified.
 * @exception KMInvalidDestinationException if a client uses
 *                         this method with an invalid topic.
 * 
 * @see [KMMessageProducer deliveryMode]
 * @see [KMMessageProducer timeToLive]
 * @see [KMMessageProducer priority]
 */
- (void) publish:(KMTopic *)topic message:(KMMessage *)message;

/**
 * Publishes a message to a topic for an unidentified message 
 * producer, specifying delivery mode, priority and time to live.
 * Typically, a message producer is assigned a topic at creation
 * time; however, the JMS API also supports unidentified message producers,
 * which require that the topic be supplied every time a message is
 * published.
 * 
 *
 * @param topic the topic to publish this message to
 * @param message the message to publish
 * @param deliveryMode the delivery mode to use
 * @param priority the priority for this message
 * @param timeToLive the message's lifetime (in milliseconds)
 *  
 * @exception KMJMSException if the JMS provider fails to publish the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if an invalid message is specified.
 * @exception KMInvalidDestinationException if a client uses
 *                         this method with an invalid topic.
 */
- (void) publish:(KMTopic *)topic message:(KMMessage *)message deliveryMode:(int)deliveryMode priority:(int)priority
                               timeToLive:(long long)timeToLive;

@end

#endif
