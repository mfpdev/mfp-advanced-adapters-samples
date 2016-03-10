package social.sample.ibm.com.sociallogin;


import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.appevents.AppEventsLogger;
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
import com.facebook.FacebookSdk;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URI;
import java.util.Arrays;

public class MainActivity extends AppCompatActivity implements
        GoogleApiClient.OnConnectionFailedListener,
        View.OnClickListener {

    public static final String FACEBOOK_PERMISSION_PUBLIC_PROFILE = "public_profile";

    private static final String TAG = "SocialLogin";
    private static final int RC_GET_TOKEN = 9002;

    //Flag to know from where we signInWithGoogle
    protected boolean isSignInFromChallenge = false;

    protected enum Vendor {
        GOOGLE("google"),
        Facebook("facebook");
        private final String value;

        /**
         * @param value
         */
        private Vendor(final String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return value;
        }
    }

    private CallbackManager facebookCallbackManager;
    protected Vendor currentVendor = Vendor.GOOGLE;

    //Google SignIn
    private GoogleApiClient mGoogleApiClient;
    private GoogleSignInOptions googleSignInOptions;

    private SocialLoginChallengeHandler challengeHandler;
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

        challengeHandler = new SocialLoginChallengeHandler("socialLogin", this);
        WLClient.getInstance().registerChallengeHandler(challengeHandler);



        initGoogleSDK();
        initFacebookSDK();

        //Init Analytics && Logger
        WLAnalytics.init(this.getApplication());
        WLAnalytics.enable();
        Logger.setContext(this);
        Logger.setCapture(true);

        Logger.updateConfigFromServer();

        wlLogger = Logger.getInstance(TAG);

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
                    .requestIdToken(getString(R.string.googleServerIdToken)).requestEmail()
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
        if (requestCode == RC_GET_TOKEN) {
            // Google
            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            handleGoogleSignInResult(result);
        } else {
            // Facebook
            facebookCallbackManager.onActivityResult(requestCode, resultCode, data);
        }
    }

    private void handleGoogleSignInResult(GoogleSignInResult result) {
        wlLogger.debug("handleSignInResult:" + result.isSuccess());
        if (result.isSuccess()) {
            // Signed in successfully, show authenticated UI.
            GoogleSignInAccount account = result.getSignInAccount();
            if (isSignInFromChallenge) {
                challengeHandler.submitChallengeAnswer(getCredentials(Vendor.GOOGLE.value, account.getIdToken()));
            } else {
                loginToMFPWithSocialVendor(Vendor.GOOGLE.value, account.getIdToken());
            }
        } else {
            wlLogger.debug("Signed in failed:" + result.getStatus());
        }
    }

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

    @Nullable
    private JSONObject getCredentials(String vendor, String token) {
        JSONObject credentials = new JSONObject();
        try {
            credentials.put("token", token);
            credentials.put("vendor", vendor);
        } catch (JSONException e) {
            wlLogger.debug(e.getMessage());
            return null;
        }
        return credentials;
    }

    /**
     * Call adapter which protected with scope "socialLogin"
     *
     * @param v
     */
    private void callProtectedAdapter(View v) {
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

    private void updateStatus(final String msg) {
        runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        statusView.setText(msg);
                    }
                }
        );
    }

    protected void signInWithFacebook() {
        facebookCallbackManager = CallbackManager.Factory.create();
        LoginManager.getInstance().registerCallback(facebookCallbackManager, new FacebookCallback<LoginResult>() {
            @Override
            public void onSuccess(LoginResult loginResult) {
                MainActivity.this.loginToMFPWithSocialVendor(Vendor.Facebook.value, loginResult.getAccessToken().getToken());
            }

            @Override
            public void onCancel() {
                wlLogger.debug("Cancel Facebook Login");
            }

            @Override
            public void onError(FacebookException error) {
                wlLogger.debug("Facebook Login error: " + error.getMessage());
            }
        });

        AccessToken token = AccessToken.getCurrentAccessToken();
        if (token != null && !token.isExpired()) {
            MainActivity.this.loginToMFPWithSocialVendor(Vendor.Facebook.value, AccessToken.getCurrentAccessToken().getToken());
        } else {
            LoginManager.getInstance().logInWithReadPermissions(this, Arrays.asList(FACEBOOK_PERMISSION_PUBLIC_PROFILE));
        }
    }

    protected void signInWithGoogle() {
        Intent signInIntent = Auth.GoogleSignInApi.getSignInIntent(mGoogleApiClient);
        startActivityForResult(signInIntent, RC_GET_TOKEN);
    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
        wlLogger.debug("onConnectionFailed:" + connectionResult);
    }


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
                this.callProtectedAdapter(v);
                break;
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Logs 'install' and 'app activate' App Events.
        AppEventsLogger.activateApp(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        // Logs 'app deactivate' App Event.
        AppEventsLogger.deactivateApp(this);
    }
}
