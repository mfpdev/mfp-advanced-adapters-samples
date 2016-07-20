/**
* Copyright 2016 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var LicenseAgreementChallengeHandler;

var wlInitOptions = {
    // Options to initialize with the WL.Client object.
    // For initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center.
};

// Called automatically after MFP framework initialization by WL.Client.init(wlInitOptions).
function wlCommonInit(){
    document.getElementById("resource").addEventListener("click", getResource, false);
    document.getElementById("protected").addEventListener("click", getProtected, false);
    document.getElementById("unprotected").addEventListener("click", getUnprotected, false);
    LicenseAgreementChallengeHandler();
}

function getResource() {
    callAPI("resource");
}

function getProtected() {
    callAPI("resource/protected");
}

function getUnprotected() {
    callAPI("resource/unprotected");
}

function callAPI(api) {
    document.getElementById("result").innerHTML = "";
    var resourceRequest = new WLResourceRequest("/adapters/DemoAdapter/" + api, WLResourceRequest.GET);

    resourceRequest.send().then(
        function(response) {
            WL.Logger.debug("resourceRequest.send success: " + response.responseText);
            document.getElementById("result").innerHTML = response.responseText;
        },
        function(response) {
            WL.Logger.debug("resourceRequest.send failed: " + response.errorMsg);
            document.getElementById("result").innerHTML = "Failed: " + response.errorMsg;
        }
    );
}
