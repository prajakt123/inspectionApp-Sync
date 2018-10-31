define({ 

  //Type your controller code here 
  /**
   * @function
   *
   */
  onNavigate:function(){
    if(!InspectionUtil.isNetworkAvailable()){
      this.view.loadingScreen.show("offline",2);
    }
  },
  /**
   * @function
   *
   */
  onFormPreShow:function(){
    var self=this;
    var config={};
    config["statusChange"]=function(isOnline){
      if(isOnline){
        self.view.loadingScreen.hide(2);
      }else{
        self.view.loadingScreen.show("offline",2);
      }
    }
    kony.net.setNetworkCallbacks(config);
  },
  /**
   * @function
   *
   */
  onPostShow:function(){
    /*var self=this;
    var config={};
    config["statusChange"]=function(isOnline){
      if(isOnline){
        self.view.loadingScreen.hide(2);
      }else{
        self.view.loadingScreen.show("offline",2);
      }
    }
    kony.net.setNetworkCallbacks(config);*/
    this.view.pdfviewer.setURL("http://forms.kony.com/rs/konysolutions/images/DS-Kony-Marketplace.pdf");
  },


});