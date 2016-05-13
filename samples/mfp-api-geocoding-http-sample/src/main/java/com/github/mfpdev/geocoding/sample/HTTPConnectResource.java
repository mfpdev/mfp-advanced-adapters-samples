/*
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
package com.github.mfpdev.geocoding.sample;

import com.ibm.mfp.adapter.api.AdaptersAPI;
import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.ReadContext;
import io.swagger.annotations.*;
import okhttp3.HttpUrl;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.logging.Logger;

@SwaggerDefinition(
        info = @Info(
                description = "Shows the usage of backend calls over HTTP",
                version = "V8.0.0beta",
                title = "Sample Adapter that uses OKHTTP to access a backend geolocation REST Service",
                termsOfService = "IBM Terms and Conditions apply",
                contact = @Contact(
                        name = "MFP Team"
                ),
                license = @License(
                        name = "IBM Samples License"
                )
        )
)

@Path("/geolocation")
@Api(value = "Run a geolocation query",
        description = "Perform a geolocation query against google geolocation service and return the lng/lat information"
)
/**
 * A sample adapter resource that shows how a developer can call into a backend REST service.
 *
 * Many of the interesting REST services out there provide a Java SDK that wrap their REST interface and can be used
 * to call them. At times however, there is no SDK and the developer need to directly leverage the REST interface of
 * the backend service.
 *
 * This sample shows how a well known service, the google geocoding service, can be wrapped by an adapter to
 * significantly reduce the size of the returned payload. The sample uses OKHTTP to call into the backend service and
 * parses the returned JSON using JSON Path. While we are not specifically recommending this service or the specific
 * packages used, the usage pattern holds.
 */
public class HTTPConnectResource {

    /*
     * For more info on JAX-RS see https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
     */

    //Define logger (Standard java.util.Logger)
    static Logger logger = Logger.getLogger(HTTPConnectResource.class.getName());
    //Inject the MFP configuration API:
    @Context
    ConfigurationAPI configApi;
    @Context
    AdaptersAPI adaptersAPI;

    @GET
    @Path("/lnglat")
    @Produces(MediaType.APPLICATION_JSON)
    @OAuthSecurity(enabled = false)
    @ApiOperation(value = "Find the lng/lat information on a given address",
            notes = "Shows how one can call into a backend service with HTTP and than process the response data " +
                    "and return a reduced payload",
            httpMethod = "GET",
            response = LocationData.class
    )
    @ApiResponses(value = {
            @ApiResponse(code = 500, message = "Cannot connect to the backing geocoding service",
                    response = Void.class),
            @ApiResponse(code = 400, message = "Address is missing",
                    response = Void.class)
    })
    /**
     * Call into the google geocoding service and return the lng/lat information for the given address.
     *
     * Uses OKHTTP to make an HTTP request into the geocoding serivce and than parse the returned JSON data looking for
     * the lng/lat information. If the information is found, return it to the caller
     *
     * @param address the address to look up
     * @return The lng/lat data inside a LocationData object
     */
    public LocationData helloOkHttp(@QueryParam("address") @ApiParam("The looked up address") final String address) {
        //log message to server log
        logger.info("Logging info message...");

        // We need an address to work with... lets see that we got something meaningful
        if (address == null || address.trim().length() < 5) {
            throw new BadRequestException(String.format("Address [%s] is invalid",
                    address == null ? "" : address));
        }

        final HttpUrl callURL = constructCallUrl(address);

        logger.fine(String.format("Calling URL [%s]", callURL));

        final okhttp3.Request request = new okhttp3.Request.Builder()
                .url(callURL)
                .build();

        try {
            final okhttp3.Response response = adaptersAPI.getJaxRsApplication(HTTPConnectApplication.class).
                    getOkHttpClient().newCall(request).execute();

            if (!response.isSuccessful()) {
                // Something went wrong here
                logger.fine(String.format("Unexpected response from the google server [%s]", response));
                throw new InternalServerErrorException(String.format("Unexpected error [%d] [%s]",
                        response.code(), response.message()));
            } else {
                // Parse the returned data using JSON path queries
                final LocationData rc = new LocationData();
                final ReadContext ctx = JsonPath.parse(response.body().string());

                final String status = ctx.read("$.status");
                if (status.equals("OK")) {
                    rc.lat = ctx.read("$.results[0].geometry.location.lat");
                    rc.lng = ctx.read("$.results[0].geometry.location.lng");
                } else {
                    // Status should be OK!
                    logger.fine(String.format("Unexpected status in the response [%s]", response));
                    throw new InternalServerErrorException(String.format("Unexpected status code [%s]", status));
                }

                response.body().close();
                return rc;
            }
        } catch (IOException ioException) {
            throw new InternalServerErrorException("Error connecting to backend server", ioException);
        }
    }

    /**
     * Constructs the URL to be called.
     * <p/>
     * Assemble the backend URL that includes not only the google service access but also the requested content (JSON)
     * and two URL form parameters that include the API key and the address parameter
     *
     * @param address the address to look up
     * @return The URL to call into
     */
    private HttpUrl constructCallUrl(final String address) {

        final HTTPConnectApplication geolocationApp = adaptersAPI.getJaxRsApplication(HTTPConnectApplication.class);

        final HttpUrl.Builder callBuilder = new HttpUrl.Builder();

        // Copy the configured URL as a starting point
        final HttpUrl config = HttpUrl.parse(configApi.getPropertyValue("backendURL"));

        callBuilder.scheme(config.scheme());
        callBuilder.host(config.host());
        callBuilder.port(config.port());

        for (String segment : config.pathSegments()) {
            callBuilder.addPathSegment(segment);
        }

        // JSON is signaled as a path segment
        callBuilder.addPathSegment("json");
        // Appending the API Key as a query parameter
        callBuilder.addQueryParameter("key", geolocationApp.getAPIKey());
        // Now append the address
        callBuilder.addQueryParameter("address", address);

        return callBuilder.build();
    }

    @ApiModel(value = "Location Data",
            description = "The data on the address specified"
    )
    public static class LocationData {

        @ApiModelProperty(required = true, notes = "Latitude information")
        public double lat = 0;

        @ApiModelProperty(required = true, notes = "Longitude information")
        public double lng = 0;

        // used by REST marshalling/unmarshalling
        public LocationData() {
        }
    }
}