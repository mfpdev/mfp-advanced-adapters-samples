# MobileFirst 8.0.0 advanced samples and extension modules

This repository contains advanced sample materials and integration modules
that can be used with MobileFirst foundation platform

Blog Post

##List of content

### Integration modules:
Integration modules are Java libraries (not adapters) that will make it easier to integrate your adapter with
other 3rd parties without the need to copy and paste the same code into many adapters

* [Spring integration in MobileFirst adapters](mfp-adapters-spring-integration)

### Adapters (REST APIs) Samples
Samples are advanced examples for Java adapters which are using various of 3rd party libraries to connect to various systems
and databases

* [Basic example for Spring integration in adapter](samples/my-spring-xml-adapter)
* [Implementing a Weather API using WebServices (WS-* and REST)](samples/mfp-api-weather-sample)
* [Using twilio, sql and Spring in adapter](samples/mfp-api-twilio-sql-spring-sample)
* [Using Redis in adapter](samples/mfp-api-redis-usage-sample)
* [Using OKHTTP for connecting to back-end services from adapter](samples/mfp-api-geocoding-http-sample)

### Custom security checks samples
Custom security checks samples are adapters which contains security checks that can be configured via the MobileFirst console
and then used by MobileFirst apps and adapters.

* [Using Google Authenticator with IBM MobileFirst Platform security framework](custom-security-checks/google-otp)
* [SMS One-Time Password](custom-security-checks/sms-otp)
* [Social Login security check](custom-security-checks/social-login)

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
