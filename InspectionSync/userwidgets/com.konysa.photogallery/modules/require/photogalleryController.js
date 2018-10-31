define(function() {

  return {
    /**
		 * @function
		 *
		 * @param baseConfig 
		 * @param layoutConfig 
		 * @param pspConfig 
		 */
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this._id=0;
    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {

    },
    /**
     * @function
     *
     */
    removeAllImage:function(){
      debugger;
      this.view.flxScThumbImage.removeAll();
    },
    addImageBase64:function(imageBase64){
      if(typeof imageBase64==='string' && imageBase64.length>0){
        var id=this._id;
        var flxItem=this.getFlexItem(id,imageBase64);
        this.view.flxScThumbImage.add(flxItem);
        this._id=id+1;
      }
    },
    /**
     * @function getFlexItem
     * @description This function is used to create flex container with image dynamically. 
     * @private
     * @param {string} id
     * @param {string} imageUrl
     */
    getFlexItem:function(id,imageBase64){
      var self=this;
      function showImage(eventobject){
        var flexId=eventobject.id;
        var id=flexId.split("flxItem");
        /*var imageSrc=self.view["imgThumb"+id[1]].src;
        self.view.imgEvent.src=imageSrc;*/
        var imageBase64=self.view["imgThumb"+id[1]].base64;
        self.view.imgEvent.base64=imageBase64;
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
        "onClick": showImage,
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
        //"src": imageUrl,
        "base64":imageBase64,
        // "imageWhileDownloading": "eventske.png",
        "width": "100%",
        "zIndex": 1
      }, {
        "imageScaleMode": constants.IMAGE_SCALE_MODE_FIT_TO_DIMENSIONS,
        "padding": [0, 0, 0, 0],
        "paddingInPixel": false
      }, {});
      flxItem.add(imgThumb);
      return flxItem;
    }
  };
});