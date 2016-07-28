## Introduction

Many mobile applications require users to sign a license agreement before they can use the application. They have to first accept the terms & conditions, and then they can proceed. In case  the license agreement changes, they are required to sign it again.

This repository contains a License Agreement security check with a sample application that demonstrates it's use.

Full description about the implementation and use of this security check can be found in this [blog post](https://mobilefirstplatform.ibmcloud.com/blog/2016/07/24/implementing-license-agreement-signature-using-mobilefirst-foundation-v8/).

## Build and Setup

* Build the security check adapter using maven:
    * From a **Command-line**, navigate to the **LicenseAgreementSecurityCheck** project's root folder
    * Build using maven by executing `mvn clean install`
* Deploy the built adapter into your MobileFirst server by running `mvn adapter:deploy` (assure that your MobileFirst
  server connection parameters are updated in the **pom.xml** file)
* Log into the MobileFirst console and update the configuration parameters of the security checks.
* You are done.

## Supported Levels
IBM MobileFirst Foundation 8.0

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
