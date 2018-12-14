var common = require("../../../utils/common.js")
var api = require("../../../utils/API/request.js")

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({
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
    common.visitorRecordAPI(stayTime_JY,"广州店")
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"广州店")
  },
	toGDStore(){
		wx.navigateTo({
			url:'../../physicalStore/guangzhoushop/guangzhougshop'
		})
	},
	tobrandservice(){
		wx.navigateTo({
			url:'../brandservice/brandservice'
		})
	}
})