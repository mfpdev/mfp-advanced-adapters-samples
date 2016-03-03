package com.ibm.mfp.adapters.spring.integration;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapters.spring.integration.internal.PropertiesConfig;
import com.ibm.mfp.adapters.spring.integration.internal.RequestScopeConfig;
import com.ibm.mfp.adapters.spring.integration.internal.SpringRequestFinishListener;
import com.ibm.mfp.adapters.spring.integration.internal.SpringRequestStartListener;
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
}
