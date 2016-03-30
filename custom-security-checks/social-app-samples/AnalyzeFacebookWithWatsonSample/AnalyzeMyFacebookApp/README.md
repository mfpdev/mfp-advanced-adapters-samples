IBM MobileFirst Platform Foundation
===================================

## Analyze My Facebook 
Have you ever want to know what's your profile picture in telling about your age or gender?
Have you ever want to know what's your Facebook feed is telling about your personality? Or about your tone?

This sample can do those by using [IBM MobileFirst Foundation 8.0](https://developer.ibm.com/mobilefirstplatform/) and [Watson services](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/services-catalog.html).
 
## Running the application
 * Build and deploy adapters
    You need to build and deploy 2 adapters from custom-security-checks folder (see instructions for each adapter in README):
    1. [AnalyzeMyFacebookAdapter](../AnalyzeMyFacebookAdapter/README.md) - this is the resource adapter which has protected REST API /analyze.  The /analyze API fetch some Facebook data like picture and user feed and send them to Watson.
    2. [social-login](../../../social-login/README.md) - this is the security check adapter which can validate social platform users (Facebook or Google).  
    Configure the property `keepOriginalToken` to be true, this property tell the adapter to save the real Facebook token, so it can call [Facebook graph API](https://developers.facebook.com/docs/graph-api). 
 
 * Android Native App
    1. You need to get an appId from facebook by adding new Android app in [Facebook Developer Console](https://developers.facebook.com/)
    2. Add the above appId to `facebook_app_id` in the `string.xml` file
    3. Set your MFP server URL in `mfpclient.properties`
    
  * You can run the app now.
  
  See short demo of the app below:
  
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