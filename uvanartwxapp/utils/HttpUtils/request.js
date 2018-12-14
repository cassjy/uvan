import Promise from '../../lib/js/es6-promise.min.js';
import regeneratorRuntime from '../API/wxPromise.min.js'
import Url from '../API/url.js'
const host = Url.host;
const postUrl = [];
var times = 0; //防止陷入死循环times小于5

// api统一处理
const request = (method = 'GET') => (url, data, contentType = "application/json", token) => {
  let reloggedData = { //重新登录后再次执行该接口
    method,
    url,
    data,
    contentType
  }
  return new Promise((resolve, reject) => {
    let _this = this;
    let ajaxKey = url;
    // 检测参数token是否存在，不存在则获取缓存中的token
    if (!token) {
      token = wx.getStorageSync('token')
    }
    // 拼接接口地址，防止接口重复执行
    try {
      ajaxKey += JSON.stringify(data);
    } catch (e) {
      ajaxKey += data
    }
    if (postUrl.includes(ajaxKey)) return; //接口重复执行时中断
    postUrl.push(ajaxKey); //新执行方法地址
    console.log('请求地址&参数url:' + `${url}` + 'data:' + `${JSON.stringify(data)}`);
    wx.request({
      url: host + url,
      data,
      method,
      header: {
        'Content-Type': contentType,
        'Token': token
      },
      success(res) {
        resolve(codehandling(res, reloggedData)) //reloggedData用于重新登录后再次执行该接口
      },
      fail(err) {
        console.log("语法错误" + url);
        wx.hideLoading();
        //断网情况下
        wx.showToast({
          title: "网络异常，请退出重试",
          icon: 'none',
          duration: 5000
        })
        reject(err)
      },
      complete() {
        postUrl.splice(postUrl.findIndex(item => item === ajaxKey), 1) //接口执行完成，删除数组中该接口地址
      }
    })
  })
}

// code统一处理
function codehandling(res, reloggedData) {
  console.log(res)
  let content = res.data.info + "";
  switch (parseInt(res.data.code)) {
    case 0:
      return res //token在header层级多一层
      break;
    case 200:
      console.log('请求成功');
      return res.data
      break;
    case 400:
      if (res.data.info == "未找到登录信息") {
        console.log('未登录@@@@' + reloggedData.url + content)
        // 异步执行重新登录公用方法
        asyncFuncLoading(reloggedData)
      } else {
        return res.data
      }
      break;
    case 401:
      console.log("" + reloggedData.url + content);
      return res.data
      break;
    case 403:
      // 异步执行重新登录公用方法
      asyncFuncLoading(reloggedData)
      break;
    case 500:
      wx.showToast({
        title: "服务异常，请稍后再试",
        icon: 'none',
        duration: 3000
      })
      console.log("服务端500####" + content);
      return res.data
      break;
    case 10002:
    case -100:
    case -1:
    case 30001:
      return res
      break;
    default:
      wx.showToast({
        title: "服务异常，请稍后再试",
        icon: 'none',
        duration: 3000
      })
      return res.data
      break;
  }
};

// 异步执行公用方法（重新登录操作）
const asyncFuncLoading = async(reloggedData) => {
  try {
    let checkTokenCode = await checkToken()
    console.log('checktoken-code=' + checkTokenCode) //checkTokenCode=0正常，-1未登录
    if (checkTokenCode == -1) {
      console.log('重新登录####')
      await login(reloggedData)
    } else if (checkTokenCode == 0) {
      console.log('403非法访问######')
      await login(reloggedData)
    }
  } catch (e) {
    console.log('checkToken-code获取失败')
    console.log(e)
  }

}

//检测token
function checkToken() {
  let token = wx.getStorageSync('token')
  return new Promise((resolve, reject) => {
    get('/api/user/checktoken', {}, 'application/x-www-form-urlencoded', token).then(res => {
        console.log(res)
        resolve(res.data.code)
      })
      .catch(err => {
        reject(err)
      })
  })
}

// 登录
function login(reloggedData) {
  if (times >= 5) {
    console.log('接口死循环，中断请求####')
    return;
  }
  wx.login({
    success: function(res) {
      console.log(res)
      return new Promise((resolve, reject) => {
        let logindata = {
          "code": res.code,
          "orginOpenId": ""
        }
        post('/api/user/login', logindata).then(res => {
          console.log('重新登录')
          console.log(res)
          if (res.data.code == 0 || res.data.code == 10002) {
            wx.setStorageSync('token', res.header.Token || res.header.token)
            if (reloggedData.method == "GET") { //登录后重新执行接口
              get(reloggedData.url, reloggedData.data, reloggedData.contentType).then(res => {
                console.log(res)
                if (res.code == 403 || (res.code == 400 && res.info == '未找到登录信息')) {
                  times++;
                } else {
                  times = 0;
                }
              })
            } else if (reloggedData.method == "POST") { //登录后重新执行接口
              post(reloggedData.url, reloggedData.data, reloggedData.contentType).then(res => {
                console.log(res)
                if (res.code == 403 || (res.code == 400 && res.info == '未找到登录信息')) {
                  times++;
                } else {
                  times = 0;
                }
              })
            }
          }
        })
      })
    },
    fail: function(res) {
      console.log('获取微信code失败')
      console.log(res)
    }
  })
}

// 取缓存
export const getStorage = (key) => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: function(res) {
        resolve(res.data)
      },
      fail: function(err) {
        reject(err)
      }
    })
  })
}



//设置缓存
export const setStorage = (key, data) => {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: key,
      data: data,
      success: function(res) {
        resolve(res)
      },
      fail: function(err) {
        reject(err)
      }
    })
  })
}

//微信登录取到code
export const wxlogin = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function(res) {
        resolve(res.code);
      },
      fail: function(res) {
        reject(res);
      }
    })
  })
}

export const get = request('GET');
export const post = request('POST')