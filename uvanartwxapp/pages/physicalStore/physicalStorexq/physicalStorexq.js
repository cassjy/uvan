var skip = require("../../../utils/navigateTo.js"),
    api = require("../../../utils/API/request.js");
import { GetPhysicalStore } from "../../../utils/API/physicalStore/api.js"
Page({
    data:{
      loadingText:'加载中',
      Address:"",
      BusinessTime:"",
      City:"",
      District:"",
      Introduction:"",
      Latitude:"",
      Longitude:"",
      Phone:"",
      Province:"",
      StoreContact:"",
      StoreName:"",
      downList:"",
      midList:[],
      topList:"",
      height1:0,
      height2:0,
      height3:0,
      IsCanReserve:false,//是否可预约
    },
  onLoad: function (options) {
    this.loading = this.selectComponent("#loading");
    this.loading.showToast();
    var data={data:options.id}
    var _this = this
    var header = "application/json";
    // api.get("/lr/s2bapi/GetPhysicalStore", data, header)
    GetPhysicalStore(data,header)
    .then(function (res) {
      console.log(res)
      if(res.code==200){
        console.log("获取成功")
        _this.setData({
          Address:res.data.Data.F_Address,
          BusinessTime:res.data.Data.F_BusinessTime,
          City:res.data.Data.F_City,
          District:res.data.Data.F_District,
          Introduction:res.data.Data.F_Introduction,
          Latitude:res.data.Data.F_Latitude,
          Longitude:res.data.Data.F_Longitude,
          Phone:res.data.Data.F_Phone,
          Province:res.data.Data.F_Province,
          StoreName:res.data.Data.F_StoreName,
          downList:res.data.Data.downList,
          midList:res.data.Data.midList,
          topList:res.data.Data.topList,
          IsCanReserve: res.data.Data.F_IsCanReserve,
        })
        setTimeout(function(){
          _this.loading.hideToast();
        },300)
        console.log(_this.data.StoreName)
        wx.setNavigationBarTitle({
          title:_this.data.StoreName
        })
      }
    })
    .catch(res=>{
      _this.loading.hideToast();
    })
  },
  toStore:function(){
    skip.navigateTo(this,'../storeList/storeList');
  },
  toAppointment:function(){
    debugger
    if(this.data.StoreName =="羊城·广州直营体验店"){
      skip.navigateTo(this, '../guangzhoushop/guangzhougshop');
    }else{
        this.showTips();
    }
  },
  goToAddress:function(event){
    var _this = this;
    wx.openLocation({
      latitude: Number(_this.data.Latitude),
      longitude: Number(_this.data.Longitude),
      name: _this.data.City+_this.data.District+_this.data.Address,
      address:_this.data.City+_this.data.District+_this.data.Address,
      scale: 28
    })
    this.setData({ id: "" });
    
  },
  showTips: function (e) {
    console.log(1)
    var _this = this;
    let pages = getCurrentPages();
    let curPage = pages[pages.length - 1];
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-in',
    })
    animation.opacity(1).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(0).step();
      _this.setData({
        animationData: animation.export()
      })
    }, 3000)
  },
  //图片载入完毕
  loadImg: function(e){
    console.log(e)
    var _this = this;
    var bl = e.detail.width/e.detail.height;//原图比例
    var sjheight = wx.getSystemInfoSync().windowWidth/bl//显示实际高度
    var i = e.currentTarget.dataset.id;
    if(e.currentTarget.dataset.id==1){
      this.setData({
        height1:sjheight
      })
    }else if(e.currentTarget.dataset.id==2){
      this.setData({
        height2:sjheight
      })
    }else if(e.currentTarget.dataset.id==3){
      this.setData({
        height3:sjheight
      })
    }
    setTimeout(function(){
      _this.loading.hideToast();
    },1000)
  },
  imageError: function(e) {
    console.log('加载失败，请重新刷新');
    this.setData({
      loadingText:'加载失败'
    });
    this.loading.showToastSecond(2000);
  }
})