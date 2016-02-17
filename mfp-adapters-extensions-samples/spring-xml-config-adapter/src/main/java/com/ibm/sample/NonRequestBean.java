package com.ibm.sample;

import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by yotamm on 17/02/16.
 */
public class NonRequestBean {
    @Autowired
    private IReqBean reqBean;

    public String getMessage(){
        return  reqBean.getMessage();
    }
}
