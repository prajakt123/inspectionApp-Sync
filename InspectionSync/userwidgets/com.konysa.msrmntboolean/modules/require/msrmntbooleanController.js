define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this._isOpen=false;
      this._value=null;
      this._type="Pass/Fail";
      this._title="";
      _info="";
      this._selectedItem=null;
      this._measurementId=null;
      this._measurementRangeId=null;
    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
    },
    setTitle:function(title){
      this.view.lblTitle.text=title;
      this._title=title;
    },
    setInfo:function(info){
      _info=info;
    },
    setValue:function(value){
      alert("value");
      //return;
      if(value===true){
        this.view.radioStatus.selectedKey="key0";
        this._value=value;
      }else{
        this.view.radioStatus.selectedKey="key1";
        this._value=value;
      }
    },
    toggleVisibility:function(status){
      debugger;
      switch(status){
        case 0:
          this.hideFlexContainer();
          this._isOpen=false;
          this.view.imgIndicator.src="plus_icon.png";
          break;
        case 1:
          //this.view.flxContainer.setVisibility(true);
          this.showFlexContainer();
          this._isOpen=true;
          this.view.imgIndicator.src="minus.png";
          break;
        default:
          this._isOpen=!this._isOpen;
          //this.view.flxContainer.setVisibility(this._isOpen);
          if(this._isOpen){
            //this.view.flxContainer.setVisibility(true);
            this.view.imgIndicator.src="minus.png";
            this.showFlexContainer();
          }else{
            this.view.imgIndicator.src="plus_icon.png";
            this.hideFlexContainer();
          }
      }
      this.view.forceLayout();
    },
    /**
     * @function
     *
     */
    showFlexContainer:function(){
      var self=this;
      /*var animDefinitionOne = {//0  : {"transform":this._affineTransformProp0 },
        100 : {"transform":this._affineTransformProp1}};
      var animationObj = kony.ui.createAnimation(animDefinitionOne);
      this.view.flxContainer.animate(animationObj, this._animConfig, null);*/

      var transformProp1 = kony.ui.makeAffineTransform();
      transformProp1.scale(1, 0);
      var transformProp2 = kony.ui.makeAffineTransform();
      transformProp2.scale(1, 1);
      var animDefinitionOne = {
        0: {
          "anchorPoint": {
            "x": 0.5,
            "y": 0
          },
          "transform": transformProp1
        },
        100: {
          "anchorPoint": {
            "x": 0.5,
            "y": 0
          },
          "transform": transformProp2
        }
      };
      var animDefinition = kony.ui.createAnimation(animDefinitionOne);
      this.view.flxContainer.animate(animDefinition,{
        "duration": 0.2,
        "iterationCount": 1,
        "delay": 0,
        "fillMode": kony.anim.FILL_MODE_FORWARDS
      },{
        "animationStart":function(){
          self.view.flxContainer.setVisibility(true);
        }
      });
    },
    /**
     * @function
     *
     */
    hideFlexContainer:function(){
      var self=this;
      var transformProp1 = kony.ui.makeAffineTransform();
      transformProp1.scale(1, 1);
      var transformProp2 = kony.ui.makeAffineTransform();
      transformProp2.scale(1, 0);
      var animDefinitionOne = {
        0: {
          "anchorPoint": {
            "x": 0.5,
            "y": 0
          },
          "transform": transformProp1
        },
        100: {
          "anchorPoint": {
            "x": 0.5,
            "y": 0
          },
          "transform": transformProp2
        }
      };
      var animDefinition = kony.ui.createAnimation(animDefinitionOne);
      this.view.flxContainer.animate(animDefinition,{
        "duration": 0.1,
        "iterationCount": 1,
        "delay": 0,
        "fillMode": kony.anim.FILL_MODE_FORWARDS
      },{
        /**
         * @function
         *
         */
        "animationEnd":function(){
          self.view.flxContainer.setVisibility(false);
        },
        /**
         * @function
         *
         */
        "animationStart":function(){
          //self.view.flxContainer.setVisibility(true);
        }
      });
      
    },
    getResult:function(){
      var mediaList=this.view.imageupload.getResult();
      return {
        "media_list":mediaList,
        "measurement_id":this._measurementId,
        "measurement_name":this._title,
        "measurement_value":this._value,
        "measurement_type":this._type,
        "measurement_range_id":this._measurementRangeId
      };
    },
    onRadioSelectionDone:function(){
      var result=this.view.radioStatus.selectedKeyValue;
      alert(result);
    },
    setData:function(data,addImageCBFunction){
      kony.print(data);
      if(typeof data==='object' &&typeof data!==null){
       var measurement=data["measurement"];
        if(typeof measurement==='object' &&  typeof measurement!==null &&typeof measurement.Name ==='string'){
          this._title=(measurement.Name).trim();
        }
        //_info=(data.measurement_description).trim();
        _info="";
        this._measurementId=data.Measurement_Id;
        this.view.lblTitle.text=this._title;
        this.view.lblItem0.text="PASS";
        this.view.lblItem1.text="FAIL";
        this._measurementRangeId=data.Measurement_Range_Id;
        this.view.imageupload.onAddImageClick=addImageCBFunction;
        this.view.imageupload.setData(data);
      }
    },
    toggleSelection:function(eventobject){
      var id=eventobject.id;
      if(id==="flxItem0"){
      //if(this._selectedItem==="flxItem0"){
        this.view.imgToggle1.src="radio_unselected.png";
        this.view.imgToggle0.src="radio_selected.png";
        this._value= this.view.lblItem0.text;
        this._selectedItem="flxItem0";
      }else if(id==="flxItem1"){
        this.view.imgToggle1.src="radio_selected.png";
        this.view.imgToggle0.src="radio_unselected.png";
        this._selectedItem="flxItem1";
        this._value=this.view.lblItem1.text;
      }
      this.view.imgDone.setVisibility(true);
    },
    triggerInfoCallback:function(){
      if(this.infoCallback!==null && this.infoCallback!==undefined){
        try{
          this.infoCallback(this._measurementId,this._measurementRangeId);
        }catch(excp){
          kony.print("Exception occured while triggering the info callback"+excp);
        }
        
      }
    }
  };
});