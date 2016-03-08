/*
 * IBM Confidential OCO Source Materials
 *
 * 5725-I43 Copyright IBM Corp. 2006, 2016
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has
 * been deposited with the U.S. Copyright Office.
 */

package com.ibm.mfp.sample.security;

import com.ibm.mfp.security.checks.base.CredentialsValidationSecurityCheck;
import com.ibm.mfp.server.registration.external.model.PersistentAttributes;
import com.ibm.mfp.server.security.external.checks.SecurityCheckConfiguration;
import com.twilio.sdk.TwilioRestClient;
import com.twilio.sdk.resource.factory.MessageFactory;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

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
 *
 * @author Ishai Borovoy
 * @since 06/03/206
 */
public class SMSOTPSecurityCheck extends CredentialsValidationSecurityCheck {
    public static final String PHONE_NUMBER = "phone";
    public static final String SMS_CODE = "smsCode";
    private final static String CODE_KEY = "code";
    private final static String CHALLENGE = "challenge";

    static Logger logger = Logger.getLogger(SMSOTPSecurityCheck.class.getName());

    private String smsCode = "";

    // Hold the phone number until it verified
    private String tempPhoneNumber = null;

    @Override
    public SecurityCheckConfiguration createConfiguration(Properties properties) {
        return new SMSOTPSecurityCheckConfig(properties);
    }

    /**
     * Validate the google SMS One Time Password
     *
     * @param credentials a Map containing the password
     * @return true if the password is correct
     */
    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
        boolean isValid = false;
        String phoneNumber = (String) credentials.get(PHONE_NUMBER);
        if (phoneNumber != null) {
            tempPhoneNumber = phoneNumber;
            isValid = false;
        } else {
            String receivedSmsCode = (String) credentials.get(CODE_KEY);
            if (receivedSmsCode != null && receivedSmsCode.equals(smsCode)) {
                PersistentAttributes protectedAttributes = registrationContext.getRegisteredProtectedAttributes();
                if (protectedAttributes.get(PHONE_NUMBER) == null) {

                    //Phone number has been verified
                    protectedAttributes.put(PHONE_NUMBER, tempPhoneNumber);
                    tempPhoneNumber = null;
                }
                smsCode = null;
                isValid = true;
            }
        }
        return isValid;
    }

    /**
     * Create the SMSOTPSecurityCheck challenge
     *
     * The challenge can either require a phone number or the One-Time code sent via SMS.
     * @return Map containing challenge for missing phone number or for SMS code
     */
    @Override
    protected Map<String, Object> createChallenge() {
        final PersistentAttributes registeredProtectedAttributes = registrationContext.getRegisteredProtectedAttributes();

        String persistedPhoneNumber = registeredProtectedAttributes.get(PHONE_NUMBER);

        Map<String, Object> challenge = new HashMap<>();
        // The phone number is unknown, send challenge asking for phone number
        if (persistedPhoneNumber == null && tempPhoneNumber == null) {
            challenge.put(CHALLENGE, PHONE_NUMBER);
        } else {
            // Check if phone number is in registration db
            String phoneNumber = registeredProtectedAttributes.get(PHONE_NUMBER);

            //If phone number has not been verified yet, save it as temporary var
            if (phoneNumber == null) {
                phoneNumber = tempPhoneNumber;
            }

            int sentSmsCode = this.sendSMSCode(phoneNumber);
            if (sentSmsCode != -1) {
                smsCode = String.valueOf(sentSmsCode);
                challenge.put(CHALLENGE, SMS_CODE);
            }
        }
        return challenge;
    }

    /**
     * Send SMS code to the given phone number
     *
     * @return random int with 4 digits as SMS password
     */
    private int sendSMSCode(String phoneNumber) {
        SMSOTPSecurityCheckConfig config = (SMSOTPSecurityCheckConfig) getConfig();
        TwilioRestClient client = new TwilioRestClient(config.getTwilioAccountSid(), config.getTwilioAuthToken());

        List<NameValuePair> params = new ArrayList<>();
        //Create 4 digits random code
        int randomSmsCode = (int) (Math.random() * 9000) + 1000;

        params.add(new BasicNameValuePair("Body", "" + randomSmsCode));
        params.add(new BasicNameValuePair("To", phoneNumber));
        params.add(new BasicNameValuePair("From", config.getTwilioPhoneNumber()));

        MessageFactory messageFactory = client.getAccount().getMessageFactory();
        try {
            messageFactory.create(params);
            return randomSmsCode;
        } catch (Exception e) {
            logger.log(Level.WARNING, "Cannot send SMS code", e);
            return -1;
        }
    }
}
