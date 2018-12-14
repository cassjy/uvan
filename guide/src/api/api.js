import store from "../store";
import axios from "axios";
import Qs from "qs";
import { removeCookies } from "api/util.js";
import Vue from "vue";
var vue = new Vue();

// 默认配置
// let defHeader = 'application/json'
let defHeader = "application/x-www-form-urlencoded";

const instance = axios.create({
    baseURL: "http://am.frp.uvanart.com:9200",
    timeout: 20000,
    responseType: "json",
    transformRequest: [
        (data, headers) => {
            // 发送请求前对请求数据做处理
            if (data) {
                if (headers["Content-Type"] == "application/x-www-form-urlencoded") {
                    data = Qs.stringify(data.data);
                } else if(headers["Content-Type"] == "multipart/form-data"){
                  data = data.data;
                }else{
                  data = JSON.stringify(data.data);
                } 
                return data;
            }
        }
    ],
    transformResponse: [
        data => {
            const {code, info} = data;
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
        if (code == 902) {
            console.log("账号过期");
            console.log(response);
            let config = response.config;
            return login()
                .then(res => {
                    if (res.code == "200") {
                        var sid = res.data.sessionid;
                        store.commit("SET_SID", sid);
                        if (!window.localStorage) {
                            alert("浏览器不支持localstorage");
                        } else {
                            var storage = window.localStorage;
                        }
                        storage.setItem("sid", sid);
                        var newsid = "__sid=" + sid;
                        config.url = config.url.replace(/(?![?&])(__sid)=\w+/gi, newsid);
                        var datas = {};
                        debugger;
                        if (config.data.indexOf("{") != -1) {
                            datas.data = JSON.parse(config.data);
                        } else {
                            datas.data = Qs.parse(config.data);
                        }
                        config.data = datas;
                        console.log(config);
                        return instance(config);
                    } else {
                        console.log("第二次登录失败");
                    }
                })
                .catch(err => {
                    console.log("第二次登录失败");
                    // router.replace({
                    //     path: '/login'
                    // });
                    throw err;
                });
        }
        return response;
    },
    error => {
        return Promise.reject(error); // 返回接口返回的错误信息
        console.log("接口返回异常");
    }
);
// 当前开发模式
// console.log(`当前模式${process.env.NODE_ENV}`)
// if (process.env.NODE_ENV == 'development') {
//     instance.defaults.baseURL = 'http://am.frp.uvanart.com:9200';
// } else if (process.env.NODE_ENV == 'debug') {
//     instance.defaults.baseURL = 'http://am.frp.uvanart.com:9200';
// } else if (process.env.NODE_ENV == 'production') {
//     instance.defaults.baseURL = 'https://am.uvanart.com';
// }
console.log(`当前模式${process.env.NODE_ENV}`);
if (process.env.NODE_ENV == "development") {
    instance.defaults.baseURL = "http://am.frp.uvanart.com:9200";
    // instance.defaults.baseURL = "http://10.1.43.253:8980/js";
} else if (process.env.NODE_ENV == "debug") {
    instance.defaults.baseURL = "http://am.frp.uvanart.com:9200";
} else if (process.env.NODE_ENV == "production") {
    instance.defaults.baseURL = "http://am.frp.uvanart.com:9200";
// instance.defaults.baseURL = "https://am.uvanart.com";
// instance.defaults.baseURL = "https://amuat.uvanart.com";
}

let axiosMethod = ["get", "post"];
let api = {};
axiosMethod.forEach(method => {
    api[method] = (url, data, setHead) => {
        let headers;
        if (setHead) {
            headers = {
                headers: {
                    "Content-Type": setHead
                }
            };
        } else {
            headers = {
                headers: {
                    "Content-Type": defHeader
                }
            };
        }

        let datas;
        if (method == "post") {
            datas = {
                data
            };
        } else {
            datas = {
                params: data
            };
        }

        return new Promise((resolve, reject) => {
            instance[method](url, datas, headers)
                .then(response => {
                    console.log(datas);
                    var code = parseInt(response.data.code);
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
                        var data = {
                            code: 408,
                            msg: "网络请求超时"
                        };
                        console.log(`错误408:${data.msg}`);
                        resolve(data);
                    } else {
                        reject(error);
                    }
                });
        });
    };
});

function login() {
    let url = "/guide/login";
    if (!window.localStorage) {
        alert("浏览器不支持localstorage");
    } else {
        var storage = window.localStorage;
    }
    let data = {
        loginCode: storage.getItem("logincode"),
        passWord: storage.getItem("password")
    };
    return api.post(url, data);
}

export default api;