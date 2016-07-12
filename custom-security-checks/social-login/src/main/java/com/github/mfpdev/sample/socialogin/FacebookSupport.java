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
package com.github.mfpdev.sample.socialogin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSocketFactory;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;

/**
 * Validate Facebook access token via graph API, and get the user ID and display name.
 * Requires no configuration, always enabled.
 *
 * @author artem on 3/3/16.
 */
public class FacebookSupport implements LoginVendor {

    private static final Logger logger = Logger.getLogger(FacebookSupport.class.getName());

    private ObjectMapper mapper = new ObjectMapper();
    private SSLSocketFactory sslSocketFactory;

    public String[] getConfigurationPropertyNames() {
        return new String[0];
    }

    @Override
    public void setConfiguration(Properties properties, SSLSocketFactory sslSocketFactory) {
        this.sslSocketFactory = sslSocketFactory;
    }

    public boolean isEnabled() {
        return true;
    }

    public AuthenticatedUser validateTokenAndCreateUser(String tokenStr, String checkName) {
        HttpsURLConnection connection = null;
        String error;
        try {
            String req = "https://graph.facebook.com/me?fields=id,name,email,location,picture.width(200).height(200).type(square)&access_token=" + tokenStr;
            connection = (HttpsURLConnection) new URL(req).openConnection();
            connection.setSSLSocketFactory(sslSocketFactory);
            connection.setRequestMethod("GET");
            connection.connect();

            int responseCode = connection.getResponseCode();
            String content = readContent(responseCode == 200 ? connection.getInputStream() : connection.getErrorStream());

            if (responseCode == 200) {
                Map data = mapper.readValue(content, Map.class);
                HashMap<String,Object> userAttributes = new HashMap<>();
                for (Object key : data.keySet()) {
                    userAttributes.put((String)key, data.get(key));
                }
                return new AuthenticatedUser((String) data.get("id"), (String) data.get("name"), checkName, userAttributes);
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
