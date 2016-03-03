package com.ibm.sample;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created by yotamm on 17/02/16.
 */
@Configuration
public class OtherConfig {
    @Bean
    public BestBean getBest(){
        return new BestBean();
    }

    @Bean
    public SpringAdapterResource getResource(){
        return new SpringAdapterResource();
    }
}
