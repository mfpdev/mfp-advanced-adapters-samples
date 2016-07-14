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
package com.github.mfpdev.sample.LDAP;


import com.ibm.mfp.security.checks.base.UserAuthenticationSecurityCheckConfig;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Properties;
import java.util.logging.Logger;

/**
 * The LDAP Security Check Configuration class
 *
 * @author Ishai Borovoy
 * @since 14/07/2016
 */
public class LDAPSecurityCheckConfig extends UserAuthenticationSecurityCheckConfig {
    //Define logger (Standard java.util.Logger)
    static Logger logger = Logger.getLogger(LDAPSecurityCheckConfig.class.getName());

    //Configurable LDAP properties
    private final String ldapURL;
    private final String ldapAdminDN;
    private final String ldapAdminPassword;
    private final String ldapSearchString;

    public String getLdapURL() {
        return ldapURL;
    }

    public String getLdapAdminDN() {
        return ldapAdminDN;
    }

    public String getLdapAdminPassword() {
        return ldapAdminPassword;
    }

    public String getLdapSearchString() {
        return ldapSearchString;
    }

    public LDAPSecurityCheckConfig(Properties properties) {
        super(properties);

        this.ldapURL = getStringProperty("ldapURL", properties, "");
        this.ldapAdminDN = getStringProperty("ldapAdminDN", properties, "");
        this.ldapAdminPassword = getStringProperty("ldapAdminPassword", properties, "");
        this.ldapSearchString = getStringProperty("ldapSearchString", properties, "");

        logger.info(String.format("Initializing a LDAP Security configuration with ldapURL=[%s], ldapAdminDN=[%s], ldapAdminPassword=[%s], ldapSearchString=[%s]",
                ldapURL, ldapAdminPassword, ldapAdminPassword, ldapSearchString));

        try {
            new URL(this.ldapURL);
        } catch (MalformedURLException e) {
            logger.warning("LDAP URL is invalid - " + this.ldapURL);
        }

        if (ldapSearchString == null || ldapSearchString.trim().length() <= 0) {
            String warning = "LDAP search string is empty - " + this.ldapSearchString;
            logger.warning(warning);
            addMessage(getWarnings(),"ldapSearchString", warning);
        }
    }
}
