var api = require("../request.js");
import regeneratorRuntime from "../wxPromise.min.js";

// ###邀梵星活动接口

//获取openid
export const GetWxOpenId = async function() {
  try {
    var codeRes = await api.wxlogin();
    console.log(codeRes);
    let openiddata = {
      code: codeRes
    };
    return api.post("/api/user/getmyopenid", openiddata);
  } catch (error) {
    console.log(error);
  }
};

//用户是否参与活动
export const GetUserJoinActivityInfo = data => {
  return api.get("/s2b/invitestar/GetUserJoinActivityInfo", data);
};

//上传formid
export const AddCustomerFormID = data => {
  return api.post("/s2b/customer/AddCustomerFormID", data);
};
//自动升级蒲公英
export const SystemUpgradeDandelion = data => {
  return api.get("/s2b/invitecode/SystemUpgradeDandelion", data);
};

//判断是否为蒲公英
export const validateusertype = data => {
  return api.post("/lr/s2bapi/validateusertype", data);
};

//参与邀梵星领好礼活动
export const JoinActivity = data => {
  return api.get("/s2b/invitestar/JoinActivity", data);
};

//领取邀梵星领好礼活动礼物
export const InsertPrizeOrder = data => {
  return api.post("/s2b/invitestar/InsertPrizeOrder", data, "application/json");
};

//###电梯活动扫码领好礼

//领取奖品
export const Add_LiftGiftOrder = data => {
  return api.post("/s2b/temactpi/Add_LiftGiftOrder", data, "application/json");
};

//获取奖品信息
export const Get_LiftPrizeStatus = data => {
  return api.post(
    "/s2b/temactpi/Get_LiftPrizeStatus",
    data,
    "application/json"
  );
};

//###门店抽奖活动九宫格

export const GetPrizes = data => {
  return api.get("/lr/s2bapi/GetPrizes", data);
};

export const GetRoulettePrizeName = data => {
  return api.get("/lr/s2bapi/GetRoulettePrizeName", data);
};

export const startRoulette = data => {
  return api.get("/lr/s2bapi/startRoulette", data);
};
export const GetRoulettePrizeImage = data => {
  debugger
  return api.get("/lr/s2bapi/GetRoulettePrizeImage", data);
};

export const wxdecryptdata = data => {
  return api.post("/lr/uvanapi/wxdecryptdata", data);
};

export const uvanstarlogin2 = data => {
  return api.post("/lr/adms/uvanstarlogin2", data);
};

// 小黑盒活动

export const getBlackBox = data => {
  return api.get("/lr/s2bapi/GetMyPrizeFromBlackBox", data);
};

