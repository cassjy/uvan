var api = require("../../utils/API/request.js");
var common = require("../../utils/common.js")
import { GetAllPhysicalStore } from "../../utils/API/physicalStore/api.js"
var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({
  data:{
      loadingText:'加载中',
      content: [],
      height:0
  },
  onLoad: function (options) {
    this.loading = this.selectComponent("#loading");
    this.loading.showToast();
    var data={}
    var _this = this
    var header = "application/json";
    // api.get("/lr/s2bapi/GetAllPhysicalStore", data, header)
    GetAllPhysicalStore(data,header)
    .then(function (res) {
      console.log(res)
      if(res.code==200){
        console.log("获取成功")
        _this.setData({
          content:res.data.Data
        })
        setTimeout(function(){
          _this.loading.hideToast();
        },300)
      }
    })
    .catch(res=>{
      _this.loading.hideToast();
    })
  },
  onShow: function(){
    //开始计时（停留时间）
    stayTime_JY = 0//停留时间
    stayTimer_JY = setInterval(()=>{
      stayTime_JY++
    },1000)
  },
  onHide: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"体验馆")
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"体验馆")
  },
  //图片载入完毕
  loadImg: function(e){
    var _this = this;
    var bl = e.detail.width/e.detail.height;//原图比例
    var sjheight = wx.getSystemInfoSync().windowWidth/bl//显示实际高度
    var i = e.currentTarget.dataset.id;
    this.setData({
      height:sjheight
    })
    setTimeout(function(){
      _this.loading.hideToast();
    },1000)
  },
  imageError: function(e) {
    console.log('加载失败，请重新刷新');
    // wx.showToast({
    //   title: '加载失败',
    //   icon: 'loading',
    //   duration: 2000
    // })
    this.setData({
      loadingText:'加载失败'
    });
    this.loading.showToastSecond(2000);
  }
})