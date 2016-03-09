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


import com.ibm.mfp.security.checks.base.CredentialsValidationSecurityCheckConfig;
import com.twilio.sdk.TwilioRestClient;
import com.twilio.sdk.resource.instance.OutgoingCallerId;
import com.twilio.sdk.resource.list.OutgoingCallerIdList;

import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * The Security Check Configuration class
 *
 * @author Ishai Borovoy
 * @since 07/03/2016
 */
public class SMSOTPSecurityCheckConfig extends CredentialsValidationSecurityCheckConfig {
    //Define logger (Standard java.util.Logger)
    static Logger logger = Logger.getLogger(SMSOTPSecurityCheckConfig.class.getName());

    //Configurable Twilio properties
    private final String twilioAccountSid;
    private final String twilioAuthToken;
    private final String twilioFromPhoneNumber;


    public SMSOTPSecurityCheckConfig(Properties properties) {
        super(properties);
        String sid = getStringProperty("twilioAccountSid", properties, "");
        String token = getStringProperty("twilioAuthToken", properties, "");
        String fromPhoneNumber = getStringProperty("twilioFromPhoneNumber", properties, "");


        logger.info(String.format("Initializing a Twilio configuration with sid=[%s], token=[%s], from=[%s]", sid, token, fromPhoneNumber));

        twilioAccountSid = sid == null ? "" : sid.trim();
        twilioAuthToken = token == null ? "" : token.trim();
        twilioFromPhoneNumber = fromPhoneNumber == null ? "" : fromPhoneNumber.trim();

        if (twilioAccountSid.isEmpty() || twilioAuthToken.isEmpty() || twilioFromPhoneNumber.isEmpty()) {
            // Something is wrong
            final String message = String.format("Input error SID[%s] Token[%s] Phone[%s] should not be empty",
                    twilioAccountSid, twilioAuthToken, twilioFromPhoneNumber);
            logger.severe(message);
            throw new IllegalArgumentException(message);
        }

        logger.config(String.format("Twilio is initializing with configuration SID = [%s] Token = [%s] Number = [%s]",
                twilioAccountSid, twilioAuthToken, twilioFromPhoneNumber));

        // Check if we can access Twilio using our configured parameters
        try {
            TwilioRestClient client = new TwilioRestClient(getTwilioAccountSid(), getTwilioAuthToken());
            //getDateCreated() used for validation because it is failed if one of the account property is invalid
            client.getAccount().getDateCreated();
        } catch (Throwable throwable) {
            logger.severe(String.format("Twilio client failed to initialize with the provided parameters SID = [%s] Token = [%s] Number = [%s]",
                    twilioAccountSid, twilioAuthToken, twilioFromPhoneNumber));
        }
        logger.info("Twilio initialized!");

    }

    public String getTwilioAccountSid() {
        return twilioAccountSid;
    }

    public String getTwilioAuthToken() {
        return twilioAuthToken;
    }

    public String getTwilioFromPhoneNumber() {
        return twilioFromPhoneNumber;
    }
}
