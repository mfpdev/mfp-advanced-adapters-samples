var wlInitOptions = {
    mfpContextRoot: '/mfp',
    applicationId: 'com.sample.qrcode'
};


QRCodeChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("qrcode");

QRCodeChallengeHandler.handleChallenge = function (challenge) {
    if (challenge.isRegistered) {
        QRCodeChallengeHandler.submitChallengeAnswer ({});
    } else  {
        document.getElementById("displayTxt").innerHTML = "To login use the QRCode Login App on your phone to scan the QR code";
        var qrImage = document.getElementById("qrCode");
        qrImage.src = "data:image/jpg;base64," + challenge.qrCode;
    }
};

function getWebUser() {
    var resourceRequest = new WLResourceRequest("/adapters/QRCodeWebLogin/user", WLResourceRequest.GET);

    resourceRequest.send().then(
        function (response) {
            document.getElementById("displayTxt").innerHTML = "Hello " + response.responseJSON["displayName"];
        },
        function (error) {
            alert(JSON.stringify(error));
        }
    );
}

WL.Client.init(wlInitOptions).then(
    function () {
        getWebUser ();
    }, function (error) {
        alert(error);
    }
);
