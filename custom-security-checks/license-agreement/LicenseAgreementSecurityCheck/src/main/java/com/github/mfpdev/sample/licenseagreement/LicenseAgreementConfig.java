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

import com.ibm.mfp.server.security.external.checks.impl.SecurityCheckConfigurationBase;
import java.util.Properties;

/**
 * Configuration class for LicenseAgreementSecurityCheck
 *
 * Created by Uri Segev on 04/07/16.
 */
public class LicenseAgreementConfig extends SecurityCheckConfigurationBase {

    public final int licenseVersion;
    public final String licenseURL;

    public LicenseAgreementConfig(Properties properties) {
        licenseVersion = getIntProperty("licenseVersion", properties, 1);
        licenseURL = getStringProperty("licenseURL", properties, "");
    }

    public void validateExpirationLimit(int expirationLimitSec) {

    }
}
