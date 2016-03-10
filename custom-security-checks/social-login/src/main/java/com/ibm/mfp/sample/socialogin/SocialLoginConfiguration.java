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
 * Creates and initializes the supported vendors.<br/>
 * The configuration properties of the security check are delivered to the vendors according to
 * their {@link LoginVendor#getConfigurationPropertyNames()} values.
 *
 * @author artem on 3/3/16.
 */
public class SocialLoginConfiguration extends UserAuthenticationSecurityCheckConfig {

    public static final String KEEP_ORIGINAL_TOKEN = "keepOriginalToken";

    private boolean keepOriginalToken;
    private Map<String, LoginVendor> vendors;

    /**
     * Create the vendors each with its relevant properties
     *
     * @param properties security check configuration includes the properties of all vendors
     */
    public SocialLoginConfiguration(Properties properties) {
        super(properties);
        blockedStateExpirationSec = 1;
        keepOriginalToken = Boolean.parseBoolean(getStringProperty(KEEP_ORIGINAL_TOKEN, properties, "false"));

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

    /**
     * Get only the vendors that are enabled according to their configurations
     *
     * @return map with vendor name as a key and the vendor as a value
     */
    public Map<String, LoginVendor> getEnabledVendors() {
        Map<String, LoginVendor> res = new HashMap<>();
        for (Map.Entry<String, LoginVendor> entry : vendors.entrySet()) {
            if (entry.getValue().isEnabled())
                res.put(entry.getKey(), entry.getValue());
        }
        return res;
    }

    public boolean isKeepOriginalToken() {
        return keepOriginalToken;
    }

    private void createVendors() {
        vendors = new HashMap<>();
        vendors.put("google", new GoogleSupport());
        vendors.put("facebook", new FacebookSupport());
    }
}
