/*
 * @Author: generalzhang 
 * @Date: 2018-10-25 10:19:57 
 * @Last Modified by: generalzhang
 * @Last Modified time: 2018-11-21 15:33:00
 * 根据钉钉的环境输出，进行登录，更新token和user信息，方法直接执行即可
 */
//判断环境
import { getuuid } from "common/js/common.js";
import api from "./api";
import store from "../store";
import { URL } from "api/url";
console.log("进入dingenv.js");
const agentId =
  URL.mode == "dev"
    ? "194762245"
    : URL.mode == "pre"
      ? "194893302"
      : "193665940";
var checkenv = function() {
  var env = "mobile";
  if (!(dd.version || DingTalkPC.ua.isDesktop)) {
    env = "chrome";
  } else if (dd.version) {
    env = "mobile";
  } else if (DingTalkPC.ua.isDesktop) {
    env = "pc";
  }
  return env;
};
var signInit = function() {
  console.log("进入signInit");
  return new Promise(function(resolve, reject) {
    var date = new Date();
    var index = window.location.href.indexOf("#");
    var url1;
    if (index == -1) {
      url1 = window.location.href;
    } else {
      url1 = window.location.href.slice(0, index);
    }
    var data = {
      url: url1,
      nonceStr: getuuid(),
      timeStamp: date.getTime()
    };
    api
      .post("fzLogin/fzSign", data)
      .then(res => {
        var _config = {
          agentId: agentId,
          corpId: res.data.corpId,
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature
        };
        // _config.agentId = agentId;
        // _config.corpId = res.data.corpId;
        // _config.timeStamp = res.data.timeStamp;
        // _config.nonceStr = res.data.nonceStr;
        // _config.signature = res.data.signature;
        debugger;
        resolve(_config);
      })
      .catch(err => {
        reject(err);
      });
  });
};
//从钉钉推送消息进去，用的是移动端的样式，但是登录要用DingTalkPC
var pcMessLogin = function() {
  return new Promise(function(resolve, reject) {
    signInit().then(_config => {
      console.log("进入pcMessLogin");
      console.log(_config.agentId);
      DingTalkPC.config({
        agentId: _config.agentId, // 必填，微应用ID
        corpId: _config.corpId, //必填，企业ID
        timeStamp: _config.timeStamp, // 必填，生成签名的时间戳
        nonceStr: _config.nonceStr, // 必填，生成签名的随机串
        signature: _config.signature, // 必填，签名
        type: 0, //选填，0表示微应用的jsapi，1表示服务窗的jsapi，不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
        jsApiList: [
          "runtime.info",
          "biz.contact.choose",
          "device.notification.confirm",
          "device.notification.alert",
          "device.notification.prompt",
          "biz.ding.post",
          "biz.util.openLink"
        ] // 必填，需要使用的jsapi列表，注意：不要带dd。
      });
      DingTalkPC.ready(function() {
        debugger;
        console.log("进入了两次ready");
        var corpId = "dingde55314a8e20f3f6";
        DingTalkPC.runtime.permission.requestAuthCode({
          corpId: corpId, //企业ID
          onSuccess: function(data) {
            debugger;
            var code = data.code;
            var data = {
              ddCode: code
            };
            api.post("fzLogin/fzLogin", data).then(res => {
              DingTalkPC.runtime.permission.requestAuthCode({
                corpId: corpId,
                onSuccess: function(data) {
                  var user = {
                    userid: res.data.userid,
                    name: res.data.name,
                    code: data.code,
                    avatar: res.data.avatar,
                    department: res.data.dingDepartmentList[0].name,
                    phone: res.data.mobile
                  };
                  debugger;
                  store.commit("SET_TOKEN", res.data.uvan_token);
                  store.commit("setUser", user);
                  store.commit("setDingDingUser", res.data);
                  resolve("pc端非iframe登录成功");
                }
              });
            });
          },
          onFail: function(err) {
            console.log(err);
            reject(err);
          }
        });
      });
      DingTalkPC.error(function(err) {
        alert("dd error: " + JSON.stringify(err));
        reject(err);
      });
    });
  });
};
//钉钉桌面微应用进去，ifame的方式
var pcDingLogin = function() {
  return new Promise(function(resolve, reject) {
    console.log("进入pcDingLogin");
    var int = 0;
    let time = setInterval(() => {
      console.log(store.getters.code);
      debugger;
      if (store.getters.code != "123") {
        var data = {
          ddCode: store.getters.code
        };
        api.post("fzLogin/fzLogin", data).then(res => {
          var user = {
            userid: res.data.userid,
            name: res.data.name,
            code: store.getters.code,
            avatar: res.data.avatar,
            department: res.data.dingDepartmentList[0].name,
            phone: res.data.mobile
          };
          debugger;
          store.commit("SET_TOKEN", res.data.uvan_token);
          store.commit("setUser", user);
          store.commit("setDingDingUser", res.data);
          store.commit("SET_CODE", "123");
          resolve();
        });
        clearInterval(time);
      }
      int++;
      if (int >= 20) {
        clearInterval(time);
        reject("登录失败");
      }
    }, 500);
  });
};
//移动端登录
var mobileLogin = function() {
  return new Promise(function(resolve, reject) {
    console.log("进入mobileLogin");
    signInit().then(_config => {
      debugger;
      console.log(_config.agentId);
      dd.config({
        agentId: _config.agentId, // 必填，微应用ID
        corpId: _config.corpId, //必填，企业ID
        timeStamp: _config.timeStamp, // 必填，生成签名的时间戳
        nonceStr: _config.nonceStr, // 必填，生成签名的随机串
        signature: _config.signature, // 必填，签名
        type: 0, //选填，0表示微应用的jsapi，1表示服务窗的jsapi，不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
        jsApiList: [
          "runtime.info",
          "biz.contact.choose",
          "device.notification.confirm",
          "device.notification.alert",
          "device.notification.prompt",
          "biz.ding.post",
          "biz.util.openLink"
        ] // 必填，需要使用的jsapi列表，注意：不要带dd。
      });
      dd.ready(function() {
        debugger;
        console.log(dd);
        var corpId = "dingde55314a8e20f3f6";
        dd.runtime.permission.requestAuthCode({
          corpId: corpId,
          onSuccess: function(data) {
            var code = data.code;
            var data = {
              ddCode: code
            };
            api.post("fzLogin/fzLogin", data).then(res => {
              dd.runtime.permission.requestAuthCode({
                corpId: corpId,
                onSuccess: function(data) {
                  var user = {
                    userid: res.data.userid,
                    name: res.data.name,
                    code: data.code,
                    avatar: res.data.avatar,
                    department: res.data.dingDepartmentList[0].name,
                    phone: res.data.mobile
                  };
                  store.commit("SET_TOKEN", res.data.uvan_token);
                  store.commit("setUser", user);
                  store.commit("setDingDingUser", res.data);
                  resolve("移动端登录成功");
                }
              });
            });
          },
          onFail: function(error) {
            $("#demo").html("dd.requestAuthCode error!");
            reject(error);
          }
        });
      });
      dd.error(function(error) {
        console.log(error);
        reject(error);
      });
    });
  });
};

export { dingdingLogin, checkenv, pcMessLogin, pcDingLogin, mobileLogin };
