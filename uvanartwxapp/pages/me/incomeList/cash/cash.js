var common = require("../../../../utils/common.js")
var api = require("../../../../utils/API/request.js")
import { GetUserIncomeStatus, GetNewIncomeCashRecord, CreateIncomeCashRecord, GetIncomeCashRecord} from '../../../../utils/API/me/api.js'
var limit = 15
var page = 1
var token = ''
var phone = ''
var openid = ''

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({
	data:{
		showTips: false,
		moneylist: [],
		canloadmore: true,
		FAllPrice: 0,
		F_AccountName: '',
		F_BankAccount: '',
		F_Bank: '',
		F_AlipayAccount: '',
		isTap: false,
		showCard: false,//弹出提现到银行卡的信息
		writtenName: '',
		name: '',
		acount: '',
		bankname: '',
		bankArr: ['中国银行', '中国工商银行', '中国建设银行', '中国农业银行','招商银行','交通银行'],
		showMoney: false,//提现框
		focus: false,
		money: '',//输入的金额
		showAlipayAcount: false,//弹出提现到支付宝
		aliacount: '',//支付宝账号
		aliacountname:"", //支付宝姓名
		fromAlipay: false,//提现到银行卡or支付宝
		canSubmit: true,//防止重复提交
	},
	onLoad: function(option){
		page = 1
		this.setData({
			FAllPrice: option.FAllPrice
		})
		console.log(this.data.FAllPrice)
		this.loaddata(limit,page,true)
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
    common.visitorRecordAPI(stayTime_JY,"提现")
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"提现")
  },
	onReachBottom: function(){
		if(this.data.canloadmore){
			this.loaddata(limit,page+=1,false)
			this.setData({
				canloadmore: false
			})
		}
		
	},
	back: function(){
		wx.reLaunch({
			url:'../incomeList'
		})
	},
	toTips: function(){
		this.setData({
			showTips: true,
			isTap: true
		})
	},
	toOK: function(){
		this.setData({
			showTips: false,
			isTap: false
		})
	},
	//检查是否重复申请
	checkcash(e){
		wx.showLoading({
		  title: '加载中',
		  mask:true
		})
		var data = {
			"token": token,
	    	"loginMark": phone
		},
			_this = this,
			url = "/s2b/incomecash/GetUserIncomeStatus"
		GetUserIncomeStatus(data)
		.then(res=>{
      console.log(res)
			wx.hideLoading()
			if(res.code == 200){
				if(e.currentTarget.dataset.id==1){
					_this.toCard()
				}else{
					_this.toAlipayAcount()
				}
			}else{
				wx.showToast({
				  title: res.info,
				  duration: 2000
				})
			}
		})
		.catch(error=>{
			wx.hideLoading()
			console.log(error)
			wx.showToast({
			  title: "请求服务器异常",
			  duration: 2000
			})
		})
		
	},
	toCard: function(){
		this.setData({
			isTap: true,
			showCard: true,
		})
		const _this = this
		var bankData = {
			"token": token,
    	"loginMark": phone,
    	"data": { 
    		"openid": openid
    	}
		}
    GetNewIncomeCashRecord(bankData)
		.then(res=>{
			console.log(res)
			if(res.code == 200){
				
				if(res.data.incomeCashByBankEntity === null){
					
	
				}else{
					this.setData({
						name: res.data.incomeCashByBankEntity.F_AccountName,
						acount: res.data.incomeCashByBankEntity.F_BankAccount,
						bankname: res.data.incomeCashByBankEntity.F_Bank
					})
					
				}
				
				
			}else{
				
			}
			
		})
		
		
	},
	//提现到支付宝
	toAlipayAcount: function(){
		const _this = this
		var bankData = {
			"token": token,
    	"loginMark": phone,
    	"data": { 
    		"openid": openid
    	}
		}
    GetNewIncomeCashRecord(bankData)
		.then(res=>{
			if(res.code == 200){
        console.log(`提现到支付宝${JSON.stringify(res)}`)
				if(res.data.incomeCashByAlipayEntity === null){

					
					this.setData({
						showAlipayAcount: true,
						isTap: true,
					})
				}else{
					this.setData({
						aliacount: res.data.incomeCashByAlipayEntity.F_AlipayAccount,
						showAlipayAcount: true,
						isTap: true,
					})
				
				}
			}else{
				
			}
		})
	},
	cancelAlipay: function(){
		this.setData({
			showAlipayAcount: false,
			isTap: false,
		})
	},
	loaddata: function(limit,page,isonload){
		let total1 = page*limit
		token = wx.getStorageSync('token')
		phone = wx.getStorageSync('phone')
		openid = wx.getStorageSync('openid')
		if(this.data.canloadmore){
			wx.showToast({
			  title: '加载中',
			  icon: 'loading',
			  duration: 2000
			})
		}
		var moneydata = {
			"token": token,
    	"loginMark": phone,
    	"data": { 
    		"limit": limit, 
    		"page": page
    	}
		}
    GetIncomeCashRecord(moneydata,)
		.then(res=>{
			if(res.code == 200){
				let moneylist = res.data.Data
				let total = res.data.Total
				this.setData({
					moneylist: isonload?moneylist:this.addGoods(this.data.moneylist,moneylist)
				})

				if(total1>=total){
					this.setData({
						canloadmore: false
					})
					wx.showToast({
					  title: '已显示全部',
					  icon: 'none',
					  duration: 1500
					})
				}else{
					this.setData({
						canloadmore: true
					})
				}
			}	
		})
	},
	addGoods: function(goodsList,resData){
    var length = goodsList.length
    for(let i = 0;i<resData.length;i++){
      goodsList[i+length] = resData[i]
    }
    return goodsList
  },
  // 提现到银行卡
  // 选择银行
  bindPickerChange: function(e) {
    this.setData({
      bankname: e.detail.value
    })
  },
  //取消
  cancel: function(){
  	this.setData({
  		isTap: false,
  		showCard: false
  	})
  },
  // 输入信息
  activeName: function(e){
		let name = e.detail.value
		this.setData({
			writtenName: name,
			name: this.trimG(name,'a')
		})
		console.log(this.data.name)
	},
	activeAcount: function(e){
		let acount = e.detail.value
		this.setData({
			acount: this.trimG(acount,'g')
		})
	},
	trimG: function(str,is_global){
		var result;
		result = str.replace(/(^\s+)|(\s+$)/g,"");
		if(is_global.toLowerCase()=="g")
		{
		result = result.replace(/\s/g,"");
		}
		return result;
	},
	//确认
	toToCard: function(){
		const _this = this
		if(this.data.name==''||this.data.acount==''||this.data.bankname==''){
			common.showModal( '请输入完整的银行卡信息', '提示', function (res) {
        if (res.confirm) {
        	_this.setData({
        		focus: true
        	})
          return
        }
      })
		}else{
			this.setData({
				fromAlipay: false,
				showMoney:true,
				showCard:false,
				focus: true
			})
		}	
	},
	//输入提现金额
	activemoney: function(e){
		let moneyVal = e.detail.value
		this.setData({
			money: moneyVal
		})
	},
	closeMoney: function(){
		this.setData({
			showMoney:false,
			isTap: false
		})
	},
	submit: function(){
		const _this = this
		if(this.data.canSubmit==false){
			return
		}
		this.setData({
			canSubmit: false
		})
		if(this.data.FAllPrice == 0){
			common.showModal( '当前没有可提取的现金', '提示', function (res) {
		        if (res.confirm) {
		          return
		        }
		    })
     		this.setData({
				canSubmit: true
			})
     		return
		}
		if(Number(this.data.money) > Number(this.data.FAllPrice)){
			common.showModal( '提现金额不能大于可提现金额', '提示', function (res) {
		        if (res.confirm) {
		        	_this.setData({
		        		focus: true
		        	})
		          return
		        }
	        })
      		this.setData({
				canSubmit: true
			})
      		return
		}

		if(this.data.money=='' || this.data.money == 0){
			common.showModal( '请输入正确的金额', '提示', function (res) {
		        if (res.confirm) {
		        	_this.setData({
		        		focus: true
		        	})
		            return
		        }
	        })
      		this.setData({
				canSubmit: true
			})
     		return
		}else{
			let token = '' , phone = ''	, carddata = {}
			token = wx.getStorageSync('token')
			phone = wx.getStorageSync('phone')
			this.setData({
    		isTap: false,
    		showMoney: false
    	})
			if(this.data.fromAlipay==false){
				carddata = {
					"token": token,
		    	"loginMark": phone,
		    	"data": { 
		    		"F_ApplicationAmount": this.data.money, 
		    		"F_AccountName": this.data.name, 
		    		"F_BankAccount": this.data.acount, 
		    		"F_Bank": this.data.bankname
		    	}
				}
			}else{
				carddata = {
					"token": token,
		    	"loginMark": phone,
		    	"data": { 
		    		"F_ApplicationAmount": this.data.money, 
		    		"F_AlipayAccount": this.data.aliacount, 
		    		"F_AccountName": this.data.aliacountname
		    	}
				}	
			}
      CreateIncomeCashRecord(carddata)
			.then(res=>{
				if(res.code==200){
					this.setData({
						canSubmit: true
					})
        	page = 1
        	this.loaddata(limit,page,true)
					common.showModal( '提现请求提交成功', '成功', function (res) {
		        if (res.confirm) {
		          return
		        }
	        	return
		      })
				}
			})
		}
		
	},
	//提现到支付宝
	activeAliacount: function(e){
		let aliacount = e.detail.value
		this.setData({
			aliacount: this.trimG(aliacount,"g")
		})
	},
	//提现到支付宝填写真实姓名
	activeAliacountName: function(e){
		this.setData({
			aliacountname: e.detail.value
		})
	},
	toAlipay: function(){
		const _this = this
		if(this.data.aliacount==''){
			common.showModal( '请输入正确的支付宝账号', '提示', function (res) {
		        if (res.confirm) {
		        	_this.setData({
		        		focus: true
		        	})
		          return
		        }
		    })
		}else if(this.data.aliacountname==''){
			common.showModal( '请输入真实姓名', '提示', function (res) {
		        if (res.confirm) {
		          return
		        }
		    })
		}else{
			this.setData({
				fromAlipay: true,
				showMoney:true,
				showAlipayAcount:false,
				focus: true
			})
		}
	},
})