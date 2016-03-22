
package com.ibm.mfp.sample.phoneuser;

import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertFalse;

import org.junit.Test;


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