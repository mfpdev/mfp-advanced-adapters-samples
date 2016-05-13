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

import com.ibm.mfp.adapter.api.OAuthSecurity;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;

@SwaggerDefinition(
        info = @Info(
                description = "An API that bind User and Phone Numbers by having users register and than validate their " +
                        "registration using SMS messages and validation code .",
                version = "V8.0.0beta",
                title = "User-Phone Binder",
                termsOfService = "IBM Terms and Conditions apply",
                contact = @Contact(
                        name = "MFP Team"
                ),
                license = @License(
                        name = "IBM Samples License"
                )
        )
)
@Path("/sms")
@Api(value = "Let organizations send SMS messages to their users",
        description = "A sample adapter that uses a relational database and the Twilio service to record user's phone " +
                "numbers, validate the numbers and than send SMS messages to the users")
public class PhoneRecordAPIResource {
    /*
     * For more info on JAX-RS see https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
     */

    //Define logger (Standard java.util.Logger)
    static Logger logger = Logger.getLogger(PhoneRecordAPIResource.class.getName());

    @Autowired
    TwilioAccess twilio;

    @Autowired
    DataAccess data;

    @POST
    @Path("/{to}")
    @Consumes(value = MediaType.APPLICATION_FORM_URLENCODED)
    @OAuthSecurity(enabled = true)
    @ApiOperation(value = "Send an SMS message",
            notes = "Send an SMS message using the configured Twilio servoce",
            httpMethod = "POST",
            response = Void.class
    )
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "OK",
                    response = Void.class),
            @ApiResponse(code = 400, message = "Invalid parameter",
                    response = Void.class),
            @ApiResponse(code = 500, message = "Failed to access the Twilio service",
                    response = Void.class)
    })
    public void sendSMS(@PathParam("to") String to, @QueryParam("body") String body) {

        to = to == null ? "" : to.trim();
        body = body == null ? "" : body.trim();

        if (to.isEmpty() || body.isEmpty()) {
            logger.fine(String.format("Parameter error to [%s] or body [%s] are empty", to, body));
            throw new BadRequestException(String.format("Parameter error to [%s] or body [%s] are empty", to, body));
        }

        final String toNumber = getToNumberFromUserID(to);

        if (null == toNumber)
            throw new BadRequestException(String.format("Name cannot be found [%s]", to));

        if (!twilio.send(toNumber, body)) {
            throw new InternalServerErrorException("Cannot send a message");
        }
    }

    @POST
    @Path("register/{user}/{phoneNumber}")
    @Produces(MediaType.APPLICATION_JSON)
    @OAuthSecurity(enabled = true)
    @ApiOperation(value = "Start user-phone bind process",
            notes = "Saves the user's data in a database and than send an SMS message with a code for a user to punch in and return",
            httpMethod = "POST",
            response = Void.class
    )
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "OK"),
            @ApiResponse(code = 400, message = "Invalid parameter",
                    response = Void.class),
            @ApiResponse(code = 500, message = "Failed to access the registration database",
                    response = Void.class)
    })
    public Map<String, Object> registerPhone(@PathParam("user") String userName, @PathParam("phoneNumber") String phoneNumber) {

        userName = userName == null ? "" : userName.trim();
        phoneNumber = phoneNumber == null ? "" : phoneNumber.trim();

        if (userName.isEmpty() || phoneNumber.isEmpty()) {
            logger.fine(String.format("Parameter error user [%s] or phone [%s] are empty", userName, phoneNumber));
            throw new BadRequestException(String.format("Parameter error user [%s] or phone [%s] are empty", userName, phoneNumber));
        }

        final String validationRecord = getValidationRecord(6);

        try {
            final RegistrationRecord s = data.fetchByUserName(userName, false);
            if (s != null) {
                // this is an update to the registration, someone try again...
                data.update(new RegistrationRecord(s.getKey(), userName, phoneNumber, validationRecord, true));
            } else {
                data.update(new RegistrationRecord(-1, userName, phoneNumber, validationRecord, true));
            }
        } catch (Throwable t) {
            logger.log(Level.SEVERE, "Failed to update the database", t);
            throw new InternalServerErrorException("Failed to update");
        }

        final String prefix = getValidationRecord(3);

        // Send an SMS
        // sendSMS(phoneNumber, String.format("Please complete registration by entring the code %s-%s", prefix, validationRecord));
        //

        final Map<String, Object> rc = new HashMap<>();
        rc.put("status", true);
        rc.put("prefix", prefix);

        return rc;
    }

    @POST
    @Path("validate/{user}/{code}")
    @Consumes(value = MediaType.APPLICATION_FORM_URLENCODED)
    @OAuthSecurity(enabled = true)
    @ApiOperation(value = "Start user-phone bind process",
            notes = "Saves the user's data in a database and than send an SMS message with a code for a user to punch in and return",
            httpMethod = "POST",
            response = Void.class
    )
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "OK",
                    response = Void.class),
            @ApiResponse(code = 400, message = "Invalid parameter",
                    response = Void.class),
            @ApiResponse(code = 500, message = "Failed to access the registration database",
                    response = Void.class)
    })
    public void validateUserPhone(@PathParam("user") String userName, @PathParam("code") String validationCode) {

        userName = userName == null ? "" : userName.trim();
        validationCode = validationCode == null ? "" : validationCode.trim();

        System.out.println(String.format("Coming with yser = [%s] and Validation = [%s]", userName, validationCode));

        if (userName.isEmpty() || validationCode.isEmpty()) {
            logger.fine(String.format("Parameter error user [%s] or code [%s] are empty", userName, validationCode));
            throw new BadRequestException(String.format("Parameter error user [%s] or code [%s] are empty", userName, validationCode));
        }

        try {
            final RegistrationRecord s = data.fetchByUserName(userName, false);
            if (s != null) {
                // this is an update to the registration, someone try again...
                if (validationCode.equals(s.getValidationCode())) {
                    data.update(new RegistrationRecord(s.getKey(), userName, s.getPhoneNumber(), null, false));
                }
            } else {
                throw new BadRequestException(String.format("User [%s] did not register", userName));
            }
        } catch (Throwable t) {
            throw new InternalServerErrorException("Failed to update");
        }
    }

    /**
     * Construct a pseodo random numeric validation code (string) of a specified length
     *
     * @param length the validation string length
     * @return the validation string, e.g., "093189"
     */
    private String getValidationRecord(final int length) {

        StringBuilder sb = new StringBuilder(10);

        final Random r = new Random(System.currentTimeMillis());
        for (int i = 0; i < length; i++) {
            sb.append(r.nextInt(10));
        }

        System.out.println("Validation " + sb);

        return sb.toString();
    }

    /**
     * Converts a user ID to a phone number by looking up in hte registration database
     *
     * @param userID the registered user ID to lookup
     * @return the found phone number
     */
    private String getToNumberFromUserID(final String userID) {
        String toNumber = null;
        try {
            final RegistrationRecord s = data.fetchByUserName(userID, true);
            if (s != null)
                toNumber = s.getPhoneNumber();
        } catch (Throwable t) {
            throw new InternalServerErrorException("DataBase lookup failure");
        }
        return toNumber;
    }
}
