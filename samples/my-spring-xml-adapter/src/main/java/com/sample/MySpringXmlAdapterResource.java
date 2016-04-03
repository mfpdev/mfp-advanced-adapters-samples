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
package com.sample;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;
import org.springframework.beans.factory.annotation.Autowired;

@Api(value = "Sample Adapter Resource")
@Path("/resource")
public class MySpringXmlAdapterResource {
	/*
	 * For more info on JAX-RS see
	 * https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */

	// Define logger (Standard java.util.Logger)
	static Logger logger = Logger.getLogger(MySpringXmlAdapterResource.class.getName());

	// Inject the MFP configuration API:
	@Context
	ConfigurationAPI configApi;

	/*
	 * Path for method:
	 * "<server address>/mfp/api/adapters/mySpringXmlAdapter/resource"
	 */

	@ApiOperation(value = "Returns 'Hello from resource'", notes = "A basic example of a resource returning a constant string.")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Hello message returned") })
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getResourceData() {
		// log message to server log
		logger.info("Logging info message...");

		return "Hello from resource";
	}

	/*
	 * Path for method:
	 * "<server address>/mfp/api/adapters/mySpringXmlAdapter/resource/greet/{name}"
	 */

	@ApiOperation(value = "Query Parameter Example", notes = "Example of passing query parameters to a resource. Returns a greeting containing the name that was passed in the query parameter.")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Greeting message returned") })
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/greet")
	public String helloUser(
			@ApiParam(value = "Name of the person to greet", required = true) @QueryParam("name") String name) {
		return "Hello " + name + "!";
	}

	/*
	 * Path for method:
	 * "<server address>/mfp/api/adapters/mySpringXmlAdapter/resource/{path}/"
	 */

	@ApiOperation(value = "Multiple Parameter Types Example", notes = "Example of passing parameters using 3 different methods: path parameters, headers, and form parameters. A JSON object containing all the received parameters is returned.")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "A JSON object containing all the received parameters returned.") })
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/{path}")
	public Map<String, String> enterInfo(
			@ApiParam(value = "The value to be passed as a path parameter", required = true) @PathParam("path") String path,
			@ApiParam(value = "The value to be passed as a header", required = true) @HeaderParam("Header") String header,
			@ApiParam(value = "The value to be passed as a form parameter", required = true) @FormParam("form") String form) {
		Map<String, String> result = new HashMap<String, String>();

		result.put("path", path);
		result.put("header", header);
		result.put("form", form);

		return result;
	}

	/*
	 * Path for method:
	 * "<server address>/mfp/api/adapters/mySpringXmlAdapter/resource/prop"
	 */

	@ApiOperation(value = "Configuration Example", notes = "Example usage of the configuration API. A property name is read from the query parameter, and the value corresponding to that property name is returned.")
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "Property value returned."),
			@ApiResponse(code = 404, message = "Property value not found.") })
	@GET
	@Path("/prop")
	@Produces(MediaType.TEXT_PLAIN)
	public Response getPropertyValue(
			@ApiParam(value = "The name of the property to lookup", required = true) @QueryParam("propertyName") String propertyName) {
		// Get the value of the property:
		String value = configApi.getPropertyValue(propertyName);
		if (value != null) {
			// return the value:
			return Response
					.ok("The value of " + propertyName + " is: " + value)
					.build();
		} else {
			return Response.status(Status.NOT_FOUND)
					.entity("No value for " + propertyName + ".").build();
		}

	}

	/*
	 * Path for method:
	 * "<server address>/mfp/api/adapters/mySpringXmlAdapter/resource/unprotected"
	 */

	@ApiOperation(value = "Unprotected Resource", notes = "Example of an unprotected resource, this resource is accessible without a valid token.")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "A constant string is returned") })
	@GET
	@Path("/unprotected")
	@Produces(MediaType.TEXT_PLAIN)
	@OAuthSecurity(enabled = false)
	public String unprotected() {
		return "Hello from unprotected resource!";
	}

	/*
	 * Path for method:
	 * "<server address>/mfp/api/adapters/mySpringXmlAdapter/resource/protected"
	 */

	@ApiOperation(value = "Custom Scope Protection", notes = "Example of a resource that is protected by a custom scope. To access this resource a valid token for the scope 'myCustomScope' must be acquired.")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "A constant string is returned") })
	@GET
	@Path("/protected")
	@Produces(MediaType.TEXT_PLAIN)
	@OAuthSecurity(scope = "myCustomScope")
	public String customScopeProtected() {
		return "Hello from a resource protected by a custom scope!";
	}


	@Autowired
	HelloService helloService;

	@Path("/hello")
	@GET
	@OAuthSecurity(enabled = false)
	public String sayHello(){
		return helloService.getMessage();
	}

}
