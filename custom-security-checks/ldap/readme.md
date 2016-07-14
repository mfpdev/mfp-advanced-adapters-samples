# MobileFirst UserLogin Security Check adapter sample

## Overview
This package contains a securityCheck adapter ready to be built and deployed to MobileFirst server
This security checks implements a user login challenge by accepting username and password fields from the client and validating that they are identical. 
The challenge answer (implemented in the client-side challenge handler) should be a JSON in the format of `{"username" : "x" , "password" : "y"}`
If the values of `username` and `password` are identical then the credentials are valid and the security check goes to success state



## Prerequisits
You must have maven installed on your machine to use this artifact.
To install maven see: https://maven.apache.org/install.html

## Create the adapter file
To create the UserLogin.adapter file run the following command. The UserLogin.adapter file will be created in the target folder:
```
$ mvn clean install
```

## Deploy the adapter to MobileFirst server
To deploy the adapter to MobileFirst server edit these properties in the pom.xml file:

* mfpfUrl - The url of the MobileFirst server.
* mfpfUser - The login user name of the MobileFirst server
* mfpfPassword - The login password of the MobileFirst server
* mfpfRuntime - The runtime name for which the adapter is deployed. Usually it is 'mfp'.

In most cases the existing value are correct.
Run the following command to deploy the UserLogin.adapter file to the server:
```
$ mvn adapter:deploy
```

#### note
It is possible to create the adapter file and deploy it to the server by using the command:
```
$ mvn clean install adapter:deploy
```

## User Login SecurityCheck
The UserLogin security check is defined in the `adapter.xml` of the adapter.
In the definition are all the custom properties for the security check:

```
     <property name="maxAttempts" defaultValue="3" displayName="How many attempts are allowed"/>
     <property name="blockedStateExpirationSec" defaultValue="10" displayName="How long before the client can try again (seconds)"/>
     <property name="successStateExpirationSec" defaultValue="60" displayName="How long is a successful state valid for (seconds)"/>
```

After deploying the adapter to the MobileFirst console, you can view and modify these fields in the ***Adapters -> UserLogin -> Security Checks*** tab
To fully test this flow, the client-side application must implement a WLChallengeHandler that is registered on the security check "UserLogin" as defined in the `adapter.xml`

  