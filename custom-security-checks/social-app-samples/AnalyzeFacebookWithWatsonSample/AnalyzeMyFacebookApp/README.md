IBM MobileFirst Platform Foundation
===================================

## Analyze My Facebook 
Have you ever wanted to know what's your profile picture is telling about your age or gender?
Have you ever wanted to know what's your Facebook feed is telling about your personality? Or about your tone?
You can take this sample and try to think about real world use case such as ads platform that customize the ads based on user personality, age or gender.


This sample can do that by using [IBM MobileFirst Foundation 8.0](https://developer.ibm.com/mobilefirstplatform/) and [Watson services](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/services-catalog.html).
 
## Running the application
 * Build and deploy adapters
    You need to build and deploy two adapters:
    1. [AnalyzeMyFacebookAdapter](../AnalyzeMyFacebookAdapter/README.md) - this is the resource adapter which has protected REST API /analyze.  The /analyze API fetch user profile information and feed from Facebook and sends them to Watson to obtain insights.
    2. [social-login](../../../social-login/README.md) - this is the security check adapter which can validate social platform users (Facebook or Google).  
    You must set the property `keepOriginalToken` to `true`. This property allows the adapter to store the original Facebook token to be used when calling [Facebook graph API](https://developers.facebook.com/docs/graph-api). 
 
 * Android Native App
    1. You need to obtain an `appId` from Facebook by adding a new Android app in [Facebook Developer Console](https://developers.facebook.com/).
    2. Add the `appId` to `facebook_app_id` in the `string.xml` file.
    3. Set your MFP server URL in `mfpclient.properties`.
    
  * You can run the app now.
  
  Here is a short demo:
  
  [![Analyze My Facebook App](http://img.youtube.com/vi/-cz12GzX1ho/0.jpg)](http://www.youtube.com/watch?v=-cz12GzX1ho)

### Supported Levels
IBM MobileFirst Platform Foundation 8.0

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