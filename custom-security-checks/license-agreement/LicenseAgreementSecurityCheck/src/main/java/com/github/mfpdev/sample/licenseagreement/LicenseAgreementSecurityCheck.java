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

package com.github.mfpdev.sample.licenseagreement;

import com.ibm.mfp.server.registration.external.model.PersistentAttributes;
import com.ibm.mfp.server.security.external.checks.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;


/**
 * This class implements the security check which is used to support signing of License Agreements.
 *
 * Created by Uri Segev on 19/06/16.
 */
public class LicenseAgreementSecurityCheck implements SecurityCheck {

    private transient static final String _checkName = "LicenseAgreement";

    private transient LicenseAgreementConfig config;

    private transient RegistrationContext registrationContext;

    /*
        Attribute IDs for storing signature state in the Registration service.
        Note: to avoid collisions with other attributes, I prefixed the attribute names with the security check name.
     */

    // The time the license was signed. Currently I am only using that fact that it is there. Not looking at the
    // time itself
    private transient static final String SIGN_DATE_ATTR = _checkName+".signDate";

    // The version number that was signed
    private transient static final String SIGN_VER_ATTR = _checkName+".signedVersion";

    /*
        Protocol between Security Check and Challenge Handler constants.
     */

    // The URL for the license agreement
    private transient static final String PROT_URL_ATTR = "URL";

    // The message code.
    // Note: I am using codes instead of text messages to allow for multi language support on the client
    private transient static final String PROT_MSG_ATTR = "message";

    // The version that needs to be signed as well as the version that was actually signed
    private transient static final String PROT_VER_ATTR = "version";

    // Message code indicating that the license was never signed
    private transient static final int PROT_MSG_NEW = 1;

    // Message code indicating that the license was signed, but it was changed and need to re-sign.
    private transient static final int PROT_MSG_CHANGED = 2;


    /*
        This method is called by the security framework in order to grant the client the appropriate security scope.
        The method first checks if the user already signed the latest license agreement, by inspecting the Registration
        service. If it is already signed, no further interaction is required with the user. If the agreement was not
        signed, or the version signed is not the current one, A challenge is sent to the client asking to sign the
        agreement.

        Once a challenge response is received, the code verifies that the current version was signed, and if so, it
        updates the Registration service.
     */
    public void authorize(Set<String> scope,
                          Map<String, Object> credentials,
                          HttpServletRequest request,
                          AuthorizationResponse response) {

        // Get the signature status from the Registration service
        PersistentAttributes attributes = registrationContext.getRegisteredProtectedAttributes();
        Long signDate = attributes.get(SIGN_DATE_ATTR);
        Integer signedVersion = attributes.get(SIGN_VER_ATTR);

        // Get current license agreement version from configuration
        int currentVersion = config.licenseVersion;

        if (signDate != null && signedVersion == currentVersion) {
            // Signed the latest license, all done
            response.addSuccess(scope, getExpiresAt(), _checkName);
        }
        else {
            // Need to sign the License Agreement, either because it was never signed or because there is a new version

            if (credentials == null) {
                // No Credentials -> Create a challenge request

                response.addChallenge(_checkName, createChallenge(signDate != null));
            }
            else {
                // Credentials received -> Received a challenge response

                // Extract the response
                signedVersion = (Integer) credentials.get(PROT_VER_ATTR);

                if (signedVersion == currentVersion) {
                    // Signed the latest version, update signature state in registartion service
                    attributes.put(SIGN_DATE_ATTR, System.currentTimeMillis());
                    attributes.put(SIGN_VER_ATTR, currentVersion);
                    response.addSuccess(scope, 0, _checkName);
                } else {
                    // Signed an older version (probably version changed while reading the agreement), ask to
                    // sign it again
                    response.addChallenge(_checkName, createChallenge(true));
                }
            }
        }
    }

    /*
        Create the challenge request. The information for creating the request is taken from the configuration object.
     */
    private Map<String, Object> createChallenge(boolean signed)
    {
        // Get latest license agreement information from configuration
        int latestVersion = config.licenseVersion;
        String licenseUrl = config.licenseURL;

        Map<String, Object> challenge = new HashMap<String, Object>();
        challenge.put(PROT_URL_ATTR, licenseUrl);
        challenge.put(PROT_VER_ATTR, latestVersion);
        if (!signed) {
            challenge.put(PROT_MSG_ATTR, PROT_MSG_NEW);
        }
        else {
            challenge.put(PROT_MSG_ATTR, PROT_MSG_CHANGED);
        }
        return challenge;
    }

    /*
        This methods is called by the security framework to make sure that the scope is still valid for the client. In
        this case it does so by reading the signature information from the registration service and validate that the
        version that was signed by the user is the same as the current configured version.
     */
    public void introspect(Set<String> scope, IntrospectionResponse response) {
        // Get current signature status from Registration database
        PersistentAttributes attributes = registrationContext.getRegisteredProtectedAttributes();
        Long signDate = attributes.get(SIGN_DATE_ATTR);
        Integer signVersion = attributes.get(SIGN_VER_ATTR);

        // Get the version of the current license agreement
        int currentVersion = config.licenseVersion;

        if (signDate != null && signVersion == currentVersion) {
            response.addIntrospectionData(_checkName, scope, System.currentTimeMillis() + 3600 * 1000, null );
        }
    }

    /*
        Called by the security framework to create the configuration object. You should not keep the object here. You
        should use the configuration object from setContext.
     */
    public LicenseAgreementConfig createConfiguration(Properties properties) {
        return new LicenseAgreementConfig (properties);
    }

    /*
        Called by the security framework to set different context values. In this case we are only interested in the
        configuration and registration objects.

        Configuration is used to get the security check's configuration values.
        Registration service is used to store the current signature state.
     */
    public void setContext(String name,
                           SecurityCheckConfiguration config,
                           AuthorizationContext authorizationContext,
                           RegistrationContext registrationContext) {
        this.registrationContext = registrationContext;
        this.config = (LicenseAgreementConfig) config;
    }

    public int getInactivityTimeoutSec() {
        return 0;
    }

    /*
        This method is called by the security framework so it knows when the internal state can be deleted. As this
        check has no state, we can return 0 here. By doing so the framework knows that the security check has no state
        and should not call writeExternal and readExternal.
     */
    public long getExpiresAt() {
        return 0;
    }

    public void logout() {
        PersistentAttributes attributes = registrationContext.getRegisteredProtectedAttributes();
        attributes.delete(SIGN_DATE_ATTR);
        attributes.delete(SIGN_VER_ATTR);
    }

    /*
        The following two methods are empty as this implementation doesn't have any state which needs to be stored
        between invocations.
     */
    public void writeExternal(ObjectOutput out) throws IOException {
        throw new IllegalStateException("Security Check has no state and therfore this method should not be called");
    }

    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        throw new IllegalStateException("Security Check has no state and therfore this method should not be called");
    }
}
