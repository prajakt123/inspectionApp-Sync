define({ 

  //Type your controller code here 
  /**
   * @function
   *
   */
  onFormPostShow:function(){
    debugger;
    if(this.isFreshLaunch()===true){
      this.navigateToIntroForm();
    }else{
      this.setUpSync();
    }
  },
  setUpSync:function(){

    var options = {"deviceDbEncryptionKey" : "sample"};
    function setupSuccess(response){
      kony.application.dismissLoadingScreen();
      this.navigateToLoginForm();
      //alert(response);
      //this.startSync();
    }
    function setupFailure(response){
      kony.application.dismissLoadingScreen();
      alert(response.message);
    }
    try{
      //kony.application.showLoadingScreen(""," Setting up your app \nPlease wait...",constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true,null);
      kony.application.showLoadingScreen("","",constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true,null);
      KNYMobileFabric.OfflineObjects.setup(setupSuccess.bind(this), setupFailure.bind(this));
      //KNYMobileFabric.OfflineObjects.reset(setupSuccess.bind(this),setupFailure.bind(this));
    }catch(excp){
      kony.print("Excpetion: "+excp);
      kony.application.dismissLoadingScreen();
    }    
  },
  /**
   * @function
   *
   */
  isFreshLaunch:function(){
    var status=kony.store.getItem("IS_FRESH_LAUNCH");
    if(status===null || status===undefined){
      status=true;
    }else{
      status=false;
    }
    return status;
  },
  /**
   * @function
   *
   */
  navigateToIntroForm:function(){
    try{
      var navObj=new kony.mvc.Navigation("frmIntro");
      navObj.navigate();
    }catch(excp){
      kony.print("### Exception occured while navigating to the intro form: "+JSON.stringify(excp));
    }
  },
  /**
   * @function
   *
   */
  navigateToLoginForm:function(){
    try{
      var navObj=new kony.mvc.Navigation("frmLogin");
      navObj.navigate();
    }catch(excp){
      kony.print("### Exception occured while navigating to the intro form: "+JSON.stringify(excp));
    }
  }
});