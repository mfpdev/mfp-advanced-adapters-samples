/**
 * Copyright 2016 IBM Corp.
 * <p/>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p/>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p/>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package social.sample.ibm.com.sociallogin;


import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.worklight.common.Logger;
import com.worklight.common.WLAnalytics;
import com.worklight.wlclient.api.WLAuthorizationManager;
import com.worklight.wlclient.api.WLClient;
import com.worklight.wlclient.api.WLFailResponse;
import com.worklight.wlclient.api.WLLoginResponseListener;
import com.worklight.wlclient.api.WLResourceRequest;
import com.worklight.wlclient.api.WLResponse;
import com.worklight.wlclient.api.WLResponseListener;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URI;
import java.util.Collections;

public class MainActivity extends AppCompatActivity implements
        GoogleApiClient.OnConnectionFailedListener,
        View.OnClickListener {

    public static final String FACEBOOK_PERMISSION_PUBLIC_PROFILE = "public_profile";

    private static final String SOCIAL_LOGIN_TAG = "SocialLogin";
    private static final int GOOGLE_GET_TOKEN_INTENT = 9002;

    //Flag to know from where we signInWithGoogle
    protected boolean isSignInFromChallenge = false;

    //Vendor enum
    protected enum Vendor {
        GOOGLE("google"),
        Facebook("facebook");
        private final String value;

        /**
         * @param value the vendor string value
         */
        Vendor(final String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return value;
        }
    }

    private CallbackManager facebookCallbackManager;
    protected Vendor currentVendor = Vendor.Facebook;

    //Google SignIn
    private GoogleApiClient mGoogleApiClient;
    private GoogleSignInOptions googleSignInOptions;

    private SocialLoginChallengeHandler socialLoginChallengeHandler;
    private TextView statusView;

    //Logger
    private Logger wlLogger;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //Init UI
        setContentView(R.layout.activity_main);
        findViewById(R.id.sign_in_google).setOnClickListener(this);
        findViewById(R.id.sign_in_facebook).setOnClickListener(this);
        findViewById(R.id.call_adapter).setOnClickListener(this);
        statusView = (TextView) findViewById(R.id.statusTextView);

        //Init worklight
        WLClient.createInstance(this);

        socialLoginChallengeHandler = new SocialLoginChallengeHandler("socialLogin", this);
        WLClient.getInstance().registerChallengeHandler(socialLoginChallengeHandler);



        initGoogleSDK();
        initFacebookSDK();

        //Init Analytics && Logger
        WLAnalytics.init(this.getApplication());
        WLAnalytics.enable();
        Logger.setContext(this);
        Logger.setCapture(true);

        Logger.updateConfigFromServer();

        wlLogger = Logger.getInstance(SOCIAL_LOGIN_TAG);

        wlLogger.debug("Social Login init");
    }

    private void initFacebookSDK() {
        if (facebookCallbackManager == null) {
            FacebookSdk.sdkInitialize(getApplicationContext());
            facebookCallbackManager = CallbackManager.Factory.create();
        }
    }

    private void initGoogleSDK() {
        if (googleSignInOptions == null) {
            googleSignInOptions = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestIdToken(getString(R.string.google_server_client_id)).requestEmail()
                    .build();

            mGoogleApiClient = new GoogleApiClient.Builder(this)
                    .enableAutoManage(this /* FragmentActivity */, this /* OnConnectionFailedListener */)
                    .addApi(Auth.GOOGLE_SIGN_IN_API, googleSignInOptions)
                    .build();
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == GOOGLE_GET_TOKEN_INTENT) {
            // Google
            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            handleGoogleSignInResult(result);
        } else {
            // Facebook
            facebookCallbackManager.onActivityResult(requestCode, resultCode, data);
        }
    }

    /**
     * Handle Google Sign In
     * @param result result that return from onActivityResult
     */
    private void handleGoogleSignInResult(GoogleSignInResult result) {
        wlLogger.debug("handleSignInResult:" + result.isSuccess());
        if (result.isSuccess()) {
            // Signed in successfully, show authenticated UI.
            GoogleSignInAccount account = result.getSignInAccount();
            if (isSignInFromChallenge) {
                socialLoginChallengeHandler.submitChallengeAnswer(getCredentials(Vendor.GOOGLE.value, account.getIdToken()));
            } else {
                loginToMFPWithSocialVendor(Vendor.GOOGLE.value, account.getIdToken());
            }
        } else {
            wlLogger.debug("Signed in failed:" + result.getStatus());
        }
    }

    /**
     * Login to MFP server with the token which returned from the vendor (Google/Facebook)
     * @param vendor - vendor user has logged in with
     * @param token -  the returned token from the vendor (Google/Facebook)
     */
    private void loginToMFPWithSocialVendor(final String vendor, String token) {
        JSONObject credentials = getCredentials(vendor, token);
        if (credentials == null) return;

        WLAuthorizationManager.getInstance().login("socialLogin", credentials, new WLLoginResponseListener() {
            @Override
            public void onSuccess() {
                final String msg = String.format("Logged In successfully with %s", vendor);
                wlLogger.debug(msg);
                updateStatus(msg);
            }

            @Override
            public void onFailure(WLFailResponse wlFailResponse) {
                String msg = String.format("Logged In failed with %s", vendor);
                wlLogger.debug(msg);
                updateStatus(msg);
            }
        });
    }

    /**
     * Create JSON credentials in the as the Social Login Security Check expected on the Social Login Adapter
     * @param vendor the social vendor
     * @param token the returned token from the social vendor
     * @return JSONObject containing the credentials
     */
    private JSONObject getCredentials(String vendor, String token) {
        JSONObject credentials = new JSONObject();
        try {
            credentials.put("token", token);
            credentials.put("vendor", vendor);
        } catch (JSONException e) {
            wlLogger.debug(e.getMessage());
        }
        return credentials;
    }

    /**
     * Call adapter which protected with scope "socialLogin"
     */
    private void callProtectedAdapter() {
        WLResourceRequest wlResourceRequest = new WLResourceRequest(URI.create("/adapters/HelloSocialUser/hello"), "GET", "socialLogin");
        wlResourceRequest.send(new WLResponseListener() {
            @Override
            public void onSuccess(WLResponse wlResponse) {
                final String responseText = wlResponse.getResponseText();
                updateStatus(responseText);
                wlLogger.debug(responseText);
            }

            @Override
            public void onFailure(WLFailResponse wlFailResponse) {
                final String responseText = wlFailResponse.getResponseText();
                updateStatus(responseText);
                wlLogger.debug(responseText);
            }
        });
    }

    /**
     * Update the status text view
     * @param status the status
     */
    private void updateStatus(final String status) {
        runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        statusView.setText(status);
                    }
                }
        );
    }

    /**
     * Sign in to Facebook.  On success call to login into socialLogin scope
     */
    protected void signInWithFacebook() {
        facebookCallbackManager = CallbackManager.Factory.create();
        LoginManager.getInstance().registerCallback(facebookCallbackManager, new FacebookCallback<LoginResult>() {
            @Override
            public void onSuccess(LoginResult loginResult) {
                MainActivity.this.loginToMFPWithSocialVendor(Vendor.Facebook.value, loginResult.getAccessToken().getToken());
            }

            @Override
            public void onCancel() {
                if (isSignInFromChallenge) {
                    //socialLoginChallengeHandler.submitFailure(null);
                }
                wlLogger.debug("Cancel Facebook Login");
            }

            @Override
            public void onError(FacebookException error) {
                if (isSignInFromChallenge) {
                    //socialLoginChallengeHandler.submitFailure(null);
                }
                wlLogger.debug("Facebook Login error: " + error.getMessage());
            }
        });

        AccessToken token = AccessToken.getCurrentAccessToken();
        if (token != null && !token.isExpired()) {
            MainActivity.this.loginToMFPWithSocialVendor(Vendor.Facebook.value, AccessToken.getCurrentAccessToken().getToken());
        } else {
            LoginManager.getInstance().logInWithReadPermissions(this, Collections.singletonList(FACEBOOK_PERMISSION_PUBLIC_PROFILE));
        }
    }

    /**
     * Sign in to Google.  On success call to login into socialLogin scope
     */
    protected void signInWithGoogle() {
        Intent signInIntent = Auth.GoogleSignInApi.getSignInIntent(mGoogleApiClient);
        startActivityForResult(signInIntent, GOOGLE_GET_TOKEN_INTENT);
    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
        wlLogger.debug("onConnectionFailed:" + connectionResult);
    }


    /**
     * Listent o buttons clicks
     * @param v the clicked view
     */
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.sign_in_google:
                this.isSignInFromChallenge = false;
                currentVendor = Vendor.GOOGLE;
                signInWithGoogle();
                break;

            case R.id.sign_in_facebook:
                this.isSignInFromChallenge = false;
                currentVendor = Vendor.Facebook;
                signInWithFacebook();
                break;

            case R.id.call_adapter:
                this.callProtectedAdapter();
                break;
        }
    }
}
