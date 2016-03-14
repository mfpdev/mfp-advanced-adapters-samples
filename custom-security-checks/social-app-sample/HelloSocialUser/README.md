IBM MobileFirst Platform Foundation
===

## Using HelloSocialUser Adapter 
This is sample adapter to demonstrate the social login security check.  The adapter has one REST API /hello which protected with scope named socialLogin.  

## Implementation
The implementation consists of two components:

### HelloSocialUserResource
JAX-RS class which has one API /hello that return hello + the logged in social user.

### HelloSocialUserResource
Then JAX-RS application class 

## Build and Setup

### Prerequisites
* A local installation of maven (JDK 1.7 or 1.8)
* Installed [Google Authenticator](https://www.wikiwand.com/en/Google_Authenticator) App

### Build and install
* build the adapter application using maven:
    * From a **Command-line**, navigate to the **google-otp** project's root folder
    * Build the API using maven by executing `mvn clean install`
* Deploy the built adapter into your MobileFirst server by running `mvn adapter:deploy` (assure that your MobileFirst
  server connection parameters are updated in the **pom.xml** file)
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