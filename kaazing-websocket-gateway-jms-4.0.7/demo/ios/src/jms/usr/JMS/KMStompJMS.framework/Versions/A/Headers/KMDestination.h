/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

#import "KCObject.h"

/**
 * A KMDestination object encapsulates a provider-specific 
 * address.
 * The JMS API does not define a standard address syntax. Although a standard
 * address syntax was considered, it was decided that the differences in 
 * address semantics between existing message-oriented middleware (MOM) 
 * products were too wide to bridge with a single syntax. 
 *
 * Since KMDestination is an administered object, it may 
 * contain 
 * provider-specific configuration information in addition to its address.
 *
 * The JMS API also supports a client's use of provider-specific address 
 * names.
 *
 * KMDestination objects support concurrent use.
 *
 * A KMDestination object is a JMS administered object.
 *
 * JMS administered objects are objects containing configuration 
 * information that are created by an administrator and later used by 
 * JMS clients. They make it practical to administer the JMS API in the 
 * enterprise.
 *
 * @see KMQueue
 * @see KMTopic
 */
@interface KMDestination : KCObject
@end
