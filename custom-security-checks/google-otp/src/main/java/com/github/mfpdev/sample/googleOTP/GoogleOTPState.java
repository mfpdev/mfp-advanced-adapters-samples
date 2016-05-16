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
package com.github.mfpdev.sample.googleOTP;

import java.util.Date;

/**
 * Google OTP state
 *
 * @author Ishai Borovoy
 * @since 06/03/206
 */
public class GoogleOTPState {
    private String secret;
    private String qrCodeURL;
    private long timeStamp = -1;

    public GoogleOTPState() {
        this.timeStamp = new Date().getTime();
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public String getQrCodeURL() {
        return qrCodeURL;
    }

    public void setQrCodeURL(String qrCodeURL) {
        this.qrCodeURL = qrCodeURL;
    }

    public long getTimeStamp() {
        return timeStamp;
    }
}
