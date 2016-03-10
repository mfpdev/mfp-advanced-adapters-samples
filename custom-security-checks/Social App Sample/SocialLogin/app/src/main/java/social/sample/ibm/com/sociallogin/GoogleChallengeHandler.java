package social.sample.ibm.com.sociallogin;

import android.util.Log;

import com.worklight.wlclient.api.challengehandler.WLChallengeHandler;

import org.json.JSONObject;

/**
 * Created by ishaib on 09/03/16.
 */
public class GoogleChallengeHandler extends WLChallengeHandler {

    private MainActivity mainActivity;

    public GoogleChallengeHandler(String securityCheck, MainActivity activity) {
        super(securityCheck);
        this.mainActivity = activity;
    }

    @Override
    public void handleChallenge(JSONObject jsonObject) {
        Log.d("GoogleChallengeHandler", "handleChallenge");

        mainActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mainActivity.isSignInFromChallenge = true;
                mainActivity.signInWithGoogle();
            }
        });
    }
}
