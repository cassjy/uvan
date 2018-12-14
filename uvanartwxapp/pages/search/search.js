var common = require("../../utils/common.js")
var api = require("../../utils/API/request.js")
import { GetNewSearchHistory, CreateSearchHistory, DeleteSearchHistory } from "../../utils/API/search/api.js"
var openid = ''
Page({
	data:{
		searchValue: "",
		inputValue: "",
    record: []
	},
  onLoad: function(option){
    openid = wx.getStorageSync('openid')
    var getHistoryData = {
      "data": openid
    }
    // api.get('/lr/s2bapi/GetNewSearchHistory',getHistoryData)
    GetNewSearchHistory(getHistoryData)
    .then(res=>{
      console.log(res)
      this.setData({
        record: res.data.Data
      })
    })
    if(option.inputValue){
      this.setData({
        searchValue: option.inputValue,
        inputValue: option.inputValue
      })
    }
  },
	/*search text*/
  searchActiveChange: function(e){//跟踪用户在输入框输入的数据
    let val = e.detail.value
    const _this = this
    this.setData({
      searchValue: _this.trim(val),
      inputValue: val
    })
  },
  searchFn: function(e){
    if(e.target.dataset.value){
      this.setData({
        searchValue: e.target.dataset.value,
        inputValue: e.target.dataset.value
      })
    }
    if(this.data.searchValue==""){
      common.showModal( '请输入搜索内容', '提示', function (res) {
        if (res.confirm) {
          return
        }
      })
      return
    }
    var searchData = {
      "data": {
        "openId": openid,
        "searchText": this.data.searchValue 
      }
    }
    // api.post('/lr/s2bapi/CreateSearchHistory',searchData,'application/json')
    CreateSearchHistory(searchData,'application/json')
    .then(res=>{
      console.log(res)
    })
    const _this = this
    wx.navigateTo({
      url: "../categories/categories?searchValue="+_this.data.searchValue+"&inputValue="+_this.data.inputValue
    })
  },
  deleteRecord: function(){
    this.setData({
      record: []
    })
    var deleteHistoryData = {
      "data": openid
    }
    // api.get('/lr/s2bapi/DeleteSearchHistory',deleteHistoryData)
    DeleteSearchHistory(deleteHistoryData)
    .then(res=>{
      console.log(res)
    })
  },
  trim: function(s){
    return s.replace(/(^\s*)|(\s*$)/g, "");
  }
})