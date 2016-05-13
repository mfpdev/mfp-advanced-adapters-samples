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
package com.github.mfpdev.twilio.sample.phoneuser;

import com.twilio.sdk.TwilioRestClient;
import com.twilio.sdk.resource.factory.MessageFactory;
import com.twilio.sdk.resource.instance.Message;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class TwilioAccess {

    //Define logger (Standard java.util.Logger)
    static Logger logger = Logger.getLogger(TwilioAccess.class.getName());

    /*
     * Twilio specific configuration parameters
     */
    private String twilioSID = null;
    private String twilioToken = null;
    private String twilioFrom = null;

    public TwilioAccess(final String sid, final String token, final String from) {

        logger.info(String.format("Initializing a Twilio access object with sid=[%s], token=[%s], from=[%s]", sid, token, from));

        twilioSID = sid == null ? "" : sid.trim();
        twilioToken = token == null ? "" : token.trim();
        twilioFrom = from == null ? "" : from.trim();

        if (twilioSID.isEmpty() || twilioToken.isEmpty() || twilioFrom.isEmpty()) {
            // Something is wrong
            final String message = String.format("Input error SID[%s] Token[%s] Phone[%s] should not be empty",
                    twilioSID, twilioToken, twilioFrom);
            logger.severe(message);
            throw new IllegalArgumentException(message);
        }

        logger.config(String.format("Twilio is initializing with configuration SID = [%s] Token = [%s] Number = [%s]",
                twilioSID, twilioToken, twilioFrom));

        // Check if we can access twilio using our configured parameters
        try {
            // getDateCreated() used for validation because it is failed if one of the account property is invalid
            getTwilioRestClient().getAccount().getDateCreated();
        } catch(final Throwable t) {
            logger.log(Level.SEVERE, String.format("Twilio client failed to initialize with the provided parameters SID = [%s] Token = [%s] Number = [%s]",
                    twilioSID, twilioToken, twilioFrom),
                    t);
        }

        logger.info("Twilio initialized!");
    }

    public boolean send(final String to, final String body) {
        // Build a filter for the MessageList
        final List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("Body", body));
        params.add(new BasicNameValuePair("To", to));
        params.add(new BasicNameValuePair("From", twilioFrom));


        try {
            final MessageFactory messageFactory = getTwilioRestClient().getAccount().getMessageFactory();
            final Message message = messageFactory.create(params);
            System.out.println(message.getSid());
            return true;
        } catch (final Exception e) {
            e.printStackTrace();

            logger.log(Level.SEVERE, "Cannot send SMS using the configured account", e);
        }

        return false;
    }

    private TwilioRestClient getTwilioRestClient() {

        return new TwilioRestClient(twilioSID, twilioToken);
    }

}
