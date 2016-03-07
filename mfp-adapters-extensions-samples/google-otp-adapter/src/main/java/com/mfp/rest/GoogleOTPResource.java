/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/
package com.mfp.rest;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;
import com.ibm.mfp.server.registration.external.model.ClientData;
import com.ibm.mfp.server.registration.external.model.PersistentAttributes;
import com.ibm.mfp.server.security.external.resource.AdapterSecurityContext;
import com.ibm.mfp.server.security.external.resource.ClientSearchCriteria;
import com.mfp.security.GoogleOTPState;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import org.apache.commons.codec.binary.Base64;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *  Google Authenticator REST API
 *
 * - /setupGoogleOTP: create the google authenticator shared secret
 * - /qrCode: Get Google authenticator shared secret as a QR code for scan in the Google authenticator app
 *
 * @author Ishai Borovoy
 * @since 06/03/206
 */
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


    /**
     * Generate a shared secret and store it in the registration data as GoogleOTPState object.
     *
     * Mobile app should call this API in the beginning
     * @return "OK" as success
     */
    @Path("/setupGoogleOTP")
    @POST
    @Produces("application/json")
    @OAuthSecurity(scope = USER_LOGIN_SECURITY_CHECK)

    public Object setupGoogleOTP() {
        //Getting client data from the security context
        ClientData clientData = securityContext.getClientRegistrationData();
        PersistentAttributes protectedAttributes = securityContext.getClientRegistrationData().getProtectedAttributes();

        // Adding the GoogleOTPState object into the registration data storage
        GoogleOTPState googleOTPState = createGoogleOTPState();
        protectedAttributes.put(GOOGLE_AUTHENTICATOR_KEY, googleOTPState);
        securityContext.storeClientRegistrationData(clientData);

        return "OK";
    }

    /**
     * Get an HTML which contains a link to the registered QR Code.
     * This QR code should be scanned by the Google Authenticator App when "Set up account".
     *
     * @param appId the application id (e.g: bundleId in iOS / package name in Android)
     * @param appVersion the application version (e.g: CFBundleShortVersionString in iOS / versionName in Android)
     *
     * This method requires basic authentication and uses the authenticated user identity and the application id to locate the appropriate client registration data
     * @return HTML with link to the QRCode
     *
     * @throws Exception
     */
    @Path("/qrCode/{appId}/{appVersion}")
    @GET
    @Produces("text/html")
    @OAuthSecurity(enabled = false)
    public String qrCode(@PathParam("appId") String appId, @PathParam("appVersion") String appVersion) throws Exception {
        //Get the username and password from the basic authorization header
        Map<String, Object> usernamePassword = getEncodedUsernamePassword();

        //If username & password not sent or invalid, return a basic challenge to the client
        if (usernamePassword == null || !securityContext.validateCredentials(USER_LOGIN_SECURITY_CHECK, usernamePassword, request)) {
            response.addHeader("WWW-Authenticate", "Basic realm=\"Please provide your credentials\"");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
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

        String htmlCode;

        if (googleOTPState != null) {
            htmlCode = "<a href='"+ googleOTPState.getQrCodeURL() +"'>Click to get QR code for scan inside Google Authenticator app</a>";
        } else {
            htmlCode =  "No QR Code found.";
        }

        return  "<html>" +
                    "<body>" +
                        htmlCode +
                    "</body>" +
                "</html>";
    }

    /**
     * Get user name and password from the authorization header and decode it
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
                result = new HashMap<String,Object>();
                result.put(USER, basic.substring(0, sep));
                result.put(PASSWORD, basic.substring(sep + 1));
            }
        }
        return result;
    }

    /**
     * Create GoogleOTPState object
     * @return
     */
    private GoogleOTPState createGoogleOTPState(){
        GoogleAuthenticator googleAuthenticator = new GoogleAuthenticator();

        final GoogleAuthenticatorKey googleAuthenticatorKey =  googleAuthenticator.createCredentials();
        GoogleOTPState googleOTPState = new GoogleOTPState();
        googleOTPState.setSecret(googleAuthenticatorKey.getKey());
        googleOTPState.setQrCodeURL(GoogleAuthenticatorQRGenerator.getOtpAuthURL(configAPI.getPropertyValue(QR_CODE_ORG_NAME), configAPI.getPropertyValue(QR_CODE_EMAIL), googleAuthenticatorKey));

        return googleOTPState;
    }
}



