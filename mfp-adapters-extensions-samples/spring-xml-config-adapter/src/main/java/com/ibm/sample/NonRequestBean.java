package com.ibm.sample;

import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by yotamm on 17/02/16.
 */
public class NonRequestBean {
    private String myProp;

    @Autowired
    private IReqBean reqBean;

    public String getMessage(){
        return  reqBean.getMessage();
    }

    public String getMyProp() {
        return myProp;
    }

    public void setMyProp(String myProp) {
        System.out.println("My Prop set to: "+myProp);
        this.myProp = myProp;
    }
}
