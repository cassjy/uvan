// pages/me/myalbumAndRecycle/myalbumAndRecycle.js
var common = require("../../../utils/common.js");
var api = require("../../../utils/API/request.js");
import Url from "../../../utils/API/url.js";
import {
  validateuser,
  GetUserFile,
  GetPushImage,
  deletes2bimage
} from '../../../utils/API/me/api.js'
const app = getApp();
const host = Url.host;
var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器

Page({
  data: {
    videoSrc:"",  //视频播放地址
    videoshow:false, //控制视频播放控件
    percent: 0,       //视频下载进度
    percentcolor: "", //视频下载进度条颜色
    downloadvideo: true, //视频下载进度条
    albumEdit: false, //编辑模式
    checklist: [], //选中图片id
    allcheck: false, //全选
    images:[],       //相册
    deletephoto:[],  //回收站
    videos:[],    //视频
    ishaveimage:false, //是否有照片
    typeid: 0, //接口获取相册（0）还是回收站（1）
    pagesize: 15,
    videosize:6,
    videoTotalSize:0,
    pagenum: 1,
    headimg:"", //头像
    F_Name:"",  //姓名
    type: "photo",
    policy: "",       //阿
    keyid: "",        //里
    signature: "",    //直
    urlHost: "",      //传
    dir: "",
    callBackBody: ""
  },
  onLoad: function (options) {
    this.wxlogin();
    var _this = this,
      data = {
        data: wx.getStorageSync('openid')
      },
      header = "application/json";
    validateuser(data, header)
      .then(res => {
        console.log("成功")
        console.log(res)
        if (res.code == 200) {
          _this.setData({
            headimg: res.data.F_AliyunImageUrl,
            F_Name: res.data.F_Name
          })
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          _this.getimgdata();
        } else {
          wx.showModal({
            title: '温馨提示',
            showCancel: false,
            confirmText: "好的",
            content: '尊敬的用户，请先进行人脸验证，才会有照片推送哦！',
            success: function (res) {
            }
          })
          return
        }
      })
      .catch(res => {
        console.log(res)
        console.log("失败")
      })
  },
  //获取头像及照片
  getimgdata: function () {
    var _this = this,
      data = {
        "token": '',
        "loginMark": '',
        "data": {
          "openid": wx.getStorageSync('openid'),
          "page": this.data.pagenum,
          "limit": this.data.pagesize,
          "imageType": this.data.typeid
        }
      },
      header = "application/json";
    GetPushImage(data, header)
      .then(res => {
        console.log(res)
        if (res.code == 400) {
          wx.showToast({
            title: '没有更多照片',
            icon: 'success',
            duration: 2000
          })
        }else if (_this.data.typeid == 0 && res.data.images.length) {
          console.log("相册")
          _this.setData({
            images: _this.data.images.concat(res.data.images),
            pagenum: this.data.pagenum + 1,
            allcheck:false    
          })
          console.log(_this.data.images)
        } else if (res.data.images.length) {
          console.log("回收站")
          _this.setData({
            deletephoto: _this.data.deletephoto.concat(res.data.images),
            pagenum: this.data.pagenum + 1,
            allcheck: false
          })
          console.log(_this.data.deletephoto)
        } else {
          wx.showToast({
            title: '没有更多照片',
            icon: 'success',
            duration: 2000
          })
        }

        _this.setData({
          ishaveimage: res.data.ishaveimage
        })
        wx.hideLoading();
      })
      .catch(res => {
        wx.hideLoading();
        console.log(res)
        console.log("失败")
      })
  },
  /*图片404*/
  imgerror(e) {
    let img = "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/GRBVNcVFTrKGYoUYMl3jrAAAAT1wZDIE"
    if (this.data.typeid == 0) {
      this.data.images[e.currentTarget.dataset.id].Path = img
    } else {
      this.data.deletephoto[e.currentTarget.dataset.id].Path = img
    }
    this.setData({
      images: this.data.images,
      deletephoto: this.data.deletephoto
    })
  },
  //获取微信code
  wxlogin(){
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
  signature(code) {
    let _this = this,
      url = "/uvanoss/get",
      header = "application/json";
    wx.request({
      url: host + url,
      method: "GET",
      header: {
        'content-type': header, // 默认值
        'code': code
      },
      success(response) {
        let res = response.data
        console.log(res);
        if (res.code === 200) {
          _this.setData({
            policy: res.data.policy,
            keyid: res.data.accessid,
            signature: res.data.signature,
            urlHost: res.data.host,
            dir: res.data.dir,
            callBackBody: res.data.callBackBody
          })
        } else {
          wx.showToast({
            title: '获取签名失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(error) {
        wx.hideLoading()
        wx.showToast({
          title: '获取签名失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  S4() {
    return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);   
  },
  //生成GUID
  NewGuid() {
    return (this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4());
  },
  //上传图片到阿里
  updateimg: function () {
    if (this.data.policy == "") {
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
        "key": this.data.dir + this.NewGuid(),
        'callback': this.data.callBackBody,
      }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中...',
        })
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: _this.data.urlHost,
          filePath: tempFilePaths[0],
          formData: data,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          success: function (response) {
            let res = JSON.parse(response.data);
            if (res.code == 200) {
              console.log("已成功上传到阿里!");
              _this.saveImgAddre(res.info);
            } else {
              wx.hideLoading();
              wx.showToast({
                title: '阿里云服务器异常',
                icon: "none",
                duration: 1500
              })
            }
          },
          fail: function (res) {
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
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '打开相机失败',
          icon: "none",
          duration: 1500
        })
      }
    })
  },
  //地址保存到服务器
  saveImgAddre: function (imgSrc) {
    let _this = this,
      url = "/xc/faceimage/addFaceUser",
      data = {
        F_ProgramType: "S2b",
        F_AliyunImageUrl: imgSrc
      },
      header = "application/json",
      token = wx.getStorageSync('token');
    api.post(url, data, header, token).then(response => {
      let res = response.data
      wx.hideLoading();
      if (res.code === 0) {
        wx.showToast({
          title: '上传完成！',
          icon: 'success',
          duration: 1000
        })
        _this.setData({
          headimg: imgSrc
        })
        
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        _this.setData({
          pagenum: 1,
          images: [],
          deletephoto: [],
          videos: []
        })
        if (_this.data.typeid == 0 || _this.data.typeid == 1) {
          _this.getimgdata();
        } else {
          _this.getvideo()
        }
      } else if (res.code === -1) {
        wx.showToast({
          title: '系统未知错误',
          icon: 'none',
          duration: 1500
        })
      } else if (res.code === -100) {
        wx.showModal({
          title: '提示',
          content: res.message,
          showCancel: false,
          confirmText: "好的",
          confirmColor: "#424242",
          success: function (res) {
            if (res.confirm) { }
          }
        })
      }
    }).catch(err => {
      wx.hideLoading();
      console.log(err);
      wx.showToast({
        title: '服务器繁忙！',
        icon: 'none',
        duration: 1500
      })
    })
  },
  //获取视频
  getvideo() {
    let token = wx.getStorageSync("token")
    let phone = wx.getStorageSync("phone")
    if (this.data.videosize >= this.data.videoTotalSize && this.data.videoTotalSize != 0) {
      this.data.videosize = this.data.videoTotalSize
    }
    let data = {
      "token": token,
      "loginMark": phone,
      "pageNum": this.data.pagenum,
      "pageSize": this.data.videosize
    }
    GetUserFile(data)
      .then(res => {
        console.log(res)
        if (res.code == 400 && res.info == "访问受限") {
          wx.showToast({
            title: '请勿频繁加载',
            icon: 'none',
            duration: 2000
          })
          wx.hideLoading();
          return
        } else if (res.code == 400) {
          wx.showToast({
            title: '没有更多视频',
            icon: 'success',
            duration: 2000
          })
          wx.hideLoading();
          return
        }
        if (res.code == 200) {
          console.log(res.data)
          this.setData({
            videos: res.data.Data,
            videoTotalSize: res.data.Total
          })
          wx.hideLoading();
          if (size >= this.data.videoTotalSize && this.data.videoTotalSize != 0) {

          } else {
            size += 6
          }

        }
      })
  },
  //切换相册
  changetype(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.setData({
      typeid:e.currentTarget.dataset.id,
      pagenum:1,
      images: [],
      deletephoto: [],
      videos: [],
      allcheck:false,
      checklist:[],
      albumEdit: false
    })
    if (e.currentTarget.dataset.id == 0 || e.currentTarget.dataset.id == 1) {
      this.getimgdata();
    }else{
      this.getvideo()
    }
  },
  headmsg: function (event) {
    let that = this
    wx.showActionSheet({
      itemList: this.data.headimg?['上传头像','查看头像'] : [ '上传头像'],
      itemColor: "#5e5e5e",
      success: function (e) {
        //判断用户点击的是相册还是拍照
        if (e.tapIndex === 0) {
          that.updateimg();
        } else if (e.tapIndex === 1) {
          that.showHead()
        } else {
          return;
        }
      }
    })
  },
  //查看图片
  showImg: function (e) {
    console.log(e.currentTarget.dataset.src)
    let list = (this.data.typeid == 0 ? this.data.images : this.data.deletephoto),
      showList = [];
    list.forEach(item => {
      showList.push(item.Path + '?x-oss-process=style/uvanfull')
    })
    wx.previewImage({
      current: e.currentTarget.dataset.src + '?x-oss-process=style/uvanfull', // 当前显示图片的http链接
      urls: showList// 需要预览的图片http链接列表
    })
  },
  //查看头像
  showHead: function () {
    wx.previewImage({
      urls: [this.data.headimg]// 需要预览的图片http链接列表
    })
  },
  //上拉触底
  reachBottom: function () {
    console.log("触底啦 老铁")
    if (this.data.typeid == 2 && this.data.videosize >= this.data.totalSize && this.data.totalSize != 0) {
      wx.showToast({
        title: '没有更多视频',
        icon: 'success',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.setData({loading:true});
    if (this.data.typeid == 2) {
      this.getvideo()
    } else {
      this.getimgdata()
    }

  },
  //编辑模式
  toedit: function () {
    if (this.data.albumEdit) {
      this.setData({
        albumEdit: false,
      })
    } else {
      this.setData({
        albumEdit: true
      })
    }
  },
  //取消编辑模式
  cancelEdit() {
    if (this.data.typeid == "0") {
      this.setData({
        images: this.checkforeach(this.data.images, false)
      })
    } else {
      this.setData({
        deletephoto: this.checkforeach(this.data.deletephoto, false)
      })
    }
    this.setData({
      albumEdit: false,
      checkitem:[],
      allcheck:false
    })
  },
  //删除/恢复图片
  deleteimg(e) {
    if (!this.data.checklist.length) {
      wx.showToast({
        title: '请先选择照片',
        icon: 'success',
        duration: 1500
      })
      return
    }
    var _this = this,
      data = "",
      header = "application/json",
      url = e.currentTarget.dataset.value == true ? '/lr/xcapi/deletes2bimage' : '/lr/xcapi/restores2bimage';
    data = {
      data: JSON.stringify(this.data.checklist)
    }
    wx.showModal({
      title: '温馨提示',
      confirmText: "是的",
      content: '确定要' + (e.currentTarget.dataset.value == true ? '删除' : '恢复') + '该部分照片吗？',
      success: function (res) {
        if (res.confirm) {
          deletes2bimage(e.currentTarget.dataset.value, data, header)
            .then(res => {
              console.log(res)
              if (res.code == 200) {
                _this.setData({
                  pagenum: 1,
                  albumEdit: false,
                  checklist: [],
                  allcheck: false,
                  images: [],
                  deletephoto: []
                })
                _this.getimgdata()
                wx.showToast({
                  title: e.currentTarget.dataset.value == true ? '删除成功' : '恢复成功',
                  icon: 'success',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: e.currentTarget.dataset.value == true ? '删除失败' : '恢复失败',
                  icon: 'loading',
                  duration: 2000
                })
              }
            })
            .catch(res => {
              console.log(res)
              console.log("失败")
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //选择图片
  checkalbum(e) {
    console.log(e.detail.value)
    if(this.data.typeid == "0"){
      this.data.images.forEach(item => {
        item = this.checkitem(e.detail.value, item)
      })
      this.setData({
        allcheck: e.detail.value.length == this.data.images.length ? true : false,
        checklist: e.detail.value,
        images: this.data.images
      })
    }else{
      this.data.deletephoto.forEach(item => {
        item = this.checkitem(e.detail.value, item)
      })
      this.setData({
        allcheck: e.detail.value.length == this.data.deletephoto.length ? true : false,
        checklist: e.detail.value,
        deletephoto: this.data.deletephoto
      })
    }
  },
  //检查是否已选中
  checkitem(value, item) {
    item.checked = value.indexOf(item.id) != -1 ? true : false;
    return item;
  },
  //全选
  checkboxall(e) {
    if (this.data.typeid == "0") {
      this.setData({
        allcheck: !this.data.allcheck,
        images: this.checkforeach(this.data.images, !this.data.allcheck),
        checklist: this.data.allcheck ? []:this.data.checklist,
      })
    } else if (this.data.typeid == "1"){
      this.setData({
        allcheck: !this.data.allcheck,
        deletephoto: this.checkforeach(this.data.deletephoto, !this.data.allcheck),
        checklist: this.data.allcheck ? [] : this.data.checklist,
      })
    }
  },
  //全选foreach
  checkforeach(data, check) {
    data.forEach(item => {
      item.checked = check
      if (check) this.data.checklist.push(item.id)
    })
    return data
  },
  //视频下载
  downloadvideo(e) {
    wx.authorize({
      scope: "scope.writePhotosAlbum"
    })
    let _this = this
    const downloadTask = wx.downloadFile({
      url: e.currentTarget.dataset.src,
      success: function (res) {
        if (res.statusCode === 200) {
          console.log(res)
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              console.log(res.errMsg)
              _this.setData({
                percenttext: "完成！"
              })
              setTimeout(function () {
                _this.setData({
                  percent: 0,
                  downloadvideo: true
                })
              }, 400);
            },
            fail(error) {
              console.log(error)
              _this.setData({
                percenttext: "保存失败！",
                percentcolor: "#c82829"
              })
              setTimeout(function () {
                _this.setData({
                  percent: 0,
                  downloadvideo: true,
                })
              }, 2000);
            }
          })
        }
      },
      fail(error) {
        console.log(error)
        _this.setData({
          percenttext: "下载失败！",
          percent: 100,
          downloadvideo: false,
          percentcolor: "#c82829"
        })
        setTimeout(function () {
          _this.setData({
            percent: 0,
            downloadvideo: true
          })
        }, 2000);
      }
    })
    downloadTask.onProgressUpdate((res) => {
      /* console.log('下载进度', res.progress)
       console.log('已经下载的数据长度', res.totalBytesWritten)
       console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)*/
      _this.setData({
        percent: res.progress,
        percenttext: "下载中",
        downloadvideo: false,
        percentcolor: ""
      })
    })

  },
  //显示视频播放器
  showvideo(e) {
    this.setData({
      videoSrc: e.currentTarget.dataset.src,
      videoshow:true
    })
  },
  closevideo() {
    this.setData({
      videoSrc: "",
      videoshow: false
    })
  },
  //检查滚动位置置顶导航标题
  checkscroll(e) {
    // console.log(e.detail.scrollTop);
    this.setData({
      titleTop: (e.detail.scrollTop >= 120 ? "title-top" : "")
    })
  },
  scrolltotop(){
    this.setData({
      titleTop: ""
    })
  },
  onShow: function() {
    //开始计时（停留时间）
    stayTime_JY = 0 //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
  },
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "优梵相册")
  },
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "优梵相册")
  }
})