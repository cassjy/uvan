var api = require("./API/request.js");
import { ADD_CommonShareService, GetInviteShareRecord, login, ScanQRCode, ValidateUserType, Add_UserVisiteRecord, AddCustomerFormID, GetMyOpenid } from 'API/common/api.js';

function showTip(sms, icon, fun, t) {
    if (!t) {
        t = 1000;
    }
    wx.showToast({
        title: sms,
        duration: t,
        success: fun
    })
}

function showModal(c,t,fun) {
    if(!t)
        t='提示'
    wx.showModal({
        title: t,
        content: c,
        showCancel:false,
        success: fun
    })
}

function showCodetip() {
  showModal("1.请检查手机号输入是否正确，港澳台机海外手机请填写国际区号，再填写手机号码；\r\n2.如果安装了360卫士、安全管家、QQ管家等软件，请进入软件查询拦截记录，并将梵店短信设置为信任后重试；\r\n3.请清除手机缓存后重新获取;\r\n4.请确认您是否退订过（10690329157528）之类的短信，如果是，请联系运营商进行解除退订；\r\n5.如果以上方法都不能解决，请联系梵店客服", "收不到验证码？")
}

function isPhone(phone) {
  var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;

  if (!myreg.test(phone)) {
    return false;
  } else {
    return true;
  }
}

// 生成验证码  
function count_down(that, total_micro_second,status) {

  if (total_micro_second <= 0) {
    (status!="modal")?
    that.setData({
      getcodetext: "重新发送",
      phonechange:false

    })
    :
    that.setData({
      getcodetext1: "重新发送",
    });
    // timeout则跳出递归
    return;
  }

  // 渲染倒计时时钟
  (status != "modal") ?
  that.setData({
    getcodetext: date_format(total_micro_second)+'s后重新发送'
  })
  :
    that.setData({
      getcodetext1: date_format(total_micro_second)+'s后重新发送'
    })
  ;

  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that, total_micro_second,status);
  }, 10)



}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  return sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

function createCode() {
  let codeArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let length = 6;
  let code = "";
  for (let i = 0; i < length; i++) {
    let randomI = Math.floor(Math.random() * 10);
    code += codeArr[randomI];
  }
  return code;
}
function formatMoney(number, places, symbol) {
  number = number || 0;
  places = !isNaN(places = Math.abs(places)) ? places: 2;
  symbol = symbol !== undefined ? symbol: "￥";
  var negative = number < 0 ? "-": "",
  i = parseInt(number = Math.abs( + number || 0).toFixed(places), 10) + "",
  j = (j = i.length) > 3 ? j % 3 : 0;
  return symbol + negative + (j ? i.substr(0, j) + ",": "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ",") + (places ? "." + Math.abs(number - i).toFixed(places).slice(2) : "");
}
function imghttpurl(imgName){
  var httpurl = "http://uvanart1111.f3322.net:8088/upload/static/"
  imgName = imgName.replace(/\s+/g,"")
  return httpurl +imgName
}
//创建随机邀请码
function randomString(head,len) {
  var randomStr = head
　len = len || 32;
　var strArr = 'ABCDEFGHJKLMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
　var maxPos = strArr.length;
　for (let i = 0; i < len; i++) {
    randomStr += strArr.charAt(Math.floor(Math.random() * maxPos))
　}
　return randomStr
}
//生成UUID
function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  // s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid
}
//公共分享接口
function commonShare(shareContent,nickname,openid,productQRcode,invitationID,url){
  /*
  url, 页面地址
  shareContent, 商品ID或QRcode ,其他页面传页面标题
  nickname, 微信昵称 可以为空
  openid, 
  invitationID , 随机码
  productQRcode, 是商品二维码or图文二维码分享，qrcode/pic
  path , 页面url，梵星蒲公英邀请函通过个人中心点击转发，所以不能获取到真正的页面的url，需要手动填写
  */
  let path = ''
  if(url==""){
    let pages = getCurrentPages()
    let nowPages = pages[pages.length-1]
    path = nowPages.route
  }else {
    path = url
  }
  if(productQRcode!=""){
    path = path + '?qrcode='+productQRcode
  }
  let sharedata = {
    "data": {
      "Skey": path,
      "Svalue": shareContent,
      "NickName": nickname,
      "Openid": openid,
      "cssid": invitationID
    }
  }
  // api.post('/lr/s2bapi/ADD_CommonShareService', sharedata, 'application/json')
  ADD_CommonShareService(sharedata,'application/json')
  .then(res => {
    console.log(res)
  })
}
//访问分享接口
function commonVisitRecord(invitationID,originalOpenid){
  console.log(`测试测试${invitationID}${originalOpenid}`)
  /*
  invitationID,邀请链接随机码
  visitorOpenid,访问者
  originalOpenid,分享者
  */
  let visitorOpenid = wx.getStorageSync('openid') || ''
  wx.setStorageSync('originalOpenid',originalOpenid)
  if(visitorOpenid==''){
    api.wxlogin()
    .then(res => {
      debugger
      let data = {
        "code": res,
      }
      GetMyOpenid(data)
      .then(res => {
        debugger
        visitorOpenid = res.data.data;
        console.log("visitorOpenid:"+visitorOpenid)
        let inviteData = {
          // "token": "",
          // "loginMark": "",
          "data":{
            'qrcode_id': invitationID,
            'openid': visitorOpenid,
            'store_openid':originalOpenid,
            'source':'com'
          }
        }
        // api.post('/lr/s2bapi/GetInviteShareRecord',inviteData)
        GetInviteShareRecord(inviteData)
        .then(res=>{
          console.log(res)
        })
      })
    })
  }else{
    let inviteData = {
      // "token": "",
      // "loginMark": "",
      "data":{
        'qrcode_id': invitationID,
        'openid': visitorOpenid,
        'store_openid':originalOpenid,
        'source':'com'
      }
    }
    // api.post('/lr/s2bapi/GetInviteShareRecord',inviteData)
    GetInviteShareRecord(inviteData)
    .then(res=>{
      console.log(res)
    })
  }
}
//访问商品二维码分享接口
function productQRcodeRecord(scene){
  /*
  openid
  scene 二维码的参数
  */
  let visitorOpenid = wx.getStorageSync('openid') || ''
  //缓存没有openid的话就用接口取
  if(visitorOpenid==''){
    api.wxlogin()
    .then(res => {
      // let openiddata = {
      //   data: JSON.stringify({ "fromtype": "fandianvip", "code": res })
      // }
      // return api.get("/lr/uvanapi/GetWxOpenId", openiddata);
      let data = {
        "code": res
      }
      let header = 'application/json'
      // api.post(url,data,header)
      // login(data,header)
      GetMyOpenid(data)
      .then(res => {
        visitorOpenid = res.data.data;
        let senddata = {
          // "token": "",
          // "loginMark": "",
          "data": {
            "openid": visitorOpenid,
            "qrcode_id": scene,
            "source": "com"
          }
        }
        // api.get("/lr/s2bapi/scanqrcode", senddata)
        ScanQRCode(senddata)
        .then(res=>{
          console.log(res)
          wx.setStorage({key: "inviter",data: res.info})
        })
      })
    })
  }else{
    let senddata = {
      // "token": "",
      // "loginMark": "",
      "data": {
        "openid": visitorOpenid,
        "qrcode_id": scene,
        "source": "com"
      }
    }
    // api.get("/lr/s2bapi/scanqrcode", senddata)
    ScanQRCode(senddata)
    .then(res=>{
      console.log(res)
      wx.setStorage({key: "inviter",data: res.info})
    })
  }
  
}
//访问商品链接分享接口
function productLinkRecord(originalOpenid,productID){
  /*
  visitorOpenid,访问者
  originalOpenid,分享者
  productID
  */
  let visitorOpenid = wx.getStorageSync('openid') || ''
  //缓存没有openid的话就用接口取
  if(visitorOpenid==''){
    api.wxlogin()
    .then(res => {
      // let openiddata = {
      //   data: JSON.stringify({ "fromtype": "fandianvip", "code": res })
      // }
      // return api.get("/lr/uvanapi/GetWxOpenId", openiddata);
      let data = {
        "code": res
      }
      let header = 'application/json'
      // api.post(url,data,header)
      // login(data,header)
      GetMyOpenid(data)
      .then(res => {
        visitorOpenid = res.data.data;
        let senddata = {
          // "token": "",
          // "loginMark": "",
          "data": {
            "openid": visitorOpenid,
            "store_openid": originalOpenid,
            "product_id": productID,
            "source": "com"
          }
        }
        // api.get("/lr/s2bapi/scanqrcode", senddata)
        ScanQRCode(senddata)
        .then(res=>{
          console.log(res)
        })
      })
    })
  }else{
    var senddata = {
      // "token": "",
      // "loginMark": "",
      "data": {
        "openid": visitorOpenid,
        "store_openid": originalOpenid,
        "product_id": productID,
        "source": "com"
      }
    }
    // api.get("/lr/s2bapi/scanqrcode", senddata)
    ScanQRCode(senddata)
    .then(res=>{
      console.log(res)
    })
  }
  
}
//访问记录接口,onHide时候调用
function visitorRecordAPI(time,pagename){
  let _this = this
  //获取当前页面对象
  let pages = getCurrentPages()
  let nowPages = pages[pages.length-1]
  let url = nowPages.route
  let usertype = wx.getStorageSync('characterType') || ''
  let openid = wx.getStorageSync('openid') || ''
  if(openid == ''){
    api.wxlogin()
    .then(res => {
      // let openiddata = {
      //   data: JSON.stringify({ "fromtype": "fandianvip", "code": res })
      // }
      // return api.get("/lr/uvanapi/GetWxOpenId", openiddata);
      let data = {
        "code": res
      }
      let header = 'application/json'
      // api.post(url,data,header)
      // login(data,header)
      GetMyOpenid(data)
      .then(res => {
        openid = res.data.data;
        let usertypedata = {
          "data": openid
        }
        if(usertype==""){
          // api.post("/lr/s2bapi/validateusertype",usertypedata)
          ValidateUserType(usertypedata)
          .then(res=>{
            if(res.code == 200){
              usertype = res.data.F_UserType
            }else{
              usertype = '访客'
            }
            let recordData = {
              "data":{
                "F_openid": openid,
                "F_pagevalue": url,//页面路径
                "F_times": time,//停留时间
                "F_pagetype": pagename,//页面名称
                "F_custype": usertype//用户类型
              }
            }
            // api.post('/s2b/temactpi/Add_UserVisiteRecord',recordData,'application/json')
            Add_UserVisiteRecord(recordData,'application/json')
            .then(res=>{
              console.log(res)
            })
          })
        }else{
          let recordData = {
            "data":{
              "F_openid": openid,
              "F_pagevalue": url,//页面路径
              "F_times": time,//停留时间
              "F_pagetype": pagename,//页面名称
              "F_custype": usertype//用户类型
            }
          }
          // api.post('/s2b/temactpi/Add_UserVisiteRecord',recordData,'application/json')
          Add_UserVisiteRecord(recordData,'application/json')
          .then(res=>{
            console.log(res)
          })
        }
        
      })
    })
  }else{
    let usertypedata = {
      "data": openid
    }
    if(usertype==""){
      // api.post("/lr/s2bapi/validateusertype",usertypedata)
      ValidateUserType(usertypedata)
      .then(res=>{
        if(res.code == 200){
          usertype = res.data.F_UserType
        }else{
          usertype = '访客'
        }
        let recordData = {
          "data":{
            "F_openid": openid,
            "F_pagevalue": url,//页面路径
            "F_times": time,//停留时间
            "F_pagetype": pagename,//页面名称
            "F_custype": usertype//用户类型
          }
        }
        // api.post('/s2b/temactpi/Add_UserVisiteRecord',recordData,'application/json')
        Add_UserVisiteRecord(recordData,'application/json')
        .then(res=>{
          console.log(res)
        })
      })
    }else{
      let recordData = {
        "data":{
          "F_openid": openid,
          "F_pagevalue": url,//页面路径
          "F_times": time,//停留时间
          "F_pagetype": pagename,//页面名称
          "F_custype": usertype//用户类型
        }
      }
      // api.post('/s2b/temactpi/Add_UserVisiteRecord',recordData,'application/json')
      Add_UserVisiteRecord(recordData,'application/json')
      .then(res=>{
        console.log(res)
      })
    }
  }
}
//埋formid接口
function postformid(formid){
  var openid = wx.getStorageSync('openid');
  var data = {
    "opneId": openid,
    "fromId": formid
  }
  // api.post("/s2b/customer/AddCustomerFormID", data)
  AddCustomerFormID(data)
  .then(res => {
    console.log("上传formid");
    console.log(res);
  })
}

module.exports.showTip = showTip;
module.exports.showModal = showModal;
module.exports.isPhone = isPhone;
module.exports.showCodetip = showCodetip;
module.exports.createCode = createCode;
module.exports.count_down = count_down;
module.exports.formatMoney = formatMoney;
module.exports.imghttpurl = imghttpurl;
module.exports.randomString = randomString;
module.exports.uuid = uuid;
// module.exports.visitorRecordInfo = visitorRecordInfo;
module.exports.visitorRecordAPI = visitorRecordAPI;
module.exports.commonShare = commonShare;
module.exports.commonVisitRecord = commonVisitRecord;
module.exports.productQRcodeRecord = productQRcodeRecord;
module.exports.productLinkRecord = productLinkRecord;

module.exports.postformid = postformid;