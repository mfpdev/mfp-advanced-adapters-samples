package social.sample.ibm.com.sociallogin;

import android.util.Log;

import com.worklight.wlclient.api.challengehandler.WLChallengeHandler;

import org.json.JSONObject;

/**
 * Created by ishaib on 09/03/16.
 */
public class SocialLoginChallengeHandler extends WLChallengeHandler {

    private MainActivity mainActivity;

    public SocialLoginChallengeHandler(String securityCheck, MainActivity activity) {
        super(securityCheck);
        this.mainActivity = activity;
    }

    @Override
    public void handleChallenge(JSONObject jsonObject) {

        mainActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mainActivity.isSignInFromChallenge = true;
                if (mainActivity.currentVendor == MainActivity.Vendor.GOOGLE) {
                    mainActivity.signInWithGoogle();
                } else {
                    mainActivity.signInWithFacebook();
                }

            }
        });
    }
}
