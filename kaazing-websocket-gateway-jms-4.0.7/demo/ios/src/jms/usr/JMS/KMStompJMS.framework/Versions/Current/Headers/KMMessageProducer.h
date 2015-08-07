/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import "KMMessage.h"
#import "KMDestination.h"

/**
 * A client uses a MessageProducer object to send messages to a 
 * destination. A MessageProducer object is created by passing a 
 * Destination object to a message-producer creation method 
 * supplied by a session.
 *
 * MessageProducer is the parent interface for all message 
 * producers.
 *
 * A client also has the option of creating a message producer without 
 * supplying a destination. In this case, a destination must be provided with 
 * every send operation. A typical use for this kind of message producer is
 * to send replies to requests using the request's JMSReplyTo 
 * destination.
 *
 * A client can specify a default delivery mode, priority, and time to live 
 * for messages sent by a message producer. It can also specify the delivery 
 * mode, priority, and time to live for an individual message.
 *
 * A client can specify a time-to-live value in milliseconds for each
 * message it sends. This value defines a message expiration time that
 * is the sum of the message's time-to-live and the GMT when it is sent (for
 * transacted sends, this is the time the client sends the message, not
 * the time the transaction is committed).
 *
 * A JMS provider should do its best to expire messages accurately;
 * however, the JMS API does not define the accuracy provided.
 *
 *
 * @see KMTopicPublisher
 * @see KMQueueSender
 * @see [KMSession createProducer:]
 */
@interface KMMessageProducer : KCObject

/**
 * Sets whether message IDs are disabled.
 *  
 * Since message IDs take some effort to create and increase a
 * message's size, some JMS providers may be able to optimize message
 * overhead if they are given a hint that the message ID is not used by
 * an application. By calling the setDisableMessageID  
 * method on this message producer, a JMS client enables this potential 
 * optimization for all messages sent by this message producer. If the JMS 
 * provider accepts this hint, 
 * these messages must have the message ID set to null; if the provider 
 * ignores the hint, the message ID must be set to its normal unique value.
 *
 * Message IDs are enabled by default.
 *
 * @param value indicates if message IDs are disabled
 *  
 * @exception KMJMSException if the JMS provider fails to set message ID to
 *                         disabled due to some internal error.
 */
- (void) setDisableMessageID:(BOOL)value;

/**
 * Gets an indication of whether message IDs are disabled.
 *  
 * @return an indication of whether message IDs are disabled
 *  
 * @exception KMJMSException if the JMS provider fails to determine if 
 *                         message IDs are disabled due to some internal 
 *                         error.
 */
- (BOOL) disableMessageID;

/**
 * Sets whether message timestamps are disabled.
 *  
 * Since timestamps take some effort to create and increase a 
 * message's size, some JMS providers may be able to optimize message 
 * overhead if they are given a hint that the timestamp is not used by an 
 * application. By calling the setDisableMessageTimestamp 
 * method on this message producer, a JMS client enables this potential 
 * optimization for all messages sent by this message producer.  If the 
 * JMS provider accepts this hint, 
 * these messages must have the timestamp set to zero; if the provider 
 * ignores the hint, the timestamp must be set to its normal value.
 *  
 * Message timestamps are enabled by default.
 *
 * @param value indicates if message timestamps are disabled
 *  
 * @exception KMJMSException if the JMS provider fails to set timestamps to
 *                         disabled due to some internal error.
 */
- (void) setDisableMessageTimestamp:(BOOL)value;

/**
 * Gets an indication of whether message timestamps are disabled.
 *  
 * @return an indication of whether message timestamps are disabled
 *  
 * @exception KMJMSException if the JMS provider fails to determine if 
 *                         timestamps are disabled due to some internal 
 *                         error.
 */
- (BOOL) disableMessageTimestamp;

/**
 * Sets the producer's default delivery mode.
 *  
 * Delivery mode is set to PERSISTENT by default.
 *
 * @param deliveryMode the message delivery mode for this message
 * producer; legal values are DeliveryModeNonPersistent
 * and DeliveryModePersistent
 *  
 * @exception KMJMSException if the JMS provider fails to set the delivery 
 *                         mode due to some internal error.          
 *
 * @see deliveryMode
 * @see KMDeliveryMode
 * @see KMMessage
 */
- (void) setDeliveryMode:(int)deliveryMode;

/**
 * Gets the producer's default delivery mode.
 *  
 * @return the message delivery mode for this message producer
 *  
 * @exception KMJMSException if the JMS provider fails to get the delivery 
 *                         mode due to some internal error.
 *
 * @see setDeliveryMode:
 * @see KMDeliveryMode
 * @see KMMessage
 */
- (int) deliveryMode;

/**
 * Sets the producer's default priority.
 *  
 * The JMS API defines ten levels of priority value, with 0 as the 
 * lowest priority and 9 as the highest. Clients should consider priorities
 * 0-4 as gradations of normal priority and priorities 5-9 as gradations 
 * of expedited priority. Priority is set to 4 by default.
 *
 * @param defaultPriority the message priority for this message producer;
 *                        must be a value between 0 and 9
 * 
 *  
 * @exception KMJMSException if the JMS provider fails to set the priority
 *                         due to some internal error.
 *
 * @see priority
 */
- (void) setPriority:(int)defaultPriority;

/**
 * Gets the producer's default priority.
 *  
 * @return the message priority for this message producer
 *  
 * @exception KMJMSException if the JMS provider fails to get the priority
 *                         due to some internal error.
 *
 * @see setPriority:
 */
- (int) priority;

/**
 * Sets the default length of time in milliseconds from its dispatch time
 * that a produced message should be retained by the message system.
 *
 * Time to live is set to zero by default.
 *
 * @param timeToLive the message time to live in milliseconds; zero is
 * unlimited
 *
 * @exception KMJMSException if the JMS provider fails to set the time to 
 *                         live due to some internal error.
 *
 * @see timeToLive
 * @see KMMessage
 */
- (void) setTimeToLive:(long long)timeToLive;

/**
 * Gets the default length of time in milliseconds from its dispatch time
 * that a produced message should be retained by the message system.
 *
 * @return the message time to live in milliseconds; zero is unlimited
 *
 * @exception KMJMSException if the JMS provider fails to get the time to 
 *                         live due to some internal error.
 *
 * @see setTimeToLive:
 */
- (long long) timeToLive;

/**
 * Gets the destination associated with this MessageProducer.
 *  
 * @return this producer's Destination
 *  
 * @exception KMJMSException if the JMS provider fails to get the destination for
 *                         this MessageProducer
 *                         due to some internal error.
 */
- (KMDestination *) destination;

/**
 * Closes the message producer.
 *
 * Since a provider may allocate some resources on behalf of a
 * MessageProducer outside the application, clients should close them when they
 * are no longer needed.
 *  
 * @exception KMJMSException if the JMS provider fails to close the producer
 *                         due to some internal error.
 */
- (void) close;

/**
 * Sends a message using the MessageProducer's 
 * default delivery mode, priority, and time to live.
 *
 * @param message the message to send 
 *  
 * @exception KMJMSException if the JMS provider fails to send the message 
 *                         due to some internal error.
 * @exception KMMessageFormatException if an invalid message is specified.
 * @exception KMInvalidDestinationException if a client uses
 *                         this method with a MessageProducer with
 *                         an invalid destination.
 * @exception KMUnsupportedOperationException if a client uses this
 *                         method with a MessageProducer that did
 *                         not specify a destination at creation time.
 * 
 * @see [KMSession createProducer:]
 */
- (void) send:(KMMessage *)message;

/**
 * Sends a message to the destination, specifying delivery mode, priority, and 
 * time to live.
 *
 * @param message the message to send
 * @param deliveryMode the delivery mode to use
 * @param priority the priority for this message
 * @param timeToLive the message's lifetime (in milliseconds)
 *  
 * @exception KMJMSException if the JMS provider fails to send the message 
 *                         due to some internal error.
 * @exception KMMessageFormatException if an invalid message is specified.
 * @exception KMInvalidDestinationException if a client uses
 *                         this method with a MessageProducer with
 *                         an invalid destination.
 * @exception KMUnsupportedOperationException if a client uses this
 *                         method with a MessageProducer that did
 *                         not specify a destination at creation time.
 *
 * @see [KMSession createProducer:]
 */
- (void) send:(KMMessage *)message
 deliveryMode:(int)deliveryMode
     priority:(int)priority
   timeToLive:(long long)timeToLive;

/**
 *Sends a message to a destination for an unidentified message producer.
 * Uses the MessageProducer's default delivery mode, priority,
 * and time to live.
 *
 * Typically, a message producer is assigned a destination at creation 
 * time; however, the JMS API also supports unidentified message producers,
 * which require that the destination be supplied every time a message is
 * sent. 
 *  
 * @param destination the destination to send this message to
 * @param message the message to send
 *  
 * @exception KMJMSException if the JMS provider fails to send the message 
 *                         due to some internal error.
 * @exception KMMessageFormatException if an invalid message is specified.
 * @exception KMInvalidDestinationException if a client uses
 *                         this method with an invalid destination.
 * @exception KMUnsupportedOperationException if a client uses this
 *                         method with a MessageProducer that 
 *                         specified a destination at creation time.
 * 
 * @see [KMSession createProducer:]
 */
- (void) send:(KMDestination *)destination message:(KMMessage *)message;

/**
 * Sends a message to a destination for an unidentified message producer, 
 * specifying delivery mode, priority and time to live.
 *  
 * Typically, a message producer is assigned a destination at creation 
 * time; however, the JMS API also supports unidentified message producers,
 * which require that the destination be supplied every time a message is
 * sent. 
 *  
 * @param destination the destination to send this message to
 * @param message the message to send
 * @param deliveryMode the delivery mode to use
 * @param priority the priority for this message
 * @param timeToLive the message's lifetime (in milliseconds)
 *  
 * @exception KMJMSException if the JMS provider fails to send the message 
 *                         due to some internal error.
 * @exception KMMessageFormatException if an invalid message is specified.
 * @exception KMInvalidDestinationException if a client uses
 *                         this method with an invalid destination.
 *
 * @see [KMSession createProducer:]
 */
- (void) send:(KMDestination *)destination message:(KMMessage *)message
                                      deliveryMode:(int)deliveryMode
                                          priority:(int)priority
                                        timeToLive:(long long)timeToLive;

@end
