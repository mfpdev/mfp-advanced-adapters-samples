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

package com.github.mfpdev.sample.socialWatson;


import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.github.mikephil.charting.charts.BarChart;
import com.github.mikephil.charting.charts.Chart;
import com.github.mikephil.charting.charts.PieChart;
import com.github.mikephil.charting.data.BarData;
import com.github.mikephil.charting.data.BarDataSet;
import com.github.mikephil.charting.data.BarEntry;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.PieData;
import com.github.mikephil.charting.data.PieDataSet;
import com.github.mikephil.charting.utils.ColorTemplate;
import com.jayway.jsonpath.JsonPath;
import com.worklight.common.Logger;
import com.worklight.common.WLAnalytics;
import com.worklight.wlclient.api.WLClient;
import com.worklight.wlclient.api.WLFailResponse;
import com.worklight.wlclient.api.WLResourceRequest;
import com.worklight.wlclient.api.WLResponse;
import com.worklight.wlclient.api.WLResponseListener;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URI;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;

/**
 * @author Ishai Borovoy
 * @since 14/03/2016
 */
public class AnalyzeMyFacebookActivity extends AppCompatActivity implements
        View.OnClickListener {

    public static final String FACEBOOK_PERMISSIONS = "public_profile,email,user_posts";
    private static final String SOCIAL_LOGIN_TAG = AnalyzeMyFacebookActivity.class.getPackage().getName();

    //JSON keys
    public static final String NAME_KEY = "name";
    public static final String SCORE_KEY = "score";
    public static final String PERSONALITY_KEY = "personality";
    public static final String TONE_KEY = "tone";
    public static final String TOKEN_KEY = "token";
    public static final String VENDOR_KEY = "vendor";

    //Chart titles
    public static final String PERSONALITY_BIG_5_TITLE = "Big 5";
    public static final String TONES_CHART_TITLE = "Tones";
    public static final String SOCIAL_LOGIN_SCOPE = "socialLogin";

    private CallbackManager facebookCallbackManager;
    private SocialLoginChallengeHandler socialLoginChallengeHandler;
    private TextView statusView;
    private ImageView userPictureView;
    private BarChart toneBarChart;
    private PieChart personalityPieChart;

    //Logger
    private Logger wlLogger;

    private final static String FACEBOOK_SOCIAL_VENDOR = "facebook";

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        facebookCallbackManager.onActivityResult(requestCode, resultCode, data);
    }

    /**
     * Click listener
     *
     * @param view the clicked view
     */
    @Override
    public void onClick(View view) {
        if (view.getId() == R.id.analyze_me) {
            this.analyzeMe();
            //Clean status and profile picture
            toneBarChart.clear();
            personalityPieChart.clear();
            resetUserProfilePic();
            resetStatus();
        }

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //Init Activity GUI
        setContentView(R.layout.activity_main);
        findViewById(R.id.analyze_me).setOnClickListener(this);
        statusView = (TextView) findViewById(R.id.statusTextView);
        userPictureView = (ImageView) findViewById(R.id.imageView);
        toneBarChart = (BarChart) findViewById(R.id.bar_chart);
        personalityPieChart = (PieChart) findViewById(R.id.pie_chart);

        //Clear the default text from charts
        toneBarChart.setNoDataText("");
        personalityPieChart.setNoDataText("");

        //Init WLClient
        WLClient.createInstance(this);
        socialLoginChallengeHandler = new SocialLoginChallengeHandler("socialLogin", this);

        //Register the SocialLoginChallengeHandler
        WLClient.getInstance().registerChallengeHandler(socialLoginChallengeHandler);
        initFacebookSDK();

        //Init Analytics && Logger
        initAnalytics();

        wlLogger = Logger.getInstance(SOCIAL_LOGIN_TAG);
        wlLogger.debug(getClass().getName() + " init");
    }

    /**
     * Sign in to Facebook.  On success call to login into socialLogin scope
     */
    protected void signInWithFacebook() {
        facebookCallbackManager = CallbackManager.Factory.create();
        LoginManager.getInstance().registerCallback(facebookCallbackManager, new FacebookCallback<LoginResult>() {
            @Override
            public void onSuccess(LoginResult loginResult) {
                submitChallenge(loginResult.getAccessToken().getToken());
            }

            @Override
            public void onCancel() {
                socialLoginChallengeHandler.cancel();
                wlLogger.debug("Facebook Login canceled");
            }

            @Override
            public void onError(FacebookException error) {
                socialLoginChallengeHandler.cancel();
            }
        });

        //Try to get cached Facebook token first
        AccessToken token = AccessToken.getCurrentAccessToken();
        if (token != null && !token.isExpired()) {
            AnalyzeMyFacebookActivity.this.submitChallenge(token.getToken());
        } else {
            LoginManager.getInstance().logInWithReadPermissions(this, Collections.singletonList(FACEBOOK_PERMISSIONS));
        }
    }

    /**
     * Init the Facebook SDK
     */
    private void initFacebookSDK() {
        if (facebookCallbackManager == null) {
            FacebookSdk.sdkInitialize(getApplicationContext());
            facebookCallbackManager = CallbackManager.Factory.create();
        }
    }

    /**
     * Call adapter which protected with scope "socialLogin", this adapter return analyzed data based on the logged in Facebook account
     */
    private void analyzeMe() {
        final ProgressDialog progressDialog;
        progressDialog = ProgressDialog.show(this, "Please Wait...", "Analyzing Facebook..", false, true);

        WLResourceRequest wlResourceRequest = new WLResourceRequest(URI.create("/adapters/analyzeMyFacebookAdapter/analyze"), WLResourceRequest.GET, SOCIAL_LOGIN_SCOPE);
        wlResourceRequest.send(new WLResponseListener() {
            @Override
            public void onSuccess(WLResponse wlResponse) {
                final JSONObject responseJSON = wlResponse.getResponseJSON();
                try {
                    String userDisplayName = responseJSON.getString("name");

                    String status = "Hello " + userDisplayName;
                    if (!responseJSON.isNull("email")) {
                        status += " (" + responseJSON.getString("email") + ") ";
                    }

                    String gender = getPicGender(responseJSON);
                    String age = getPicAge(responseJSON);
                    if (gender != null)
                        status += "\nFrom your picture it seems that your gender is: " + getPicGender(responseJSON).toLowerCase() + ".";
                    if (age != null)
                        status += "\nFrom your picture it seems that your age is " + getPicAge(responseJSON) + ".";

                    status += "\n\nThe diagrams below analyze your feeds personality (Big 5) and tones:";

                    drawToneGraph(responseJSON);
                    if (!responseJSON.isNull("personality")) {
                        drawPieGraph(responseJSON);
                    }

                    updateStatus(status);
                    progressDialog.dismiss();

                    String userPictureURL = getPicURL(responseJSON);

                    updateProfilePicture(userPictureURL);
                } catch (Exception e) {
                    String error = "Parsing JSON failed";
                    updateStatus(error + " " + e.getMessage());
                    wlLogger.error("Parsing JSON failed", e);
                }
            }

            @Override
            public void onFailure(WLFailResponse wlFailResponse) {
                progressDialog.dismiss();
                updateStatus("Failed to analyze: " + wlFailResponse.getStatus() + " " + wlFailResponse.getErrorMsg() + " " + wlFailResponse.getResponseText());
            }
        });
    }

    /**
     * Draw the tone graph
     * @param responseJSON the JSON response
     * @throws JSONException
     */
    private void drawToneGraph(JSONObject responseJSON) throws JSONException {
        JSONArray tones = (JSONArray) responseJSON.get(TONE_KEY);
        ArrayList<BarEntry> toneEntries = new ArrayList<>();
        ArrayList<String> toneLabels = new ArrayList<>();

        for (int i = 0; i < tones.length(); i++) {
            JSONObject tone = (JSONObject) tones.get(i);
            toneLabels.add(i, (String) tone.get(NAME_KEY));
            double score = (double) tone.get(SCORE_KEY);
            toneEntries.add(new BarEntry((float) score, i));
        }

        BarDataSet dataset = new BarDataSet(toneEntries, TONES_CHART_TITLE);
        dataset.setColors(ColorTemplate.COLORFUL_COLORS);
        BarData data = new BarData(toneLabels, dataset); // initialize Piedata
        toneBarChart.setData(data);
        toneBarChart.setDescription(TONES_CHART_TITLE);
        updateChart(toneBarChart);
    }

    /**
     * Draw a pie graph with the personality insight big 5
     * @param responseJSON - the JSON response
     * @throws JSONException
     */
    private void drawPieGraph(JSONObject responseJSON) throws JSONException {
        JSONArray big5 = (JSONArray) responseJSON.get(PERSONALITY_KEY);
        ArrayList<Entry> big5Entries = new ArrayList<>();
        ArrayList<String> big5Labels = new ArrayList<>();


        for (int i = 0; i < big5.length(); i++) {
            JSONObject tone = (JSONObject) big5.get(i);
            big5Labels.add((String) tone.get(NAME_KEY));
            double score = (double) tone.get(SCORE_KEY);
            big5Entries.add(new Entry((float) score, i));
        }

        PieDataSet dataSet = new PieDataSet(big5Entries, PERSONALITY_BIG_5_TITLE);
        dataSet.setColors(ColorTemplate.COLORFUL_COLORS);
        PieData data = new PieData(big5Labels, dataSet);
        personalityPieChart.setData(data);
        personalityPieChart.setDescription(PERSONALITY_BIG_5_TITLE);
        updateChart(personalityPieChart);
    }

    private void updateChart(final Chart chart) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                chart.notifyDataSetChanged();
                chart.invalidate();
            }
        });
    }

    /**
     * Get the picture URL for Facebook
     * @param responseJSON - the JSON response
     * @return - the Facebook picture URL
     * @throws JSONException
     */
    private String getPicURL(JSONObject responseJSON) throws JSONException {
        String pictureKey = "$.pic.url";
        return JsonPath.read(responseJSON.toString(), pictureKey);
    }

    /**
     * Analyze the age from the the profile picture using Watson
     * @param responseJSON - the JSON response
     * @return - the age range of the face in the picture according to Watson analyze
     * @throws JSONException
     */
    private String getPicAge(JSONObject responseJSON) throws JSONException {
        String pictureKey = "$.pic.imageFaces[0].age.ageRange";
        String age = null;
        try {
            age = JsonPath.read(responseJSON.toString(), pictureKey);
        } catch (Exception e){
            wlLogger.error("Cannot identify age from picture", e);
        }
        return age;
    }

    /**
     * Analyze the gender from the the profile picture using Watson
     * @param responseJSON - the JSON response
     * @return the gender of the profile picture according ro Watson analyze
     */
    private String getPicGender(JSONObject responseJSON) {
        String pictureKey = "$.pic.imageFaces[0].gender.gender";
        String gender = null;
        try {
            gender = JsonPath.read(responseJSON.toString(), pictureKey);
        } catch (Exception e){
            wlLogger.error("Cannot identify gender from picture", e);
        }
        return gender;
    }

    /**
     * Init the analytics SDK
     */
    private void initAnalytics() {
        WLAnalytics.init(this.getApplication());
        WLAnalytics.enable();
        Logger.setContext(this);
        Logger.setCapture(true);
        Logger.updateConfigFromServer();
    }

    /**
     * Update the status text view
     *
     * @param status the status
     */
    private void updateStatus(final String status) {
        runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        statusView.setText(status);
                        wlLogger.debug(status);
                        Logger.send();
                    }
                }
        );
    }

    /**
     * Update user profile picture if exist
     *
     * @param picture the user profile picture
     * @throws Exception
     */
    private void updateProfilePicture(final String picture) throws Exception {
        URL userPictureURL = new URL(picture);
        final Drawable userPicture = Drawable.createFromStream(userPictureURL.openStream(), "src");
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                userPictureView.setImageDrawable(userPicture);
            }
        });
    }

    /**
     * Reset the user profile picture
     */
    private void resetUserProfilePic() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                userPictureView.setImageResource(0);
            }
        });
    }

    /**
     * Reset the user profile picture
     */
    private void resetStatus() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                statusView.setText("");
            }
        });
    }


    /**
     * Submit the social challenge with Facebook token
     * @param token - the facebook access_token
     */
    private void submitChallenge(String token) {
        JSONObject credentials = createJSONCredentials(FACEBOOK_SOCIAL_VENDOR, token);
        socialLoginChallengeHandler.submitChallengeAnswer(credentials);
    }

    /**
     * Create JSON credentials to send as challenge answer.
     * This is the format that the security check on server is exacted.
     *
     * @param vendor the social vendor
     * @param token  the returned token from the social vendor
     * @return JSONObject containing the credentials
     */
    private JSONObject createJSONCredentials(String vendor, String token) {
        JSONObject credentials = new JSONObject();
        try {
            credentials.put(TOKEN_KEY, token);
            credentials.put(VENDOR_KEY, vendor);
        } catch (JSONException e) {
            wlLogger.debug(e.getMessage());
        }
        return credentials;
    }
}
