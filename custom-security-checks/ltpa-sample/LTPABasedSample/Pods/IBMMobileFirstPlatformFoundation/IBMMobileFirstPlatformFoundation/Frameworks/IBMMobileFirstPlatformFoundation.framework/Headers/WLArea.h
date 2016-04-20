/*
* Licensed Materials - Property of IBM
* 5725-I43 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

#define _WLArea_H_
#import <Foundation/Foundation.h>
@protocol AreaVisitor;

/**
 * This protocol provides the parent interface for geometric shapes.
 */
@protocol WLArea <NSObject> 

// TO DO:  originally this method had an unsupported @exclude tag
/**
 * @param visitor the visitor
 * @return the visitor's return value
 */
- (NSObject*) accept : (id<AreaVisitor>) visitor ;

@end

