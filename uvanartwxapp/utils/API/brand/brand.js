var api = require("../request.js");

//###梵豆明细
export const GetPrizeList = data => {
  return api.get("/lr/s2bapi/GetPrizeList", data);
};

export const getmyaddress = data => {
  return api.get("/lr/s2bapi/getmyaddress", data);
};

export const AddVanBeans = data => {
  return api.get("/lr/s2bapi/AddVanBeans", data);
};

export const InsertRoulettePrizeOrder = data => {
  return api.post(
    "/lr/s2bapi/InsertRoulettePrizeOrder",
    data
  );
};

//##抽奖页面
export const GetPrizes = (data) => {
  debugger;
  return api.get(
    "/lr/s2bapi/GetPrizes",
    data
  );
};
export const CanPlayRoulette = (data) => {
  return api.get(
    "/lr/s2bapi/CanPlayRoulette",
    data
  );
};

export const GetPrizeWinnerList = (data) => {
  return api.get(
    "/lr/s2bapi/GetPrizeWinnerList",
    data
  );
};

export const GetVanBeanConfig = (data) => {
  return api.get(
    "/lr/s2bapi/GetVanBeanConfig",
    data,
  );
};

export const GetMyPrize = (data) => {
  return api.get(
    "/lr/s2bapi/GetMyPrize",
    data
  );
};
