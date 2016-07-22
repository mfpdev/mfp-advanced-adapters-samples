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

import com.ibm.json.java.JSONObject;
import com.ibm.mfp.adapter.api.OAuthSecurity;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;
import com.ibm.mfp.server.registration.external.model.ClientData;
import com.ibm.mfp.server.security.external.resource.AdapterSecurityContext;
import com.ibm.mfp.server.security.external.resource.ClientSearchCriteria;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import java.util.List;
import java.util.Map;

@Path("/")
public class QRCodeResource {

    @Context
    private AdapterSecurityContext securityContext;

    @Path("/approveWebUser")
    @POST
    @OAuthSecurity(scope = "UserLogin")
    @Produces("application/json")
    public Boolean approveUser(@QueryParam("uuid") String uuid) {
        ClientSearchCriteria clientSearchCriteria = new ClientSearchCriteria().byAttribute(QRCodeWebLoginSecurityCheck.QR_CODE_UUID, uuid);
        List<ClientData> clientsData = securityContext.findClientRegistrationData(clientSearchCriteria);
        if (clientsData.size() == 1) {
            clientsData.get(0).getPublicAttributes().put(QRCodeWebLoginSecurityCheck.WEB_USER_REGISTRATION_KEY, this.securityContext.getAuthenticatedUser());
            securityContext.storeClientRegistrationData(clientsData.get(0));
            return true;
        }

        return false;
    }

    @Path("/user")
    @GET
    @OAuthSecurity (scope = "qrcode")
    @Produces("application/json")
    public AuthenticatedUser getUser() {
        return securityContext.getAuthenticatedUser();
    }

}



