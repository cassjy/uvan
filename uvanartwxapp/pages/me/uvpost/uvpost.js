var common = require("../../../utils/common.js");
var api = require("../../../utils/API/request.js");
import {
  InvitedQrCode,
  GetVanPostList,
  OperationPoint
} from '../../../utils/API/me/api.js'

var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器


Page({
	data:{
    list: [],//方案列表
    saveImgs:[],//需要保存的图片
    didnotAccredit: false,//相册是否未授权
    authorizationNotExist: false,//相册授权选项是否存在
    gotoPoster: true,//控制下载图片的用途
    gotoPhone: true,
    cansavePic: true,
    cantoPoster: true,
    id:'',
    type:'',
    scrollHeight: wx.getSystemInfoSync().windowHeight*2,
    page: 1,
    total: 0,
    showLoading: false,
    canGetMore: true
	},
	onLoad(){
    console.log(this.data.scrollHeight)
    let _this = this
    wx.getSetting({
      success: function(res){
        console.log(res.authSetting['scope.writePhotosAlbum'])

        if(res.authSetting['scope.writePhotosAlbum']!=null&&res.authSetting['scope.writePhotosAlbum']){
          console.log('已授权')
          
          _this.setData({
            authorizationNotExist: false,
            didnotAccredit: false
          })
        }else if(res.authSetting['scope.writePhotosAlbum']!=null&&!res.authSetting['scope.writePhotosAlbum']){
          console.log("未授权")
         
          _this.setData({
            authorizationNotExist: false,
            didnotAccredit: true
          })
        }
      }
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getList()
	},
	onShow(){
		//开始计时（停留时间）
    stayTime_JY = 0 //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
	},
	/**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, '优梵海报')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, '优梵海报')
  },
  //加载列表
  getList(){
    let data = {
      "page": this.data.page,
      "limit": 5
    }
    let page = this.data.page
    GetVanPostList(data)
    .then(res=>{
      if(res.code==200){
        page++
        let list = this.data.list
        list = list.concat(res.data.Data)
        this.setData({
          list: list,
          page: page,
          total: res.data.Total,
          canGetMore: true,
          showLoading: false
        })
        wx.hideLoading()
      }else if(res.code==400){
        this.setData({
          canGetMore: true,
          showLoading: false
        })
        wx.showToast({
          title: '没有更多',
          icon: 'success',
          duration: 2000
        })
      }else{
        this.setData({
          canGetMore: true,
          showLoading: false
        })
        wx.hideLoading()
        wx.showToast({
          title: '请稍后再试',
          icon: 'none',
          duration: 2000
        })
      }
    })
    .catch(err=>{
      wx.hideLoading()
    })
  },
  //上拉加载
  getMoreList(){
    if(this.data.page*5-this.data.total>=5){
      return
    }
    if(!this.data.canGetMore){
      return
    }
    this.setData({
      canGetMore: false,
      showLoading: true
    })
    this.getList()
  },
  chooseIMG(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.navigateTo({
          url: `./cut/cut?imglist=${tempFilePaths}`
        })
      }
    })
  },
  //一键保存所有图片（流程包括 下载图片-保存图片）
  saveAllPic(e){
    if(!e.currentTarget.dataset.urls){
      wx.showToast({
        title: '当前素材没有图片',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!this.data.cansavePic){
      //防止多次点击
      return
    }
    this.setData({
      type: e.currentTarget.dataset.type,
      id: e.currentTarget.dataset.id,
      cansavePic: false,
      gotoPoster: false,
      gotoPhone: true
    })
    let saveImgs = []
    let saveImgsExist = false
    wx.showLoading({
      title: '正在保存',
    })
    //查缓存，下载过的就不再次下载了
    let imglistStorage = wx.getStorageSync('imglistStorage')
    for(let i = 0; i < imglistStorage.length; i++){
      if(imglistStorage[i].id==this.data.id){
        saveImgs = imglistStorage[i].saveImgs
        saveImgsExist = true
        //开始保存图片
        this.saveToPhone(saveImgs)
        break;
      }
    }
    //未下载过的（缓存没有）先下载再保存,回调下载
    if(!saveImgsExist){
      let imgs = e.currentTarget.dataset.urls
      this.downloadImg(imgs,0,saveImgs)
    }
    
  },
  downloadImg(imgs,index,saveImgs){
    let _this = this
    wx.downloadFile({
      url: imgs[index],
      success(res){
        if(res.statusCode === 200){
          saveImgs.push(res.tempFilePath)
          let i = index+1
          if(imgs.length==i){
            //下载完成，保存在缓存
            let imglistStorage = wx.getStorageSync('imglistStorage') || []
            let saveImgsJSON = {
              "id": _this.data.id,
              "saveImgs": saveImgs
            }
            imglistStorage.push(saveImgsJSON)
            wx.setStorageSync('imglistStorage',imglistStorage)
            if(_this.data.gotoPoster){
              //添加二维码的选项跳去poster页面
              _this.behavior()
              _this.setData({
                cantoPoster: true
              })
              wx.hideLoading()
              wx.navigateTo({
                url: `./poster/poster?imglist=${saveImgs}&id=${_this.data.id}`
              })
            }else{
              //开始保存图片
              _this.saveToPhone(saveImgs)
            }
            
            return
          } 
          _this.downloadImg(imgs,i,saveImgs)
        }
      },
      fail(err){
        _this.setData({
          cansavePic: true,
          cantoPoster: true
        })
        wx.hideLoading()
        wx.showToast({
          title: '请稍后再试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  saveToPhone(saveImgs){
    let _this = this
    if(!this.data.authorizationNotExist&&this.data.didnotAccredit){
      this.setData({
        cansavePic: true
      })
      wx.hideLoading()
      wx.showModal({
        title: '用户未授权',
        content: '如需正常使用保存到相册功能，请按确定并在授权管理中开启对应的功能授权，即可正常使用。',
        success (res) {
          if (res.confirm) {
            wx.openSetting({
              success: (res)=>{
                if(res.authSetting['scope.writePhotosAlbum']===true){
                  console.log('已授权')
                  
                  _this.setData({
                    authorizationNotExist: false,
                    didnotAccredit: false
                  })
                }
              }
            })
          } else if (res.cancel) {
            
          }
        }
      })
    }else{
      // for(let i = 0; i < saveImgs.length; i++){
        wx.saveImageToPhotosAlbum({
          filePath: saveImgs[0],
          success: (res)=>{
            //需要保存多张
            if(saveImgs.length==1){
              //如果只有一张图
              _this.behavior()
              _this.setData({
                cansavePic: true
              })
              _this.behavior()
              wx.hideLoading()
              wx.showToast({
                title: '已保存到本地相册',
                icon: 'none',
                duration: 2000
              }) 
              return
            }
            _this.saveMorePic(saveImgs,1)
          },
          fail: (err)=>{
            _this.setData({
              cansavePic: true
            })
            wx.hideLoading()
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000
            })
            wx.getSetting({
              success: function(res1){
                console.log(res1)
                if (!res1.authSetting['scope.writePhotosAlbum']){
                  _this.setData({
                    authorizationNotExist: false,
                    didnotAccredit: true
                  })
                }
              }
            })
          }
        })
      // }
    }
  },
  saveMorePic(saveImgs,index){
    let _this = this
    wx.saveImageToPhotosAlbum({
      filePath: saveImgs[index],
      success: (res)=>{
        let i = index+1
        if(i == saveImgs.length){
          //保存完所有
          _this.setData({
            cansavePic: true
          })
          _this.behavior()
          wx.hideLoading()
          wx.showToast({
            title: '已保存到本地相册',
            icon: 'none',
            duration: 2000
          }) 
          return
        }
        _this.saveMorePic(saveImgs,i)
      },
      fail: (err)=>{
        _this.setData({
          cansavePic: true
        })
        wx.hideLoading()
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        })
        wx.getSetting({
          success: function(res1){
            console.log(res1)
            if (!res1.authSetting['scope.writePhotosAlbum']){
              _this.setData({
                authorizationNotExist: false,
                didnotAccredit: true
              })
            }
          }
        })
      }
    })
  },
  //添加二维码，原海报流程
  toPoster(e){
    if(!e.currentTarget.dataset.urls){
      wx.showToast({
        title: '当前素材没有图片',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!this.data.cantoPoster){
      //防止多次点击
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    //同样需要下载后再进行后续操作
    this.setData({
      type: e.currentTarget.dataset.type,
      id: e.currentTarget.dataset.id,
      cantoPoster: false,
      gotoPoster: true,
      gotoPhone: false
    })
    let saveImgs = []
    let saveImgsExist = false
    //查缓存，下载过的就不再次下载了
    let imglistStorage = wx.getStorageSync('imglistStorage')
    for(let i = 0; i < imglistStorage.length; i++){
      if(imglistStorage[i].id==this.data.id){
        saveImgs = imglistStorage[i].saveImgs
        saveImgsExist = true
        //添加二维码的选项跳去poster页面
        this.behavior()
        this.setData({
          cantoPoster: true
        })
        wx.hideLoading()
        wx.navigateTo({
          url: `./poster/poster?imglist=${saveImgs}&id=${this.data.id}`
        })
        break;
      }
    }
    //先下载再保存,回调下载
    if(!saveImgsExist){
      let imgs = e.currentTarget.dataset.urls
      this.downloadImg(imgs,0,saveImgs)
    }
  },
  //复制文本
  copyText(e){
    let _this = this
    this.setData({
      id: e.currentTarget.dataset.id,
      type: e.currentTarget.dataset.type
    })
    let content = e.currentTarget.dataset.content
    wx.setClipboardData({
      data: content,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res)
            _this.behavior()
          }
        })
      }
    })
  },
  //预览图片
  previewImg(e){
    var _this = this;
    wx.previewImage({
      current: e.target.dataset.src,
      urls: e.target.dataset.urls
    })
  },
  /**用户行为分析
    埋点类型
    copywriting(文案复制)，
    onesave(一键保存),
    onetcsave(一键保存二维码),
    addtc(添加二维码次数)
  */
  behavior(){
    let data = {
      "id": this.data.id,
      "type": this.data.type
    }
    OperationPoint(data)
    .then(res=>{

    })
  },
  //显示全部
  showAll(e){
    let list = this.data.list
    let aindex = e.currentTarget.dataset.aindex
    let index = e.currentTarget.dataset.index
    console.log(list)
    list[aindex].contextlist[index].packup = false
    this.setData({
      list
    })
  },
  //收起部分
  hideSome(e){
    let list = this.data.list
    let aindex = e.currentTarget.dataset.aindex
    let index = e.currentTarget.dataset.index
    console.log(list)
    list[aindex].contextlist[index].packup = true
    this.setData({
      list
    })
  },
})