/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

package net.mfpdev.ltpa.sample.hello;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;
import com.ibm.mfp.server.security.external.resource.AdapterSecurityContext;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.Map;

@Api(value = "Sample Adapter Resource")
@Path("/hello")
public class HelloLTPAUserResource {
	// Inject the MFP configuration API:
	@Context
	ConfigurationAPI configApi;

	@Context
	private AdapterSecurityContext securityContext;

	@ApiOperation(value = "Returns user attributes and display name", notes = "A basic example of a resource which protected with ")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "User attributes returned") })
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "LTPA")
	@Path("/user")
	public Map<String,Object> hello() {
		AuthenticatedUser user = securityContext.getAuthenticatedUser();

		Map<String, Object> userAttributes = new HashMap<>();
		userAttributes.put("displayName", user.getDisplayName());
		userAttributes.put("id", user.getId());
		userAttributes.putAll(user.getAttributes());
		return userAttributes;
	}

}
