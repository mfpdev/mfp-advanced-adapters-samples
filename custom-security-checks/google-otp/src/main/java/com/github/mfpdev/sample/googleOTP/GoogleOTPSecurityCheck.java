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

import com.ibm.mfp.security.checks.base.CredentialsValidationSecurityCheck;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorConfig;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Google OTP Security Check
 * <p/>
 * Validate the Google One-Time password sent from mobile app against the stored GoogleOTPState object
 * The class is using external library called googelauth from https://github.com/wstrange/GoogleAuth
 *
 * @author Ishai Borovoy
 * @since 06/03/206
 */

public class GoogleOTPSecurityCheck extends CredentialsValidationSecurityCheck {
    private final static String CHALLENGE = "challenge";
    private final static String GOOGLE_CODE = "googleCode";
    private final static String CODE_KEY = "code";

    /**
     * Validate the google one time password
     *
     * @param credentials a Map containing the password
     * @return true if the password is correct
     */
    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
        int googleCode = Integer.valueOf((String) credentials.get(CODE_KEY));

        //Create the GoogleAuthenticatorConfig
        GoogleAuthenticatorConfig.GoogleAuthenticatorConfigBuilder googleAuthenticatorConfigBuilder =
                new GoogleAuthenticatorConfig.GoogleAuthenticatorConfigBuilder()
                        .setTimeStepSizeInMillis(TimeUnit.SECONDS.toMillis(30))
                        .setWindowSize(5);

        GoogleAuthenticator ga = new GoogleAuthenticator(googleAuthenticatorConfigBuilder.build());
        GoogleOTPState googleOTPState = registrationContext.getRegisteredProtectedAttributes().get(GoogleOTPResource.GOOGLE_OTP_STATE_KEY, GoogleOTPState.class);

        return ga.authorize(googleOTPState.getSecret(), googleCode);
    }

    /**
     * Create the GoogleOTPSecurityCheck challenge
     *
     * @return Map containing challenge
     */
    @Override
    protected Map<String, Object> createChallenge() {
        return new HashMap<String, Object>() {{
            put(CHALLENGE, GOOGLE_CODE);
        }};
    }
}
