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
 * The contract for a login vendor.<br/>
 * Each vendor defines its configuration properties, and implements the validation of its proprietary ID token.
 * <p/>
 * An instance of login vendor is created on adapter deployment or configuration change, and is a part of security check configuration.
 * It is shared between the mobile clients, and should not maintain state related to any specific client.
 *
 * @author artem on 3/6/16.
 */
public interface LoginVendor {

    /**
     * Get the names of configuration properties.
     * Only the properties with these names will be passed to {@link #setConfiguration(Properties)} method
     *
     * @return the array of property names, not null
     */
    String[] getConfigurationPropertyNames();

    /**
     * Invoked on anewly created instance upon adapter deployment or configuration change
     *
     * @param properties the configuration properties defined by the {@link #setConfiguration(Properties)} method, not null.
     */
    void setConfiguration(Properties properties);

    /**
     * Returns true if the vendor is properly configured and is ready to validate tokens
     *
     * @return true if this vendor is enabled, false otherwise
     */
    boolean isEnabled();

    /**
     * Validate the given token, and if it is valid build an AuthenticatedUser and return it.
     * If the token is invalid, return null.
     *
     * @param tokenStr  the token string sent by the client
     * @param checkName the security check name for creation of AuthenticatedUser
     * @return the authenticated user represented by the token, or null if the token is invalid
     */
    AuthenticatedUser validateTokenAndCreateUser(String tokenStr, String checkName);
}
