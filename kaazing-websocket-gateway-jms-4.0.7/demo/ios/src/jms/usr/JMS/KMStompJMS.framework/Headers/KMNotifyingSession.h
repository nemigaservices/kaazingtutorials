/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import <KGWebSocket/KGNotificationPayload.h>

#import "KMSession.h"
#import "KMDestination.h"

/**
 * KMNotifyingSession class is used to create notifying subscribers
 * to facilitate receiving remote notifications from Apple Push
 * Notification Service(APNS). Currently, only durable notifying
 * subscribers are supported. 
 *
 * Application developers should use KMSessionNotifyAcknowledge
 * mode with KMSession's createSession:transacted API to create
 * an instance of this class. Even though this is a sub-class of
 * KMSession, it's only meant to  be used to create notifying 
 * subscribers. For other operations such as creating a topic, 
 * creating a queue, performing transactions, etc., application
 * developers should use a KMSession instance that is created
 * created using other acknowledge-modes such as 
 * KMSessionAutoAcknowledge, KMSessionClientAcknowledge, and
 * KMSessionDupsOKAcknowledge. Trying to perform other operations
 * using KMNotifyingSession will result in 
 * UnsupportedOperationException.
 *
 * Similarly, the KMTopicSubscriber returned by the methods
 * defined on KMNotifyingSession is specifically meant for
 * receiving remote notififcations from APNS when the app has
 * disconnected and running in the background. KMTopicSubscriber
 * cannot be used to receive messages like regular 
 * KMTopicSubscriber.
 */
@interface KMNotifyingSession : KMSession 

/**
 * Creates a notifying topic subscriber with message selector. 
 *
 * @warning  Currently, this is not supported.
 *
 * @param destination    the KMDestination to access
 * @param payload        APNS paylad for rendering the notification on
 *                       the device
 * @return KMTopicSubscriber repesenting the notifying subscriber
 */
- (KMTopicSubscriber *) createNotification:(KMDestination *)destination
                       notificationPayload:(KGNotificationPayload *)payload;

/**
 * Creates a notifying topic subscriber with message selector. 
 *
 * @warning  Currently, this is not supported.
 *
 * @param destination      the KMDestination to access
 * @param messageSelector  only messages with properties matching the 
 *                         message selector expression are delivered. 
 *                         A value of null or an empty string indicates 
 *                         that there is no message selector for the message
 *                         consumer
 * @param noLocal          if set, inhibits the delivery of messages
 *                         published by its own connection
 * @param payload          APNS paylad for rendering the notification on
 *                         the device
 * @return KMTopicSubscriber repesenting the notifying subscriber
 */
- (KMTopicSubscriber *) createNotification:(KMDestination *)destination
                           messageSelector:(NSString *)messageSelector
                                   noLocal:(BOOL)noLocal
                       notificationPayload:(KGNotificationPayload *)payload;

/**
 * Creates a notifying durable topic subscriber. When the app is
 * disconnected and running in the background, APNS will deliver
 * remote notification based on the specified payload.
 *
 * @param topic          the non-temporary KMTopic to subscribe to
 * @param name           the name used to identify this subscription
 * @param payload        APNS paylad for rendering the notification on
 *                       the device
 * @return KMTopicSubscriber repesenting the durable notifying subscriber
 */
- (KMTopicSubscriber *) createDurableNotification:(KMTopic *)topic
                                      durableName:(NSString *)name
                              notificationPayload:(KGNotificationPayload *)payload;

/**
 * Creates a notifying durable topic subscriber with message selector.
 * When the app is disconnected and running in the background, APNS will 
 * deliver remote notification based on the specified payload.
 *
 * @param topic            the non-temporary KMTopic to subscribe to
 * @param name             the name used to identify this subscription
 * @param messageSelector  only messages with properties matching the 
 *                         message selector expression are delivered. 
 *                         A value of null or an empty string indicates 
 *                         that there is no message selector for the message
 *                         consumer
 * @param noLocal          if set, inhibits the delivery of messages
 *                         published by its own connection
 * @param payload          APNS paylad for rendering the notification on
 *                         the device
 * @return KMTopicSubscriber repesenting the durable notifying subscriber
 */
- (KMTopicSubscriber *) createDurableNotification:(KMTopic *)topic
                                      durableName:(NSString *)name
                                  messageSelector:(NSString *)messageSelector
                                          noLocal:(BOOL)noLocal
                              notificationPayload:(KGNotificationPayload *)payload;
@end
