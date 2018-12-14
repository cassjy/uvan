var api = require("../request.js");
//梵豆商城
export const oldcustomergetvanbean = data => {
  return api.get("/lr/s2bapi/oldcustomergetvanbean", data);
};
export const productlist2 = data => {
  return api.post("/lr/s2bapi/productlist2", data, "application/json");
};

// 获取兑换记录
export const getvanbeanpayorder = () => {
  return api.get("/lr/s2bapi/getvanbeanpayorder");
};

export const getmyvanbeannum = data => {
  return api.get("/lr/s2bapi/getmyvanbeannum", data);
};

//###梵豆明细页面
//梵豆明细
export const getvanbeanrecord = data => {
  return api.post("/lr/s2bapi/getvanbeanrecord", data);
};
