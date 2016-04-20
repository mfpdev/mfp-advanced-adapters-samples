IBM MobileFirst Platform Foundation
===

## User login and pin code
This is a simple example of "enrolment" behaviour. 
On the first run the application requires the user to login with her username and password and set the pin code.
 On following runs the application requires the user only to enter the pin code. 

## Implementation
The implementation includes twi security checks:

* **UserLoginSecurityCheck** is in fact a mockup. It compares the username and password strings submitted by the user, and 
  succeeds if they are equal.
* **PinCodeSecurityCheck** maintains the registered pin code as a protected attribute in the Registration context.
  * If the pin code exists, the security check compares it with the value submitted by the user. 
    If the submitted value is correct, the security check sets the user from the **UserLoginSecurityCheck** as the active user.
  * If the pin code does not exist yet, the security check makes sure the **UserLoginSecurityCheck** is logged in, 
    and sends a challenge prompting the user to set the pin code.
    When the user submits the pin code, the security check reports success.


## Build and Setup

* build the adapter application using maven:
    * From a **Command-line**, navigate to the **user-login-and-pincode** project's root folder
    * Build the API using maven by executing `mvn clean install`
* Deploy the built adapter into your MobileFirst server by running `mvn adapter:deploy` (assure that your MobileFirst
  server connection parameters are updated in the **pom.xml** file)
* Log into the MobileFirst console and update the configuration parameters of the security checks.
  Note that the login duration of the **UserLoginSecurityCheck** is intentionally short, because it represents strong credentials, 
  and is used only to set the pin code. 
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
 No newline at end of file
