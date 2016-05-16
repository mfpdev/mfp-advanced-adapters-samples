# Spring framework integration for MobileFirst adapters

Often when developing more advanced Java adapters (and JAX-RS services in general)
The need for writing more modular, testable and decoupled code is raising.

Leveraging dependency injection design pattern can be very helpful in those cases.
There are many dependency injection framework out there, however, we decided to
experiment with Spring integration in Java adapters. The reason we chose Spring
was that it is well known and mature DI framework and also it provides much more
than DI.

In the following tutorial we will explain how to integrate Spring into a MobileFirst Java adapter by using this module.

## Prerequisits

Make sure maven is installed

Build and install the **mfp-adapters-spring-integration** module in your local/company maven repository:

in the root folder of **mfp-adapters-spring-integration** type:
```
mvn install
```

## Creating a Spring based Java adapter

Start by creating a regular MobileFirst adapter:
```
mvn archetype:generate -DarchetypeGroupId=com.ibm.mfp -DarchetypeArtifactId=adapter-maven-archetype-java -DarchetypeVersion=8.0.0 -DgroupId=com.sample -DartifactId=my-spring-xml-adapter -Dpackage=com.sample
```

The following file structure is created by executing the above command:
```
├── pom.xml
└── src
    └── main
        ├── adapter-resources
        │   └── adapter.xml
        └── java
            └── com
                └── sample
                    ├── MySpringXmlAdapterApplication.java
                    └── MySpringXmlAdapterResource.java
```
Remove the file **MySpringXmlAdapterApplication.java**:

```
rm src/main/java/com/sample/MySpringXmlAdapterApplication.java
```

Edit the **pom.xml** file and add the following dependency:
```xml
<dependency>
  <groupId>com.github.mfpdev</groupId>
  <artifactId>mfp-adapters-spring-integration</artifactId>
  <version>1.0.0-SNAPSHOT</version>
</dependency>
```

Edit the **adapter.xml** file ( **src/main/adapter-resources/adapter.xml** ), set the JAXRSApplicationClass element to be:
```xml
<JAXRSApplicationClass>com.github.mfpdev.adapters.spring.integration.SpringXMLApplication</JAXRSApplicationClass>
```

Create the folder **src/main/resources**

Create the file **src/main/resources/applicationContext.xml** with the following content:

```xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">


    <!-- Define your beans -->


    <!-- Define the list of JAX-RS resources to use: -->
    <bean class="com.github.mfpdev.adapters.spring.integration.JAXRSResourcesRegistryImpl">
        <property name="resources">
            <list>
                <bean class="com.sample.MySpringXmlAdapterResource"/>
            </list>
        </property>
    </bean>

</beans>
```
As you can see, you can use JAXRSResourcesRegistryImpl to specify list of JAX-RS resources (and providers) to be used in your adapter.
In this case we took the resource we already have in the adapter (com.sample.MySpringXmlAdapterResource) and defined it as a spring bean
in the list of resources.

At this point, the adapter should be ready to run and it should behave exactly the same as the blank new Java adapter
we created in the first step. You can go on build and deploy the adapter to see that it is working normally.

###The benefits of using Spring in our adapter
Now, let's see what are the benefits of this spring integration.

####Loose coupling is now possible thanks to dependency injection
Perhaps you would like to architect the adapter in such a way that you separate the JAX-RS resources from the business logic.
The resource gets the request and handles the path/content type mapping, but the service that actually does the work is another
object.

This architecture gives you the flexibility to have a loose dependency between the JAX-RS resource and that service.
The JAX-RS resource will know the service only by it's interface, the actual implementation will be resolved at runtime.
And here is where spring comes into the picture.

Let's define our simple "hello" service as a Java interface in our adapter:
Create a file named: **HelloService.java** in folder: **src/main/java/com/sample**
```java
package com.sample;

public interface HelloService {
    String getMessage();
}
```

Now, let's create the implementation:
Create the folder: **src/main/java/com/sample/impl**
Create a file named: **HelloServiceImpl.java** in folder: **src/main/java/com/sample/impl**
```java
package com.sample.impl;

import com.sample.HelloService;

public class HelloServiceImpl implements HelloService{
    @Override
    public String getMessage() {
        return "hello!!!";
    }
}
```

Add the hello service implementation to the **applicationContext.xml** file:
```xml
...
    <!-- Define your beans -->

    <bean class="com.sample.impl.HelloServiceImpl"/>
...
```

In order to use the new service in the adapter, we can go to our resource file: **MySpringXmlAdapterResource.java** and add the following code:

```java
@Autowired
HelloService helloService;

@Path("/hello")
@GET
@OAuthSecurity(enabled = false)
public String sayHello(){
    return helloService.getMessage();
}
```

To test the new service:
Build & deploy the adapter:
```
mvn clean install adapter:deploy
```
Call the new service:
```
curl -X GET --header "Accept: */*" "http://localhost:9080/mfp/api/adapters/mySpringXmlAdapter/resource/hello"
```
The result should be:
```
hello!!!
```
Important to notice that the resource class (MySpringXmlAdapterResource.java) knows the service only by the interface. We decided which implementation to use
in the applicationContext.xml file. Now we can seamlessly replace implementations of hello service without affecting the
resources classes code.

####Integration with MobileFirst server side configuration API
Another benefit of using this Spring integration module is that it seamlessly integrates MobileFirst adapter configuration feature
with Spring's properties mechanism

In the following example we will show how to make the hello service configurable by externalising the message it returns.

First, define the new property in the **adapter.xml** file:
```xml
...
<JAXRSApplicationClass>com.github.mfpdev.adapters.spring.integration.SpringXMLApplication</JAXRSApplicationClass>

<property name="helloServiceMessage"
          displayName="Hello message"
          defaultValue="hello!!!"
          type="string"
          description="The message returned by hello service"/>
...
```

Another step is to make **HelloServiceImpl.java** accept message as a property:
```java
public class HelloServiceImpl implements HelloService{

    private String message;

    public void setMessage(String message){
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
```

The final step is to inject the value of the adapter property **helloServiceMessage** into the HelloServiceImpl bean.
This is done from the **applicationContext.xml** file:
```xml
...
<!-- Define your beans -->

<bean class="com.sample.impl.HelloServiceImpl">
    <property name="message" value="${helloServiceMessage}"/>
</bean>
...
```

To test the new behaviour we should rebuild and deploy the adapter:
```
mvn clean install adapter:deploy
```
Call the hello service:
```
curl -X GET --header "Accept: */*" "http://localhost:9080/mfp/api/adapters/mySpringXmlAdapter/resource/hello"
```
The result should be:
```
hello!!!
```
because it is using the default value defined in the adapter.xml

To change the value to something else, open the MobileFirst console (http://localhost:9080/mfpconsole)
Click on "mySpringXmlAdapter" on the left sidebar
Then in the Configurations tab, change the value of "Hello message" field to "xxx" and click "Save"

Now try again:
```
curl -X GET --header "Accept: */*" "http://localhost:9080/mfp/api/adapters/mySpringXmlAdapter/resource/hello"
```
The result should be:
```
xxx
```

Complete sample for this tutorial can be found here: [Sample code for this tutorial](../samples/my-spring-xml-adapter)

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