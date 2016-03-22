package com.ibm.mfp.sample.phoneuser;

import org.junit.Test;
import org.junit.Before;

import org.postgresql.ds.PGSimpleDataSource;
import org.springframework.jdbc.core.JdbcTemplate;

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
