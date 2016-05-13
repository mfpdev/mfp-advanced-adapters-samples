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
