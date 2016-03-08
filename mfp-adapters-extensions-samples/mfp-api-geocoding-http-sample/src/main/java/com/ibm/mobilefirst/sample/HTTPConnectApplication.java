/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

package com.ibm.mobilefirst.sample;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.MFPJAXRSApplication;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;

import javax.ws.rs.core.Context;
import java.util.logging.Logger;

/**
 * Initializes the Adapter API and hosts global objects that get used thro the various requests
 */
public class HTTPConnectApplication extends MFPJAXRSApplication {

    /**
     * The logger used by the app
     */
    static Logger logger = Logger.getLogger(HTTPConnectApplication.class.getName());

    /**
     * Injected application configuration variable (injected by the MobileFirst server)
     */
    @Context
    ConfigurationAPI configApi;

    /**
     * The OKHTTP Client that was initialized from the provided configuration data
     */
    private OkHttpClient okhttp3Client = null;

    /**
     * The API Key used to access the google geocoding service
     */
    private String apiKey = null;

    /**
     * Returns the OKHTTP Client that was initialized from the provided configuration data
     */
    public OkHttpClient getOkHttpClient() {
        return okhttp3Client;
    }

    /**
     * Returnes the API Key used to access the google geocoding service
     */
    public String getAPIKey() {
        return apiKey;
    }

    /**
     * Initializes the adapter application by allocating and Configuring an OKHTTP client.
     * <p/>
     * Init is called by the MobileFirst Server whenever an Adapter application is deployed or reconfigured. The method
     * than get the API key and the client configuration information redis URL from the adapter configuration parameters
     * validate them and allocate an OKHTTP Client
     *
     * @throws Exception if the Redis URL is invalid or the key is empty
     */
    protected void init() throws Exception {

        logger.info("Initializing a Geolocation Adapter application");

        apiKey = configApi.getPropertyValue("apiKey");

        if (null == apiKey || apiKey.trim().length() < 5) {
            // Something is wrong
            logger.severe(String.format("API Key [%s] do not make sense", apiKey));
            throw new IllegalArgumentException(String.format("API Key [%s] do not make sense", apiKey));
        }
        apiKey = apiKey.trim();

        final String logLevel = configApi.getPropertyValue("backendLogLevel");
        final String timeout = configApi.getPropertyValue("requestTimeout");
        final String backURL = configApi.getPropertyValue("backendURL");

        logger.config(String.format("Geolocation is initializing with configuration Log Level = [%s] Timeout = [%s] API Key = [%s] URL = [%s]",
                logLevel,
                timeout,
                apiKey,
                backURL));

        /*
         * Parse and validate the URL
         */
        final HttpUrl config = HttpUrl.parse(backURL);
        if (null == config) {
            logger.severe(String.format("Cannot parse a URL out of [%s]", backURL));
            throw new IllegalArgumentException("Backend URL cannot be parsed");
        }

        /*
         * Initialize the logging for OKHTTP
         */
        final HttpLoggingInterceptor logging = new HttpLoggingInterceptor(new HttpLoggingInterceptor.Logger() {
            public void log(String s) {
                System.out.println(s);
            }
        });
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        switch (logLevel) {
            case "BASIC":
                logging.setLevel(HttpLoggingInterceptor.Level.BASIC);
                break;
            case "HEADERS":
                logging.setLevel(HttpLoggingInterceptor.Level.HEADERS);
                break;
            case "NONE":
                logging.setLevel(HttpLoggingInterceptor.Level.NONE);
                break;
        }

        okhttp3Client = new okhttp3.OkHttpClient.Builder().addInterceptor(logging).build();

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
