/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/
package com.ibm.mfp.sample.rest;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;
import com.ibm.mfp.sample.security.SMSOTPSecurityCheck;
import com.ibm.mfp.server.registration.external.model.ClientData;
import com.ibm.mfp.server.registration.external.model.PersistentAttributes;
import com.ibm.mfp.server.security.external.resource.AdapterSecurityContext;
import io.swagger.annotations.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@SwaggerDefinition(
        info = @Info(
                description = "An API that let register phone number, so it can received SMS as One-Time Password.",
                version = "V8.0.0beta",
                title = "Phone registration",
                termsOfService = "IBM Terms and Conditions apply",
                contact = @Contact(
                        name = "Ishai Borovoy",
                        email = "ishaib@il.ibm.com",
                        url = "http://www.ibm.com"
                ),
                license = @License(
                        name = "IBM Samples License"
                )
        )
)
@Path("/phone")
@Api(value = "An API for the SMS One-Time Password security check",
        description = "This REST Adapter is used for register the user phone number in the registration service.")
public class SMSOTPResource {

    @Context
    private HttpServletRequest request;

    @Context
    private HttpServletResponse response;

    @Context
    private AdapterSecurityContext securityContext;

    @Context
    private ConfigurationAPI configAPI;

    @Path("/register/{phoneNumber}")
    @POST
    @Produces("application/json")
    @OAuthSecurity(enabled = true)

    @ApiOperation(value = "Register a phone number",
            notes = "Register a phone number in the registration service for sending the OTP SMS code",
            httpMethod = "POST",
            response = Void.class
    )
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "OK",
                    response = Void.class),
            @ApiResponse(code = 400, message = "Invalid Phone Number",
                    response = Void.class),
    })
    public String registerPhoneNumber(@PathParam("phoneNumber") String phoneNumber) {
        if (!validate(phoneNumber)) {
            throw new BadRequestException(String.format("Phone number [%s] is invalid", phoneNumber));
        }

        //Getting client data from the security context
        ClientData clientData = securityContext.getClientRegistrationData();
        PersistentAttributes protectedAttributes = clientData.getProtectedAttributes();

        //Store the phone number in registration service
        protectedAttributes.put(SMSOTPSecurityCheck.PHONE_NUMBER, phoneNumber);
        securityContext.storeClientRegistrationData(clientData);

        return "OK";
    }

    /**
     * Validate phone number format
     * @param phoneNumber the phone number to validate
     * @return true if phone number is valid
     */
    private boolean validate(String phoneNumber) {
        String regex = "^\\+?[0-9. ()-]{10,25}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(phoneNumber);

        return matcher.matches();
    }
}



