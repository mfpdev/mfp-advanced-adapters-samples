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

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;

import java.util.Collections;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;

/**
 * Configuration and verification of google ID token
 * as descibed at https://developers.google.com/identity/sign-in/android/backend-auth
 * <p/>
 * The only configuration property is {@link #CLIENT_ID_CONFIG_PROPERTY}, which contains the OAuth 2.0 client ID for MFP server.
 * This client ID should be obtained from the <a href="https://console.developers.google.com/apis/credentials">Google Developers Console</a>
 *
 * @author artem on 3/3/16.
 */
public class GoogleSupport implements LoginVendor {

    private static final Logger logger = Logger.getLogger(GoogleSupport.class.getName());

    private static final String CLIENT_ID_CONFIG_PROPERTY = "google.clientId";

    private NetHttpTransport transport = new NetHttpTransport();
    private JsonFactory jsonFactory = new JacksonFactory();

    private GoogleIdTokenVerifier[] verifiers;

    public String[] getConfigurationPropertyNames() {
        return new String[]{CLIENT_ID_CONFIG_PROPERTY};
    }

    public void setConfiguration(Properties properties) {
        String clientId = properties.getProperty(CLIENT_ID_CONFIG_PROPERTY);
        if (clientId != null && !clientId.isEmpty() && clientId.endsWith("apps.googleusercontent.com")) {
            verifiers = new GoogleIdTokenVerifier[]{
                    createTokenVerifier(clientId, "https://accounts.google.com"),
                    createTokenVerifier(clientId, "accounts.google.com"),
            };
        } else {
            verifiers = null;
        }
    }

    private GoogleIdTokenVerifier createTokenVerifier(String clientId, String issuer) {
        return new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
               .setAudience(Collections.singletonList(clientId))
               .setIssuer(issuer)
               .build();
    }

    public boolean isEnabled() {
        return verifiers != null;
    }

    public AuthenticatedUser validateTokenAndCreateUser(String idTokenStr, String checkName) {
        GoogleIdToken idToken = null;
        String errorMsg = "";
        for (GoogleIdTokenVerifier verifier : verifiers) {
            try {
                idToken = verifier.verify(idTokenStr);
                if (idToken != null) break;
            } catch (Exception e) {
                errorMsg = e.toString() + "\n";
            }
        }
        if (idToken == null) {
            logger.info("Failed to validate google Id token:\n" + errorMsg);
            return null;
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String userId = payload.getSubject();
        String name = (String) payload.get("name");
        AuthenticatedUser user = new AuthenticatedUser(userId, name, checkName);
        Map<String, Object> attributes = user.getAttributes();

        String email = payload.getEmail();
        if (email != null) {
            attributes.put("email", email);
            attributes.put("email_verified", payload.getEmailVerified());
        }

        copyProperty("picture", payload, attributes);
        copyProperty("family_name", payload, attributes);
        copyProperty("given_name", payload, attributes);
        copyProperty("locale", payload, attributes);

        return user;
    }

    private void copyProperty(String propertyName, GoogleIdToken.Payload from, Map<String, Object> to) {
        Object value = from.get(propertyName);
        if (value != null)
            to.put(propertyName, value);
    }

}
