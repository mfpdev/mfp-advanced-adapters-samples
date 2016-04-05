## Running the sample
* Start by cloning the Git repository - [MobileFirst 8.0.0 advanced samples and extension modules](https://github.com/mfpdev/mfp-advanced-adapters-samples)

#### Cloning the Git repository

* Clone the following repository https://github.com/mfpdev/mfp-advanced-adapters-samples

* From the above repository you will need three folders:

  1. [Social Login security check](https://github.com/mfpdev/mfp-advanced-adapters-samples/tree/development/custom-security-checks/social-login) - The social login [security check](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/authentication-and-security/) adapter.

  2. [HelloSocialUser Adapter](https://github.com/mfpdev/mfp-advanced-adapters-samples/tree/development/custom-security-checks/social-app-samples/SocialLoginSample/HelloSocialUserAdapter) - The JAX-RS resource adapter which protect with the scope **socialLogin**.

  3. [SocialLoginApp](https://github.com/mfpdev/mfp-advanced-adapters-samples/tree/development/custom-security-checks/social-app-samples/SocialLoginSample/SocialLoginApp) - The sample native android application.

#### Configuring the Android app
* **string.xml**

```xml
<resources>
    ...
    <string name="facebook_app_id">Put your Facebook app id here</string>
    <string name="google_server_client_id">Put your Google web client id here</string>
    ...
</resources>
```

  * Open the Android app [SocialLoginApp](https://github.com/mfpdev/mfp-advanced-adapters-samples/tree/development/custom-security-checks/social-app-samples/SocialLoginSample/SocialLoginApp) in Android Studio.
  * Edit the file **string.xml**, there you need supply the following:
    * Facebook App ID from [Facebook Apps Console](https://developers.facebook.com/apps/)

    * ![Facebook APP ID](./assets/FacebookAppID.png)

    * Google Web Client ID from [Google API Console](https://console.developers.google.com/apis/credentials).

    * ![Google Client ID](./assets/GoogleClientID.png)

    * For the Google SignIn you also need to get the [google-services.json](https://developers.google.com/identity/sign-in/android/start-integrating#prerequisites) file.


* **mfpclient.properties**
    * Insure that **mfpclient.properties** point to correct server host and port (If your  server is installed on localhost leave the **wlServerHost** with the ip 10.0.2.2)

#### Deploying the adapters
  * IBM MobileFirst Platform gives you several options for deploying an [adapters](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/adapters/).
  * In this blog I will use the maven option.  Be sure to you can run `mvn -v` from the command line.
  * For each adapter set the configuration in the **pom.xml**, here is example for IBM MobileFirst Foundation Platform server which run on **localhost**:

```xml
<properties>
	<mfpfUrl>http://localhost:9080/mfpadmin</mfpfUrl>
	<mfpfUser>admin</mfpfUser>
	<mfpfPassword>admin</mfpfPassword>
	<mfpfRuntime>mfp</mfpfRuntime>
</properties>
```
  * From each of the 2 adapters above run the following command from root folder:
  `mvn clean install adapter:deploy`


#### Configuring the adapters

  * Goto server console [http://localhost:9080/mfpconsole](http://localhost:9080/mfpconsole).
  * From the Adapters menu click on *Social Login Adapter*, and move to *Security Checks* tab.
  * Here you will find place to add your *google client id*.  This id will use the adapter to validate the Google account.
  * If you need to use the social platform token later on, set the **keep original token** attribute to be **true**.
  * ![Adapter Configuration](./assets/SocialLoginConfiguration.png)

#### Register the application on IBM MobileFirst Platform Foundation Server
  * Goto server console [http://localhost:9080/mfpconsole](http://localhost:9080/mfpconsole).
  * Under **Applications** press **new** and register your application.

#### Running the application
  * You can back to your Android Studio now and run the application.
