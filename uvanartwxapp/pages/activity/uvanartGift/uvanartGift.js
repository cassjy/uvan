var common = require("../../../utils/common.js");
var api = require("../../../utils/API/request.js");

var stayTime_JY = 0; //停留时间
var stayTimer_JY; //定时器

import {
  GetWxOpenId,
  Add_LiftGiftOrder,
  Get_LiftPrizeStatus
} from "../../../utils/API/activity/activity.js";

Page({
  data: {
    region: ["省", "市", "区"],
    regionValue: "",
    isTap: true, //控制遮罩层
    giftOBJ: [
      {
        prizeName: "坚果蓝牙音箱",
        name: "音箱",
        img:
          "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/GA9w4QJ4QGiK1sP5JF4BSwAAAT1wZDIE",
        isChecked: false
      },
      {
        prizeName: "优梵艺术腰枕",
        name: "腰枕",
        img:
          "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/yz48nQrZRN6qTFAyw4j2SQAAAT1wZDIE",
        isChecked: false
      },
      {
        prizeName: "美西笔记本",
        name: "笔记本",
        img:
          "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/bSZSg5vOTCWPNEyvcqSCywAAAT1wZDIE",
        isChecked: false
      },
      {
        prizeName: "优梵艺术抱枕",
        name: "抱枕",
        img:
          "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/kIniBKXvQTSFvgcyP06rmAAAAT1wZDIE",
        isChecked: false
      }
    ], //礼品信息列表
    nowIndex: -1, //当前礼品索引
    prizeName: "", //当前选择的礼品名称
    hadgetPrizeName: "", //已经获取的礼品名称
    hadGet: true, //是否已领取
    canClick: true, //防止重复点击
    addresseeName: "", //收件人
    inputAddresseeValue: "", //输入的收件人
    phoneNumber: "", //联系电话
    inputPhoneValue: "", //输入的联系电话
    addressText: "", //详细地址
    inputAddressText: "", //输入的详细地址
    emptyName: false, //空名字提示
    emptyPhone: false, //空电话提示
    emptyRegion: false, //空省市区提示
    emptyAddress: false, //空地址提示
    canSubmit: true, //防止重复提交表单
    mytoken: "",
    myphone: "",
    myopenid: ""
  },
  onLoad(option) {},
  onShow() {
    var _this = this;
    //开始计时（停留时间）
    stayTime_JY = 0; //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++;
    }, 1000);
   
    try {
      let token = wx.getStorageSync("token") || "";
      let phone = wx.getStorageSync("phone") || "";
      this.setData({
        mytoken: token,
        myphone: phone
      });
    } catch (e) {}
    let openid = wx.getStorageSync("openid") || "";
    if (openid == "") {
      GetWxOpenId().then(res => {
          if (res.data.code == 0) {
            _this.setData({
              myopenid: res.data.data
            })
          } else {
            wx.showToast({
              title: '获取openid失败',
              icon: 'none'
            })
          }
        //获取奖品信息
        let prizedata = {
          data: {
            F_openid: openid
            // "F_openid": "oQCP70JacIv1Moyl7IWn3bPDjcqE"
          }
        };
        Get_LiftPrizeStatus(prizedata).then(res => {
          console.log(res);
          if (res.code == 200) {
            if (res.data.isprize == false) {
              this.setData({
                hadGet: false
              });
            } else {
              console.log("已领取：" + res.data.giftname);
              this.setData({
                hadGet: true,
                hadgetPrizeName: res.data.giftname
              });
            }
          }
        });
      });
    } else {
      this.setData({
        myopenid: openid
      });
      //获取奖品信息
      let prizedata = {
        data: {
          F_openid: openid
          // "F_openid": "oQCP70JacIv1Moyl7IWn3bPDjcqE"
        }
      };
      Get_LiftPrizeStatus(prizedata).then(res => {
        console.log(res);
        if (res.code == 200) {
          if (res.data.isprize == false) {
            this.setData({
              hadGet: false
            });
          } else {
            console.log("已领取：" + res.data.giftname);
            this.setData({
              hadGet: true,
              hadgetPrizeName: res.data.giftname
            });
          }
        }
      });
    }
  },
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY);
    common.visitorRecordAPI(stayTime_JY, "电梯礼品");
  },
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY);
    common.visitorRecordAPI(stayTime_JY, "电梯礼品");
  },
  toIndex: function() {
    wx.switchTab({
      url: "/pages/home/home"
    });
  },
  chooseGift: function(e) {
    const index = e.currentTarget.dataset.index;
    const prizeName = e.currentTarget.dataset.name;
    this.setData({
      nowIndex: index,
      prizeName: prizeName
    });
  },
  getGift: function() {
    const _this = this;
    //未选择礼品
    if (this.data.nowIndex == -1) {
      common.showModal("请选择任意一款心仪的礼品", "提示", function(res) {
        if (res.confirm) {
          return;
        }
      });
      return;
    }
    //防止重复点击
    if (this.data.canClick == false) {
      return;
    }
    this.setData({
      canClick: false
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    console.log(this.data.prizeName);
    //未登录
    if (this.data.mytoken == "" || this.data.myphone == "") {
      wx.showModal({
        title: "提示",
        content: "注册或者登录后才能参与此活动，点击“确定”后跳转到注册登录页面",
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "../../me/twicelogin/twicelogin"
            });
            wx.setStorageSync("formWhere", "running");
            return;
          } else if (res.cancel) {
            return;
          }
        }
      });
      _this.setData({
        canClick: true
      });
    } else {
      this.setData({
        isTap: false,
        canClick: true
      });
    }
  },
  //打电话
  phoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: "18042883710"
    });
  },
  //打开地图
  openMap: function() {
    wx.openLocation({
      latitude: 22.99169,
      longitude: 113.4262,
      scale: 15,
      name: "优梵艺术广州店",
      address: "广东省广州市番禺区石基镇金山村华创动漫产业园二期18栋"
    });
  },
  //输入收件人
  addresseeChange: function(e) {
    //跟踪用户在输入框输入的数据
    let val = e.detail.value;
    const _this = this;
    this.setData({
      addresseeName: _this.trim(val), //处理输入词的前后空格，用作传到后台
      inputAddresseeValue: val //未作处理的输入词，用作保留在输入框使用
    });
    if (this.data.addresseeName != "") {
      this.setData({
        emptyName: false
      });
    }
  },
  //输入联系电话
  phoneChange: function(e) {
    let val = e.detail.value;
    const _this = this;
    this.setData({
      phoneNumber: _this.trim(val), //处理输入词的前后空格，用作传到后台
      inputPhoneValue: val //未作处理的输入词，用作保留在输入框使用
    });
    if (this.data.phoneNumber != "") {
      this.setData({
        emptyPhone: false
      });
    }
  },
  //选择省市区
  bindRegionChange: function(e) {
    let val = e.detail.value;
    this.setData({
      region: val,
      regionValue: val.join("")
    });
    if (this.data.region[0] != "省") {
      this.setData({
        emptyRegion: false
      });
    }
  },
  //输入详细地址
  addressChange: function(e) {
    let val = e.detail.value;
    const _this = this;
    this.setData({
      addressText: _this.trim(val), //处理输入词的前后空格，用作传到后台
      inputAddressText: val //未作处理的输入词，用作保留在输入框使用
    });
    if (this.data.addressText != "") {
      this.setData({
        emptyAddress: false
      });
    }
  },
  formSubmit: function() {
    //防止重复提交
    if (this.data.canSubmit == false) {
      return;
    }
    this.setData({
      canSubmit: false
    });
    if (
      this.data.addresseeName == "" ||
      this.data.phoneNumber == "" ||
      this.data.region[0] == "省" ||
      this.data.addressText == ""
    ) {
      if (this.data.addresseeName == "") {
        this.setData({
          emptyName: true
        });
      } else {
        this.setData({
          emptyName: false
        });
      }
      // this.data.phoneNumber==""||this.data.phoneNumber.length<11
      if (!common.isPhone(this.data.phoneNumber)) {
        this.setData({
          emptyPhone: true
        });
      } else {
        this.setData({
          emptyPhone: false
        });
      }

      if (this.data.region[0] == "省") {
        this.setData({
          emptyRegion: true
        });
      } else {
        this.setData({
          emptyRegion: false
        });
      }

      if (this.data.addressText == "") {
        this.setData({
          emptyAddress: true
        });
      } else {
        this.setData({
          emptyAddress: false
        });
      }
      this.setData({
        canSubmit: true
      });
      return;
    } else {
      this.setData({
        emptyName: false,
        emptyPhone: false,
        emptyRegion: false,
        emptyAddress: false,
        isTap: true,
        hadGet: true
      });
      let giftOrderData = {
        data: {
          F_recipients: this.data.addresseeName,
          F_province: this.data.region[0],
          F_city: this.data.region[1],
          F_area: this.data.region[2],
          F_detailaddress: this.data.addressText,
          F_giftname: this.data.prizeName
        }
      };
      Add_LiftGiftOrder(giftOrderData).then(res => {
        console.log(res);
        if (res.code == 200) {
          wx.switchTab({
            url: "../../home/home"
          });
          common.showModal(
            "领取成功，我们会尽快给您寄发礼品。",
            "提示",
            function(res) {
              if (res.confirm) {
                return;
              }
            }
          );
        } else {
          console.log(res);
          common.showModal("请稍后再试。", "提示", function(res) {
            if (res.confirm) {
              return;
            }
          });
        }
      });
    }
  },
  closeForm: function() {
    this.setData({
      isTap: true
    });
  },
  trim: function(s) {
    //去前后空格
    return s.replace(/(^\s*)|(\s*$)/g, "");
  }
});
