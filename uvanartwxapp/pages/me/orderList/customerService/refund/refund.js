var api = require('../../../../../utils/API/request.js')
const Url = require('../../../../../utils/API/url.js')
var common = require('../../../../../utils/common.js')
import { createaftersalesticket, getorderdetaildata} from '../../../../../utils/API/me/api.js'
var updatePhotoMark = true;  //修改图片标识
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: '',
    stateIndex: -1,
    picList: [],
    deteleStatus: true, //删除图片按钮
    photoID: '', //存放图片凭证ID
    stateList: ['未收到货', '已收到货'],
    array: ['退运费', '商品成分描述不符', '图片/产地/批号/规格描述不符', '商品变质/发霉/有异物', '商品破损/污渍/扭曲', '未按约定时间发货', '发票问题', '商家发错货'],
    F_OrderNo: '',
    F_RealPayAmount: '',
    F_Combination: '',
    onOff: false, //初始状态button开启
    state: '',  //传参货物状态
    reason: '', //传参退款原因
    price: '', //传参金额
    explain: '', //传参说明
    mode: '', //传参退款方式
    name: '', //传参收款人
    account: '', //传参账号
    wxName: '', //微信名称
    value: '',  //判断是仅退货还是退款退货
    inputPrice: 0, //用户输入的价格
    productPrice: '', //处理后的商品单价
    productNum: '',  //处理后的商品数量
    F_DetailsID: '', //商品详情ID
    hiddenMask: true, //提交成功弹框
    dataList: [],
    foodsType: '', //判断点击的是仅退款还是退款退货
    photoType: '',
    photo1: '',
    photo2: '',
    photo3: '',
    hiddenPhoto1: 'hidden',
    hiddenPhoto2: 'hidden',
    formPinTuan: '',
    isChecked: 0, //0代表未选中收款方式
    showMore: true, //用户展示货物状态弹框
    showMore1: true, //用户展示退款原因弹框
    Checked: false,
    Checked1: false,
    stateId: -1,
    stateId1: -1,
    bouncedNum: 0, //用于判断用户点击的是哪种类型
    photoList: [], //阿里服务器返回的图片数组
    MaximumRefundAmount:'', //最大退款金额
  },


  // 回到个人中心
  openPage: function () {
    wx.switchTab({
      url: '../../../../me/me?type=true',
    })
  },

  // 提交表单
  formSubmit: function (e) {
    console.log('formid为 ' + `${e.detail.formId}`);
    common.postformid(e.detail.formId);
    console.log(e)
    console.log(this.data.picList)
    wx.showLoading({
      title: '上传中...',
    })
    var _this = this;
    // url接口地址
    var url = Url.host + "/lr/s2bapi/uploadaftersalesimage";

    // 把用户输入的部分信息保存到data
    this.setData({
      explain: e.detail.value.explain,
      name: e.detail.value.name,
      account: e.detail.value.number,
      price: e.detail.value.price
    })

    // 不能为空
    if (this.data.reason == '' || this.data.price == '' || this.data.explain == '' || this.data.mode == '' || this.data.name == '' || this.data.account == '') {
      wx.showToast({
        title: '请完善退款信息',
        icon: "none",
        image: "../../../../../images/index/error.png"
      })
      return;
    }

    // 输入金额不正确
    if (this.data.inputPrice > this.data.MaximumRefundAmount) {
      wx.showToast({
        title: '价格输入不准确',
        icon: "none",
        image: "../../../../../images/index/error.png"
      })
      return;
    }

    // 凭证不能为空
    if (!this.data.formPinTuan) {
      if (this.data.picList.length <= 0) {
        wx.showToast({
          title: '凭证不能为空',
          icon: "none",
          image: "../../../../../images/index/error.png"
        })
        return;
      }
    }

    // 当用户输入的信息都正确时，提交了按钮则关闭按钮（防止提交多次）
    this.setData({
      onOff: true
    })

    try {
      var token = wx.getStorageSync('token');
      var phone = wx.getStorageSync('phone');
      var openid = wx.getStorageSync('openid');
      var data = {   //传参
        "token": token,
        "loginMark": phone,
        "data": {
          "Ticket": {
            "F_OrderNo": this.data.F_OrderNo,
            "F_OrderDetailsID": this.data.F_DetailsID,
            "F_OpenID": openid,
            "F_NickName": this.data.wxName,
            "F_PhoneNumber": phone,
            "F_Reasons": this.data.reason,
            "F_ProductStatus": this.data.state,
            "F_RefundType": this.data.mode,
            "F_RefundPayee": this.data.name,
            "F_RefundAccount": this.data.account,
            "F_TicketType": this.data.value,
            "F_RefundMemo": this.data.explain,
            "F_RefundAmount": this.data.price,
            "F_ImageOne": this.data.photoList[0],
            "F_ImageTwo": this.data.photoList[1],
            "F_ImageThree": this.data.photoList[2],
          },
          "TicketDetails": [
            {
              "F_Combination": this.data.F_Combination
            }
          ]
        }
      }
      console.log(data)
      var header = "application/json";
      createaftersalesticket(data, header).then(res => {
        console.log('文本数据保存成功')
        console.log(res)
        wx.hideLoading()
        if (res.code == 200) {
          wx.showModal({
            title: '提示',
            content: '您的售后申请已提交成功，请等待审核。',
            showCancel: false,
            success: function (res) {
              console.log('点击了确认')
              wx.switchTab({
                url: '../../../../me/me?type=true',
              })
            },
            complete: function (res) {
              if (res.confirm || res.cancel) {
                return;
              } else {
                wx.switchTab({
                  url: '../../../../me/me?type=true'
                })
              }
            }
          })
        }else if(res.code==400){
          wx.showToast({
            title: '提交失败',
            icon: "none",
            image: "../../../../../images/index/error.png"
          })
          _this.setData({
            onOff: false
          })
        }
      })
        .catch(res => {
          console.log(res)
          wx.showToast({
            title: '提交失败',
            icon: "none",
            image: "../../../../../images/index/error.png"
          })
          _this.setData({
            onOff: false
          })
        })
        .then(() => {
          wx.hideLoading()
        })
      console.log(data)
    } catch (e) {
      console.log(e)
    }
  },

  // 货物状态或退款原因弹框显示
  showBounced: function (e) {
    if (parseInt(e.currentTarget.dataset.mark) == 1) {
      this.setData({
        showMore: false,
      })
    } else if (parseInt(e.currentTarget.dataset.mark) == 2) {
      this.setData({
        showMore1: false,
      })
    }
  },
  // 点击货物状态
  checkSate: function (e) {
    console.log(e)
    this.setData({
      Checked: true,
      showMore: true,
      stateIndex: e.currentTarget.dataset.id,
      stateId: parseInt(e.currentTarget.dataset.id),
      state: this.data.stateList[parseInt(e.currentTarget.dataset.id)]
    })
  },
  //点击退款原因选项 
  checkReson: function (e) {
    this.setData({
      Checked1: true,
      showMore1: true,
      reason: this.data.array[parseInt(e.currentTarget.dataset.id)],
      stateId1: parseInt(e.currentTarget.dataset.id),
    })
  },
  // 隐藏货物状态弹框
  closeBounced: function () {
    this.setData({
      showMore: true,
      showMore1: true
    })
  },



  // 监听用户输入的金额
  compute: function (e) {
    var _this = this;
    this.setData({
      inputPrice: e.detail.value
    })
    if (e.detail.value > this.data.MaximumRefundAmount) {
      let animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease-in',
      })
      animation.opacity(1).step();
      _this.setData({
        animationData: animation.export()
      })
      setTimeout(function () {
        animation.opacity(0).step();
        _this.setData({
          animationData: animation.export()
        })
      }, 2000)
    }
  },

  // 退款方式
  chooseMode: function (e) {
    console.log(e)
    this.setData({
      mode: e.currentTarget.dataset.mode,
      isChecked: parseInt(e.currentTarget.dataset.id)
    })
    console.log(this.data.mode)
  },

  //  添加图片
  addPhoto: function (e) {
    if (this.data.onOff) {
      return;
    }
    var id = e.currentTarget.dataset.id;  //用户判断用户是点击添加图片还是修改图片
    this.uploadPhoto(id)
  },

  //  修改上传图片
  updatePhoto: function (e) {
    console.log(e)
    var num = e.currentTarget.dataset.index;  //图片下标
    var id = e.currentTarget.dataset.id;  //用户判断用户是点击添加图片还是修改图片
    this.setData({
      deteleStatus: true
    })
    this.uploadPhoto(id, num)
  },

  // 长按图片显示删除按钮
  showDeteleBtn: function (e) {
    console.log(e)
    this.setData({
      photoID: e.currentTarget.dataset.index,
      deteleStatus: false
    })
  },

  // 删除上传图片
  deletePhoto: function (e) {
    console.log(e)
    var _this = this;
    wx.showModal({
      title: '是否删除该照片？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          _this.data.picList.splice(parseInt(e.currentTarget.dataset.index), 1);
          _this.data.photoList.splice(parseInt(e.currentTarget.dataset.index), 1)
          _this.setData({
            picList: _this.data.picList,
            photoList: _this.data.photoList,
            deteleStatus: true
          })
          console.log(_this.data.photoList)
          console.log(_this.data.picList)
        } else if (res.cancel) {
          console.log('用户点击取消')
          _this.setData({
            deteleStatus: true
          })
        }
      }
    })
  },

  // 上传凭证公用方法
  uploadPhoto: function (id, num) {
    var _this = this;
    var itemList;
    if (id == 1) {
      itemList = ['修改图片', '删除图片']
    } else {
      itemList = ['从相册中选择', '拍照']
    }
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#5e5e5e',
      success: function (e) {
        console.log(e)
        console.log(id)
        switch (id) {
          case '1':
            if (e.tapIndex == 0) {
              // var photoType = 'album';
              console.log('默认')
            } else if (e.tapIndex == 1) {
              wx.showModal({
                title: '是否删除该照片？',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    console.log(_this.data.picList)
                    console.log(_this.data.photoList)
                    _this.data.photoList.splice(num, 1); //删除对应的图片
                    _this.data.picList.splice(num, 1);
                    _this.setData({
                      picList: _this.data.picList,
                      photoList: _this.data.photoList
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              return;
            } else {
              return;
            }
            break;
          case '2':
            if (e.tapIndex == 0) {
              var photoType = 'album';
            } else if (e.tapIndex == 1) {
              var photoType = 'camera';
            } else {
              return;
            }
            break;
        }

        switch (num) {
          case 0:   //修改第一张图片
            wx.chooseImage({
              count: 1,
              sizeType: ['compressed'],
              // sourceType: [photoType],
              success: function (res) {
                _this.aLiUpload((res.tempFilePaths).toString(), updatePhotoMark, num); //重新上传图片(增加修改图片标识和下标)
                _this.data.picList.splice(0, 1, (res.tempFilePaths).toString()) //本地图片地址同样更改
                _this.setData({
                  picList: _this.data.picList
                })

              }
            })
            break;
          case 1:  //修改第二张图片
            wx.chooseImage({
              count: 1,
              sizeType: ['compressed'],
              // sourceType: [photoType],
              success: function (res) {
                _this.aLiUpload((res.tempFilePaths).toString(), updatePhotoMark, num); //重新上传图片(增加修改图片标识和下标)
                _this.data.picList.splice(1, 1, (res.tempFilePaths).toString())
                _this.setData({
                  picList: _this.data.picList
                })

              }
            })
            break;
          case 2:  //修改第三张图片
            wx.chooseImage({
              count: 1,
              sizeType: ['compressed'],
              // sourceType: [photoType],
              success: function (res) {
                _this.aLiUpload((res.tempFilePaths).toString(), updatePhotoMark, num); //重新上传图片(增加修改图片标识和下标)
                _this.data.picList.splice(2, 1, (res.tempFilePaths).toString())
                _this.setData({
                  picList: _this.data.picList
                })
              }
            })
            break;
          default:   //添加图片
            wx.chooseImage({
              count: 1,
              sizeType: ['compressed'],
              sourceType: [photoType],
              success: function (res) {
                console.log(res)
                // 执行上传图片接口
                _this.aLiUpload((res.tempFilePaths).toString());
                console.log(_this.data.picList)
              }
            })
        }
      }
    })
  },


  // 上传图片到阿里服务器
  aLiUpload: function (path, mark, id) {
    this.setData({
      onOff: true
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
        "imageType": '申请退款凭证',
        "image": '',
        "token": wx.getStorageSync('token'),
        "loginmark": wx.getStorageSync('phone')
      },
      success: function (res) {
        if (res.statusCode==413){
          wx.showToast({
            title: '上传异常/图片过大，请重新上传',
            icon: 'none'
          })
          wx.hideLoading()
          _this.setData({
            onOff: false
          })
          return
        }
        console.log('图片上传成功')
        console.log(res)
        console.log(JSON.parse(res.data))
        console.log(`mark标志值为${mark}`)
        console.log(path)
        if (JSON.parse(res.data).code == 200) {
          // debugger
          _this.data.picList.push(path);
          _this.setData({
            picList: _this.data.picList
          })
          if (mark) {  //如果是修改图片则需更新图片地址再保存到photoList数组
            _this.data.photoList.splice(id, 1, JSON.parse(res.data).data.F_ImageUrl)  //替换图片地址
            _this.setData({
              photoList: _this.data.photoList
            })
            console.log(_this.data.photoList)
          } else {
            _this.data.photoList.push(JSON.parse(res.data).data.F_ImageUrl)
            _this.setData({
              photoList: _this.data.photoList
            })
          }
        } else if (JSON.parse(res.data).code == 400) {
          wx.showToast({
            title: '上传失败',
          })
        }
        console.log(_this.data.photoList)
        // debugger
        _this.setData({
          onOff: false
        })
        wx.hideLoading()
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('加载')
    console.log(options)
    var _this = this;
    if (options.formPinTuan == 'undefined') {
      this.setData({
        formPinTuan: false
      })
    } else {
      this.setData({
        formPinTuan: options.formPinTuan
      })
    }
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      foodsType: options.id,
      F_Combination: options.Combination,
      value: options.value

    })
    if (options.id == 1) {
      // this.data.array.splice(0, 1)
      this.setData({
        array: this.data.array
      })
    }
    // 获取用户openID、手机号码、token等
    try {
      var token = wx.getStorageSync('token');
      var openid = wx.getStorageSync('openid');
      var phone = wx.getStorageSync('phone');
      var data = {
        "token": token,
        "loginMark": phone,
        "data": { 'fid': options.fid, 'limit': '0', 'page': '0' }
      }
      getorderdetaildata(data).then(res => {
        console.log(res)
        _this.setData({
          dataList: res.data.goods,
          F_DetailsID: res.data.goods[0].F_DetailsID,
          F_OrderNo: res.data.order.F_OrderNo,
          F_RealPayAmount: res.data.order.F_RealPayAmount,
          productPrice: res.data.goods[0].F_ProductPrice,  // 处理商品单价
          productNum: res.data.goods[0].F_ProductNumber,    // 处理商品数量
          F_Freight: res.data.order.F_Freight,
          MaximumRefundAmount: res.data.goods[0].MaximumRefundAmount
        })
        console.log(_this.data.dataList)
      })
        .catch(res => {
          console.log(res)
        })
        .then(res => {
          wx.hideLoading()
        })
    } catch (e) {
      console.log(e)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取微信名称
    var _this = this;
    wx.getUserInfo({
      withCredentials: false,
      lang: 'zh_CN',
      success: function (res) {
        _this.setData({
          wxName: res.userInfo.nickName
        })
        console.log(_this.data.wxName)
      }
    })
  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})