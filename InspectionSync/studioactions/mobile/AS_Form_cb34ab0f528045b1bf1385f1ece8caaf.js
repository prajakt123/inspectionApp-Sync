function AS_Form_cb34ab0f528045b1bf1385f1ece8caaf(eventobject) {
    var config = {};
    config["statusChange"] = function(isOnline) {
        if (isOnline) {
            alert("online");
            //self.view.loadingScreen.show(1,"connecting");
            //self.view.loadingScreen.hide(2);
        } else {
            alert("offline");
            //self.view.loadingScreen.show(2,"offline");
        }
    }
    kony.net.setNetworkCallbacks(config);
}