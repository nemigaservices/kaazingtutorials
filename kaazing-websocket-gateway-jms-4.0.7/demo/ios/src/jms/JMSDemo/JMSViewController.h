/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import <UIKit/UIKit.h>

@interface JMSViewController : UIViewController<UITextFieldDelegate>
- (void) log:(NSString *)str;
- (void) updateUI:(BOOL)connectStatus;
- (void) cleanup;

- (IBAction)connectOrDisconnect:(id)sender;
- (IBAction)subscribe:(id)sender;
- (IBAction)send:(id)sender;
- (IBAction)clear:(id)sender;

@property (weak, nonatomic) IBOutlet UIButton *connectDisconnectButton;
@property (weak, nonatomic) IBOutlet UIButton *sendButton;
@property (weak, nonatomic) IBOutlet UIButton *subscribeButton;
@property (weak, nonatomic) IBOutlet UIButton *clearButton;

@property (weak, nonatomic) IBOutlet UITextField *locationField;
@property (weak, nonatomic) IBOutlet UITextField *destinationField;
@property (weak, nonatomic) IBOutlet UITextField *messageField;
@property (weak, nonatomic) IBOutlet UITextView *logView;

@end
