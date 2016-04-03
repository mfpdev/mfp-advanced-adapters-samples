IBM MobileFirst Platform Foundation
===

## MFP Geocoding Adapter API Using Google Geocoding Service
A server side Adapter API that uses OKHTTP to call into the Google geocoding API
(https://developers.google.com/maps/documentation/geocoding/intro#Geocoding). The API takes an address provided by the
caller, use it to call into the geocoding API and than parse the returned JSON to return the {longitude, latitude}
pair of the provided address.

### What will you be learning?
As common with many API provides, there are easy ways to call into the Google geocoding APIs using a Java toolkit
(https://developers.google.com/maps/web-services/client-library), but we selected to use OKHTTP and call the REST
endpoint directly to demonstrate the following capabilities:
* Injecting the MFPF Adapter APIs using the `@Context` annotation. We inject both the `ConfigurationAPI` and the
  `AdaptersAPI` objects
* Use of Adapter configuration:
   * Defining the parameter meta data inside adapter.xml
   * Validating the parameters inside the Adapter Application object
   * Using the configuration to instantiate a singleton object
* Communication between the Adapter Resource and Adapter Application
   * Using the Application object as a singleton factory
   * Showing how the Application object can be obtained from the Resource object using the injected MFP `AdaptersAPI`
     and calling `adaptersAPI.getJaxRsApplication(<T>)`
* Parsing a large JSON payload using JSON Path queries
* Returning JSON information out of the REST API using a Java object and documenting it using Swagger for easy testing

As an FYI, we use the Google Geocoding Java SDK in the Weather sample.

## Implementation
The Adapter API is composed of:

1. A **JAX-RS** resource class that implement the REST access points into the server (visible to the mobile application)
2. An **Application** Object that handles initialization and parameter validation. The **Application** Object is
   invisible to the calling client apps

The Adapter API uses the [OKHTTP](http://square.github.io/okhttp/) package to call into the backend REST API. The
`OkHttpClient` object is instantiated once during initialization in the **Application** object from the Adapter's
configuration parameters.

The API uses **maven** to build and deploy the API.

### Configuration
The Adapter defined several configuration parameters as seen in the below XML fragment. There configuration parameetrs
are than exposed by the MFPF Console and allow administrators to configure the adapter

```XML
<property name="backendLogLevel"
          displayName="Backend Access Log Level"
          defaultValue="BASIC"
          type="['BASIC', 'HEADERS', 'BODY', 'NONE']"
          description="How much to log out of the HTTP traffic to the backend service"/>

<property name="requestTimeout"
          displayName="Backend Request Timeout"
          defaultValue="32"
          type="integer"
          description="Timeout (in seconds) when calling to the backend service"/>

<property name="backendURL"
          displayName="Backend URL"
          defaultValue="https://maps.googleapis.com/maps/api/geocode"
          type="string"
          description="URL of the Geolocation API"/>

<property name="apiKey"
          displayName="Google Geolocation API Key"
          defaultValue="AIzaSyDk97qAdzCombgZNt4maajNfVrgGd9NBig"
          type="string"
          description="Enter the API Key used to access the service (obtain from Google Developer Console)"/>
```

Each configuration definition includes the following information:
* Mandatory: The unique **name** for the parameter. Used to uniquely identify the parameter
* Optional: **displayName**, provides a user friendly title for the parameter
* Optional: **description**, provides help text to assist the admionistrator in setting the parameter value
* Optional: **type**, one of *integer*, *string*, *enum* and *boolean*. Allows the developer to customize
   the UI exposed by the console and perform basic validation in the console
* Optional: **defaultValue**, provides an initial value for the property

To read a configuration parameter, the developer can inject and use the MFPF *ConfigurationAPI* interface as seen in
the below code fragment:

```java
/**
 * Injected application configuration variable (injected by the MobileFirst server)
 */
@Context
ConfigurationAPI configApi;

...

// "apiKey" is the unique name of the parameter
String apiKey = configApi.getPropertyValue("apiKey");
```

### Lifecycle and Initialization
The Adapter is composed out of two main components:
1. A stateless Resource class that implements the REST APIs using JAX-RS
2. An Application class that extends **MFPJAXRSApplication**  and allows the developer to hook into the adapter's
   lifecycle and provide adapter wide initialization and destruction code

The Adapter's lifecycle is as follows:
* First, an adapter package is deployed into the server
    * The adapter is loaded, and configured using the defaults from the Adapter's deployment descriptor
    * The MobileFirst server will call the **init()** method to let the Adapter initialize
* When the **init()** method succeeds (i.e., not throw an exception), the Adapter now moves to an operational state and
  server customer requests
* If the Administrator re-configures the Adapter (e.g., via the console), a new instance of the Adapter will be
  generated
    * **init()** will be called again in the new instance
    * If the **init()** method succeeds, the previous adapter instance is moving out of service and its **destroy()**
      method will be called to allow the Adapter let go of initialized resources such as DataBase pools
    * The new Adapter instance now moves into service
* Similarly, when an updated adapter package is deployed, a new Adapter instance will be created, initialized and
  replace the previous instance

In this adapter we provide validation and initialization logic in **init()** and construct the OKHTTP client using the
configutred adapter parameters..

### JAX-RS and Swagger Annotations
The resource class is annotated with both JAX-RS and Swagger annotations (and than also some Spring anotations and
potentially also MobileFirst security annotations).

**JAX-RS** annotations are used to mark the REST interfaces and marshal objects in and out of the REST interfaces. The
MobileFirst server uses those annotations to provide a custom Swagger test UI and meta data. The use of JAX-RS is
mandatory.

**Swagger** annotations are used to complete and improve the custom swagger test UI with more notes, description text
and type information. In general, the use of Swagger annotations to augment the swagger metadata is highly recommended,
but not mandatory.

## Build and Setup

### Prerequisites
* A valid API key that allows the adapter to call into the geolocation service

### Build and install
* build the adapter application using maven:
    * From a **Command-line**, navigate to the **mfp-api-geocoding-http-sample** project's root folder
    * Build the API using maven by executing `mvn clean install`
* Deploy the built adapter into your MobileFirst server by running `mvn adapter:deploy` (assure that your MobileFirst
  server connection parameters are updated in the **pom.xml** file)
* Log into the MobileFirst console and update the Adapter configuration parameters
    * Set the value for the apiKey to the one obtained from Google
    * Optionally: customize the value of the backend URL, HTTP logging levels and request timeout
* You are done

### Supported Levels
IBM MobileFirst Platform Foundation 8.0

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