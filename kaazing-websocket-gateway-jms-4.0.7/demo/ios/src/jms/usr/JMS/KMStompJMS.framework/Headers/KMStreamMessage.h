/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMMessage.h"
#import "KCObject.h"

#if NOT_IMPLEMENTED

/**
 * A StreamMessage object is used to send a stream of primitive types.
 * It is filled and read sequentially.  It inherits from the Message interface
 * and adds a stream message body. Its methods are based largely on those
 * found in the Java platform: java.io.DataInputStream and java.io.DataOutputStream.
 *
 * The primitive types can be read or written explicitly using methods
 * for each type. They may also be read or written generically as objects.
 * For instance, a call to StreamMessage.writeInt(6) is
 * equivalent to StreamMessage.writeObject(new Integer(6)).
 * Both forms are provided, because the explicit form is convenient for
 * static programming, and the object form is needed when types are not known
 * at compile time.
 *
 * When the message is first created, and when clearBody
 * is called, the body of the message is in write-only mode. After the 
 * first call to reset has been made, the message body is in 
 * read-only mode. 
 * After a message has been sent, the client that sent it can retain and 
 * modify it without affecting the message that has been sent. The same message
 * object can be sent multiple times.
 * When a message has been received, the provider has called 
 * reset so that the message body is in read-only mode for the client.
 * 
 * If clearBody is called on a message in read-only mode, 
 * the message body is cleared and the message body is in write-only mode.
 * 
 * If a client attempts to read a message in write-only mode, a 
 * KMMessageNotReadableException is thrown.
 * 
 * If a client attempts to write a message in read-only mode, a 
 * KMMessageNotWriteableException is thrown.
 *
 * StreamMessage objects support the following conversion 
 * table. The marked cases must be supported. The unmarked cases must throw a 
 * KMJMSException. The String-to-primitive conversions 
 * may throw a runtime exception if the primitive's valueOf() 
 * method does not accept it as a valid String representation of 
 * the primitive.
 *
 * A value written as the row type can be read as the column type.
 *
 * <pre><code>
 * |        | boolean byte short char int long float double String byte[]
 * |----------------------------------------------------------------------
 * |boolean |    X                                            X
 * |byte    |          X     X         X   X                  X   
 * |short   |                X         X   X                  X   
 * |char    |                     X                           X
 * |int     |                          X   X                  X   
 * |long    |                              X                  X   
 * |float   |                                    X     X      X   
 * |double  |                                          X      X   
 * |String  |    X     X     X         X   X     X     X      X   
 * |byte[]  |                                                        X
 * |----------------------------------------------------------------------
 * </code></pre>
 *
 * Attempting to read a null value as a primitive type must be treated
 * as calling the primitive's corresponding valueOf(String) 
 * conversion method with a null value. Since char does not 
 * support a String conversion, attempting to read a null value 
 * as a char must throw an exception.
 *
 * @see [KMSession createStreamMessage]
 * @see KMTextMessage
 * @see KMBytesMessage
 * @see KMMapMessage
 * @see KMMessage
 */
@interface KMStreamMessage : KMMessage

/**
 * Reads a boolean from the stream message.
 *
 * @return the boolean value read
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of message stream has
 *                                been reached.     
 * @exception KMMessageFormatException if this type conversion is invalid.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (BOOL) readBoolean;

/**
 * Reads a byte value from the stream message.
 *
 * @return the next byte from the stream message as a 8-bit
 * byte
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of message stream has
 *                                been reached.     
 * @exception KMMessageFormatException if this type conversion is invalid.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (char) readByte;

/**
 * Reads a 16-bit integer from the stream message.
 *
 * @return a 16-bit integer from the stream message
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of message stream has
 *                                been reached.     
 * @exception KMMessageFormatException if this type conversion is invalid.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (short) readShort;

/**
 * Reads a Unicode character value from the stream message.
 *
 * @return a Unicode character from the stream message
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of message stream has
 *                                been reached.     
 * @exception KMMessageFormatException if this type conversion is invalid      
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (char) readChar;

/**
 * Reads a 32-bit integer from the stream message.
 *
 * @return a 32-bit integer value from the stream message, interpreted
 * as an int
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of message stream has
 *                                been reached.     
 * @exception KMMessageFormatException if this type conversion is invalid.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (int) readInt;

/**
 * Reads a 64-bit integer from the stream message.
 *
 * @return a 64-bit integer value from the stream message, interpreted as
 * a long
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of message stream has
 *                                been reached.     
 * @exception KMMessageFormatException if this type conversion is invalid.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (long long) readLong;

/**
 * Reads a float from the stream message.
 *
 * @return a float value from the stream message
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of message stream has
 *                                been reached.     
 * @exception KMMessageFormatException if this type conversion is invalid.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (float) readFloat;

/**
 * Reads a double from the stream message.
 *
 * @return a double value from the stream message
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of message stream has
 *                                been reached.     
 * @exception KMMessageFormatException if this type conversion is invalid.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (double) readDouble;

/**
 * Reads a String from the stream message.
 *
 * @return a Unicode string from the stream message
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of message stream has
 *                                been reached.     
 * @exception KMMessageFormatException if this type conversion is invalid.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (NSString*) readString;

/**
 * Reads a byte array field from the stream message into the 
 * specified byte[] object (the read buffer). 
 * 
 * To read the field value, readBytes should be 
 * successively called 
 * until it returns a value less than the length of the read buffer.
 * The value of the bytes in the buffer following the last byte 
 * read is undefined.
 * 
 * If readBytes returns a value equal to the length of the 
 * buffer, a subsequent readBytes call must be made. If there 
 * are no more bytes to be read, this call returns -1.
 * 
 * If the byte array field value is null, readBytes 
 * returns -1.
 *
 * If the byte array field value is empty, readBytes 
 * returns 0.
 * 
 * Once the first readBytes call on a byte[]
 * field value has been made,
 * the full value of the field must be read before it is valid to read 
 * the next field. An attempt to read the next field before that has 
 * been done will throw a KMMessageFormatException.
 * 
 * To read the byte field value into a new byte[] object, 
 * use the readObject method.
 *
 * @param value the buffer into which the data is read
 *
 * @return the total number of bytes read into the buffer, or -1 if 
 * there is no more data because the end of the byte field has been 
 * reached
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of message stream has
 *                                been reached.     
 * @exception KMMessageFormatException if this type conversion is invalid.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 * 
 * @see readObject
 */
- (int) readBytes:(NSData*)value;

/**
 * Reads an object from the stream message.
 *
 * This method can be used to return, in objectified format,
 * an object  that has 
 * been written to the stream with the equivalent
 * writeObject method call, or its equivalent primitive
 * _writeType_ method.
 *  
 * Note that byte values are returned as NSData, not byte[].
 *
 * An attempt to call readObject to read a byte field 
 * value into a new byte[] object before the full value of the
 * byte field has been read will throw a 
 * KMMessageFormatException.
 *
 * @return a object from the stream message, in objectified
 * format (for example, if the object was written as an int, 
 * an NSNumber is returned)
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of message stream has
 *                                been reached.     
 * @exception KMMessageFormatException if this type conversion is invalid.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (KCObject*) readObject;

/**
 * Writes a boolean to the stream message.
 * The value true is written as the value 
 * (byte)1; the value false is written as 
 * the value (byte)0.
 *
 * @param value the boolean value to be written
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeBoolean:(BOOL)value;

/**
 * Writes a byte to the stream message.
 *
 * @param value the byte value to be written
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeByte:(char)value;

/**
 * Writes a short to the stream message.
 *
 * @param value the short value to be written
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeShort:(short)value;

/**
 * Writes a char to the stream message.
 *
 * @param value the char value to be written
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeChar:(unichar)value;

/**
 * Writes an int to the stream message.
 *
 * @param value the int value to be written
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeInt:(int)value;

/**
 * Writes a long to the stream message.
 *
 * @param value the long value to be written
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeLong:(long long)value;

/**
 * Writes a float to the stream message.
 *
 * @param value the float value to be written
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeFloat:(float)value;

/**
 * Writes a double to the stream message.
 *
 * @param value the double value to be written
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeDouble:(double)value;

/**
 * Writes a String to the stream message.
 *
 * @param value the String value to be written
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeString:(NSString*)value;

/**
 * Writes a byte array field to the stream message.
 *
 * The byte array value is written to the message
 * as a byte array field. Consecutively written byte array fields are 
 * treated as two distinct fields when the fields are read.
 * 
 * @param value the byte array value to be written
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeBytes:(NSData*)value;

/**
 * Writes a portion of a byte array as a byte array field to the stream 
 * message.
 *  
 * The a portion of the byte array value is written to the
 * message as a byte array field. Consecutively written byte 
 * array fields are treated as two distinct fields when the fields are 
 * read.
 *
 * @param value the byte array value to be written
 * @param offset the initial offset within the byte array
 * @param length the number of bytes to use
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeBytes:(NSData*)value offset:(int)offset length:(int)length;

/**
 * Writes an object to the stream message.
 *
 * This method works only for the objectified primitive
 * object types (Integer, Double, 
 * Long...), String objects, and byte 
 * arrays.
 *
 * @param value the object to be written
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if the object is invalid.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeObject:(NSObject*)value;

/**
 * Puts the message body in read-only mode and repositions the stream
 * to the beginning.
 *  
 * @exception KMJMSException if the JMS provider fails to reset the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if the message has an invalid
 *                                   format.
 */
- (void) reset;

@end

#endif

