// 原始的邀请梵星页面

var api = require("../../../utils/API/request.js")
var common = require("../../../utils/common.js");
import {  validateusertype} from "../../../utils/API/me/api.js"
import { GetWxOpenId} from "../../../utils/API/activity/activity.js"
var scene = ''
var sOpenid = ''
var sIndex = ''


var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器

const app = getApp()
Page({
	data:{
		openidofvisiter: '',
    canToDetail: true
	},
  onShow:function(){
    stayTime_JY = 0 //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
  },
  onHide: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "梵星邀请函")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "梵星邀请函")
  },
	onLoad: function(option){
    debugger;
    if(option.scene){
      debugger
      console.log('invitationID='+ option.scene)
      //公共分享的访问记录
      let invitationID = option.scene
      common.commonVisitRecord(invitationID,'')
    }
    if(option.invitationID){
      debugger;
      console.log('invitationID='+ option.invitationID)
      console.log('openid='+ option.openid)
      //公共分享的访问记录
      let invitationID = option.invitationID
      let originalOpenid = option.openid
      common.commonVisitRecord(invitationID,originalOpenid)
    }
    

    console.log("uvstar---------------------------");
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    console.log(option);
    const _this = this
    GetWxOpenId().then(res=>{
      debugger
      _this.setData({
        openidofvisiter:res.data.data
      })
      var data={
        "token": "",
        "loginMark": "",
        "data": this.data.openidofvisiter
      }
      wx.hideLoading();
     validateusertype(data)
      .then(res=>{
        if(option.openid){
          sOpenid = option.openid
          //2018-7-11不再缓存来源openid
          wx.setStorage({ key:"inviter",data: sOpenid})
          console.log("inviter------------"+sOpenid);
        }
        if(res.code == 200 && (res.data.F_UserType == "梵星" || res.data.F_UserType == "蒲公英")){
          wx.switchTab({
            url:'../../home/home'
          })
        }
      })         
    })
	},
	toMine: function(){
		wx.navigateTo({
      url:'../../me/twicelogin/twicelogin'
		})
	}

})