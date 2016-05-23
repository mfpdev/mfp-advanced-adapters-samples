/**
 *    © Copyright 2016 IBM Corp.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package com.github.mfpdev.sample.socialogin;

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
    public static final String VENDOR_ATTRIBUTE = "socialLoginVendor";
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
            if (vendorName != null) {
                failure.put(vendorName, "invalid token");
            } else {
                failure.put("invalid_vendor_name", "vendor name cannot be null");
            }
            response.addFailure(getName(), failure);
        }
    }

    @Override
    protected Map<String, Object> createChallenge() {
        Map<String, Object> res = new HashMap<>();
        res.put("vendorList", getConfiguration().getEnabledVendors().keySet().toArray());
        return res;
    }

    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
        vendorName = (String) credentials.get(VENDOR_KEY);
        String token = (String) credentials.get(TOKEN_KEY);
        if (vendorName != null && token != null) {
            LoginVendor vendor = getConfiguration().getEnabledVendors().get(vendorName);
            if (vendor != null) {
                AuthenticatedUser user = vendor.validateTokenAndCreateUser(token, getName());
                if (user != null) {
                    Map<String, Object> attributes = new HashMap<>(user.getAttributes());
                    attributes.put(VENDOR_ATTRIBUTE, vendorName);
                    if (getConfiguration().isKeepOriginalToken())
                        attributes.put(ORIGINAL_TOKEN_ATTRIBUTE, token);
                    this.user = new AuthenticatedUser(user.getId(), user.getDisplayName(), getName(), attributes);
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
    protected SocialLoginConfiguration getConfiguration() {
        return (SocialLoginConfiguration) super.getConfiguration();
    }
}
