define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {

    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {

    },
    getEmail:function()
    {
      return this.view.txtEmail.getText();
    },
    getPassword:function()
    {
      return this.view.txtPassword.getText();
    },
    setLoading:function()
    {
      this.view.imgSignin.src="loader.gif";
    },
    resetLoading:function()
    {
      this.view.imgSignin.src="signin.png";
    },
    onSign : function(){
      this.onSignIn();
    }
  };
});