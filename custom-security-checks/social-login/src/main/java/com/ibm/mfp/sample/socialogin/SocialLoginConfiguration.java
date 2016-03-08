/*
 * IBM Confidential OCO Source Materials
 *
 * 5725-I43 Copyright IBM Corp. 2006, 2016
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has
 * been deposited with the U.S. Copyright Office.
 */

package com.ibm.mfp.sample.socialogin;

import com.ibm.mfp.security.checks.base.UserAuthenticationSecurityCheckConfig;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * TODO: Document!
 *
 * @author artem on 3/3/16.
 */
public class SocialLoginConfiguration extends UserAuthenticationSecurityCheckConfig {

    private Map<String, LoginVendor> vendors;

    public SocialLoginConfiguration(Properties properties) {
        super(properties);
        blockedStateExpirationSec = 1;
        createVendors();

        for (LoginVendor vendor : vendors.values()) {
            Properties vendorConfig = new Properties();
            for (String property : vendor.getConfigurationPropertyNames()) {
                String value = getStringProperty(property, properties, null);
                vendorConfig.setProperty(property, value);
            }
            vendor.setConfiguration(vendorConfig);
        }

    }

    public Map<String, LoginVendor> getEnabledVendors() {
        Map<String, LoginVendor> res = new HashMap<String, LoginVendor>();
        for (Map.Entry<String, LoginVendor> entry : vendors.entrySet()) {
            if (entry.getValue().isEnabled())
            res.put(entry.getKey(), entry.getValue());
        }
        return res;
    }

    private void createVendors() {
        vendors = new HashMap<String, LoginVendor>();
        vendors.put("google", new GoogleSupport());
//        vendors.put("facebook", new FacebookSupport());
//        vendors.put("twitter", new TwitterSupport());
    }
}
