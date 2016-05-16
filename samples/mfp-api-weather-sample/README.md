IBM MobileFirst Platform Foundation
===

## Implementing a Weather API by Mashing Up WebServices (WS-* and REST)

A server side Adapter API that uses the Google geocoding API
(https://developers.google.com/maps/documentation/geocoding/intro#Geocoding) and the Cdyne Web Service to provide the
temperature for a given address. The API takes an address provided by the caller, use it to call into the geocoding API
and than uses returned zip code to call into the Cdyne service and get the temperature.

### What will you be learning?

Calling a legacy WSDL defined SOAP service via an adapter using the JAX-WS standard, including embedding the WSDL based
code generation inside the MAVEN build.

## Implementation
The Adapter API is composed of:

1. A **JAX-RS** resource class that implement the REST access points into the server (visible to the mobile application)
2. An **Application** Object that handles initialization and parameter validation. The **Application** Object is
   invisible to the calling client apps

The Adapter REST API uses Google Geocoding Service to take the incoming address and find its zip code. To call the
goecoding service the adapter uses the [Google Maps Services SDK](https://github.com/googlemaps/google-maps-services-java)
that is provided by Goole. The SDK object is instantiated each request using the configured Google API key.

Once the adapter obtains the zip code is calls into the Cdyne Web Service to get the temperature in the area of the zip
code and return it.

The API uses **maven** to build and deploy the API.


### cdyne

[Cdyne](http://wsf.cdyne.com/WeatherWS/Weather.asmx) is a SOAP based Web Service. Many SOAP based services can have a
rather complex, XML based payloads and URL patterns. Those payloads and URLs ()the interfaces to the Cdyne service) are
described using a WSDL file.

### Configuration

The Adapter has a single configuration parameter that denote the API Key to be used with the Geocoding service. To learn
more about initializing and configuring an adapter, take a look at the **mfp-api-geocoding-http-sample** sample.

## Build and Setup

### Prerequisites
* A valid API key that allows the adapter to call into the geolocation service

### Build and install
* build the adapter application using maven:
    * From a **Command-line**, navigate to the **mfp-api-weather-sample** project's root folder
    * Build the API using maven by executing `mvn clean install`
* Deploy the built adapter into your MobileFirst server by running `mvn adapter:deploy` (assure that your MobileFirst
  server connection parameters are updated in the **pom.xml** file)
* Log into the MobileFirst console and update the Adapter configuration parameters
    * Set the value for the apiKey to the one obtained from Google
* You are done

### Building the Web Service Classes

The Java standard for WebServices call is JAX-WS. In JAX-WS WSDL described WebServices are called using generated
proxies that marshal the parameters in SOAP and call the remove Web Service. The proxies can be built from the command
line using the tool **wsimport**. Since we are using the WSDL described service, building the Adapter requires building the JAX-WS proxy that call into
cdyne. This way the JAX-WS proxy is generated from the cdyne WSDL file and provides Java classes that our REST API code
use to call into the Web Service.

MAVEN supports building of the JAX-WS proxy using the JAX-WS maven plugin that wrapper the **wsimport** tool. The below
pom.xml fragment shows how the plugin can be used from within a MAVEN build.

```XML
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>jaxws-maven-plugin</artifactId>
    <version>2.4.1</version>
    <executions>
        <execution>
            <goals>
                <goal>wsimport</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <packageName>com.github.mfpdev.weather.sample.api.ws</packageName>
        <vmArgs>
            <vmArg>-Djavax.xml.accessExternalSchema=all</vmArg>
        </vmArgs>
        <wsdlUrls>
            <wsdlUrl>http://wsf.cdyne.com/WeatherWS/Weather.asmx?WSDL</wsdlUrl>
        </wsdlUrls>
        <verbose>true</verbose>
    </configuration>
</plugin>
```

When this plugin is added into the project's pom.xml it provides a code generation goal that executes **wsimport** using
the arguments defined in the `<configuration>` section and places the generated proxy classes in the project's
`target/generated-sources` directory. Code generation is taking place prior to compiling the sources, so the proxy
classes are available during the compilation.

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