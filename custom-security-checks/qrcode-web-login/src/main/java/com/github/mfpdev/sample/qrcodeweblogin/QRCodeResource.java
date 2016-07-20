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
package com.github.mfpdev.sample.qrcodeweblogin;

import com.ibm.mfp.adapter.api.OAuthSecurity;
import com.ibm.mfp.server.registration.external.model.ClientData;
import com.ibm.mfp.server.security.external.resource.AdapterSecurityContext;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import java.util.Map;

@Path("/")
public class QRCodeResource {

    public  static final String CLIENT_ID = "clientId";

    @Context
    private AdapterSecurityContext securityContext;


    @Path("/init")
    @POST
    @Produces("application/json")
    public String init() {
        ClientData clientData = securityContext.getClientRegistrationData();
        clientData.getProtectedAttributes().put(CLIENT_ID,clientData.getClientId());
        securityContext.storeClientRegistrationData(clientData);
        return "OK";
    }

    @Path("/user")
    @GET
    @OAuthSecurity (scope = "qrcode-login")
    @Produces("application/json")
    public Map<String, Object> getUser() {
        return securityContext.getAuthenticatedUser().getAttributes();
    }

}



