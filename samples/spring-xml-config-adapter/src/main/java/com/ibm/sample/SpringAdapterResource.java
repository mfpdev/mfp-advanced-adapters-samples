/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

package com.ibm.sample;

import com.ibm.json.java.JSONObject;
import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

@Path("/users")
public class SpringAdapterResource {
	/*
	 * For more info on JAX-RS see https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */
		
	//Define logger (Standard java.util.Logger)
	static Logger logger = Logger.getLogger(SpringAdapterResource.class.getName());

	//Inject the MFP configuration API:
	@Autowired
	ConfigurationAPI configApi;

	@Autowired
	IReqBean reqBean;

	@Autowired
	NonRequestBean nonRequestBean;

	/* Path for method: "<server address>/mfp/api/adapters/springAdapter/users" */
	@GET
	@Produces("text/plain")
	@OAuthSecurity(enabled = false)
	public String hello(){

		//log message to server log
		logger.info("Logging info message...");

		return "Hello from the Java REST adapter: "+reqBean.getMessage()+" and also: "+nonRequestBean.getMyProp();
	}
		
	/* Path for method: "<server address>/mfp/api/adapters/springAdapter/users/{username}" */
	@GET
	@Path("/{username}")
	public String helloUser(@PathParam("username") String name){
		return "Hello " + name;
	}
	
	/* Path for method: "<server address>/mfp/api/adapters/springAdapter/users/helloUserQuery?name=value" */
	@GET
	@Path("/helloUserQuery")
	public String helloUserQuery(@QueryParam("username") String name){
		return "Hello " + name;
	}
	

	
	/* Path for method: "<server address>/mfp/api/adapters/springAdapter/users/{first}/{middle}/{last}?age=value" */
	@POST
	@Path("/{first}/{middle}/{last}")
	public String enterInfo(@PathParam("first") String first, @PathParam("middle") String middle, @PathParam("last") String last,
			@QueryParam("age") int age, @FormParam("height") String height, @HeaderParam("Date") String date){
		return first +" "+ middle + " " + last + "\n" +
				"Age: " + age + "\n" +
				"Height: " + height + "\n" +
				"Date: " + date;
	}
	
	/* Path for method: "<server address>/mfp/api/adapters/springAdapter/users/newUsers" */
	@PUT
	@Path("/newUsers")
	public String newUsers(@FormParam("username") List<String> users){
		if(users!=null && users.size() != 0){
			String usersTemp = "";
			int index = 0;
			for (String user : users) {
				usersTemp += " " +user;
				if(index < users.size() - 1 && users.size() != 2) usersTemp += ",";
				if(++index == users.size() -1 && users.size() != 1) usersTemp += " and";
			}
			return "Hello" + usersTemp;
		}
		
		return "Hello";
	}


	/* Path for method: "<server address>/mfp/api/adapters/springAdapter/users/helloUserBody" */
	@POST
	@Consumes("application/json")
	@Path("/helloUserBody")
	public String testUser(@HeaderParam("Content-Type") String type,  JSONObject json) throws IOException{
		return "Hello " + json.get("first") + " " + json.get("middle") + " " + json.get("last");
	}



	/* Path for method: "<server address>/mfp/api/adapters/springAdapter/users/prop" */
	@GET
	@Path("/prop")
	public Response getPropertyValue(@QueryParam("propertyName") String propertyName) {
		//Get the value of the property:
		String value = configApi.getPropertyValue(propertyName);

		return Response.ok("The value of " + propertyName + " is: " + value).build();
	}

}
