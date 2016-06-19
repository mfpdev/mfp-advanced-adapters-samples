/**
 *    © Copyright 2016 IBM Corp.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package com.github.mfpdev.sample.socialWatson;

import com.worklight.wlclient.api.WLResponse;
import com.worklight.wlclient.api.challengehandler.SecurityCheckChallengeHandler;

import org.json.JSONObject;


/**
 * SocialLoginChallengeHandler - The challenge handler class to answer the social Login challenge.
 * The answer is JSON which contains the provider (facebook or google) and the token which received from the sign in process.
 *
 * @author Ishai Borovoy
 * @since 14/03/2016
 */
public class SocialLoginChallengeHandler extends SecurityCheckChallengeHandler {

    private AnalyzeMyFacebookActivity mainActivity;

    public SocialLoginChallengeHandler(String securityCheck, AnalyzeMyFacebookActivity activity) {
        super(securityCheck);
        this.mainActivity = activity;
    }

    @Override
    public void handleChallenge(JSONObject jsonObject) {
        mainActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mainActivity.signInWithFacebook();
            }
        });
    }


    @Override
    public void cancel() {
        super.cancel();
    }
}
