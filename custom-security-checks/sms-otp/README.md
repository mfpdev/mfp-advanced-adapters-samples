# SMS OTP Adapter

Using SMS to verify phone number or as One-Time Password is a common security pattern today.
This sample is a MobileFirst Java adapter which contains SMS OTP security check, so it can either validating phone number or used as SMS OTP.

In order to be able use this adapter there is some prerequisites:

- You need to have a Twillio (https://www.twilio.com/) account which able to send SMS messages
- From your Twillio account you need the following:
    - Twillio ACCOUNT SID
    - Twillo AUTH TOKEN
    - Twillio PHONE NUMBER
- Those values need to be supplied either in adapter.xml as default values or direct console under the adapter configuration
    
After deploying th SMS OTP Adapter you can protect your adapter with a scope named 'googleOTP'.

The mobile client will need to have challenge handler to answer the 'phone' or 'smsCode' challenges.



