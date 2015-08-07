/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMMessage.h"

/**
 * A TextMessage object is used to send a message containing a String.
 * It inherits from the Message interface and adds a text message 
 * body.
 *
 * This message type can be used to transport text-based messages, including
 * those with XML content.
 *
 * When a client receives a TextMessage, it is in read-only 
 * mode. If a client attempts to write to the message at this point, a 
 * KMMessageNotWriteableException is thrown. If 
 * clearBody is 
 * called, the message can now be both read from and written to.
 *
 * @see [KMSession createTextMessage]
 * @see [KMSession createTextMessage:]
 * @see KMBytesMessage
 * @see KMMapMessage
 * @see KMMessage
 */
@interface KMTextMessage : KMMessage

/**
 * Sets the string containing this message's data.
 *
 *  
 * @param string the String containing the message's data
 *  
 * @exception KMJMSException if the JMS provider fails to set the text due to
 *                         some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) setText:(NSString*)string;

/**
 * Gets the string containing this message's data.  The default
 * value is null.
 *
 * @exception KMJMSException if the JMS provider fails to get the text due to
 *                         some internal error.
 *  
 * @return the String containing the message's data
 */
- (NSString*) text;

@end
