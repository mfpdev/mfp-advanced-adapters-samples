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

import com.ibm.mfp.server.security.external.checks.impl.ExternalizableSecurityCheckConfig;

import java.util.Properties;

/**
 * Defines expiration configuration property
 *
 * @author Ishai Borovoy on 18/04/2016.
 */
public class LTPABasedSecurityCheckConfig extends ExternalizableSecurityCheckConfig {

    public final int expirationSec;
    public final String loginURL;

    public LTPABasedSecurityCheckConfig(Properties properties) {
        super(properties);
        expirationSec = getIntProperty("expirationSec", properties, null);
        loginURL = getStringProperty("loginURL", properties, null);
    }
}
