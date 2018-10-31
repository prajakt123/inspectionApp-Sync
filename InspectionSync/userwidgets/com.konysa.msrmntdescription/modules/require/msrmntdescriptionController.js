define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      debugger;
      this._value=null;
      this._type="Text"
      this._title="";
      _description="";
      _info="";
      _placeHolderText="";
      this._isOpen=false;
      this._measurementId=null;
      this._measurementRangeId=null;
      this._animConfig={"duration":0.3,"iterationCount":1,"delay":0,"fillMode":kony.anim.FORWARDS};
      this._affineTransformProp0 = kony.ui.makeAffineTransform();
      this._affineTransformProp0.scale(1,0); 
      this._affineTransformProp1 = kony.ui.makeAffineTransform();
      this._affineTransformProp1.scale(1,1);
    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      defineGetter(this,"title",function(){
        return this._title;});
      defineSetter(this,"title",function(val){
        this._title=val;
      });
      defineGetter(this,"info",function(){
        return _info;});
      defineSetter(this,"info",function(val){
        _info=val;
      });
      defineGetter(this,"description",function(){
        return _description;});
      defineSetter(this,"description",function(val){
        _description=val;
      });
    },
    setData:function(data,addImageCBFunction){
      //alert("data");
      if(typeof data==='object' &&typeof data!==null){
        var measurement=data["measurement"];
        if(typeof measurement==='object' &&  typeof measurement!==null &&typeof measurement.Name ==='string'){
          this._title=(measurement.Name).trim();
        }
        _info="";
        _placeHolderText="Enter description";
        this._measurementId=data.Measurement_Id;
        this._measurementRangeId=data.Measurement_Range_Id;
        this.view.lblTitle.text=this._title;
        this.view.txtAreaDescritption.placeholder=_placeHolderText;
        this.view.imageupload.onAddImageClick=addImageCBFunction;
        this.view.imageupload.setData(data);
      }
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
    onTextInputDone:function(){
      this._desription=this.view.txtAreaDescritption.text;
      if(this._desription===null || this._desription===undefined){
        this._desription="";
      }
      this._value=(this._desription).trim();
      if((this._value).length>0){
        this.view.imgDone.setVisibility(true);
      }else{
        this.view.imgDone.setVisibility(false);
      }
      //alert(this.description);
    },
    triggerInfoCallback:function(){
      if(this.infoCallback!==null && this.infoCallback!==undefined){
        try{
          this.infoCallback(this._measurementId,this._measurementRangeId);
        }catch(excp){
          kony.print("Exception occured while triggering the info callback"+excp);
        }

      }
    },
    /**
     * @function
     *
     * @param status 
     */
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
      
    }
  };
});