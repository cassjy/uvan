import Url from "../../../utils/API/url.js";
const host = Url.host;

var api = require("../../../utils/API/request.js");
var common = require("../../../utils/common.js");
import {
  GetWxOpenId,
  GetUserJoinActivityInfo,
  AddCustomerFormID,
  SystemUpgradeDandelion,
  validateusertype,
  JoinActivity,
  InsertPrizeOrder
} from "../../../utils/API/activity/activity.js";
var stayTime_JY = 0; //停留时间
var stayTimer_JY; //定时器
Page({
  data: {
    hadJoin: false, //是否已参与
    hadFinish: false, //是否已经完成任务
    hadGet: false, //是否已经领取奖品
    isTap: true, //控制遮罩层
    canClick: true, //防止重复点击
    addresseeName: "", //收件人
    inputAddresseeValue: "", //输入的收件人
    phoneNumber: "", //联系电话
    inputPhoneValue: "", //输入的联系电话
    addressText: "", //详细地址
    inputAddressText: "", //输入的详细地址
    region: ["省", "市", "区"],
    regionValue: "",
    emptyName: false, //空名字提示
    emptyPhone: false, //空电话提示
    emptyRegion: false, //空省市区提示
    emptyAddress: false, //空地址提示
    canSubmit: true, //防止重复提交表单
    mytoken: "",
    myphone: "",
    myopenid: "",
    mynickname: "",
    myimage: "",
    InvitationCode: "",
    headIconUrls: [],
    orderID: ""
  },
  onLoad() {},
  onShow() {
    wx.hideShareMenu();
    const _this = this;
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
        myphone: phone,
        inputPhoneValue: phone,
        phoneNumber: phone
      });
    } catch (e) {}
    let openid = wx.getStorageSync("openid") || "";
    if (openid == "") {
      GetWxOpenId().then(res => {
        if (res.data.code == 0) {
          _this.setData({
            myopenid: res.data.data
          })
        }else{
          wx.showToast({
            title: '获取openid失败',
            icon:'none'
          })
        }
        //用户未授权的话，nickName传空格字符串
        wx.getUserInfo({
          success: function(res) {
            _this.setData({
              mynickname: res.userInfo.nickName,
              myimage: res.userInfo.avatarUrl
            });
          },
          fail: function(err) {
            _this.setData({
              mynickname: "",
              myimage: ""
            });
          }
        });
        //获取参与信息
        let ActivityInfoData = {
          data: openid
        };
        GetUserJoinActivityInfo(ActivityInfoData).then(res => {
          if (res.code == 200) {
            console.log(res);
            this.setData({
              headIconUrls: res.data.headIconUrls,
              hadJoin: true,
              orderID: res.data.orderId
            });
            if (res.data.urlsCount >= 5) {
              this.setData({
                hadFinish: true
              });
            } else {
              this.setData({
                hadFinish: false
              });
            }
            if (res.data.isPrize) {
              this.setData({
                hadGet: true
              });
            } else {
              this.setData({
                hadGet: false
              });
            }
          } else if (res.code == 400 && res.info == "用户未参与邀梵星活动") {
            this.setData({
              hadJoin: false
            });
          }
        });
      });
    } else {
      this.setData({
        myopenid: openid
      });
      //获取参与信息
      let ActivityInfoData = {
        data: openid
      };
      GetUserJoinActivityInfo(ActivityInfoData).then(res => {
        if (res.code == 200) {
          console.log(res);
          this.setData({
            headIconUrls: res.data.headIconUrls,
            hadJoin: true,
            orderID: res.data.orderId
          });
          if (res.data.urlsCount >= 5) {
            this.setData({
              hadFinish: true
            });
          } else {
            this.setData({
              hadFinish: false
            });
          }
          if (res.data.isPrize) {
            this.setData({
              hadGet: true
            });
          } else {
            this.setData({
              hadGet: false
            });
          }
        } else if (res.code == 400 && res.info == "用户未参与邀梵星活动") {
          this.setData({
            hadJoin: false
          });
        }
      });
    }
  },
  onHide() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY);
    common.visitorRecordAPI(stayTime_JY, "邀梵星赢好礼");
  },
  onUnload() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY);
    common.visitorRecordAPI(stayTime_JY, "邀梵星赢好礼");
  },
  join(event) {
    this.setData({ formid: event.detail.formId });
    const _this = this;
    if (this.data.mytoken == "" || this.data.myphone == "") {
      wx.showModal({
        title: "提示",
        content: "登录后才能参与本活动，点击“确定”跳转到登录界面",
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "../../me/twicelogin/twicelogin"
            });
            wx.setStorageSync("formWhere", "running");
            return;
          } else if (res.cancel) {
          }
        }
      });
    } else {
      wx.showLoading();
      //判断是否为蒲公英
      let data = {
        data: this.data.myopenid
      };
      validateusertype(data).then(res => {
        if (res.code == 200 && res.data.F_UserType == "蒲公英") {
          //参加活动接口
          let joindata = {
            data: "邀梵星活动"
          };
          JoinActivity(joindata).then(res => {
            console.log(res);
            if (res.code == 200) {
              _this.setData({
                hadJoin: true,
                orderID: res.info
              });
              wx.hideLoading();
            } else if (res.code == 400 && res.info == "活动不存在或者已结束") {
              wx.hideLoading();
              common.showModal(res.info, "提示", function(res) {
                if (res.confirm) {
                  return;
                }
              });
            } else if (res.code == 400 && res.info == "未找到登录信息") {
              wx.hideLoading();
              wx.showModal({
                title: "提示",
                content:
                  "登录信息过期，登录后才能参与本活动，点击“确定”跳转到登录界面",
                success: function(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: "../../me/twicelogin/twicelogin"
                    });
                    wx.setStorageSync("formWhere", "running");
                    return;
                  } else if (res.cancel) {
                  }
                }
              });
            }
          });
        } else if (res.code == 200 && res.data.F_UserType != "蒲公英") {
          let updateDandeliondata = {};
          SystemUpgradeDandelion(updateDandeliondata) //自动升级蒲公英
            .then(res => {
              console.log(res);
              if (res.code == 200) {
                //参加活动接口
                let joindata = {
                  data: "邀梵星活动"
                };
                JoinActivity(joindata).then(res => {
                  console.log(res);
                  if (res.code == 200) {
                    _this.setData({
                      hadJoin: true
                    });
                    wx.hideLoading();
                  } else if (
                    res.code == 400 &&
                    res.info == "活动不存在或者已结束"
                  ) {
                    wx.hideLoading();
                    common.showModal(res.info, "提示", function(res) {
                      if (res.confirm) {
                        return;
                      }
                    });
                  } else if (res.code == 400 && res.info == "未找到登录信息") {
                    wx.hideLoading();
                    wx.showModal({
                      title: "提示",
                      content:
                        "登录信息过期，登录后才能参与本活动，点击“确定”跳转到登录界面",
                      success: function(res) {
                        if (res.confirm) {
                          wx.navigateTo({
                            url: "../../me/twicelogin/twicelogin"
                          });
                          wx.setStorageSync("formWhere", "running");
                          return;
                        } else if (res.cancel) {
                        }
                      }
                    });
                  }
                });
              } else {
                wx.hideLoading();
                debugger;
                common.showModal("请稍后再试。", "提示", function(res) {
                  if (res.confirm) {
                    return;
                  }
                });
              }
            });
        }
      });
      var data = {
        opneId: wx.getStorageSync("openid"),
        fromId: _this.data.formid
      };
      console.log(_this.data.formid);
      AddCustomerFormID(data).then(res => {
        console.log("上传formid");
      });
    }
  },
  getGift: function() {
    const _this = this;
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
    //未登录
    if (this.data.mytoken == "") {
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
        isTap: true
      });
      let giftOrderData = {
        data: {
          F_ID: this.data.orderID,
          F_CustomerName: this.data.addresseeName,
          F_Phone: this.data.phoneNumber,
          F_Province: this.data.region[0],
          F_City: this.data.region[1],
          F_County: this.data.region[2],
          F_Address: this.data.addressText
        }
      };
      InsertPrizeOrder(giftOrderData).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.setData({
            hadGet: true
          });
          wx.switchTab({
            url: "../../home/home"
          });
          common.showModal(
            "领取成功，礼品将在20个工作日内发放。",
            "提示",
            function(res) {
              if (res.confirm) {
                return;
              }
            }
          );
        } else if (res.code == 400 && res.info == "邀星不足5人") {
          common.showModal("您所邀请的梵星还未满5人。", "提示", function(res) {
            if (res.confirm) {
              return;
            }
          });
        } else {
          console.log(res);
          debugger;
          common.showModal("请稍后再试。", "提示", function(res) {
            if (res.confirm) {
              return;
            }
          });
        }
      });
    }
  },
  closeForm() {
    this.setData({
      isTap: true
    });
  },
  onShareAppMessage(res) {
    let _this = this;
    let invitationID = common.uuid();
    if (res.target.dataset.id == 0) {
      common.commonShare(
        "梵星邀请函",
        _this.data.mynickname,
        _this.data.myopenid,
        "",
        invitationID,
        "pages/me/uvStar1/uvStar1"
      );
    }
    return {
      title: "梵星邀请函",
      path:
        "/pages/me/uvStar1/uvStar1?openid=" +
        _this.data.myopenid +
        "&phone=" +
        _this.data.myphone +
        "&invitationID=" +
        invitationID,
      imageUrl: "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/05beb5c571454801bfba12c65e91cd5c"
    };
  },
  trim: function(s) {
    //去前后空格
    return s.replace(/(^\s*)|(\s*$)/g, "");
  }
});
