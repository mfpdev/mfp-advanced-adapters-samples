/*
 * IBM Confidential OCO Source Materials
 *
 * 5725-I43 Copyright IBM Corp. 2006, 2016
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has
 * been deposited with the U.S. Copyright Office.
 */

package com.mfp.security;


import com.ibm.mfp.security.checks.base.CredentialsValidationSecurityCheckConfig;

import java.util.Properties;

/**
 * The Security Check Configuration class
 *
 * @author Ishai Borovoy
 * @since 07/03/2016
 */
public class SMSOTPSecurityCheckConfig extends CredentialsValidationSecurityCheckConfig {
    //Configurable twilio properties
    public String twilioAccountSid = null;
    public String twilioAuthToken = null;
    public String twilioPhoneNumber = null;

    public SMSOTPSecurityCheckConfig(Properties properties) {
        super (properties);
        this.twilioAccountSid = getStringProperty("twilioAccountSid", properties, "");
        this.twilioAuthToken = getStringProperty("twilioAuthToken", properties, "");
        this.twilioPhoneNumber = getStringProperty("twilioPhoneNumber", properties, "");
    }

    public String getTwilioAccountSid() {
        return twilioAccountSid;
    }

    public String getTwilioAuthToken() {
        return twilioAuthToken;
    }

    public String getTwilioPhoneNumber() {
        return twilioPhoneNumber;
    }
}
