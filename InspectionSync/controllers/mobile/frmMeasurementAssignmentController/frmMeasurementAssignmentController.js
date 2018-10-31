define({

  _navigationData:null,
  assetMeasurementSet:null,
  measurementSetMeasurementRange:null,
  measurementSetRange:null,
  measurementRange:null,
  measurement:null,
  measurementMap:null,
  selectedMeasurement:null,
  _selectedIndex:-1,
  count:0,


  /**
   * @function
   *
   * @param data 
   */
  onNavigate: function(data) {
    if(!InspectionUtil.isNetworkAvailable()){
      this.view.loadingScreen.show("offline",2);
    }
    this._navigationData = data;
    this.preProcessFormData();
    return;
    this._userData = data.userData;
    this._userRole = data.userData.userRole;
    if((this._userRole+"").toLowerCase()=="admin"){
      this._fetchUserData();
      //this.view.lbxAssignedTo.isVisible = true;
      this.view.segAssignedTech.removeAll();
      this.view.flxAssignedToAdmin.isVisible = true;
      this.view.lblTechnicianName.text = "";
      this.view.lblMemberName.text = data.userData.firstName + " "+ data.userData.lastName;
      this.view.flxAssignedToMember.isVisible = false;
    }
    else{
      //this.view.lbxAssignedTo.isVisible = false;
      this.view.flxAssignedToAdmin.isVisible = false;
      this.view.lblTechnicianName.text = data.userData.firstName + " "+ data.userData.lastName;
      this.view.lblMemberName.text = data.userData.firstName + " "+ data.userData.lastName;
      this.view.flxAssignedToMember.isVisible = true;
    }
    this._selectedIndex = -1;
    this.view.flxMeasurementSet.removeAll();
    this.view.flxPDFContainer.removeAll();
    this._data = data.rowData;
    this._addDataToAssetCard(data.rowData);
    this._createDynamicMeasurementSet(data.rowData);
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
    var self=this;
    if(typeof this._navigationData==='object' && this._navigationData!==null){
      var asset=this._navigationData["assetInfo"];
      this.populateAssetInfo(asset);
      this.getAssetMeasurement(asset["Asset_Id"]);
    }
    /*var config={};
    config["statusChange"]=function(isOnline){
      if(isOnline){
        self.view.loadingScreen.hide(2);
      }else{
        self.view.loadingScreen.show("offline",2);
      }
    }
    kony.net.setNetworkCallbacks(config);*/
  },
  showInfoCallBack: function(measurementID, measurementRangeID) {
    debugger;
    this.getMesurementInfo(measurementID, measurementRangeID);
  },
  /**
   * @function
   *
   * @param measurementID 
   * @param measurement_Range_ID 
   */
  getMesurementInfo:function(measurementID,measurement_Range_ID,measurementSetId){
    //alert("measurementID: "+measurementID);
    //alert("measurement_Range_ID: "+measurement_Range_ID);
    //return;
    if((typeof measurementID==='string' || typeof measurementID==='number') && 
       (typeof measurement_Range_ID==='string' || typeof measurement_Range_ID=='number')){
      if(typeof this.measurementMap==='object' &&  this.measurementMap!==null){
        var measurement=this.measurementMap[measurementID];
        if(typeof measurement==='object' &&  measurement!==null){
          this.selectedMeasurement=measurement;
        }
        if(typeof measurementSetId==='string' || typeof measurementSetId==='number'){
          var options={};
          options["whereConditionAsAString"]="Measurement_Set_Id = '"+measurementSetId+
            "' AND Measurement_Range_Id ='"+measurement_Range_ID+"'" ;
          //alert("options :"+JSON.stringify(options));
          this._fetchRecord("measurement_hstry", options);
        }


        return;
        /*if(Array.isArray(this.inspectionMeasurement)&& (this.inspectionMeasurement).length>0){
          if(typeof this.inspectionMeasurement[0]["Measurement_Set_Id"]==='string' ||
             typeof this.inspectionMeasurement[0]["Measurement_Set_Id"]==='number' ){
            var options={};
            options["whereConditionAsAString"]="Measurement_Set_Id = '"+this.inspectionMeasurement[0]["Measurement_Set_Id"]+
              "' AND Measurement_Range_Id ='"+measurement_Range_ID+"'" ;
            this.count=0;
            this._fetchRecords("measurement_hstry", options);
          }
        }*/
      }
    }
  },
  /**
   * @function
   *
   * @param assetMeasurement 
   */
  getInspectionRecord:function(assetMeasurement){
    var inspectionObj={};
    inspectionObj["Status"]="Assigned";
    inspectionObj["Signature"]="";
    inspectionObj["SoftDeleteFlag"]=false;
    inspectionObj["id"]=0;

    var scheduledTimestamp = this._getScheduledDate();
    if (kony.sdk.isNullOrUndefined(scheduledTimestamp)) {
      alert("Select scheduled timestamp.");
      return;
    }
    inspectionObj["Assigned_Timestamp"]=scheduledTimestamp;
    inspectionObj["CreatedTimestamp"]=scheduledTimestamp;
    inspectionObj["LastUpdatedTimestamp"]=scheduledTimestamp;
    var assigned_to = "";
    if(!kony.sdk.isNullOrUndefined(this.view.segAssignedTech.selectedRowItems) && this.view.segAssignedTech.selectedRowItems.length>0){
      assigned_to = this.view.segAssignedTech.selectedRowItems[0]["User_Id"];
    }
    else{
      alert("Select Technician to Assign");
      return;
    }
    inspectionObj["Assigned_To"]=assigned_to+"";
    inspectionObj["InspectedBy"]=assigned_to+"";
    if(typeof this._navigationData==='object' &&  this._navigationData!==null){
      var asset=this._navigationData["assetInfo"];
      if(typeof asset==='object' &&  asset!==null){
        var assetId=asset["Asset_Id"];
        if(typeof assetId ==='string' || typeof assetId==='number'){
          inspectionObj["Asset_Id"]=assetId;
        }
      }
    }
    return inspectionObj;
  },
  /**
   * @function
   *
   * @param assetMeasurement 
   */
  createInspection:function(assetMeasurement){
    if(typeof assetMeasurement==='object' &&  assetMeasurement!==null){
      var dataModel="";
      var inspectionRecord=this.getInspectionRecord(assetMeasurement);

      /*var record={
        "Status":"Assigned",
        "Assigned_To":"Tony",
        "Asset_Id":1,
        "CreatedTimestamp":"2018-09-18T15:57:47+05:30",
        "InspectedBy":"Tony",
        //"Inspection_Id":93,
        "Signature":"",
        "LastUpdatedTimestamp":"2018-09-19T12:00:25+05:30",
        //"Inspection_Images_Id":"null",
        "Assigned_Timestamp":"2018-01-05T15:24:27+05:30",
        "SoftDeleteFlag":false,
        "id":0,
      };*/
      this._createRecord(DATA_MODEL.INSPECTION, inspectionRecord);
    }
  },
  /**
   * @function
   *
   * @param dataModel 
   * @param response 
   */
  _createFailure:function(dataModel,response){
    this.view.loadingScreen.hide(1);
    switch(dataModel){
      case DATA_MODEL.INSPECTION:
        break;
      case DATA_MODEL.INSPECTION_MEASUREMENT:
    }
  },
  /**
   * @function
   *
   * @param dataModel 
   * @param response 
   */
  _createSuccess:function(dataModel,response){
    this.view.loadingScreen.hide(1);
    switch(dataModel){
      case DATA_MODEL.INSPECTION:
        if(typeof response==='object' &&  response!== null){
          var inspectionId=response["Inspection_Id"];
          if(!isNaN(inspectionId)){
            this.createInspectionMeasurement(inspectionId);
          }
        }
        break;
      case DATA_MODEL.INSPECTION_MEASUREMENT:
        var inspectionId=parseInt(response["Inspection_Id"]);
        if(inspectionId<0){
          inspectionId=inspectionId*-1;
        }
        //this.view.alertpopup.showPopUp((app_constant.inspection+inspectionId + " created successfully "));
        this.view.alertpopup.showPopUp(("Inspection "+inspectionId + " created successfully "));
        
        //app_constant.offline_inspection_msg +(-1*inspectionId)+app_constant.offline_inspection_closing_msg;
        break;
    }
  },
  /**
   * @function
   *
   * @param inspectionId 
   */
  createInspectionMeasurement:function(inspectionId){
    if(!isNaN(inspectionId)){
      if(!isNaN(this._selectedIndex) && this._selectedIndex>-1 &&
         Array.isArray(this.assetMeasurementSet )){
        var assetMeasurementSet=this.assetMeasurementSet[this._selectedIndex];
        if(typeof assetMeasurementSet==='object' && assetMeasurementSet!==null ){
          var measurementSetId=assetMeasurementSet["Measurement_Set_Id"];
          if(typeof measurementSetId==='string' || typeof measurementSetId==='number'){
            var record={};
            record["Inspection_Id"]=inspectionId;
            record["Measurement_Set_Id"]=measurementSetId;
            record["SoftDeleteFlag"]=false;
            record["CreatedTimestamp"]=this._getScheduledDate();
            record["LastUpdatedTimestamp"]=this._getScheduledDate();
            this._createRecord(DATA_MODEL.INSPECTION_MEASUREMENT, record);
          }
        }
      }
    }
  },
  /**
   * @function
   *
   * @param dataModel 
   * @param record 
   */
  _createRecord:function(dataModel,record){
    if(typeof dataModel==='string' && dataModel.length>0 && typeof record==='object' &&  record!==null ){
      try{
        var dataObj=new kony.sdk.KNYObj(dataModel);
        this.view.loadingScreen.show("Loading..",1);
        dataObj.create(record, {}, this._createSuccess.bind(this,dataModel), this._createFailure.bind(this,dataModel));
      }catch(excp){
        debugger;
        kony.print("#### Exception occured while creating record: ####"+excp.message);
      }
    }
  },
  /**
   * @function
   *
   */
  _onClickofSubmit: function() {
    if(typeof this._selectedIndex==='number' && this._selectedIndex!==-1){
      if(Array.isArray(this.assetMeasurementSet)){
        var assetMeasurement=this.assetMeasurementSet[this._selectedIndex];
        if(typeof assetMeasurement==='object' &&  assetMeasurement!==null){
          this.createInspection(assetMeasurement);
        }
      }
    }else{
      alert("Please select measurement set!");
    }
    return;




    /*if (this._selectedIndex !== -1 && !kony.sdk.isNullOrUndefined(this._data[0].measurementSet) &&
        !kony.sdk.isNullOrUndefined(this._data[0].measurementSet[this._selectedIndex].measurement_setID)) {
      var measurementSetId = this._data[0].measurementSet[this._selectedIndex].measurement_setID;
      var assigned_to = "";
      if(this._userRole.toLowerCase()=="admin"){
        if(!kony.sdk.isNullOrUndefined(this.view.segAssignedTech.selectedRowItems) && this.view.segAssignedTech.selectedRowItems.length>0){
          assigned_to = this.view.segAssignedTech.selectedRowItems[0].email;
        }
        else{
          alert("Select Technician to Assign");
          return;
        }
        //assigned_to = this.view.lbxAssignedTo.selectedKey;
      }
      else{
        assigned_to = this._userData.email;
      }            
      var scheduledTimestamp = this._getScheduledDate();
      if (kony.sdk.isNullOrUndefined(scheduledTimestamp)) {
        alert("Select scheduled timestamp.");
        return;
      }
      var createdTimestamp = this._getCurrentTimeStamp();
      this.view.loadingScreen.show();
      //             kony.application.showLoadingScreen("", "Please wait...", constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true, null);
      var data = {
        "asset_Id": this._data[0].asset_Id,
        "Inspection_Id": "9",
        "assigned_Timestamp": scheduledTimestamp,
        "assigned_To": assigned_to,
        "inspectedBy": "",
        "inspection_Images_Id": "23",
        "signature": "nothing",
        "status": "Assigned",
        "timestamp": scheduledTimestamp,
        "measurement_Set_Id": measurementSetId
      };
      this._insertRecords("inspectionObjService", "Inspection", data, this._insertSuccessCallback.bind(this), this._insertFailureCallback.bind(this));

    } else {
      alert("Measurement Id Not defined.");
    }*/
  },
  /**
   * @function
   *
   * @param assetId 
   */
  getAssetMeasurement:function(assetId){
    var dataModel="asset_measurement_set";
    var options={};
    options["whereConditionAsAString"]="Asset_Id = '"+assetId+"'";
    this.view.loadingScreen.show("loading..",1);
    this._fetchRecord(dataModel,options);
  },
  /**
   * @function
   *
   * @param dataModel 
   * @param record 
   */
  recordFetchSuccess:function(dataModel,record){
    debugger;
      this.view.loadingScreen.hide(1);
    switch(dataModel){
      case "asset_measurement_set":
        this.assetMeasurementSet=record;
        if(Array.isArray(this.assetMeasurementSet)){
          var assetMeasurementSetLength=record.length;
          var measurementSetClause="Measurement_Set_Id IN (";
          var i=0;
          for(;i<assetMeasurementSetLength-1;i++){
            measurementSetClause=measurementSetClause+record[i]["Measurement_Set_Id"]+",";
          }
          measurementSetClause=measurementSetClause+record[i]["Measurement_Set_Id"]+")";
          var options={};
          options["whereConditionAsAString"]=measurementSetClause;
          this._fetchRecord("measurementset_measurementrange", options);
        }
        break;
      case "measurementset_measurementrange":
        this.measurementSetRange =record;
        if(Array.isArray(record)&&record.length>0){
          var measurementRangeClause="Measurement_Range_Id IN (";
          var i=0;
          for(;i<record.length-1;i++){
            measurementRangeClause=measurementRangeClause+record[i]["Measurement_Range_Id"]+",";
          }
          measurementRangeClause=measurementRangeClause+record[i]["Measurement_Range_Id"]+")";
          var options={};
          options["whereConditionAsAString"]=measurementRangeClause;
          
          this._fetchRecord("measurement_range",options);
        }
        break;
      case "measurement_range":
        this.measurementRange =record;
        var measurementClause="Measurement_Id IN (";
        if(Array.isArray(record)&&record.length>0){
          var i=0;
          for(;i<record.length-1;i++){
            measurementClause=measurementClause+record[i]["Measurement_Id"]+",";
          }
          measurementClause=measurementClause+record[i]["Measurement_Id"]+")";
          var options={};
          options["whereConditionAsAString"]=measurementClause;
          this._fetchRecord("measurement",options);
        }
        break;
      case "measurement":
        this.measurement =record;
        this.processMeasurementSetRecord();
        this.getTechnicians();
        break;
      case "inspection_user":
        this.processTechnicianRecords(record);
        break;
      case "measurement_hstry":
        this.measurementHistory =record;
        //alert("record: "+JSON.stringify(record));
        this.view.loadingScreen.show("loading..",1);
        this.onSuccesCallbackInfo(this.selectedMeasurement ,this.measurementHistory);
    }
  },
  /**
   * @function
   *
   * @param technicianList 
   */
  processTechnicianRecords:function(technicianList){
    this.inspectionUser=technicianList;
    var technician;
    var result=[];
    if(Array.isArray(technicianList)){
      var listLength=technicianList.length;
      var tempJSON;// = [];

      var initials ;// ="";
      for(var i=0;i<listLength;i++){
        technician=technicianList[i];
        tempJSON = {};
        var name = technician["FirstName"]+" "+technician["LastName"];
        initials  ="";
        if(typeof technician["FirstName"]==='string' && typeof technician["LastName"]==='string'){
          initials = technician.FirstName.charAt(0)+ technician.LastName.charAt(0);
        }
        tempJSON.email = technician.email;
        tempJSON.name =name;
        tempJSON.initials = initials;
        tempJSON.User_Id=technician["User_Id"];
        result.push(tempJSON);
      }
    }
    this._setUserData(result);
  },
  _setUserData: function(data){
    if (!kony.sdk.isNullOrUndefined(data) && Array.isArray(data) && data.length > 0) {
      var widgetDataMap = {
        "lblInitials":"initials",
        "lblName":"name",
        "lblEmail":"email",
        "lblUserId":"User_Id"
      };
      this.view.segAssignedTech.widgetDataMap = widgetDataMap;
      this.view.segAssignedTech.removeAll();
      this.view.segAssignedTech.setData(data);
    }

  },
  /**
   * @function
   *
   */
  getTechnicians:function(){
    this.view.loadingScreen.show("loading..",1);
    this._fetchRecord("inspection_user", null);
  },
  /**
   * @function
   *
   */
  processMeasurementSetRecord:function(){
    debugger;
    var measurementMap=InspectionUtil.parseRecords(this.measurement ,"Measurement_Id" );
    this.measurementMap=measurementMap;
    if(Array.isArray(this.measurementRange)){
      var listLength=this.measurementRange.length;
      var measurementRange;
      var measurementId;
      var measurementObj;
      for(var i=0;i<listLength;i++){
        measurementRange=this.measurementRange[i];
        if(typeof measurementRange==='object' &&  measurementRange!==null){
          measurementId=measurementRange["Measurement_Id"];
          if(typeof measurementId==='string' || typeof measurementId==='number'){
            measurementObj=measurementMap[measurementId];
            if(Array.isArray(measurementObj) && measurementObj.length>0){
              measurementRange["measurement"]=measurementObj[0];
            }else{
              measurementRange["measurement"]=null;
            }
          }

        }
      }
    }
    var measurementRangeMap=InspectionUtil.parseRecords(this.measurementRange,"Measurement_Range_Id");
    if(Array.isArray(this.measurementSetRange)){
      var listLength=this.measurementSetRange.length;
      var measurementSetRangeObj;
      var measurementRangeId;
      var measurementRangeObj;
      for(var i=0;i<listLength;i++){
        measurementSetRangeObj=this.measurementSetRange[i];
        measurementRangeId=measurementSetRangeObj["Measurement_Range_Id"];
        if(typeof measurementRangeId==='string' || typeof measurementRangeId==='number'){
          measurementRangeObj=measurementRangeMap[measurementRangeId];
          if(Array.isArray(measurementRangeObj) && measurementRangeObj.length>0){
            measurementSetRangeObj["measurement_range"]=measurementRangeObj[0];
          }else{
            measurementSetRangeObj["measurement_range"]=null;
          }
        }
      }
    }
    var measurementSetRangeMap=InspectionUtil.parseRecords(this.measurementSetRange, "Measurement_Set_Id");
    if(Array.isArray(this.assetMeasurementSet)){
      var listLength=this.assetMeasurementSet.length;
      var assetMeasurementSetObj;
      var measurementSetId;
      var measurementSetRangeObj;
      for(var i=0;i<listLength;i++){
        assetMeasurementSetObj=this.assetMeasurementSet[i];
        measurementSetId=assetMeasurementSetObj["Measurement_Set_Id"];
        if(typeof measurementSetId==='string' || typeof measurementSetId==='number'){
          measurementSetRangeObj=measurementSetRangeMap[measurementSetId];
          if(Array.isArray(measurementSetRangeObj)){
            assetMeasurementSetObj["measurement_set_range"]=measurementSetRangeObj;
          }else{
            assetMeasurementSetObj["measurement_set_range"]=[];
          }
        }
      }
    }
    this._createDynamicMeasurementSet(this.assetMeasurementSet);
  },
  /**
   * @function
   *
   * @param measurementSetList 
   */
  _createDynamicMeasurementSet:function(measurementSetList){
    this.view.flxMeasurementSet.removeAll();
    if(Array.isArray(measurementSetList)){
      var listLength=measurementSetList.length;
      var measurementSet;
      var measurementSetRangeList;
      for(var i=0;i<listLength;i++){
        measurementSet=measurementSetList[i];
        if(typeof measurementSet==='object' &&  measurementSet!==null){
          measurementSetRangeList=measurementSet["measurement_set_range"];
          if(Array.isArray(measurementSetRangeList) && measurementSetRangeList.length>0){
            this.sortMeasurementSetRange(measurementSetRangeList);
            var set = this._getDynamicMeasurementSet(measurementSetList[i],i,measurementSet["Measurement_Set_Id"]);
            this.view.flxMeasurementSet.add(set);
          }
        }
      }
    }
  },
  /**
   * @function
   *
   */
  sortMeasurementSetRange:function(measurementSetRangeList){
    if(Array.isArray(measurementSetRangeList)){
      // [].sort(compare?, b);
      measurementSetRangeList.sort(function(a,b){
        var nameA;
        var nameB;
        var measurement_range;
        var measurement;
        if(typeof a==='object' &&  a!==null){
          measurement_range=a["measurement_range"];
          if(typeof measurement_range==='object' &&  measurement_range!==null){
            measurement=measurement_range["measurement"];
            if(typeof measurement==='object' &&  measurement!==null){
              nameA=measurement["Name"];
            }
          }
        }
        if(typeof b==='object' &&  b!==null){
          measurement_range=b["measurement_range"];
          if(typeof measurement_range==='object' &&  measurement_range!==null){
            measurement=measurement_range["measurement"];
            if(typeof measurement==='object' &&  measurement!==null){
              nameB=measurement["Name"];
            }
          }
        }
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }
  },
  /**
   * @function
   *
   * @param dataModel 
   * @param option 
   */
  _fetchRecord:function(dataModel,options){
    function failureCB(error){
      alert(JSON.stringify(error));
      this.view.loadingScreen.hide(1);
      this.view.loadingScreen.show(JSON.stringify(error),4);
      kony.print("Unable to get record for "+dataModel+": "+JSON.stringify(error));
    }
    if(typeof dataModel==='string'){
      try{
        if(options===undefined)
          options=null;
        var inspbj=new kony.sdk.KNYObj(dataModel);
        this.view.loadingScreen.show("Loading..",1);
        inspbj.get(options,this.recordFetchSuccess.bind(this,dataModel),failureCB.bind(this));
      }catch(excp){
        this.view.loadingScreen.hide(1);
        this.view.loadingScreen.show(excp.message,4);
        //alert(excp.message);
      }
    }else{
      alert("Data model name can't be empty");
    }

  },
  /**
   * @function
   *
   */
  populateAssetInfo:function(asset){
    if(typeof asset==='object' &&  asset!==null){
      this.view.lblAssetId.text = app_constant.asset+asset["Asset_Id"];
      var assetType=asset["type"];
      if(typeof assetType==='object' &&  assetType!==null){
        this.view.lblAssetType.text = assetType["Name"];
        this.view.lblAssetDescription.text = assetType["Description"];
      }
      if(typeof asset["Reference_Doc"]==='string' && asset["Reference_Doc"]!=="null" && asset["Reference_Doc"].length>0){
        this.view.pdfviewer.setURL(asset["Reference_Doc"]);
      }else{
        this.view.pdfviewer.setURL("http://forms.kony.com/rs/konysolutions/images/DS-Kony-Marketplace.pdf");
      }
    }
  },
  _addDataToAssetCard: function(data) {
    if (!kony.sdk.isNullOrUndefined(data) && Array.isArray(data) && data.length > 0) {
      this.view.lblAssetId.text = data[0].asset_Id;
      this.view.lblAssetType.text = data[0].asset_Type_Name;
      this.view.lblAssetDescription.text = data[0].asset_Type_Description;
      if (data[0].reference_doc.toLowerCase()!=="null" && data[0].reference_doc !== "" && data[0].reference_doc !== undefined) {
        var pdfviewer = new com.konymp.pdfviewer({
          "clipBounds": true,
          "height": "100%",
          "id": "pdfviewer",
          "isVisible": false,
          "layoutType": kony.flex.FREE_FORM,
          "left": "0dp",
          "masterType": constants.MASTER_TYPE_USERWIDGET,
          "skin": "sknFlxICDefault",
          "top": "0dp",
          "width": "100%"
        }, {}, {});
        pdfviewer.url = data[0].reference_doc;
        pdfviewer.pdfType = "Online";
        pdfviewer.setAndroidPath = "";
        pdfviewer.setIphonePath = "";
        if (this.view.flxPDFContainer.pdfviewer !== undefined) {
          this.view.flxPDFContainer.remove(this.view.flxPDFContainer.pdfviewer);
        }
        this.view.flxPDFContainer.add(pdfviewer);
      }

      //this.view.pdfviewer.setURL(data[0].reference_doc);
    }

  },
  /*_createDynamicMeasurementSet2: function(data) {
    if (!kony.sdk.isNullOrUndefined(data) && Array.isArray(data) && data.length > 0) {
      if (data[0].measurementSet !== undefined && Array.isArray(data[0].measurementSet)) {
        this.view.flxMeasurementSet.removeAll();
        for (var i = 0; i < data[0].measurementSet.length; i++) {
          data[0].measurementSet = data[0].measurementSet.sort(function(a, b) {
            var nameA = a.measurement_setID.toLowerCase();
            var nameB = b.measurement_setID.toLowerCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          var set = this._getDynamicMeasurementSet(data[0].measurementSet, i);
          this.view.flxMeasurementSet.add(set);
        }
      }
    }
  },*/
  _onClickPDF: function() {
    if(!kony.sdk.isNullOrUndefined(this.view.pdfviewer)){
      this.view.pdfviewer.isVisible = true;
      this.view.flxPDFViewer.left = "0%";
    }

  },
  /**
   * @function
   *
   * @param data 
   * @param index 
   */
  _getDynamicMeasurementSet: function(data, index,measurementSetId) {
    if(data===null || data === undefined || index===null || index===undefined)
      return;
    var flxSet = new kony.ui.FlexContainer({
      "autogrowMode": kony.flex.AUTOGROW_HEIGHT,
      "clipBounds": true,
      "id": "flxSet" + index,
      "isVisible": true,
      "layoutType": kony.flex.FLOW_VERTICAL,
      "left": "0dp",
      "skin": "sknFlxICDefault",
      "top": "0dp",
      "width": "100%",
      "zIndex": 1
    }, {}, {});
    flxSet.setDefaultUnit(kony.flex.DP);
    var flxSetHeader = new kony.ui.FlexContainer({
      "autogrowMode": kony.flex.AUTOGROW_NONE,
      "clipBounds": true,
      "height": "60dp",
      "id": "flxSetHeader" + index,
      "isVisible": true,
      "layoutType": kony.flex.FLOW_HORIZONTAL,
      "left": "0dp",
      "skin": "sknFlxICDefault",
      "top": "14dp",
      "width": "100%",
      "zIndex": 1
    }, {}, {});
    flxSetHeader.setDefaultUnit(kony.flex.DP);
    var flxRadioImage = new kony.ui.FlexContainer({
      "autogrowMode": kony.flex.AUTOGROW_NONE,
      "clipBounds": true,
      "height": "60dp",
      "id": "flxRadioImage" + index,
      "isVisible": true,
      "layoutType": kony.flex.FREE_FORM,
      "left": "21dp",
      "skin": "sknFlxICDefault",
      "top": "0dp",
      "width": "30dp",
      "zIndex": 1,
      "onClick": this._onClickOfRadioButtion.bind(this)
    }, {}, {});
    flxRadioImage.setDefaultUnit(kony.flex.DP);
    var imgRadio = new kony.ui.Image2({
      "centerY": "50%",
      "height": "20dp",
      "id": "imgRadio" + index,
      "isVisible": true,
      "left": "5dp",
      "skin": "sknImgICDefault",
      "src": "fsins_ic_radio_unselected.png",
      "top": "0dp",
      "width": "20dp",
      "zIndex": 1
    }, {
      "imageScaleMode": constants.IMAGE_SCALE_MODE_FIT_TO_DIMENSIONS,
      "padding": [0, 0, 0, 0],
      "paddingInPixel": false
    }, {});
    flxRadioImage.add(imgRadio);
    var lblSetHeader = new kony.ui.Label({
      "centerY": "50%",
      "id": "lblSetHeader" + index,
      "isVisible": true,
      "left": "5dp",
      "skin": "sknlblICBg000000RCSFPDisReg130",
      //"text": data[index].measurement_setID.toUpperCase(),
      "text": app_constant.measurement_set+data["Measurement_Set_Id"],//.measurement_setID.toUpperCase(),
      "textStyle": {
        "letterSpacing": 0,
        "strikeThrough": false
      },
      "top": "10%",
      "width": kony.flex.USE_PREFFERED_SIZE,
      "zIndex": 1
    }, {
      "contentAlignment": constants.CONTENT_ALIGN_MIDDLE_LEFT,
      "padding": [0, 0, 0, 0],
      "paddingInPixel": false
    }, {
      "textCopyable": false
    });
    flxSetHeader.add(flxRadioImage, lblSetHeader);
    var flxSetBody = new kony.ui.FlexContainer({
      "autogrowMode": kony.flex.AUTOGROW_HEIGHT,
      "clipBounds": true,
      "id": "flxSetBody" + index,
      "isVisible": true,
      "layoutType": kony.flex.FLOW_VERTICAL,
      "left": "0dp",
      "skin": "sknFlxICDefault",
      "top": "5dp",
      "width": "100%",
      "zIndex": 1
    }, {}, {});
    flxSetBody.setDefaultUnit(kony.flex.DP);
    if (!kony.sdk.isNullOrUndefined(data["measurement_set_range"]) && Array.isArray(data["measurement_set_range"])) {
      var measurementSetRangeListLength=data["measurement_set_range"].length;
      var measurementSetRangeObj;
      var measurementRangeObj;
      for (var i = 0; i <measurementSetRangeListLength; i++) {
        measurementSetRangeObj=data["measurement_set_range"][i];
        if(typeof measurementSetRangeObj==='object' &&  measurementSetRangeObj!==null){
          measurementRangeObj=measurementSetRangeObj["measurement_range"];
          if(typeof measurementRangeObj==='object' &&  measurementRangeObj!==null){
            var flxMeasurement = this._getDynamicSetBody(measurementRangeObj, index, i, measurementSetRangeObj["Measurement_Set_Id"]);
            flxSetBody.add(flxMeasurement);
          }
        }
      }
    }
    flxSet.add(flxSetHeader, flxSetBody);
    return flxSet;
  },
  /**
   * @function
   *
   * @param data 
   * @param index 
   * @param i 
   * @param measurementID 
   */
  _getDynamicSetBody: function(data, index, i, measurementSetId) {
    var measurementName;
    var measurementId;
    var measurementRangeId;
    measurementId=data["Measurement_Id"];
    measurementRangeId=data["Measurement_Range_Id"];
    if(typeof data["measurement"]==='object' &&  data["measurement"]!==null){
      measurementName=data["measurement"]["Name"];
    }else{
      measurementName="NA";
    }
    var flxMeasurement = new kony.ui.FlexContainer({
      "autogrowMode": kony.flex.AUTOGROW_HEIGHT,
      "bottom": "14dp",
      "clipBounds": true,
      //"height": "46dp",
      "id": "flxMeasurement" + index + i,
      "isVisible": true,
      "layoutType": kony.flex.FLOW_HORIZONTAL,
      "left": "13%",
      "skin": "sknFlxBr666effRound",
      "top": "0dp",
      "width": "77%",
      "zIndex": 1
    }, {}, {});
    flxMeasurement.setDefaultUnit(kony.flex.DP);
    var flxImageContainer = new kony.ui.FlexContainer({
      "autogrowMode": kony.flex.AUTOGROW_NONE,
      //"bottom": "12dp",
      "clipBounds": true,
      "height": "22dp",
      "id": "flxImageContainer" + index + i,
      "isVisible": true,
      //"layoutType": kony.flex.FLOW_HORIZONTAL,
      "left": "14dp",
      //"skin": "sknFlxBr666effRound",
      "top": "12dp",
      "width": "22dp",
      "zIndex": 1,

      "layoutType": kony.flex.FREE_FORM,
      "skin": "sknFlxICDefault",

      "onClick":this._onClickOfInfoImage.bind(this, data, index, i, measurementId, measurementRangeId,measurementSetId)
    }, {}, {});
    flxImageContainer.setDefaultUnit(kony.flex.DP);
    var imgMeasurement = new kony.ui.Image2({
      "centerY": "50%",
      "centerX":"50%",
      "height": "22dp",
      "id": "imgMeasurement" + index + i,
      "isVisible": true,
      //"left": "14dp",
      "skin": "sknImgICDefault",
      "src": "fsins_ic_info.png",
      //"top": "12dp",
      //"bottom": "12dp",
      "width": "22dp",
      "zIndex": 1,
      // "onTouchEnd": this._onClickOfInfoImage.bind(this, data, index, i, measurementId, measurementRangeId,measurementSetId)
    }, {
      "imageScaleMode": constants.IMAGE_SCALE_MODE_MAINTAIN_ASPECT_RATIO,
      "padding": [0, 0, 0, 0],
      "paddingInPixel": false
    }, {});
    flxImageContainer.add(imgMeasurement);
    var lblMeasurementName = new kony.ui.Label({
      //                 "centerY": "50%",
      "id": "lblMeasurementName" + index + i,
      "isVisible": true,
      "left": "13dp",
      "skin": "sknLblICBg666EFFDisMed120",
      "text": measurementName,
      "textStyle": {
        "letterSpacing": 0,
        "strikeThrough": false
      },
      "top": "10dp",
      "bottom": "10dp",
      "width": "74.44%",
      "zIndex": 1
    }, {
      "contentAlignment": constants.CONTENT_ALIGN_MIDDLE_LEFT,
      "padding": [0, 0, 0, 0],
      "paddingInPixel": false
    }, {
      "textCopyable": false
    });
    flxMeasurement.add(flxImageContainer, lblMeasurementName);
    return flxMeasurement;
  },
  /**
   * @function
   *
   * @param data 
   * @param index 
   * @param i 
   * @param measurementID 
   * @param measurement_Range_ID 
   * @param eventObject 
   * @param x 
   * @param y 
   */
  _onClickOfInfoImage: function(data, index, i, measurementID, measurement_Range_ID, measurementSetId,eventObject, x, y) {
    debugger;
    this.getMesurementInfo(measurementID, measurement_Range_ID,measurementSetId);
    //getMesurementInfo
    //this.showInfoCallBack(measurementID, measurement_Range_ID);
  },
  _onClickOfInfoImage2: function(data, index, i, measurementID, measurement_Range_ID, eventObject, x, y) {
    this.view.loadingScreen.show();
    //         kony.application.showLoadingScreen("", "Please wait...", constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true, null);
    var queryParams = {
      "msid": measurementID
    };
    this._fetchFromODataService("inspectionObjService", "MeasurementSet", queryParams, this.onSuccesCallbackInfo.bind(this, measurement_Range_ID), this.errorCallbackInfo.bind(this));
  },
  /**
   * @function
   *
   * @param measurementInfo 
   * @param measurementHistory 
   */
  onSuccesCallbackInfo: function(measurementInfo,measurementHistory){

    debugger;
    if(Array.isArray(measurementInfo) &&  measurementInfo.length>0 &&
       Array.isArray(measurementHistory)){
      var data = this._processData(measurementInfo,measurementHistory);
      //alert("data: "+JSON.stringify(data));
      this.view.flxInfoCard.left="0%";
      this.view.InfoCard.setData(data);
      this.view.forceLayout();
      this.view.loadingScreen.hide(1);
    }
  },
  /*onSuccesCallbackInfo2: function(measurement_Range_ID, response) {
    this.view.loadingScreen.hide();
    kony.application.dismissLoadingScreen();
    var data = response.records[0].MeasurementHistoryList;
    var measurement_Range_Id = measurement_Range_ID;
    if (!kony.sdk.isNullOrUndefined(data) && Array.isArray(data) && data.length > 0) {
      data = data.filter(function(element) {
        if (element.measurement_Range_Id == measurement_Range_Id)
          return true;
        return false;
      }.bind(this));
      data = this._processData(data);
      this.view.flxInfoCard.left = "0%";

      this.view.InfoCard.setData(data);
    }
  },*/
  _processData: function(measurementInfo,measurementHistory){
    var result = {};
    if(Array.isArray(measurementInfo) && measurementInfo.length>0){
      result.measurement_name = measurementInfo[0]["Name"];
      result.measurement_Id = "#"+ measurementInfo[0]["Measurement_Id"];
      result.measurement_description = measurementInfo[0]["Description"];
    }
    if(Array.isArray(measurementHistory) && measurementHistory.length>0 ){
      var values = [];
      var tempJSON;
      for(var i=0;i<measurementHistory.length;i++){
        tempJSON = {};
        tempJSON.date = this._getUTCDate(measurementHistory[i].Inspection_Timestamp);
        tempJSON.time = this._getUTCTime(measurementHistory[i].Inspection_Timestamp);
        tempJSON.value = measurementHistory[i].Inspection_Value;
        tempJSON["Response_Type"]=measurementHistory[i]["Response_Type"];
        values.push(tempJSON);
      }
      result.values = values;
    }
    return result;
  },
  /*_processData2: function(data) {
    var result = {};
    if (!kony.sdk.isNullOrUndefined(this._data) && Array.isArray(this._data) && data.length > 0) {
      result.measurement_name = data[0].measurement_name;
      result.measurement_Id = "#" + data[0].measurement_Id;
      result.measurement_description = data[0].measurement_description;
      var values = [];
      for (var i = 0; i < data.length; i++) {
        var tempJSON = {};
        tempJSON.date = this._getUTCDate(parseInt(data[i].inspection_Timestamp));
        tempJSON.time = this._getUTCTime(parseInt(data[i].inspection_Timestamp));
        tempJSON.value = data[i].inspection_Value;
        tempJSON.responseType = data[i].response_Type;
        values.push(tempJSON);
      }
      result.values = values;
    }
    return result;
  },*/
  errorCallbackInfo: function(response) {
    this.view.loadingScreen.hide();
    kony.application.dismissLoadingScreen();
    //alert(response);
  },
  _getUTCDate: function(epochTime) {
    var result = "";
    var date = new Date(epochTime);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    result = this._addZeroPrefix(day) + "/" + this._addZeroPrefix(month) + "/" + year;
    return result;
  },
  _getUTCTime: function(epochTime) {
    var result;
    var currDate = new Date();
    var date = new Date(epochTime);
    var hr = this._addZeroPrefix(date.getHours());
    var min = this._addZeroPrefix(date.getMinutes());
    result = hr + ":" + min + " Hrs";
    return result;
  },
  _addZeroPrefix: function(number) {
    var result;
    if (number >= 0 && number < 10) {
      result = "0" + number;
    } else {
      result = number;
    }
    return result;
  },


  /*_onClickOfRadioButtion: function(eventobject) {
    var index = eventobject.id.replace("flxRadioImage", "");
    //eventobject["imgRadio"+index].src = "radio_selected.png";
    this._selectedIndex = index;
    if (!kony.sdk.isNullOrUndefined(this._data) && Array.isArray(this._data) && this._data.length > 0 && !kony.sdk.isNullOrUndefined(this._data[0].measurementSet) && Array.isArray(this._data[0].measurementSet) && this._data[0].measurementSet.length > 0) {
      for (var i = 0; i < this._data[0].measurementSet.length; i++) {
        if (i == this._selectedIndex) {
          this.view["imgRadio" + i].src = "fsins_ic_radio_selected.png";
        } else {
          this.view["imgRadio" + i].src = "fsins_ic_radio_unselected.png";
        }
      }
    }
  },*/
  _onClickOfRadioButtion: function(eventobject) {
    var index = eventobject.id.replace("flxRadioImage", "");
    this._selectedIndex = parseInt(index);
    var measurementSetRangeList;
    var measurementSet;
    if (!kony.sdk.isNullOrUndefined(this.assetMeasurementSet) && Array.isArray(this.assetMeasurementSet)){
      for (var i = 0; i < this.assetMeasurementSet.length; i++) {
        measurementSet=this.assetMeasurementSet[i];
        if(typeof measurementSet==='object' &&  measurementSet!==null){
          measurementSetRangeList = measurementSet["measurement_set_range"];
          if(Array.isArray(measurementSetRangeList) && measurementSetRangeList.length>0){
            if (i == this._selectedIndex) {
              this.view["imgRadio" + i].src = "fsins_ic_radio_selected.png";
            } else {
              this.view["imgRadio" + i].src = "fsins_ic_radio_unselected.png";
            }
          }
        }
      }
    }
  },
  /*_onClickofSubmit: function() {
    if (this._selectedIndex !== -1 && !kony.sdk.isNullOrUndefined(this._data[0].measurementSet) &&
        !kony.sdk.isNullOrUndefined(this._data[0].measurementSet[this._selectedIndex].measurement_setID)) {
      var measurementSetId = this._data[0].measurementSet[this._selectedIndex].measurement_setID;
      var assigned_to = "";
      if(this._userRole.toLowerCase()=="admin"){
        if(!kony.sdk.isNullOrUndefined(this.view.segAssignedTech.selectedRowItems) && this.view.segAssignedTech.selectedRowItems.length>0){
          assigned_to = this.view.segAssignedTech.selectedRowItems[0].email;
        }
        else{
          //alert("Select Technician to Assign");
          return;
        }
        //assigned_to = this.view.lbxAssignedTo.selectedKey;
      }
      else{
        assigned_to = this._userData.email;
      }            
      var scheduledTimestamp = this._getScheduledDate();
      if (kony.sdk.isNullOrUndefined(scheduledTimestamp)) {
        //alert("Select scheduled timestamp.");
        return;
      }
      var createdTimestamp = this._getCurrentTimeStamp();
      this.view.loadingScreen.show();
      //             kony.application.showLoadingScreen("", "Please wait...", constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true, null);
      var data = {
        "asset_Id": this._data[0].asset_Id,
        "Inspection_Id": "9",
        "assigned_Timestamp": scheduledTimestamp,
        "assigned_To": assigned_to,
        "inspectedBy": "",
        "inspection_Images_Id": "23",
        "signature": "nothing",
        "status": "Assigned",
        "timestamp": scheduledTimestamp,
        "measurement_Set_Id": measurementSetId
      };
      this._insertRecords("inspectionObjService", "Inspection", data, this._insertSuccessCallback.bind(this), this._insertFailureCallback.bind(this));

    } else {
      //alert("Measurement Id Not defined.");
    }
  },*/
  /**
   * @function
   *
   * @param response 
   */
  _insertSuccessCallback: function(response) {
    return;
    this.view.loadingScreen.hide();
    kony.application.dismissLoadingScreen();
    if (response.opstatus == 0) {
      this.view.alertpopup.showPopUp((response.id + " created successfully for "+this._data[0].asset_Id));
    }
  },
  /**
   * @function
   *
   * @param response 
   */
  _insertFailureCallback: function(response) {
    return;
    this.view.loadingScreen.hide();
    kony.application.dismissLoadingScreen();
    //alert(response);
  },
  _getCurrentTimeStamp: function() {
    var date = new Date();
    var userTimezoneOffset = date.getTimezoneOffset() * 60000;
    date = new Date(date.getTime() + userTimezoneOffset);
    var currDay = this._addZeroPrefix(date.getDate());
    var currMonth = this._addZeroPrefix(date.getMonth() + 1);
    var currYear = this._addZeroPrefix(date.getFullYear());
    var hr = this._addZeroPrefix(date.getHours());
    var min = this._addZeroPrefix(date.getMinutes());
    var sec = this._addZeroPrefix(date.getSeconds());
    var dateinSQLFormat = currYear + "-" + currMonth + "-" + currDay + "T" + hr + ":" + min + ":" + sec;
    return dateinSQLFormat;
  },
  _addZeroPrefix: function(number) {
    var result;
    if (number >= 0 && number < 10) {
      result = "0" + number;
    } else {
      result = number;
    }
    return result;
  },
  _insertRecords: function(objectService, dataModel, dataFields, successCallback, failureCallback) {
    return;
    try {
      var sdkClient = new kony.sdk.getCurrentInstance();
      if (Object.keys(sdkClient).length !== 0) {
        objectInstance = sdkClient.getObjectService(objectService, {
          "access": "online"
        });
      }
      if (objectInstance === null || objectInstance === undefined) {
        this.view.loadingScreen.hide();
        kony.application.dismissLoadingScreen();
        throw {
          "error": "ConnectionError",
          "message": "Please connect app to MF"
        };
        return;
      }
      var dataObject = new kony.sdk.dto.DataObject(dataModel);
      dataObject.setRecord(dataFields);
      var options = {
        "dataObject": dataObject,
        "headers": {
          "Content-Type": "application/json"
        },
        "queryParams": {}
      };
      if (kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)) {
        objectInstance.create(options, successCallback, failureCallback);
      }
    } catch (exception) {
      this.view.loadingScreen.hide();
      kony.application.dismissLoadingScreen();
      throw exception;
    }
  },
  _fetchFromODataService: function(objectService, dataModelObject, queryParams, successCallback, errorCallback) {
    try {
      var sdkClient = new kony.sdk.getCurrentInstance();
      var objectInstance;
      if (Object.keys(sdkClient).length !== 0) {
        objectInstance = sdkClient.getObjectService(objectService, {
          "access": "online"
        });
      }
      if (objectInstance === null || objectInstance === undefined) {
        this.view.loadingScreen.hide();
        kony.application.dismissLoadingScreen();
        throw {
          "error": "ConnectionError",
          "message": "Please connect app to MF"
        };
        return;
      }
      var dataObject = new kony.sdk.dto.DataObject(dataModelObject);
      var options = {
        "dataObject": dataObject,
        "headers": {
          "Content-Type": "application/json"
        },
        "queryParams": queryParams
      };
      if (kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)) {
        objectInstance.fetch(options, successCallback, errorCallback);
      }
    } catch (exception) {
      this.view.loadingScreen.hide();
      kony.application.dismissLoadingScreen();
      //@TODO remove //alerts
      //alert(exception);
    }
  },
  _fetchUserData: function(){
    this.view.loadingScreen.show();
    //       kony.application.showLoadingScreen("","please wait...",constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true,null);
    var objectService = "inspectionObjService";
    var dataModelObject = "UserList";
    var queryParams = {};
    this._fetchFromODataService(objectService, dataModelObject, queryParams, this._fetchUserData_Success.bind(this), this._fetchUserData_Failure.bind(this));
  },
  _fetchUserData_Success: function(response){
    this.view.loadingScreen.hide();
    kony.application.dismissLoadingScreen();
    var data = response.records;
    if (!kony.sdk.isNullOrUndefined(data) && Array.isArray(data) && data.length > 0) {
      data = data[0].Users;
      data = this._processUserData(data);
      this._setUserData(data);
    }
  },
  _fetchUserData_Failure: function(response){
    this.view.loadingScreen.hide();
    kony.application.dismissLoadingScreen();
    //alert(response);
  },
  /*_processUserData: function(data){
    var result = [];
    if (!kony.sdk.isNullOrUndefined(data) && Array.isArray(data) && data.length > 0) {
      for(var i=0;i<data.length;i++){
        var tempJSON = [];
        var name = data[i].FirstName+" "+data[i].LastName;
        var initials  ="";
        if(data[i].FirstName!==undefined && data[i].LastName)
          initials = data[i].FirstName.charAt(0)+ data[i].LastName.charAt(0);

        tempJSON.email = data[i].email;
        tempJSON.name =name;
        tempJSON.initials = initials;
        result.push(tempJSON);
      }
    }
    return result;
  },*/

  _getDateComponent: function(){
    var hrs = this.view.lbxScheduledHours.selectedKey;
    var min = this.view.lbxScheduledMinutes.selectedKey; 
    if(kony.sdk.isNullOrUndefined(this.view.calScheduledDate.dateComponents)){
      return;
    }
    var dateComponent = this.view.calScheduledDate.dateComponents;
    if(dateComponent[0]==-1 && dateComponent[1]==-1){
      return;
    }
    var jsDateComponent = new Date(dateComponent[2],dateComponent[1]-1,dateComponent[0],parseInt(hrs),parseInt(min),0);
    return jsDateComponent;
  },
  _getScheduledDate: function(){

    var date = this._getDateComponent();
    if(kony.sdk.isNullOrUndefined(date)){
      return;
    }
    var currentDate = new Date();
    var userTimezoneOffset = currentDate.getTimezoneOffset() * 60000;
    date = new Date(date.getTime() + userTimezoneOffset);
    var currDay = this._addZeroPrefix(date.getDate());
    var currMonth = this._addZeroPrefix(date.getMonth() + 1);
    var currYear = this._addZeroPrefix(date.getFullYear());
    var hr = this._addZeroPrefix(date.getHours());
    var min = this._addZeroPrefix(date.getMinutes());
    var sec = this._addZeroPrefix(date.getSeconds());
    var dateinSQLFormat = currYear + "-" + currMonth + "-" + currDay + "T" + hr + ":" + min + ":" + sec;
    return dateinSQLFormat;
  },
  _onClickHistory: function(){
    var navObj=new kony.mvc.Navigation("frmInspectionHistory");
    var obj={};
    obj.navigationData = this._navigationData;
    if(typeof this._navigationData ==='object' &&  this._navigationData!==null){
      var asset=this._navigationData["assetInfo"];
      if(typeof asset==='object' &&  asset!==null){
        var assetId=asset["Asset_Id"];
        if(typeof assetId==='string' || typeof assetId==='number'){
          obj.asset_id = assetId;
          obj.previousForm = "frmMeasurementAssignment";
          navObj.navigate(obj);
        }
      }
    }
  },
  _onClickBack: function(){
    var navObj=new kony.mvc.Navigation("frmInspectionCreation");
    //this._userData.previousForm = "frmMeasurementAssignment";
    navObj.navigate(this._userData);
  },
  _onClickCloseAssignedTech: function(){
    this.view.flxAssignedTechnician.top = "100%";
  },
  _showAssignedListBox: function(){
    this.view.flxAssignedTechnician.top = "0%";
  },
  _onRowClickAssignedTech: function(){
    var data = this.view.segAssignedTech.selectedRowItems[0];
    this.view.lblTechnicianName.text = data.name;
    this.view.flxAssignedTechnician.top = "100%";
  },
  /**
   * @function
   *
   */
  preProcessFormData:function(){
    this._selectedIndex=-1;
    this.count=0;
    this.view.flxMeasurementSet.removeAll();
    this.view.lblTechnicianName.text="Select";
  },
  /**
   * @function
   *
   */
  hidePopup:function(){
    this.view.alertpopup.hidePopUp();
    try{
      var navObj=new kony.mvc.Navigation("frmInspectionCreation");
      navObj.navigate();
    }catch(excp){
      kony.print("#### Exception occured while navigating to the frmCreateInspection: ####"+excp.message);
    }
  }
});