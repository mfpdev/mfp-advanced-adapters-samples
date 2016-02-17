package com.ibm.mfp.adapters.spring.integration.internal;

import org.springframework.beans.factory.config.CustomScopeConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestScope;

/**
 * Created by yotamm on 17/02/16.
 */
@Configuration
public class RequestScopeConfig {

    @Bean
    public CustomScopeConfigurer customScopeConfigurer(){
        CustomScopeConfigurer customScopeConfigurer = new CustomScopeConfigurer();
        customScopeConfigurer.addScope("request", new RequestScope());
        return customScopeConfigurer;
    }
}
