IBM MobileFirst Platform Foundation
===

## GoogleOTPSecurityCheck
A security check class which let validates generated pass code from [Google Authenticator](https://www.wikiwand.com/en/Google_Authenticator) app against user's registered password

## UserLoginSecurityCheck
A security check class which protect on REST API with user login.  The user login scope protect both on initial setup of the QR code entry via mobile app, and on the REST API to get the QR code.

## GoogleOTPResource
A JAX-RS class that implement the REST API for setup and provisioning the Google Authenticator QR code URL.  The setup API needs to be caךled via mobile before call the QR Code URL API. 

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
* A local installation of maven (JDK 1.7 or 1.8)
* Installed Google Authenticator App

### Build and install
* build the adapter application using maven:
    * From a **Command-line**, navigate to the **google-otp** project's root folder
    * Build the API using maven by executing `mvn clean install`
* Deploy the built adapter into your MobileFirst server by running `mvn adapter:deploy` (assure that your MobileFirst
  server connection parameters are updated in the **pom.xml** file)
* Log into the MobileFirst console and update the Adapter configuration parameters
    * qrCodeOrgName, The organization name that will appear in the Google Authenticator app after scan the QR code
    * qrCodeEmail, The email that will appear in the Google Authenticator app after scan the QR code
    * successStateExpirationSec, let you configure the time until the token created with Google OTP will be expired
* You are done

### Supported Levels
IBM MobileFirst Platform Foundation 8.0

## License
Copyright 2015 IBM Corp.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.