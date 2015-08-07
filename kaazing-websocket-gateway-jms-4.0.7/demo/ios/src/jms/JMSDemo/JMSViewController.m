/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "JMSViewController.h"
#import "JMSAppDelegate.h"
#import <KMStompJMS/KMStompJMS.h>
#import <KGWebSocket/WebSocket.h>

@class JMSViewController;


// --------------- LoginHandler Implementation ---------------
@interface DemoLoginHandler : KGLoginHandler
@end

@implementation DemoLoginHandler {
    int            _buttonIndex;
    NSString      *_username;
    NSString      *_password;
    UIAlertView   *_alertView;
}

-(void) dealloc {
}

- (id) init {
    NSLog(@"[DemoLoginHandler init]");
    self = [super init];
    return self;
}

-(NSURLCredential *) credentials {
    
    _buttonIndex = -1;
    dispatch_async(dispatch_get_main_queue(), ^{
        [self popupLogin];
    });
    
    // Wait for click
    while (_buttonIndex < 0) {
        [NSThread sleepForTimeInterval:.2];
    }

    // Clicked the Submit button
    if (_buttonIndex != 0) {
        return [[NSURLCredential alloc] initWithUser:_username password:_password persistence:NSURLCredentialPersistenceNone];
    } else {
        return nil;
    }
}

- (void) alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
    _username = [_alertView textFieldAtIndex:0].text;
    _password = [_alertView textFieldAtIndex:1].text;
    _buttonIndex = buttonIndex;
}

- (void) popupLogin {
    _buttonIndex = -1;

    _alertView = [[UIAlertView alloc] initWithTitle:@"Please Login:" message:nil
                                                       delegate:self
                                              cancelButtonTitle:@"Cancel"
                                              otherButtonTitles:@"OK", nil];

    _alertView.alertViewStyle = UIAlertViewStyleLoginAndPasswordInput;
    
    // Show alert on screen.
    [_alertView show];
}

@end


// --------------- StompConnectionListener Implementation ---------------

@interface JMSConnectionListener : NSObject<KMStompConnectionListener> {
    JMSViewController    *_controller;
}
@end

@implementation JMSConnectionListener

- (id) initWithController:(JMSViewController *)controller {
    self = [super init];
    if (self) {
        _controller = controller;
    }
    
    return self;
}

- (void) onConnect:(KMConnection *)connection {
    [_controller log:@"CONNECTED"];
    [_controller updateUI:YES];
}

- (void) onStart:(KMConnection *)connection {
    [_controller log:@"CONNECTION STARTED"];
}

- (void) onStop:(KMConnection *)connection {
    [_controller log:@"STOPPED"];
}

- (void) onClose:(KMConnection *)connection {
    [_controller log:@"DISCONNECTED\n"];
    [((JMSViewController *)_controller) cleanup];
    [_controller updateUI:NO];
}

@end

// -------------------- MessageListener Implementation -----------------
@interface JMSMessageListener : NSObject<KMMessageListener>
@end

@implementation JMSMessageListener {
    JMSViewController *_controller;
}

- (id) initWithController:(JMSViewController *)controller {
    self = [super init];
    if (self) {
        _controller = controller;
    }
    
    return self;
}

- (NSString *) typeFromObject:(NSObject *)value {
    if (value == nil) {
        return @"nil";
    } else if ([value isKindOfClass:[NSString class]]) {
        return @"NSString";
    } else if ([value isKindOfClass:[NSNumber class]]) {
        return @"NSNumber";
    } else if ([value isKindOfClass:[NSData class]]) {
        return @"NSData";
    } else if ([value isKindOfClass:[NSNull class]]) {
        return @"NSNull";
    } else {
        return @"UNKNOWN TYPE";
    }
}

- (void) onMessage:(KMMessage *)message {
    if ([message isKindOfClass:[KMTextMessage class]]) {
        KMTextMessage *textMessage = (KMTextMessage *)message;
        [_controller log:[NSString stringWithFormat:@"RECEIVED KMTextMessage: %@", [textMessage text]]];
        
    } else if ([message isKindOfClass:[KMBytesMessage class]])  {
        KMBytesMessage *bytesMessage = (KMBytesMessage *)message;
        NSString *utf8String = [bytesMessage readUTF];
        [_controller log:[NSString stringWithFormat:@"RECEIVED KMBytesMessage: %@", utf8String]];

    } else if ([message isKindOfClass:[KMMapMessage class]]) {
        KMMapMessage *mapMessage = (KMMapMessage *)message;
        [_controller log:[NSString stringWithFormat:@"RECEIVED KMMapMessage:"]];

        int count = 0;
        for (NSString *key in [mapMessage mapNames]) {
            id value = [mapMessage getObject:key];
            NSString *type = [self typeFromObject:value];
            [_controller log:[NSString stringWithFormat:@"  %@: %@ (%@)", key, value, type]];
            count++;
        }
        [_controller log:[NSString stringWithFormat:@"%d entries", count]];
        
    } else {
        [_controller log:@"RECEIVED UNKNOWN MESSAGE"];
    }
}

@end

// -------------------- ExceptionListener Implementation -----------------
@interface JMSExceptionListener : NSObject<KMExceptionListener>
@end

@implementation JMSExceptionListener {
    JMSViewController *_controller;
}

- (id) initWithController:(JMSViewController *)controller {
    self = [super init];
    if (self) {
        _controller = controller;
    }
    
    return self;
}

- (void) onException:(KMJMSException *)exception {
    NSString *msg = [exception reason];
    [_controller log:[NSString stringWithFormat:@"EXCEPTION: %@", msg]];
    if ([exception isKindOfClass:[KMConnectionDisconnectedException class]]) {
        [((JMSViewController *)_controller) cleanup];
    }
}

@end

// -------------------- JMSViewController Implementation ---------------

@interface JMSViewController ()
-(KMDestination*) createDestination:(NSString*)destinationName;
@end

@implementation JMSViewController

@synthesize connectDisconnectButton;
@synthesize sendButton;
@synthesize subscribeButton;
@synthesize clearButton;

@synthesize locationField;
@synthesize destinationField;
@synthesize messageField;
@synthesize logView;

bool                      connected = NO;
KMStompConnectionFactory *factory = nil;
KMConnection             *conn = nil;
KMSession                *session = nil;
KMMessageProducer        *producer = nil;
KMMessageConsumer        *consumer = nil;
KMNotifyingSession       *notifyingSession = nil;
KMMessageConsumer        *notifyingConsumer = nil;


- (void) viewDidLoad {
    subscribeButton.enabled = NO;
    subscribeButton.alpha = 0.5f;
    sendButton.enabled = NO;
    sendButton.alpha = 0.5f;
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(suspendOrResume:)
                                                 name:@"suspendOrResume"
                                               object:nil];
    [super viewDidLoad];
}

- (void) viewDidUnload {
    [self setLocationField:nil];
    [self setDestinationField:nil];
    [self setMessageField:nil];
    [self setLogView:nil];
    [self setConnectDisconnectButton:nil];
    [self setSendButton:nil];
    [self setSubscribeButton:nil];
    [self setClearButton:nil];
    
    subscribeButton.enabled = NO;
    subscribeButton.alpha = 0.5f;
    sendButton.enabled = NO;
    sendButton.alpha = 0.5f;
    
    [super viewDidUnload];
    // Release any retained subviews of the main view.
}

#pragma mark <UIViewController Methods>

- (BOOL) shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPhone) {
        return (interfaceOrientation != UIInterfaceOrientationPortraitUpsideDown);
    } else {
        return YES;
    }
}

#pragma mark <UITextFieldDelegate Method>

- (BOOL) textFieldShouldReturn:(UITextField *)theTextField {
    if ((theTextField == self.locationField)    || 
        (theTextField == self.destinationField) ||
        (theTextField == self.messageField)) {
        [theTextField resignFirstResponder];
    }
    return YES;
}

#pragma mark <JMSViewController Methods>

- (IBAction) connectOrDisconnect:(id)sender {
    // Cache values from the UI widgets in the main thread itself to avoid warnings/errors
    // related to UIKit invoked from secodary thread.
    NSString *location = [locationField text];

    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        if (!connected) {
            NSURL                       *url = [[NSURL alloc] initWithString:location];
            KMStompConnectionProperties *props = [[KMStompConnectionProperties alloc] init];
            
            props->_connectionTimeout = 5000;
            
            @try {
                factory = [[KMStompConnectionFactory alloc] initWithUrl:url properties:props];
                
                KGWebSocketFactory   *webSocketFactory = [factory webSocketFactory];
                KGChallengeHandler   *challengeHandler = [self createBasicChallengeHandler];
                JMSAppDelegate       *delegate = [[UIApplication sharedApplication] delegate];
                NSData               *devToken = [delegate deviceToken];
                
                [webSocketFactory setDefaultChallengeHandler:challengeHandler];

                if (devToken != nil) {
                    // App is configured to receive push notifications via APNS.
                    NSString *apnsExtensionName = [[KGApnsExtension apnsExtension] name];
                    NSArray  *enabledExtensions = [NSArray arrayWithObjects:apnsExtensionName, nil];
                    NSString *bundleId = [[NSBundle mainBundle] bundleIdentifier];

                    [webSocketFactory setDefaultEnabledExtensions:enabledExtensions];
                    [webSocketFactory setDefaultParameter:[KGApnsExtension deviceToken] value:devToken];
                    [webSocketFactory setDefaultParameter:[KGApnsExtension bundleId] value:bundleId];
                }

                [self log:@"CONNECTING"];
                id<KMStompConnectionListener> listener = [[JMSConnectionListener alloc] initWithController:self];
                conn = [factory createConnectionWithListener:listener];
                [conn setExceptionListener:[[JMSExceptionListener alloc] initWithController:self]];
                [conn start];
                session = (KMSession *)[conn createSession:KMSessionAutoAcknowledge transacted:NO];

                if (devToken != nil) {
                    // Create a notifying-session for APNS.
                    notifyingSession = (KMNotifyingSession *) [conn createSession:KMSessionNotifyAcknowledge transacted:NO];
                }
            }
            @catch (NSException *ex) {
                [self log:[NSString stringWithFormat:@"EXCEPTION: %@", [ex reason]]];
                NSLog(@"Exception: %@", [ex reason]);
                
                if (notifyingSession != nil) {
                    [notifyingSession close];
                }
                
                if (session != nil) {
                    [session close];
                }
                
                if (conn != nil) {
                    [conn close];
                }
                
                notifyingSession = nil;
                session = nil;
                conn = nil;
                factory = nil;
            }
        } else {
            connected = NO;
            [self log:@"CLOSING"];
            
            if (notifyingSession != nil) {
                [notifyingSession close];
            }
            [session close];
            [conn close];
        }
    });
}

- (IBAction) subscribe:(id)sender {
    // Cache values from the UI widgets in the main thread itself to avoid warnings/errors
    // related to UIKit invoked from secondary thread.
    NSString      *destinationName = [destinationField text];
    
    // Subscribing can be a blocking operation, so perform it in the background.
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        @try {
            // Create a destination.
            KMDestination *dest = [self createDestination:destinationName];
            if (dest == nil) {
                return;
            }
            
            // Create a consumer and attach a listener.
            consumer = [session createConsumer:dest];
            [consumer setMessageListener:[[JMSMessageListener alloc] initWithController:self]];

            if (notifyingSession != nil) {
                // Create a notifying-consumer for APNS.
                notifyingConsumer = [notifyingSession createDurableNotification:(KMTopic *)dest
                                                                    durableName:@"notifyingDurableSubscriber"
                                                            notificationPayload:[self payload]];
            }

            // Update the UI. These calls will schedule themselves in the main queue.
            [self log:[NSString stringWithFormat:@"SUBSCRIBED TO: %@", destinationName]];
            [self disableSubscribeButton];
        }
        @catch (NSException *exception) {
            NSString *msg = [exception reason];
            [self log:[NSString stringWithFormat:@"EXCEPTION: %@", msg]];
            
            if (consumer != nil) {
                [consumer close];
            }
            
            if (notifyingConsumer != nil) {
                [notifyingConsumer close];
            }
            
            consumer = nil;
            notifyingConsumer = nil;
        }
    });
}

- (KGNotificationPayload *)payload {
    KGSimpleAlertNotification  *alert = [[KGSimpleAlertNotification alloc]
                                         initWithBody:@"Hello from APNs"];
    KGNotificationPayload *payload = [[KGNotificationPayload alloc]
                                      initWithAlert:alert];
    return payload;
}

- (IBAction) send:(id)sender {
    // Cache values from the UI widgets in the main thread itself to avoid warnings/errors
    // related to UIKit invoked from secondary thread.
    NSString *destinationName = [destinationField text];
    NSString *messageText = [messageField text];

    // Sending a message is a blocking operation, so we do not want to
    // do that in the UI thread. Instead, we want to do it in the background.
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        @try {
            // Create a destination.
            KMDestination *dest = [self createDestination:destinationName];
            if (dest == nil) {
                return;
            }

            // Create a producer and message.
            producer = [session createProducer:dest];
            KMTextMessage *message = [session createTextMessage];
            
            // Set the message text and send it away.
            [message setText:messageText];
            [producer send:message];
            
            // Update the UI. This call will schedule itself in the main queue.
            [self log:[NSString stringWithFormat:@"MESSAGE SENT TO %@: %@", destinationName, messageText]];
        }
        @catch (NSException *exception) {
            NSString *msg = [exception reason];
            [self log:[NSString stringWithFormat:@"EXCEPTION: %@", msg]];
            
            if (producer != nil) {
                [producer close];
            }
            
            producer = nil;
        }
    });
}

- (IBAction) clear:(id)sender {
    dispatch_async(dispatch_get_main_queue(), ^{
        [logView setText:@""];
    });
}

#pragma mark<Private Methods>

- (KGChallengeHandler *) createBasicChallengeHandler {
    // Set up ChallengeHandlers to handle authentication challenge.
    KGLoginHandler          *loginHandler = [[DemoLoginHandler alloc] init];
    KGBasicChallengeHandler *challengeHandler = [KGBasicChallengeHandler create];
    
    [challengeHandler setLoginHandler:loginHandler];
    return challengeHandler;
}

// Create a KMTopic or KMQueue depending on the text prefix inside the destination field.
- (KMDestination *) createDestination:(NSString*)destinationName {
    if ([destinationName hasPrefix:@"/topic/"]) {
        return [session createTopic:destinationName];
    }
    else if ([destinationName hasPrefix:@"/queue/"]) {
        return [session createQueue:destinationName];
    }
    
    // Make sure that the error dialog is shown in the main UI thread.
    dispatch_async(dispatch_get_main_queue(), ^{
        UIAlertView *badPrefixAlert = [[UIAlertView alloc] initWithTitle:@"Invalid destination"
                                                                 message:@"Destination must begin with /topic/ or /queue/"
                                                                delegate:nil
                                                       cancelButtonTitle:@"OK"
                                                       otherButtonTitles:nil];
        [badPrefixAlert show];
    });
    
    return nil;
}

- (void) cleanup {
    if (producer != nil) {
        [producer close];
    }
    
    if (consumer != nil) {
        [consumer close];
    }
    
    if (notifyingConsumer != nil) {
        [notifyingConsumer close];
    }
    
    if (notifyingSession != nil) {
        [notifyingSession close];
    }
    
    if (session != nil) {
        [session close];
    }
    
    if (conn != nil) {
        [conn close];
    }
    
    producer = nil;
    consumer = nil;
    notifyingConsumer = nil;
    notifyingSession = nil;
    session = nil;
    conn = nil;
    factory = nil;
}

- (void) log:(NSString *)str {
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString *text = str;
        NSString *log = [logView text];
        
        if ((log != nil) && ([log length] > 0)) {
            text = [NSString stringWithFormat:@"%@\n%@", [logView text], str];
        }
        
        // remove old text if text field is too large
        if ([[logView text] length] > 5000) {
            text = [text substringFromIndex:3000];
        }
        
        [logView setText:text];
        [logView scrollRangeToVisible:NSMakeRange([logView.text length], 0)];
    });
}

- (void) disableSubscribeButton {
    dispatch_async(dispatch_get_main_queue(), ^{
        subscribeButton.enabled = NO;
        subscribeButton.alpha = 0.5f;
    });
}

- (void) suspendOrResume:(NSNotification *)notification {
    NSDictionary      *dict = [notification userInfo];
    NSString          *str = (NSString *) [dict valueForKey:@"CONNECTION_STATE"];
    JMSAppDelegate    *delegate = [[UIApplication sharedApplication] delegate];
    NSData            *devToken = [delegate deviceToken];
    
    if ([str isEqualToString:@"resume"]) {
        @try {
            if (devToken == nil) {
                // Application switched from background to foreground. Start the connection
                // if it was earlier connected.
                if (conn != nil) {
                    [conn start];
                }
                return;
            }
            // App is configured to receive push notifications via APNS.
            
            // ### TODO: We can cache some of these as member-variables when
            //           they were created in createOrDisconnect method/selector
            //           and reuse them here. For time-being, let's just recreate
            //           them.
            NSString                 *location = [locationField text];
            NSURL                    *url = [[NSURL alloc] initWithString:location];
            KMStompConnectionFactory *factory = [[KMStompConnectionFactory alloc] initWithUrl:url];
            KGWebSocketFactory       *webSocketFactory = [factory webSocketFactory];
            KGChallengeHandler       *challengeHandler = [self createBasicChallengeHandler];
            
            [webSocketFactory setDefaultChallengeHandler:challengeHandler];
            NSString *apnsExtensionName = [[KGApnsExtension apnsExtension] name];
            NSArray  *enabledExtensions = [NSArray arrayWithObjects:apnsExtensionName, nil];
            NSString *bundleId = [[NSBundle mainBundle] bundleIdentifier];
                
            [webSocketFactory setDefaultEnabledExtensions:enabledExtensions];
            [webSocketFactory setDefaultParameter:[KGApnsExtension deviceToken] value:devToken];
            [webSocketFactory setDefaultParameter:[KGApnsExtension bundleId] value:bundleId];
            
            [self log:@"CONNECTING"];
            id<KMStompConnectionListener> listener = [[JMSConnectionListener alloc] initWithController:self];
            conn = [factory createConnectionWithListener:listener];
            [conn setExceptionListener:[[JMSExceptionListener alloc] initWithController:self]];
            [conn start];
            session = (KMSession *)[conn createSession:KMSessionAutoAcknowledge transacted:NO];

            // Create a notifying-session for APNS.
            notifyingSession = (KMNotifyingSession *) [conn createSession:KMSessionNotifyAcknowledge transacted:NO];
            
            // Create a destination.
            NSString      *destinationName = [destinationField text];
            KMDestination *dest = [self createDestination:destinationName];
            if (dest == nil) {
                return;
            }
            
            // Create a consumer and attach a listener.
            consumer = [session createConsumer:dest];
            [consumer setMessageListener:[[JMSMessageListener alloc] initWithController:self]];
            
            if (notifyingSession != nil) {
                // Create a notifying-consumer for APNS. Notifications are ONLY
                // supported for non-durable topics.
                notifyingConsumer = [notifyingSession createDurableNotification:(KMTopic *)dest
                                                                    durableName:@"notifyingDurableSubscriber"
                                                            notificationPayload:[self payload]];
            }
            
            // Update the UI. These calls will schedule themselves in the main queue.
            [self log:[NSString stringWithFormat:@"SUBSCRIBED TO: %@", destinationName]];
            connected = YES;
            [self updateUI:YES];
            [self disableSubscribeButton];
        }
        @catch (NSException *ex) {
            [self log:[NSString stringWithFormat:@"EXCEPTION: %@", [ex reason]]];
            NSLog(@"Exception: %@", [ex reason]);
            
            if (consumer != nil) {
                [consumer close];
            }
            
            if (notifyingConsumer != nil) {
                [notifyingConsumer close];
            }
            
            if (notifyingSession != nil) {
                [notifyingSession close];
            }
            
            if (session != nil) {
                [session close];
            }
            
            if (conn != nil) {
                [conn close];
            }
            
            consumer = nil;
            notifyingConsumer = nil;
            notifyingSession = nil;
            session = nil;
            conn = nil;
        }
    }
    else { // suspend
        @try {
            if (devToken == nil) {
                // Application switched from foreground to background. Stop the connection
                // if it was connected.
                if (conn != nil) {
                    [conn stop];
                }
                return;
            }
            
            // APNS is being used. So, we should close the connection explicitly to
            // receive notifications.
            connected = NO;
            [self log:@"CLOSING"];
            [conn close];
            // conn = nil;
            [self updateUI:NO];
        }
        @catch (NSException *ex) {
            [self log:[NSString stringWithFormat:@"EXCEPTION: %@", [ex reason]]];
            NSLog(@"Exception: %@", [ex reason]);
        }
    }
}

- (void) updateUI:(BOOL)connectStatus {
    dispatch_async(dispatch_get_main_queue(), ^{
        if (connectStatus) {
            [connectDisconnectButton setTitle:@"Disconnect" forState:UIControlStateNormal];
            connected = YES;
            subscribeButton.enabled = YES;
            subscribeButton.alpha = 1.0f;
            sendButton.enabled = YES;
            sendButton.alpha = 1.0f;
        } else {
            [connectDisconnectButton setTitle:@"Connect" forState:UIControlStateNormal];
            connected = NO;
            subscribeButton.enabled = NO;
            subscribeButton.alpha = 0.5f;
            sendButton.enabled = NO;
            sendButton.alpha = 0.5f;
        }
    });
}

@end
