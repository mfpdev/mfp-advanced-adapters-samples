/*
 * IBM Confidential OCO Source Materials
 *
 * 5725-I43 Copyright IBM Corp. 2006, 2016
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has
 * been deposited with the U.S. Copyright Office.
 */

package net.mfpdev.sample.stepup;

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
