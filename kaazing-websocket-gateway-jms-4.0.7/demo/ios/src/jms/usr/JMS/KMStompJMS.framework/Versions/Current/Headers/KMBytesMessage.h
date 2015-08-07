/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMMessage.h"

/**
 * A BytesMessage object is used to send a message containing a 
 * stream of uninterpreted bytes. It inherits from the Message 
 * interface and adds a bytes
 * message body. The receiver of the message supplies the interpretation
 * of the bytes.
 *
 * This message type is for client encoding of existing message formats. 
 * If possible, one of the other self-defining message types should be used 
 * instead.
 *
 * Although the JMS API allows the use of message properties with byte 
 * messages, they are typically not used, since the inclusion of properties 
 * may affect the format.
 *
 * The primitive types can be written explicitly using methods
 * for each type. They may also be written generically as objects.
 * For instance, a call to BytesMessage.WriteInt(6) is
 * equivalent to BytesMessage.WriteObject(new Integer(6)).
 * Both forms are provided, because the explicit form is convenient for
 * static programming, and the object form is needed when types are not known
 * at compile time.
 *
 * When the message is first created, and when ClearBody
 * is called, the body of the message is in write-only mode. After the 
 * first call to Reset has been made, the message body is in 
 * read-only mode. 
 * After a message has been sent, the client that sent it can retain and 
 * modify it without affecting the message that has been sent. The same message
 * object can be sent multiple times.
 * When a message has been received, the provider has called 
 * reset so that the message body is in read-only mode for the client.
 *
 * If ClearBody method is called on a message in read-only mode, 
 * the message body is cleared and the message is in write-only mode.
 *
 * If a client attempts to read a message in write-only mode, a 
 * KMMessageNotReadableException is thrown.
 *
 * If a client attempts to write a message in read-only mode, a 
 * KMMessageNotWriteableException is thrown.
 *
 * @warning Note that the following methods of KMBytesMessage are currently not implemented:
 *   <ul>
 *     <li>readFloat
 *     <li>readDouble
 *     <li>writeFloat
 *     <li>writeDouble
 *     <li>writeObject
 *   </ul>
 * </b>
 *
 * @see [KMSession createBytesMessage]
 * @see KMTextMessage
 */
@interface KMBytesMessage : KMMessage

/**
 * Gets the number of bytes of the message body when the message
 * is in read-only mode. The value returned can be used to allocate 
 * a byte array. The value returned is the entire length of the message
 *  body, regardless of where the pointer for reading the message 
 * is currently located.
 * 
 * @return number of bytes in the message
 * @exception KMJMSException if the JMS provider fails to read the message 
 *                         due to some internal error.
 * @exception KMMessageNotReadableException if the message is in write-only
 *                         mode.
 */
- (long long) bodyLength;

/**
 * Reads a bool from the bytes message stream.
 *
 * @return the bool value read
 * @exception KMJMSException if the JMS provider fails to read the message 
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of bytes stream has 
 *                                been reached.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 *
 */
- (BOOL) readBoolean;

/**
 * Reads a signed 8-bit value from the bytes message stream.
 *
 * @return the next byte from the bytes message stream as a signed 8-bit
 * byte
 * @exception KMJMSException if the JMS provider fails to read the message 
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of bytes stream has 
 *                                been reached.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (char) readByte;

/**
 * Reads an unsigned 8-bit number from the bytes message stream.
 *
 * @return the next byte from the bytes message stream, interpreted as an
 * unsigned 8-bit number
 * @exception KMJMSException if the JMS provider fails to read the message 
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of bytes stream has 
 *                                been reached.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (unsigned char) readUnsignedByte;

/**
 * Reads a signed 16-bit number from the bytes message stream.
 *
 * @return the next two bytes from the bytes message stream, interpreted as
 * a signed 16-bit number
 * @exception KMJMSException if the JMS provider fails to read the message 
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of bytes stream has 
 *                                been reached.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (short) readShort;

/**
 * Reads an unsigned 16-bit number from the bytes message stream.
 *  
 * @return the next two bytes from the bytes message stream, interpreted as
 * an unsigned 16-bit integer
 *
 * @exception KMJMSException if the JMS provider fails to read the message 
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of bytes stream has 
 *                                been reached.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (unsigned short) readUnsignedShort;

/**
 * Reads a Unicode character value from the bytes message stream.
 *
 * @return the next two bytes from the bytes message stream as a Unicode
 * character
 *
 * @exception KMJMSException if the JMS provider fails to read the message 
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of bytes stream has 
 *                                been reached.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (unichar) readChar;

/**
 * Reads a signed 32-bit integer from the bytes message stream.
 *
 * @return the next four bytes from the bytes message stream, interpreted
 * as an int
 *
 * @exception KMJMSException if the JMS provider fails to read the message 
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of bytes stream has 
 *                                been reached.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (int) readInt;

/**
 * Reads a signed 64-bit integer from the bytes message stream.
 *
 * @return the next eight bytes from the bytes message stream, interpreted
 * as a long
 *
 * @exception KMJMSException if the JMS provider fails to read the message 
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of bytes stream has 
 *                                been reached.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (long long) readLong;

/**
 * Reads a float from the bytes message stream.
 *
 * @warning Currently, this method is not implemented.
 *
 * @return the next four bytes from the bytes message stream, interpreted
 * as a float
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of bytes stream has
 *                                been reached.
 * @exception KMMessageNotReadableException if the message is in write-only
 *                                        mode.
 */
- (float) readFloat;

/**
 * Reads a double from the bytes message stream.
 *
 * @return the next eight bytes from the bytes message stream, interpreted
 * as a double
 *
 * @warning Currently, this method is not implemented.
 *
 * @exception KMJMSException if the JMS provider fails to read the message 
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of bytes stream has 
 *                                been reached.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (double) readDouble;

/**
 * Reads a string that has been encoded using a modified UTF-8
 * format from the bytes message stream.
 *
 * For more information on the UTF-8 format, see "File System Safe
 * UCS Transformation Format (FSS_UTF)", X/Open Preliminary Specification,
 * X/Open Company Ltd., Document Number: P316. This information also
 * appears in ISO/IEC 10646, Annex P.
 *
 * @return a Unicode string from the bytes message stream
 *
 * @exception KMJMSException if the JMS provider fails to read the message 
 *                         due to some internal error.
 * @exception KMMessageEOFException if unexpected end of bytes stream has 
 *                                been reached.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (NSString*) readUTF;

/**
 * Reads a byte array from the bytes message stream.
 *
 * If the length of array value is less than the number of 
 * bytes remaining to be read from the stream, the array should 
 * be filled. A subsequent call reads the next increment, and so on.
 * 
 * If the number of bytes remaining in the stream is less than the 
 * length of 
 * array value, the bytes should be read into the array. 
 * The return value of the total number of bytes read will be less than
 * the length of the array, indicating that there are no more bytes left 
 * to be read from the stream. The next read of the stream returns -1.
 *
 * @param value the buffer into which the data is read
 *
 * @return the total number of bytes read into the buffer, or -1 if 
 * there is no more data because the end of the stream has been reached
 *
 * @exception KMJMSException if the JMS provider fails to read the message 
 *                         due to some internal error.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (int) readBytes:(NSMutableData*)value;

/**
 * Reads a portion of the bytes message stream.
 *
 * If the length of array value is less than the number of
 * bytes remaining to be read from the stream, the array should 
 * be filled. A subsequent call reads the next increment, and so on.
 * 
 * If the number of bytes remaining in the stream is less than the 
 * length of 
 * array value, the bytes should be read into the array. 
 * The return value of the total number of bytes read will be less than
 * the length of the array, indicating that there are no more bytes left 
 * to be read from the stream. The next read of the stream returns -1.
 *
 *  If length is negative, or
 * length is greater than the length of the array
 * value, then a KMIndexOutOfRangeException is
 * thrown. No bytes will be read from the stream for this exception case.
 *  
 * @param value the buffer into which the data is read
 * @param length the number of bytes to read; must be less than or equal to
 *        value.length
 * 
 * @return the total number of bytes read into the buffer, or -1 if
 * there is no more data because the end of the stream has been reached
 * @exception KMJMSException if the JMS provider fails to read the message 
 *                         due to some internal error.
 * @exception KMMessageNotReadableException if the message is in write-only 
 *                                        mode.
 */
- (int) readBytes:(NSMutableData*)value length:(int)length;

/**
 * Writes a bool to the bytes message stream as a 1-byte 
 * value.
 * The value true is written as the value 
 * (byte)1; the value false is written as 
 * the value (byte)0.
 *
 * @param value the bool value to be written
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeBoolean:(BOOL)value;

/**
 * Writes a byte to the bytes message stream as a 1-byte 
 * value.
 *
 * @param value the byte value to be written
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeByte:(unsigned char)value;

/**
 * Writes a short to the bytes message stream as two bytes,
 * high byte first.
 *
 * @param value the short to be written
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeShort:(short)value;

/**
 * Writes a char to the bytes message stream as a 2-byte
 * value, high byte first.
 *
 * @param value the char value to be written
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeChar:(unichar)value;

/**
 * Writes an int to the bytes message stream as four bytes, 
 * high byte first.
 *
 * @param value the int to be written
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeInt:(int)value;

/**
 * Writes a long to the bytes message stream as eight bytes, 
 * high byte first.
 *
 * @param value the long to be written
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeLong:(long long)value;

/**
 * Converts the float argument to an int using 
 * the
 * floatToIntBits method in class Float,
 * and then writes that int value to the bytes message
 * stream as a 4-byte quantity, high byte first.
 *
 * @warning Currently, this method is not implemented.
 *
 * @param value the float value to be written
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeFloat:(float)value;

/**
 * Converts the double argument to a long using 
 * the
 * doubleToLongBits method in class Double,
 * and then writes that long value to the bytes message
 * stream as an 8-byte quantity, high byte first.
 *
 * @warning Currently, this method is not implemented.
 *
 * @param value the double value to be written
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeDouble:(double)value;

/**
 * Writes a string to the bytes message stream using UTF-8 encoding in a 
 * machine-independent manner.
 *
 * For more information on the UTF-8 format, see "File System Safe 
 * UCS Transformation Format (FSS_UTF)", X/Open Preliminary Specification,       
 * X/Open Company Ltd., Document Number: P316. This information also 
 * appears in ISO/IEC 10646, Annex P. 
 *
 * @param value the String value to be written
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeUTF:(NSString*)value;

/**
 * Writes a byte array to the bytes message stream.
 *
 * @param value the byte array to be written
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeBytes:(NSData*)value;

/**
 * Writes a portion of a byte array to the bytes message stream.
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
 * Writes an object to the bytes message stream.
 *
 * This method works only for the objectified primitive
 * object types (Integer, Double, Long...), String objects, and byte 
 * arrays.
 *
 * @warning Currently, this method is not implemented.
 *
 * @param value the object value to be written
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if the object is of an invalid type.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) writeObject:(NSObject*)value;

/**
 * Puts the message body in read-only mode and repositions the stream of 
 * bytes to the beginning.
 *  
 * @exception KMJMSException if the JMS provider fails to reset the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if the message has an invalid
 *                         format.
 */
- (void) reset;

@end
