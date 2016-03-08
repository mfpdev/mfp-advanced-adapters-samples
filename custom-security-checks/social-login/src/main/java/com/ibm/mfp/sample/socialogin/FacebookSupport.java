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

import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;

import java.util.Properties;

/**
 * TODO: Document!
 *
 * @author artem on 3/3/16.
 */
public class FacebookSupport implements LoginVendor {

    public String[] getConfigurationPropertyNames() {
        return new String[0];
    }

    public void setConfiguration(Properties properties) {

    }

    public boolean isEnabled() {
        return false;
    }

    public AuthenticatedUser validateTokenAndCreateUser(String tokenStr, String checkName) {
        return null;
    }
}
