var common = require("../../utils/common.js")
var api = require("../../utils/API/request.js")
import { getproductcategories, getproductstyles, checktoken, login, GetMyOpenid} from '../../utils/API/explore/api.js'
import {
  GetWxOpenId
} from "../../utils/API/activity/activity.js";
import {
  ValidateUserType
} from '../../utils/API/detail/api.js'
var start = 0
var CateID = ''
var StyleID = ''

var lastCateIndex = 0
var lastStyleIndex = 0

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器

Page({
	data: {
		categories: [],//分类名列表
    categoriesChild: [],//分类列表
    style: [],//风格名列表
    styleChild: [],//风格列表
    cateIndex: 0,//记录上一次选择的分类，以便在分类和风格之间切换不会改变上一次的状态
    CateID: CateID,//分类ID
    StyleID: StyleID,//风格ID
    openCate: true,//控制打开分类，默认打开分类
    openStyle: false,//控制打开风格
    searchValue: '',
    inputValue: '',
    isEmployee: false,
	},
	onLoad: function (option) {
    wx.hideShareMenu()
    const _this = this
    start = 0 
    var categoriesData = this.data.categories
    var categoriesChildData = this.data.categoriesChild
    var stylesData = this.data.style
    var stylesChildData = this.data.styleChild
    wx.getStorage({
      key: "openid",
      success: function(res) {
        var data = {
          "token": "",
          "loginMark": "",
          "data": res.data
        }
        // api.post("/lr/s2bapi/validateusertype", data)
        ValidateUserType(data)
        .then(res => {
          console.log(res)
          let tokenTmp = wx.getStorageSync('token') || ''
          if(res.code==200 && res.data.F_Employees){
            _this.setData({
              isEmployee: true
            })
          }
        })
      },
      fail: function(err){
        GetWxOpenId().then(res => {
          var data = {
            "token": "",
            "loginMark": "",
            "data": res.data.data
          }
          //用户未授权的话，nickName传空格字符串
          ValidateUserType(data)
          .then(res => {
            console.log(res)
            let tokenTmp = wx.getStorageSync('token') || ''
            if(res.code==200 && res.data.F_Employees){
              _this.setData({
                isEmployee: true
              })
            }
          })
        })
      }
    })
    wx.showNavigationBarLoading()
    var catedata = {
      "data": ""
    }
    getproductcategories(catedata)//分类列表接口
    .then(function(res){
      
      if(res.code == 200){
        _this.setData({
          CateID: res.data[0].id
        })
        let cateData = []
        let cateDataChild = []
        for(let i = 0; i<res.data.length; i++){
          cateData[0] = res.data[i]
          _this.setData({
            categories: _this.addGoods(categoriesData,cateData)
          })
        }
        for(let i = 0; i<categoriesData.length; i++){
          cateDataChild[i] = new Array()
          let count = 0
          console.log(res.data[i].children)
          for(let j = 0; j<res.data[i].children.length; j++){
            cateDataChild[i][count] = res.data[i].children[j]
            count++
            
          }
        }
        _this.setData({
          categoriesChild: cateDataChild
        })
      }else{
        common.showModal('分类菜单未加载成功，请稍后再尝试。','提示',function(res){
          if(res.confirm){
            return
          }
        })
      } 
    })
    var styledata = {
      "data": ""
    }
    getproductstyles(styledata)//风格列表接口
    .then(function(res){
      
      if(res.code == 200){
        _this.setData({
          StyleID: res.data[0].id
        })
        let styleData = []
        let styleDataChild = []
        for(let i = 0; i<res.data.length; i++){
          styleData[0] = res.data[i]
          _this.setData({
            style: _this.addGoods(stylesData,styleData)
          })
        }
        for(let i = 0; i<stylesData.length; i++){
          styleDataChild[i] = new Array()
          let count = 0
          for(let j = 0; j<res.data[i].children.length; j++){
            styleDataChild[i][count] = res.data[i].children[j]
            count++
          }
        }
        _this.setData({
          styleChild: styleDataChild
        })
      }else{
        common.showModal('分类菜单未加载成功，请稍后再尝试。','提示',function(res){
          if(res.confirm){
            return
          }
        })
      } 
    })
    .then(function(){
      wx.hideNavigationBarLoading()
    })
  },
  onShow: function(){
    //开始计时（停留时间）
    stayTime_JY = 0//停留时间
    debugger;
    stayTimer_JY = setInterval(()=>{
      stayTime_JY++
    },1000)
  },
  onHide: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"分类")
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"分类")
  },
  /*search text*/
  searchFn: function(){
    if(this.data.searchValue==""){
      this.toSearchPage()
      return
    }
    const _this = this
    wx.navigateTo({
      url: "../categories/categories?searchValue="+_this.data.searchValue
    })
  },
  toSearchPage: function(){
    wx.navigateTo({
      url: "../categories/categories"
    })
  },

  opencart: function(){
    this.refreash();
    wx.navigateTo({ url: '../shopping-cart/shopping-cart'})
  },
  refreash:function(){
    var token = wx.getStorageSync("token");
    var phone = wx.getStorageSync("phone");
    var openid = wx.getStorageSync("openid");
    if(token!=''){
      let checktokendata = {}
      let checktokenheader = 'application/x-www-form-urlencoded'
     checktoken(checktokendata,checktokenheader,token)
      .then(res=>{
        if(res.data.code==0){

        }else if(res.data.code == -1){
          api.wxlogin()
          .then(res => {
            // let url = '/api/user/login'
            let data = {
              "code": res,
              // "orginOpenId":''
            }
            let header = 'application/json'
           // login(data,header)
           GetMyOpenid(data)
            .then(res=>{
              if(res.data.code==0){
                console.log(res)
                // wx.setStorageSync('token', res.header.Token)
                wx.setStorageSync('openid', res.data.data)
                // wx.setStorageSync('phone',res.data.data.phone)
                // wx.setStorageSync('characterType',res.data.data.userType)
                // wx.setStorageSync('Privilege',res.data.data.privilege)
              }
            })
          })
        }
      })
    }
  },
  /*switch between list of cate and list of style*/
  cate: function(){
    this.setData({
      cateIndex: lastCateIndex,
      openCate: true,
      openStyle: false,
    })
  },
  style: function(){
    this.setData({
      cateIndex: lastStyleIndex,
      openCate: false,
      openStyle: true
    })
  },
  selectCate: function(e){
    let nowIndex = e.target.dataset.index
    lastCateIndex = e.target.dataset.index //记录上一次选择的分类，以便在分类和风格之间切换不会改变上一次的状态
    CateID = e.target.dataset.id
    this.setData({
      cateIndex: nowIndex,
      CateID: CateID
    })
  },
  selectStyle: function(e){
    let nowIndex = e.target.dataset.index
    lastStyleIndex = e.target.dataset.index
    StyleID = e.target.dataset.id
    this.setData({
      cateIndex: nowIndex,
      StyleID: StyleID
    })
  },
  toCate: function(e){
    this.setData({
      searchValue: '',
      inputValue: ''
    })
    if(this.data.openCate){
      console.log(e.target.dataset.id)
      if(e.target.dataset.id){
        wx.navigateTo({
          url: "../categories/categories?pID=" + e.target.dataset.id + "&pName=" + e.target.dataset.name
        })
      }else{
        // 内销
        console.log('内销')
        wx.navigateTo({
          url: "../categories/categories?isClear=1"
        })
      }
    }else if(this.data.openStyle){
      console.log(e.target.dataset.id)
      if(e.target.dataset.id){
        wx.navigateTo({
          url: "../categories/categories?sID=" + e.target.dataset.id + "&sName=" + e.target.dataset.name
        })
      }else{
        // 内销
        console.log('内销')
        wx.navigateTo({
          url: "../categories/categories?isClear=1"
        })
      }
    }
  },
  /*add data function*/
  addGoods: function(goodsList,resData){
    var length = goodsList.length
    for(let i = 0;i<resData.length;i++){
      goodsList[i+length] = resData[i]
    }
    return goodsList
  },
  trim: function(s){
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },
  
})