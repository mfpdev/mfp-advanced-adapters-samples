package com.sample.impl;

import com.sample.HelloService;

public class HelloServiceImpl implements HelloService{

    private String message;

    public void setMessage(String message){
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
