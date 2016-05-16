# MobileFirst Java Adapters with Swagger-Codegen 
## _Spring bean service implementation sample_
This is a sample that demonstrates the integration of MobileFirst Java Adatpers and mfp-adapters-swagger-codegen 
which is a customization of Swagger Codegen.   See [mfp-adapters-swagger-codegen.](https://github.com/mfpdev/mfp-advanced-adapters-samples/tree/development/mfp-adapters-swagger-codegen)
You can download this sample, build the MobileFirst Java Adapter and deploy it.

This is a simple sample that mimics a backend cusomter storage service whose API is defined adhering to Open API 
Specifications and represented in YAML.  The API supports simple CRUD operations around a Customer entity.  This 
sample injects a backend service implementation using Spring dependency injection.  The sevice implementation is a
Spring bean that uses an in-memory map of customer entities to provide the Customer CRUD functionality.  In typical 
enterprise systems the bean will encapsulate logic that connects with a backend enterprise system that stores 
customer entities and provides the CRUD operations.

Please note the following : -
* The codegen configuration file src/main/resouces/codegenConfig.json specifies the **_autowiredSpringService_** 
attribute set to **_true_**.  This is the indicator to **mfp-adapters-swagger-codegen** module to generate code that 
resolves to the backend service via Spring dependency injection
* All inputs to the swagger-codegen module is provided in the pom.xml under swagger-codegen plugin configurations
* As specified in the pom.xml the code generated from the API specs is directed to target/generated

## License
Copyright 2016 IBM Corp.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

