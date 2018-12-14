import store from "../store";
import axios from "axios";
import Qs from "qs";
import { removeCookies } from "api/util.js";
import { URL } from "api/url";
import {
  checkenv,
  pcMessLogin,
  pcDingLogin,
  mobileLogin
} from "api/dingenv.js";
console.log("api文件store:");
console.log(store);
console.log("进入api.js");
console.log("api文件token" + `${store.getters.token}`);
const token = store.getters.token;
// 默认配置
// let defHeader = 'application/json'
let defHeader = "application/x-www-form-urlencoded";
// let baseurl = "http://10.0.75.1:8080/a/fz/";

let baseurl = "http://am.frp.uvanart.com:9200/a/fz/"; //开发
// let baseurl = "http://amfz.frp.uvanart.com:9200/a/fz/"; //稳定
// let baseurl = "https://amfz.uvanart.com/a/fz/"; //正式库
// let baseurl = "https://amuat.uvanart.com/a/fz/"; //预上线
// let baseurl = "http://192.168.2.192:8080/a/fz/";
if (URL.mode == "dev") {
  baseurl = "http://am.frp.uvanart.com:9200/a/fz/";
} else if (URL.mode == "pre") {
  baseurl = "https://amuat.uvanart.com/a/fz/";
} else {
  baseurl = "https://amfz.uvanart.com/a/fz/";
}
const instance = axios.create({
  baseURL: "http://am.frp.uvanart.com:9200",
  baseURL: baseurl,

  timeout: 10000,
  responseType: "json",
  transformRequest: [
    (data, headers) => {
      // 发送请求前对请求数据做处理
      var token = store.getters.token;
      headers["token"] = token;
      if (data) {
        if (headers["Content-Type"] == "application/x-www-form-urlencoded") {
          data = Qs.stringify(data.data);
        } else if (headers["Content-Type"] == "application/json") {
          data = JSON.stringify(data.data);
        } else {
          data = data.data;
        }
        return data;
      }
    }
  ],
  transformResponse: [
    data => {
      const { code, info } = data;
      if (code == 400 && info == "未找到登录信息") {
        removeCookies("token");
        window.location.href = "/#/login";
      }
      return data;
    }
  ]
});
instance.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
instance.interceptors.response.use(
  response => {
    var code = parseInt(response.data.code);
    if (code == 11000) {
      console.log("账号过期");
      let config = response.config;
      console.log(config);
      console.log("111111111111111--------------");
      //重新登录
      var env = checkenv();
      if (env == "mobile") {
        //这个return才能返回结果给原来的接口
        return mobileLogin().then(res => {
          console.log(res);
          //最好输出tokenuserid查看一下

          //
          var datas = {};
          debugger;
          console.log("111111111111111--------------");
          console.log(config);
          if (!config.data) {
          } else if (config.data.indexOf("{") != -1) {
            datas.data = JSON.parse(config.data);
          } else {
            datas.data = Qs.parse(config.data);
          }
          config.data = datas;
          console.log(config);
          return instance(config);
          //
        });
      } else if (env == "pc" && window.frames.length != parent.frames.length) {
        //微应用进入pc
        //@@@@@@@@@@@@@@@@这里可能还是需要修改，发送到父级iframe，让父级再传送回来
        var data = "relogin";
        console.log("过期用的pc登录~~~~~~~~~~~");
        parent.postMessage(data, "*");
        console.log("077777777777777777777777777777请求1110过期");
        return pcDingLogin().then(res => {
          debugger;
          // console.log(res);
          //最好输出tokenuserid查看一下
          var datas = {};
          if (!config.data) {
          } else if (config.data.indexOf("{") != -1) {
            datas.data = JSON.parse(config.data);
          } else {
            datas.data = Qs.parse(config.data);
          }
          config.data = datas;
          console.log(config);
          return instance(config);
        });
      } else if (env == "pc" && window.frames.length == parent.frames.length) {
        console.log("来源~~~~~~~~~~~~~");
        return pcMessLogin().then(res => {
          console.log(res);
          //最好输出tokenuserid查看一下
          var datas = {};
          debugger;
          if (!config.data) {
          } else if (config.data.indexOf("{") != -1) {
            datas.data = JSON.parse(config.data);
          } else {
            datas.data = Qs.parse(config.data);
          }
          config.data = datas;
          console.log(config);
          return instance(config);
          //
        });
      }
      // var datas = {};
      // debugger;
      // if (config.data.indexOf("{") != -1) {
      //   datas.data = JSON.parse(config.data);
      // } else {
      //   datas.data = Qs.parse(config.data);
      // }
      // config.data = datas;
      // console.log(config);
      // return instance(config);

      // console.log(api.login());
      // return api
      //   .login()
      //   .then(res => {
      //     if (res == "success") {
      //       var sid = "";
      //       debugger;
      //       store.commit("SET_SID", sid);
      //       if (!window.localStorage) {
      //         alert("浏览器不支持localstorage");
      //       } else {
      //         var storage = window.localStorage;
      //       }
      //       storage.setItem("sid", sid);
      //       var datas = {};
      //       debugger;
      //       if (config.data.indexOf("{") != -1) {
      //         datas.data = JSON.parse(config.data);
      //       } else {
      //         datas.data = Qs.parse(config.data);
      //       }
      //       config.data = datas;
      //       console.log(config);
      //       return instance(config);
      //     } else {
      //       console.log("第二次登录失败");
      //     }
      //   })
      //   .catch(err => {
      //     console.log("第二次登录失败");
      //     // router.replace({
      //     //     path: '/login'
      //     // });
      //     throw err;
      //   });
    }
    return response;
  },
  error => {
    return Promise.reject(error); // 返回接口返回的错误信息
    console.log("接口返回异常");
  }
);

let axiosMethod = ["get", "post"];
let api = {};
axiosMethod.forEach(method => {
  api[method] = (url, data, setHead) => {
    let headers;
    console.log("api.js接口token" + token);
    debugger;
    if (setHead) {
      headers = {
        headers: { "Content-Type": setHead }
      };
    } else {
      headers = {
        headers: { "Content-Type": defHeader }
      };
    }

    let datas;
    if (method == "post") {
      datas = { data };
    } else {
      datas = { params: data };
    }

    return new Promise((resolve, reject) => {
      instance[method](url, datas, headers)
        .then(response => {
          console.log(datas);
          var code = parseInt(response.data.code);
          debugger;
          console.log("返回的header信息");

          console.log(response.headers);
          if (response.headers.token) {
            //Headers
            debugger;
            store.commit("SET_TOKEN", response.headers.token);
          }
          switch (code) {
            case 200:
              resolve(response.data);
              console.log("获取成功");
              break;
            case 500:
              if (process.env.NODE_ENV !== "production") {
                console.log(
                  `${response.config.method}: ${
                    response.config.url
                  }, 返回(data): ${JSON.stringify(response.data)}`
                );
              }
              resolve(response.data);
              break;
            case 900:
              console.log(`错误900:${response.data.msg}`);
              resolve(response.data);
              break;
            default:
              console.log(`未知code: ${response.data.code}`);
              resolve(response.data);
              break;
          }
        })
        .catch(error => {
          console.log("提交失败:", error);
          debugger;
          if (error.message.indexOf("timeout") != -1) {
            var error = {
              code: 408,
              msg: "网络请求超时"
            };
            console.log(`错误408:${data.msg}`);
            reject(error);
          } else {
            reject(error);
          }
        });
    });
  };
});
// function login() {
//   let url = "/guide/login";
//   if (!window.localStorage) {
//     alert("浏览器不支持localstorage");
//   } else {
//     var storage = window.localStorage;
//   }
//   let data = {
//     loginCode: storage.getItem("logincode"),
//     passWord: storage.getItem("password")
//   };
//   return api.post(url, data);
// }
// api.login = () => {
//   if (DingTalkPC && DingTalkPC.ua.isDesktop && DingTalkPC.ua.isInDingTalk) {
//     DingTalkPC.runtime.permission.requestAuthCode({
//       corpId: "dingde55314a8e20f3f6", //企业ID
//       onSuccess: function(data) {
//         var code = data.code;
//         var data = {
//           ddCode: code
//         };
//         api.post("fzLogin/fzLogin", data).then(res => {
//           DingTalkPC.runtime.permission.requestAuthCode({
//             corpId: "dingde55314a8e20f3f6",
//             onSuccess: function(data) {
//               var user = {
//                 userid: res.data.userid,
//                 name: res.data.name,
//                 code: data.code,
//                 avatar: res.data.avatar,
//                 department: res.data.dingDepartmentList[0].name
//               };
//               store.commit("setUser", user);
//             }
//           });
//         });
//       },
//       onFail: function(err) {
//         console.log(err);
//       }
//     });
//   } else {
//     if (dd.version) {
//       dd.ready(function() {
//         debugger;
//         dd.runtime.permission.requestAuthCode({
//           corpId: "dingde55314a8e20f3f6",
//           onSuccess: function(data) {
//             var code = data.code;
//             var data = {
//               ddCode: code
//             };
//             api.post("fzLogin/fzLogin", data).then(res => {
//               dd.runtime.permission.requestAuthCode({
//                 corpId: "dingde55314a8e20f3f6",
//                 onSuccess: function(data) {
//                   var user = {
//                     userid: res.data.userid,
//                     name: res.data.name,
//                     code: data.code,
//                     avatar: res.data.avatar,
//                     department: res.data.dingDepartmentList[0].name
//                   };
//                   store.commit("setUser", user);
//                 }
//               });
//             });
//           },
//           onFail: function(err) {
//             alert("requestAuthCode fail: " + JSON.stringify(err));
//             alert("获取钉钉信息失败，请退出再重试，");
//           }
//         });
//       });
//     } else {
//       //本地有缓存的就不要再重新走一遍了
//       var data = {
//         ddCode: "6ace1de076c64ed59f1f51cf1ac6fe7f"
//       };
//       debugger;
//       api.post("fzLogin/fzLogin", data).then(res => {
//         alert(JSON.stringify(res));
//         var user = {
//           userid: res.data.userid ? res.data.userid : "111",
//           name: res.data.name ? res.data.name : "222",
//           code: data.ddCode,
//           avatar: res.data.avatar,
//           department: res.data.dingDepartmentList
//             ? res.data.dingDepartmentList[0].name
//             : "IT开发部"
//         };
//         store.commit("setUser", user);
//       });
//     }
//   }
// };
export default api;
