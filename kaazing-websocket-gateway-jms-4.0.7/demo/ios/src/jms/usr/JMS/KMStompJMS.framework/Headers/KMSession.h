/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KCObject.h"
#import "KMMessageListener.h"
#import "KMBytesMessage.h"
#import "KMMapMessage.h"
#import "KMMessage.h"
#import "KMMessageConsumer.h"
#import "KMMessageProducer.h"
#import "KMQueueBrowser.h"
#import "KMStreamMessage.h"
#import "KMTopicSubscriber.h"
#import "KMTextMessage.h"
#import "KMTopic.h"
#import "KMTemporaryQueue.h"
#import "KMTemporaryTopic.h"

#define KMSessionAutoAcknowledge   1
#define KMSessionClientAcknowledge 2
#define KMSessionDupsOKAcknowledge 3
#define KMSessionNotifyAcknowledge 4
#define KMSessionTransacted        0

/**
 * A Session object is a single-threaded context for producing and consuming 
 * messages. Although it may allocate provider resources outside the Java 
 * virtual machine (JVM), it is considered a lightweight JMS object.
 *
 * A session serves several purposes:
 *
 * - It is a factory for its message producers and consumers.
 * - It supplies provider-optimized message factories.
 * - It is a factory for TemporaryTopics and TemporaryQueues.
 * - It provides a way to create Queue or Topic
 *      objects for those clients that need to dynamically manipulate 
 *      provider-specific destination names.
 * - It supports a single series of transactions that combine work 
 *       spanning its producers and consumers into atomic units.
 * - It defines a serial order for the messages it consumes and 
 *       the messages it produces.
 * - It retains messages it consumes until they have been 
 *       acknowledged.
 * - It serializes execution of message listeners registered with 
 *       its message consumers.
 * - It is a factory for QueueBrowsers.
 *
 * A session can create and service multiple message producers and 
 * consumers.
 *
 * One typical use is to have a thread block on a synchronous 
 * MessageConsumer until a message arrives. The thread may then
 * use one or more of the Session's MessageProducers.
 *
 * If a client desires to have one thread produce messages while others 
 * consume them, the client should use a separate session for its producing 
 * thread.
 *
 * Once a connection has been started, any session with one or more 
 * registered message listeners is dedicated to the thread of control that 
 * delivers messages to it. It is erroneous for client code to use this session
 * or any of its constituent objects from another thread of control. The
 * only exception to this rule is the use of the session or connection 
 * close method.
 *
 * It should be easy for most clients to partition their work naturally
 * into sessions. This model allows clients to start simply and incrementally
 * add message processing complexity as their need for concurrency grows.
 *
 * The close method is the only session method that can be 
 * called while some other session method is being executed in another thread.
 *
 * A session may be specified as transacted. Each transacted 
 * session supports a single series of transactions. Each transaction groups 
 * a set of message sends and a set of message receives into an atomic unit 
 * of work. In effect, transactions organize a session's input message 
 * stream and output message stream into series of atomic units. When a 
 * transaction commits, its atomic unit of input is acknowledged and its 
 * associated atomic unit of output is sent. If a transaction rollback is 
 * done, the transaction's sent messages are destroyed and the session's input 
 * is automatically recovered.
 *
 * The content of a transaction's input and output units is simply those 
 * messages that have been produced and consumed within the session's current 
 * transaction.
 *
 * A transaction is completed using either its session's commit
 * method or its session's rollback method. The completion of a
 * session's current transaction automatically begins the next. The result is
 * that a transacted session always has a current transaction within which its 
 * work is done.  
 *
 * The Java Transaction Service (JTS) or some other transaction monitor may 
 * be used to combine a session's transaction with transactions on other 
 * resources (databases, other JMS sessions, etc.). Since Java distributed 
 * transactions are controlled via the Java Transaction API (JTA), use of the 
 * session's commit and rollback methods in 
 * this context is prohibited.
 *
 * The JMS API does not require support for JTA; however, it does define 
 * how a provider supplies this support.
 *
 * Although it is also possible for a JMS client to handle distributed 
 * transactions directly, it is unlikely that many JMS clients will do this.
 * Support for JTA in the JMS API is targeted at systems vendors who will be 
 * integrating the JMS API into their application server products.
 *
 * <H2>Session Constants</H2>
 *
 * _KMSessionAutoAcknowledge_
 *
 * With this acknowledgment mode, the session automatically acknowledges
 * a client's receipt of a message either when the session has successfully 
 * returned from a call to receive or when the message 
 * listener the session has called to process the message successfully 
 * returns.
 *
 * _KMSessionClientAcknowledge_
 *
 * With this acknowledgment mode, the client acknowledges a consumed 
 * message by calling the message's acknowledge method. 
 * Acknowledging a consumed message acknowledges all messages that the 
 * session has consumed.
 *
 * When client acknowledgment mode is used, a client may build up a 
 * large number of unacknowledged messages while attempting to process 
 * them. A JMS provider should provide administrators with a way to 
 * limit client overrun so that clients are not driven to resource 
 * exhaustion and ensuing failure when some resource they are using 
 * is temporarily blocked.
 *
 * _KMSessionDupsOKAcknowledge_
 *
 * This acknowledgment mode instructs the session to lazily acknowledge 
 * the delivery of messages. This is likely to result in the delivery of 
 * some duplicate messages if the JMS provider fails, so it should only be 
 * used by consumers that can tolerate duplicate messages. Use of this  
 * mode can reduce session overhead by minimizing the work the 
 * session does to prevent duplicates.
 *
 * _KMSessionNotifyAcknowledge_
 * 
 * With this acknowledgement mode, a notifying-session is created that
 * allows creation of durable notifications using the device-token and the
 * bundle-identifier so that APNS can send notification to the device
 * for the specified app when it's not connected to the Gateway and the
 * app is not in the foreground.
 *
 * _KMSessionTransacted_
 *
 * This value is returned from acknowledgeMode if the session is transacted.
 * If a Session is transacted, the acknowledgement mode is ignored.
 *
 * @see [KMMessage acknowledge]
 */
@interface KMSession : KCObject

/**
 * Creates a BytesMessage object. A BytesMessage 
 * object is used to send a message containing a stream of uninterpreted 
 * bytes.
 *  
 * @exception KMJMSException if the JMS provider fails to create this message
 *                         due to some internal error.
 */
- (KMBytesMessage *) createBytesMessage;

/**
 * Creates a MapMessage object. A MapMessage 
 * object is used to send a self-defining set of name-value pairs, where 
 * names are String objects and values are primitive values 
 *.
 *  
 * @exception KMJMSException if the JMS provider fails to create this message
 *                         due to some internal error.
 */
- (KMMapMessage *) createMapMessage;

/**
 * Creates a Message object. The Message 
 * interface is the root interface of all JMS messages. A 
 * Message object holds all the 
 * standard message header information. It can be sent when a message 
 * containing only header information is sufficient.
 *  
 * @exception KMJMSException if the JMS provider fails to create this message
 *                         due to some internal error.
 */
- (KMMessage *) createMessage;

#if NOT_IMPLEMENTED
/**
 * Creates an ObjectMessage object. An 
 * ObjectMessage object is used to send a message 
 * that contains a serializable object.
 *  
 * @exception KMJMSException if the JMS provider fails to create this message
 *                         due to some internal error.
 */
- (KMObjectMessage *) createObjectMessage;

/**
 * Creates an initialized ObjectMessage object. An 
 * ObjectMessage object is used 
 * to send a message that contains a serializable object.
 *  
 * @param object the object to use to initialize this message
 *
 * @exception KMJMSException if the JMS provider fails to create this message
 *                         due to some internal error.
 */
- (KMObjectMessage *) createObjectMessage:(id <KCSerializable>)object;

/**
 * Creates a KMStreamMessage object. A KMStreamMessage object is used to send a 
 * self-defining stream of primitive values.
 *  
 * @exception KMJMSException if the JMS provider fails to create this message
 *                         due to some internal error.
 */
- (KMStreamMessage *) createStreamMessage;
#endif

/**
 * Creates a TextMessage object. A TextMessage 
 * object is used to send a message containing a String
 * object.
 *  
 * @exception KMJMSException if the JMS provider fails to create this message
 *                         due to some internal error.
 */
- (KMTextMessage *) createTextMessage;

/**
 * Creates an initialized TextMessage object. A 
 * TextMessage object is used to send 
 * a message containing a String.
 *
 * @param text the string used to initialize this message
 *
 * @exception KMJMSException if the JMS provider fails to create this message
 *                         due to some internal error.
 */
- (KMTextMessage *) createTextMessage:(NSString*)text;

/**
 * Indicates whether the session is in transacted mode.
 *  
 * @returns true if the session is in transacted mode
 *  
 * @exception KMJMSException if the JMS provider fails to return the 
 *                         transaction mode due to some internal error.
 */
- (BOOL) transacted;

/**
 * Returns the acknowledgement mode of the session. The acknowledgement
 * mode is set at the time that the session is created. If the session is
 * transacted, the acknowledgement mode is ignored.
 *
 * @returns If the session is not transacted, returns the 
 *                  current acknowledgement mode for the session.
 *                  If the session
 *                  is transacted, returns KMSessionTransacted.
 *
 * @exception KMJMSException if the JMS provider fails to return the 
 *                         acknowledgment mode due to some internal error.
 *
 * @see [KMConnection createSession:transacted:]
 */
- (int) acknowledgeMode;

/**
 * Commits all messages done in this transaction and releases any locks
 * currently held.
 * @exception KMJMSException if the JMS provider fails to commit the
 *                         transaction due to some internal error.
 * @exception KMTransactionRolledBackException if the transaction
 *                         is rolled back due to some internal error
 *                         during commit.
 * @exception KMIllegalStateException if the method is not called by a 
 *                         transacted session.
 */
- (void) commit;

/**
 * Rolls back any messages done in this transaction and releases any locks 
 * currently held.
 *
 * @exception KMJMSException if the JMS provider fails to roll back the
 *                         transaction due to some internal error.
 * @exception KMIllegalStateException if the method is not called by a 
 *                         transacted session.
 *                                     
 */
- (void) rollback;

/**
 * Closes the session.
 *
 * Since a provider may allocate some resources on behalf of a session 
 * outside the JVM, clients should close the resources when they are not 
 * needed. 
 * Relying on garbage collection to eventually reclaim these resources 
 * may not be timely enough.
 *
 * There is no need to close the producers and consumers
 * of a closed session. 
 *
 *  This call will block until a receive call or message 
 * listener in progress has completed. A blocked message consumer
 * receive call returns null when this session 
 * is closed.
 *
 * Closing a transacted session must roll back the transaction
 * in progress.
 * 
 * This method is the only Session method that can 
 * be called concurrently. 
 *
 * Invoking any other Session method on a closed session 
 * must throw a KMIllegalStateException. Closing a 
 * closed session must _not_ throw an exception.
 * 
 * @exception KMJMSException if the JMS provider fails to close the
 *                         session due to some internal error.
 */
- (void) close;

/**
 * Stops message delivery in this session, and restarts message delivery
 * with the oldest unacknowledged message.
 *  
 * All consumers deliver messages in a serial order.
 * Acknowledging a received message automatically acknowledges all 
 * messages that have been delivered to the client.
 *
 * Restarting a session causes it to take the following actions:
 *
 * - Stop message delivery
 * - Mark all messages that might have been delivered but not 
 *       acknowledged as "redelivered"
 * - Restart the delivery sequence including all unacknowledged 
 *       messages that had been previously delivered. Redelivered messages
 *       do not have to be delivered in 
 *       exactly their original delivery order.
 *
 * @exception KMJMSException if the JMS provider fails to stop and restart
 *                         message delivery due to some internal error.
 * @exception KMIllegalStateException if the method is called by a 
 *                         transacted session.
 */
- (void) recover;

/**
 * Returns the session's distinguished message listener (optional).
 *
 * @returns the message listener associated with this session
 *
 * @exception KMJMSException if the JMS provider fails to get the message 
 *                         listener due to an internal error.
 *
 * @see setMessageListener:
 * @see [KMMessageConsumer messageListener]
 */
- (id <KMMessageListener>) messageListener;

/**
 * Sets the session's distinguished message listener (optional).
 *
 * When the distinguished message listener is set, no other form of 
 * message receipt in the session can 
 * be used; however, all forms of sending messages are still supported.
 * 
 * This is an expert facility not used by regular JMS clients.
 *
 * @param listener the message listener
 *
 * @exception KMJMSException if the JMS provider fails to set the message 
 *                         listener due to an internal error.
 *
 * @see messageListener
 * @see [KMMessageConsumer messageListener]
 */
- (void) setMessageListener:(id <KMMessageListener>)listener;

/**
 *
 * Optional operation, intended to be used only by Application Servers,
 * not by ordinary JMS clients.
 */
- (void) run;

/**
 * Creates a MessageProducer to send messages to the specified 
 * destination.
 *
 * A client uses a MessageProducer object to send 
 * messages to a destination. Since Queue and Topic 
 * both inherit from Destination, they can be used in
 * the destination parameter to create a MessageProducer object.
 * 
 * @param destination the Destination to send to, 
 * or null if this is a producer which does not have a specified 
 * destination.
 *
 * @exception KMJMSException if the session fails to create a MessageProducer
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid destination
 * is specified.
 *
 * 
 */
- (KMMessageProducer *) createProducer:(KMDestination *)destination;

/**
 * Creates a MessageConsumer for the specified destination.
 * Since Queue and Topic 
 * both inherit from Destination, they can be used in
 * the destination parameter to create a MessageConsumer.
 *
 * @param destination the Destination to access. 
 *
 * @exception KMJMSException if the session fails to create a consumer
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid destination 
 *                         is specified.
 *
 */
- (KMMessageConsumer *) createConsumer:(KMDestination *)destination;

/**
 * Creates a KMMessageConsumer for the specified destination, 
 * using a message selector. Since Queue and Topic 
 * both inherit from Destination, they can be used in
 * the destination parameter to create a MessageConsumer.
 *
 * A client uses a KMMessageConsumer object to receive 
 * messages that have been sent to a destination.
 *       
 * @param destination the KMDestination to access
 * @param messageSelector only messages with properties matching the
 * message selector expression are delivered. A value of null or
 * an empty string indicates that there is no message selector 
 * for the message consumer. 
 * 
 * @exception KMJMSException if the session fails to create a consumer
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid destination 
 *                         is specified.
 * @exception KMInvalidSelectorException if the message selector is invalid.
 */
- (KMMessageConsumer *) createConsumer:(KMDestination *)destination
                        messageSelector:(NSString*)messageSelector;

/**
 * Creates MessageConsumer for the specified destination, using a
 * message selector. This method can specify whether messages published by 
 * its own connection should be delivered to it, if the destination is a 
 * topic. 
 * Since Queue and Topic 
 * both inherit from Destination, they can be used in
 * the destination parameter to create a MessageConsumer.
 * A client uses a MessageConsumer object to receive 
 * messages that have been published to a destination. 
 *               
 * In some cases, a connection may both publish and subscribe to a 
 * topic. The consumer NoLocal attribute allows a consumer
 * to inhibit the delivery of messages published by its own connection.
 * The default value for this attribute is False. The noLocal 
 * value must be supported by destinations that are topics. 
 *
 * @param destination the Destination to access 
 * @param messageSelector only messages with properties matching the
 *   message selector expression are delivered. A value of null or
 *   an empty string indicates that there is no message selector 
 *   for the message consumer.
 * @param noLocal if true, and the destination is a topic,
 *   inhibits the delivery of messages published
 *   by its own connection.  The behavior for
 *   NoLocal is not specified if the destination is a queue.
 * 
 * @exception KMJMSException if the session fails to create a MessageConsumer
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid destination
 * is specified.
 *
 * @exception KMInvalidSelectorException if the message selector is invalid.
 */
- (KMMessageConsumer *) createConsumer:(KMDestination *)destination
                       messageSelector:(NSString*)messageSelector
                               noLocal:(BOOL)noLocal;
																							
/**
 * Creates a queue identity given a Queue name.
 *
 * This facility is provided for the rare cases where clients need to
 * dynamically manipulate queue identity. It allows the creation of a
 * queue identity with a provider-specific name. Clients that depend 
 * on this ability are not portable.
 *
 * Note that this method is not for creating the physical queue. 
 * The physical creation of queues is an administrative task and is not
 * to be initiated by the JMS API. The one exception is the
 * creation of temporary queues, which is accomplished with the 
 * createTemporaryQueue method.
 *
 * @param queueName the name of this Queue
 *
 * @returns a Queue with the given name
 *
 * @exception KMJMSException if the session fails to create a queue
 *                         due to some internal error.
 */
- (KMQueue *) createQueue:(NSString*)queueName;

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
 * @returns a Topic with the given name
 *
 * @exception KMJMSException if the session fails to create a topic
 *                         due to some internal error.
 */
- (KMTopic *) createTopic:(NSString*)topicName;

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
- (KMTopicSubscriber *) createDurableSubscriber:(KMTopic *)topic name:(NSString*)name;

/**
 * Creates a durable subscriber to the specified topic, using a
 * message selector and specifying whether messages published by its
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
 * Creates a QueueBrowser object to peek at the messages on 
 * the specified queue.
 *  
 * @param queue the queue to access
 *
 * @exception KMJMSException if the session fails to create a browser
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid destination
 *                         is specified 
 */
- (KMQueueBrowser *) createBrowser:(KMQueue *)queue;

/**
 * Creates a QueueBrowser object to peek at the messages on 
 * the specified queue using a message selector.
 *  
 * @param queue the queue to access
 *
 * @param messageSelector only messages with properties matching the
 * message selector expression are delivered. A value of null or
 * an empty string indicates that there is no message selector 
 * for the message consumer.
 *  
 * @exception KMJMSException if the session fails to create a browser
 *                         due to some internal error.
 * @exception KMInvalidDestinationException if an invalid destination
 *                         is specified 
 * @exception KMInvalidSelectorException if the message selector is invalid.
 */
- (KMQueueBrowser *) createBrowser:(KMQueue *)queue messageSelector:(NSString*)messageSelector;

/**
 * Creates a TemporaryQueue object. Its lifetime will be that 
 * of the Connection unless it is deleted earlier.
 *
 * @returns a temporary queue identity
 *
 * @exception KMJMSException if the session fails to create a temporary queue
 *                         due to some internal error.
 */
- (KMTemporaryQueue *) createTemporaryQueue;

/**
 * Creates a TemporaryTopic object. Its lifetime will be that 
 * of the Connection unless it is deleted earlier.
 *
 * @returns a temporary topic identity
 *
 * @exception KMJMSException if the session fails to create a temporary
 *                         topic due to some internal error.
 */
- (KMTemporaryTopic *) createTemporaryTopic;

/**
 * Unsubscribes a durable subscription that has been created by a client.
 *  
 * This method deletes the state being maintained on behalf of the 
 * subscriber by its provider.
 *
 * It is erroneous for a client to delete a durable subscription
 * while there is an active MessageConsumer or TopicSubscriber for the 
 * subscription, or while a consumed message is part of a pending 
 * transaction or has not been acknowledged in the session.
 *
 * @param name the name used to identify this subscription
 *  
 * @exception KMJMSException if the session fails to unsubscribe to the 
 *                         durable subscription due to some internal error.
 * @exception KMInvalidDestinationException if an invalid subscription name
 *                                        is specified.
 *
 */
- (void) unsubscribe:(NSString*)name;

@end
