import Url from 'API/url.js';
const {readUvanartToken} = require('./StorageUtils.js');


let kHost = Url.host + '/';

const NetworkStatusCode = {
    // (服务器返回code: 200;)
    OK: '200',
    // (服务器返回code: 400;)
    BadRequest: '400',
    // 未经授权的(服务器返回code: 401;)
    Unauthorized: '401',
    // (服务器返回code: 402;)
    PaymentRequired: '402',
    // (服务器返回code: 403;)
    Forbidden: '403',
    // 未找到(服务器返回code: 404;)
    NotFound: '404',

    // (服务器返回code: 500;)
    InternalServerError: '500',
    // (服务器返回code: 501;)
    NotImplemented: '501',
    // (服务器返回code: 502;)
    BadGateway: '502',
    // (服务器返回code: 503;)
    ServiceUnavailable: '503',
    // 其它code
    UndefinedStatusCode: '',
};


const UrlType = {
    uvanstarlogin3: 'lr/adms/uvanstarlogin3',
    myshoppingcart: 'lr/s2bapi/myshoppingcart',
    addshoppingcart: 'lr/s2bapi/addshoppingcarts',
    delshoppingcart: 'lr/s2bapi/delshoppingcart',
    editshoppingcart: 'lr/s2bapi/editshoppingcart',
    getmyaddress: 'lr/s2bapi/getmyaddress',
    getfreightbyarea: 'lr/k3api/getfreightbyarea',
    modifyorderstatus: 'lr/s2bapi/modifyorderstatus',
    // wxpaydata: 'lr/uvanapi/wxpaydata',
    wxpaydata: '/s2b/tencentpay/getprepayid',
    createorder: 'lr/s2bapi/createorder',
}


function getUrl(urlType = '') {
    return kHost + urlType;
}

// 网络请求成功处理
function handleSuccess(response) {
    console.log(response)

}

// 网络请求失败处理
function handleFailure(error) {
    console.warn('网络错误');
    wx.showLoading({
        title: '服务器繁忙',
        image: '../../images/toast_note.png',
    });
    wx.stopPullDownRefresh();
    setTimeout(function() {
        wx.hideLoading();
        wx.hideLoading();
    }, 800);
}

function unauthorized() {

}

function requestPOST({url = '', body = {}, success = handleSuccess, fail = handleFailure}) {
    // const token = '';
    const token = wx.getStorageSync('token');
    wx.request({
        url,
        method: 'POST',
        data: body,
        header: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'Authorization': token
            'Token': token
        },
        success: function(response) {
            if (typeof success == 'function') {
                if (`${response.data.code}` === '200') {
                    wx.stopPullDownRefresh();
                    wx.hideLoading();
                } else {
                    if (response.data.info === '订单中包含已售罄的商品，请删除后再提交订单') {
                        wx.showToast({
                            title: '订单中包含已售罄的商品，请删除后再提交订单',
                            icon: 'none',
                            duration: 2000
                        })
                    } else {
                        wx.showLoading({
                            title: response.data.info || '服务器错误',
                            image: '../../images/toast_note.png',
                        });
                    }

                    wx.stopPullDownRefresh();
                    setTimeout(function() {
                        wx.hideLoading();
                    }, 1200);
                }

                setTimeout(function() {
                    success(response);
                }, 400);
            }

        },
        fail: function(error) {
            if (typeof fail == 'function') {
                fail(error);
            }
        },
    })
}

function requestGET({url = '', body = {}, success = handleSuccess, fail = handleFailure}) {
    // const token = '';
    const token = wx.getStorageSync('token');
    wx.request({
        url,
        method: 'GET',
        // data: body,
        header: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'Authorization': token
            'Token': token
        },
        success: function(response) {
            if (typeof success == 'function') {
                if (`${response.data.code}` === '200') {
                    wx.stopPullDownRefresh();
                    wx.hideLoading();
                } else {
                    wx.showLoading({
                        title: response.data.info || '服务器错误',
                        image: '../../images/toast_note.png',
                    });
                    wx.stopPullDownRefresh();
                    setTimeout(function() {
                        wx.hideLoading();
                    }, 1200);
                }

                setTimeout(function() {
                    success(response);
                }, 400);
            }

        },
        fail: function(error) {
            if (typeof fail == 'function') {
                fail(error);
            }
        },
    })
}

function login({body = {}, success = handleSuccess, fail = handleFailure}) {
    const url = getUrl(UrlType.uvanstarlogin3);

    requestPOST({
        url,
        body,
        success,
        fail,
    });
}

function getMyShoppingCart({body = {}, success = handleSuccess, fail = handleFailure}) {
    const token = readUvanartToken();
    const phone = wx.getStorageSync('phone');
    const openId = wx.getStorageSync('openid');
    const url = getUrl(UrlType.myshoppingcart) + `?token=${token}&loginMark=${phone}&data=${openId}`;

    requestGET({
        url,
        success,
        fail,
    })
}

function addShoppingCart({body = [], success = handleSuccess, fail = handleFailure}) {
    console.log('addShoppingCart');
    if (body.length < 1) {
        fail({
            error: '待加入数据为空!'
        });
        return;
    }
    const token = readUvanartToken();

    let data = body.map(function(product, index) {
        const {product_id = '', count = 1, combination_id = ''} = product;
        return {
            product_id,
            count,
            combination_id,
        };
    });
    console.log(data);
    const loginMark = wx.getStorageSync('phone');
    const url = getUrl(UrlType.addshoppingcart);
    const body2 = {
        token,
        loginMark,
        data,
    };

    requestPOST({
        url,
        body: body2,
        success,
        fail,
    });
}

/**
 * 删除购物车
 * body: 购物车id
 */
function delshoppingcart({body = "", success = handleSuccess, fail = handleFailure}) {

    /**
      {
        "token": "75cf99f1-c769-4cbc-8ec0-9dd19fb81250",
        "loginMark": "13556922924",
        "data": "21b925da-f611-40f0-b9c5-9d1a62f55965"
      }
      参数data为购物车数据的id
     */

    console.log('delshoppingcart');

    const url = getUrl(UrlType.delshoppingcart);
    const token = readUvanartToken();
    const loginMark = wx.getStorageSync('phone');
    const body2 = {
        token,
        loginMark,
        data: body,
    };

    requestPOST({
        url,
        body: body2,
        success,
        fail,
    });

}

/**
 * 编辑购物车
 * body: {id, count}
 */
function editshoppingcart({body = {}, success = handleSuccess, fail = handleFailure}) {
    /**
      编辑购物车：
      {
          "token": "75cf99f1-c769-4cbc-8ec0-9dd19fb81250",
          "loginMark": "13556922924",
          "data": {"id":"21b925da-f611-40f0-b9c5-9d1a62f55965","count": 3,"combination_id":0}
      }
      参数id为购物车数据的id
    */

    const url = getUrl(UrlType.editshoppingcart);
    const token = readUvanartToken();
    const loginMark = wx.getStorageSync('phone');
    const body2 = {
        token,
        loginMark,
        data: body,
    };

    requestPOST({
        url,
        body: body2,
        success,
        fail,
    });
}

function getMyAddress({success = handleSuccess, fail = handleFailure}) {
    // https://wxapp.uvanart.com/lr/s2bapi/getmyaddress?token=' + token + '&loginMark=' + phone + '&data=' + openid + '
    const token = readUvanartToken();
    const phone = wx.getStorageSync('phone');
    const openId = wx.getStorageSync('openid');
    const url = getUrl(UrlType.getmyaddress) + `?token=${token}&loginMark=${phone}&data=${openId}`;

    requestGET({
        url,
        success,
        fail,
    });
}

function getFreightByArea({body = {}, success = handleSuccess, fail = handleFailure}) {
    const token = readUvanartToken();
    const phone = wx.getStorageSync('phone');
    const {province = '', city = '', district = '', deliveryMethod = '', money = 0} = body;

    const url = getUrl(UrlType.getfreightbyarea);
    const body2 = {
        token,
        loginMark: phone,
        data: {
            province,
            city,
            district,
            deliveryMethod,
            money,
        },
    };

    requestPOST({
        url,
        body: body2,
        success,
        fail,
    });
}

// 修改订单状态 F_OrderStatus: A;成功 F_OrderStatus: F;失败
function modifyOrderStatus({body = {}, success = handleSuccess, fail = handleFailure}) {
    const url = getUrl(UrlType.modifyorderstatus);
    const token = readUvanartToken();
    const phone = wx.getStorageSync('phone');

    const {F_OrderNo = '', F_OrderStatus = ''} = body;

    const body2 = {
        token,
        loginMark: phone,
        data: {
            F_OrderNo,
            F_OrderStatus,
        },
    }

    requestPOST({
        url,
        body: body2,
        success,
        fail,
    });

}

// 只用于获取支付信息
function requestPay({url = '', body = {}, success = handleSuccess, fail = handleFailure}) {
    const token = '';
    wx.request({
        url,
        method: 'GET',
        data: {
            id: body.id,
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Token': wx.getStorageSync('token')
        },
        success: function(response) {
            if (typeof success == 'function') {
                if (`${response.data.code}` === '200') {
                    wx.stopPullDownRefresh();
                    wx.hideLoading();
                } else {
                    wx.showLoading({
                        title: response.data.info || '服务器错误',
                        image: '../../images/toast_note.png',
                    });
                    wx.stopPullDownRefresh();
                    setTimeout(function() {
                        wx.hideLoading();
                    }, 1200);
                }

                setTimeout(function() {
                    success(response);
                }, 400);
            }

        },
        fail: function(error) {
            if (typeof fail == 'function') {
                fail(error);
            }
        },
    })
}

// 获取微信支付信息
function getWxpaydata({body = {}, success = handleSuccess, fail = handleFailure}) {
    const url = getUrl(UrlType.wxpaydata);
    const openid = wx.getStorageSync('openid') || '';
    // const body2 = {
    //   data: Object.assign({}, body, {
    //     openid,
    //   }),
    // };
    // const body2 = Object.assign({}, body, {
    //   openid,
    // });

    requestPay({
        url,
        body: body,
        success,
        fail,
    });
}

// 创建订单
/**
{
  "token": "a59b6a44-bc40-4a26-8fa1-61d1b5734101",
  "loginMark": "15815669031",
  "data": {
    "orderentity": {
      "F_VanStarOpenID":"oQCP70JifHf3kR5fJSno3E0VNzA8",
      "F_ShipAddressId":"3d6e3d55-e76d-432b-9938-a8923cb82b6c",
      "F_ShippingMethod":"送货上门",
      "F_Freight":0,
      "F_Remarks":"备注",
      "F_DiscountAmount":10,
      "F_DiscountCode": '', //优惠码
    },
    "orderdetailentity":[
      {
      "F_ProductID":"13532",
      "F_ProductNumber":1,
      "F_ProductSpecification":"8841"
      }
    ]
  }
}
 */
function createOrder({body = {}, success = handleSuccess, fail = handleFailure}) {
    const url = getUrl(UrlType.createorder);
    const token = readUvanartToken();
    const phone = wx.getStorageSync('phone');
    const openid = wx.getStorageSync('openid');

    const {F_ShipAddressId = '', F_ShippingMethod = '', F_PaymentMethod = '', F_Freight = 0, F_Remarks = '', F_DiscountAmount = 0, F_DiscountCode = '', F_Longitude = 0, F_Latitude = 0, F_StoreId = '', F_StoreName = '', F_OrderType = '', F_ID = '', orderdetailentity = []} = body;

    const body2 = {
        // token,
        loginMark: phone,
        data: {
            orderentity: {
                // F_VanStarOpenID: openid,
                F_ShipAddressId,
                F_ShippingMethod,
                F_PaymentMethod,
                F_Freight,
                F_Remarks,
                F_DiscountAmount,
                F_DiscountCode,
                F_Longitude, //经度
                F_Latitude, //纬度
                F_StoreId, //附近门店ID
                F_StoreName, //附近门店
                F_OrderType, //订单类型
                F_ID
            },
            orderdetailentity,
        }
    };

    console.log(body2);

    requestPOST({
        url,
        body: body2,
        success,
        fail,
    });
}

module.exports = {
    login,
    getMyShoppingCart,
    addShoppingCart,
    delshoppingcart,
    editshoppingcart,
    getMyAddress,
    getFreightByArea,
    modifyOrderStatus,
    getWxpaydata,
    createOrder,
};