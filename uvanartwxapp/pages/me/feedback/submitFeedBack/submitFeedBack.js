// pages/me/feedback/submitFeedBack/submitFeedBack.js
var api = require("../../../../utils/API/request.js");
var common = require("../../../../utils/common.js")
import { UserFeedback } from '../../../../utils/API/me/api.js'

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
     dataList: [],
     hiddenNotFB: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getdata()
  },

  //获取历史反馈数据
  getdata: function () {
    var data = {
      'openid': wx.getStorageSync('openid'),
      'PostType': 4
    },
      _this = this,
      header = "application/x-www-form-urlencoded"
    UserFeedback(data, header)
      .then(res => {
        console.log(res);
        if (res.code == 200) {
          if (res.data.length == 0) {
            _this.setData({
              hiddenNotFB: false
            })
            return;
          }
          _this.setData({
            dataList: res.data,
            hiddenNotFB: true
          })
        } else {
          wx.showToast({
            title: '服务器繁忙!',
            icon: 'none',
            duration: 2000
          })
        }
      })
      .catch(function (reason) {
        console.log(reason);
      })
      .then(() => {
        wx.hideLoading()
      });
  }, 


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //开始计时（停留时间）
    stayTime_JY = 0//停留时间
    stayTimer_JY = setInterval(()=>{
      stayTime_JY++
    },1000)
  },
  onHide: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"反馈意见")
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"反馈意见")
  },

})