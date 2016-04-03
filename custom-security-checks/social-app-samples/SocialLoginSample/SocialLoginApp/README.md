IBM MobileFirst Platform Foundation
===

## Using SocialLogin sample
This application is demonstrating how to perform PreEmptive log-in with 'socialLogin' scope, and then call an adapter which is protected with this scope.  
This application is using the [social-login](../../../social-login/README.md) security check adapter and the [HelloSocialUserAdapter](../HelloSocialUserAdapter/README.md) adapter.

### Prerequisites

* Obtain from [Facebook](https://developers.facebook.com/docs/android/getting-started) and [Google](https://developers.google.com/identity/sign-in/android/start-integrating) the following information and update [strings.xml](app/src/main/res/values/strings.xml):
   1. Facebook app id
   2. Google server client id (Web client id)
   3. google-services.json file to put under app folder
* You are done.

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