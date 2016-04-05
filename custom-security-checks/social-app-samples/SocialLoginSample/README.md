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

#### Register the application on IBM MobileFirst Platform Foundation Server
  * Insure you have installed [MobileFirst CLI](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/using-the-mfpf-sdk/using-mobilefirst-cli-to-manage-mobilefirst-artifacts/)
  * Open your command line in the root of the Android project
  * Register the app by typing `mfpdev app register`
  

#### Deploying the adapters
  * IBM MobileFirst Platform gives you several options for deploying an [adapters](https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/adapters/).
  * For each of the adapter above ([Social Login security check](https://github.com/mfpdev/mfp-advanced-adapters-samples/tree/development/custom-security-checks/social-login) and [HelloSocialUser Adapter](https://github.com/mfpdev/mfp-advanced-adapters-samples/tree/development/custom-security-checks/social-app-samples/SocialLoginSample/HelloSocialUserAdapter)) do the following:
    * Open command line in the root folder of the adapter.
    * Run `mfpdev adapter deploy`


#### Configuring the adapters

  * From your command line run `mfpdev server console` - this command will open your server console.
  * From the Adapters menu click on *Social Login Adapter*, and move to *Security Checks* tab.
  * Here you will find place to add your *google client id*.  This id will use the adapter to validate the Google account.
  * If you need to use the social platform token later on, set the **keep original token** attribute to be **true**.
  * ![Adapter Configuration](./assets/SocialLoginConfiguration.png)

#### Running the application
  * You can now back to your Android Studio and run the app.
