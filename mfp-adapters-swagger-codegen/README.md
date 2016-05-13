# Extending MobileFirst Java Adapters with Swagger-Codegen
MobileFirst Java Adapters serve as extension points via which you can seamlessly integrate your mobile applications to backend enterprise services / systems. 
If you have a backend functionality that you'd like to quickly expose as ReST services on the MobileFirst platform the mfp-adapters-swagger-codegen extension
will simplify this for you in a modular way that will ease maintenance of this integration.

To expose a backend function as a ReST service using MobileFirst Java Adapters, here is all that you will have to do :- 
* Specify the ReST service interface using [Open API Specification (fka Swagger Specifications)](https://github.com/OAI/OpenAPI-Specification).  
  You could use either yaml or json as the representation format for your API specifications
* Create your MobileFirst Java Adapter as a maven project and modify the generated pom.xml to include the maven swagger-codegen plugin and configure it
* Run the swagger-codegen maven plugin to generate the JAXRS service for your API specifications
* Provide the implementation for the generated Java interface for your service.  Here is where you have to code the connectivity / integration to your 
  backend system
* Add any additional dependencies you need based on your service implementation, to the pom.xml 
* Build and deploy the MobileFirst Java Adapter

 
## Specifying your service API using Open API
You could use the online [Swagger Editor](editor.swagger.io) as a convenience tool to compose you API definitions according to the Open API specs.  

## Adding the Swagger-Codegen maven plugin
After you have created the MobileFirst Java Adapter maven project, edit the pom.xml to include the following plugin fragment
```
<plugin>
    <groupId>io.swagger</groupId>
    <artifactId>swagger-codegen-maven-plugin</artifactId>
    <version>2.1.6</version>
    <configuration>
        <inputSpec>yourServiceAPI.yaml</inputSpec> 
        <language>MFPAdapter</language>
        <output>target/generated</output>
        <configurationFile>yourCodegenConfig.json</configurationFile>
    </configuration>
    <dependencies>
        <dependency>
        	<groupId>com.github.mfpdev</groupId>
        	<artifactId>mfp-adapters-swagger-codegen</artifactId>
        	<version>1.0.0-SNAPSHOT</version>
    	</dependency>
    </dependencies>
    <executions>
        <execution>
            <goals>
                <goal>generate</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```
 
### Plugin Configuration
The plugin requires the following configurations to be specified

* _inputSpec_ : This is the location of your API specification file represented either in yaml or in json 
* _language_  : This is an input to swagger-codegen.  The MobileFirst customizations are added under the name 'MFPAdapter'. 
				DO NOT change this to any other                		value
* _output_ : This is the destination directory for all the code that will be generated like the JAXRS service resources, data models, exceptions. 
* _configurationFile_ : This is the name and location of a json file that will contain your specific customizations to the codegen.  See the section on 
codegen customizations for details about this file.           

### Codegen Customizations
The plugin configurations are for specifying higher level inputs such as input and output locations some specific configurations to 'how' the code should
be generated is to be specified in a separate configuration json file.  This is the file whose location and name is specified in the plugin configuration
property named _configurationFile_ (see above).   Here is what the contents of this file should be... 

```
{
	"modelPackage" 	: <name of the Java package for the service data model classes>,
	"apiPackage" 	: <name of the Java package for the service API interfaces and classes> ,
	"additionalProperties" : {
		"serviceFactoryClassname" : <fully qualified name of the service factory class that will 
		                             implement the generated service factory interface.  
		                             You should not provide this property if you do not intend to 
		                             implement the service factory and would instead 'inject' the 
		                             service implementation by other means such as Spring 
		                             dependency injection>
		"autowiredSpringService"  : <set to "true" if you want to autowire a spring bean for the 
		                             service implementation.  You should not provide this property
		                             if you are going to use spring dependency injection to provide 
		                             the service implementation> 
	}
}
```

**NOTE :** When specifying for _apiPackage_ in the above json ensure that this package is in the resource scan list of AdapterJaxrsApplication class.  For 
example if you have generated a Java Adapter using Maven archetype and have specified a package name for the Adapter classes then use this same package 
name for  _apiPackage_.  This is because AdapterJaxrsApplication scans it's package for JAXRS resources and generating API resources in the same package
facilitates the scanning. 

### Run swagger-codegen maven plugin
Run the swagger-codegen plugin as follows .. .
```
mvn io.swagger:swagger-codegen-maven-plugin:2.1.6-SNAPSHOT:generate
```
This will generate the JAXRS service resource classes.  

### Provide Service Implementation
Complete the Adapter development by... 
* providing implementation for the service factory interface that is generated.  Note that the implementation's classname and package name should match 
whatever you had mentioned for _serviceFactoryClassname_ in the configurationFile json (see section Codegen Customizations)
* implemeting the service to connect and integrate with the backend system processing the API specified inputs and generating the API specified outputs.

### Build and deploy the Adapter
Before building the Adatper archive for deployment add the following to the pom.xml

Add the following dependency
```
<dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-annotations</artifactId>
        <version>2.7.3</version>
</dependency>
```

Add the following plugin
```
<plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>build-helper-maven-plugin</artifactId>
        <executions>
                <execution>
                        <phase>generate-sources</phase>
                        <goals><goal>add-source</goal></goals>
                        <configuration>
                                <sources>
                                        <source>target/generated</source>
                                </sources>
                        </configuration>
                </execution>
        </executions>
</plugin>
```
Now build the Adapter and deploy it on MobileFirst Server !!!

## Samples
To help you understand this mfp-adaper-swagger-codegen extension, assimilate and try all of what has been mentioned on this page there are two samples
that are provided
* _factory-customer-adapter_ sample which uses the service factory implementation approach to providing the service implementation
* _spring-customer-adapter_ sample which uses Spring dependency injection to provide implementation for the service.

## License 
Copyright 2015 IBM Corp.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the Licens

