define({ 
  /**
   * @function
   *
   * @param Obj 
   */
  onNavigate:function(Obj){
    if(!InspectionUtil.isNetworkAvailable()){
      this.view.loadingScreen.show("offline",2);
    }
    this._navigationData = Obj.userAttribute;
    this.setData(this._navigationData);
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
  _onClickBack: function(){
    var navObj=new kony.mvc.Navigation("frmInspectionsList");
    var navigationData = {};
    navigationData = this._navigationData;
    navObj.navigate(navigationData);
  },
  onClickofSignOut: function(){
    var navObj=new kony.mvc.Navigation("frmLogin");
    var navigationData = {};
    navObj.navigate(navigationData);
  },
  setData: function(data){
    this.view.lblUserFullName.text = data.firstName+" "+data.lastName;
    this.view.lblEmail.text = data.email;
    this.view.lblInitials.text = data.firstName.charAt(0)+data.lastName.charAt(0);
  },
  /**
   * @function
   *
   */
  onFormPostShow:function(){
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
  }

});