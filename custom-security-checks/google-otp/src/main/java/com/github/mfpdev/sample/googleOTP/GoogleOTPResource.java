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
package com.github.mfpdev.sample.googleOTP;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;
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

@SwaggerDefinition(
        info = @Info(
                description = "An API for Google Authenticator OTP setup and provisioning." +
                        "This REST API contains methods for register a new GoogelOTP state which contains the QRCode URL and the password, " +
                        "And a method to get the QR code.",
                version = "V8.0.0beta",
                title = "Google One-Time Password Authenticator REST API",
                termsOfService = "IBM Terms and Conditions apply",
                contact = @Contact(
                        name = "Ishai Borovoy"
                ),
                license = @License(
                        name = "IBM Samples License"
                )
        )
)
@Api(value = "Register a Google OTP data",
        description = "An API which lets register the Google OTP state such as passcode and qrcode")
@Path("/")
public class GoogleOTPResource {

    //Constants

    //Key for adding the GoogleOTPState object into the registration service
    protected final static String GOOGLE_OTP_STATE_KEY = "googleOtpStateKey";
    //User login security check name
    private final static String USER_LOGIN_SECURITY_CHECK_NAME = "userLogin";
    //Configuration key (in adapter.xml) for the QR code org name
    private static final String QR_CODE_ORG_NAME_CONFIG_KEY = "qrCodeOrgName";
    //Configuration key (in adapter.xml) for the QR code email
    private static final String QR_CODE_EMAIL_CONFIG_KEY = "qrCodeEmail";


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
    @ApiOperation(value = "Register a Google OTP State object",
            notes = "This API creates a new Google OTP state which contains qrcode and password, and registers it in the registration service.",
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

    @OAuthSecurity(scope = USER_LOGIN_SECURITY_CHECK_NAME)
    public String setupGoogleOTP() {
        //Getting client data from the security context
        ClientData clientData = securityContext.getClientRegistrationData();
        if (clientData == null) {
            throw new InternalServerErrorException("Registering a Google OTP state is allowed only from a device.");
        }
        PersistentAttributes protectedAttributes = clientData.getProtectedAttributes();

        // Adding the GoogleOTPState object into the registration data storage
        GoogleOTPState googleOTPState = createGoogleOTPState();
        protectedAttributes.put(GOOGLE_OTP_STATE_KEY, googleOTPState);
        securityContext.storeClientRegistrationData(clientData);

        return "OK";
    }

    @GET
    @OAuthSecurity(enabled = false)
    @Path("/qrCode/{appId}/{appVersion}")
    @ApiOperation(value = "Get the Google Authenticator QR Code URL",
            notes = "Redirect to the QR code URL, if exist in the user registration.  The QR code should be scanned by the Google Authenticator App",
            httpMethod = "GET",
            response = String.class
    )

    @ApiResponses(value = {
            @ApiResponse(code = 302, message = "Redirect to the QR code URL"),
            @ApiResponse(code = 404, message = "QR code not found"),
            @ApiResponse(code = 401, message = "Unauthorized user")
    })

    public void qrCode(@ApiParam(value = "App bundleId or package name", required = true) @PathParam("appId") String appId,
                       @ApiParam(value = "App version", required = true) @PathParam("appVersion") String appVersion) throws Exception {

        //Get the username and password from the the authorization header
        Map<String, Object> usernamePassword = getEncodedUsernamePassword();

        //If username & password not sent or invalid, return a basic challenge to the client
        if (usernamePassword == null || !securityContext.validateCredentials(USER_LOGIN_SECURITY_CHECK_NAME, usernamePassword, request)) {
            response.addHeader("WWW-Authenticate", "Basic realm=\"Please provide your credentials\"");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // Get the username after passing the basic authentication
        String user = (String) usernamePassword.get(UserLoginSecurityCheck.USER_KEY);

        // Build search criteria to locate the relevant client data by application, version and user
        ClientSearchCriteria criteria = new ClientSearchCriteria().
                byUser(USER_LOGIN_SECURITY_CHECK_NAME, user).
                byApplication(appId, appVersion);

        List<ClientData> dataList = securityContext.findClientRegistrationData(criteria);
        GoogleOTPState googleOTPState = null;

        // Get the most recent generated GoogleOTPState object from registration service
        long lastActivityTime = -1;
        for (ClientData clientData : dataList) {
            GoogleOTPState currentGoogleOTPState = clientData.getProtectedAttributes().get(GOOGLE_OTP_STATE_KEY, GoogleOTPState.class);
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
                result.put(UserLoginSecurityCheck.USER_KEY, basic.substring(0, sep));
                result.put(UserLoginSecurityCheck.PASSWORD_KEY, basic.substring(sep + 1));
            }
        }
        return result;
    }

    /**
     * Create GoogleOTPState object
     *
     * @return the newly created state of GoogleOTPState
     */
    private GoogleOTPState createGoogleOTPState() {
        GoogleAuthenticator googleAuthenticator = new GoogleAuthenticator();

        final GoogleAuthenticatorKey googleAuthenticatorKey = googleAuthenticator.createCredentials();
        GoogleOTPState googleOTPState = new GoogleOTPState();
        googleOTPState.setSecret(googleAuthenticatorKey.getKey());
        googleOTPState.setQrCodeURL(GoogleAuthenticatorQRGenerator.getOtpAuthURL(configAPI.getPropertyValue(QR_CODE_ORG_NAME_CONFIG_KEY), configAPI.getPropertyValue(QR_CODE_EMAIL_CONFIG_KEY), googleAuthenticatorKey));

        return googleOTPState;
    }
}



