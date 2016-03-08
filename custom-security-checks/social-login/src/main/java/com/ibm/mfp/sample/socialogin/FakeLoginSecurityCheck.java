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

import java.util.HashMap;
import java.util.Map;

/**
 * TODO: Document!
 *
 * @author artem on 3/7/16.
 */
public class FakeLoginSecurityCheck extends UserAuthenticationSecurityCheck {

    private String username;

    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
        username = (String) credentials.get("username");
        String password = (String) credentials.get("password");
        return username != null && username.equals(password);
    }

    @Override
    protected Map<String, Object> createChallenge() {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("message", username == null ? "Enter username and password" : "Invalid username or password");
        return map;
    }

    @Override
    protected AuthenticatedUser createUser() {
        AuthenticatedUser res = new AuthenticatedUser(username, "Major " + username, getName());
        Map<String, Object> attributes = res.getAttributes();
        attributes.put("firstName", username.toUpperCase());
        attributes.put("lastName", "Unknown");
        return res;
    }
}
