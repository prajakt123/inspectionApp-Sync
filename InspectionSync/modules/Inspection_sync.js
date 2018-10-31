//Type your code here
function _fetchRecords(dataModel){
  debugger;
    function successCB(record){
      //holderKey=record;
      switch(dataModel){
        case "asset_groupnames":
          assetGroupsList=record;
          break;
        case "asset_location":
          assetLocationsList=record;
          break;
        case "asset_measurement_set":
          assetMeasurementsList=record;
          break;
        case "asset":
          assetsList=record;
          break;
        case "groupnames":
          assetGroupNameList =record;
          break;
        case "asset_type":
          assetTypesList =record;
          break;
        case "inspection_measurement":
          inspectionMeasurementList =record;
          break;
        case "inspection":
          inspectionList =record;
          break;
        case "measurement_hstry":
          measurementHistoryList=record;
          break;
        case "measurement_images":
          measurementImageList=record;
          break;
        case "measurement_range":
          measurementRangeList=record;
          break;
        case "measurement":
          measurementList =record;
          break;
        case "measurementset_measurementrange":
          measurementSetRangeList=record;
          break;
        case "media":
          mediasList=record;
          break;
        case "inspection_user":
          mediasList=record;
      }
      //this.count=this.count+1;
      //this.getAssetLocation();
    }
    function failureCB(error){
      alert(JSON.stringify(error));
      //this.getAssetLocation();
    }
    try{
      var inspObj=new kony.sdk.KNYObj(dataModel);
      inspObj.get(null,successCB,failureCB);
    }catch(excp){
      alert(excp.message);
      kony.print("Exception occured:- "+JSON.stringify(excp));      //this.getAssetLocation();
    }
  }