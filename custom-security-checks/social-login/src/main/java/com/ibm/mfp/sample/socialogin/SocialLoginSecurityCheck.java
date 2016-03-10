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
 * Security check that aggregates different login vendors - Google, Facebook, etc.
 * <p/>
 * The challenge sent by this check includes a list of available vendors, so that the client can choose which one to use.
 * Upon successful authentication the client sends the challenge response containing the chosen vendor name and the token.
 * The security checks delegates the token validation to the appropriate {@link LoginVendor#validateTokenAndCreateUser(String, String)}<br/>
 * If the validation succeeds the return value is set as the authenticated user.
 * If the validation fails, a failure response containing the vendor name is sent to the client.
 *
 * @author artem on 3/3/16.
 */
public class SocialLoginSecurityCheck extends UserAuthenticationSecurityCheck {

    public static final String VENDOR_KEY = "vendor";
    public static final String TOKEN_KEY = "token";
    public static final String ORIGINAL_TOKEN_ATTRIBUTE = "originalToken";

    private transient String vendorName;
    private transient AuthenticatedUser user;

    @Override
    public SecurityCheckConfiguration createConfiguration(Properties properties) {
        return new SocialLoginConfiguration(properties);
    }

    @Override
    public void authorize(Set<String> scope, Map<String, Object> credentials, HttpServletRequest request, AuthorizationResponse response) {
        super.authorize(scope, credentials, request, response);
        if (response.getType() == AuthorizationResponse.ResponseType.FAILURE) {
            Map<String, Object> failure = new HashMap<>();
            failure.put(vendorName, "invalid token");
            response.addFailure(getName(), failure);
        }
    }

    @Override
    protected Map<String, Object> createChallenge() {
        Map<String, Object> res = new HashMap<>();
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
                if (user != null) {
                    if (getConfig().isKeepOriginalToken()) user.getAttributes().put(ORIGINAL_TOKEN_ATTRIBUTE, token);
                    return true;
                }
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
