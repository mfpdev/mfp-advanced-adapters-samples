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

import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertFalse;

import org.junit.Test;

import com.github.mfpdev.twilio.sample.phoneuser.TwilioAccess;


public class TwilioAccessTest {

    @Test
    public void testNullSID() {

        TwilioAccess t = null;

        try {
            t = new TwilioAccess(null, "1234567890", "1234567890");
        } catch(final Exception e) {

        }
        assertNull(t);
    }

    @Test
    public void testEmptySID() {

        TwilioAccess t = null;

        try {
            t = new TwilioAccess("", "1234567890", "1234567890");
        } catch(final Exception e) {

        }
        assertNull(t);
    }

    @Test
    public void testSuccessConstruct() {

        System.out.println("testSuccessConstruct");

        TwilioAccess t = null;

        try {
            t = new TwilioAccess("1234567890", "1234567890", "1234567890");
        } catch(final Exception e) {

        }
        assertNotNull(t);
    }

    @Test
    public void testFailCall() {

        System.out.println("testFailCall");
        TwilioAccess t = new TwilioAccess("1234567890", "1234567890", "1234567890");
        assertFalse(t.send("1234567890", "This is the body"));
    }
}