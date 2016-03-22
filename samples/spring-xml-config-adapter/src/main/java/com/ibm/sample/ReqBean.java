package com.ibm.sample;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.PreDestroy;
import java.util.logging.Logger;

/**
 * Created by yotamm on 17/02/16.
 */
public class ReqBean implements IReqBean {

    static Logger logger = Logger.getLogger(SpringAdapterResource.class.getName());

    @Autowired
    ConfigurationAPI configurationAPI;

    private double randomNumber = Math.random()*1000.0;
    public ReqBean(){

    }

    @Override
    public String getMessage() {
        return "Hidi From request bean: "+randomNumber;
    }

    @PreDestroy
    public void destroy(){
        logger.warning("destroy req bean: "+randomNumber);
    }
}
