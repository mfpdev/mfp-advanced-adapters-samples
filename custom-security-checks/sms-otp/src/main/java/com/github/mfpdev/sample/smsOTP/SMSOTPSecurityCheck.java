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
package com.github.mfpdev.sample.smsOTP;

import com.ibm.mfp.security.checks.base.CredentialsValidationSecurityCheck;
import com.ibm.mfp.server.registration.external.model.PersistentAttributes;
import com.ibm.mfp.server.security.external.checks.AuthorizationResponse;
import com.ibm.mfp.server.security.external.checks.SecurityCheckConfiguration;
import com.twilio.sdk.TwilioRestClient;
import com.twilio.sdk.resource.factory.MessageFactory;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * SMS OTP Security Check
 * <p/>
 * This security check maintains device's phonenumber in the registration db, and sends OTP as SMS.
 * The class is using external library Twillio as messaging platform
 * To used this security check you need to have a registered account which able to send SMS @ Twillio (@see https://www.twilio.com)
 *
 * @author Ishai Borovoy
 * @since 06/03/206
 */
public class SMSOTPSecurityCheck extends CredentialsValidationSecurityCheck {
    public static final String PHONE_NUMBER = "phone";
    public static final String SMS_CODE = "smsCode";
    private final static String CODE_KEY = "code";
    private final static String CHALLENGE = "challenge";

    private static final int SMS_SEND_FAILURE = -1;

    static Logger logger = Logger.getLogger(SMSOTPSecurityCheck.class.getName());

    private String smsCode = "";

    // Hold the phone number until it verified
    private String phoneNumber = null;

    @Override
    public SecurityCheckConfiguration createConfiguration(Properties properties) {
        return new SMSOTPSecurityCheckConfig(properties);
    }

    /**
     * Validate the SMS One-Time Password
     *
     * @param credentials a Map containing the password
     * @return true if the password is correct
     */
    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
        String receivedSmsCode = (String) credentials.get(CODE_KEY);
        return receivedSmsCode != null && !receivedSmsCode.isEmpty() && receivedSmsCode.equals(smsCode);
    }

    /**
     * Create the SMSOTPSecurityCheck challenge
     *
     * @return Map containing challenge for SMS code
     */
    @Override
    protected Map<String, Object> createChallenge() {
        final PersistentAttributes registeredProtectedAttributes = registrationContext.getRegisteredProtectedAttributes();

        Map<String, Object> challenge = new HashMap<>();

        int sentSmsCode = sendSMSCode(phoneNumber);
        if (sentSmsCode != SMS_SEND_FAILURE) {
            smsCode = String.valueOf(sentSmsCode);
            challenge.put(CHALLENGE, SMS_CODE);
        }
        return challenge;
    }

    @Override
    public void authorize(Set<String> scope, Map<String, Object> credentials, HttpServletRequest request, AuthorizationResponse response) {
        phoneNumber = registrationContext.getRegisteredProtectedAttributes().get(PHONE_NUMBER);

        //Return failure in case no phone number is found in registration service
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            Map<String, Object> failure = new HashMap<>();
            failure.put("failure", "Missing phone number");
            response.addFailure(getName(), failure);
        } else {
            super.authorize(scope, credentials, request, response);
        }
    }

    /**
     * Send SMS code to the given phone number
     *
     * @return random int with 4 digits as SMS password
     */
    private int sendSMSCode(String phoneNumber) {
        SMSOTPSecurityCheckConfig config = (SMSOTPSecurityCheckConfig) getConfiguration();
        TwilioRestClient client = new TwilioRestClient(config.getTwilioAccountSid(), config.getTwilioAuthToken());

        List<NameValuePair> params = new ArrayList<>();

        //Create 4 digits random code
        int randomSmsCode = (int) (Math.random() * 9000) + 1000;

        params.add(new BasicNameValuePair("Body", "" + randomSmsCode));
        params.add(new BasicNameValuePair("To", phoneNumber));
        params.add(new BasicNameValuePair("From", config.getTwilioFromPhoneNumber()));

        MessageFactory messageFactory = client.getAccount().getMessageFactory();
        try {
            messageFactory.create(params);
            return randomSmsCode;
        } catch (Exception e) {
            logger.log(Level.WARNING, "Cannot send SMS code", e);
            return SMS_SEND_FAILURE;
        }
    }
}
