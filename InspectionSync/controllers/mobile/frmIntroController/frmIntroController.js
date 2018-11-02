define({ 

  /**
   * @function
   *
   */
  onNavigate:function(){
    this.setAppIntroData();
  },
  setAppIntroData:function(){
    var segIntroData =[
      {
        "lblHeading":"Access Records, Anytime, Anywhere",
        "lblSubHeading":"Manage Workorders",
        "lblDetail":"Unified access to distributed information records across assets and locations",
        "btnGetStarted": {
           "isVisible": true,
            "skin":'sknBtnBlueFocus'
        }
      },
      {
        "lblHeading":"Digitize your workflow",
        "lblSubHeading":"Manage Workorders",
        "lblDetail":"Single portal to Create, Assign, Schedule, Execute orders on-the-go in a few simple steps",
        "btnGetStarted": {
          "isVisible": true,
          "skin":'sknBtnBlueFocus'
        }
      },
        {
        "lblHeading":"Fewer missed schedules, More efficient workforce",
        "lblSubHeading":"Manage Workorders",
        "lblDetail":"Remove manual paperwork, ensuring quick, smooth, and robust task execution",
        "btnGetStarted": {
          "isVisible": true,
           "skin":'sknBtnBlueNormal'
        }
      },
    ]
    this.view.segAppIntro.pageSkin = "sknIntroSeg";
    this.view.segAppIntro.removeAll();
    this.view.segAppIntro.setData(segIntroData);
    },
  
  onSegmentSwipe:function(){
  },
  /**
   * @function
   *
   */
  onGettingStartedClick:function(param){
    debugger;
    if(InspectionUtil.isNetworkAvailable()===true){
      this.setUpSync();
    }else{
      alert(app_constant.NO_NETWORK_MESSAGE);
    }
  },
  /**
   * @function
   *
   */
  setUpSync:function(){
    
    var options = {"deviceDbEncryptionKey" : "sample"};
    function setupSuccess(response){
      kony.application.dismissLoadingScreen();
      //alert(response);
      this.startSync();
      //this.startSync();
    }
    function setupFailure(response){
      kony.application.dismissLoadingScreen();
      alert(response.message);
    }
    try{
      //kony.application.showLoadingScreen(""," Setting up your app \nPlease wait...",constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true,null);
      kony.application.showLoadingScreen("sknLoading","Setting up..",constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true,null);
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
  startSync:function(){
    debugger;
    var syncOptions={};//"downloadBatchSize":"100",
    syncOptions.uploadBatchSize="200";
    // "uploadBatchSize":"200"};
    try{
      var syncObjService= new kony.sdk.KNYObjSvc(OBJECT_SERVICE.SYNC);
      //kony.application.showLoadingScreen(""," Syncing..",constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true,null);
      kony.application.showLoadingScreen("sknLoading","Syncing..",constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true,null);
      syncObjService.startSync(syncOptions,this.successCB.bind(this),this.failureCB,this.progressCB);
    }catch(excp){
      kony.print("Exception: "+excp);
      kony.application.dismissLoadingScreen();
    }
  },
  progressCB:function(result){
    kony.print("##########"+result);
  },
  /**
   * @function
   *
   * @param result 
   */
  failureCB:function(result){
    debugger;
    kony.application.dismissLoadingScreen();
    alert("SYnc failed: "+JSON.stringify(result));
  },
  successCB:function(response){
    debugger;
    kony.application.dismissLoadingScreen();
    kony.print(response);
    kony.store.setItem("IS_FRESH_LAUNCH", false);
    this.navigateToLoginForm();
    // this.navigateToLoginForm();
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