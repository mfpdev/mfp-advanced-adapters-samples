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
package com.github.mfpdev.sample.googleOTP;

import com.ibm.mfp.security.checks.base.UserAuthenticationSecurityCheck;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;

import java.util.HashMap;
import java.util.Map;

/**
 * The user login security check
 *
 * @author Ishai Borovoy
 * @since 06/03/206
 */
public class UserLoginSecurityCheck extends UserAuthenticationSecurityCheck {

    protected final static String USER_KEY = "user";
    protected final static String PASSWORD_KEY = "password";
    private final static String CHALLENGE = "challenge";

    private String userName;

    /**
     * Create an authenticated user
     *
     * @return the authenticated suer
     */
    @Override
    protected AuthenticatedUser createUser() {
        return new AuthenticatedUser(userName, userName, getName());
    }

    /**
     * Validate username and password
     *
     * @param credentials Map containing the user name and password
     * @return true when user is equal to password
     */
    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
        String username = (String) credentials.get(USER_KEY);
        String pwd = (String) credentials.get(PASSWORD_KEY);
        if (username != null && username.equals(pwd)) {
            this.userName = username;
            return true;
        }
        return false;
    }

    /**
     * @return Map containing the challenge
     */
    @Override
    protected Map<String, Object> createChallenge() {
        return new HashMap<String, Object>() {{
            put(CHALLENGE, "USER-LOGIN-CHALLENGE");
        }};
    }
}
