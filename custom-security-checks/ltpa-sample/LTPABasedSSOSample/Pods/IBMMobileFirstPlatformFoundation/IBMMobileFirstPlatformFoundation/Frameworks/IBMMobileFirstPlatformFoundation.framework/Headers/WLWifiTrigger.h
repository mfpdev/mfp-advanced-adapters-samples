/*
* Licensed Materials - Property of IBM
* 5725-I43 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

#define _WLWifiTrigger_H_
#import "AbstractTrigger.h"
@class WLWifiAcquisitionPolicy;

/**
 * An abstract base class for WiFi triggers.
 */
@interface WLWifiTrigger : AbstractTrigger {
}


- (id) init  ;

// TO DO:  originally this method had an unsupported @exclude tag
/**
	 * Checks if the trigger can ever be evaluated to true under a policy
	 * 
	 * @param policy The policy to check
	 * @return <code>true</code> if there is a WifiInternalLocation that could be matched by the policy and will be
	 *         evaluated to true when calling WifiTriggerEvaluator.evaluate(WifiInternalLocation).
	 */
- (BOOL) validate : (WLWifiAcquisitionPolicy*) policy ;

@end

