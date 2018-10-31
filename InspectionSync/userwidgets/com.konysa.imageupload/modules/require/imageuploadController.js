define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this._appUserID=null;
      this._rootFolderID="0";
      this._id=0;
      this._count=0;
      this._measurementId=null;
      this._measurementRangeId=null;
      this._mediaList=[];
      this._imgUrls=[];
      this._MEDIA_MODEL="media";
    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      defineGetter(this,"appUserID",function(){ 
        return this._appUserID;});
      defineGetter(this,"rootFolderID",function(){
        return this._rootFolderID;});
      defineSetter(this,"appUserID",function(appUserID){
        this._appUserID=appUserID;
      });
      defineSetter(this,"rootFolderID",function(rootFolderID){
        this._rootFolderID=rootFolderID;
      });
    },
    /**
     * @function
     *
     * @param eventObject 
     */
    showImageGallery:function(eventObject){
      debugger;
      if(this.onAddImageClick!==null&& this.onAddImageClick!==undefined ){
        this.onAddImageClick(this.setImage);
      }
    },
    /**
     * @function
     *
     * @param eventobject 
     */
    openGallery:function(eventobject){
      //To open the media gallery component to select the user image.
      debugger;
      //eventobject.ex
      if(this.onAddImageClick!==null&& this.onAddImageClick!==undefined && typeof this.onAddImageClick==='function' ){
        this.onAddImageClick(this.setImage);
      }
    },
    getResult:function(){
      return this._mediaList;
    },
    setData:function(data){
      kony.print(data);
      if(data!==null&&data!==undefined){
        this._measurementId=data.Measurement_Id;
        this._measurementRangeId=data.Measurement_Range_Id;
      }
    },
    setImage:function(imageBase64){
      debugger;
      //return;
      var image_name="";
      if(this._measurementId!==null && this._measurementId!==null && this._measurementRangeId!==null && this._measurementRangeId!==undefined){
        image_name=this._measurementId+"_"+this._measurementRangeId+"_"+this._count+".png";
      }else{
        alert("Measurement ID || Measurement Range ID not available");
        return;
      }
      //this.uploadImage(image_name, imageBase64);
      this.createMedia(imageBase64);
    },
    /**
     * @function
     *
     */
    createMedia:function(imageBase64){
      try{
        var record=this.getMediaObj(imageBase64);
        var mediaModel=new kony.sdk.KNYObj(this._MEDIA_MODEL);
        mediaModel.create(record, {}, this.mediaCreateSuccess.bind(this,imageBase64), this.mediaCreateFailure.bind(this));
      }catch(excp){
        debugger;
        kony.print("#### Exception occured while creating the media: "+JSON.stringify(excp));
        //alert(excp.message);
      }
    },
    /**
     * @function
     *
     * @param result 
     */
    mediaCreateSuccess:function(imageBase64,result){
      debugger;
      if(typeof imageBase64==='string' && typeof result==='object' && typeof result!==null){
        var mediaId=result["media_id"];
        if(typeof mediaId==='number'){
          this.setImageBase64(mediaId,imageBase64);
        }else{
          debugger;
          kony.print("invalid mediaId received");
        }
      }else{
        debugger;
        kony.print("invalid response received");
      }
    },
    /**
     * @function
     *
     * @param result 
     */
    mediaCreateFailure:function(result){
      debugger;
      kony.print("#### Media creation failed with error: "+JSON.stringify(result));
    },
    /**
     * @function
     *
     * @param imageBase64 
     */
    getMediaObj:function(imageBase64){
      var media={};
      //media["CreatedTimestamp"]="";
      //media["extension"]="";
      //media["id"]="";
      //media["LastUpdatedTimestamp"]="";
      media["media_base64"]=imageBase64;
      media["SoftDeleteFlag"]=false;
      //media["Timestamp"]="";
      //media["type"]="";
      media["url"]="";
      return media;
    },
    setImageURl:function(imageURL){
      //       var flxItem;
      //       flxItem=this.getFlexItem(this._count,imageURL);
      if(this._count===0){
        this._mediaList=[];
      }
      this._mediaList.push(imageURL);
      this._count=this._count+1;
      if(this._count==1){
        this.view.flxImage1.isVisible = true;
        this.view.flxImage2.isVisible = false;
        this.view.flxImage3.isVisible = false;
        this.view.flxOverlay.isVisible = false;
        this.view.img1.src = this._mediaList[0];
        this.view.lblImageValue.text ="";
      }else if(this._count==2){
        this.view.flxImage1.isVisible = true;
        this.view.flxImage2.isVisible = true;
        this.view.flxImage3.isVisible = false;
        this.view.flxOverlay.isVisible = false;
        this.view.lblImageValue.text ="";
        this.view.img2.src = this._mediaList[1];
      }else if(this._count==3){
        this.view.flxImage1.isVisible = true;
        this.view.flxImage2.isVisible = true;
        this.view.flxImage3.isVisible = true;
        this.view.flxOverlay.isVisible = false;
        this.view.lblImageValue.text ="";
        this.view.img3.src = this._mediaList[2];
      }else if(this._count>3){
        this.view.flxImage1.isVisible = true;
        this.view.flxImage2.isVisible = true;
        this.view.flxImage3.isVisible = true;
        this.view.flxOverlay.isVisible = true;
        this.view.lblImageValue.text ="+"+Number(this._count-3).toFixed();
      }
      //this.view.flxScThumbImage.add(flxItem);
      this.view.forceLayout();
      //this._count=this._count+1;

    },
    setImageBase64:function(mediaId,imageBase64){
      //       var flxItem;
      //       flxItem=this.getFlexItem(this._count,imageURL);
      if(this._count===0){
        this._mediaList=[];
      }
      this._mediaList.push(mediaId);
      this._count=this._count+1;
      if(this._count==1){
        this.view.flxImage1.isVisible = true;
        this.view.flxImage2.isVisible = false;
        this.view.flxImage3.isVisible = false;
        this.view.flxOverlay.isVisible = false;
        //this.view.img1.src = this._mediaList[0];
        this.view.img1.base64=imageBase64;
        this.view.lblImageValue.text ="";
      }else if(this._count==2){
        this.view.flxImage1.isVisible = true;
        this.view.flxImage2.isVisible = true;
        this.view.flxImage3.isVisible = false;
        this.view.flxOverlay.isVisible = false;
        this.view.lblImageValue.text ="";
        //this.view.img2.src = this._mediaList[1];
        this.view.img2.base64 = imageBase64;
      }else if(this._count==3){
        this.view.flxImage1.isVisible = true;
        this.view.flxImage2.isVisible = true;
        this.view.flxImage3.isVisible = true;
        this.view.flxOverlay.isVisible = false;
        this.view.lblImageValue.text ="";
        //this.view.img3.src = this._mediaList[2];
        this.view.img3.base64 = imageBase64;
      }else if(this._count>3){
        this.view.flxImage1.isVisible = true;
        this.view.flxImage2.isVisible = true;
        this.view.flxImage3.isVisible = true;
        this.view.flxOverlay.isVisible = true;
        this.view.lblImageValue.text ="+"+Number(this._count-3).toFixed();
      }
      //this.view.flxScThumbImage.add(flxItem);
      this.view.forceLayout();
      //this._count=this._count+1;

    },
    selectImage:function(){
      var onselectioncallback=function(rawbytes,permStatus,mimeType){
        var imageRawByte=rawbytes;
        if(imageRawByte===null)return;
        var resourcePath=imageRawByte.getResourcePath();
        var fileObj=kony.io.FileSystem.getFile(resourcePath);
        //fileObj.
        alert("imageRawByte: "+imageRawByte);
        alert("resourcePath: "+resourcePath);
        //return;
        var arr=resourcePath.split("/");
        var arrLength=arr.length;
        var imageName=arr[arrLength-1];
        var imageType=imageName.split(".");
        imageType=imageType[1];
        if(imageType!==".png"&&imageType!=="jpg"&&imageType!=="jpeg"){
          alert("Only png, jpg & jpeg file format supported!");
          return;
        }
        var imageBase64=kony.convertToBase64(rawbytes);
        this.view.img0.base64=imageBase64;
        /*alert("selected image: "+imageName);
        alert("rawbytes: "+rawbytes);
        alert("permStatus:"+permStatus);
        alert("mimeType:"+mimeType);*/
        //this.uploadImage(imageName, imageBase64);
      };
      try{
        var querycontext={"mimetype":"image/*"};
        kony.phone.openMediaGallery(onselectioncallback.bind(this), querycontext)
      }catch(excp){
        kony.print(JSON.stringify(excp));
      }
    },
    uploadImage:function(imageName,imageBase64) {
      if(imageName===null||imageName===undefined||imageBase64===null||imageBase64===undefined){
        return;
      }
      var folderID=this._rootFolderID;
      if(folderID===null||folderID===undefined){
        alert("please provide folder id");
        return;
      }
      var appUserID=this._appUserID;
      if(appUserID===""||appUserID===null||appUserID===undefined){
        alert("please provide the app user ID");
        return;
      }
      try{
        var self=this;
        var uploadSuccess=function(response){
          kony.model.ApplicationContext.dismissLoadingScreen();
          if(response.results!==null && response.results!==undefined){
            var result=JSON.parse(response.results);
            var imageURL=result.download_url;
            if(imageURL!==undefined&&imageURL!==null&&imageURL.length>0){
              self.setImageURl(imageURL);
            }else{
              alert("image url not present");
            }

          }
          if(kony.os.deviceInfo().name==="android"){
            var toast=new kony.ui.Toast({"text":"upload success!","duration":constants.TOAST_LENGTH_SHORT });
            toast.show();
          }
          //this.getImages(null);
          //return;
          /*if(response.status==="200"){
            flxItem=this.getFlexItem.bind(this)(this._id,response.results.download_url );
            this._id=this._id+1;
            this.view.flxScThumbImage.add(flxItem);
            this.view.forceLayout();
          }*/
        };
        var client = kony.sdk.getCurrentInstance();
        var intgService = client.getIntegrationService("BoxService");
        kony.model.ApplicationContext.showLoadingScreen("please wait..");
        intgService.invokeOperation("UploadFilesInfFolderMob",{},{
          "appUserID":appUserID,
          "folderID":folderID,
          "imageBase64":imageBase64,
          "imageName":imageName
        },uploadSuccess,function(error){
          kony.model.ApplicationContext.dismissLoadingScreen();
          alert(error);
        });
      }catch(e){
        kony.model.ApplicationContext.dismissLoadingScreen();
        alert(e.message);
      }
    },
    getImages:function(folderID){
      debugger;
      var imageList=[];
      var self=this;
      if(folderID===null||folderID===undefined){
        folderID=this._rootFolderID;
      }
      var appUserID=this._appUserID;
      if(appUserID===""||appUserID===null||appUserID===undefined){
        alert("please provide the app user ID");
        return;
      }
      try{
        var client = kony.sdk.getCurrentInstance();
        var intgService = client.getIntegrationService("BoxService");
        kony.model.ApplicationContext.showLoadingScreen("fetching image..");
        intgService.invokeOperation("getFilesInFolder",{},{
          "appUserID":appUserID,
          "folderID":folderID
        },function(successResponse){
          // alert(successResponse.results.result);
          kony.model.ApplicationContext.dismissLoadingScreen();
          imageList=successResponse.results;
          imageList=JSON.parse(imageList);
          self.setImage(imageList.result);
        },function(error){
          kony.model.ApplicationContext.dismissLoadingScreen();
          alert(error);
        });
      }catch(e){
        kony.model.ApplicationContext.dismissLoadingScreen();
        alert(e.message);
      }
      // return imageList;
    },
    setCamerRawBytes:function(eventobject){
      var cameraRawBytes = eventobject.rawBytes;
      this.view.img0.rawBytes=cameraRawBytes;
      //createImageObject();
      //assignRawBytestoImage();
    },
    getFlexItem:function(id,imgURL){
      var self=this;
      function test(eventobject){
        var flexId=eventobject.id;
        var id=flexId.split("flxItem");
        //var imageSrc=self.view["imgThumb"+id[1]].src;
        //self.view.imgEvent.src=imageSrc;
        //alert(eventobject.id);
      }
      var left;
      left=(id===0)?0:5;
      var flxItem = new kony.ui.FlexContainer({
        "autogrowMode": kony.flex.AUTOGROW_NONE,
        "clipBounds": true,
        "height": "80dp",
        "id": "flxItem"+id,
        "isVisible": true,
        "layoutType": kony.flex.FREE_FORM,
        "left": left+"dp",
        "onClick": test,
        "skin": "sknFlxThumbBG",
        "top": "dp",
        "width": "80dp",
        "zIndex": 1
      }, {}, {});
      // flxItem.setDefaultUnit(kony.flex.DP);
      var imgThumb = new kony.ui.Image2({
        "centerX": "50%",
        "centerY": "50%",
        "height": "100%",
        "id": "imgThumb"+id,
        "isVisible": true,
        "skin": "slImage",
        "base64": "",
        "imageWhileDownloading": "loader.gif",
        "width": "100%",
        "zIndex": 1
      }, {
        "imageScaleMode": constants.IMAGE_SCALE_MODE_FIT_TO_DIMENSIONS,
        "padding": [0, 0, 0, 0],
        "paddingInPixel": false
      }, {});
      //"imageWhileDownloading": "loader.gif",

      imgThumb.src=imgURL;
      flxItem.add(imgThumb);
      return flxItem;
    }
  };
});