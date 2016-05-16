/*
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
package com.github.mfpdev.weather.sample.api;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.MFPJAXRSApplication;

import javax.ws.rs.core.Context;
import java.util.logging.Logger;

/**
 * Validates the provided configuration parameter
 */
public class WeatherAPIApplication extends MFPJAXRSApplication {

    static Logger logger = Logger.getLogger(WeatherAPIApplication.class.getName());

    @Context
    ConfigurationAPI configApi;

    /**
     * Initializes the Adapter by validating the single configuration parameter
     *
     * @throws Exception if the API Key is completely missing
     */
    protected void init() throws Exception {
        logger.info("Initializing a Geolocation Adapter application");

        String apiKey = configApi.getPropertyValue("apiKey");
        apiKey = apiKey == null ? "" : apiKey.trim();

        if (apiKey.isEmpty()) {
            // Something is wrong
            logger.severe(String.format("API Key [%s] is void", apiKey));
            throw new IllegalArgumentException(String.format("API Key [%s] cannot be empty", apiKey));
        }

        logger.config(String.format("Using [%s] as API Key into the Geocoding service", apiKey));

        logger.info("Adapter initialized!");
    }


    protected void destroy() throws Exception {
        logger.info("Adapter destroyed!");
    }


    protected String getPackageToScan() {
        //The package of this class will be scanned (recursively) to find JAX-RS resources.
        //It is also possible to override "getPackagesToScan" method in order to return more than one package for scanning
        return getClass().getPackage().getName();
    }
}
