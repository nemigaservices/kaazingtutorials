/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import <KGWebSocket/WebSocket.h>

#import "KCObject.h"
#import "KMConnection.h"
#import "KMConnectionFactory.h"
#import "KMJMSException.h"
#import "KMGenericChannelFactory.h"
#import "KMStompConnectionProperties.h"
#import "KMStompConnectionListener.h"
/**
 * JMS Client implementation of ConnectionFactory. Used to create
 * a connection with a JMS provider via a WebSocket connection.
 * Also provides the ability to set the Gateway location dynamically
 */
@interface KMStompConnectionFactory : KMConnectionFactory {
    @package
    KMStompConnectionProperties  *_properties;
    NSURL                        *_url;
}

/**
 * Initializes the KMStompConnectionFactory with a url for the
 * Gateway location.
 *
 * @param url    the Gateway location
 * @return id  instance of KMStompConnectionFactory
 */
- (id) initWithUrl:(NSURL *)url;

/**
 * Initializes the KMStompConnectionFactory with a url for the 
 * Gateway location.
 * 
 * @param url           the Gateway location
 * @param properties    Connection properties to specify timeout
 *                      and reconnect behavior
 * @return id  instance of KMStompConnectionFactory
 */
- (id) initWithUrl:(NSURL *)url 
        properties:(KMStompConnectionProperties *)properties;

/**
 * Returns the instance of underlying KGWebSocketFactory that is used
 * to create and establish WebSocket connection to send/receive
 * data over WebSocket connection.
 *
 * 
 * The KGWebSocketFactory instance can be used to set default enabled extensions
 * and corresponding value of WebSocket extension parameter(s). 
 * For example, an application developer can use it to set the
 * challenge handler on it for authentication purposes. Similarly,
 * the factory can be used to set the value of parameters - device token
 * and bundle id of the KGApnsExtension.
 */
- (KGWebSocketFactory *) webSocketFactory;

/**
 * Sets the KGWebSocketFactory that will be used to create and establish
 * WebSocket connections to send/receive data over WebSocket connection.
 * When KMStompConnectionFactory is created, the KGWebSocketFactory is
 * implicitly created. The function can be used to replace the default WebSocketFactory.
 * Application developer can create WebSocketFactory externally, enable extensions, set
 * parameter values and can provide the WebSocketFactory instance to the StompConnectionFactory.
 *
 * @param webSocketFactory Instance of KGWebSocketFactory
 */
- (void) setWebSocketFactory:(KGWebSocketFactory *)webSocketFactory;

/**
 * Returns the url for the Gateway for the WebSocket underlying 
 * subsequent JMS Connections.
 * 
 * @return NSURL   representing the location of the Gateway
 */
- (NSURL *) gatewayLocation;

/**
 * Sets the url for the WebSocket underlying subsequent JMS Connections.
 * 
 * @param gatewayLocation    location of the Gateway
 */
- (void) setGatewayLocation:(NSURL *)gatewayLocation;

/**
 * Creates a connection with the default user identity. The connection
 * is created in stopped mode. No messages will be delivered until the
 * [KMConnection start] method is explicitly called.
 *
 * @return KMConnection object
 */
- (KMConnection *) createConnection;

/**
 * Creates a connection with the default user identity. The connection
 * is created in stopped mode. No messages will be delivered until the
 * [KMConnection start] method is explicitly called.
 *
 *
 * @param connectionListener a delegate for observing connect, start,
 *                           stop, and close events
 * @return KMConnection object
 */
- (KMConnection *) createConnectionWithListener:(id<KMStompConnectionListener>)connectionListener;

/**
 * Creates a connection with the default user identity and clientID
 * specified. The clientID is used to create a namespace for durable
 * subscriber name. If clientID is not specified, then the durable
 * subscriber name should be unique in the broker. However, if
 * clientID is provided, then the durable subscriber names will be
 * scoped by the clientID. The connection is created in stopped mode. 
 * No messages will be delivered until the [KMConnection start] method
 * is explicitly called.
 *
 * @param clientID     used to credurable subscriptions.
 * @return KMConnection object
 */
- (KMConnection *) createConnectionWithClientID:(NSString *)clientID;

/**
 * Creates a connection with the default user identity and clientID
 * specified. The clientID is used to create a namespace for durable
 * subscriber name. If clientID is not specified, then the durable
 * subscriber name should be unique in the broker. However, if
 * clientID is provided, then the durable subscriber names will be
 * scoped by the clientID. The connection is created in stopped mode.
 * No messages will be delivered until the [KMConnection start] method
 * is explicitly called.
 *
 * @param clientID     used to credurable subscriptions.
 * @param connectionListener a delegate for observing connect, start,
 *                           stop, and close events
 * @return KMConnection object
 */
- (KMConnection *) createConnectionWithClientID:(NSString *)clientID
                             connectionListener:(id<KMStompConnectionListener>)connectionListener;

/**
 * Creates a connection with the specified user identity. The connection
 * is created in stopped mode. No messages will be delivered until the
 * [KMConnection start] method is explicitly called.
 *
 * @param username the caller’s user name
 * @param password the caller’s password
 * @return KMConnection object
 */
- (KMConnection *) createConnectionWithUsername:(NSString *)username 
                                       password:(NSString *)password;

/**
 * Creates a connection with the specified user identity. The connection
 * is created in stopped mode. No messages will be delivered until the
 * [KMConnection start] method is explicitly called.
 *
 * @param username the caller’s user name
 * @param password the caller’s password
 * @param connectionListener a delegate for observing connect, start,
 *                           stop, and close events
 * @return KMConnection object
 */
- (KMConnection *) createConnectionWithUsername:(NSString *)username
                                       password:(NSString *)password
                             connectionListener:(id<KMStompConnectionListener>)connectionListener;

/**
 * Creates a connection with the specified user identity and clientID.
 * The clientID is used to create a namespace for durable subscriber
 * name. If clientID is not specified, then the durable subscriber
 * name should be unique in the broker. However, if clientID is provided,
 * then the durable subscriber names will be scoped by the clientID. 
 * The connection is created in stopped mode. No messages will be 
 * delivered until the [KMConnection start] method is explicitly called. 
 *
 * @param username the caller’s user name
 * @param password the caller’s password
 * @param clientID the clientID to use for durable subscriptions
 * @return KMConnection object
 */
- (KMConnection *) createConnectionWithUsername:(NSString *)username 
                                       password:(NSString *)password
                                       clientID:(NSString *)clientID;

/**
 * Creates a connection with the specified user identity and clientID.
 * The clientID is used to create a namespace for durable subscriber
 * name. If clientID is not specified, then the durable subscriber
 * name should be unique in the broker. However, if clientID is provided,
 * then the durable subscriber names will be scoped by the clientID. 
 * The connection is created in stopped mode. No messages will be 
 * delivered until the [KMConnection start] method is explicitly called. 
 *
 * @param username the caller’s user name
 * @param password the caller’s password
 * @param clientID the clientID to use for durable subscriptions
 * @param connectionListener a delegate for observing connect, start, 
 *                           stop, and close events
 * @return KMConnection object
 */
- (KMConnection *) createConnectionWithUsername:(NSString *)username
                           password:(NSString *)password 
                           clientID:(NSString *)clientID
                 connectionListener:(id<KMStompConnectionListener>)connectionListener;

@end
