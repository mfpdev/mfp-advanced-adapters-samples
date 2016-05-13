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
package com.github.mfpdev.sample.ltpa;


import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;
import com.ibm.mfp.server.security.external.checks.AuthorizationResponse;
import com.ibm.mfp.server.security.external.checks.IntrospectionResponse;
import com.ibm.mfp.server.security.external.checks.SecurityCheckConfiguration;
import com.ibm.mfp.server.security.external.checks.impl.ExternalizableSecurityCheck;
import com.ibm.websphere.security.auth.WSSubject;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.logging.Logger;

/**
 * Created by Ishai Borovoy  on 17/04/2016
 * Implementation of LTPA Based security check.
 */
public class LTPABasedSecurityCheck extends ExternalizableSecurityCheck {

    private static final Logger logger = Logger.getLogger(LTPABasedSecurityCheck.class.getName());

    private static final String STATE_AUTHENTICATED = "authenticated";

    @Override
    public SecurityCheckConfiguration createConfiguration(Properties properties) {
        return new LTPABasedSecurityCheckConfig(properties);
    }

    @Override
    public void authorize(Set<String> scope, Map<String, Object> credentials, HttpServletRequest request, AuthorizationResponse response) {
        String principal = WSSubject.getCallerPrincipal();

        if (principal != null) {
            // if a caller principal exists - mark as authenticated, and return success
            setState(STATE_AUTHENTICATED);
            AuthenticatedUser user = new AuthenticatedUser(principal, principal, getName());
            authorizationContext.setActiveUser(user);
            registrationContext.setRegisteredUser(user);
            response.addSuccess(scope, getExpiresAt(), getName());
            logger.fine("LTPABased authorization: user authenticated (" + principal + ")");

        } else {

            // a caller principal does not exist - drop the state and return challenge
            setState(STATE_EXPIRED);
            Map<String, Object> challenge = new HashMap<>();
            challenge.put("loginURL", getConfiguration().loginURL);
            response.addChallenge(getName(), challenge);
            logger.fine("LTPABased authorization: sending challenge for " + getConfiguration().loginURL);
        }
    }

    @Override
    public void introspect(Set<String> scope, IntrospectionResponse response) {
        if (getState().equals(STATE_AUTHENTICATED)) {
            response.addIntrospectionData(getName(), scope, getExpiresAt(), null);
            logger.finer("LTPABased introspection: user authenticated (" + authorizationContext.getActiveUser().getId() + ")");
        } else {
            logger.finer("LTPABased introspection: user not authenticated");
        }
    }

    @Override
    protected void initStateDurations(Map<String, Integer> durations) {
        durations.put(STATE_AUTHENTICATED, getConfiguration().expirationSec);
    }

    @Override
    protected LTPABasedSecurityCheckConfig getConfiguration() {
        return (LTPABasedSecurityCheckConfig) super.getConfiguration();
    }
}
