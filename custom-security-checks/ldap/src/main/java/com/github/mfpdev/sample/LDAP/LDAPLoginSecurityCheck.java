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

import com.ibm.mfp.security.checks.base.UserAuthenticationSecurityCheck;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;
import com.ibm.mfp.server.security.external.checks.SecurityCheckConfiguration;

import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;
import java.util.*;
import java.util.logging.Logger;

/**
 * Sample implementation of ldap security check.
 *
 */
public class LDAPLoginSecurityCheck extends UserAuthenticationSecurityCheck {
    private static final String USERNAME = "username";
    private static final String PASSWORD = "password";
    static Logger logger = Logger.getLogger(LDAPSecurityCheckConfig.class.getName());

    private String userId, displayName;
    private String errorMsg;

    @Override
    protected AuthenticatedUser createUser() {
        return new AuthenticatedUser(userId, displayName, this.getName());
    }

    @Override
    public SecurityCheckConfiguration createConfiguration(Properties properties) {
        return new LDAPSecurityCheckConfig(properties);
    }

    /**
     * This method is called by the base class UserAuthenticationSecurityCheck when an authorization
     * request is made that requests authorization for this security check or a scope which contains this security check
     * @param credentials
     * @return true if the credentials are valid, false otherwise
     */
    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
        LDAPSecurityCheckConfig config = (LDAPSecurityCheckConfig) getConfiguration();

        if(credentials!=null && credentials.containsKey(USERNAME) && credentials.containsKey(PASSWORD)){
            String username = credentials.get(USERNAME).toString();
            String password = credentials.get(PASSWORD).toString();


            Hashtable<String, String> env = new Hashtable<String, String>();
            env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
            env.put(Context.SECURITY_AUTHENTICATION, "simple");
            env.put(Context.PROVIDER_URL, config.getLdapURL());

            String bindDN = config.getBindDN();
            String bindPassword = config.getBindPassword();

            //LDAP admin is not mandatory
            if (bindDN != null && !bindDN.equals("-") && bindPassword != null && !bindPassword.equals("-")) {
                env.put(Context.SECURITY_PRINCIPAL, config.getBindDN());
                env.put(Context.SECURITY_CREDENTIALS, config.getBindPassword());
            }

            SearchControls sc = new SearchControls();
            String[] attributeFilter = { config.getLdapUserAttribute(),config.getLdapNameAttribute() };

            sc.setReturningAttributes(attributeFilter);
            sc.setSearchScope(SearchControls.SUBTREE_SCOPE);

            try {
                LdapContext ldapContext = new InitialLdapContext(env,null);
                String searchString = config.getUserFilter();
                searchString = searchString.replaceAll("%v", username);

                //Search the user
                NamingEnumeration<SearchResult> searchResults = ldapContext.search("", searchString, sc);
                ArrayList<SearchResult> searchResultsList = Collections.list(searchResults);

                if (searchResultsList.size() != 1) {
                    errorMsg = "Wrong Credentials";
                    return false;
                } else {
                    //login with user DN + password
                    SearchResult searchResult = searchResultsList.get(0);

                    ldapContext.addToEnvironment(Context.SECURITY_PRINCIPAL, searchResult.getName());
                    ldapContext.addToEnvironment(Context.SECURITY_CREDENTIALS, password);
                    try {
                        ldapContext.reconnect(null);
                        userId = (String) searchResult.getAttributes().get(config.getLdapUserAttribute()).get();
                        displayName = (String) searchResult.getAttributes().get(config.getLdapNameAttribute()).get();
                        return true;
                    } catch (Exception e) {
                        errorMsg = "Wrong Credentials";
                    }
                }
            } catch (Exception e) {
                errorMsg = "Connection to user repository failed";
            }
        }
        else{
            errorMsg = "Credentials not set properly";
        }
        return false;
    }

    /**
     *
     * This method is describes the challenge JSON that gets sent to the client during the authorization process
     * This is called by the base class UserAuthenticationSecurityCheck when validateCredentials returns false and
     * the number of remaining attempts is > 0
     * @return the challenge object
     */
    @Override
    protected Map<String, Object> createChallenge() {
        Map<String, Object> challenge = new HashMap<String, Object>();
        challenge.put("errorMsg",errorMsg);
        challenge.put("remainingAttempts",getRemainingAttempts());
        return challenge;
    }
}
