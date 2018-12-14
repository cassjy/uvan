import Url from '../../../../utils/API/url.js';
const host = Url.host;

var api = require("../../../../utils/API/request.js")
var common = require("../../../../utils/common.js")

var unit
Page({
  data: {
  	productID: '',
    imgList:[],
    nowImg: '',
    bannerstyle: ["showheight", "", ""],
    inputValue:'',//输入的内容
    activeCount: 0,//输入的内容的数量
    canvasHidden:true,     //设置画板的显示与隐藏，画板不隐藏会影响页面正常显示     
    screenWidth: '',       //设备屏幕宽度
    shareImgPath:'',
    QRcodeIMG: '',
    canConfirm: false,//是否能确定
    mytoken: '',
    myphone: '',
    qrcode_id: '',
    imgListTemp: [],
    cantMove: true,
    didnotAccredit: false,//相册是否未授权
    authorizationNotExist: false,//相册授权选项是否存在
  },
  onLoad: function(option){
    let _this = this
  	console.log(option)
  	this.setData({
  		productID: option.productid,
  		imgList: JSON.parse(option.productpic)
  	})
    if(this.data.imgList[0].indexOf('http://59.38.255.210:8086')>-1){
      let imgList = []
      for(let i = 0; i < this.data.imgList.length; i++){
        imgList[i] = this.data.imgList[i].replace('http://59.38.255.210:8086','https://shopsync.uvanart.com')
      }
      this.setData({
        imgList: imgList
      })
    }
    try{
      let token = wx.getStorageSync('token')
      let phone = wx.getStorageSync('phone')
      this.setData({
        mytoken: token,
        myphone: phone
      })
    }catch(e){

    }
    wx.showLoading({
      title: '加载中...',
    })
    // wx.downloadFile({
    //   url: this.data.imgList[0], 
    //   success: function(res) {
    //     if (res.statusCode === 200) {
    //       _this.setData({
    //         nowImg: res.tempFilePath
    //       })
    //     }
    //   }
    // })
    console.log(this.data.productID)
    console.log(this.data.imgList)
    this.createQRcode(option.qrcodeimg,option.qrcodeid)
    //获取用户设备信息，屏幕宽度
    wx.getSystemInfo({
      success: res => {
        _this.setData({
          screenWidth: res.screenWidth
        })
        console.log(_this.data.screenWidth)
      }
    })
    wx.getSetting({
      success: function(res){
        if(res.authSetting['scope.writePhotosAlbum'] == null || res.authSetting['scope.writePhotosAlbum']){
          _this.setData({
            authorizationNotExist: true
          })
        }else if(!res.authSetting['scope.writePhotosAlbum']){
          _this.setData({
            authorizationNotExist: false,
            didnotAccredit: true
          })
        }
      }
    })
  },
  onShow: function(){
    
  },
  //轮播图变动
  changeheight(e) {
    this.setData({
      canConfirm: false,
      cantMove: true
    })
    wx.showLoading({
      title: '加载中...',
    })
    let _this = this
    let nowIndex = e.detail.current
    this.setData({
      bannerstyle: ["", "", ""],
      // nowImg: this.data.imgListTemp[nowIndex]
    })
    this.data.bannerstyle[e.detail.current] = "showheight"
    this.setData({
      bannerstyle: this.data.bannerstyle,
    })
    wx.downloadFile({
      url: _this.data.imgList[nowIndex], 
      success: function(res) {
        if (res.statusCode === 200) {
          _this.setData({
            nowImg: res.tempFilePath
          })
          
        }else{
          wx.showToast({
            title: '加载失败，尝试重新进入页面',
            icon: 'none',
            duration: 2000
          })
        }
      },
      complete: function(){
        wx.hideLoading()
        _this.setData({
          canConfirm: true,
          cantMove: false
        })
      }
    })
  },
  inputChange: function(e){
    let activeCount = e.detail.value.length
    this.setData({
      activeCount: activeCount,
      inputValue: e.detail.value
    })
  },
  //定义的生成图片方法
  createImgQRcode: function () {
    if(this.data.activeCount>50){
      wx.showToast({
        title: '超出字数限制',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var that = this;
    //设置画板显示，才能开始绘图
    that.setData({
      canvasHidden: false
    })
    
    wx.showLoading({
      title: '正在生成海报',
    })
    unit = that.data.screenWidth / 375
    var path1 = this.data.nowImg
    var path2 = this.data.QRcodeIMG
    var context = wx.createCanvasContext('share')
    var row = []
    var temp = ''
    var chr = this.data.inputValue.split("")
    context.fillStyle = '#fff'
    context.fillRect(0, 0, unit * 375, unit * 700)
    context.drawImage(path1, unit * 20, unit * 20 , unit * 295, unit * 295)
    context.setFontSize(14)
    context.setFillStyle("#666666")
    // context.fillText(this.data.inputValue, unit * 30, unit * 350)
    for (var a = 0; a < this.data.inputValue.length; a++) {
      if (context.measureText(temp).width < unit * 290) {
        temp += chr[a];
      }
      else {
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp); 
    for (var b = 0; b < row.length; b++) {
      context.fillText(row[b], unit * 20, unit * 345 + ( b * 20 ));
    }
    context.drawImage(path2, unit * 123, unit * 400 , unit * 85, unit * 85)
    //把画板内容绘制成图片，并回调 画板图片路径
    context.draw(false, function () {
      wx.hideLoading()
    });
  },
  createQRcode: function (qrcodeimg,qrcodeid) {
    let nickname = wx.getStorageSync('userName') || " "
    let openid = wx.getStorageSync('openid')
    let invitationID = common.uuid()

    let qrcode_img = qrcodeimg
    

    const _this = this
    let token = wx.getStorageSync("token")
    let phone = wx.getStorageSync("phone")
    if(qrcode_img!=''){
      let qrcode = qrcodeid
      wx.getUserInfo({
        success: function(res) {
          console.log(res)
          nickname = res.userInfo.nickName
          common.commonShare(qrcode,nickname,openid,'pic',invitationID,'pages/categories/detail/detail')
        },
        fail: function(err){
          console.log(err)
          common.commonShare(qrcode,nickname,openid,'pic',invitationID,'pages/categories/detail/detail')
        }
      })
      wx.downloadFile({
        url: qrcode_img, 
        success: function(res1) {
          if (res1.statusCode === 200) {
            _this.setData({
              QRcodeIMG: res1.tempFilePath
            })
            console.log(_this.data.QRcodeIMG)
            wx.downloadFile({
              url: _this.data.imgList[0], 
              success: function(res2) {
                if (res2.statusCode === 200) {
                  _this.setData({
                    nowImg: res2.tempFilePath,
                    // canConfirm: true,
                    // cantMove: false
                  })
                  // wx.hideLoading()

                  let imgListTemp = []
                  let imgCount = 0
                  for(let i = 0; i<_this.data.imgList.length; i++){
                    imgCount++
                    wx.downloadFile({
                      url: _this.data.imgList[i],
                      success: function(res3){
                        if(res3.statusCode === 200){
                          imgListTemp = res3.tempFilePath
                          _this.setData({
                            imgListTemp: imgListTemp
                          })
                          if(imgCount == _this.data.imgList.length){
                            _this.setData({
                              // nowImg: res2.tempFilePath,
                              canConfirm: true,
                              cantMove: false
                            })
                            wx.hideLoading()
                          }
                        }else{
                          common.showModal("请稍后再试", "", function (res) {
                            if (res.confirm) {
                              
                            }
                          })
                        }
                      }
                    })
                  }
                }else{
                  
                  wx.hideLoading()
                }
              }
            })
          }else{
            common.showModal("请稍后再试", "", function (res) {
              if (res.confirm) {
                
              }
            })
            wx.hideLoading()
          }
        },
        fail: function(err){
          wx.hideLoading()
        }
      })
    }else{
      var qrdata = {
        "token": token,
        "loginMark": phone,
        "productID":this.data.productID,
        "qrCodeType": 'B'//A-商品二维码，B-图文二维码
      }
      api.get('/lr/s2bapi/getQrCode', qrdata)
      .then(function (res) {
        if (res.code == 200) {
          _this.setData({
            qrcode_id: res.data.F_ID//scene
          })
          let qrcode = res.data.F_ID
          wx.getUserInfo({
            success: function(res) {
              console.log(res)
              nickname = res.userInfo.nickName
              common.commonShare(qrcode,nickname,openid,'pic',invitationID,'pages/categories/detail/detail')
            },
            fail: function(err){
              console.log(err)
              common.commonShare(qrcode,nickname,openid,'pic',invitationID,'pages/categories/detail/detail')
            }
          })
          wx.downloadFile({
            url: res.data.F_ImagePath, 
            success: function(res1) {
              if (res1.statusCode === 200) {
                _this.setData({
                  QRcodeIMG: res1.tempFilePath
                })
                console.log(_this.data.QRcodeIMG)
                wx.downloadFile({
                  url: _this.data.imgList[0], 
                  success: function(res2) {
                    if (res2.statusCode === 200) {
                      _this.setData({
                        nowImg: res2.tempFilePath,
                        // canConfirm: true,
                        // cantMove: false
                      })
                      // wx.hideLoading()

                      let imgListTemp = []
                      let imgCount = 0
                      for(let i = 0; i<_this.data.imgList.length; i++){
                        imgCount++
                        wx.downloadFile({
                          url: _this.data.imgList[i],
                          success: function(res3){
                            if(res3.statusCode === 200){
                              imgListTemp = res3.tempFilePath
                              _this.setData({
                                imgListTemp: imgListTemp
                              })
                              if(imgCount == _this.data.imgList.length){
                                _this.setData({
                                  // nowImg: res2.tempFilePath,
                                  canConfirm: true,
                                  cantMove: false
                                })
                                wx.hideLoading()
                              }
                            }else{
                              common.showModal("请稍后再试", "", function (res) {
                                if (res.confirm) {
                                  
                                }
                              })
                            }
                          }
                        })
                      }
                    }else{
                      
                      wx.hideLoading()
                    }
                  }
                })
              }else{
                common.showModal("请稍后再试", "", function (res) {
                  if (res.confirm) {
                    
                  }
                })
                wx.hideLoading()
              }
            },
            fail: function(err){
              wx.hideLoading()
            }
          })
        } else{
          common.showModal("请稍后再试", "", function (res) {
            if (res.confirm) {
              
            }
          })
          wx.hideLoading()
        }
      })
    }
    
  },
  //下载图片到本地
  downLoadIMG: function(url){
    wx.downloadFile({
      url: url, 
      success: function(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          return res.tempFilePath
        }
      }
    })
  },
  saveQRcode: function(){
    if(this.data.canSave == false){
      return
    }
    this.setData({
      canSave: false
    })
    let that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: unit * 335,
      height: unit * 510,
      destWidth: unit * 335 *4,
      destHeight: unit * 510 *4,
      canvasId: 'share',
      success: function (res) {
        console.log(res)
        that.setData({
          shareImgPath: res.tempFilePath,
        })
        
        if (!res.tempFilePath) {
          wx.showModal({
            title: '提示',
            content: '图文二维码绘制中，请稍后重试',
            showCancel: false
          })
        }

        console.log(that.data.shareImgPath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res2) => {
            console.log(res2)
            //传给后台
            let file = res.tempFilePath.toString()
            let url = host + '/s2b/productqrcode/SaveGraphicQrCode'
            
            wx.uploadFile({
              url: url, //仅为示例，非真实的接口地址
              filePath: res.tempFilePath.toString(),
              name: 'file',
              header:{
                'content-type':"multipart/form-data"
              },
              formData:{
                "token": that.data.mytoken,
                "loginMark": that.data.myphone,
                'copywriting': that.data.inputValue,
                'qrcodeid': that.data.qrcode_id,
                'productid':that.data.productID
              },
              success: function(res1){
                console.log(res1)
              }
            })
            wx.showModal({
              title: '提示',
              content: '已保存到本地相册',
              showCancel: false,
              confirmColor:"#424242",
              success: function(res) {
                if (res.confirm) {
                }
                wx.navigateBack({
                  delta: 1
                })
              }
            })
            that.setData({
              canSave: true
            })
          },
          fail: (err) => {
            console.log(err)
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              canSave: true,
            })
            wx.getSetting({
              success: function(res){
                console.log(res)
                if (!res.authSetting['scope.writePhotosAlbum']){
                  that.setData({
                    didnotAccredit: true,
                    authorizationNotExist: false
                  })
                }
              }
            })
          }
        })
      },
      fail: function(res){
        console.log(res)
        console.log('失败')
        that.setData({
          canSave: true
        })
        wx.showModal({
          title: '提示',
          content: '图文二维码绘制失败，请稍后重试',
          showCancel: false
        })
      }
    })
    
  },
  cancel: function(){
    this.setData({
      canvasHidden: true
    })
  },
  onHide: function(){
    // this.setData({
    //   canvasHidden: true
    // })
  },
  onUnload: function(){
    // this.setData({
    //   canvasHidden: true
    // })
  }
 })