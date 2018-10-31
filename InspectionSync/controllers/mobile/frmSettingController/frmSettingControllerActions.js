define({
    /*
      This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    /** onClick defined for btnSetting **/
    AS_Button_i0722000faca4c9f8c0b945cd4770df8: function AS_Button_i0722000faca4c9f8c0b945cd4770df8(eventobject) {
        var self = this;
        this.resetSync();
    },
    /** onClick defined for btnSync **/
    AS_Button_de4092219f1e4341972a391c694fff14: function AS_Button_de4092219f1e4341972a391c694fff14(eventobject) {
        var self = this;
        this.startSync();
    },
    /** onClick defined for btnFetch **/
    AS_Button_dacf20f737134c05a5457f3f8cb80fc6: function AS_Button_dacf20f737134c05a5457f3f8cb80fc6(eventobject) {
        var self = this;
        this.fetchRecords();
    },
    /** onClick defined for btnCreateInspection **/
    AS_Button_a0d3901e9d064675bed07eaa7330955c: function AS_Button_a0d3901e9d064675bed07eaa7330955c(eventobject) {
        var self = this;
        return self.createInspection.call(this);
    },
    /** onClick defined for btnUpdate **/
    AS_Button_dddfe476d6dd4078810858ed9f4ca283: function AS_Button_dddfe476d6dd4078810858ed9f4ca283(eventobject) {
        var self = this;
        return self.updateInspection.call(this);
    },
    /** onClick defined for Button0i81fecc32f8e47 **/
    AS_Button_f7e9aafb2935449aa4ec2a98db6b363f: function AS_Button_f7e9aafb2935449aa4ec2a98db6b363f(eventobject) {
        var self = this;
        return self.startSyncOnObject.call(this);
    },
    /** onClick defined for Button0ga53448e54d041 **/
    AS_Button_d3f7286907b243cdbe9b9a377af6664c: function AS_Button_d3f7286907b243cdbe9b9a377af6664c(eventobject) {
        var self = this;
        return _fetchRecords.call(this, "asset");
    },
    /** postShow defined for frmSetting **/
    AS_Form_j7ac66d637e24cf5818152433fd0e7e9: function AS_Form_j7ac66d637e24cf5818152433fd0e7e9(eventobject) {
        var self = this;
        this.onFormPostShow();
    }
});