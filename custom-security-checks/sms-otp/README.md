IBM MobileFirst Platform Foundation
===
SMS One-Time Password is a commonly used security pattern.  This sample adapter shows how to integrate such a pattern to your IBM MobileFirst Foundation server. Using the [Twilio](https://www.twilio.com) service.

## SMSOTPResource
A JAX-RS class that implements the REST API for provisioning the phone number. The REST call to register the phone number is protected with MobileFirst default scope.

## SMSOTPSecurityCheck
A security check class that validates SMS code as One-Time Password.  

## Implementation
The API is composed of:

1. A **JAX-RS** resource class that implements a REST access points into the server
2. A **Twilio** Access Object that handles all access to the [Twilio](https://www.twilio.com) backend using the [Twilio](https://www.twilio.com) Java SDK (that wraps the
   Twilio REST APIs)

The [Twilio](https://www.twilio.com) access components is added with maven dependency.

### JAX-RS and Swagger Annotations
The resource class is annotated with both JAX-RS and Swagger annotations.

**JAX-RS** annotations are used to mark the REST interfaces and marshal objects in and out of the REST interfaces. The
MobileFirst server uses those annotations to provide a custom Swagger test UI and meta data. The use of JAX-RS is
mandatory.

**Swagger** annotations are used to complete and improve the custom swagger test UI with more notes, description text
and type information. In general, the use of Swagger annotations to augment the swagger metadata is highly recommended,
but not mandatory.

## Maven
* The adapter is a [maven](https://maven.apache.org/) project.  It's easy to add dependencies:  
e.g.: to add [Twilio Java SDK](https://www.twilio.com) all is needed - add those lines to dependencies node in [pom.xml](pom.xml):
```
<dependency>
	        <groupId>com.twilio.sdk</groupId>
	        <artifactId>twilio-java-sdk</artifactId>
            <version>6.3.0</version>
</dependency>
```


## Build and Setup

### Prerequisites
* A configured account (can be evaluation account) on [Twilio](https://www.twilio.com) with a configured SMS capable phone number.
* A local installation of maven (JDK 1.7 or 1.8)

### Build and install
* build the adapter application using maven:
    * From a **Command-line**, navigate to the **sms-otp** project's root folder
    * Build the API using maven by executing `mvn clean install`
* Deploy the built adapter into your MobileFirst server by running `mvn adapter:deploy` (assure that your MobileFirst
  server connection parameters are updated in the **pom.xml** file)
* Log into the MobileFirst console and update the Adapter configuration parameters
    * `twilioAccountSid`, `twilioAuthToken` and `twilioFromPhoneNumber` that can be used to send SMS messages (obtained from the [Twilio](https://www.twilio.com) console)
    * `successStateExpirationSec`, expiration of the token created from smsOTP security check in seconds.
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