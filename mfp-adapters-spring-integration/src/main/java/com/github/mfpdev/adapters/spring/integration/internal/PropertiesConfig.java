/**
 *    © Copyright 2016 IBM Corp.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package com.github.mfpdev.adapters.spring.integration.internal;

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
