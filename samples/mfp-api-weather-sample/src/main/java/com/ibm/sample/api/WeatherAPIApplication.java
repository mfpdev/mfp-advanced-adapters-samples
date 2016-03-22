/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

package com.ibm.sample.api;

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
