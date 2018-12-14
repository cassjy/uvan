// pages/me/customerapply/customerapply.js
var api = require('../../../utils/API/request.js')
var common = require("../../../utils/common.js")
const Url = require('../../../utils/API/url.js')
import { get_lastestauthrecord, upload_dandelionproof } from '../../../utils/API/me/api.js'
var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:"未上传",
    picList:'',
    photoList:''
    
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

    var _this = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    var phone = wx.getStorageSync("phone");
    var token = wx.getStorageSync("token");
    var data={
      "token":token,
      "loginMark":phone,
      "data":""
    }
    get_lastestauthrecord(data)
    .then(res=>{
        console.log(res);
        wx.hideLoading();
        if (res.data.hasrecord){
          debugger;
          switch (res.data.record.F_status){
            case 0:
              _this.setData({ status: "未审核", photoList: res.data.record.F_authpic})
              break;
            case 1:
              _this.setData({ status: "已拒绝" })
            break;
            case 2:
              _this.setData({ status: "审核通过", photoList: res.data.record.F_authpic})
            break;
          }
        }else{            
          _this.setData({ status:"未上传"})
        }
    })
  },
  onHide: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"上传凭证")
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"上传凭证")
  },
  upload:function(){
    debugger;
    var _this = this;
    if(this.data.status =="未上传" || this.data.status == "已拒绝"){
      wx.showActionSheet({
        itemList: ['从相册里面选取', '拍照'],
        success: function (e) {
          if (e.tapIndex == 0) {
            var photoType = 'album';
          } else if (e.tapIndex == 1) {
            var photoType = 'camera';
          }
          wx.chooseImage({
            count: 1,
            sizeType: ['original ', 'compressed'],
            sourceType: [photoType],
            success: function (res) {
              console.log(res)
              _this.setData({
                picList: (res.tempFilePaths).toString()
              })
              // 执行上传图片接口
              _this.aLiUpload((res.tempFilePaths).toString());
              console.log(_this.data.picList)
            }
          })

        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })

    } else if (this.data.status == "未审核"){
        wx.showModal({
          title: '提示',
          content: '亲，您的申请还在审核中',
        })
    } else if(this.data.status == "审核通过"){
      wx.showModal({
        title: '提示',
        content: '亲，您的申请已经审核通过',
      })
    }
  },
  // 上传图片到阿里服务器
  aLiUpload: function (path) {
    this.setData({
      ban: true
    })
    var _this = this;
    let PhotoUrl = Url.host + "/lr/s2bapi/uploadimage"
    wx.showLoading({
      title: '上传图片中...',
    })
    console.log(path)
    wx.uploadFile({
      url: PhotoUrl,
      filePath: path,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        "formType": 'S2b',
        "imageType": '客户审核',
        "image": '',
        "token": wx.getStorageSync('token'),
        "loginmark": wx.getStorageSync('phone')
      },
      success: function (res) {
        debugger
        var res = JSON.parse(res.data);
        if(res.code ==200){
          console.log('图片上传成功')
          wx.hideLoading();
          debugger
          console.log(res.data.F_ImageUrl);

          _this.setData({
            photoList: res.data.F_ImageUrl
          })
          

          console.log(_this.data.photoList)
          _this.setData({
            ban: false
          })
        }
        else{
          wx.showModal({
            title: '错误',
            content: res.info
          })
        }
      },
      fail: function (res) {
        console.log('图片上传失败')
        console.log(res)
        wx.showToast({
          title: '上传失败',
        })
        _this.setData({
          ban: false
        })
      }
    })
  },
  submit:function(){
    if (this.data.status == "未上传" || this.data.status == "已拒绝") {
    var  data={
      "token": wx.getStorageSync('token'),
      "loginmark": wx.getStorageSync('phone'),
      "data": {"F_authpic":this.data.photoList}
    }
   upload_dandelionproof(data)
    .then(res=>{
        if(res.code == 200){
          wx.switchTab({
            url: '/pages/me/me'
          });
        }
    })
    } else if (this.data.status == "未审核") {
      wx.showModal({
        title: '提示',
        content: '亲，您的申请还在审核中',
      })
    } else if (this.data.status == "审核通过") {
      wx.showModal({
        title: '提示',
        content: '亲，您的申请已经审核通过',
      })
    }
  }
})