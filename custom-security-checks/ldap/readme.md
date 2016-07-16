IBM MobileFirst Foundation
==========================
### LDAP Security Check
A Maven project containing [LDAP](https://www.wikiwand.com/en/Lightweight_Directory_Access_Protocol) Security Check which lets you validates your user against any LDAP server.

## Prerequisites
1. Understanding the IBM MobileFirst Platform [Authentication and Security](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/authentication-and-security/).
2. Understanding the IBM MobileFirst Platform [Java Adapters](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/adapters/java-adapters/).
3. Pre-installed IBM MobileFirst Platform [development environment](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/setting-up-your-development-environment/).

### Build & Deploy
* Use either Maven or MobileFirst Developer CLI to [build and deploy adapters](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/adapters/creating-adapters/).

## Configuration
* Configure the following to be able works with yours LDAP server in [adapter.xml](./src/main/adapter-resources/adapter.xml) or in [console](http://localhost:9080/mfpconsole):
  1. **ldapUserAttribute** - The LDAP attribute for username. e.g: **uid**
  2. **ldapNameAttribute** - The LDAP attribute for display name. e.g: **cn**
  3. **ldapURL** - The LDAP Server URL. This URL include the protocol and the port (if different from the default 389). e.g: **ldap://localhost:10389**
  4. **userFilter** - The LDAP user filter, use %v as placeholder for user. e.g: **(&(uid=%v))**
  5. **bindDN** - The LDAP bind DN (- for none). e.g: **uid=admin,ou=system**
  6. **bindPassword** - The LDAP bind password (- for none). e.g: **secret**

## Run & Test
* To be able to test that the security check is configured properly, you need LDAP server and a mobile application with MobileFirst Foundation SDK:
  1. If you don't have your own LDAP server you have the following options:
      * Install and configure local LDAP server like [Apache Directory](http://directory.apache.org/studio/downloads.html), This is quite straightforward, and explained [here](http://www.stefan-seelmann.de/blog/setting-up-an-ldap-server-for-your-development-environment).
      * Use public Online LDAP Test server, as an example see one in the following [link.](http://www.forumsys.com/en/tutorials/integration-how-to/ldap/online-ldap-test-server/)

  2. For test it with one of MobileFirst Foundation SDKs follow this [link.](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/authentication-and-security/user-authentication/)  You can use one of the User Login samples as is.

### Supported Levels
IBM MobileFirst Foundation 8.0

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
