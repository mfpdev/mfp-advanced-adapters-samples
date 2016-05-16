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


import com.ibm.mfp.security.checks.base.CredentialsValidationSecurityCheckConfig;
import com.twilio.sdk.TwilioRestClient;

import java.util.Properties;
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
            String errorMessage = String.format("Twilio client failed to initialize with the provided parameters SID = [%s] Token = [%s] Number = [%s]",
                    twilioAccountSid, twilioAuthToken, twilioFromPhoneNumber);
            addMessage(getErrors(),"twilioAccountSid", errorMessage);
            logger.severe(errorMessage);
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
