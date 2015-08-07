/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KMDestination.h"

#define KMMessageDefaultDeliveryMode 2
#define KMMessageDefaultPriority     4
#define KMMessageDefaultTimeToLive   0LL

/**
 * The KMMessage interface is the root interface of all JMS
 * messages. It defines the message header and the acknowledge 
 * method used for all messages.
 *
 * Most message-oriented middleware (MOM) products treat messages as 
 * lightweight entities that consist
 * of a header and a payload. The header contains fields used for message
 * routing and identification; the payload contains the application data
 * being sent.
 *
 * Within this general form, the definition of a message varies
 * significantly across products. It would be quite difficult for the JMS API
 * to support all of these message models.
 *
 * With this in mind, the JMS message model has the following goals:
 *
 *   - Provide a single, unified message API
 *   - Provide an API suitable for creating messages that match the
 *       format used by provider-native messaging applications
 *   - Support the development of heterogeneous applications that span
 *       operating systems, machine architectures, and computer languages
 *   - Support messages containing objects
 *       ("objects")
 *   - Support messages containing Extensible Markup Language (XML) pages
 *
 * JMS messages are composed of the following parts:
 *
 *   - Header - All messages support the same set of header fields. 
 *       Header fields contain values used by both clients and providers to 
 *       identify and route messages.
 *   - Properties - Each message contains a built-in facility for supporting
 *       application-defined property values. Properties provide an efficient 
 *       mechanism for supporting application-defined message filtering.
 *   - Body - The JMS API defines several types of message body, which cover
 *       the majority of messaging styles currently in use.
 *
 * <H4>Message Bodies</H4>
 *
 * The JMS API defines five types of message body:
 *
 *   - Stream - A StreamMessage object's message body contains 
 *       a stream of primitive values in the Java programming 
 *       language ("Java primitives"). It is filled and read sequentially.
 *   - Map - A MapMessage object's message body contains a set 
 *       of name-value pairs, where names are String 
 *       objects, and values are Java primitives. The entries can be accessed 
 *       sequentially or randomly by name. The order of the entries is 
 *       undefined.
 *   - Text - A KMTextMessage object's message body contains a 
 *       String object. This message type can be used
 *       to transport plain-text messages, and XML messages.
 *   - Object - An ObjectMessage object's message body contains 
 *       a Serializable object.
 *   - Bytes - A BytesMessage object's message body contains a 
 *       stream of uninterpreted bytes. This message type is for 
 *       literally encoding a body to match an existing message format. In 
 *       many cases, it is possible to use one of the other body types, 
 *       which are easier to use. Although the JMS API allows the use of  
 *       message properties with byte messages, they are typically not used,
 *       since the inclusion of properties may affect the format.
 *
 * <H4>Message Headers</H4>
 *
 * The JMSCorrelationID header field is used for linking one message with
 * another. It typically links a reply message with its requesting message.
 *
 * JMSCorrelationID can hold a provider-specific message ID,
 * an application-specific String object, or a provider-native 
 * byte[] value.
 *
 * <H4>Message Properties</H4>
 *
 * A Message object contains a built-in facility for supporting
 * application-defined property values. In effect, this provides a mechanism 
 * for adding application-specific header fields to a message.
 *
 * Properties allow an application, via message selectors, to have a JMS 
 * provider select, or filter, messages on its behalf using 
 * application-specific criteria.
 *
 * Property names must obey the rules for a message selector identifier. 
 * Property names must not be null, and must not be empty strings. If a property
 * name is set and it is either null or an empty string, an
 * exception must be thrown.
 *
 * Property values can be boolean, byte, short, int, long, float,
 * double, and String.
 *
 * Property values are set prior to sending a message. When a client 
 * receives a message, its properties are in read-only mode. If a 
 * client attempts to set properties at this point, a 
 * KMMessageNotWriteableException is thrown. If 
 * clearProperties is called, the properties can now be both
 * read from and written to. Note that header fields are distinct from 
 * properties. Header fields are never in read-only mode. 
 *
 * A property value may duplicate a value in a message's body, or it may 
 * not. Although JMS does not define a policy for what should or should not 
 * be made a property, application developers should note that JMS providers 
 * will likely handle data in a message's body more efficiently than data in 
 * a message's properties. For best performance, applications should use
 * message properties only when they need to customize a message's header. 
 * The primary reason for doing this is to support customized message 
 * selection.
 *
 * Message properties support the following conversion table. The marked 
 * cases must be supported. The unmarked cases must throw a 
 * KMJMSException. The String-to-primitive conversions 
 * may throw a runtime exception if the
 * primitive's valueOf method does not accept the 
 * String as a valid representation of the primitive.
 *
 * A value written as the row type can be read as the column type.
 *
 * <pre><code>
 *     |        | boolean byte short int long float double String 
 *     |----------------------------------------------------------
 *     |boolean |    X                                       X
 *     |byte    |          X     X    X   X                  X 
 *     |short   |                X    X   X                  X 
 *     |int     |                     X   X                  X 
 *     |long    |                         X                  X 
 *     |float   |                               X     X      X 
 *     |double  |                                     X      X 
 *     |String  |    X     X     X    X   X     X     X      X 
 *     |----------------------------------------------------------
 * </code></pre>
 *
 * In addition to the type-specific set/get methods for properties, JMS 
 * provides the setObjectProperty and 
 * getObjectProperty methods. These support the same set of 
 * property types using the objectified primitive values. Their purpose is 
 * to allow the decision of property type to made at execution time rather 
 * than at compile time. They support the same property value conversions.
 *
 * The setObjectProperty method accepts values of class 
 * Boolean, Byte, Short, Integer, Long, Float, Double, and String. An attempt 
 * to use any other class must throw a KMJMSException.
 *
 * The getObjectProperty method only returns values of class 
 * Boolean, Byte, Short, Integer, Long, Float, Double, and String.
 *
 * The order of property values is not defined. To iterate through a 
 * message's property values, use getPropertyNames to retrieve 
 * a property name enumeration and then use the various property get methods 
 * to retrieve their values.
 *
 * A message's properties are deleted by the clearProperties
 * method. This leaves the message with an empty set of properties.
 *
 * Getting a property value for a name which has not been set returns a 
 * null value. Only the getStringProperty and 
 * getObjectProperty methods can return a null value. 
 * Attempting to read a null value as a primitive type will convert to
 * a numeric or string value where possible.
 *
 * The JMS API reserves the JMSX property name prefix for JMS 
 * defined properties.
 * The full set of these properties is defined in the Java Message Service
 * specification. New JMS defined properties may be added in later versions 
 * of the JMS API.  Support for these properties is optional. The 
 * [KMConnectionMetaData JMSXPropertyNames] method 
 * returns the names of the JMSX properties supported by a connection.
 *
 * JMSX properties may be referenced in message selectors whether or not
 * they are supported by a connection. If they are not present in a
 * message, they are treated like any other absent property.
 *
 * JMSX properties defined in the specification as "set by provider on 
 * send" are available to both the producer and the consumers of the message. 
 * JMSX properties defined in the specification as "set by provider on 
 * receive" are available only to the consumers.
 *
 * JMSXGroupID and JMSXGroupSeq are standard properties that clients 
 * should use if they want to group messages. All providers must support them.
 * Unless specifically noted, the values and semantics of the JMSX properties 
 * are undefined.
 *
 * The JMS API reserves the _JMS_vendor_name_ property 
 * name prefix for provider-specific properties. Each provider defines its own 
 * value for _vendor_name_. This is the mechanism a JMS 
 * provider uses to make its special per-message services available to a JMS 
 * client.
 *
 * The purpose of provider-specific properties is to provide special 
 * features needed to integrate JMS clients with provider-native clients in a 
 * single JMS application. They should not be used for messaging between JMS 
 * clients.
 *
 * <H4>Provider Implementations of JMS Message Interfaces</H4>
 *
 * The JMS API provides a set of message interfaces that define the JMS 
 * message model. It does not provide implementations of these interfaces.
 *
 * Each JMS provider supplies a set of message factories with its 
 * Session object for creating instances of messages. This allows 
 * a provider to use message implementations tailored to its specific needs.
 *
 * A provider must be prepared to accept message implementations that are 
 * not its own. They may not be handled as efficiently as its own 
 * implementation; however, they must be handled.
 *
 * Note the following exception case when a provider is handling a foreign 
 * message implementation. If the foreign message implementation contains a 
 * JMSReplyTo header field that is set to a foreign destination 
 * implementation, the provider is not required to handle or preserve the 
 * value of this header field. 
 *
 * <H4>Message Selectors</H4>
 *
 * A JMS message selector allows a client to specify, by
 * header field references and property references, the
 * messages it is interested in. Only messages whose header 
 * and property values match the selector are delivered.
 *
 * Message selectors cannot reference message body values.
 *
 * A message selector matches a message if the selector evaluates to 
 * true when the message's header field values and property values are 
 * substituted for their corresponding identifiers in the selector.
 *
 * A message selector is a String whose syntax is based on a subset of 
 * the SQL92 conditional expression syntax. If the value of a message selector 
 * is an empty string, the value is treated as a null and indicates that there 
 * is no message selector for the message consumer. 
 *
 * The order of evaluation of a message selector is from left to right 
 * within precedence level. Parentheses can be used to change this order.
 *
 * Predefined selector literals and operator names are shown here in 
 * uppercase; however, they are case insensitive.
 *
 * A selector can contain:
 *
 * _Literals_
 *
 *       - A string literal is enclosed in single quotes, with a single quote 
 *         represented by doubled single quote; for example, 
 *         'literal' and 'literal''s'. Like 
 *         string literals, these use the 
 *         Unicode character encoding.
 *       - An exact numeric literal is a numeric value without a decimal 
 *         point, such as 57, -957, and  
 *         +62; numbers in the range of long are 
 *         supported. 
 *       - An approximate numeric literal is a numeric value in scientific 
 *         notation, such as 7E3 and -57.9E2, or a 
 *         numeric value with a decimal, such as 7., 
 *         -95.7, and +6.2; numbers in the range of 
 *         double are supported.
 *       - The boolean literals TRUE and FALSE.
 *
 * _Identifiers_
 *
 *       - An identifier is an unlimited-length sequence of letters 
 *         and digits, the first of which must be a letter. A letter is any 
 *         character for which the method Character.isJavaLetter
 *         returns true. This includes '_' and '$'.
 *         A letter or digit is any character for which the method 
 *         Character.isJavaLetterOrDigit returns true.
 *       - Identifiers cannot be the names NULL, 
 *         TRUE, and FALSE.
 *       - Identifiers cannot be NOT, AND, 
 *         OR, BETWEEN, LIKE, 
 *         IN, IS, or ESCAPE.
 *       - Identifiers are either header field references or property 
 *         references.  The type of a property value in a message selector 
 *         corresponds to the type used to set the property. If a property 
 *         that does not exist in a message is referenced, its value is 
 *         NULL.
 *       - The conversions that apply to the get methods for properties do not
 *         apply when a property is used in a message selector expression.
 *         For example, suppose you set a property as a string value, as in the
 *         following:
 *         `myMessage.setStringProperty("NumberOfOrders", "2");`
 *         The following expression in a message selector would evaluate to 
 *         false, because a string cannot be used in an arithmetic expression:
 *         `"NumberOfOrders > 1"`
 *       - Identifiers are case-sensitive.
 *       - Message header field references are restricted to 
 *         JMSDeliveryMode, JMSPriority, 
 *         JMSMessageID, JMSTimestamp, 
 *         JMSCorrelationID, and JMSType. 
 *         JMSMessageID, JMSCorrelationID, and 
 *         JMSType values may be null and if so are treated as a 
 *         NULL value.
 *       - Any name beginning with 'JMSX' is a JMS defined  
 *         property name.
 *       - Any name beginning with 'JMS_' is a provider-specific 
 *         property name.
 *       - Any name that does not begin with 'JMS' is an 
 *         application-specific property name.
 *       - White space is the same as that defined for the Java programming
 *         language: space, horizontal tab, form feed, and line terminator.
 *
 * _Expressions_
 *
 *       - A selector is a conditional expression; a selector that evaluates 
 *         to true matches; a selector that evaluates to 
 *         false or unknown does not match.
 *       - Arithmetic expressions are composed of themselves, arithmetic 
 *         operations, identifiers (whose value is treated as a numeric 
 *         literal), and numeric literals.
 *       - Conditional expressions are composed of themselves, comparison 
 *         operations, and logical operations.
 *       - Standard bracketing () for ordering expression evaluation
 *         is supported.
 *
 * _Logical operators_
 *
 *       - Logical operators in precedence order: NOT, AND, O_
 *
 * _Comparison operators_
 *
 *       - Comparison operators: =, &gt;, &gt;=, &lt;, &lt;=, &lt;&gt; (not equal)
 *       - Only like type values can be compared. One exception is that it 
 *         is valid to compare exact numeric values and approximate numeric 
 *         values; the type conversion required is defined by the rules of 
 *         numeric promotion. If the 
 *         comparison of non-like type values is attempted, the value of the 
 *         operation is false. If either of the type values evaluates to 
 *         NULL, the value of the expression is unknown.   
 *       - String and boolean comparison is restricted to = and 
 *         &lt;&gt;. Two strings are equal 
 *         if and only if they contain the same sequence of characters.
 *
 * _Arithmetic operators_
 *
 *       - +, - (unary) - highest precedence
 *       - *, / (multiplication and division)
 *       - +, - (addition and subtraction)
 *       - Arithmetic operations must use numeric promotion as in the Java 
 *         programming language.
 *       - arithmetic-expr1 [NOT] BETWEEN arithmetic-expr2 AND arithmetic-expr3 (comparison operator)
 *           - "age BETWEEN 15 AND 19" is equivalent to 
 *             "age&gt;= 15 AND age &lt;= 19"
 *           - "age NOT BETWEEN 15 AND 19" is equivalent to 
 *             "age &lt; 15 OR age &gt; 19"
 *
 * _Identifiers_
 *
 *   - identifier [NOT] IN (string-literal1, 
 *       string-literal2,...) (comparison operator where 
 *       identifier has a String or 
 *       NULL value)
 *       - "Country IN (' UK', 'US', 'France')"
 *         is true for 
 *         'UK' and false for 'Peru'; it is 
 *         equivalent to the expression 
 *         "(Country= ' UK') OR (Country = ' US') OR (Country = ' France')"
 *       - "Country NOT IN (' UK', 'US', 'France')" 
 *         is false for 'UK' and true for 'Peru'; it 
 *         is equivalent to the expression 
 *         "NOT((Country = ' UK') OR (Country = ' US') OR (Country = ' France'))"
 *       - If identifier of an IN or NOT IN 
 *         operation is NULL, the value of the operation is 
 *         unknown.
 *   - identifier [NOT] LIKE pattern-value [ESCAPE escape-character]
 *        (comparison operator, where 
 *       identifier has a String value; 
 *       pattern-value is a string literal where 
 *       '_' stands for any single character; '%' 
 *       stands for any sequence of characters, including the empty sequence; 
 *       and all other characters stand for themselves. The optional 
 *       escape-character is a single-character string 
 *       literal whose character is used to escape the special meaning of the 
 *       '_' and '%' in 
 *       pattern-value.)
 *       - "phone LIKE '12%3'" is true for 
 *         '123' or '12993' and false for 
 *         '1234'
 *       - "word LIKE 'l_se'" is true for 
 *         'lose' and false for 'loose'
 *       - "underscored LIKE '\_%' ESCAPE '\'"
 *          is true for '_foo' and false for 'bar'
 *       - "phone NOT LIKE '12%3'" is false for 
 *         '123' or '12993' and true for 
 *         '1234'
 *       - If identifier of a LIKE or 
 *         NOT LIKE operation is NULL, the value 
 *         of the operation is unknown.
 *   - identifier IS NULL (comparison operator that tests
 *       for a null header field value or a missing property value)
 *         - "prop_name IS NULL"
 *   - identifier IS NOT NULL (comparison operator that
 *       tests for the existence of a non-null header field value or a property
 *       value)
 *         - "prop_name IS NOT NULL"
 *
 * JMS providers are required to verify the syntactic correctness of a 
 * message selector at the time it is presented. A method that provides a 
 * syntactically incorrect selector must result in a KMJMSException.
 *
 * JMS providers may also optionally provide some semantic checking at the time
 * the selector is presented. Not all semantic checking can be performed at
 * the time a message selector is presented, because property types are not known.
 * 
 * <H4>Null Values</H4>
 *
 * As noted above, property values may be NULL. The evaluation 
 * of selector expressions containing NULL values is defined by 
 * SQL92 NULL semantics. A brief description of these semantics 
 * is provided here.
 *
 * SQL treats a NULL value as unknown. Comparison or arithmetic
 * with an unknown value always yields an unknown value.
 *
 * The IS NULL and IS NOT NULL operators convert 
 * an unknown value into the respective TRUE and 
 * FALSE values.
 *
 * The boolean operators use three-valued logic as defined by the 
 * following tables:
 *
 * _The definition of the AND operator_
 *
 * <pre><code>
 * | AND  |   T   |   F   |   U
 * +------+-------+-------+-------
 * |  T   |   T   |   F   |   U
 * |  F   |   F   |   F   |   F
 * |  U   |   U   |   F   |   U
 * +------+-------+-------+-------
 * </code></pre>
 *
 * _The definition of the OR operator_
 *
 * <pre><code>
 * | OR   |   T   |   F   |   U
 * +------+-------+-------+--------
 * |  T   |   T   |   T   |   T
 * |  F   |   T   |   F   |   U
 * |  U   |   T   |   U   |   U
 * +------+-------+-------+------- 
 * </code></pre>
 *
 * _The definition of the NOT operator_
 *
 * <pre><code>
 * | NOT
 * +------+------
 * |  T   |   F
 * |  F   |   T
 * |  U   |   U
 * +------+-------
 * </code></pre>
 *
 * <H4>Special Notes</H4>
 *
 * When used in a message selector, the JMSDeliveryMode header 
 *    field is treated as having the values 'PERSISTENT' and 
 *    'NON_PERSISTENT'.
 *
 * Date and time values should use the standard long 
 *    millisecond value. When a date or time literal is included in a message 
 *    selector, it should be an integer literal for a millisecond value.
 *
 * Although SQL supports fixed decimal comparison and arithmetic, JMS 
 *    message selectors do not. This is the reason for restricting exact 
 *    numeric literals to those without a decimal (and the addition of 
 *    numerics with a decimal as an alternate representation for 
 *    approximate numeric values).
 *
 * SQL comments are not supported.
 *
 * <H2>Message Constants</H2>
 *
 * _KMMessageDefaultDeliveryMode_
 *
 * Default Delivery Mode (PERSISTENT)
 *
 * _KMMessageDefaultPriority_
 *
 * Default Message Priority (4)
 *
 * _KMMessageDefaultTimeToLive_
 *
 * Default Time To Live (never expires)
 *
 * @see [KMMessageConsumer receive]
 * @see [KMMessageConsumer receiveNoWait]
 * @see [KMMessageListener onMessage:]
 * @see KMTextMessage
 * @see KMBytesMessage
 * @see KMMapMessage
 */
@interface KMMessage : KCObject

/**
 * Gets the message ID.
 *
 * The JMSMessageID header field contains a value that 
 * uniquely identifies each message sent by a provider.
 *  
 * When a message is sent, JMSMessageID can be ignored. 
 * When the send or publish method returns, it 
 * contains a provider-assigned value.
 *
 * A JMSMessageID is a String value that 
 * should function as a 
 * unique key for identifying messages in a historical repository. 
 * The exact scope of uniqueness is provider-defined. It should at 
 * least cover all messages for a specific installation of a 
 * provider, where an installation is some connected set of message 
 * routers.
 *
 * All JMSMessageID values must start with the prefix 'ID:'.
 * Uniqueness of message ID values across different providers is 
 * not required.
 *
 * Since message IDs take some effort to create and increase a
 * message's size, some JMS providers may be able to optimize message
 * overhead if they are given a hint that the message ID is not used by
 * an application. By calling the 
 * MessageProducer.setDisableMessageID method, a JMS client 
 * enables this potential optimization for all messages sent by that 
 * message producer. If the JMS provider accepts this
 * hint, these messages must have the message ID set to null; if the 
 * provider ignores the hint, the message ID must be set to its normal 
 * unique value.
 *
 * @exception KMJMSException if the JMS provider fails to get the message ID 
 *                         due to some internal error.
 * @see setJMSMessageID:
 * @see [KMMessageProducer disableMessageID]
 */
- (NSString*) JMSMessageID;

/**
 * Sets the message ID.
 *  
 * JMS providers set this field when a message is sent. This method
 * can be used to change the value for a message that has been received.
 *
 * @param messageID the ID of the message
 *
 * @exception KMJMSException if the JMS provider fails to set the message ID 
 *                         due to some internal error.
 *
 * @see JMSMessageID
 */ 
- (void) setJMSMessageID:(NSString*)messageID;

/**
 * Sets the message timestamp.
 *  
 * JMS providers set this field when a message is sent. This method
 * can be used to change the value for a message that has been received.
 *
 * @param timestamp the timestamp for this message
 *  
 * @exception KMJMSException if the JMS provider fails to set the timestamp
 *                         due to some internal error.
 *
 * @see JMSTimestamp
 */ 
- (void) setJMSTimestamp:(long long)timestamp;

/**
 * Gets the message timestamp.
 *  
 * The JMSTimestamp header field contains the time a 
 * message was 
 * handed off to a provider to be sent. It is not the time the 
 * message was actually transmitted, because the actual send may occur 
 * later due to transactions or other client-side queueing of messages.
 *
 * When a message is sent, JMSTimestamp is ignored. When 
 * the send or publish
 * method returns, it contains a time value somewhere in the interval 
 * between the call and the return. The value is in the format of a normal 
 * millis time value.
 *
 * Since timestamps take some effort to create and increase a 
 * message's size, some JMS providers may be able to optimize message 
 * overhead if they are given a hint that the timestamp is not used by an 
 * application. By calling the
 * MessageProducer.setDisableMessageTimestamp method, a JMS 
 * client enables this potential optimization for all messages sent by 
 * that message producer. If the JMS provider accepts this
 * hint, these messages must have the timestamp set to zero; if the 
 * provider ignores the hint, the timestamp must be set to its normal 
 * value.
 *
 * @return the message timestamp
 *
 * @exception KMJMSException if the JMS provider fails to get the timestamp
 *                         due to some internal error.
 *
 * @see setJMSTimestamp:
 * @see [KMMessageProducer disableMessageTimestamp]
 */ 
- (long long) JMSTimestamp;

/**
 * Gets the correlation ID as an array of bytes for the message.
 *  
 * The use of a byte[] value for 
 * JMSCorrelationID is non-portable.
 *
 * @return the correlation ID of a message as an array of bytes
 *
 * @exception KMJMSException if the JMS provider fails to get the correlation
 *                         ID due to some internal error.
 *  
 * @see setJMSCorrelationID:
 * @see JMSCorrelationID
 * @see setJMSCorrelationIDAsBytes:
 */ 
- (NSData*) JMSCorrelationIDAsBytes;

/**
 * Sets the correlation ID as an array of bytes for the message.
 * 
 * The array is copied before the method returns, so
 * future modifications to the array will not alter this message header.
 *  
 * If a provider supports the native concept of correlation ID, a 
 * JMS client may need to assign specific JMSCorrelationID 
 * values to match those expected by native messaging clients. 
 * JMS providers without native correlation ID values are not required to 
 * support this method and its corresponding get method;
 *
 * The use of a byte[] value for JMSCorrelationID is non-portable.
 *
 * @param correlationID the correlation ID value as an array of bytes
 *  
 * @exception KMJMSException if the JMS provider fails to set the correlation
 *                         ID due to some internal error.
 *  
 * @see JMSCorrelationID
 * @see setJMSCorrelationID:
 * @see JMSCorrelationIDAsBytes
 */
- (void) setJMSCorrelationIDAsBytes:(NSData*)correlationID;

/**
 * Sets the correlation ID for the message.
 *  
 * A client can use the JMSCorrelationID header field to 
 * link one message with another. A typical use is to link a response 
 * message with its request message.
 *  
 * JMSCorrelationID can hold one of the following:
 *
 *      - A provider-specific message ID
 *      - An application-specific String
 *      - A provider-native byte[] value
 *  
 * Since each message sent by a JMS provider is assigned a message ID
 * value, it is convenient to link messages via message ID. All message ID
 * values must start with the 'ID:' prefix.
 *  
 * In some cases, an application (made up of several clients) needs to
 * use an application-specific value for linking messages. For instance,
 * an application may use JMSCorrelationID to hold a value 
 * referencing some external information. Application-specified values 
 * must not start with the 'ID:' prefix; this is reserved for 
 * provider-generated message ID values.
 *  
 * If a provider supports the native concept of correlation ID, a JMS
 * client may need to assign specific JMSCorrelationID values 
 * to match those expected by clients that do not use the JMS API. A 
 * byte[] value is used for this
 * purpose. JMS providers without native correlation ID values are not
 * required to support byte[] values. The use of a 
 * byte[] value for JMSCorrelationID is 
 * non-portable.
 *  
 * @param correlationID the message ID of a message being referred to
 *  
 * @exception KMJMSException if the JMS provider fails to set the correlation
 *                         ID due to some internal error.
 *  
 * @see JMSCorrelationID()
 * @see JMSCorrelationIDAsBytes
 * @see setJMSCorrelationIDAsBytes:
 */ 
- (void) setJMSCorrelationID:(NSString*)correlationID;

/**
 * Gets the correlation ID for the message.
 *  
 * This method is used to return correlation ID values that are 
 * either provider-specific message IDs or application-specific 
 * String values.
 *
 * @return the correlation ID of a message as a String
 *
 * @exception KMJMSException if the JMS provider fails to get the correlation
 *                         ID due to some internal error.
 *
 * @see setJMSCorrelationID:
 * @see JMSCorrelationIDAsBytes
 */ 
- (NSString*) JMSCorrelationID;

/**
 * Gets the Destination object to which a reply to this 
 * message should be sent.
 *  
 * @return Destination to which to send a response to this 
 *         message
 *
 * @exception KMJMSException if the JMS provider fails to get the  
 *                         JMSReplyTo destination due to some 
 *                         internal error.
 *
 * @see setJMSReplyTo:
 */ 
- (KMDestination *) JMSReplyTo;

/**
 * Sets the Destination object to which a reply to this 
 * message should be sent.
 *  
 * The JMSReplyTo header field contains the destination 
 * where a reply 
 * to the current message should be sent. If it is null, no reply is 
 * expected. The destination may be either a Queue object or
 * a Topic object.
 *
 * Messages sent with a null JMSReplyTo value may be a 
 * notification of some event, or they may just be some data the sender 
 * thinks is of interest.
 *
 * Messages with a JMSReplyTo value typically expect a 
 * response. A response is optional; it is up to the client to decide.  
 * These messages are called requests. A message sent in response to a 
 * request is called a reply.
 *
 * In some cases a client may wish to match a request it sent earlier 
 * with a reply it has just received. The client can use the 
 * JMSCorrelationID header field for this purpose.
 *
 * @param replyTo Destination to which to send a response to 
 *                this message
 *
 * @exception KMJMSException if the JMS provider fails to set the  
 *                         JMSReplyTo destination due to some 
 *                         internal error.
 *
 * @see JMSReplyTo
 */ 
- (void) setJMSReplyTo:(KMDestination *)replyTo;

/**
 * Gets the Destination object for this message.
 *  
 * The JMSDestination header field contains the 
 * destination to which the message is being sent.
 *  
 * When a message is sent, this field is ignored. After completion
 * of the send or publish method, the field 
 * holds the destination specified by the method.
 *  
 * When a message is received, its JMSDestination value 
 * must be equivalent to the value assigned when it was sent.
 *
 * @return the destination of this message
 *  
 * @exception KMJMSException if the JMS provider fails to get the destination
 *                         due to some internal error.
 *  
 * @see setJMSDestination:
 */ 
- (KMDestination *) JMSDestination;

/**
 * Sets the Destination object for this message.
 *  
 * JMS providers set this field when a message is sent. This method 
 * can be used to change the value for a message that has been received.
 *
 * @param destination the destination for this message
 *  
 * @exception KMJMSException if the JMS provider fails to set the destination
 *                         due to some internal error.
 *  
 * @see JMSDestination
 */ 
- (void) setJMSDestination:(KMDestination *)destination;

/**
 * Gets the DeliveryMode value specified for this message.
 *  
 * @return the delivery mode for this message
 *  
 * @exception KMJMSException if the JMS provider fails to get the 
 *                         delivery mode due to some internal error.
 *  
 * @see setJMSDeliveryMode:
 * @see KMDeliveryMode
 */ 
- (int) JMSDeliveryMode;

/**
 * Sets the DeliveryMode value for this message.
 *  
 * JMS providers set this field when a message is sent. This method 
 * can be used to change the value for a message that has been received.
 *
 * @param deliveryMode the delivery mode for this message
 *  
 * @exception KMJMSException if the JMS provider fails to set the 
 *                         delivery mode due to some internal error.
 *  
 * @see JMSDeliveryMode
 * @see KMDeliveryMode
 */ 
- (void) setJMSDeliveryMode:(int)deliveryMode;

/**
 * Gets an indication of whether this message is being redelivered.
 *
 * If a client receives a message with the JMSRedelivered 
 * field set,
 * it is likely, but not guaranteed, that this message was delivered
 * earlier but that its receipt was not acknowledged
 * at that time.
 *
 * @return true if this message is being redelivered
 *  
 * @exception KMJMSException if the JMS provider fails to get the redelivered
 *                         state due to some internal error.
 *
 * @see setJMSRedelivered:
 */ 
- (BOOL) JMSRedelivered;

/**
 * Specifies whether this message is being redelivered.
 *  
 * This field is set at the time the message is delivered. This
 * method can be used to change the value for a message that has
 * been received.
 *
 * @param redelivered an indication of whether this message is being
 * redelivered
 *  
 * @exception KMJMSException if the JMS provider fails to set the redelivered
 *                         state due to some internal error.
 *
 * @see JMSRedelivered
 */ 
- (void) setJMSRedelivered:(BOOL)redelivered;

/**
 * Gets the message type identifier supplied by the client when the
 * message was sent.
 *
 * @return the message type
 *  
 * @exception KMJMSException if the JMS provider fails to get the message 
 *                         type due to some internal error.
 *
 * @see setJMSType:
 */ 
- (NSString*) JMSType;

/**
 * Sets the message type.
 *
 * Some JMS providers use a message repository that contains the 
 * definitions of messages sent by applications. The JMSType 
 * header field may reference a message's definition in the provider's
 * repository.
 *
 * The JMS API does not define a standard message definition repository,
 * nor does it define a naming policy for the definitions it contains. 
 *
 * Some messaging systems require that a message type definition for 
 * each application message be created and that each message specify its 
 * type. In order to work with such JMS providers, JMS clients should 
 * assign a value to JMSType, whether the application makes 
 * use of it or not. This ensures that the field is properly set for those 
 * providers that require it.
 *
 * To ensure portability, JMS clients should use symbolic values for 
 * JMSType that can be configured at installation time to the 
 * values defined in the current provider's message repository. If string 
 * literals are used, they may not be valid type names for some JMS 
 * providers.
 *
 * @param type the message type
 *  
 * @exception KMJMSException if the JMS provider fails to set the message 
 *                         type due to some internal error.
 *
 * @see JMSType
 */ 
- (void) setJMSType:(NSString*)type;

/**
 * Gets the message's expiration value.
 *  
 * When a message is sent, the JMSExpiration header field 
 * is left unassigned. After completion of the send or 
 * publish method, it holds the expiration time of the
 * message. This is the sum of the time-to-live value specified by the
 * client and the GMT at the time of the send or 
 * publish.
 *
 * If the time-to-live is specified as zero, JMSExpiration 
 * is set to zero to indicate that the message does not expire.
 *
 * When a message's expiration time is reached, a provider should
 * discard it. The JMS API does not define any form of notification of 
 * message expiration.
 *
 * Clients should not receive messages that have expired; however,
 * the JMS API does not guarantee that this will not happen.
 *
 * @return the time the message expires, which is the sum of the
 * time-to-live value specified by the client and the GMT at the
 * time of the send
 *  
 * @exception KMJMSException if the JMS provider fails to get the message 
 *                         expiration due to some internal error.
 *
 * @see setJMSExpiration:
 */ 
- (long long) JMSExpiration;

/**
 * Sets the message's expiration value.
 *
 * JMS providers set this field when a message is sent. This method 
 * can be used to change the value for a message that has been received.
 *  
 * @param expiration the message's expiration time
 *  
 * @exception KMJMSException if the JMS provider fails to set the message 
 *                         expiration due to some internal error.
 *
 * @see JMSExpiration
 */ 
- (void) setJMSExpiration:(long long)expiration;

/**
 * Gets the message priority level.
 *  
 * The JMS API defines ten levels of priority value, with 0 as the 
 * lowest
 * priority and 9 as the highest. In addition, clients should consider
 * priorities 0-4 as gradations of normal priority and priorities 5-9
 * as gradations of expedited priority.
 *  
 * The JMS API does not require that a provider strictly implement 
 * priority 
 * ordering of messages; however, it should do its best to deliver 
 * expedited messages ahead of normal messages.
 *  
 * @return the default message priority
 *  
 * @exception KMJMSException if the JMS provider fails to get the message 
 *                         priority due to some internal error.
 *
 * @see setJMSPriority:
 */ 
- (int) JMSPriority;

/**
 * Sets the priority level for this message.
 *  
 * JMS providers set this field when a message is sent. This method 
 * can be used to change the value for a message that has been received.
 *
 * @param priority the priority of this message
 *  
 * @exception KMJMSException if the JMS provider fails to set the message 
 *                         priority due to some internal error.
 *
 * @see JMSPriority
 */ 
- (void) setJMSPriority:(int)priority;

/**
 * Clears a message's properties.
 *
 * The message's header fields and body are not cleared.
 *
 * @exception KMJMSException if the JMS provider fails to clear the message 
 *                         properties due to some internal error.
 */ 
- (void) clearProperties;

/**
 * Indicates whether a property value exists.
 *
 * @param name the name of the property to test
 *
 * @return true if the property exists
 *  
 * @exception KMJMSException if the JMS provider fails to determine if the 
 *                         property exists due to some internal error.
 */ 
- (BOOL) propertyExists:(NSString*)name;

/**
 * Returns the value of the boolean property with the  
 * specified name.
 *  
 * @param name the name of the boolean property
 *  
 * @return the boolean property value for the specified name
 *  
 * @exception KMJMSException if the JMS provider fails to get the property
 *                         value due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid. 
 */ 
- (BOOL) getBooleanProperty:(NSString*)name;

/**
 * Returns the value of the byte property with the specified 
 * name.
 *  
 * @param name the name of the byte property
 *  
 * @return the byte property value for the specified name
 *  
 * @exception KMJMSException if the JMS provider fails to get the property
 *                         value due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid. 
 */ 
- (Byte) getByteProperty:(NSString*)name;

/**
 * Returns the value of the short property with the specified 
 * name.
 *
 * @param name the name of the short property
 *
 * @return the short property value for the specified name
 *
 * @exception KMJMSException if the JMS provider fails to get the property
 *                         value due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid.
 */ 
- (short) getShortProperty:(NSString*)name;

/**
 * Returns the value of the int property with the specified 
 * name.
 *  
 * @param name the name of the int property
 *  
 * @return the int property value for the specified name
 *  
 * @exception KMJMSException if the JMS provider fails to get the property
 *                         value due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid.
 */ 
- (int) getIntProperty:(NSString*)name;

/**
 * Returns the value of the long property with the specified 
 * name.
 *  
 * @param name the name of the long property
 *  
 * @return the long property value for the specified name
 *  
 * @exception KMJMSException if the JMS provider fails to get the property
 *                         value due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid.
 */ 
- (long long) getLongProperty:(NSString*)name;

/**
 * Returns the value of the float property with the specified 
 * name.
 *  
 * @param name the name of the float property
 *  
 * @return the float property value for the specified name
 *  
 * @exception KMJMSException if the JMS provider fails to get the property
 *                         value due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid.
 */ 
- (float) getFloatProperty:(NSString*)name;

/**
 * Returns the value of the double property with the specified
 * name.
 *  
 * @param name the name of the double property
 *  
 * @return the double property value for the specified name
 *  
 * @exception KMJMSException if the JMS provider fails to get the property
 *                         value due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid.
 */ 
- (double) getDoubleProperty:(NSString*)name;

/**
 * Returns the value of the String property with the specified
 * name.
 *  
 * @param name the name of the String property
 *  
 * @return the String property value for the specified name;
 * if there is no property by this name, a null value is returned
 *  
 * @exception KMJMSException if the JMS provider fails to get the property
 *                         value due to some internal error.
 * @exception KMMessageFormatException if this type conversion is invalid.
 */ 
- (NSString*) getStringProperty:(NSString*)name;

/**
 * Returns the value of the object property with the specified name.
 *  
 * This method can be used to return, in objectified format,
 * an object that has been stored as a property in the message with the 
 * equivalent SetObjectProperty method call, or its equivalent
 * primitive Set<I>type</I>Property method.
 *  
 * @param name the name of the object property
 *  
 * @return the object property value with the specified name, in 
 * objectified format (for example, if the property was set as an 
 * int, an Integer is 
 * returned); if there is no property by this name, a null value 
 * is returned
 *  
 * @exception KMJMSException if the JMS provider fails to get the property
 *                         value due to some internal error.
 */ 
- (NSObject*) getObjectProperty:(NSString*)name;

/**
 * Returns an Enumeration of all the property names.
 *
 * Note that JMS standard header fields are not considered
 * properties and are not returned in this enumeration.
 *  
 * @return an enumeration of all the names of property values
 *  
 * @exception KMJMSException if the JMS provider fails to get the property
 *                          names due to some internal error.
 */ 
- (NSEnumerator*) propertyNames;

/**
 * Sets a boolean property value with the specified name into 
 * the message.
 *
 * @param name the name of the boolean property
 * @param value the boolean property value to set
 *  
 * @exception KMJMSException if the JMS provider fails to set the property
 *                          due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if properties are read-only
 */ 
- (void) setBooleanProperty:(NSString*)name value:(BOOL)value;

/**
 * Sets a byte property value with the specified name into 
 * the message.
 *  
 * @param name the name of the byte property
 * @param value the byte property value to set
 *  
 * @exception KMJMSException if the JMS provider fails to set the property
 *                          due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if properties are read-only
 */ 
- (void) setByteProperty:(NSString*)name value:(Byte)value;

/**
 * Sets a short property value with the specified name into
 * the message.
 *  
 * @param name the name of the short property
 * @param value the short property value to set
 *  
 * @exception KMJMSException if the JMS provider fails to set the property
 *                          due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if properties are read-only
 */ 
- (void) setShortProperty:(NSString*)name value:(short)value;

/**
 * Sets an int property value with the specified name into
 * the message.
 *  
 * @param name the name of the int property
 * @param value the int property value to set
 *  
 * @exception KMJMSException if the JMS provider fails to set the property
 *                          due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if properties are read-only
 */ 
- (void) setIntProperty:(NSString*)name value:(int)value;

/**
 * Sets a long property value with the specified name into 
 * the message.
 *  
 * @param name the name of the long property
 * @param value the long property value to set
 *  
 * @exception KMJMSException if the JMS provider fails to set the property
 *                          due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if properties are read-only
 */ 
- (void) setLongProperty:(NSString*)name value:(long long)value;

/**
 * Sets a float property value with the specified name into 
 * the message.
 *  
 * @param name the name of the float property
 * @param value the float property value to set
 *  
 * @exception KMJMSException if the JMS provider fails to set the property
 *                          due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if properties are read-only
 */ 
- (void) setFloatProperty:(NSString*)name value:(float)value;

/**
 * Sets a double property value with the specified name into 
 * the message.
 *  
 * @param name the name of the double property
 * @param value the double property value to set
 *  
 * @exception KMJMSException if the JMS provider fails to set the property
 *                          due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if properties are read-only
 */ 
- (void) setDoubleProperty:(NSString*)name value:(double)value;

/**
 * Sets a String property value with the specified name into 
 * the message.
 *
 * @param name the name of the String property
 * @param value the String property value to set
 *  
 * @exception KMJMSException if the JMS provider fails to set the property
 *                          due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageNotWriteableException if properties are read-only
 */ 
- (void) setStringProperty:(NSString*)name value:(NSString*)value;

/**
 * Sets a object property value with the specified name into the 
 * message.
 *  
 * Note that this method works only for the objectified primitive
 * object types (Integer, Double, 
 * Long ...) and String objects.
 *  
 * @param name the name of the object property
 * @param value the object property value to set
 *  
 * @exception KMJMSException if the JMS provider fails to set the property
 *                          due to some internal error.
 * @exception NSException if the name is null or if the name is
 *                          an empty string.
 * @exception KMMessageFormatException if the object is invalid
 * @exception KMMessageNotWriteableException if properties are read-only
 */ 
- (void) setObjectProperty:(NSString*)name value:(NSObject*)value;

/**
 * Acknowledges all consumed messages of the session of this consumed 
 * message.
 *  
 * All consumed JMS messages support the acknowledge 
 * method for use when a client has specified that its JMS session's 
 * consumed messages are to be explicitly acknowledged, for example,
 * when [KMSession acknowledgeMode] is set to _KMSessionClientAcknowledge_.
 * By invoking acknowledge on a consumed message, a client acknowledges 
 * all messages consumed by the session that the message was delivered to.
 * 
 * Calls to acknowledge are ignored for both transacted 
 * sessions and sessions specified to use implicit acknowledgement modes.
 *
 * A client may individually acknowledge each message as it is consumed,
 * or it may choose to acknowledge messages as an application-defined group 
 * (which is done by calling acknowledge on the last received message of the group,
 *  thereby acknowledging all messages consumed by the session.)
 *
 * Messages that have been received but not acknowledged may be 
 * redelivered.
 *
 * @exception KMJMSException if the JMS provider fails to acknowledge the
 *                         messages due to some internal error.
 * @exception KMIllegalStateException if this method is called on a closed
 *                         session.
 *
 * @see [KMConnection createSession:transacted:]
 * @see KMSession
 */ 
- (void) acknowledge;

/**
 * Clears out the message body. Clearing a message's body does not clear 
 * its header values or property entries.
 *
 * If this message body was read-only, calling this method leaves
 * the message body in the same state as an empty body in a newly
 * created message.
 *
 * @exception KMJMSException if the JMS provider fails to clear the message
 *                         body due to some internal error.
 */ 
- (void) clearBody;

@end
