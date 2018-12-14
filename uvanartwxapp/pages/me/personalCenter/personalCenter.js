var common = require("../../../utils/common.js");
var api = require("../../../utils/API/request.js");
import Url from "../../../utils/API/url.js";
import { validateuser, AddCustomerFormID} from '../../../utils/API/me/api.js'
const host = Url.host;
const app = getApp()

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({
  data: {
    height:0,
    headimg:"",
    changename:"人脸识别",
    data:"",
    policy:"",       //阿
    keyid:"",        //里
    signature:"",    //直
    urlHost:"",      //传
    dir:"",
    callBackBody:""
  },
  onLoad: function () {
    var bl =16/9,
        _this = this
    var sjheight = wx.getSystemInfoSync().windowWidth/bl
    this.setData({
      height:sjheight
    })
    api.getStorage("sessionid")
      .then(res => {
        _this.setData({ loginstatus: "已登录" });
      })
      .catch(res => {
        _this.setData({ loginstatus: "未登录" });
      })
      this.getdata();
      api.wxlogin()
      .then(res => {
        wx.showLoading({
          title: '请求中...',
        })
        this.signature(res);
      }).catch(res => {
        console.log(res);
        console.log("code获取失败");
      })
  },
   //获取签名
  signature(code){
    let _this = this,
        url ="/uvanoss/get",
        header ="application/json";
    wx.request({
      url: host + url, 
      method:"GET",
      header: {
        'content-type': header, // 默认值
        'code':code
      },
      success (response) {
        let res = response.data
        console.log(res);
        wx.hideLoading()
        if(res.code === 200){
          _this.setData({
            policy:res.data.policy, 
            keyid:res.data.accessid,  
            signature:res.data.signature,  
            urlHost:res.data.host,  
            dir:res.data.dir,
            callBackBody:res.data.callBackBody
          })
        }else{
          wx.showToast({
            title: '获取签名失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(error){
        wx.hideLoading()
        wx.showToast({
          title: '获取签名失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
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
    common.visitorRecordAPI(stayTime_JY,"人脸识别")
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"人脸识别")
  },
  getdata: function(){
    var _this = this
    var data = {data:wx.getStorageSync('openid')},
        header = "application/json";
    validateuser(data, header)
      .then(res => {
        console.log("成功")
        console.log(res)
        if(res.code == 200){
          _this.setData({
            changename:"重新识别",
            data:{"F_OpenID":wx.getStorageSync('openid'),"F_ProgramType":"S2b"},
            headimg: res.data.F_AliyunImageUrl
          })

        }else{
          _this.setData({
            changename:"人脸识别",
            data:{"F_OpenID":wx.getStorageSync('openid'),"F_ProgramType":"S2b"}
          })
        }
      })
      .catch(res => {
        console.log(res)
        console.log("失败")
      })
  },
  //修改头像
  toReset:function(event){
    this.updateimg()
  },
  //地址保存到服务器
  saveImgAddre: function(imgSrc){
    let _this = this,
        url = "/xc/faceimage/addFaceUser",
        data = {
          F_ProgramType:"S2b",
          F_AliyunImageUrl:imgSrc
        },
        header = "application/json",
        token = wx.getStorageSync('token');
    api.post(url,data,header,token).then( response =>{
      let res = response.data
      wx.hideLoading();
      if(res.code === 0){
        wx.showToast({
          title:'上传完成！',
          icon: 'success',
          duration: 1000
        })
        _this.setData({
          headimg:imgSrc
        })
      }else if(res.code === -1){
        wx.showToast({
          title:'系统未知错误',
          icon: 'none',
          duration: 1500
        })
      }else if(res.code === -100){
        wx.showModal({
          title: '提示',
          content:  res.message,
          showCancel:false,
          confirmText:"好的",
          confirmColor:"#424242",
          success: function(res) {
            if (res.confirm) {}
          }
        })
      }
    }).catch( err =>{
      wx.hideLoading();
      console.log(err);
      wx.showToast({
        title: '服务器繁忙！',
        icon: 'none',
        duration: 1500
      })
    })
  },
  //上传图片到阿里
  updateimg: function(){
    if(this.data.policy==""){
      api.wxlogin()
      .then(res => {
        this.signature(res);
      }).catch(res => {
        console.log(res);
        console.log("code获取失败");
      })
    }
    var _this = this,
        data = {
          "policy": this.data.policy,
          "OSSAccessKeyId": this.data.keyid,
          "success_action_status": "200",
          "signature": this.data.signature,
          "key":this.data.dir + "${filename}"+new Date().getTime(),
          'callback': this.data.callBackBody,
        }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        wx.showLoading({
          title: '上传中...',
        })
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url:_this.data.urlHost,
          filePath: tempFilePaths[0],
          formData:data,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          success: function(response) {
            let res =JSON.parse(response.data);
            if(res.code==200){
              console.log("已成功上传到阿里!");
              _this.saveImgAddre(res.info);
            }else{
              wx.hideLoading();
              wx.showToast({
                title: '阿里云服务器异常',
                icon:"none",
                duration: 1500
              })
            }
          },
          fail: function(res){
            console.log(res)
            console.log("错误")
            wx.hideLoading()
            wx.showToast({
              title: '上传失败',
              icon: 'none',
              duration: 1500
            })
            _this.updateimg()
          },
        })
      },
      fail: function(res){
        console.log(res)
        wx.showToast({
          title: '打开相机失败',
          icon:"none",
          duration: 1500
        })
      }
    })
  },
  //预览头像
  showimg: function(){
    console.log(this.data.headimg)
    if(this.data.headimg != ""){
      var _this = this
      wx.previewImage({
        urls: [_this.data.headimg] // 需要预览的图片http链接列表
      })
    }else{
      wx.showToast({
        title: '请先进行人脸验证！',
        icon: 'none',
        duration: 2000
      })
    }
  }
})
