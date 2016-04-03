/*
 * IBM Confidential OCO Source Materials
 *
 * 5725-I43 Copyright IBM Corp. 2006, 2016
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has
 * been deposited with the U.S. Copyright Office.
 */

package com.ibm.mfp.sample.stepup;

import com.ibm.mfp.security.checks.base.CredentialsValidationSecurityCheck;
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
 * @author artem on 4/3/16.
 */
public class PinCodeSecurityCheck extends CredentialsValidationSecurityCheck {

    private static final String PIN_CODE_ATTRIBUTE = "pin_code";
    private static final String ACTION_SET_PIN_CODE = "set_pin_code";
    private static final String ACTION_GET_PIN_CODE = "get_pin_code";
    private static final String ACTION_FIELD = "action";

    @SecurityCheckReference
    private transient UserLoginSecurityCheck userLogin;

    private transient String registeredPinCode;
    private transient AuthenticatedUser registeredUser;

    @Override
    public void authorize(Set<String> scope, Map<String, Object> credentials, HttpServletRequest request, AuthorizationResponse response) {
        registeredPinCode = registrationContext.getRegisteredProtectedAttributes().get(PIN_CODE_ATTRIBUTE);

        if (registeredPinCode == null)
            // if the pin code is not registered - try to register it
            registerPinCode(scope, credentials, request, response);
        else {
            // if pin code is registered - first check whether the user is logged in
            if (userLogin.isAuthenticated())
                // if the user is logged in - don't check the pin code and report success
                response.addSuccess(scope, userLogin.getExpiresAt(), getName());
            else {
                // continue to validate credentials, and if success - set active user
                super.authorize(scope, credentials, request, response);
                if (registeredUser != null) {
                    authorizationContext.setActiveUser(userLogin.getRegisteredUser());
                    response.addSuccess(scope, getExpiresAt(), getName(), "user", registeredUser);
                }
            }
        }
    }

    protected boolean validateCredentials(Map<String, Object> credentials) {
        boolean ok = registeredPinCode.equals(credentials.get(ACTION_GET_PIN_CODE));
        if (ok)
            registeredUser = userLogin.getRegisteredUser();
        return ok;
    }

    protected Map<String, Object> createChallenge() {
        return createChallenge(ACTION_GET_PIN_CODE);
    }

    private void registerPinCode(Set<String> scope, Map<String, Object> credentials, HttpServletRequest request, AuthorizationResponse response) {
        // before asking to set pin code make sure the user is logged in
        if (!userLoggedIn(scope, credentials, request, response))
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

    private boolean userLoggedIn(Set<String> scope, Map<String, Object> credentials, HttpServletRequest request, AuthorizationResponse response) {
        if (userLogin.isExpired())
            userLogin.authorize(scope, credentials, request, response);
        return userLogin.isAuthenticated();
    }

    private Map<String, Object> createChallenge(String action) {
        Map<String, Object> challenge = new HashMap<String, Object>();
        challenge.put(ACTION_FIELD, action);
        return challenge;
    }
}
