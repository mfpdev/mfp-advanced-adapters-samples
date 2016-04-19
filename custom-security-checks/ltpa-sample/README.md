IBM MobileFirst Platform Foundation
===
## LTPA SSO Based Sample
A sample application demonstrating use of the [LTPA SSO](https://www.wikiwand.com/en/IBM_Lightweight_Third-Party_Authentication) based Security Check to protect an [IBM MobileFirst Platform](http://www-03.ibm.com/software/products/en/mobilefirstplatform) resource adapter.  This will allow your application to call a user repository on the liberty server like [LDAP](https://www.wikiwand.com/en/Lightweight_Directory_Access_Protocol).

This sample contains 4 components:
1. [The LTPA SSO Based Security Check](/ltpa-based-sso) - This security check validates that the incoming request contains a valid LTPA2 cookie, and extracts the user from it.
2. [The Resource Adapter](/HelloLTPAUserResourceAdapter) - This is the resource adapter which is protected by the LTPA SSO Based Security Check.
3. [The WAR project](/plain-war) - This is the WAR project which has the protected resources by Liberty / WebSphere.
4. [The Sample Swift Application](/LTPABasedSSOSample) - This sample calls the resource adapter and displays an alert with "Hello {User}" after a successful authentication.

### Prerequisites
1. Understanding the IBM MobileFirst Platform [Authentication and Security](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/authentication-and-security/).
2. Understanding the IBM MobileFirst Platform [Java Adapters](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/adapters/java-adapters/)
3. Pre installed IBM MobileFirst Platform [development environment](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/setting-up-your-development-environment/)

### Usage
- Deploy the security check and the resource adapter:  
  - From a terminal window, navigate to the *ltpa-based-sso* project's root folder and run the commands:  
  ```
  mfpdev adapter build
  mfpdev adapter deploy
  ```
  - Navigate to *HelloLTPAUserResourceAdapter* and run agains the above commands.  

  - Your adapters is now deployed.

- Configure the The LTPA SSO Based Security Check:
  - From a terminal window run the following command:  

  ```
    mfpdev server console
  ```

  - Navigate to the *Security checks* tab and configure the login URL, which will point to your deployed WAR url (/plain-war) in case you are using *BASIC* authentication method or to the login action(/plain-war/j_security_check) in case you are using *FORM* authentication method.


  ![Security Check Configuration](/images/SecurityCheckConfig.png)

- install and deploy the war file:
  - From a terminal window, navigate to the *plain-war* project's root folder and run the commands:
  ```
    mvn install
  ```
  - From target folder copy the created WAR file *plain-war.war* into your running liberty server (you can use IBM MobileFirst Platform server for this purpose) and map it in the server.xml. For instance if you copy *plain-war.war* file into mfp-server in your server, then your server.xml you will need to add this mapping:   
  ```xml
    <server>
    .
    .
    .
    <application id="plain-war"
                 name="plain-war" location="${wlp.install.dir}/plain-war.war"
                 type="war">
        <application-bnd>
            <security-role name="AllAuthenticated">
                <special-subject type="ALL_AUTHENTICATED_USERS" />
            </security-role>
        </application-bnd>
    </application>
    .
    .
    .
    </server>
  ```

- Build and run the sample Swift app:
  - From a terminal window, navigate to Swift App XCode Project the *LTPABasedSSOSample* run the [COCOAPODS](https://cocoapods.org/) command:  
  ```
    pod install
  ```
  - After install done you can open the workspace project by typing in terminal window:
  ```
    open LTPABasedSSOSample.xcworkspace
  ```
  - Run the application


### Supported Levels
IBM MobileFirst Platform Foundation 8.0

### License
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
