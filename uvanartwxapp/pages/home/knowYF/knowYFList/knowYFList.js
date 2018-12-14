// pages/home/knowYF/knowYFList/knowYFList.js
var common = require("../../../../utils/common.js")
var api = require("../../../../utils/API/request.js")
var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
    common.visitorRecordAPI(stayTime_JY,"走进优梵艺术")
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"走进优梵艺术")
  },
  tab1(event) {
      wx.navigateTo({
        url: '../knowYF?id=' + event.currentTarget.dataset.tab
      })
  },
  
})