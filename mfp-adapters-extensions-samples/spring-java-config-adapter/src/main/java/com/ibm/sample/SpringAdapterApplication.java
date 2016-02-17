/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

package com.ibm.sample;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapters.spring.integration.SpringBaseApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import javax.ws.rs.core.Context;
import java.util.logging.Logger;

@Configuration
@Import(OtherConfig.class)
public class SpringAdapterApplication extends SpringBaseApplication {

	static Logger logger = Logger.getLogger(SpringAdapterApplication.class.getName());


	@Bean
	public SpringAdapterResource getResource(ConfigurationAPI configurationAPI1){
		return new SpringAdapterResource();
	}

	@Context
	ConfigurationAPI configurationAPI;


	@Override
	protected Class<?> getConfigurationClass() {
		if (configurationAPI == null){
			throw new RuntimeException("NULLLLLL");
		}
		return OtherConfig.class;
	}
}
