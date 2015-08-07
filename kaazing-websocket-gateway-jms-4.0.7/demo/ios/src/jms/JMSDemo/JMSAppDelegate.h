/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import <UIKit/UIKit.h>

@interface JMSAppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;

- (NSData *) deviceToken;

@end
