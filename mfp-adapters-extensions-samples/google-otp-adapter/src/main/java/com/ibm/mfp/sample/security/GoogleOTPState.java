/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/
package com.ibm.mfp.sample.security;

import java.util.Date;

/**
 *
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
