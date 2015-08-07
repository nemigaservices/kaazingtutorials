/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KCObject.h"

/**
 * A ConnectionMetaData object provides information describing the 
 * Connection object.
 *
 */
@interface KMConnectionMetaData : KCObject

/**
 * Gets the JMS API version.
 *
 * @return the JMS API version
 *  
 * @exception KMJMSException if the JMS provider fails to retrieve the
 *                         metadata due to some internal error.
 */
- (NSString*) JMSVersion;

/**
 * Gets the JMS major version number.
 *  
 * @return the JMS API major version number
 *  
 * @exception KMJMSException if the JMS provider fails to retrieve the
 *                         metadata due to some internal error.
 */
- (int) JMSMajorVersion;

/**
 * Gets the JMS minor version number.
 *  
 * @return the JMS API minor version number
 *  
 * @exception KMJMSException if the JMS provider fails to retrieve the
 *                         metadata due to some internal error.
 */
- (int) JMSMinorVersion;

/**
 * Gets the JMS provider name.
 *
 * @return the JMS provider name
 *  
 * @exception KMJMSException if the JMS provider fails to retrieve the
 *                         metadata due to some internal error.
 */
- (NSString*) JMSProviderName;

/**
 * Gets the JMS provider version.
 *
 * @return the JMS provider version
 *  
 * @exception KMJMSException if the JMS provider fails to retrieve the
 *                         metadata due to some internal error.
 */
- (NSString*) providerVersion;

/**
 * Gets the JMS provider major version number.
 *  
 * @return the JMS provider major version number
 *  
 * @exception KMJMSException if the JMS provider fails to retrieve the
 *                         metadata due to some internal error.
 */
- (int) providerMajorVersion;

/**
 * Gets the JMS provider minor version number.
 *  
 * @return the JMS provider minor version number
 *  
 * @exception KMJMSException if the JMS provider fails to retrieve the
 *                         metadata due to some internal error.
 */
- (int) providerMinorVersion;

/**
 * Gets an enumeration of the JMSX property names.
 *  
 * @return an Enumeration of JMSX property names
 *  
 * @exception KMJMSException if the JMS provider fails to retrieve the
 *                         metadata due to some internal error.
 */
- (NSEnumerator*) JMSXPropertyNames;

@end
