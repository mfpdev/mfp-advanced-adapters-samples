# MobileFirst 8.0.0 advanced samples and extension modules

This repository contains advanced sample materials and integration modules
that can be used with MobileFirst foundation platform

##List of content

### Integration modules:
Integration modules are Java libraries (not adapters) that will make it easier to integrate your adapter with
other 3rd parties without the need to copy and paste the same code into many adapters

* [Spring integration in MobileFirst adapters](mfp-adapters-spring-integration)

### Samples
Samples are advanced examples for Java adapters which are using various of 3rd party libraries to connect to various systems
and databases

* [Basic example for Spring integration in adapter](samples/my-spring-xml-adapter)
* [Implementing a Weather API using WebServices (WS-* and REST)](samples/mfp-api-weather-sample)
* [Using twilio, sql and Spring in adapter](samples/mfp-api-twilio-sql-spring-sample)
* [Using Redis in adapter](samples/mfp-api-redis-usage-sample)
* [Using OKHTTP for connecting to back-end services from adapter](samples/mfp-api-geocoding-http-sample)

### Custom security checks
Custom security checks are adapters which contains security checks that can be configured via the MobileFirst console
and then used by MobileFirst apps and adapters.

* [Using Google Authenticator with IBM MobileFirst Platform security framework](custom-security-checks/google-otp)
* [SMS One-Time Password](custom-security-checks/sms-otp)
* [Social Login security check](custom-security-checks/social-login)