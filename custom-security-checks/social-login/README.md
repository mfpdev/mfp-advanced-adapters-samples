IBM MobileFirst Platform Foundation
===

## Social Login security check
This security check allows easy integration of the external login vendors like Google and Facebook.
 It accepts the token obtained by the client from the vendor, validates that token, and creates an **AuthenticatedUser** with the information provided by the token. 

## Implementation
The implementation defines the abstraction for the login vendor in the **LoginVendor** interface.
Each implementation defines its configuration properties, and implements the token validation. 
Vendor implementations instances are kept in **SocialLoginConfiguration** class, and cannot maintain state other than the configuration.
 Since the token validation is a single-step process


## Build and Setup

* build the adapter application using maven:
    * From a **Command-line**, navigate to the **google-otp** project's root folder
    * Build the API using maven by executing `mvn clean install`
* Deploy the built adapter into your MobileFirst server by running `mvn adapter:deploy` (assure that your MobileFirst
  server connection parameters are updated in the **pom.xml** file)
* Log into the MobileFirst console and update the Adapter configuration parameters
    * **keepOriginalToken** - true if you want the token submitted by the client to be stored as an attribute of the authenticated user
    * **google.clientId** - OAuth 2.0 client ID for MFP server.
                            * This client ID should be obtained from the [Google Developers Console](https://console.developers.google.com/apis/credentials)
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