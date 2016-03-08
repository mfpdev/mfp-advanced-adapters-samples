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
import com.ibm.mfp.server.security.external.checks.SecurityCheckConfiguration;
import com.twilio.sdk.TwilioRestClient;
import com.twilio.sdk.TwilioRestException;
import com.twilio.sdk.resource.factory.MessageFactory;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * SMS OTP Security Check
 *
 * This security check can used to validate phone number or as SMS OTP
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

    static Logger logger = Logger.getLogger(SMSOTPSecurityCheck.class.getName());

    private String smsCode = "";

    // Hold the phone number until it verified
    private String transientPhoneNumber = null;

    @Override
    public SecurityCheckConfiguration createConfiguration(Properties properties) {
        return new SMSOTPSecurityCheckConfig(properties);
    }

    /**
     * Validate the google SMS One Time Password
     * @param credentials a Map containing the password
     * @return true if the password is correct
     */
    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
        boolean isValid = false;
        if (credentials != null) {
            String phoneNumber = (String)credentials.get(PHONE_NUMBER);
            if (phoneNumber != null){
                transientPhoneNumber = (String) credentials.get(PHONE_NUMBER);
                isValid = false;
            } else {
                String receivedSmsCode = (String) credentials.get(CODE_KEY);
                if (receivedSmsCode != null && receivedSmsCode.equals(smsCode)) {
                    if (registrationContext.getRegisteredProtectedAttributes().get(PHONE_NUMBER) == null) {
                        registrationContext.getRegisteredProtectedAttributes().put(PHONE_NUMBER, transientPhoneNumber);
                        transientPhoneNumber = null;
                    }
                    smsCode = null;
                    isValid =  true;
                }
            }
        }
        return isValid;
    }

    /**
     * Create the SMSOTPSecurityCheck challenge
     * @return Map containing challenge for missing phone number or for SMS code
     */
    @Override
    protected Map<String,Object> createChallenge() {
        String persistedPhoneNumber = registrationContext.getRegisteredProtectedAttributes().get(PHONE_NUMBER);

        Map<String,Object> challenge = new HashMap<String, Object>();
        if  (persistedPhoneNumber == null && transientPhoneNumber == null) {
            challenge.put(CHALLENGE, PHONE_NUMBER);
        } else {
            int sentSmsCode = this.sendSMSCode();
            if (sentSmsCode != -1) {
                smsCode = String.valueOf(sentSmsCode);
                challenge.put(CHALLENGE, SMS_CODE);
            }
        }
        return challenge;
    }

    /**
     * Send SMS code to the transient / registered phone number
     * @return random int with 4 digitis as SMS password
     */
    private int sendSMSCode () {
        SMSOTPSecurityCheckConfig config = (SMSOTPSecurityCheckConfig) getConfig();
        TwilioRestClient client = new TwilioRestClient(config.getTwilioAccountSid(), config.getTwilioAuthToken());
        String phoneNumber = registrationContext.getRegisteredProtectedAttributes().get(PHONE_NUMBER);

        if (phoneNumber == null) {
            phoneNumber = transientPhoneNumber;
        }

        List<NameValuePair> params = new ArrayList<NameValuePair>();
        //Create 4 digits random code
        int randomSmsCode = (int)(Math.random()*9000)+1000;

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
