var api = require("../request.js");

export const GetBanners = data => {
  return api.get("/lr/s2bapi/GetBanners", data);
};

export const productlist = data => {
  return api.post("/lr/s2bapi/productlist", data);
};
