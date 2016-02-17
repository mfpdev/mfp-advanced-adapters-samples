package com.ibm.mfp.adapters.spring.integration;

import java.util.List;

public class JAXRSResourcesRegistryImpl implements JAXRSResourcesRegistry {
    private List<Object> resources;

    public void setResources(List<Object> resources){
        this.resources = resources;
    }

    @Override
    public Object[] getResources() {
        return resources.toArray();
    }
}
