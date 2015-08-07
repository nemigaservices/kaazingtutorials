/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "JMSAppDelegate.h"
#import <KMStompJMS/KMStompJMS.h>

@implementation JMSAppDelegate {
    NSData  *_devToken;
}


@synthesize window = _window;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Override point for customization after application launch.

//    Uncomment the following lines to register for Pre-iOS8 Notifications.
//    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:(UIRemoteNotificationTypeAlert |
//                                                                           UIRemoteNotificationTypeSound)];

//    Uncomment the following lines to register for iOS8 Notifications.
//    [application registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeSound | 
//                                                                                                UIUserNotificationTypeAlert | 
//                                                                                                UIUserNotificationTypeBadge) 
//                                                                              categories:nil]];
//    [application registerForRemoteNotifications];

    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    [dict setObject:@"suspend" forKey:@"CONNECTION_STATE"];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"suspendOrResume"
                                                        object:self
                                                      userInfo:dict];
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    [dict setObject:@"resume" forKey:@"CONNECTION_STATE"];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"suspendOrResume"
                                                        object:self
                                                      userInfo:dict];
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

/* Method for when the client registers for remote notifications
 with a device token */
- (void)application:(UIApplication *)app
didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)devToken
{
    NSLog(@"Successful registration: devToken = '%@'", [devToken description]);
    _devToken = devToken;
}

/* Method for when the client fails to register for remote notifications.
 Outputs an error */
- (void)application:(UIApplication *)app
didFailToRegisterForRemoteNotificationsWithError:(NSError *)err
{
    NSLog(@"Error in registration. Error: %@", err);
}

/* Method for when the client receives a remote notification.
 Outputs a message indicating receipt. */
- (void)application:(UIApplication *)application
didReceiveRemoteNotification:(NSDictionary *)userInfo
{
    NSLog(@"Received Notification");
}

// Get the iOS device token to return to the notification provider.
- (NSData *) deviceToken {
    return _devToken;
}

@end
