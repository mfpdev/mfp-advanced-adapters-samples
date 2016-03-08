/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/
package com.ibm.mfp.sample.security;

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

    private final static String USER = "user";
    private final static String PASSWORD = "password";
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
        String username = (String) credentials.get(USER);
        String pwd = (String) credentials.get(PASSWORD);
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
