package com.ibm.mfp.adapters.spring.integration.internal;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

import java.util.Properties;

/**
 * Created by yotamm on 03/03/16.
 */
@Configuration
public class PropertiesConfig {

    @Bean
    public static PropertySourcesPlaceholderConfigurer properties(ConfigurationAPI configurationAPI) {
        PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer = new PropertySourcesPlaceholderConfigurer();
        Properties properties = new Properties();
        for (String property : configurationAPI.getPropertyNames()){
            properties.put(property, configurationAPI.getPropertyValue(property));
        }
        propertySourcesPlaceholderConfigurer.setProperties(properties);
        return propertySourcesPlaceholderConfigurer;
    }
}
