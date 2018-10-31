define({ 
  identitySvc:null,
  userAttribute:{},
  /**
   * @function
   *
   */
  onNavigate:function(){
    if(!InspectionUtil.isNetworkAvailable()){
      this.view.loadingScreen.show("offline",2);
    }
    debugger;
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
  onFormPostShow:function(){
    debugger;
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
  },

  /**
   * @function
   *
   */
  doLogin:function(){
    debugger;
    var options = {};

    try{
      options["userid"] = this.view.LoginComponent.getEmail();
      options["password"] = this.view.LoginComponent.getPassword();
      options["loginOptions"]={};
      options["loginOptions"]["isOfflineEnabled"]=true;
      var identitySvc = KNYMobileFabric.getIdentityService("customLogin");
      identitySvc.login(options,this._loginSuccess.bind(this,identitySvc),function(err){
        this.view.LoginComponent.resetLoading();
        var toast=new kony.ui.Toast({"text":"Invalid user name or password","duration":constants.TOAST_LENGTH_SHORT });
        toast.show();
        //  alert("Login Failure"+JSON.stringify(err));
      }.bind(this));
      this.view.LoginComponent.setLoading();
    }catch(excp){
      debugger;
      kony.print("#### Exception occured while trying to login ####:"+JSON.stringify(excp));
      this.view.LoginComponent.resetLoading();
    }
  },
  _loginSuccess: function(identityService,res){
    //alert("Login Success"+JSON.stringify(res));
    this.view.LoginComponent.resetLoading();
    identityService.getUserAttributes(function(result) {
      debugger;
      if(typeof result==='object' && result!==null){
        var userId;
        if(typeof result.user_id==='string' && (result.user_id).indexOf("User000")>-1){
          userId=(result.user_id).split("User000");
          if(Array.isArray(userId) && userId.length>1){
            userId=userId[1];
          }else{
            userId=null;
          }
        }
        this.userAttribute["userid"]=userId;
        this.userAttribute["userRole"]=result.user_role;
        this.userAttribute["firstName"]=result.firstName;
        this.userAttribute["lastName"]=result.lastName;
        this.userAttribute["email"]=result.email;
        kony.store.setItem("USER_INFO",this.userAttribute);
        if(this.userAttribute.userRole.toLowerCase()=="member"){
          try{
            var navObj=new kony.mvc.Navigation("frmInspectionsList");
            navObj.navigate(this.userAttribute);
            //navObj.navigate([]);
          }catch(excp){
            alert(JSON.stringify(excp));
          }
        }
        else{
          try{
            var navObj=new kony.mvc.Navigation("frmInspectionCreation");
            navObj.navigate(this.userAttribute);
          }catch(excp){
            alert(JSON.stringify(excp));
          }
        }
        this.view.LoginComponent.resetLoading();

      }

    }.bind(this), function(error) {
      this.view.LoginComponent.resetLoading();
      alert("failure callback for getUserAttributes. Error :"+JSON.stringify(error));
    }.bind(this));
  },
  _loginFailure: function(response){

  }

});