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

import com.ibm.mfp.security.checks.base.UserAuthenticationSecurityCheck;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;
import com.ibm.mfp.server.security.external.checks.AuthorizationResponse;
import com.ibm.mfp.server.security.external.checks.SecurityCheckConfiguration;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

/**
 * Security check that accepts user identity created by external login vendors - Google, Facebook etc.
 *
 * @author artem on 3/3/16.
 */
public class SocialLoginSecurityCheck extends UserAuthenticationSecurityCheck {

    public static final String VENDOR_KEY = "vendor";
    public static final String TOKEN_KEY = "token";

    private transient String vendorName;
    private transient AuthenticatedUser user;

    @Override
    public SecurityCheckConfiguration createConfiguration(Properties properties) {
        return new SocialLoginConfiguration(properties);
    }

    @Override
    public void authorize(Set<String> scope, Map<String, Object> credentials, HttpServletRequest request, AuthorizationResponse response) {
        super.authorize(scope, credentials, request, response);
        Map<String, Object> failure = new HashMap<String, Object>();
        failure.put(vendorName, "invalid token");
        if (response.getType() == AuthorizationResponse.ResponseType.FAILURE)
            response.addFailure(getName(), failure);
    }

    @Override
    protected Map<String, Object> createChallenge() {
        Map<String, Object> res = new HashMap<String, Object>();
        res.put("vendorList", getConfig().getEnabledVendors().keySet().toArray());
        return res;
    }

    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
        vendorName = (String) credentials.get(VENDOR_KEY);
        String token = (String) credentials.get(TOKEN_KEY);
        if (vendorName != null && token != null) {
            LoginVendor vendor = getConfig().getEnabledVendors().get(vendorName);
            if (vendor != null) {
                user = vendor.validateTokenAndCreateUser(token, getName());
                return user != null;
            }
        }
        return false;
    }

    @Override
    protected AuthenticatedUser createUser() {
        return user;
    }

    @Override
    protected SocialLoginConfiguration getConfig() {
        return (SocialLoginConfiguration) super.getConfig();
    }
}
