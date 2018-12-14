var api = require("../../../utils/API/request.js")
var common = require("../../../utils/common.js")
import { GetDandelionSaleroom } from '../../../utils/API/me/api.js'

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({
	data: {
		hiddenInfo: true,
		earlydate:'2017-09-01',
		startdate: '2017-09-01',
		nowdate:'2029-01-01',
		enddate:'',
		showtips:true,
		message:[]
	},
	onLoad: function(){
		wx.setNavigationBarTitle({
		  title: '销售管理'
		})
		var d=new Date()
		var day=d.getDate(),
			oday=d.getDate(),
			month=d.getMonth() + 1,
			year=d.getFullYear()
			if(month-6<=0){
				var omonth=d.getMonth() +1+6,
					oyear=d.getFullYear()-1
			}else{
				omonth=d.getMonth() + 1-6,
				oyear=d.getFullYear()
			}
			if(day<10){
				day="0"+day
			}
			if(oday<10){
				oday="0"+oday
			}
			if(month<10){
				month="0"+month
			}
			if(omonth<10){
				omonth="0"+omonth
			}
		this.setData({
	      nowdate: year+"-"+month+"-"+day,
	      enddate: year+"-"+month+"-"+day,
	      startdate:"2018-01-01"
	    })
	    wx.showLoading({
	       title: '加载中'
	    })
	    this.getdata()
	},
	getdata: function(){
		console.log(this.data.startdate)
		console.log(this.data.nowdate)
		var _this = this
		var data={
			token:wx.getStorageSync('token'),
			loginMark:wx.getStorageSync('phone'),
			data:JSON.stringify({"beginTime":this.data.startdate,"endTime":this.data.nowdate})
		}
		var header = "application/json";
      	GetDandelionSaleroom(data, header).then(function (res) {
        	console.log(res)
	        if(res.data.length>0){
		        _this.setData({
		        	message:res.data,
		        	hiddenInfo:true
		        })
	        }else{
	        	_this.setData({
		        	message:res.data,
		        	hiddenInfo:false
		        })
	        }
	        wx.hideLoading();
      	})
	},
	showsale: function(){
		this.setData({
			showtips:false
		})
	},
	cancel: function(){
		this.setData({
			showtips:true
		})
	},
	//图片载入完毕
	loadImg: function(e){
	    console.log("图片载入完毕");
	    
	},
	bindstartDateChange: function(e){
		//console.log('picker发送选择改变，携带值为', e.detail.value)
	    this.setData({
	      startdate: e.detail.value
	    })
	    wx.showLoading({
	       title: '加载中'
	    })
	    this.getdata()
	},
	bindendDateChange: function(e){
		//console.log('picker发送选择改变，携带值为', e.detail.value)
	    this.setData({
	      nowdate: e.detail.value
	    })
	    wx.showLoading({
	       title: '加载中'
	    })
	    this.getdata()
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
    common.visitorRecordAPI(stayTime_JY,"销售管理")
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"销售管理")
  },
})