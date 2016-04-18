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
 * Implementation of LTPA Based SSO security check.
 */
public class LTPABasedSSOSecurityCheck extends ExternalizableSecurityCheck {

    private static final Logger logger = Logger.getLogger(LTPABasedSSOSecurityCheck.class.getName());

    private static final String STATE_AUTHENTICATED = "authenticated";

    @Override
    public SecurityCheckConfiguration createConfiguration(Properties properties) {
        return new LTPABasedSSOSecurityCheckConfig(properties);
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
            logger.fine("LTPABasedSSO authorization: user authenticated (" + principal + ")");

        } else {

            // a caller principal does not exist - drop the state and return challenge
            setState(STATE_EXPIRED);
            Map<String, Object> challenge = new HashMap<>();
            challenge.put("loginURL", getConfiguration().loginURL);
            response.addChallenge(getName(), challenge);
            logger.fine("LTPABasedSSO authorization: sending challenge for " + getConfiguration().loginURL);
        }
    }

    @Override
    public void introspect(Set<String> scope, IntrospectionResponse response) {
        if (getState().equals(STATE_AUTHENTICATED)) {
            response.addIntrospectionData(getName(), scope, getExpiresAt(), null);
            logger.finer("LTPABasedSSO introspection: user authenticated (" + authorizationContext.getActiveUser().getId() + ")");
        } else {
            logger.finer("LTPABasedSSO introspection: user not authenticated");
        }
    }

    @Override
    protected void initStateDurations(Map<String, Integer> durations) {
        durations.put(STATE_AUTHENTICATED, getConfiguration().expirationSec);
    }

    @Override
    protected LTPABasedSSOSecurityCheckConfig getConfiguration() {
        return (LTPABasedSSOSecurityCheckConfig) super.getConfiguration();
    }
}
