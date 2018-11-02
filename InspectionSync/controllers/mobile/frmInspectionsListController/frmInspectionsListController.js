define({ 
  count:0,
  inspectionList:null,
  assetsList:null,
  assetLocationsList:null,
  assetTypesList:null,
  parsedInspetionList:null,


  filteredInspectionList:null,
  isAsignedFilterSelected:true,
  isInProgressFilterSelected:true,
  isCompletedFilterSelected:false,


  userID:null,
  _filterCount: 0,
  onNavigate:function(param){
    debugger;
    this.count=0;
    if(!InspectionUtil.isNetworkAvailable()){
     // this.view.loadingScreen.show("offline",2);
    }else{
      //this.view.loadingScreen.hide(2);
    }
    if(param!==null && param!==undefined && typeof param!=='string'){
      this.userID=param.userid;
      this._navigationData = param;
    }
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
  startSync:function(){
    debugger;
    var syncOptions={};//"downloadBatchSize":"100",
    syncOptions.uploadBatchSize="200";
    syncOptions.GetSyncStats=true;
    try{
      var syncObjService= new kony.sdk.KNYObjSvc(OBJECT_SERVICE.SYNC);
      //kony.application.showLoadingScreen("please wait...");
      this.view.loadingScreen.show("Syncing..",1);
      syncObjService.startSync(syncOptions,this.successCB,this.failureCB,this.progressCB);
    }catch(excp){
      this.view.loadingScreen.hide(1);
      this.view.loadingScreen.show(excp.message,4);
      kony.print("Exception: "+excp);
    }
  },
  /**
   * @function
   *
   * @param result 
   */
  progressCB:function(result){
    debugger;
    kony.print("##########"+result);
    var phase=InspectionUtil.validateText(result["phase"]);
    var state=InspectionUtil.validateText(result["state"]);
    this.view.loadingScreen.show(phase+" "+state,1);
  },
  successCB:function(response){
    debugger;
    //alert("success: "+response);
    this.view.loadingScreen.show("Loading..",1);
    //this.view.loadingScreen.hide(1);
    //kony.application.dismissLoadingScreen();
    kony.logger.currentLogLevel = kony.logger.logLevel.ALL; 
    kony.logger.activatePersistors(kony.logger.consolePersistor);
    kony.print(response);
    this.onFormPostShow();
  },
  failureCB:function(response){
    //alert("Failure: "+JSON.stringify(response));
    this.view.loadingScreen.hide(1);
    this.view.loadingScreen.show(response.message,4);
    //kony.application.dismissLoadingScreen();
    debugger;
    kony.print(response);
  },
  processRecords:function(){
    debugger;
    this.view.loadingScreen.show("Processing..",1);
    var assetLocationMap=InspectionUtil.parseRecords(this.assetLocationsList,"Id");
    var assetTypeListMap=InspectionUtil.parseRecords(this.assetTypesList , "Asset_Type_Id");
    if(typeof assetLocationMap ==='object' && assetLocationMap!==null && Array.isArray(this.assetsList)){
      for(var i=0;i<this.assetsList.length;i++){
        var asset=this.assetsList[i];
        if(typeof asset==='object' && asset!==null ){
          if(typeof asset["Asset_Location_Id"]==='string'){
            if(Array.isArray(assetLocationMap[asset["Asset_Location_Id"]]) && assetLocationMap[asset["Asset_Location_Id"]].length>0){
              asset["location"]=assetLocationMap[asset["Asset_Location_Id"]][0];
            }
          }
          if(typeof asset["Asset_Type_Id"]==='string' && typeof assetTypeListMap==='object' && assetTypeListMap!==null){
            if(Array.isArray(assetTypeListMap[asset["Asset_Type_Id"]]) && (assetTypeListMap[asset["Asset_Type_Id"]])){
              asset["type"]=assetTypeListMap[asset["Asset_Type_Id"]][0];
            }
          }
        }
      }
    }
    var assetMap=InspectionUtil.parseRecords(this.assetsList,"Asset_Id");
    var parsedInspection=this.getParsedInspectionList(assetMap);
    this.parsedInspetionList=parsedInspection;
    this.applyFilter();
    //this.populateInspectionsToSegment(parsedInspection);
    this.view.loadingScreen.hide(1);
  },
  //on post show of the form.
  onFormPostShow:function(){
    debugger;
    var self=this;
    try{
      this.getInspectionListData();
    }catch(excp){
      alert(JSON.stringify(excp));
      kony.print("#### Exception occured in fetching the inspectionlist records ####"+excp);
    }
  },
  getParsedInspectionList:function(assetMap){
    debugger;
    var parsedInspection=[];
    var inspection;
    if(Array.isArray(this.inspectionList) && typeof assetMap === 'object'){
      for(var i=0;i<this.inspectionList.length;i++){
        inspection=this.inspectionList[i];
        if(typeof inspection["Asset_Id"] === 'number' && Array.isArray(assetMap[inspection["Asset_Id"]])){
          inspection["asset"]=assetMap[inspection["Asset_Id"]][0];
          parsedInspection.push(inspection);
        }
      }
    }else{
      parsedInspection=this.inspectionList;
    }
    debugger;
    return parsedInspection;
  },
  populateInspectionsToSegment:function(records){
    if(Array.isArray(records)){
      var segHeader={
        "lblInspections":"My Inspections",
      };
      var segList=[];
      var segObj={};
      var recordLength=records.length;
      var inspection;
      var status;
      var asset;
      var inspectionId;
      for(var i=0;i<recordLength;i++){
        inspection=records[i];
        segObj={};
        inspectionId=parseInt(inspection["Inspection_Id"]);
        if(inspectionId<0){
          //segObj["lblInspectionId"]="Inspection to sync("+(-1*inspectionId)+")";
          segObj["lblInspectionId"]=app_constant.offline_inspection_msg +(-1*inspectionId)+app_constant.offline_inspection_closing_msg;
          segObj["flxMain"]={"skin":"sknFlxInspectionBGD6D6D6"};
          segObj["flxInspectionDetail"]={"skin":"sknFlxTransBGBorderE6E6E6"};
          segObj["isPositiveInspection"]=false;
        }else{
          segObj["lblInspectionId"]=app_constant.inspection+ inspection["Inspection_Id"];
          segObj["flxMain"]={"skin":"sknFlxInspectionTransWithLightGreyBorder"};
          segObj["flxInspectionDetail"]={"skin":"sknFlxBGfafafa"};
          segObj["isPositiveInspection"]=true;
        }
        status=inspection["Status"];
        if(status!==null&&status!==undefined){
          status=status.toLowerCase();
        }
        switch(status){
          case "assigned":
            segObj["lblInspectionStatus"]="Assigned";
            break;
          case "in progress":
            segObj["lblInspectionStatus"]="In-progress";
            break;
          case "completed":
            segObj["lblInspectionStatus"]="Completed";
        }
        segObj["lblAssetId"]=app_constant.asset+inspection["Asset_Id"];
        segObj["lblTime"]=InspectionUtil.getReadableTimeString( inspection["Assigned_Timestamp"])+", "+
          InspectionUtil.getReadableDateString(inspection["Assigned_Timestamp"]);
        //segObj["imgLocation"]={"src":"map.png"};
        segObj["lblDistance"]="2.2 mi";
        //segObj["lblAddress"]=record["asset_location_description"];
        segObj["lblSeparator"]="";
        segObj["lblDummey"]="";
        asset=inspection["asset"];
        if(typeof asset==='object' && asset!==null){
          /*if(typeof asset["Asset_Img_URL"] ==='string' && asset["Asset_Img_URL"].length>0){
            segObj["imgAsset"]=asset["Asset_Img_URL"];
          }*/
          if(typeof asset["image_base64"] ==='string' && asset["image_base64"].length>0){
            segObj["imgAsset"]={"base64":asset["image_base64"]};
          }else{
            segObj["imgAsset"]="transformer.png";
          }
          var location=asset["location"];
          if(typeof location === 'object' && location!==null && typeof asset['Asset_Location_Id']==='string'){
            segObj["lblAddress"]=location["Description"];
          }
          var assetType=asset["type"];
          if(typeof assetType === 'object' && assetType!==null && typeof assetType['Name']==='string'){
            segObj["lblAssetCode"]=assetType["Name"];
          }
        }
        segList.push(segObj);
      }
      this.view.SegInspectionDetails.removeAll();
      this.view.SegInspectionDetails.addAll([[segHeader,segList]]);
      this.view.lblTotalTask.text ="Total "+recordLength;
    }

  },
  //to fetch all the records related to this form controller.
  getInspectionListData:function(){
    debugger;
    this.count=0;
    this.view.loadingScreen.hide(3);
    this.view.loadingScreen.show("loading..",1);
    this._fetchRecords("asset");
    this._fetchRecords("asset_location");
    this._fetchRecords("asset_type");
    //this._fetchRecords("groupnames");
    var options;
    this.userID=parseInt(this.userID);
    if(typeof this.userID==='number'){
      options={};
      options["whereConditionAsAString"]="Assigned_To = '"+this.userID+"'";
    }else{
      options=null;
    }
    this._fetchRecords("inspection",options);
  },
  //to read records from table
  _fetchRecords:function(dataModel,options){
    /**
     * @function
     *
     * @param record 
     */
    function successCB(record){
      this.view.loadingScreen.hide(1);
      switch(dataModel){
        case "asset_location":
          this.assetLocationsList=record;
          break;
        case "asset":
          this.assetsList=record;
          break;
          /*case "groupnames":
          this.assetGroupNameList =record;
          break;*/
        case "asset_type":
          this.assetTypesList =record;
          this.populateDataToSegmentAssetType(record);
          break;
        case "inspection":
          this.inspectionList =record;
          // All required records are fetched, now process the records.
          this.processRecords();
      }
      if(this.count==3){
        //alert("all records fetched");
        return;
        //this.processRecords();
      }
      this.count=this.count+1;
    }
    function failureCB(error){
      alert(JSON.stringify(error));
    }
    try{
      if(typeof options!=='object'){
        options=null;
      }
      var inspObj=new kony.sdk.KNYObj(dataModel);
      this.view.loadingScreen.show("Loading..",1);
      inspObj.get(options,successCB.bind(this),failureCB.bind(this));
    }catch(excp){
      this.view.loadingScreen.hide(1);
      this.view.loadingScreen.show(excp.message,4);
      //alert(excp.message);
      //this.getAssetLocation();
    }
  },

  /*############################################## Sync code ends ##############################################################*/
  _onClickAddBtn: function(){
    this.hideMenuWithoutAnim();
    var navObj=new kony.mvc.Navigation("frmInspectionCreation");
    var navigationData = {};
    navigationData.previousForm = "frmInspectionsList";
    navigationData.userAttribute = this._navigationData;
    //this._navigationData=null;
    navObj.navigate(navigationData);
  },

  onTextChange:function(){
    debugger;
    var searchKey=this.view.txtBoxSearchInspection.text;
    searchKey=searchKey.trim();
    if(searchKey.length>1){
      this.view.imgClearTextBox.setVisibility(true);
      var matchedList=this._searchKeyInCollection(searchKey, this.filteredInspectionList);
      //var matchedList=this._searchKeyInCollection(searchKey, this.parsedInspetionList);
      this.populateInspectionToSearchSeg(matchedList);
    }else if(searchKey.length==0){
      this.resetInspectionSearch();
      //this.view.imgClearTextBox.setVisibility(false);
    }
  },
  _searchKeyInCollection:function(searchKey,itemList){
    var matchedRecord=[];
    if(searchKey===null||searchKey===undefined||itemList===null||itemList===undefined){
      this.view.SegAssets.removeAll();
      return ;
    }
    var itemListLength=itemList.length;
    var item;
    var segList=[];
    var segObj={};
    var inspectionId;
    var assetId;
    for(var i=0;i<itemListLength;i++){
      segObj={};
      item=itemList[i];
      inspectionId=app_constant.inspection+item["Inspection_Id"]+"";
      assetId=app_constant.asset+item["Asset_Id"]+"";
      if(typeof inspectionId==='string' && inspectionId.toLowerCase().indexOf(searchKey)!==-1){
        segObj["lblDisplayText"]=inspectionId;
        segObj["lblSearchedResult"]=itemList[i]["Inspection_Id"];
        segList.push(segObj);
      }/*else if(typeof assetId==='string' && assetId.toLowerCase().indexOf(searchKey)!==-1){
        segObj["lblDisplayText"]=assetId;
        segObj["lblSearchedResult"]=itemList[i]["Inspection_Id"];
        segList.push(segObj);
      }*/

    }
    this.view.SegAssets.removeAll();
    this.view.SegAssets.addAll(segList);
  },
  populateInspectionToSearchSeg:function(inspectionList){
    if(Array.isArray(inspectionList)){
      var recordLength=inspectionList.length;
      var segObj={};
      var segList=[];
      for(var i=0;i<recordLength;i++){
        segObj={};
        segObj["lblSearchedResult"]=inspectionList[i]["Inspection_Id"];
        segList.push(segObj);
      }
      this.view.SegAssets.removeAll();
      this.view.SegAssets.addAll(segList);
    }
  },

  resetFilter:function(){
    this._filterCount=0;
    this.isAsignedFilterSelected=false;
    this.view.flxBtnAssigned.skin="sknFlxInspectionTransWithGreyBorder";
    this.view.lblAssigned.skin="sknLblInspectionStatusGrey";
    //this.view.imgAssign.src="assigned_focus.png";

    this.isInProgressFilterSelected=false;
    this.view.flxBtnInProgress.skin="sknFlxInspectionTransWithGreyBorder";
    this.view.lblInProgress.skin="sknLblInspectionStatusGrey";

    this.isCompletedFilterSelected=false;
    this.view.flxBtnCompleted.skin="sknFlxInspectionTransWithGreyBorder";
    this.view.lblCompleted.skin="sknLblInspectionStatusGrey";

    this.populateDataToSegmentAssetType(this.assetTypesList);


  },

  /*selectFilterType:function(eventObject){
    var id=eventObject.id;
    switch(id){
      case "flxAssetTrans": 
        this.isTransFilterSelected=!this.isTransFilterSelected;
        if(this.isTransFilterSelected){
          this.view.imgCheckUncheckTrans.src="checkbox_selected.png";
          //this.view.im
        }else{
          this.view.imgCheckUncheckTrans.src="checkbox_unselected.png";
        }
        break;
      case "flxAssetOilcb":
        this.isOilcbFilterSelected=!this.isOilcbFilterSelected;
        if(this.isOilcbFilterSelected){
          this.view.imgCheckUncheckOilcb.src="checkbox_selected.png";
        }else{
          this.view.imgCheckUncheckOilcb.src="checkbox_unselected.png";
        }
        break;
      case "flxAssetLtcb": 
        this.isLtcbFIlterSelected=!this.isLtcbFIlterSelected;
        if(this.isLtcbFIlterSelected){
          this.view.imgCheckUncheckLtcb.src="checkbox_selected.png";
        }else{
          this.view.imgCheckUncheckLtcb.src="checkbox_unselected.png";
        }
        break;
      case "flxAssetSwitch": 
        this.isSwitchFIlterSelected=!this.isSwitchFIlterSelected;
        if(this.isSwitchFIlterSelected){
          this.view.imgCheckUncheckSwitch.src="checkbox_selected.png";
        }else{
          this.view.imgCheckUncheckSwitch.src="checkbox_unselected.png";
        }
    }
  },*/


  selectFilterStatus:function(eventObject){
    var id=eventObject.id;
    switch(id){
      case "flxBtnAssigned": 
        this.isAsignedFilterSelected=!this.isAsignedFilterSelected;
        if(this.isAsignedFilterSelected){
          this.view.flxBtnAssigned.skin="sknFlxInspectionBlueWithBorder";
          this.view.lblAssigned.skin="sknLblInspectionStatusWhite";
        }else{
          this.view.flxBtnAssigned.skin="sknFlxInspectionTransWithGreyBorder";
          this.view.lblAssigned.skin="sknLblInspectionStatusGrey";
        }
        break;
      case "flxBtnInProgress":
        this.isInProgressFilterSelected=!this.isInProgressFilterSelected;
        if(this.isInProgressFilterSelected){
          this.view.flxBtnInProgress.skin="sknFlxInspectionBlueWithBorder";
          this.view.lblInProgress.skin="sknLblInspectionStatusWhite";
        }else{
          this.view.flxBtnInProgress.skin="sknFlxInspectionTransWithGreyBorder";
          this.view.lblInProgress.skin="sknLblInspectionStatusGrey";
        }
        break;
      case "flxBtnCompleted": 
        this.isCompletedFilterSelected=!this.isCompletedFilterSelected;
        if(this.isCompletedFilterSelected){
          this.view.flxBtnCompleted.skin="sknFlxInspectionBlueWithBorder";
          this.view.lblCompleted.skin="sknLblInspectionStatusWhite";
        }else{
          this.view.flxBtnCompleted.skin="sknFlxInspectionTransWithGreyBorder";
          this.view.lblCompleted.skin="sknLblInspectionStatusGrey";
        }
    }
  },


  applyFilter:function(){

    //sort inspection list.

    //filter by status
    var statusFilterList=[];
    if(this.isAsignedFilterSelected){
      this._filterCount++;
      statusFilterList.push("assigned");
    }
    if(this.isInProgressFilterSelected){
      this._filterCount++;
      statusFilterList.push("in progress");
    }
    if(this.isCompletedFilterSelected){
      this._filterCount++;
      statusFilterList.push("completed");
    }
    var recordList=InspectionUtil.filterByStatus(statusFilterList, this.inspectionList);
    kony.print(recordList.length);

    //filter by type
    //     var typeFIlterList=[];
    //     if(this.isTransFilterSelected){
    //       typeFIlterList.push("trans");
    //     }
    //     if(this.isOilcbFilterSelected){
    //       typeFIlterList.push("oilcb");
    //     }
    //     if(this.isLtcbFIlterSelected){
    //       typeFIlterList.push("ltcb");
    //     }
    //     if(this.isSwitchFIlterSelected){
    //       typeFIlterList.push("switch");
    //     }
    if(this.assetTypesList!==null && this.assetTypesList!==undefined){
      var selectedAssetType=this.getSelectedAssets();
      recordList=filterByType(selectedAssetType, recordList);
    }
    //this.sortByDate(recordList);
    InspectionUtil.sortByDate(recordList);
    this.filteredInspectionList=recordList;
    this.populateInspectionsToSegment(recordList);
    this.populateFilterCount();
    this.hideFilterContainer();
  },


  populateInspectionsToSegment2:function(records){
    var recordLength=records.length;
    var segList=[];
    var segObj={};
    var record;
    var status;
    var segHeader={
      "lblInspections":"My Inspections",
      //       "imgAddInspection":{"src":"plus_blue.png"},
      //       "lblFilter":"Filter",
      //       "imgFilter":{"src":"filter.png"},
      //       "lblNoOfTasks":"Total "+recordLength
    };
    this.view.lblTotalTask.text ="Total "+recordLength;
    for(var i=0;i<recordLength;i++){
      record=records[i];
      segObj={};
      if(record["asset_image"]===""){
        segObj["imgAsset"]={"src":"transformer.png"};
      }else{
        segObj["imgAsset"]={"src":record["asset_image"]};
        //segObj["imgAsset"]={"src":"https://www.bid-on-equipment.com/uploads/1892016/280388-1.jpg"};
      }
      segObj["lblAssetId"]=record["asset_Id"];//{"text":"6578"};
      segObj["lblAssetCode"]=record["asset_type"];
      segObj["lblInspectionId"]=record["inspection_Id"];
      status=record["status"];
      if(status!==null&&status!==undefined){
        status=status.toLowerCase();
      }
      switch(status){
        case "assigned":
          segObj["lblInspectionStatus"]="Assigned";
          break;
        case "in progress":
          segObj["lblInspectionStatus"]="In-progress";
          break;
        case "completed":
          segObj["lblInspectionStatus"]="Completed";
      }    
      //segObj["lblStatus"]={};
      segObj["imgTime"]={"src":"clock.png"};
      //segObj["lblTime"]=record["assigned_Timestamp"];
      var timeStamp=_convertDateStringToEpochTime(record["assigned_Timestamp"]);
      var timeString=getTimeString(timeStamp);
      var dateString=getDateString(timeStamp);
      segObj["lblTime"]=timeString+"  "+dateString;
      /*if(timeStamp!==null && timeStamp!==undefined){
        try{
          var date=new Date(timeStamp);
          segObj["lblTime"]=date.getHours()+" Hrs "+(timeStamp.split(" "))[0];
          //this.view.lblDay.text=(timeStamp.split(" "))[0];
        }catch(excp){
          kony.print(JSON.stringify(excp));
        }
      }*/


      segObj["lblInspectionDay"]=record["assigned_Timestamp"];
      segObj["imgLocation"]={"src":"map.png"};
      segObj["lblDistance"]="2.2 mi";
      segObj["lblAddress"]=record["asset_location_description"];
      segObj["lblSeparator"]=" ";
      segObj["lblDummey"]=" ";
      segList.push(segObj);
    }
    this.view.SegInspectionDetails.removeAll();
    this.view.SegInspectionDetails.addAll([[segHeader,segList]]);
  },

  getInspectionsSuccessCB:function(result){
    //debugger;
    this.view.loadingScreen.hide(1);
    kony.application.dismissLoadingScreen();
    //alert(result);
    this.inspectionList=result.records[0]["Inspections"];
    this.isAsignedFilterSelected=true;
    this.isInProgressFilterSelected=true;
    this.applyFilter();
    //this.populateInspectionsToSegment(this.inspectionList);
  },

  getInspectionsFailureCB:function(result){
    this.view.loadingScreen.hide();
    kony.application.dismissLoadingScreen();
    alert("error:"+result)
  },
  //   getInspections:function(){
  //     //this.pop
  //   },
  /**
   * @function
   *
   */
  getInspections:function(){
    return;
    //debugger;
    kony.print("in getInspection!");
    try{
      var objectInstance=getObjectInstance("inspectionObjService");
      if(objectInstance!==null){
        // var dataObject = new kony.sdk.dto.DataObject("InspectionObj");
        var dataObject = new kony.sdk.dto.DataObject("InspectionsByUserId");
        var options = {
          "dataObject": dataObject,
          "headers": {},
          "queryParams":{"id":this.userID}
        };
        if (kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)) {
          /*kony.application.showLoadingScreen("sknLoading","please wait..",constants.
                                             LOADING_SCREEN_POSITION_ONLY_CENTER, true,true,{enableMenuKey:true, 
                                                                                              enableBackKey:true, progressIndicatorColor : "ffffff77"});*/
          this.view.loadingScreen.show();
          //kony.model.ApplicationContext.showLoadingScreen("");
          objectInstance.fetch(options, this.getInspectionsSuccessCB.bind(this),this.getInspectionsFailureCB.bind(this));
        } else {
          //dismissLoadingScreen();
          alert("No Network connected");
        }
      }
    }catch(excp){
      //dismissLoadingScreen();
      this.view.loadingScreen.hide();
      kony.application.dismissLoadingScreen();
      kony.print("Exception occured in getDesignation: "+JSON.stringify(excp) );
    }
  },

  showFilterContainer:function(){
    //debugger;
    //var self=this;
    if(this.assetTypesList===null||this.assetTypesList===undefined){
      this.getAllAssetType();
    }
    this.view.flxScFilterContent.animate(
      kony.ui.createAnimation({100:{top:"0%","stepConfig":{}}}),
      {delay:0,fillMode:kony.anim.FILL_MODE_FORWARDS,duration:.30},
      {animationEnd: function() {
      } 
      });
  },

  hideFilterContainer:function(){
    this.view.flxScFilterContent.animate(
      kony.ui.createAnimation({100:{top:"100%","stepConfig":{}}}),
      {delay:0,fillMode:kony.anim.FILL_MODE_FORWARDS,duration:.30},
      {animationEnd: function() {
      } 
      });
  },

  showSearchContainer:function(){
    var self=this;
    this.resetInspectionSearch();
    this.view.flxSearchAsset.animate(
      kony.ui.createAnimation({100:{top:"0%","stepConfig":{}}}),
      {delay:0,fillMode:kony.anim.FILL_MODE_FORWARDS,duration:.001},
      {animationEnd: function() {
        self.view.txtBoxSearchInspection.setFocus(true);
        //self.view.flxCancelBtn.setVisibility(true);
      } 
      });
  },

  hideSearchContainer:function(){
    var self=this;
    //self.view.txtBoxSearchInspection.setFocus(false);
    self.view.SegInspectionDetails.setFocus(true);
    this.view.flxSearchAsset.animate(
      kony.ui.createAnimation({100:{top:"100%","stepConfig":{}}}),
      {delay:0,fillMode:kony.anim.FILL_MODE_FORWARDS,duration:.001},
      {animationEnd: function() {
        //self.view.flxCancelBtn.setVisibility(false);
      } 
      });
  },
  resetInspectionSearch:function(){
    this.view.imgClearTextBox.setVisibility(false);
    this.view.txtBoxSearchInspection.text="";
    this.view.SegAssets.removeAll();
  },
  /**
   * @function
   *
   * @param selectedRow 
   */
  getInspectionIdOfSelectedRow:function(selectedRowItem){
    var inspectionId=null;
    if(typeof selectedRowItem==='object' && selectedRowItem!==null){
      if(typeof selectedRowItem["lblSearchedResult"]==='number'){
        //if searched is performed.
        inspectionId=selectedRowItem["lblSearchedResult"];
      }else{
        // Inspection card row click.
        var isPositiveInspection=selectedRowItem["isPositiveInspection"];
        inspectionId=selectedRowItem["lblInspectionId"];
        if(isPositiveInspection===false){
          //inspectionId=inspectionId.split("Inspection to sync(");
          inspectionId=inspectionId.split(app_constant.offline_inspection_msg);
        }else if(isPositiveInspection===true){
          inspectionId=inspectionId.split(app_constant.inspection);
        }
        if(Array.isArray(inspectionId) && inspectionId.length>1){
          inspectionId=inspectionId[1];
        }else{
          inspectionId=null;
        }
      }
    }else{
      kony.print("### provided row data is empty ###");
    }
    return inspectionId;
  },

  onSegRowClick:function(eventObject,sectionNumber,rowNumber){
    debugger;
    try{
      var selectedRowItems=eventObject["selectedRowItems"];
      var inspectionId=null;
      if(Array.isArray(selectedRowItems) && selectedRowItems.length>0){
        inspectionId=this.getInspectionIdOfSelectedRow(selectedRowItems[0]);
        this.hideSearchContainer();
        if(typeof inspectionId ==='string' || typeof inspectionId ==='number'){
          var inspection=this.searchInspectionById(inspectionId);
          if(typeof inspection==='object' && inspection!==null){
            var status=inspection["Status"];
            if(typeof status==='string'&& status!==null){
              status=status.toLowerCase();
            }
            if(status==="completed"){
              //completed inspection selected.
              debugger;
              var obj={};
              obj["from"]="frmInspectionsList";
              obj["status"]="completed";
              obj["inspection"]=inspection;
              try{
                var navObj=new kony.mvc.Navigation("frmInspectionReview");
                navObj.navigate(obj);
              }catch(excp){
                kony.print("## Exception occured ##"+JSON.stringify(excp));
                //return;
              }
            }else{
              //Uncompleted inspection selected.
              var navObj=new kony.mvc.Navigation("frmInspectionExecution");
              navObj.navigate(inspection);
            }
          }else{
            kony.print("Inspection with id:"+inspectionId+" Not found");
          }
        }
      }
      /*var selectedInspectionId=eventObject["selectedRowItems"][0]["lblInspectionId"];

      if(selectedInspectionId===null||selectedInspectionId===undefined){
        selectedInspectionId=eventObject["selectedRowItems"][0]["lblSearchedResult"];
      }*/
      /*var inspection=this.searchInspectionById(inspectionId);
        if(typeof inspection==='object' && inspection!==null){
          var status=inspection["Status"];
          if(typeof status==='string'&& status!==null){
            status=status.toLowerCase();
          }
          if(status==="completed"){
            //completed inspection selected.
            debugger;
            var obj={};
            obj["from"]="frmInspectionsList";
            obj["status"]="completed";
            obj["inspection"]=inspection;
            try{
              var navObj=new kony.mvc.Navigation("frmInspectionReview");
              navObj.navigate(obj);
            }catch(excp){
              kony.print("## Exception occured ##"+JSON.stringify(excp));
              //return;
            }
          }else{
            //Uncompleted inspection selected.
            var navObj=new kony.mvc.Navigation("frmInspectionExecution");
            navObj.navigate(inspection);
          }
        }
      }else{
        kony.print("### Inspection not found! ###")
      }*/
    }catch(excp){
      alert(excp);
    }
  },
  showInspectionHistory:function(){

  },
  getInspectionHistory:function(){

  },
  _fetchData: function(inspectionID,assetID){
    var objectService = "inspectionObjService";
    var dataModelObject = "inspectionHistory";
    var queryParams = {"id":assetID};
    this._fetchFromODataService(objectService, dataModelObject, queryParams, this._fetchDataSuccess.bind(this,inspectionID), this._fetchDataFailure.bind(this));
  },
  _fetchDataSuccess: function(inspectionID,response){
    if(response.records!==undefined && response.records[0]!==undefined){
      var inspection=this.searchInspection(inspectionID,response.records[0].inspectionData);
      var measurement = this._processData(inspection);
      var inspection={};
      inspection["asset_Id"]=response.records[0].asset_id;
      inspection["asset_type"]=response.records[0].asset_Name
      inspection["asset_description"]=response.records[0].asset_description;
      inspection["status"]="Completed";
      inspection["inspection_Id"]=inspectionID;
      var param={};
      param["measurement"]=measurement;
      param["inspection"]=inspection;
      param["from"]="frmInspectionsList";
      try{
        var navObj=new kony.mvc.Navigation("frmInspectionReview");
        navObj.navigate(param);
      }catch(excp){
        kony.print("Exception occured while navigating to the review form: "+excp.toString());
      }
    }

    //this._setDataToSegmentInspection(data);
  },
  searchInspection:function(inspectionID,inspectionList){
    var _inspection=null;
    if(Array.isArray(inspectionList)){
      var length=inspectionList.length;
      var inspection;
      for(var i=0;i<length;i++){
        inspection=inspectionList[i];
        if(inspectionID===inspection["inspection_id"]){
          _inspection=inspection;
          break;
        }
      }
    }
    return _inspection;
  },

  _fetchDataFailure: function(response){
    alert("Error::"+JSON.stringify(response));
    this.view.loadingScreen.hide();
    kony.application.dismissLoadingScreen();
  },

  _processData: function(data){
    var measurementList=[];
    var mesurement;
    if(data!==null && data!==undefined){
      if(Array.isArray(data.inspectedValues)){
        var capturedMeasurementList=data.inspectedValues;
        var capturedMeasurement;
        var length=capturedMeasurementList.length;
        var value;
        for(var i=0;i<length;i++){
          mesurement={};
          capturedMeasurement=capturedMeasurementList[i];
          mesurement["measurement_name"]=capturedMeasurement["measurementNames"];
          value=capturedMeasurement["inspectedValues"];
          if(isNaN(value)){
            mesurement["measurement_type"]="Text";
          }else{
            mesurement["measurement_type"]="Numeric";
          }
          mesurement["measurement_value"]=value;
          mesurement["media_list"]=capturedMeasurement["media_URLs"];
          measurementList.push(mesurement);
        }
      }
    }
    return measurementList;
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
        throw {"error":"ConnectionError","message":"Please connect app to MF"};
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
      //@TODO remove alerts
      alert(exception);
    }
  },

  searchInspectionById:function(id){
    //this.parsedInspetionList
    var inspection=null;
    if(typeof id==='string'|| typeof id==='number'){
      //start searching for the inspection
      var inspectionListlength;
      //if(this.inspectionList!==null && this.inspectionList!==undefined){
      if(Array.isArray(this.parsedInspetionList)){
        inspectionListlength=this.parsedInspetionList.length;
        for(var i=0;i<inspectionListlength;i++){
          inspection=this.inspectionList[i];
          if(typeof inspection==='object' &&  inspection!==null &&
             (inspection["Inspection_Id"])== id){
            //inspection=this.inspectionList[i];
            break;
          }
        }
      }
    }else{
      //Provided inspection id is null
      kony.print("### Provided inspection id is null ###");
    }
    return inspection;
  },
  getAllAssetTypeSuccess:function(response){
    //debugger;
    this.view.loadingScreen.hide();
    kony.application.dismissLoadingScreen();  
    if(response!==null||response !==undefined && response.records!==undefined){
      if(response.records[0]!==undefined && response.records[0].AssetType!==undefined){
        this.assetTypeList=response.records[0].AssetType;
        this.populateDataToSegmentAssetType(this.assetTypeList);
      }
    }
  },

  getAllAssetTypeFailure:function(response){
    //debugger;
    this.view.loadingScreen.hide();
    kony.application.dismissLoadingScreen();   
    this.hideFilterContainer();
  },

  getAllAssetType:function(){
    //debugger;
    kony.print("in getAllAssetType!");
    try{
      var objectInstance=getObjectInstance("inspectionObjService");
      if(objectInstance!==null){
        var dataObject = new kony.sdk.dto.DataObject("AssetTypes");
        var options = {
          "dataObject": dataObject,
          "headers": {},
          "queryParams": {"$filter":"((SoftDeleteFlag ne true) or (SoftDeleteFlag eq null))"}
        };
        if (kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)) {
          /*kony.application.showLoadingScreen("sknLoading","please wait..",constants.
                                             LOADING_SCREEN_POSITION_ONLY_CENTER, true,true,{enableMenuKey:true, 
                                                                                              enableBackKey:true, progressIndicatorColor : "ffffff77"});*/
          this.view.loadingScreen.show();
          //kony.model.ApplicationContext.showLoadingScreen("Please wait..");
          objectInstance.fetch(options, this.getAllAssetTypeSuccess.bind(this),this.getAllAssetTypeFailure.bind(this));
        } else {
          //dismissLoadingScreen();
          alert("No Network connected");
        }
      }
    }catch(excp){
      //dismissLoadingScreen();
      this.view.loadingScreen.hide();
      kony.application.dismissLoadingScreen();
      kony.print("Exception occured in getAllAssetType: "+JSON.stringify(excp) );
    }

  },
  populateDataToSegmentAssetType:function(records){
    if(Array.isArray(records)){
      var length=records.length;
      var segList=[];
      var segObj;
      this.view.segAssetType.removeAll();
      for(var i=0;i<length;i++){
        segObj={};
        segObj["lblAssetCode"]=validateText(records[i].Name);
        segObj["imgSelection"]="checkbox_unselected.png";
        segList.push(segObj);
      }
      this.view.segAssetType.addAll(segList);
    }
  },
  getSelectedAssets:function(){
    //debugger;
    var selectedAssets=this.view.segAssetType.selectedRowItems;
    selectedAssets=this.processAsset(selectedAssets);
    return selectedAssets;
  },
  processAsset:function(records){
    var assetTypeList=[];
    if(Array.isArray(records)){
      var length=records.length;
      var assetType;
      for(var i=0;i<length;i++){
        assetType=records[i]["lblAssetCode"];
        if(assetType!==null && assetType!==undefined){
          assetType=assetType.toLowerCase();
          assetType=assetType.trim();
          assetTypeList.push(assetType);
          this._filterCount++;
        }
      }
    }
    return assetTypeList;
  },
  onClickHamburger: function(){
    this.showMenu();
  },
  showMenu: function(){
    //this.view.flxHamburgerMenu.left="0%";
    var self=this;
    this.view.flxHamburgerMenu.animate(
      kony.ui.createAnimation({100:{left:"0%","stepConfig":{}}}),
      {delay:0,fillMode:kony.anim.FILL_MODE_FORWARDS,duration:.10},
      /**
       * @function
       *
       */
      {animationEnd: function() {
        self.view.flxHamburgerOverlay.setVisibility(true);
      } 
      });



  },
  hideMenu: function(){
    //     var animConfig = kony.ui.createAnimation({
    //         "100": {
    //           "left": "-100%",
    //           "stepConfig": {
    //             "timingFunction": kony.anim.EASE
    //           }
    //         }
    //       });
    //       this.view.flxHamburgerMenu.animate(animConfig, {}, {});
    //this.view.flxHamburgerMenu.left="-100%";
    //var self=this;
    this.view.flxHamburgerOverlay.setVisibility(false);
    this.view.flxHamburgerMenu.animate(
      kony.ui.createAnimation({100:{left:"-100%","stepConfig":{}}}),
      {delay:0,fillMode:kony.anim.FILL_MODE_FORWARDS,duration:.30},
      /**
       * @function
       *
       */
      {animationEnd: function() {
        
      } 
      });

  },
  hideMenuWithoutAnim: function(){
    this.view.flxHamburgerMenu.left="-100%";
  },
  populateFilterCount: function(){
    if(this._filterCount>0){
      //       this.view.lblFilterCount.isVisible=true;
      this.view.lblFilterHeading.text = "("+Number(this._filterCount).toFixed()+")"+ " FILTER";
      this.view.lblFilter.skin = "sknLblInspectionFIlter666eff";
      this.view.lblFilterCount.text = Number(this._filterCount).toFixed();
      this.view.imgFilter.src = "filter_blue.png";//change to filter blue
      this.view.flxFilterCountContainer.isVisible = true;
    }
    else{
      //       this.view.lblFilterCount.isVisible=false;
      this.view.lblFilterHeading.text = "FILTER";
      this.view.lblFilter.skin = "sknLblInspectionFIlter";
      this.view.lblFilterCount.text = "";
      this.view.imgFilter.src = "filter.png";
      this.view.flxFilterCountContainer.isVisible = false;
    }
    this._filterCount=0;
  },
  _onClickProfile: function(){
    this.hideMenuWithoutAnim();
    var navObj=new kony.mvc.Navigation("frmProfile");
    var navigationData = {};
    navigationData.previousForm = "frmInspectionsList";
    navigationData.userAttribute = this._navigationData;
    //this._navigationData=null;
    navObj.navigate(navigationData);
  },
  /**
   * @function
   *
   */
  onFlexSyncClick:function(){
    debugger;
    if(InspectionUtil.isNetworkAvailable()){
      this.hideMenu();
      this.startSync();
    }else{
      alert("Please check your network connectivity");
    }

  }
});