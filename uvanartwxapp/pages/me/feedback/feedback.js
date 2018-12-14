var api = require("../../../utils/API/request.js");
var common = require("../../../utils/common.js")
import { UserFeedback} from '../../../utils/API/me/api.js'
// pages/me/feedback/feedback.js

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenNotFB: true,
    data: [],
    navNum: 0,
    cursor: 0,
    value: '',
    myFeedBack: '',
    businessReply: '',
    submitText: '提交',
    mark: 1,
    list: ["全部解决,十分感谢", "全部解决,但时间过长", "基本解决,但还有改进空间", "未解决问题"],
    Fid: '', //反馈id
    FeedbackComment: '',
    hiddenEvaluate: true,
    state: '' //反馈状态是否审核
  },
  // 导航栏选择
  navCheck(e) {
    this.setData({
      hiddenEvaluate: true, //隐藏用户评价
      mark: 1,
      submitText: '提交',
      navNum: parseInt(e.currentTarget.dataset.id)
    })
  },
  // 用户输入意见完成获取value值
  confirm: function (e) {
    console.log(e)
    this.setData({
      value: e.detail.value,
      cursor: e.detail.value.length
    })
  },

  // 提交按钮
  submit() {
    var _this = this
    if (this.data.value == '') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var data = {
      'openId': wx.getStorageSync('openid'),
      'PostType': 1,
      'Msg': this.data.value,
      'Mobile': wx.getStorageSync('phone')
    };
    let header = "application/x-www-form-urlencoded"
    UserFeedback(data, header).then(res => {
      console.log(res);
      if (res.code == 200) {
        wx.showModal({
          title: '提交成功',
          showCancel: false,
          confirmText: "好的",
          content: '您的反馈意见我们会及时认真处理 ，感谢您的反馈。',
          success: function (res) {
            wx.navigateBack({
              delta: 2
            })
          }
        })

      } else {
        wx.showToast({
          title: '提交失败，请重新提交！',
          icon: 'none',
          duration: 2000
        })
      }
    })

  },

  // 反馈详情页
  toHisFeedback: function () {
    wx.navigateTo({
      url: 'submitFeedBack/submitFeedBack',
    })
  },


  // 点击去提交按钮
  ToSubFeedback: function () {
    wx.navigateTo({
      url: 'submitFeedBack/submitFeedBack?id=0',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //开始计时（停留时间）
    stayTime_JY = 0//停留时间
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
    common.visitorRecordAPI(stayTime_JY, "反馈意见列表")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "反馈意见列表")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})