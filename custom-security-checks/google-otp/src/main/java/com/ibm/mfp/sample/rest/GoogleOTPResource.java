/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/
package com.ibm.mfp.sample.rest;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;
import com.ibm.mfp.sample.security.GoogleOTPState;
import com.ibm.mfp.server.registration.external.model.ClientData;
import com.ibm.mfp.server.registration.external.model.PersistentAttributes;
import com.ibm.mfp.server.security.external.resource.AdapterSecurityContext;
import com.ibm.mfp.server.security.external.resource.ClientSearchCriteria;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import io.swagger.annotations.*;
import org.apache.commons.codec.binary.Base64;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Google Authenticator REST API
 * <p/>
 * - /setupGoogleOTP: create the google authenticator shared secret
 * - /qrCode: Get Google authenticator shared secret as a QR code for scan in the Google authenticator app
 *
 * @author Ishai Borovoy
 * @since 06/03/206
 */

@SwaggerDefinition(
        info = @Info(
                description = "An API using for Google Authenticator OTP registration.",
                version = "V8.0.0beta",
                title = "Google OTP Authenticator registration API",
                termsOfService = "IBM Terms and Conditions apply",
                contact = @Contact(
                        name = "Ishai Borovoy"
                ),
                license = @License(
                        name = "IBM Samples License"
                )
        )
)
@Api(value = "Register Google OTP data",
        description = "An API which let register the Google OTP state such as passcode and qrcode")
@Path("/")
public class GoogleOTPResource {

    private final static String USER = "user";
    private final static String PASSWORD = "password";
    private final static String GOOGLE_AUTHENTICATOR_KEY = "googleAuthenticator";
    private final static String USER_LOGIN_SECURITY_CHECK = "userLogin";
    private static final String QR_CODE_ORG_NAME = "qrCodeOrgName";
    private static final String QR_CODE_EMAIL = "qrCodeEmail";

    @Context
    private HttpServletRequest request;

    @Context
    private HttpServletResponse response;

    @Context
    private AdapterSecurityContext securityContext;

    @Context
    private ConfigurationAPI configAPI;


    @Path("/setupGoogleOTP")
    @POST
    @Produces("application/json")
    @ApiOperation(value = "Register Google OTP state",
            notes = "Create new Google OTP state such as qrcode and password, and register it in registration service.",
            httpMethod = "POST",
            response = String.class
    )
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "OK",
                    response = Void.class),
            @ApiResponse(code = 401, message = "Not Authorized",
                    response = String.class),
            @ApiResponse(code = 500, message = "Cannot register Google OTP state",
                    response = String.class)
    })

    @OAuthSecurity(scope = USER_LOGIN_SECURITY_CHECK)
    public String setupGoogleOTP() {
        //Getting client data from the security context
        ClientData clientData = securityContext.getClientRegistrationData();
        if (clientData == null) {
            throw new InternalServerErrorException("Register Google OTP state currently allowed only from a device.");
        }
        PersistentAttributes protectedAttributes = clientData.getProtectedAttributes();

        // Adding the GoogleOTPState object into the registration data storage
        GoogleOTPState googleOTPState = createGoogleOTPState();
        protectedAttributes.put(GOOGLE_AUTHENTICATOR_KEY, googleOTPState);
        securityContext.storeClientRegistrationData(clientData);

        return "OK";
    }

    @GET
    @OAuthSecurity(enabled = false)
    @Path("/qrCode/{appId}/{appVersion}")
    @ApiOperation(value = "Get the Google Authenticator QR Code",
            notes = "Get an HTML which contains a link to the registered QR Code, This QR code should be scanned by the Google Authenticator App when 'Set up account'",
            httpMethod = "GET",
            response = String.class
    )

    @ApiResponses(value = {
            @ApiResponse(code = 302, message = "Redirect to the QR code URL"),
            @ApiResponse(code = 404, message = "QR code not found"),
            @ApiResponse(code = 401, message = "Unauthorized user")
    })

    public void qrCode(@ApiParam(value = "Application bundleId or package name", required = true) @PathParam("appId") String appId,
                       @ApiParam(value = "Application version", required = true) @PathParam("appVersion") String appVersion) throws Exception {
        //Get the username and password from the basic authorization header
        Map<String, Object> usernamePassword = getEncodedUsernamePassword();

        //If username & password not sent or invalid, return a basic challenge to the client
        if (usernamePassword == null || !securityContext.validateCredentials(USER_LOGIN_SECURITY_CHECK, usernamePassword, request)) {
            response.addHeader("WWW-Authenticate", "Basic realm=\"Please provide your credentials\"");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // Get the username after pass the basic authentication
        String user = (String) usernamePassword.get(USER);

        // Build search credentials to locate the relevant client data
        ClientSearchCriteria criteria = new ClientSearchCriteria().
                byUser(USER_LOGIN_SECURITY_CHECK, user).
                byApplication(appId, appVersion);

        List<ClientData> dataList = securityContext.findClientRegistrationData(criteria);
        GoogleOTPState googleOTPState = null;

        // Get the most recent generated Google shared secret
        long lastActivityTime = -1;
        for (ClientData clientData : dataList) {
            GoogleOTPState currentGoogleOTPState = clientData.getProtectedAttributes().get(GOOGLE_AUTHENTICATOR_KEY, GoogleOTPState.class);
            //Get the last generated key for that user and application
            if (currentGoogleOTPState.getTimeStamp() > lastActivityTime) {
                //Get the latest client in case user logged in to more then one device
                lastActivityTime = currentGoogleOTPState.getTimeStamp();
                googleOTPState = currentGoogleOTPState;
            }
        }

        if (googleOTPState != null) {
            //Redirect to the QR code URL
            throw new RedirectionException(HttpServletResponse.SC_FOUND, new URI(googleOTPState.getQrCodeURL()));
        } else {
            throw new NotFoundException(String.format("Cannot found QR code for user [%s]", user));
        }
    }

    /**
     * Get user name and password from the authorization header and decode it
     *
     * @return Map containing user name and password
     */
    private Map<String, Object> getEncodedUsernamePassword() {
        Map<String, Object> result = null;
        String authorizationHeader = request.getHeader("Authorization");
        String prefix = "basic ";

        String encodedBasicAuthentication = authorizationHeader != null && authorizationHeader.toLowerCase().startsWith(prefix) ?
                authorizationHeader.substring(prefix.length()).trim() :
                null;
        if (encodedBasicAuthentication != null) {
            String basic = new String(Base64.decodeBase64(encodedBasicAuthentication));
            int sep = basic.indexOf(":");
            if (sep != -1) {
                result = new HashMap<>();
                result.put(USER, basic.substring(0, sep));
                result.put(PASSWORD, basic.substring(sep + 1));
            }
        }
        return result;
    }

    /**
     * Create GoogleOTPState object
     *
     * @return the new created state of GoogleOTPState
     */
    private GoogleOTPState createGoogleOTPState() {
        GoogleAuthenticator googleAuthenticator = new GoogleAuthenticator();

        final GoogleAuthenticatorKey googleAuthenticatorKey = googleAuthenticator.createCredentials();
        GoogleOTPState googleOTPState = new GoogleOTPState();
        googleOTPState.setSecret(googleAuthenticatorKey.getKey());
        googleOTPState.setQrCodeURL(GoogleAuthenticatorQRGenerator.getOtpAuthURL(configAPI.getPropertyValue(QR_CODE_ORG_NAME), configAPI.getPropertyValue(QR_CODE_EMAIL), googleAuthenticatorKey));

        return googleOTPState;
    }
}



