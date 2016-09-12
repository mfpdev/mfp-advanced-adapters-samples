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
package com.github.mfpdev.adapters.spring.integration;

import com.github.mfpdev.adapters.spring.integration.internal.PropertiesConfig;
import com.github.mfpdev.adapters.spring.integration.internal.RequestScopeConfig;
import com.github.mfpdev.adapters.spring.integration.internal.SpringRequestFinishListener;
import com.github.mfpdev.adapters.spring.integration.internal.SpringRequestStartListener;
import com.ibm.mfp.adapter.api.ConfigurationAPI;

import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import javax.ws.rs.Path;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Context;
import javax.ws.rs.ext.Provider;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class SpringBaseApplication extends Application {

    @Context
    public ConfigurationAPI configurationAPI;

    AnnotationConfigApplicationContext appContext = null;

    ApplicationContext getOrCreateApplicationContext(){
        if (appContext != null){
            return appContext;
        }

        DefaultListableBeanFactory defaultListableBeanFactory = new DefaultListableBeanFactory();
        defaultListableBeanFactory.registerSingleton("mfp_configurationAPI", configurationAPI);
        appContext = new AnnotationConfigApplicationContext(defaultListableBeanFactory);
        appContext.register(RequestScopeConfig.class);
        appContext.register(PropertiesConfig.class);
        appContext.register(getConfigurationClass());
        appContext.refresh();
        return appContext;
    }

    protected Class<?> getConfigurationClass() {
        return this.getClass();
    }


    @Override
    public Set<Object> getSingletons() {
        Set<Object> singletones = new HashSet<Object>();
        ApplicationContext ctx = getOrCreateApplicationContext();
        Map<String, JAXRSResourcesRegistry> registries = ctx.getBeansOfType(JAXRSResourcesRegistry.class);
        if (registries.size() == 0){
            Map<String, Object> resourceBeans = ctx.getBeansWithAnnotation(Path.class);
            singletones.addAll(resourceBeans.values());
            Map<String, Object> providerBeans = ctx.getBeansWithAnnotation(Provider.class);
            singletones.addAll(providerBeans.values());
        }else{
            for (JAXRSResourcesRegistry registry : registries.values()){
                singletones.addAll(Arrays.asList(registry.getResources()));
            }
        }

        singletones.add(new SpringRequestStartListener());
        singletones.add(new SpringRequestFinishListener());
        return singletones;
    }

    public void destroy() {
        if (appContext != null) {
            appContext.close();
        }
    }
}
