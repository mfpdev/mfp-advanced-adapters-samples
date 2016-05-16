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

package com.github.mfpdev.sample.stepup;

import com.ibm.mfp.security.checks.base.UserAuthenticationSecurityCheck;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;

import java.util.Map;

/**
 * Compares the username to the password and succeeds if they are equal.
 *
 * @author artem on 3/31/16.
 */
public class UserLoginSecurityCheck extends UserAuthenticationSecurityCheck {

    private transient String username;

    protected Map<String, Object> createChallenge() {
        return null;
    }

    protected boolean validateCredentials(Map<String, Object> credentials) {
        username = (String) credentials.get("username");
        String password = (String) credentials.get("password");

        return username != null && username.equals(password);
    }

    protected AuthenticatedUser createUser() {
        return new AuthenticatedUser(username, username, getName());
    }

    boolean isAuthenticated() {
        return getState().equals(STATE_SUCCESS);
    }

    boolean isExpired() {
        return getState().equals(STATE_EXPIRED);
    }

    public AuthenticatedUser getRegisteredUser() {
        return registrationContext.getRegisteredUser();
    }
}
