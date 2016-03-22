package com.ibm.mfp.sample.phoneuser;

import org.junit.Test;
import org.junit.Before;

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
