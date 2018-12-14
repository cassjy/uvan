var api = require("../../../../utils/API/request.js");
var common = require("../../../../utils/common.js");
var stayTime_JY = 0; //停留时间
var stayTimer_JY; //定时器
import {
  InvitedQrCode,
} from '../../../../utils/API/me/api.js'

Page({
  data:{
  	content1: true,
  	content2: false
  },
  onLoad(option){
    if(option.scene){
      console.log('invitationID='+ option.scene)
      //公共分享的访问记录
      let invitationID = option.scene
      common.commonVisitRecord(invitationID,'')
    }
  },
  onShow(){
    //开始计时（停留时间）
    stayTime_JY = 0 //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, '巴比松电视柜')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, '巴比松电视柜')
  },
  toIndex(){
  	wx.switchTab({
  		url: "../../../home/home"
  	})
  },
  showcontent1(){
  	this.setData({
  		content1: true,
  		content2: false
  	})
  },
  showcontent2(){
  	this.setData({
  		content2: true,
  		content1: false
  	})
  }
})