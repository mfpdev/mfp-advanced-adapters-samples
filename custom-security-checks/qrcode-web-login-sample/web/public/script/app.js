var wlInitOptions = {
    mfpContextRoot: '/mfp',
    applicationId: 'com.sample.qrcode'
};


QRCodeChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("qrcode-login");

QRCodeChallengeHandler.handleChallenge = function (challenge) {
    var qrImage = document.getElementById("qrCode");
    qrImage.src = "data:image/jpg;base64," + challenge.qrCode;
};

function getWebUser() {
    var resourceRequest = new WLResourceRequest("/adapters/QRCodeWebLogin/user", WLResourceRequest.GET);

    resourceRequest.send().then(
        function (response) {
            alert (JSON.stringify(response));
        },
        function (error) {
            alert(error)
        }
    );
}

WL.Client.init(wlInitOptions).then(
    function () {
        var resourceRequest = new WLResourceRequest("/adapters/QRCodeWebLogin/init", WLResourceRequest.POST);

        resourceRequest.send().then(
            function (response) {
                getWebUser ();
            },
            function (error) {
                alert(error)
            }
        );

    }, function (error) {
        alert(error);
    }
);
