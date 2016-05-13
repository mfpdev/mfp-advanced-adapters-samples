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
import org.postgresql.ds.PGSimpleDataSource;
import org.springframework.jdbc.core.JdbcTemplate;

import com.github.mfpdev.twilio.sample.phoneuser.DataAccess;
import com.github.mfpdev.twilio.sample.phoneuser.RegistrationRecord;

import javax.sql.DataSource;

import static org.junit.Assert.*;

public class DataAccessTest {

    private DataSource getDataSource() {

        final PGSimpleDataSource rc = new PGSimpleDataSource();

        rc.setDatabaseName("testdb");
        rc.setUser("test");
        rc.setPassword("test");
        rc.setServerName("localhost");
        rc.setPortNumber(5432);

        return rc;
    }

    JdbcTemplate getTemplate() {
        return new JdbcTemplate(getDataSource());
    }

    @Before
    public void initialize() {
        getTemplate().execute("delete from mobile.user_phone_binding");
    }

    @Test
    public void testNoSuchRow() {

        DataAccess d = new DataAccess(getTemplate());

        RegistrationRecord r = d.fetchByUserName("no such user", false);

        assertNull(r);
    }

    @Test
    public void testAddRow() {

        DataAccess d = new DataAccess(getTemplate());

        d.update(new RegistrationRecord(-1, "testuserid", "Phone12345", "12345", true));

        RegistrationRecord r = d.fetchByUserName("testuserid", true);
        assertNull(r);

        r = d.fetchByUserName("testuserid", false);
        assertNotNull(r);

        assertEquals("testuserid", r.getUserID());
        assertEquals("Phone12345", r.getPhoneNumber());
        assertEquals("12345", r.getValidationCode());
        assertTrue(r.isInValidation());
        assertTrue(r.getKey() > -1);

        final int key = r.getKey();
        d.update(new RegistrationRecord(r.getKey(), "testuserid", "Phone12345", "", false));

        r = d.fetchByUserName("testuserid", true);
        assertNotNull(r);
        assertEquals("testuserid", r.getUserID());
        assertEquals("Phone12345", r.getPhoneNumber());
        assertEquals("", r.getValidationCode());
        assertFalse(r.isInValidation());
        assertEquals(r.getKey(), key);
    }
}
