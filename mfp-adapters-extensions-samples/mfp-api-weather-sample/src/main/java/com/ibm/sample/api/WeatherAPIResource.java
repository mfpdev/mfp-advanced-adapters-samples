/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

package com.ibm.sample.api;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.AddressComponent;
import com.google.maps.model.AddressComponentType;
import com.google.maps.model.GeocodingResult;
import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.sample.api.ws.Weather;
import com.ibm.sample.api.ws.WeatherReturn;
import io.swagger.annotations.*;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.xml.ws.WebServiceException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@SwaggerDefinition(
        info = @Info(
                description = "Uses a WSDL/SOAP Service and the google geocoding service to lookup tempreture for an address ",
                version = "V8.0.0beta",
                title = "Sample API that looks up the tempreture for an address",
                termsOfService = "IBM Terms and Conditions apply",
                contact = @Contact(
                        name = "MFP Team"
                ),
                license = @License(
                        name = "IBM Samples License"
                )
        )
)
@Api(value = "Temperature Lookup API")
@Path("/temperature")
public class WeatherAPIResource {
    /*
     * For more info on JAX-RS see
	 * https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */

    // Define logger (Standard java.util.Logger)
    static Logger logger = Logger.getLogger(WeatherAPIResource.class.getName());

    // Inject the MFP configuration API:
    @Context
    ConfigurationAPI configApi;

	/*
	 * Path for method:
	 * "<server address>/mfp/api/adapters/WeatherAPI/users/{username}"
	 */

    @ApiOperation(value = "Lookup the weather at a specified address",
            notes = "Calls the google geocoding service and a Weather WS-* Service to return the temperature at a specific address .")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Greeting message returned"),
            @ApiResponse(code = 400, message = "Wrong address"),
            @ApiResponse(code = 500, message = "Backend access error")
    })
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/weather-lookup")
    public Map<String, String> lookupTemperature(@ApiParam(value = "Address where we lookup the weather", required = true) @QueryParam("address") String address) {

        // We need an address to work with... lets see that we got something meaningful
        address = address == null ? "" : address.trim();
        logger.fine(String.format("weather-lookup for [%s]", address));

        if (address.isEmpty()) {
            logger.info(String.format("weather-lookup address [%s] is empty", address));
            throw new BadRequestException(String.format("Address [%s] is invalid", address));
        }

        String fullAddress = null;
        String postalCode = null;
        try {
            final GeoApiContext context = new GeoApiContext().setApiKey(configApi.getPropertyValue("apiKey"));
            final GeocodingResult[] results = GeocodingApi.geocode(context, address).await();

            for (final GeocodingResult r : results) {
                for (final AddressComponent c : r.addressComponents) {
                    for (final AddressComponentType t : c.types)
                        if (t.compareTo(AddressComponentType.POSTAL_CODE) == 0) {
                            postalCode = c.longName;
                            fullAddress = r.formattedAddress;
                            break;
                        }

                    if (postalCode != null)
                        break;
                }

                if (postalCode != null)
                    break;
            }
        } catch (final Exception e) {
            e.printStackTrace();
            // Something went wrong here
            logger.log(Level.SEVERE, "Unexpected error when access the geolocation service", e);
            throw new InternalServerErrorException("Unexpected error", e);
        }

        logger.fine(String.format("weather-lookup address [%s] Postal Code [%s], now looking up weather", fullAddress, postalCode));

        String temperature = null;

        if (postalCode != null) {
            try {
                final Weather w = new Weather();
                final WeatherReturn r = w.getWeatherSoap().getCityWeatherByZIP(postalCode);
                temperature = r.getTemperature();
            } catch (final WebServiceException e) {
                // Something went wrong here
                logger.log(Level.SEVERE, "Unexpected error when access the weather service", e);
                throw new InternalServerErrorException("Unexpected error accessing the weather service", e);
            }
        }

        Map<String, String> rc = new HashMap<>();
        rc.put("address", fullAddress);
        rc.put("temp", temperature);
        return rc;
    }
}
