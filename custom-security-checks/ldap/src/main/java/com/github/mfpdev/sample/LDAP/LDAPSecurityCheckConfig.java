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
    private static Logger logger = Logger.getLogger(LDAPSecurityCheckConfig.class.getName());

    //Configurable LDAP properties
    private final String ldapURL;
    private final String bindDN;
    private final String bindPassword;
    private final String userFilter;
    private final String ldapUserAttribute;

    public String getLdapNameAttribute() {
        return ldapNameAttribute;
    }

    public String getLdapUserAttribute() {
        return ldapUserAttribute;
    }

    private final String ldapNameAttribute;

    public String getLdapURL() {
        return ldapURL;
    }

    public String getBindDN() {
        return bindDN;
    }

    public String getBindPassword() {
        return bindPassword;
    }

    public String getUserFilter() {
        return userFilter;
    }

    public LDAPSecurityCheckConfig(Properties properties) {
        super(properties);

        this.ldapURL = getStringProperty("ldapURL", properties, "");
        this.bindDN = getStringProperty("bindDN", properties, "");
        this.bindPassword = getStringProperty("bindPassword", properties, "");
        this.userFilter = getStringProperty("userFilter", properties, "");
        this.ldapUserAttribute = getStringProperty("ldapUserAttribute", properties, "");
        this.ldapNameAttribute = getStringProperty("ldapNameAttribute", properties, "");

        logger.info(String.format("Initializing a LDAP Security configuration with ldapURL=[%s], bindDN=[%s], bindPassword=[%s], userFilter=[%s]",
                ldapURL, bindPassword, bindPassword, userFilter));

        if  (ldapURL == null || !ldapURL.contains("ldap://")) {
            addMessage(getWarnings(),"ldapURL", "LDAP URL is invalid");
        }

        if (userFilter == null || !userFilter.contains("%v")) {
            addMessage(getWarnings(),"userFilter", "userFilter is invalid");
        }

        if (ldapUserAttribute == null || ldapUserAttribute.trim().length() <= 0) {
            addMessage(getWarnings(),"ldapUserAttribute", "ldapUserAttribute is mandatory");
        }

        if (ldapNameAttribute == null || ldapNameAttribute.trim().length() <= 0) {
            addMessage(getWarnings(),"ldapNameAttribute", "ldapNameAttribute is mandatory");
        }
    }
}
