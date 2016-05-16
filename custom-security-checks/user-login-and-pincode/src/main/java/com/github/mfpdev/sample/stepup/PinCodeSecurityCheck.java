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
import com.ibm.mfp.server.security.external.checks.AuthorizationResponse;
import com.ibm.mfp.server.security.external.checks.SecurityCheckReference;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * If the pin code is already registered - compare it to one submitted by the user<br/>
 * If the pin code is not registered - make sure the user is logged in, and prompt him to set the pin code.
 *
 * @author artem on 4/4/16.
 */
public class PinCodeSecurityCheck extends UserAuthenticationSecurityCheck {

    private static final String PIN_CODE_ATTRIBUTE = "pin_code";
    private static final String ACTION_SET_PIN_CODE = "set_pin_code";
    private static final String ACTION_GET_PIN_CODE = "get_pin_code";
    private static final String ACTION_FIELD = "action";

    @SecurityCheckReference
    private transient UserLoginSecurityCheck userLogin;

    private transient String registeredPinCode;

    @Override
    public void authorize(Set<String> scope, Map<String, Object> credentials, HttpServletRequest request, AuthorizationResponse response) {
        // get the registered pin code
        registeredPinCode = registrationContext.getRegisteredProtectedAttributes().get(PIN_CODE_ATTRIBUTE);
        if (registeredPinCode == null) {
            // if pin code is not registered - register it
            registerPinCode(scope, credentials, request, response);
            return;
        }

        // check the credentials in a regular way
        super.authorize(scope, credentials, request, response);
    }

    protected Map<String, Object> createChallenge() {
        return createChallenge(ACTION_GET_PIN_CODE);
    }

    protected boolean validateCredentials(Map<String, Object> credentials) {
        return registeredPinCode.equals(credentials.get(ACTION_GET_PIN_CODE));
    }

    protected AuthenticatedUser createUser() {
        // set the user registered by login as active user
        return userLogin.getRegisteredUser();
    }

    private void registerPinCode(Set<String> scope, Map<String, Object> credentials, HttpServletRequest request, AuthorizationResponse response) {
        // before asking to set pin code make sure the user is logged in
        if (userLogin.isExpired())
            userLogin.authorize(scope, credentials, request, response);
        if (!userLogin.isAuthenticated())
            return;

        // set the submitted pin code or challenge for one
        String pinCode = credentials == null ? null : (String) credentials.get(ACTION_SET_PIN_CODE);
        if (pinCode == null) {
            // no pin code submitted, ask for one
            response.addChallenge(getName(), createChallenge(ACTION_SET_PIN_CODE));
        } else {
            // pin code submitted, register it, and report success
            registrationContext.getRegisteredProtectedAttributes().put(PIN_CODE_ATTRIBUTE, pinCode);
            setState(STATE_SUCCESS);
            response.addSuccess(scope, getExpiresAt(), getName());
        }
    }

    private Map<String, Object> createChallenge(String action) {
        Map<String, Object> challenge = new HashMap<String, Object>();
        challenge.put(ACTION_FIELD, action);
        return challenge;
    }
}
