// pages/me/myalbumAndRecycle/myalbumAndRecycle.js
var common = require("../../../utils/common.js");
var api = require("../../../utils/API/request.js");
import {
  validateuser,
  GetUserFile,
  GetPushImage,
  deletes2bimage
} from '../../../utils/API/me/api.js'
const app = getApp()

var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器

var size = 6;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allcheck: false, //全选
    pagesize: 25,
    pagenum: 1,
    checklist: [], //选中图片id
    albumclass: "album",
    recycleclass: 'recycle-unselect',
    videoclass: 'video-unselect',
    albumEdit: false,
    imgnum: 0, //瀑布流3列高度及图片地址
    imgUrlList: [
      [],
      [],
      [],
      []
    ], //相册数组
    imgheight: [0, 0, 0],
    deletenum: 0,
    deleteImages: [
      [],
      [],
      [],
      []
    ], //回收站数组
    deleteheight: [0, 0, 0],
    ishaveimage: true,
    typeid: 0, //接口获取相册（0）还是回收站（1）
    videos: [],
    totalSize: 0,
    showEdit: true,
    percent: 0,
    downloadvideo: true,
    percentcolor: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
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
          _this.getimgdata()
        } else {
          wx.showModal({
            title: '温馨提示',
            showCancel: false,
            confirmText: "好的",
            content: '尊敬的用户，请先进行人脸验证，才会有照片推送哦！',
            success: function(res) {
              console.log('用户点击确定')
              wx.navigateBack({
                delta: 1
              })
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
  downloadvideo(e) {
    wx.authorize({
      scope: "scope.writePhotosAlbum"
    })
    let _this = this
    const downloadTask = wx.downloadFile({
      url: e.currentTarget.dataset.src,
      success: function(res) {
        if (res.statusCode === 200) {
          console.log(res)
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              console.log(res.errMsg)
              _this.setData({
                percenttext: "完成！"
              })
              setTimeout(function() {
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
              setTimeout(function() {
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
        setTimeout(function() {
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
  /**
   * 生命周期函数--监听页面显示
   */
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
  },
  totop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  //选择相册类型时还原数据
  cleardata(typeid) {
    this.setData({
      allcheck: false,
      checklist: [],
      albumEdit: false,
      typeid: typeid,
      pagenum: 1,
      imgnum: 0,
      imgUrlList: [
        [],
        [],
        [],
        []
      ],
      deleteImages: [
        [],
        [],
        [],
        []
      ],
      imgheight: [0, 0, 0],
      deletenum: 0,
      deleteheight: [0, 0, 0]
    })
  },
  toAlbum: function() {
    this.setData({
      showEdit: true
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.cleardata(0)
    this.getimgdata()
    this.classToggle("album");
    //显示我的相册//
  },
  toRecycle: function() {
    this.setData({
      showEdit: true
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.cleardata(1)
    this.getimgdata()
    this.classToggle("recycle");
    //显示我的回收站//
  },
  toVideo: function() {
    this.setData({
      showEdit: false
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // this.cleardata(0)
    // this.getimgdata()
    this.getvideo();
    this.classToggle("video");
    //显示我的相册//
  },
  toedit: function() {
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
  classToggle: function(str) {
    if (str == "album") {
      this.setData({
        albumclass: "album",
        recycleclass: "recycle-unselect",
        videoclass: "video-unselect"
      })
    } else if (str == "recycle") {
      this.setData({
        albumclass: "album-unselect",
        recycleclass: "recycle",
        videoclass: "video-unselect"
      })
    } else {
      this.setData({
        albumclass: "album-unselect",
        recycleclass: "recycle-unselect",
        videoclass: "video"
      })
    }
  },
  //我的相册选择
  checkalbum(e) {
    console.log(e.detail.value)
    for (let i = 1; i < this.data.imgUrlList.length; i++) {
      this.data.imgUrlList[i].forEach(item => {
        item = this.checkitem(e.detail.value, item)
      })
    }
    this.setData({
      allcheck: e.detail.value.length == this.data.imgUrlList[0].length ? true : false,
      checklist: e.detail.value,
      imgUrlList: this.data.imgUrlList
    })
  },
  //回收站
  checkdelete(e) {
    console.log(e.detail.value)
    for (let i = 1; i < this.data.deleteImages.length; i++) {
      this.data.deleteImages[i].forEach(item => {
        item = this.checkitem(e.detail.value, item)
      })
    }
    this.setData({
      allcheck: e.detail.value.length == this.data.deleteImages[0].length ? true : false,
      checklist: e.detail.value,
      deleteImages: this.data.deleteImages
    })
  },
  //检查是否已选中
  checkitem(value, item) {
    item.checked = value.indexOf(item.id) != -1 ? true : false
    return item
  },
  //全选foreach
  checkforeach(data, check) {
    data.forEach(item => {
      item.checked = check
      if (check) this.data.checklist.push(item.id)
    })
    return data
  },
  //全选
  checkboxall(e) {
    if (this.data.albumclass == "album") {
      if (this.data.allcheck) {
        for (let i = 1; i < this.data.imgUrlList.length; i++) {
          this.data.imgUrlList[i] = this.checkforeach(this.data.imgUrlList[i], false)
        }
        this.setData({
          allcheck: false,
          checklist: []
        })
      } else {
        for (let i = 1; i < this.data.imgUrlList.length; i++) {
          this.data.imgUrlList[i] = this.checkforeach(this.data.imgUrlList[i], true)
        }
        this.setData({
          allcheck: true,
          checklist: this.data.checklist
        })
      }
      this.setData({
        imgUrlList: this.data.imgUrlList
      })
    } else {
      if (this.data.allcheck) {
        for (let i = 1; i < this.data.deleteImages.length; i++) {
          this.data.deleteImages[i] = this.checkforeach(this.data.deleteImages[i], false)
        }
        this.setData({
          allcheck: false,
          checklist: []
        })
      } else {
        for (let i = 1; i < this.data.deleteImages.length; i++) {
          this.data.deleteImages[i] = this.checkforeach(this.data.deleteImages[i], true)
        }
        this.setData({
          allcheck: true,
          checklist: this.data.checklist
        })
      }
      this.setData({
        deleteImages: this.data.deleteImages
      })
    }
  },
  getvideo() {
    console.log(size)
    let token = wx.getStorageSync("token")
    let phone = wx.getStorageSync("phone")
    if (size >= this.data.totalSize && this.data.totalSize != 0) {
      size = this.data.totalSize
    }
    let data = {
      "token": token,
      "loginMark": phone,
      "pageNum": 1,
      "pageSize": size
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
            totalSize: res.data.Total
          })
          wx.hideLoading();
          if (size >= this.data.totalSize && this.data.totalSize != 0) {

          } else {
            size += 6
          }

        }
      })
  },
  getimgdata: function() {
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
          _this.setData({
            ischeck: true,
            ishaveimage: false
          })
          wx.hideLoading();
          return
        }
        _this.setData({
          ishaveimage: res.data.ishaveimage
        })
        wx.hideLoading();
        if (_this.data.typeid == 0 && res.data.images.length) {
          console.log("相册")
          res.data.images.forEach(item => {
            _this.data.imgUrlList[0].push(item)
          })
          _this.data.imgUrlList[1].push(_this.data.imgUrlList[0][_this.data.imgnum])
          _this.setData({
            imgUrlList: _this.data.imgUrlList,
            allcheck: false,
            pagenum: _this.data.pagenum + 1,
            imgnum: _this.data.imgnum + 1
          })
          console.log(_this.data.imgUrlList)
        } else if (res.data.images.length) {
          console.log("回收站")
          res.data.images.forEach(item => {
            _this.data.deleteImages[0].push(item)
          })
          _this.data.deleteImages[1].push(_this.data.deleteImages[0][_this.data.deletenum])
          _this.setData({
            deleteImages: _this.data.deleteImages,
            allcheck: false,
            pagenum: _this.data.pagenum + 1,
            deletenum: _this.data.deletenum + 1
          })
        } else {
          wx.showToast({
            title: '没有更多照片',
            icon: 'success',
            duration: 2000
          })
          _this.setData({
            ischeck: true
          })
        }
      })
      .catch(res => {
        wx.hideLoading();
        console.log(res)
        console.log("失败")
      })
  },
  //增加对应列高度
  addheight(height, value) {
    return height + value
  },
  getImg2: function(e) {
    var bl = e.detail.width / e.detail.height
    this.data.deleteheight[e.currentTarget.dataset.item] = this.addheight(this.data.deleteheight[e.currentTarget.dataset.item], e.detail.height)
    let imgsrc = this.data.deleteImages[0][this.data.deletenum]
    if (this.data.deleteImages[0][this.data.deletenum] != undefined) {
      if (this.data.deleteheight[0] <= this.data.deleteheight[1] && this.data.deleteheight[0] <= this.data.deleteheight[2]) {
        this.data.deleteImages[1].push(imgsrc)
      } else if (this.data.deleteheight[1] < this.data.deleteheight[0] && this.data.deleteheight[1] <= this.data.deleteheight[2]) {
        this.data.deleteImages[2].push(imgsrc)
      } else if (this.data.deleteheight[2] < this.data.deleteheight[0] && this.data.deleteheight[2] < this.data.deleteheight[1]) {
        this.data.deleteImages[3].push(imgsrc)
      }
      this.setData({
        deleteImages: this.data.deleteImages,
        deletenum: this.data.deletenum + 1
      })
    }
  },
  getImg: function(e) {
    var bl = e.detail.width / e.detail.height
    this.data.imgheight[e.currentTarget.dataset.item] = this.addheight(this.data.imgheight[e.currentTarget.dataset.item], e.detail.height)
    let imgsrc = this.data.imgUrlList[0][this.data.imgnum]
    if (this.data.imgUrlList[0][this.data.imgnum] != undefined) {
      if (this.data.imgheight[0] <= this.data.imgheight[1] && this.data.imgheight[0] <= this.data.imgheight[2]) {
        this.data.imgUrlList[1].push(imgsrc)
      } else if (this.data.imgheight[1] < this.data.imgheight[0] && this.data.imgheight[1] <= this.data.imgheight[2]) {
        this.data.imgUrlList[2].push(imgsrc)
      } else if (this.data.imgheight[2] < this.data.imgheight[0] && this.data.imgheight[2] < this.data.imgheight[1]) {
        this.data.imgUrlList[3].push(imgsrc)
      }
      this.setData({
        imgUrlList: this.data.imgUrlList,
        imgnum: this.data.imgnum + 1
      })
    }
  },
  showImg: function(e) {
    console.log(e.currentTarget.dataset.src)
    wx.previewImage({
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  /*图片404*/
  imgerror(e) {
    let img = "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/GRBVNcVFTrKGYoUYMl3jrAAAAT1wZDIE"
    if (e.currentTarget.dataset.style == 0) {
      this.data.imgUrlList[e.currentTarget.dataset.item + 1][e.currentTarget.dataset.id].Path = img
    } else {
      this.data.deleteImages[e.currentTarget.dataset.item + 1][e.currentTarget.dataset.id].Path = img
    }
    this.setData({
      imgUrlList: this.data.imgUrlList,
      deleteImages: this.data.deleteImages
    })
  },
  /*删除照片*恢复照片*/
  deleteimg: function(e) {
    if (!this.data.checklist.length) {
      wx.showToast({
        title: '请先选择照片',
        icon: 'success',
        duration: 2000
      })
      return
    }
    console.log(this.data.checklist.length)
    var _this = this,
      data = "",
      header = "application/json",
      url = e.currentTarget.dataset.value == true ? '/lr/xcapi/deletes2bimage' : '/lr/xcapi/restores2bimage'
    data = {
      data: JSON.stringify(this.data.checklist)
    }
    wx.showModal({
      title: '温馨提示',
      confirmText: "是的",
      content: '确定要' + (e.currentTarget.dataset.value == true ? '删除' : '恢复') + '该部分照片吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          deletes2bimage(e.currentTarget.dataset.value, data, header)
            .then(res => {
              console.log("成功")
              console.log(res)
              if (res.code == 200) {
                debugger;
                _this.setData({
                  pagenum: 1,
                  imgnum: 0,
                  deletenum: 0,
                  albumEdit: false,
                  checklist: [],
                  imgUrlList: [
                    [],
                    [],
                    [],
                    []
                  ],
                  deleteImages: [
                    [],
                    [],
                    [],
                    []
                  ]
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
  onPullDownRefresh: function() {
    console.log("下拉刷新")
    this.setData({
      pagenum: 1,
      allcheck: false,
      checklist: [],
      deleteImages: [
        [],
        [],
        [],
        []
      ],
      imgUrlList: [
        [],
        [],
        [],
        []
      ],
      imgnum: 0, //瀑布流3列高度及图片地址
      deletenum: 0,
      imgheight: [0, 0, 0],
      deleteheight: [0, 0, 0]
    })
    wx.showLoading({
      title: '刷新中...',
      mask: true
    })
    this.getimgdata()
    wx.stopPullDownRefresh()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("触底啦 老铁")
    if (this.data.videoclass == "video" && size >= this.data.totalSize && this.data.totalSize != 0) {
      wx.showToast({
        title: '没有更多视频',
        icon: 'success',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    if (this.data.videoclass == "video") {
      this.getvideo()
    } else {
      this.getimgdata()
    }

  },
})