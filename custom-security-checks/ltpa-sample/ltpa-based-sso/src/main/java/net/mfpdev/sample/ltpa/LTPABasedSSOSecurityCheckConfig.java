/*
 * IBM Confidential OCO Source Materials
 *
 * 5725-I43 Copyright IBM Corp. 2006, 2016
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has
 * been deposited with the U.S. Copyright Office.
 */

package net.mfpdev.sample.ltpa;

import com.ibm.mfp.server.security.external.checks.impl.ExternalizableSecurityCheckConfig;

import java.util.Properties;

/**
 * Defines expiration configuration property
 *
 * @author Ishai Borovoy on 18/04/2016.
 */
public class LTPABasedSSOSecurityCheckConfig extends ExternalizableSecurityCheckConfig {

    public final int expirationSec;
    public final String loginURL;

    public LTPABasedSSOSecurityCheckConfig(Properties properties) {
        super(properties);
        expirationSec = getIntProperty("expirationSec", properties, null);
        loginURL = getStringProperty("loginURL", properties, null);
    }
}
