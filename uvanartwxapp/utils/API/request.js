import Promise from '../../lib/js/es6-promise.min.js';
import Url from 'url.js';
const host = Url.host;
const postUrl = [];

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};

export const request = (method = 'GET') => (url, data, header = 'application/json',token) => {
  return new Promise((resolve, reject) => {
    //
    if(!token){
      token = wx.getStorageSync('token')
    }
    var _this = this;
    var ajaxKey = url;
    try {
      ajaxKey += JSON.stringify(data);
      token = wx.getStorageSync("token")
    } catch (e) {
      ajaxKey += data
    }
  
    //防止多次请求接口
    if (postUrl.includes(ajaxKey))return;
    postUrl.push(ajaxKey);
    url = url.replace(/\s+/g, "");
    console.log('url:' + `${url}` + 'data:' + `${JSON.stringify(data)}`);
    wx.request({
      url: host+url,
      data,
      method,
      header: {
        'Content-Type': header,
        'Token': token
      },
      success: function (res) {
        console.log('请求结果url:' + `${url}` + 'data:' + `${JSON.stringify(res.data)}`);
        //限制接口几秒内返回
        // sleep(3000);
        var content = res.data.info+"";
        console.log(res.data)
        if (res.data.code == 200){
          content = "成功";
          console.log(content);
          resolve(res.data);

        } else if (res.data.code == 400){
          console.log("未登录@@@@"+url+content);
          if (res.data.info == "未找到登录信息"){
            //若token过期做重新登录
            var token = wx.getStorageSync("token");
            get('/api/user/checktoken', {}, 'application/x-www-form-urlencoded',token)
              .then(res => {
                if (res.data.code == 0) {

                } else if (res.data.code == -1) {
                  wxlogin()
                    .then(res => {
                      let logindata = {
                        "code": res,
                        "orginOpenId": ""
                      }
                      post('/api/user/login', logindata)
                        .then(res => {
                          if (res.data.code == 0) {
                            console.log(res)
                            wx.setStorageSync('token', res.header.Token || res.header.token)
                            if (method == "GET") {
                              get(url, data, header).then(res => {
                                resolve(res)
                              })
                            } else {
                              post(url, data, header).then(res => {
                                resolve(res)
                              })

                            }
                          } else if (res.data.code == 10002) {
                            console.log(res)
                            wx.setStorageSync('token', res.header.Token || res.header.token)
                            if (method == "GET") {
                              get(url, data, header).then(res=>{
                                resolve(res)
                              })
                            } else {
                              post(url, data, header).then(res => {
                                resolve(res)
                              })
                            }
                          }
                        })
                    })
                }
              })
          }else{
            resolve(res.data)
          }
        } else if (res.data.code == 500){
          wx.showToast({
            title: "服务异常，请稍后再试",
            icon: 'none',
            duration: 3000
          })
          console.log("服务端500####" + content);
          resolve(res.data)
        } else if (res.data.code == 401) {
          console.log("" + url + content);
          resolve(res.data)
        } else if (res.data.code == 0){
          content = "成功";
          console.log(content);
          resolve(res)
        } else if (res.data.code == 10002){
          resolve(res)
        } else if (res.data.code == -100){
          resolve(res)
        } else if (res.data.code == -1){
          resolve(res)
        } else if (res.data.code == 30001) {
          resolve(res)
        } else{
          wx.showToast({
            title: "服务异常，请稍后再试",
            icon: 'none',
            duration: 3000
          })
          resolve(res.data)
        }
      },
      fail: function (err) {
        wx.hideLoading();
        console.log("语法错误"+url);
        //断网情况下
        wx.showToast({
          title: "网络异常，请退出重试",
          icon: 'none',
          duration: 5000
        })
        reject(err)
      },
      complete:function(){
        postUrl.splice(postUrl.findIndex(item => item === ajaxKey), 1)
      }
    });
  })
}

// 取缓存
export const getStorage = (key)=>{
  return new Promise((resolve, reject) =>{
    wx.getStorage({
      key: key,
      success: function(res) {
        resolve(res.data)
      },
      fail:function(err){
        reject(err)
      }
    })
  })
}



//设置缓存
export const setStorage = (key,data) => {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: key,
      data:data,
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

//微信登录取到code
export const wxlogin =()=>{
  return new Promise((resolve,reject)=>{
      wx.login({
        success:function(res){
          resolve(res.code);
        },
        fail:function(res){
          reject(res);
        }
      })
  })
}
//同步静止函数，等待多少秒
export const  sleep=(d)=>{
  var t = Date.now();
  while (Date.now() - t <= d);
}

export const get = request('GET');
export const post = request('POST');
export const put = request('PUT');
export const del = request('DELETE');