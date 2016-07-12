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
package com.github.mfpdev.sample.smsOTP;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;
import com.ibm.mfp.server.registration.external.model.ClientData;
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
                description = "A JAX-RS API which lets registering a phone number",
                version = "V8.0.0beta",
                title = "SMS OTP JAX-RS API",
                termsOfService = "IBM Terms and Conditions apply",
                contact = @Contact(
                        name = "Ishai Borovoy"
                ),
                license = @License(
                        name = "IBM Samples License"
                )
        )
)

@Path("/phone")
@Api(value = "Register a phone number",
        description = "This JAX-RS Adapter contains an API to let registering the mobile phone number, so later it can be used for receiving SMS with passcode")
public class SMSOTPResource {

    @Context
    private HttpServletRequest request;

    @Context
    private HttpServletResponse response;

    @Context
    private AdapterSecurityContext securityContext;

    @Context
    private ConfigurationAPI configAPI;


    @Path("/isRegistered")
    @GET
    @Produces("application/json")
    @OAuthSecurity(enabled = true)
    @ApiOperation(value = "Check if a phone number is registered",
            notes = "Check if a phone number is registered",
            httpMethod = "GET",
            response = Boolean.class
    )
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "OK",
                    response = String.class),
            @ApiResponse(code = 401, message = "Not Authorized",
                    response = String.class),
            @ApiResponse(code = 500, message = "Cannot check if phone number is registered",
                    response = String.class)
    })

    public Boolean isRegistered() {
        //Getting client data from the security context
        ClientData clientData = securityContext.getClientRegistrationData();
        if (clientData == null) {
            throw new InternalServerErrorException("This check allowed only from a mobile device.");
        }

        String number = clientData.getProtectedAttributes().get(SMSOTPSecurityCheck.PHONE_NUMBER);
        return number != null && !number.trim().equals("");
    }

    @Path("/register/{phoneNumber}")
    @POST
    @Produces("application/json")
    @OAuthSecurity(enabled = true)

    @ApiOperation(value = "Register a phone number",
            notes = "Register a phone number in the registration service for sending the OTP SMS code. This REST API can be called only from mobile client",
            httpMethod = "POST",
            response = Boolean.class
    )
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "OK",
                    response = String.class),
            @ApiResponse(code = 400, message = "Invalid Phone Number",
                    response = String.class),
            @ApiResponse(code = 401, message = "Not Authorized",
                    response = String.class),
            @ApiResponse(code = 500, message = "Cannot register phone number",
                    response = String.class)
    })

    public Boolean registerPhoneNumber(@PathParam("phoneNumber") String phoneNumber) {
        if (!validate(phoneNumber)) {
            throw new BadRequestException(String.format("Phone number [%s] is invalid", phoneNumber));
        }

        //Getting client data from the security context
        ClientData clientData = securityContext.getClientRegistrationData();
        if (clientData == null) {
            throw new InternalServerErrorException("Register a phone number is currently allowed only from a mobile device.");
        }

        //Store the phone number in registration service
        clientData.getProtectedAttributes().put(SMSOTPSecurityCheck.PHONE_NUMBER, phoneNumber);
        securityContext.storeClientRegistrationData(clientData);

        return true;
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



