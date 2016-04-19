/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

package net.mfpdev.ltpa.sample.hello;

import com.ibm.mfp.adapter.api.MFPJAXRSApplication;

import java.util.logging.Logger;

public class HelloLTPAUserApplication extends MFPJAXRSApplication{

	private static Logger logger = Logger.getLogger(HelloLTPAUserApplication.class.getName());

	protected void init() throws Exception {
		logger.info("Adapter initialized!");
	}

	protected void destroy() throws Exception {
		logger.info("Adapter destroyed!");
	}

	protected String getPackageToScan() {
		return getClass().getPackage().getName();
	}
}
