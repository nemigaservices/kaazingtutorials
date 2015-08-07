/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMMessage.h"

/**
 * A KMMapMessage object is used to send a set of name-value pairs.
 * The names are String objects, and the values are primitive 
 * data types. The names must have a value that
 * is not null, and not an empty string. The entries can be accessed 
 * sequentially or randomly by name. The order of the entries is undefined. 
 * KMMapMessage inherits from the Message interface
 * and adds a message body that contains a Map.
 *
 * The primitive types can be read or written explicitly using methods
 * for each type. They may also be read or written generically as objects.
 * For instance, a call to KMMapMessage.setInt("foo", 6) is 
 * equivalent to KMMapMessage.setObject("foo", new Integer(6)).
 * Both forms are provided, because the explicit form is convenient for
 * static programming, and the object form is needed when types are not known
 * at compile time.
 *
 * When a client receives a KMMapMessage, it is in read-only 
 * mode. If a client attempts to write to the message at this point, a 
 * KMMessageNotWriteableException is thrown. If 
 * clearBody is called, the message can now be both read from and 
 * written to.
 *
 * KMMapMessage objects support the following conversion table. 
 * The marked cases must be supported. The unmarked cases must throw a 
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
 *
 * @see [KMSession createMapMessage]
 * @see KMTextMessage
 * @see KMBytesMessage
 * @see KMMessage
 */
@interface KMMapMessage : KMMessage

/**
 * Returns the boolean value with the specified name.
 *
 * @param name the name of the boolean
 *
 * @return the boolean value with the specified name
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid.
 */
- (BOOL) getBoolean:(NSString*)name;

/**
 * Returns the byte value with the specified name.
 *
 * @param name the name of the byte
 *
 * @return the byte value with the specified name
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid.
 */ 
- (Byte) getByte:(NSString*)name;

/**
 * Returns the short value with the specified name.
 *
 * @param name the name of the short
 *
 * @return the short value with the specified name
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid. 
 */ 
- (short) getShort:(NSString*)name;

/**
 * Returns the Unicode character value with the specified name.
 *
 * @param name the name of the Unicode character
 *
 * @return the Unicode character value with the specified name
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid.
 */ 
- (char) getChar:(NSString*)name;

/**
 * Returns the int value with the specified name.
 *
 * @param name the name of the int
 *
 * @return the int value with the specified name
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid.
 */ 
- (int) getInt:(NSString*)name;

/**
 * Returns the long value with the specified name.
 *
 * @param name the name of the long
 *
 * @return the long value with the specified name
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid.
 */ 
- (long long) getLong:(NSString*)name;

/**
 * Returns the float value with the specified name.
 *
 * @param name the name of the float
 *
 * @return the float value with the specified name
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid.
 */ 
- (float) getFloat:(NSString*)name;

/**
 * Returns the double value with the specified name.
 *
 * @param name the name of the double
 *
 * @return the double value with the specified name
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid.
 */ 
- (double) getDouble:(NSString*)name;

/**
 * Returns the String value with the specified name.
 *
 * @param name the name of the String
 *
 * @return the String value with the specified name; if there 
 * is no item by this name, a null value is returned
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid.
 */ 
- (NSString*) getString:(NSString*)name;

/**
 * Returns the byte array value with the specified name.
 *
 * @param name the name of the byte array
 *
 * @return a copy of the byte array value with the specified name; if there
 * is no
 * item by this name, a null value is returned.
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid. 
 */ 
- (NSData*) getBytes:(NSString*)name;

/**
 * Returns the value of the object with the specified name.
 *
 * @param name the name of the object
 *
 * @return The return value is one of NSString, NSData, or NSNumber types
 * depending on the type of value matching the key.
 * nil is returned if there is no matching key, or if the value itself is empty (null).
 * If the map message entry contains a string or byte array, then getObject
 * returns NSString or NSData respectively.  Numeric values, as well as byte and boolean
 * are returned as NSNumber.  The application developer may prefer to 
 * use the appropriate getter methods to retrieve the value when the
 * data type is known to retrieve a specific data type.
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 */
- (NSObject*) getObject:(NSString*)name;

/**
 * Returns an Enumeration of all the names in the 
 * KMMapMessage object.
 *
 * @return an enumeration of all the names in this KMMapMessage
 *
 * @exception KMJMSException if the JMS provider fails to read the message
 *                         due to some internal error.
 */
- (NSEnumerator*) mapNames;

/**
 * Sets a boolean value with the specified name into the Map.
 *
 * @param name the name of the boolean
 * @param value the boolean value to set in the Map
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */
- (void) setBoolean:(NSString*)name value:(BOOL)value;

/**
 * Sets a byte value with the specified name into the Map.
 *
 * @param name the name of the byte
 * @param value the byte value to set in the Map
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */ 
- (void) setByte:(NSString*)name value:(Byte)value;

/**
 * Sets a short value with the specified name into the Map.
 *
 * @param name the name of the short
 * @param value the short value to set in the Map
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */ 
- (void) setShort:(NSString*)name value:(short)value;

/**
 * Sets a Unicode character value with the specified name into the Map.
 *
 * @param name the name of the Unicode character
 * @param value the Unicode character value to set in the Map
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */ 
- (void) setChar:(NSString*)name value:(char)value;

/**
 * Sets an int value with the specified name into the Map.
 *
 * @param name the name of the int
 * @param value the int value to set in the Map
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */ 
- (void) setInt:(NSString*)name value:(int)value;

/**
 * Sets a long value with the specified name into the Map.
 *
 * @param name the name of the long
 * @param value the long value to set in the Map
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */ 
- (void) setLong:(NSString*)name value:(long long)value;

/**
 * Sets a float value with the specified name into the Map.
 *
 * @param name the name of the float
 * @param value the float value to set in the Map
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */ 
- (void) setFloat:(NSString*)name value:(float)value;

/**
 * Sets a double value with the specified name into the Map.
 *
 * @param name the name of the double
 * @param value the double value to set in the Map
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */ 
- (void) setDouble:(NSString*)name value:(double)value;

/**
 * Sets a String value with the specified name into the Map.
 *
 * @param name the name of the String
 * @param value the String value to set in the Map
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */ 
- (void) setString:(NSString*)name value:(NSString*)value;

/**
 * Sets a byte array value with the specified name into the Map.
 *
 * @param name the name of the byte array
 * @param value the byte array value to set in the Map; the array
 *              is copied so that the value for name will
 *              not be altered by future modifications
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception NSException if the name is null, or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */ 
- (void) setBytes:(NSString*)name value:(NSData*)value;

/**
 * Sets a portion of the byte array value with the specified name into the 
 * Map.
 *  
 * @param name the name of the byte array
 * @param value the byte array value to set in the Map
 * @param offset the initial offset within the byte array
 * @param length the number of bytes to use
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */ 
- (void) setBytes:(NSString*)name value:(NSData*)value offset:(int)offset length:(int)length;

/**
 * Sets an object value with the specified name into the Map.
 *
 * This method works only for NSNumber, NSString, and NSData.
 *
 * @param name the name of the object
 * @param value the object value to set in the Map
 *
 * @exception KMJMSException if the JMS provider fails to write the message
 *                         due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageFormatException if the object is invalid.
 * @exception KMMessageNotWriteableException if the message is in read-only 
 *                                         mode.
 */ 
- (void) setObject:(NSString*)name value:(NSObject*)value;

/**
 * Indicates whether an item exists in this KMMapMessage object.
 *
 * @param name the name of the item to test
 *
 * @return true if the item exists
 *
 * @exception KMJMSException if the JMS provider fails to determine if the 
 *                         item exists due to some internal error.
 */ 
- (BOOL) itemExists:(NSString*)name;

@end
