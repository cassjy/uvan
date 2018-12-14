var api = require("../../../../utils/API/request.js")
var common = require("../../../../utils/common.js");
import {
  InvitedQrCode,
  OperationPoint
} from '../../../../utils/API/me/api.js'

var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器

var unit 
var posterList = []
Page({
	data:{
		imgUrls:['','','','','','','','',''],
    nowIndex: 0,
    posterList: [],
    didnotAccredit: false,//相册是否未授权
    authorizationNotExist: false,//相册授权选项是否存在
    savedTip: false,
    logoImg: '',
    loading: true,
    qrcodeimg: '',
    canSave: true,
    downLoading: true,
    id: '',
    type: 'onetcsave'
	},
  onShow:function(){

    stayTime_JY = 0 //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)

  },
  onHide: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "优梵海报")
    posterList = []
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "优梵海报")
    posterList = []
  },
	onLoad: function(option){
    if(option.id){
      this.setData({
        id: option.id
      })
    }
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

    console.log(option.imglist.split(','))
    this.setData({
      imgUrls: option.imglist.split(',')
    })
    console.log('this.data.imgUrls*****************************************************')
    // let _this = this
    wx.getSystemInfo({
      success: res => {
        _this.setData({
          screenWidth: res.screenWidth
        })
        console.log(_this.data.screenWidth)
        wx.downloadFile({
          url: 'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/730197be988448f18b28078f306b912b', 
          success: function(res1) {
            console.log('downloadlogo 成功++++++++++++++++++++++++++++++++++++++++++++++++++')
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res1.statusCode === 200) {
              _this.setData({
                logoImg: res1.tempFilePath
              })
              _this.createQRcode()
            }
          }
        })
      }
    })
    wx.showLoading({
      title: '加载中...',
    })

    
	},
  //生成二维码
  createQRcode: function(){
    let _this = this
    let nickname = wx.getStorageSync('userName') || " "
    let openid = wx.getStorageSync('openid')
    let invitationID = common.uuid()
    let phone = wx.getStorageSync('phone')
    let token = wx.getStorageSync('token')
    let qrcodeimg = wx.getStorageSync('qrcodeimg') || ""
    if(qrcodeimg==""){
      wx.getUserInfo({
        success: function(res) {
          console.log(res)
          nickname = res.userInfo.nickName
          common.commonShare('首页', nickname, openid, '', invitationID, 'pages/home/home')
        },
        fail: function(err) {
          console.log(err)
          common.commonShare('首页', nickname, openid, '', invitationID, 'pages/home/home')
        }
      })
      let qrcodedata = {
        "token": token,
        "loginMark": phone,
        "data": {
          "F_ID": invitationID,
          "F_PageUrl": "pages/home/home",
          "F_QrCodeName": "首页",
          "F_QRCodeSource": "com"
        }
      }
      let header = 'application/json'
      InvitedQrCode(qrcodedata, header)
      .then(res=>{
        if(res.code == 200){
          this.setData({
            qrcodeimg: res.info
          })
          wx.downloadFile({
            url: res.info,
            // url: 'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/9v4cob2sTl2biZmqkxvf0wAAAT1wZDIE',
            success: function(res1){
              debugger
              if (res1.statusCode === 200){
                
                console.log(res1.tempFilePath)
                console.log('res1.tempFilePath++++++++++++++++++++++++++++++++++++++++++++')
                wx.setStorageSync('qrcodeimg',_this.data.qrcodeimg)
                _this.createImg(0,res1.tempFilePath)
                debugger
              }else{
                wx.showToast({
                  title: '请稍后再试。',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: '请稍后再试',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else{
      wx.downloadFile({
        url: qrcodeimg,
        // url: 'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/9v4cob2sTl2biZmqkxvf0wAAAT1wZDIE',
        success: function(res1){
          debugger
          if (res1.statusCode === 200){
            
            console.log(res1.tempFilePath)
            console.log('res1.tempFilePath++++++++++++++++++++++++++++++++++++++++++++')
            _this.createImg(0,res1.tempFilePath)
            debugger
          }else{
            wx.showToast({
              title: '请稍后再试。',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
    
  },
  //生成海报
  createImg: function(i,qrcode){
    console.log(qrcode)
    console.log('qrcode-----------------------------------------------')
    debugger
    if(i==this.data.imgUrls.length){
      console.log("结束。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。")
      this.setData({
        loading: false,
        downLoading: false
      })
      wx.hideLoading()
      return
    }
    let _this = this
    unit = this.data.screenWidth / 375
    let path_Logo = this.data.logoImg
    let path_Img = this.data.imgUrls[i]
    let path_QRcode = qrcode
    let context = wx.createCanvasContext('share'+i)
    let row = []
    let temp = ''
    let chr = '识别图中二维码有惊喜'
    // context.fillStyle = '#fff'
    context.setFillStyle('white')
    context.fillRect(0, 0, unit * 280, unit * 500)
    context.drawImage(path_Logo, unit * 112, unit * 6, unit * 64, unit * 16 )//绘画优梵艺术Logo
    context.drawImage(path_Img, unit * 10, unit * 30 , unit * 255, unit * 365)//绘画用户的图片
    context.drawImage(path_QRcode, unit * 200, unit * 410 , unit * 60, unit * 60)//绘画二维码
    context.setFontSize(14)//文字属性
    context.setFillStyle("#666666")
    // row.push(temp); 
    context.fillText(chr, unit * 10, unit * 425);//绘画文字
    // for (var b = 0; b < row.length; b++) {
    //   context.fillText(row[b], unit * 15, unit * 445+ ( b * 20 ));
    // }
    console.log('绘制前------------------------------')
    context.draw(false, function (e) {
      console.log("绘制了一张111111111111111111111111111")
      _this.downloadPoster(i,qrcode)
    });

  },
  //切换图片
  changePoster: function(e){
    this.setData({
      nowIndex: e.detail.current
    })
  },
  //下载海报
  downloadPoster: function(i,qrcode){
    console.log(qrcode)
    console.log('qrcode/////////////////////////////////////////')
    debugger
    let _this = this
    wx.canvasToTempFilePath({
      x:0,
      y:0,
      width: unit * 280,
      height: unit * 500,
      destWidth: unit * 280 *3.5,
      destHeight: unit * 500 *3.5,
      canvasId: 'share'+i,
      quality: 1,
      success: function(res){
        posterList.push(res.tempFilePath)
        _this.setData({
          posterList
        })
        i++
        _this.createImg(i,qrcode)
      }
    })
  },
  //保存海报
  savePoster: function(){
    debugger
    if(!this.data.canSave){
      return
    }
    this.setData({
      canSave: false
    })
    wx.showLoading({
      title: '正在保存...',
    })
    let _this = this
    //authorizationNotExist 授权列表是否不存在（弹出过授权弹窗才会产生授权列表）
    //didnotAccredit 是否没有授权
    if(!this.data.authorizationNotExist&&this.data.didnotAccredit){
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
      this.setData({
        canSave: true
      })
    }else{
      // for(let i = 0; i < this.data.imgUrls.length; i++){
        wx.saveImageToPhotosAlbum({
          filePath: _this.data.posterList[0],
          success: (res)=>{
            if(_this.data.imgUrls.length==1){
              _this.behavior()
              wx.hideLoading()
              wx.showToast({
                title: '已保存到本地相册',
                icon: 'none',
                duration: 2000
              }) 
              _this.setData({
                savedTip: true,
                canSave: true
              })
              return
            }
            _this.saveMore(_this.data.posterList,1)
          },
          fail: (err)=>{
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
            _this.setData({
              canSave: true
            })
          }
        })
      // }
    }
  },
  saveMore(imgs,index){
    let _this = this
    wx.saveImageToPhotosAlbum({
      filePath: imgs[index],
      success: (res)=>{
        let i = index+1
        if(i == imgs.length){
          _this.behavior()
          wx.hideLoading()
          wx.showToast({
            title: '已保存到本地相册',
            icon: 'none',
            duration: 2000
          }) 
          _this.setData({
            savedTip: true,
            canSave: true
          })
          return
        }
        _this.saveMore(imgs,i)
      },
      fail: (err)=>{
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
        _this.setData({
          canSave: true
        })
      }
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
  //openSetting返回后的回调
  getAuthor: function(){ 
  
    
  }
})