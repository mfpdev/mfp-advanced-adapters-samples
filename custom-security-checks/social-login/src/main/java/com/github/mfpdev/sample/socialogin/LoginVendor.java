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

import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;

import javax.net.ssl.SSLSocketFactory;
import java.util.Properties;

/**
 * The contract for a login vendor.<br/>
 * Each vendor defines its configuration properties, and implements the validation of its proprietary ID token.
 * <p/>
 * An instance of login vendor is created on adapter deployment or configuration change, and is a part of security check configuration.
 * It is shared between the mobile clients, and should not maintain state related to any specific client.
 *
 * @author artem on 3/6/16.
 */
public interface LoginVendor {

    /**
     * Get the names of configuration properties.
     * Only the properties with these names will be passed to {@link #setConfiguration(Properties, SSLSocketFactory)} method
     *
     * @return the array of property names, not null
     */
    String[] getConfigurationPropertyNames();

    /**
     * Invoked on a newly created instance upon adapter deployment or configuration change
     *
     * @param properties       the configuration properties defined by the {@link #getConfigurationPropertyNames()} method, not null.
     * @param sslSocketFactory socket factory produced by the {@link SocialLoginConfiguration} class
     */
    void setConfiguration(Properties properties, SSLSocketFactory sslSocketFactory);

    /**
     * Returns true if the vendor is properly configured and is ready to validate tokens
     *
     * @return true if this vendor is enabled, false otherwise
     */
    boolean isEnabled();

    /**
     * Validate the given token, and if it is valid build an AuthenticatedUser and return it.
     * If the token is invalid, return null.
     *
     * @param tokenStr  the token string sent by the client
     * @param checkName the security check name for creation of AuthenticatedUser
     * @return the authenticated user represented by the token, or null if the token is invalid
     */
    AuthenticatedUser validateTokenAndCreateUser(String tokenStr, String checkName);
}
