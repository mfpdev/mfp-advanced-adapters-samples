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
package com.github.mfpdev.social.sample.helloSocialUser;

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
import java.util.logging.Logger;

@Api(value = "Sample Adapter Resource")
@Path("/hello")
public class HelloSocialUserResource {
	/*
	 * For more info on JAX-RS see
	 * https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */

	// Define logger (Standard java.util.Logger)
	static Logger logger = Logger.getLogger(HelloSocialUserResource.class.getName());

	// Inject the MFP configuration API:
	@Context
	ConfigurationAPI configApi;

	@Context
	private AdapterSecurityContext securityContext;

	/*
	 * Path for method:
	 * "<server address>/mfp/api/adapters/HelloSocialUser/hello"
	 */

	@ApiOperation(value = "Returns user attributes and display name", notes = "A basic example of a resource returning user attributes from a social platform login.")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "User attributes returned") })
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public Map<String,Object> hello() {
		AuthenticatedUser user = securityContext.getAuthenticatedUser();
		Map<String, Object> userAttributes = new HashMap<String, Object>();
		userAttributes.put("displayName", user.getDisplayName());
		userAttributes.putAll(user.getAttributes());
		return userAttributes;
	}
}
