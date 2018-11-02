define({ 
  //Type your controller code here 

  measurementHistory:null,
  measurementRange:null,
  measurement:null,
  measurementRangeMap:null,
  count:0,
  navigationData:null,
  mediaList:null,

  record:null,
  imageCount:0,
  from:null,
  assetDetail:null,
  _inspection:null,
  measurementSetId:null,
  capturedInspection:null,
  //reviewData["measurementSetId"]=this.measurementSetId;
  onNavigate:function(data){
    debugger;
    if(!InspectionUtil.isNetworkAvailable()){
      //this.view.loadingScreen.show("offline",2);
    }
    if(data===null||data===undefined)
      return;
    this.count=0;
    this.navigationData=data;
    var inspection = data.inspection;
    this._inspection = inspection;
    this.view.flxInspectionImage.removeAll();
    this.view.flxInspectionImage.setVisibility(false);
    return;
    /*/if(data.from=="frmInspectionsList"){
      //this.showMeasuredData();
      this.from="frmInspectionsList";
      this.view.lblCaptureSignatureTitle.setVisibility(false);
      this.view.flxSignatureComp.setVisibility(false);
      this.view.btnSubmitInspection.setVisibility(false);
      this._inspection=data["inspection"];
      this.getHistoryOfInspection(this._inspection["Inspection_Id"]);
      return;
      //return;
    }else{
      this.from="frmInspectionExecution";
      this.view.lblCaptureSignatureTitle.setVisibility(true);
      this.view.flxSignatureComp.setVisibility(true);
      this.view.btnSubmitInspection.setVisibility(true);
    }
    if(data["status"]==="completed"){
      this._inspection=data["inspection"];
      this.getHistoryOfInspection(this._inspection["Inspection_Id"]);
      return;
    }
    this.record=data;
    this.measurementSetId=data["measurementSetId"];
    var inspection=data.inspection;
    this._inspection=inspection;
    this.view.signaturecapture.clearSignature();

    this.view.lblAssetIdValue.text=app_constant.asset+InspectionUtil.validateText(inspection.Asset_Id);
    this.view.lblInspectionIDValue.text=app_constant.inspection+InspectionUtil.validateText(inspection.Inspection_Id);
    var status=validateText(inspection["Status"]).toLowerCase();
    if(typeof status==='string'){
      status=status.toLocaleLowerCase();
      status=status.trim();
    }
    switch(status){
      case "assigned":
        this.view.lblInspectionStatus.text="Assigned";
        break;
      case "in-progress":
        this.view.lblInspectionStatus.text="In-progress";
        break;
      case "completed":
        this.view.lblInspectionStatus.text="Completed";
    }
    //     this.view.lblAssetCode.text=validateText(inspection.asset_type);
    //     this.view.lblAssetNameValue.text=validateText(inspection.asset_description);
    this.view.lblAssetCode.text=app_constant.asset+InspectionUtil.validateText(inspection.Asset_Id);
    var asset=inspection["asset"];
    if(typeof asset==='object' && typeof asset!==null){
      var assetType=asset["type"];
      if(typeof assetType==='object' && typeof asset!==null){
        this.view.lblAssetNameValue.text=InspectionUtil.validateText(assetType["Description"]);
      }else{
        this.view.lblAssetNameValue.text="NA";
      }
    }else{
      this.view.lblAssetNameValue.text="NA";
    }
    this.setMeasurementToSegment(data.measurement);
    //this.populateAssetDetail(data.assetDetail);
    this.setCapturedImage(data.measurement);*/
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
        //self.view.loadingScreen.hide(2);
        self.view.lblNetworkStatus.setVisibility(false);
      }else{
        self.view.lblNetworkStatus.setVisibility(true);
      }
    }
    kony.net.setNetworkCallbacks(config);
  },
  /************************** sync module start *****************************/
  /**
   * @function
   *
   */
  onFormPostShow:function(){
    debugger;
    try{
      if(typeof this.navigationData==='object' &&  this.navigationData!==null){
        //this.view.photoGallery.removeAllImage();
        this.setCommonData(this.navigationData["inspection"]);
        if(this.navigationData.from==="frmInspectionsList"){
          this.setInspectionHistoryData(this.navigationData);
        }else if(this.navigationData.from==="frmInspectionExecution"){
          this.enableReviewMode();
          this.setCapturedInspection(this.navigationData);
        }
      }
    }catch(excp){
      debugger;
      kony.print(excp);
      alert(JSON.stringify(excp));
    }
  },
  /**
   * @function
   *
   * @param inspection 
   */
  setCapturedInspection:function(inspectionReading){
    //if(typeof inspectionReading==='object' && typeof inspectionReading!==null){
    if(typeof inspectionReading==='object' &&  inspectionReading!==null){
      var measurement=inspectionReading.measurement;
      if(typeof measurement==='object' &&  measurement!==null){
        var measurementList=measurement["measurement_list"];
        this.setMeasurementToSegment(measurementList);
        //this.setCapturedImage(inspectionReading.measurement);
        //var mediaList=measurement.media_list;
        this.mediaList=measurement.media_list;
        //this.setCapturedImage(mediaList);
        this.getMedia(this.mediaList);
      }
    }
    //}
  },
  /**
   * @function
   *
   */
  enableReviewMode:function(){
    this.view.signaturecapture.clearSignature();
    this.view.lblCaptureSignatureTitle.setVisibility(true);
    this.view.flxSignatureComp.setVisibility(true);
    this.view.btnSubmitInspection.setVisibility(true);
  },
  /**
   * @function
   *
   * @param inspectionHistory 
   */
  setInspectionHistoryData:function(inspectionHistory){
    if(typeof inspectionHistory==='object' &&  inspectionHistory!==null){
      this.enableHistoryMode();
      var inspection=inspectionHistory["inspection"];
      if(typeof inspection==='object' &&  inspection!==null){
        var inspectionId=inspection["Inspection_Id"];
        this.getHistoryOfInspection(inspectionId);
      }else{
        kony.print("Inspection id not found for this history!");
      }
    }
  },
  /**
   * @function
   *
   */
  enableHistoryMode:function(){
    this.view.lblCaptureSignatureTitle.setVisibility(false);
    this.view.flxSignatureComp.setVisibility(false);
    this.view.btnSubmitInspection.setVisibility(false);
  },
  /**
   * @function
   *
   * @param inspection 
   */
  setCommonData:function(inspection){
    if(typeof inspection==='object' &&  inspection !==null){
      this.view.lblAssetIdValue.text=app_constant.asset+InspectionUtil.validateText(inspection["Asset_Id"]);
      //this.view.lblInspectionIDValue.text=app_constant.inspection+InspectionUtil.validateText(inspection["Inspection_Id"]);
      var inspectionId=parseInt(inspection["Inspection_Id"]);
      if(isNaN(inspectionId)===false){
        if(inspectionId<0){
          this.view.lblInspectionIDValue.text=app_constant.offline_inspection_msg +(-1*inspectionId)+app_constant.offline_inspection_closing_msg;
        }else{
          this.view.lblInspectionIDValue.text=app_constant.inspection+InspectionUtil.validateText(inspection["Inspection_Id"]);
        }
      }else{
        this.view.lblInspectionIDValue.text=app_constant.inspection+InspectionUtil.validateText(inspection["Inspection_Id"]);
      }
      
      
      var status=inspection["Status"];
      if(typeof status ==='string'){
        status=status.trim();
        status=status.toLowerCase();
        switch(status){
          case "assigned":
            this.view.lblInspectionStatus.text="Assigned";
            break;
          case "in-progress":
            this.view.lblInspectionStatus.text="In-progress";
            break;
          case "completed":
            this.view.lblInspectionStatus.text="Completed";
            break;
          default:
            this.view.lblInspectionStatus.text="NA";
        }
      }
      //this.view.lblAssetCode.text=app_constant.asset+InspectionUtil.validateText(inspection.Asset_Id);
      var asset=inspection["asset"];
      if(typeof asset==='object' &&  asset!==null){
        var assetType=asset["type"];
        if(typeof assetType==='object' &&  asset!==null){
          this.view.lblAssetCode.text=InspectionUtil.validateText(assetType["Name"]);
          this.view.lblAssetNameValue.text=InspectionUtil.validateText(assetType["Description"]);
        }else{
          this.view.lblAssetNameValue.text="NA";
        }
      }else{
        this.view.lblAssetNameValue.text="NA";
      }
    }
  },
  /**
   * @function
   *
   */
  inspectionCaptureSuccess:function(){
    try{
      var navObj=new kony.mvc.Navigation("frmInspectionsList");
      navObj.navigate();
    }catch(excp){
      alert(JSON.stringify(excp));
    }
  },
  /**
   * @function
   *
   */
  getHistoryOfInspection:function(inspectionId){
    debugger;
    var options={};
    options["whereConditionAsAString"]="Inspection_Id = '"+inspectionId+"'";
    this.view.loadingScreen.show("loading..",1);
    this._fetchRecords("measurement_hstry",options);

  },
  /**
   * @function
   *
   * @param record 
   */
  processMeasurementHistory:function(record){

    if(Array.isArray(record)&&record.length>0){
      var measurementRangeClause="Measurement_Range_Id IN (";
      var measurementHistoryClause="Measurement_History_Id IN (";
      var i=0;
      for(;i<record.length-1;i++){
        measurementRangeClause=measurementRangeClause+record[i]["Measurement_Range_Id"]+",";
        measurementHistoryClause=measurementHistoryClause+record[i]["Measurement_History_Id"]+",";
      }
      measurementRangeClause=measurementRangeClause+record[i]["Measurement_Range_Id"]+")";
      measurementHistoryClause=measurementHistoryClause+record[i]["Measurement_History_Id"]+")";
      var options={};
      options["whereConditionAsAString"]=measurementRangeClause;
      //this._fetchRecords("measurement_range",options);
      this._fetchRecords(DATA_MODEL.MEASUREMENT_RANGE,options);
      var measurementImageOption={};
      measurementImageOption["whereConditionAsAString"]=measurementHistoryClause;
      this._fetchRecords(DATA_MODEL.MEASUREMENT_IMAGE,measurementImageOption);
    }
  },
  /**
   * @function
   *
   * @param record 
   */
  processMeasurementImage:function(record){
    if(Array.isArray(record) && record.length>0){
      var mediaClause="media_id IN (";
      var i=0;
      for(;i<record.length-1;i++){
        mediaClause=mediaClause+record[i]["media_id"]+",";
      }
      mediaClause=mediaClause+record[i]["media_id"]+")";
      var options={};
      options["whereConditionAsAString"]=mediaClause;
      this._fetchRecords(DATA_MODEL.MEDIA , options);
    }
  },
  /**
   * @function
   *
   * @param record 
   */
  processMeasurementRange:function(record){
    //this.measurementRange =record;
    var measurementClause="Measurement_Id IN (";
    if(Array.isArray(record)&&record.length>0){
      var i=0;
      for(;i<record.length-1;i++){
        measurementClause=measurementClause+record[i]["Measurement_Id"]+",";
      }
      measurementClause=measurementClause+record[i]["Measurement_Id"]+")";
      var options={};
      options["whereConditionAsAString"]=measurementClause;
      this._fetchRecords("measurement",options);
    }
  },
  /**
   * @function
   *
   * @param record 
   * @param dataModel 
   */
  recordFetchSuccess:function(dataModel,record){
    debugger;
    this.view.loadingScreen.hide(1);
    switch(dataModel){
      case "measurement_hstry":
        this.measurementHistory=record;
        this.processMeasurementHistory(record);
        break;
      case "measurement":
        // Measurement range and measurement records are fetched, now process and populate the records.
        this.measurement =record;
        this.processRecords();
        break;
      case "measurement_range":
        this.measurementRange =record;
        this.processMeasurementRange(record);
        break;
      case DATA_MODEL.MEDIA:
        this.setCapturedImage(record);
        break;
      case DATA_MODEL.MEASUREMENT_IMAGE:
        this.processMeasurementImage(record);
        break;
    }
  },
  _fetchRecords:function(dataModel,options){
    function failureCB(error){
      alert(JSON.stringify(error));
      this.view.loadingScreen.hide(1);
      this.view.loadingScreen.show(JSON.stringify(error),4);
    }
    try{
      if(options===undefined)
        options=null;
      var inspbj=new kony.sdk.KNYObj(dataModel);
      this.view.loadingScreen.show("Loading..",1);
      inspbj.get(options,this.recordFetchSuccess.bind(this,dataModel),failureCB.bind(this));
    }catch(excp){
      this.view.loadingScreen.hide(1);
      this.view.loadingScreen.show(excp.message,4);
      alert(excp.message);
    }
  },
  /**
   * @function
   *
   */
  processRecords:function(){
    debugger;
    var measurementMap=InspectionUtil.parseRecords(this.measurement,"Measurement_Id");
    if(Array.isArray(this.measurementRange)){
      var measurementRangeLength=this.measurementRange.length;
      for(var i=0;i<measurementRangeLength;i++){
        var measurementRangeObj=this.measurementRange[i];
        var measurementId=measurementRangeObj["Measurement_Id"];
        if(typeof measurementId==='string' || typeof measurementId==='number'){
          if(Array.isArray(measurementMap[measurementId]) && measurementMap[measurementId].length>0){
            measurementRangeObj["measurement"]=measurementMap[measurementId][0];
          }
        }
      }
    }
    this.measurementRangeMap=InspectionUtil.parseRecords(this.measurementRange,"Measurement_Range_Id");
    this.populateHistoryData();
    this.view.loadingScreen.hide(1);
  },
  /**
   * @function
   *
   */
  populateHistoryData:function(){
    if(Array.isArray(this.measurementHistory)){
      var historyLength=this.measurementHistory.length;
      var mHistory;
      var mRangeId;
      var measurementRange;
      var inspectionValue;
      var segObj={};
      var segList=[];
      for(var i=0;i<historyLength;i++){
        segObj={};
        mHistory=this.measurementHistory[i];
        mRangeId=mHistory["Measurement_Range_Id"];
        inspectionValue=mHistory["Inspection_Value"];
        measurementRange=this.measurementRangeMap[mRangeId];
        if(Array.isArray(measurementRange) && measurementRange.length>0){
          measurementRange=measurementRange[0];
          if(measurementRange===undefined||measurementRange===null){
            continue;
          }
          var measurement=measurementRange["measurement"];
          if(typeof measurement==='object' &&  measurement!==null){
            segObj["lblMeasurementTitle"]=measurement["Name"];
          }else{
            segObj["lblMeasurementTitle"]="";
          }
          segObj["lblMeasurementvalue"]={"text":mHistory["Inspection_Value"]};
          segList.push(segObj);
        }
      }
      this.view.segMeasurement.removeAll();
      this.view.segMeasurement.setData(segList);
    }
  },
  setMeasurementHistoryToSegment:function(data){
    if(Array.isArray(data)){
      var meausermentLength=data.length;
      var segObj={};
      var segList=[];
      var measurement;
      for(var i=0;i<meausermentLength;i++){
        measurement=data[i];
        segObj={};
        /*if(measurement["measurement_value"]===null){
          continue;
        }*/
        segObj["lblMeasurementTitle"]=measurement["measurement_name"];
        if(measurement["measurement_value"]===null || measurement["measurement_value"]==="null"){
          segObj["lblMeasurementvalue"]={"text":"Not captured","skin":"sknLblDay"};
        }else if(measurement["measurement_type"]==="Text"){
          segObj["lblMeasurementvalue"]={"text":measurement["measurement_value"],"skin":"sknLblDay"};
        }else{
          segObj["lblMeasurementvalue"]={"text":measurement["measurement_value"]};
        }

        segList.push(segObj);
      }
      this.view.segMeasurement.removeAll();
      this.view.segMeasurement.setData(segList);
    }  
  },
  /************************** sync module starts *****************************/
  /**
   * @function
   *
   */
  submitInspection:function(){
    debugger;
    kony.print("in submit inspection!");
    try{
      var inspObj=this.getInspectedData(this.navigationData);
      if(typeof inspObj==='object' &&  inspObj!==null){
        var measurementHistoryList=inspObj["measurementHistroyRecord"];
        if(Array.isArray(measurementHistoryList)){
          //for(var i=0;i<measurementHistoryList.length;i++){
          this.createMeasurementHistory(measurementHistoryList,0);
          return;
        }
      }
    }catch(excp){
      kony.print("Exception occured:- "+JSON.stringify(excp));
    }
  },
  /**
    * @function
    *
    * @param mediaList 
    * @param index 
    * @param measurementHistoryId 
    */
  createMeasurementImageRecord:function(mediaList,index,measurementHistoryId){
    if(Array.isArray(mediaList) && typeof measurementHistoryId==='number'){
      var measurementImageObj={};
      for(var i=0;i<mediaList.length;i++){
        measurementImageObj={};
        measurementImageObj["Measurement_History_Id"]=measurementHistoryId;
        measurementImageObj["media_id"]=mediaList[i];
        measurementImageObj["SoftDeleteFlag"]=false;
        this._createMeasurementImage(measurementImageObj);
      }
    }
  },
  /**
   * @function
   *
   * @param result 
   */
  measurementImageCreationSuccess:function(result){
    debugger;//success
  },
  /**
   * @function
   *
   * @param result 
   */
  measurementImageCreationFailure:function(result){
    debugger;
  },
  /**
   * @function
   *
   * @param record 
   */
  _createMeasurementImage:function(record){
    if(typeof record==='object' && record!==null){
      try{
        var measurementImage=new kony.sdk.KNYObj(DATA_MODEL.MEASUREMENT_IMAGE);
        measurementImage.create(record, {}, this.measurementImageCreationSuccess.bind(this), this.measurementImageCreationFailure.bind(this));
      }catch(excp){
        debugger;
        alert("Something went wrong please try later!");
      }
    }else{
      debugger;
    }
  },
  /**
   * @function
   *
   * @param measurementList 
   * @param index 
   * @param result 
   */
  measurementCreationSuccess:function(measurementList,index,result){
    debugger;
    this.view.loadingScreen.hide(1);
    if(Array.isArray(measurementList) && typeof index==='number' && measurementList.length>index){
      //check for media if media is presnet then create record with this existing media id and measurement history id in the measurement_image table.
      var measurement=measurementList[index];
      var mediaList=measurement["mediaUrls"];
      if(Array.isArray(mediaList) && mediaList.length>0){
        //create record with this existing media id and measurement history id in the measurement_image table.
        if(typeof result==='object' && result!==null){
          var measurementHistoryId=result["Measurement_History_Id"];
          this.createMeasurementImageRecord(mediaList,0,measurementHistoryId);
        }else{
          debugger;
        }
      }else{
        kony.print("### Media not present in ###"+JSON.stringify(measurement));
      }
    }
    this.createMeasurementHistory(measurementList, index+1);
    if(index+1===measurementList.length){
      this._inspection["Status"]="Completed";
      if(typeof this.navigationData==='object' &&  this.navigationData!==null){
        var inspection=this.navigationData["inspection"];
        if(typeof inspection==='object' &&  inspection!==null){
          inspection["Status"]="Completed";
          //alert("All measurement captured");
          this.updateInspection(inspection);
        }
      }
    }
  },
  /**
   * @function createMeasurement
   *
   */
  createMeasurementHistory:function(measurementList,index){
    debugger;
    function errorCB(result){
      debugger;
      this.view.loadingScreen.show(JSON.stringify(result),4);
      this.view.loadingScreen.hide(1);
    }
    if(Array.isArray(measurementList) && typeof index==='number' && index<measurementList.length){
      var measurement=measurementList[index];
      var mHistory={
        "CreatedTimestamp": null,
        "id": 0,
        "Inspection_Id": measurement["inspection_Id"],
        "Inspection_Timestamp": measurement["inspection_Timestamp"],
        "Inspection_Value": measurement["inspection_Value"]+"",
        "LastUpdatedTimestamp": null,
        "Measurement_Images_Id": null,
        "Measurement_Range_Id": measurement["measurement_Range_Id"],
        "Measurement_Set_Id": measurement["measurement_Set_Id"],
        "Response_Type": measurement["response_Type"],
        "SoftDeleteFlag": false,
        "Timestamp": measurement["Timestamp"]
      };
      try{
        var measurementHistory=new kony.sdk.KNYObj("measurement_hstry");
        this.view.loadingScreen.show("Storing inspection data..",1);
        measurementHistory.create(mHistory, {}, this.measurementCreationSuccess.bind(this,measurementList,index), errorCB.bind(this,index));
      }catch(excp){
        debugger;
        this.view.loadingScreen.show(excp.message,4);
        this.view.loadingScreen.hide(1);
        alert(excp.message);
      }
    }
  },
  updateInspection:function(inspectionObj){
    debugger;
    function successCB(result){
      debugger;
      this.view.loadingScreen.hide(1);
      this.submitInspectionSuccessCB();
    }
    function errorCB(result){
      debugger;
      this.view.loadingScreen.hide(1);
      this.view.loadingScreen.hide(JSON.stringify(result),4);
    }
    try{
      var data=this.capturedInspection;
      var record={
        "Status":"Completed",
        "Signature":data.signature
      };
      var options={};
      options["primaryKeys"]={"Inspection_Id":this._inspection["Inspection_Id"]};
      var inspection=new kony.sdk.KNYObj("inspection");
      this.view.loadingScreen.show("Updating inspection..",1);
      inspection.updateByPK(record,options, successCB.bind(this), errorCB.bind(this));
      //inspection.updateByPK(inspectionObj,options, successCB, errorCB);
    }catch(excp){
      debugger;
      this.view.loadingScreen.hide(1);
      this.view.loadingScreen.show(excp.message,4);
      alert(excp.message);
    }
  },
  /**
   * @function
   *
   */
  getMedia:function(mediaList){
    var mediaClause="media_id IN (";
    if(Array.isArray(mediaList) && mediaList.length>0){
      var i=0;
      for(;i<mediaList.length-1;i++){
        mediaClause=mediaClause+mediaList[i]+",";
      }
      mediaClause=mediaClause+mediaList[i]+")";
      var options={};
      options["whereConditionAsAString"]=mediaClause;
      this._fetchRecords(DATA_MODEL.MEDIA,options);
    }else{
      this.setCapturedImage([]);
    }
  },
  /************************** sync module end *****************************/
  setCapturedImage:function(measurement){
    this.view.flxInspectionImage.removeAll();
    if(Array.isArray(measurement) && measurement.length>0 ){
      var length=measurement.length;
      var mediaList;
      var flexItem;
      var imageBase64;
      for(var i=0;i<length;i++){
        imageBase64=measurement[i]["media_base64"];
        if(typeof imageBase64==='string'){
          flexItem=this.getFlexImageItem(i, imageBase64);
          this.view.flxInspectionImage.add(flexItem);
          //this.view.photoGallery.addImageBase64(imageBase64);
          //this.view.photoGallery.a
        }
      }
      this.view.flxInspectionImage.setVisibility(true);
      this.view.forceLayout();
    }else{
      this.view.flxInspectionImage.setVisibility(false);
    }

  },
  showAssetDetailContainer:function(){
    debugger;
    var self=this;
    this.view.flxScAssetDetailsContainer.animate(
      kony.ui.createAnimation({100:{left:"20%","stepConfig":{}}}),
      {delay:0,fillMode:kony.anim.FILL_MODE_FORWARDS,duration:.10},
      {animationEnd: function() {

      } 
      });
    self.view.flxOverlay.animate(
      kony.ui.createAnimation({100:{left:"0%","stepConfig":{}}}),
      {delay:0,fillMode:kony.anim.FILL_MODE_FORWARDS,duration:.10},
      {animationEnd: function() {

      } 
      });
  },
  hideAssetDetailContainer:function(){
    debugger;
    var self=this;
    this.view.flxScAssetDetailsContainer.animate(
      kony.ui.createAnimation({100:{left:"100%","stepConfig":{}}}),
      {delay:0,fillMode:kony.anim.FILL_MODE_FORWARDS,duration:.10},
      {animationEnd: function() {

      } 
      });
    self.view.flxOverlay.animate(
      kony.ui.createAnimation({100:{left:"-20%","stepConfig":{}}}),
      {delay:0,fillMode:kony.anim.FILL_MODE_FORWARDS,duration:.01},
      {animationEnd: function() {

      } 
      });
  },
  setMeasurementToSegment:function(data){
    if(Array.isArray(data)){
      var meausermentLength=data.length;
      var segObj={};
      var segList=[];
      var measurement;
      for(var i=0;i<meausermentLength;i++){
        measurement=data[i];
        segObj={};
        /*if(measurement["measurement_value"]===null){
          continue;
        }*/
        segObj["lblMeasurementTitle"]=measurement["measurement_name"];
        if(measurement["measurement_value"]===null || measurement["measurement_value"]==="null"){
          segObj["lblMeasurementvalue"]={"text":"Not captured","skin":"sknLblDay"};
        }else if(measurement["measurement_type"]==="Text"){
          segObj["lblMeasurementvalue"]={"text":measurement["measurement_value"],"skin":"sknLblDay"};
        }else{
          segObj["lblMeasurementvalue"]={"text":measurement["measurement_value"]+""};
        }

        segList.push(segObj);
      }
      this.view.segMeasurement.removeAll();
      this.view.segMeasurement.setData(segList);
    }  
  },
  /**
   * @function
   *
   * @param inspectionData 
   */
  getInspectedData:function(inspectionData){
    var data=null;
    if(typeof inspectionData==='object' &&  inspectionData!==null){
      data={};
      var inspection=inspectionData["inspection"];
      if(typeof inspection==='object' &&  inspection!==null){
        data["inspection_Id"]=inspection["Inspection_Id"];
        data["inspectedBy"]=inspection["Assigned_To"];
        //data["signature"]=this.view.signaturecapture.getSignature();
        var signa=this.view.signaturecapture.getSignature();
        var raw_byte=kony.convertToRawBytes(signa);
        var img;//=new kony.image.createImage(raw_byte);
        if(kony.os.deviceInfo().name==="android"){
          img=new kony.image.createImage(raw_byte);
        }else{
          img=kony.image.createImage(raw_byte);
        }
        img.scale(0.02);
        var newBase64=kony.convertToBase64(img.getImageAsRawBytes());
        data["signature"]=newBase64;
        data["status"]="Completed";
        data["timestamp"]=getUtcDateTimeString();
        //data["measurementHistroyRecord"]=[];
        //var measurementList=inspectionData["measurement"];
        if(typeof inspectionData["measurement"]==='object' && inspectionData["measurement"]!==null){
          var measurementList=inspectionData["measurement"]["measurement_list"];
          if(Array.isArray(measurementList)){
            var measurement={};
            var measurementHistroyRecord=[];
            //measurement["measurement_History_Id"];
            for(var i=0;i<measurementList.length;i++){
              measurement={};
              if(measurementList[i]["measurement_value"]===null){
                continue;
              }
              measurement["measurement_History_Id"]="";
              measurement["response_Type"]=measurementList[i]["measurement_type"];
              measurement["inspection_Timestamp"]=getUtcDateTimeString();
              measurement["inspection_Value"]=measurementList[i]["measurement_value"];
              measurement["Timestamp"]=getUtcDateTimeString();
              measurement["inspection_Id"]=inspection["Inspection_Id"];
              measurement["measurement_Range_Id"]=measurementList[i]["measurement_range_id"];
              measurement["measurement_Set_Id"]=inspectionData["measurementSetId"];//inspection["Measurement_Set_Id"];
              measurement["Measurement_Images_Id"]="";
              measurement["mediaUrls"]=measurementList[i].media_list;
              measurementHistroyRecord.push(measurement);
            }
            data["measurementHistroyRecord"]=measurementHistroyRecord;
            this.capturedInspection=data;
            kony.print(JSON.stringify(data));
          }else{
            debugger;
          }
        }else{
          debugger;
        }
      }
    }
    return data;
  },
  /**
   * @function
   *
   * @param result 
   */
  submitInspectionSuccessCB:function(result){
    // return;
    debugger;
    this.view.loadingScreen.hide();
    //kony.application.dismissLoadingScreen();
    if(kony.os.deviceInfo().name==="android"){
      var toast=new kony.ui.Toast({"text":"Submitted successfully!","duration":constants.TOAST_LENGTH_SHORT });
      toast.show();
    }
    try{
      var navObj=new kony.mvc.Navigation("frmInspectionsList");
      navObj.navigate();
    }catch(excp){
      alert(JSON.stringify(excp));
    }
    //alert(result);
    //this.populateInspectionsToSegment(this.inspectionList);
  },

  /**
   * @function
   *
   * @param id 
   * @param imageBase64 
   */
  getFlexImageItem:function(id,imageBase64){
    /**
     * @function
     *
     */
    function testFun(){
      alert("WIP");
    }
    var flxImageItem0 = new kony.ui.FlexContainer({
      "autogrowMode": kony.flex.AUTOGROW_NONE,
      "centerY": "50%",
      "clipBounds": true,
      "height": "80dp",
      "id": "flxImageItem"+id,
      "isVisible": true,
      "layoutType": kony.flex.FREE_FORM,
      "left": "0dp",
      "skin": "sknFlxInspectionListWhiteBGWithWhiteBorder",
      "width": "80dp",
      "zIndex": 1,
      "onClick":testFun
    }, {}, {});
    flxImageItem0.setDefaultUnit(kony.flex.DP);
    var imgItem0 = new kony.ui.Image2({
      "centerX": "50%",
      "centerY": "50%",
      "height": "100%",
      "id": "imgItem"+id,
      "isVisible": true,
      "left": "10dp",
      "skin": "slImage",
      "imageWhileDownloading": "loader.gif",
      "top": "17dp",
      "width": "100%",
      "zIndex": 1
    }, {
      "imageScaleMode": constants.IMAGE_SCALE_MODE_FIT_TO_DIMENSIONS,
      "padding": [0, 0, 0, 0],
      "paddingInPixel": false
    }, {});
    //imgItem0.src=imageUrl;
    imgItem0.base64=imageBase64
    flxImageItem0.add(imgItem0);
    return flxImageItem0;
  },
  /**
   * @function
   *
   */
  navigateBack:function(){
    if(typeof this.navigationData==='object' &&  this.navigationData!==null ){
      var lastFormName=this.navigationData["from"];
      if(typeof lastFormName==='string'){
        try{
          var navObj=new kony.mvc.Navigation(lastFormName);
          navObj.navigate("frmInspectionReview");
        }catch(excp){
          kony.print("Exception occured while navigating back: "+excp.toString());
        }
      }
    }
  },
  /**
   * @function
   *
   */
  onPostShow:function(){
    /*var self=this;
    debugger;
    var config={};
    config["statusChange"]=function(isOnline){
      if(isOnline){
        self.view.loadingScreen.hide(2);
      }else{
        self.view.loadingScreen.show("offline",2);
      }
    }
    kony.net.setNetworkCallbacks(config);*/
    return;
    if(this._inspection===null||this._inspection===undefined)return;
    else if(this.assetDetail===null)
      this.getAssetDetail(validateText(this._inspection["asset_Id"]));
    this.view.forceLayout();
  },
  getAssetDetailSuccessCB:function(result){
    debugger;
    this.view.loadingScreen.hide();
    kony.application.dismissLoadingScreen();
    if(result!==null&&result!==undefined){
      if(Array.isArray(result.Assets)){
        this.populateAssetDetail(result.Assets[0]);
      }
    }
  },
  /**********************************************************************************
   *	Name	:	getAssetDetail
   *	Author	:	Kony
   *	Purpose	:	To get the detail of the asset for the provided asset id.
   ***********************************************************************************/
  getAssetDetail:function(assetId){
    if(assetId===null || assetId===undefined){
      return;
    }
    try{
      var client = kony.sdk.getCurrentInstance();
      var intgService;
      intgService = client.getIntegrationService("Assets");
      this.view.loadingScreen.show();
      //kony.model.ApplicationContext.showLoadingScreen("Please wait..");
      intgService.invokeOperation("getAssetById",{},{"id":assetId},this.getAssetDetailSuccessCB.bind(this),this.getAssetDetailFailureCB.bind(this));
    }catch(excp){
      this.view.loadingScreen.hide();
      kony.application.dismissLoadingScreen();
      kony.print(JSON.stringify(excp));
    }
  },
  getAssetDetailFailureCB:function(result){
    this.view.loadingScreen.hide();
    kony.application.dismissLoadingScreen();
    alert("error:"+result)
  },
  populateAssetDetail:function(asset){
    if(asset!==null&&asset!==undefined){
      this.assetDetail=asset;
      this.view.lblAssetId2.text=validateText(asset.asset_Id);
      this.view.lblAssetCodeAssetDetailValue.text=validateText(asset.asset_Type_Name);
      this.view.lblAssetName.text=validateText(asset.asset_Type_Description);
      this.view.lblAssetDescription.text=validateText(asset.asset_Description);
      this.view.lblLocationCode.text=validateText(asset.asset_Location_Id);
      this.view.lblAssetAddress.text=validateText(asset.locationDes)+" "+validateText(asset.street);
      this.view.lblAssetGroup0.text="XXX";
      this.view.lblAssetGroup1.text="XXX";
      this.view.lblPartNumber.text=validateText(asset.manufacture_Part_Nbr);
      this.view.lblModelNumber.text=validateText(asset.manufacture_Model_Nbr);
      this.view.lblSerialNumberValue.text=validateText(asset.manufacture_Serial_Nbr);
    }
  },
  _onClickOfHistory: function(){
    var navigationObj = new kony.mvc.Navigation("frmInspectionHistory");
    var navigationData = {};
    navigationData.previousForm = "frmInspectionReview";
    if(typeof this.navigationData==='object' &&  this.navigationData!==null){
      var inspection=this.navigationData["inspection"];
      if(typeof inspection==='object' &&  inspection!==null){
        var assetId=inspection["Asset_Id"];
        if(typeof assetId==='string' || typeof assetId==='number'){
          navigationData.asset_id = assetId;
          navigationObj.navigate(navigationData);
        }
      }
    }
  },
  /**
   * @function
   *
   */
  resetFormData:function(){
    this.view.flxInspectionImage.removeAll();
    this.view.flxInspectionImage.setVisibility(false);
  },

});