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

import org.junit.Test;
import org.junit.Before;

import com.github.mfpdev.twilio.sample.phoneuser.DataAccess;
import com.github.mfpdev.twilio.sample.phoneuser.PhoneRecordAPIResource;
import com.github.mfpdev.twilio.sample.phoneuser.TwilioAccess;

import static org.junit.Assert.fail;

public class PhoneRecordAPIResourceTest {

    private PhoneRecordAPIResource res = new PhoneRecordAPIResource();

    @Before
    public void initialize() {
        res.twilio = new TwilioAccess("1234567890", "1234567890", "1234567890");

        DataAccessTest t = new DataAccessTest();
        t.initialize();

        res.data = new DataAccess(t.getTemplate());
    }

    @Test
    public void testEmptyParams() {

        try {
            res.registerPhone("", "12345678");
            fail("Should throw an exception");
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}
