var api = require("../request.js");

export const ReceiveShoppingCart = (data) => {
  return api.get("/lr/s2bapi/ReceiveShoppingCart", data);
};

export const GetShareshoppingCartdetails = (data) => {
  return api.get("/lr/s2bapi/GetShareshoppingCartdetails", data);
};

export const AddShareCart = (data) => {
  return api.post("/lr/s2bapi/addsharecart", data);
};

export const GetProductDetail_2 = (data) => {
  return api.get("/lr/s2bapi/GetProductDetail_2", data);
};


// 整理阿明接口by-rex
export const myshoppingcart = ()=>{
  let myshoppingcartUrl = '/lr/s2bapi/myshoppingcart?token=' + wx.getStorageSync('token') + '&loginMark=' + wx.getStorageSync('phone') + '&data=' + wx.getStorageSync('openid')
  return api.get(myshoppingcartUrl)
}