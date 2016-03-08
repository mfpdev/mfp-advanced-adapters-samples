/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/
package com.ibm.mfp.sample.rest;

import com.ibm.mfp.adapter.api.MFPJAXRSApplication;

import java.util.logging.Logger;

/**
 * The JAX-RS Application
 * <p/>
 * This is JAX-RS Application class
 * This the place to add more REST API classes like
 * GoogleOTPResource
 *
 * @author Ishai Borovoy
 * @since 06/03/206
 */

public class GoogleOTPApplication extends MFPJAXRSApplication{

    static Logger logger = Logger.getLogger(GoogleOTPApplication.class.getName());

    protected void init() throws Exception {
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

