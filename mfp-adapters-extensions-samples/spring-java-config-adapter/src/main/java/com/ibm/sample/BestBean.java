package com.ibm.sample;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapters.spring.integration.JAXRSResourcesRegistry;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.logging.Logger;

/**
 * Created by yotamm on 17/02/16.
 */
public class BestBean implements JAXRSResourcesRegistry {
    @Autowired
    SpringAdapterResource resource;


    @Autowired
    ConfigurationAPI configurationAPI;

    static Logger logger = Logger.getLogger(SpringAdapterApplication.class.getName());
    public BestBean(){
        logger.warning("BEST WAS CREATED!!!!");
    }

    @Override
    public Object[] getResources() {
        return new Object[]{resource};
    }
}
