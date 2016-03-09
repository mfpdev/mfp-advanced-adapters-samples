# Google OTP Adapter

Using [Google Authenticator](https://www.wikiwand.com/en/Google_Authenticator) as OTP or as Two-factor authentication is a common security pattern.
This sample is a MobileFirst Java adapter which contains Google OTP security check.
The sample contains REST API which is part of the setup flow:

1. /setupGoogleOTP
2. qrCode/{appId}/{appVersion}

To use this sample you need to follow:

- Protect any adapter with 'googleOTP' scope

- Your application is first needs to call to the REST '/adapters/GoogleOTPAdapter/setupGoogleOTP',
Calling it will creates the registration entry in registration db (@see GoogleOTPState.java). 
This REST resource is protected with 'userLogin' scope, so your application will need to have challenge wiich can handle userLogin challenge. 

- To scan the QR code into the Google Authenticator you will need to open browser and go to the following URL:
/api/adapters/GoogleOTPAdapter/qrCode/{bundleId | packageName}/{app version}

- Your application will need to have challenge handler to answer the googleOTP challenge.

