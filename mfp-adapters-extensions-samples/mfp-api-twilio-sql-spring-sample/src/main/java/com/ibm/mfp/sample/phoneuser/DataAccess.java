/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

package com.ibm.mfp.sample.phoneuser;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DataAccess {
	/*
	 * For more info on JAX-RS see https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */

    //Define logger (Standard java.util.Logger)
    static Logger logger = Logger.getLogger(DataAccess.class.getName());

    private final JdbcTemplate dataAccess;

    public DataAccess(final JdbcTemplate t) {
        dataAccess = t;

        if(!pingTables()) {
            logger.log(Level.SEVERE, "DataBase tables cannot be found");
        }
    }

    public void update(final RegistrationRecord toUpdate) {

        logger.fine(String.format("Updating Record [%s]", toUpdate));
        int updated;
        if (toUpdate.getKey() < 0) {
            // Create an entry
            logger.finer(String.format("Record is new, creating one for [%s]", toUpdate.getUserID()));

            updated = dataAccess.update("insert into mobile.user_phone_binding(user_id, phone_number, validation_code, in_validation) values(?, ?, ?, ?)",
                    toUpdate.getUserID(), toUpdate.getPhoneNumber(), toUpdate.getValidationCode(), toUpdate.isInValidation());
        } else {
            //Update an entry
            logger.finer(String.format("Record exists, Updating [%d] for [%s]", toUpdate.getKey(), toUpdate.getUserID()));

            updated = dataAccess.update("update mobile.user_phone_binding set user_id = ?, phone_number = ?, validation_code = ?, in_validation = ? where pkey = ?",
                    toUpdate.getUserID(), toUpdate.getPhoneNumber(), toUpdate.getValidationCode(), toUpdate.isInValidation(), toUpdate.getKey());
        }

        if (1 == updated) {
            System.out.println("Updated one row");
            logger.fine(String.format("Updated one row for [%s]", toUpdate.getUserID()));
        }
    }

    public RegistrationRecord fetchByUserName(String name, final boolean onlyValidated) {

        name = name == null ? "" : name.trim();

        if(name.isEmpty()) {
            logger.severe(String.format("Fetching by name, but empty name [%s]", name));
            throw new IllegalArgumentException("name cannot be null");
        }

        String sql = "select * from mobile.user_phone_binding where user_id = ?";
        if (onlyValidated) {
            sql += " and in_validation = false";
        }
        try {
            return dataAccess.queryForObject(sql,
                    new RowMapper<RegistrationRecord>() {
                        public RegistrationRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
                            return new RegistrationRecord(
                                    rs.getInt("pkey"),
                                    rs.getString("user_id"),
                                    rs.getString("phone_number"),
                                    rs.getString("validation_code"),
                                    rs.getBoolean("in_validation")
                            );
                        }
                    },
                    name);
        } catch(EmptyResultDataAccessException e) {
            // JdbcTemplate
            return null;
        }
    }

    private boolean pingTables() {

        try {
            int count = dataAccess.queryForObject("select count(*) from mobile.user_phone_binding where pkey = ?",
                    Integer.class, -1);

            return count == 0;

        } catch(Throwable t) {
            t.printStackTrace();
            logger.log(Level.SEVERE, "Exception when accessing the DataBase for ping", t);
        }

        return false;
    }
}
