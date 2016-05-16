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

package com.github.mfpdev.adapters.sample.socialWatson;

import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;
import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;
import com.ibm.mfp.server.security.external.resource.AdapterSecurityContext;
import com.ibm.watson.developer_cloud.personality_insights.v2.PersonalityInsights;
import com.ibm.watson.developer_cloud.personality_insights.v2.model.Profile;
import com.ibm.watson.developer_cloud.personality_insights.v2.model.Trait;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.ToneAnalyzer;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.model.ToneScore;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@Api(value = "Analyze some data from logged in facebook account")
@Path("/analyze")
public class AnalyzeMyFacebookAdapterResource {
    private static final String ALCHEMY_API_KEY = "alchemyAPIKey";

    //JSON keys
    private static final String NAME_KEY = "name";
    private static final String SCORE_KEY = "score";

    //Graph API url prefix for /me
    private static final String FACEBOOK_GRAPH_API = "https://graph.facebook.com/v2.5/me/";

    //Watson configuration keys in adapter.xml
    private static final String PERSONALITY_INSIGHT_USER = "personalityInsightUser";
    private static final String PERSONALITY_INSIGHT_PASSWORD = "personalityInsightPassword";
    private static final String TONE_ANALYZER_USER = "toneAnalyzerUser";
    private static final String TONE_ANALYZER_PASSWORD = "toneAnalyzerPassword";

    // Define logger (Standard java.util.Logger)
    private static Logger logger = Logger.getLogger(AnalyzeMyFacebookAdapterResource.class.getName());

    // Inject the MFP configuration API
    @Context
    ConfigurationAPI configApi;

    // Inject the MFP security context
    @Context
    private AdapterSecurityContext securityContext;

    //Http client to fetch Facebook feeds and some Watson services
    private CloseableHttpClient httpClient = HttpClients.createDefault();

    private ResponseHandler<String> responseHandler = new ResponseHandler<String>() {
        @Override
        public String handleResponse(
                final HttpResponse response) throws IOException {
            int status = response.getStatusLine().getStatusCode();
            if (status >= 200 && status < 300) {
                HttpEntity entity = response.getEntity();
                return entity != null ? EntityUtils.toString(entity) : null;
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
        }
    };

    @ApiOperation(value = "Return some insights from the authenticated facebook account", notes = "Call watson to analyze the facebook picture with for age range and gender and analyze user feeds for personality and tone.")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Success returning result from watson and Facebook")})
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @OAuthSecurity(scope = "socialLogin")
    public JSONObject analyze() {
        AuthenticatedUser user = securityContext.getAuthenticatedUser();
        //Get the facebook token
        String fbAccessToken = (String) user.getAttributes().get("originalToken");
        JSONObject analyzeResults = new JSONObject();

        Map<String, Object> userAttributes = securityContext.getAuthenticatedUser().getAttributes();
        Map pic = (Map) userAttributes.get("picture");
        String imageURL = (String) ((Map) pic.get("data")).get("url");

        JSONObject taggingResult = getImageTaggingFromWatson(imageURL);

        String feed = getMyFacebookFeed(fbAccessToken);

        analyzeResults.put("tone", getTone(feed));
        if (feed != null && feed.split(" ").length > 100) {
            analyzeResults.put("personality", getBig5(feed));
        }
        analyzeResults.put("pic", taggingResult);
        analyzeResults.put("email", userAttributes.get("email"));
        analyzeResults.put("name", securityContext.getAuthenticatedUser().getDisplayName());
        return analyzeResults;
    }

    private JSONArray getTone(String feed) {
        ToneAnalyzer service = new ToneAnalyzer(ToneAnalyzer.VERSION_DATE_2016_02_11);
        service.setUsernameAndPassword(configApi.getPropertyValue(TONE_ANALYZER_USER), configApi.getPropertyValue(TONE_ANALYZER_PASSWORD));
        List<ToneScore> tones = service.getTone(feed).getDocumentTone().getTones().get(0).getTones();

        JSONArray tonesArray = new JSONArray();
        for (ToneScore score : tones) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(NAME_KEY, score.getName());
            jsonObject.put(SCORE_KEY, score.getScore() * 100);
            tonesArray.add(jsonObject);
        }

        return tonesArray;
    }

    /**
     * Get the facebook feed
     *
     * @param fbAccessToken - the facebook access token
     * @return String for facebook feed
     */
    private String getMyFacebookFeed(String fbAccessToken) {
        JSONArray feedsArray = (JSONArray) getFacebookFeeds(fbAccessToken).get("data");
        String feed = "";
        for (Object feedObject : feedsArray) {
            JSONObject feedJSON = (JSONObject) feedObject;
            Object messageFromFeed = feedJSON.get("message");
            if (messageFromFeed != null && ((String) messageFromFeed).substring(0, 1).matches("\\w+")) {
                feed += " " + messageFromFeed;
            }
        }
        return feed;
    }

    /**
     * Call to personality insight service with user feed, and return the Big5 score
     *
     * @param feed - facebook feed
     * @return JSONArray with Big5 values (see https://www.wikiwand.com/en/Big_Five_personality_traits)
     */
    private JSONArray getBig5(String feed) {
        PersonalityInsights service = new PersonalityInsights();
        service.setUsernameAndPassword(configApi.getPropertyValue(PERSONALITY_INSIGHT_USER), configApi.getPropertyValue(PERSONALITY_INSIGHT_PASSWORD));

        Profile profile = service.getProfile(feed);

        JSONArray traitsArray = new JSONArray();
        List<Trait> traits = profile.getTree().getChildren().get(0).getChildren().get(0).getChildren();
        for (Trait trait : traits) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(NAME_KEY, trait.getName());
            jsonObject.put(SCORE_KEY, trait.getPercentage() * 100);
            traitsArray.add(jsonObject);
        }

        return traitsArray;
    }

    /**
     * Get authenticated facebook user feed
     *
     * @param facebookAccessToken - the facebook access token for the logged in user
     * @return JSONObject response from Faceook
     */
    private JSONObject getFacebookFeeds(String facebookAccessToken) {
        HttpGet httpGetRequest = new HttpGet(FACEBOOK_GRAPH_API + "feed?&access_token=" + facebookAccessToken);
        return getJSONObjectFromRequest(httpGetRequest);
    }

    /**
     * Get the facebook user picture analyze from watson
     *
     * @param imageURL - the facebook image url to analyze
     * @return JSONObject contain the image analyse
     */
    private JSONObject getImageTaggingFromWatson(String imageURL) {
        HttpGet httpget;
        try {
            httpget = new HttpGet("http://gateway-a.watsonplatform.net/calls/url/URLGetRankedImageFaceTags?url=" +
                    URLEncoder.encode(imageURL, "UTF-8")
                    + "&apikey=" + configApi.getPropertyValue(ALCHEMY_API_KEY)
                    + "&outputMode=json");
        } catch (UnsupportedEncodingException e) {
            return null;
        }
        return getJSONObjectFromRequest(httpget);
    }


    /**
     * Return JSON object from facebook graph API
     *
     * @param request - the request
     * @return JSONObJSONObjectject response
     */
    private JSONObject getJSONObjectFromRequest(HttpUriRequest request) {
        JSONObject jsonObject = null;
        try {
            String responseBody = httpClient.execute(request, responseHandler);
            jsonObject = JSONObject.parse(responseBody);
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Issue while trying to invoke a request " + request.getURI() + " " + e.getMessage(), e);
        }
        return jsonObject;
    }
}
