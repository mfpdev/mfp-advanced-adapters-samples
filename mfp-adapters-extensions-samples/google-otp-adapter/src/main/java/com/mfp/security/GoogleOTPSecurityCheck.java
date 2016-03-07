/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/
package com.mfp.security;

import com.ibm.mfp.security.checks.base.CredentialsValidationSecurityCheck;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorConfig;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Google OTP Security Check
 *
 * Validate the google one time password sent from mobile app against the stored GoogleOTPState object
 * The class is using external library called googelauth from https://github.com/wstrange/GoogleAuth
 *
 * @author Ishai Borovoy
 * @since 06/03/206
 */

public class GoogleOTPSecurityCheck extends CredentialsValidationSecurityCheck {
    private final static String CHALLENGE = "challenge";
    private final static String GOOGLE_CODE = "googleCode";
    private final static String CODE_KEY = "code";

    private final static String GOOGLE_AUTHENTICATOR_KEY = "googleAuthenticator";

    /**
     * Validate the google one time password
     * @param credentials a Map containing the password
     * @return true if the password is correct
     */
    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
        int googleCode = Integer.valueOf((String)credentials.get(CODE_KEY));

        //Create the GoogleAuthenticatorConfig
        GoogleAuthenticatorConfig.GoogleAuthenticatorConfigBuilder googleAuthenticatorConfigBuilder =
                new GoogleAuthenticatorConfig.GoogleAuthenticatorConfigBuilder()
                        .setTimeStepSizeInMillis(TimeUnit.SECONDS.toMillis(30))
                        .setWindowSize(5);

        GoogleAuthenticator ga = new GoogleAuthenticator(googleAuthenticatorConfigBuilder.build());
        GoogleOTPState googleOTPState = registrationContext.getRegisteredProtectedAttributes().get(GOOGLE_AUTHENTICATOR_KEY, GoogleOTPState.class);

        return ga.authorize(googleOTPState.getSecret(), googleCode);
    }

    /**
     * Create the GoogleOTPSecurityCheck challenge
     * @return Map containing challenge
     */
    @Override
    protected Map<String,Object> createChallenge() {
        return new HashMap<String, Object>()
        {{
            put(CHALLENGE, GOOGLE_CODE);
        }};
    }
}
