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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;

/**
 * Validate Facebook access token via graph API, and get the user ID and display name.
 * Requires no configuration, always enabled.
 * <p/>
 * It migh be necessary to add DigiCert root certificate to Liberty's key store.
 * To do that download the certificate via Firefox browser, and add it using the following command:
 * keytool -import -trustcacerts -file ~/Downloads/DigiCertHighAssuranceEVRootCA.pem -alias DigiCert -keystore liberty/wlp/usr/servers/mfp/resources/security/key.jks
 *
 * @author artem on 3/3/16.
 */
public class FacebookSupport implements LoginVendor {

    private static final Logger logger = Logger.getLogger(FacebookSupport.class.getName());

    private ObjectMapper mapper = new ObjectMapper();

    public String[] getConfigurationPropertyNames() {
        return new String[0];
    }

    public void setConfiguration(Properties properties) {
    }

    public boolean isEnabled() {
        return true;
    }

    public AuthenticatedUser validateTokenAndCreateUser(String tokenStr, String checkName) {
        HttpURLConnection connection = null;
        String error;
        try {
            String req = "https://graph.facebook.com/me?fields=id,name&access_token=" + tokenStr;
            connection = (HttpURLConnection) new URL(req).openConnection();
            connection.setRequestMethod("GET");
            connection.connect();

            int responseCode = connection.getResponseCode();
            String content = readContent(responseCode == 200 ? connection.getInputStream() : connection.getErrorStream());

            if (responseCode == 200) {
                Map data = mapper.readValue(content, Map.class);
                return new AuthenticatedUser((String) data.get("id"), (String) data.get("name"), checkName);
            } else {
                error = content;
            }
        } catch (Exception e) {
            error = e.toString();
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }

        logger.severe("Failed to validate Facebook access token: " + error);
        return null;
    }

    private String readContent(InputStream inputStream) throws IOException {
        String content = "";
        BufferedReader in = new BufferedReader(new InputStreamReader(inputStream));
        String line;
        while ((line = in.readLine()) != null) {
            content += line + "\n";
        }
        in.close();
        return content;
    }
}
