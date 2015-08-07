/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMDestination.h"

/**
 * A Topic object encapsulates a provider-specific topic name. 
 * It is the way a client specifies the identity of a topic to JMS API methods.
 * For those methods that use a Destination as a parameter, a 
 * Topic object may used as an argument . For 
 * example, a Topic can be used to create a MessageConsumer
 * and a MessageProducer
 * by calling:
 *
 * - [KMSession createConsumer:]
 * - [KMSession createProducer:]
 *
 * Many publish/subscribe (pub/sub) providers group topics into hierarchies 
 * and provide various options for subscribing to parts of the hierarchy. The 
 * JMS API places no restriction on what a Topic object 
 * represents. It may be a leaf in a topic hierarchy, or it may be a larger 
 * part of the hierarchy.
 *
 * The organization of topics and the granularity of subscriptions to 
 * them is an important part of a pub/sub application's architecture. The JMS 
 * API does not specify a policy for how this should be done. If an application 
 * takes advantage of a provider-specific topic-grouping mechanism, it 
 * should document this. If the application is installed using a different 
 * provider, it is the job of the administrator to construct an equivalent 
 * topic architecture and create equivalent Topic objects.
 *
 * @warning Topic names should be prefixed with `/topic/` regardless of the 
 * message broker in use.
 *
 * For example, `/topic/destination` can be passed
 * to [KMSession createTopic:].
 *
 * `KMTopic *topic = [session createTopic:@"/topic/destination"]`
 *
 * See the Gateway configuration for details
 * on how topic names are mapped to specific JMS Brokers.
 *
 * @see [KMSession createConsumer:]
 * @see [KMSession createProducer:]
 * @see [KMTopicSession createTopic:] 
 */
@interface KMTopic : KMDestination

/**
 * Gets the name of this topic.
 *  
 * Clients that depend upon the name are not portable.
 *  
 * @return the topic name
 *  
 * @exception KMJMSException if the JMS provider implementation of 
 *                         Topic fails to return the topic
 *                         name due to some internal
 *                         error.
 */
- (NSString*) topicName;

/**
 * Returns a string representation of this object.
 *
 * @return the provider-specific identity values for this topic
 */
- (NSString*) toString;

@end
