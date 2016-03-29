IBM MobileFirst Platform Foundation
===

## Using Google Authenticator with IBM MobileFirst Platform security framework
[Google Authenticator](https://www.wikiwand.com/en/Google_Authenticator) is a popular mobile application implementing the client side of [time based one-time password](https://www.wikiwand.com/en/Time-based_One-time_Password_Algorithm).

This sample provides the server-side implementation of one-time password security check, allowing seamless integration of Google Authenticator into
IBM MobileFirst Platform security framework.

## Implementation
The implementation consists of two components:

* REST interface for generating a shared secret, and exposing it as a QR code.
* MobileFirst security check called `googleOTP` that validates one-time passwords based on the shared secret.

A typical flow includes the following steps:

* One-Time password setup 

    1. Your Mobile app generates a shared secret by calling the /setupGoogleOTP REST API.
      This API is protected with user authentication security check, so that the generated secret can be associated with a specific user.
    2. The user types the QR code URL in her browser so that it could be scanned by Google Authenticator app
      This URL does not include any unique ID of the user or device.
      Instead this URL is protected by basic authentication, so that the user gets her recently generated QR code.
    3. The user scans the QR code with Google Authenticator App, which completes the set up.

* One-Time password usage 

    1. When your mobile application tries to access a resource protected by the `googleOTP` security check, it prompts the user to enter a one-time password.
    2. The user switches to the Google Authenticator app, and submits the generated one-time password into your application.
    3. The security check validates the one-time password.  

### GoogleOTPResource
This class implements the REST API for generation and getting the shared secret.
It uses JAX-RS, Swagger, and MobileFirst security annotations.

### UserLoginSecurityCheck
A simple implementation of user login. Compares the username and password submitted by the client.
This security check is used by GoogleOTPResource to protect the REST API.
Note that any other username/password login security check can be used instead. 

### GoogleOTPSecurityCheck
Implements the security check validating one-time password on top of the [wstrange/GoogleAuth](https://github.com/wstrange/GoogleAuth) open source project.

## Build and Setup

### Prerequisites
* A local installation of maven (JDK 1.7 or 1.8)
* Installed [Google Authenticator](https://www.wikiwand.com/en/Google_Authenticator) App

### Build and install
* build the adapter application using maven:
    * From a **Command-line**, navigate to the **google-otp** project's root folder.
    * Build the API using maven by executing `mvn clean install`
* Deploy the built adapter into your MobileFirst server by running `mvn adapter:deploy` (assure that your MobileFirst
  server connection parameters are updated in the **pom.xml** file)
* Log into the MobileFirst console and update the Adapter configuration parameters
    * `qrCodeOrgName`, The organization name that will appear in the [Google Authenticator](https://www.wikiwand.com/en/Google_Authenticator) app after scan the QR code.
    * `qrCodeEmail`, The email that will appear in the [Google Authenticator](https://www.wikiwand.com/en/Google_Authenticator) app after scan the QR code.
    * `successStateExpirationSec`, let you configure the time until the token created with Google OTP will be expired.
* You are done.

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