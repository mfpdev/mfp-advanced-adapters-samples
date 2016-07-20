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
var LicenseAgreementChallengeHandler = function(){
    LicenseAgreementChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("LicenseAgreement");
    
    // This is the method which is called by the SDK when a challenge request is received from the server.
    // The method extracts the challnge parameters from the request and should send back the challenge response
    // after the user provides the needed information.
    //
    // Request:
    // URL - The location of the license file to be presented to the user
    // version - the version of the file. This value should be sent back in the challenge resposne
    //
    // Response:
    // version - the same value received in the challenge request
    
    LicenseAgreementChallengeHandler.handleChallenge = function(challenge) {
        var url = challenge.URL;
        var version = challenge.version;

        // Create the title string for the prompt
        var msg = "";
        if(challenge.message == 1){
            msg = "License Agreement must be signed to continue:\n";
        }
        else{
            msg = "Licence agreement has changed. New license must be signed to continue:\n";
        }
        msg += "URL: " + url + "\n";
        msg += "Version: " + version + "\n";
        
        // Read the License file
        xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                // Display a prompt for user to sign the license agreemenet
                msg += xmlhttp.responseText;
                if(confirm(msg)){
                    LicenseAgreementChallengeHandler.submitChallengeAnswer({"version":version});
                }
                else{ // calling cancel in case user pressed the cancel button
                    LicenseAgreementChallengeHandler.cancel();
                }
            }
        }
        xmlhttp.open("GET", url, false );
        xmlhttp.send();
    };

    // handleFailure
    LicenseAgreementChallengeHandler.handleFailure = function(error) {
        WL.Logger.debug("Challenge Handler Failure!");
        if(error.failure !== null && error.failure !== undefined){
            alert(error.failure);
        }
        else {
            alert("Unknown error");
        }
    };
};
