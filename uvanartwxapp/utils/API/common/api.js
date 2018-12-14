var api = require("../request.js");

export const ADD_CommonShareService = (data, header) => {
    return api.post("/lr/s2bapi/ADD_CommonShareService", data, header);
};

export const GetInviteShareRecord = (data) => {
    return api.post("/lr/s2bapi/GetInviteShareRecord", data);
};

export const login = (data, header) => {
    return api.post('/api/user/login', data, header)
}

export const ScanQRCode = (data) => {
    return api.post('/lr/s2bapi/scanqrcode', data)
}

export const ValidateUserType = (data) => {
    return api.post('/lr/s2bapi/validateusertype', data)
}

export const Add_UserVisiteRecord = (data, header) => {
    return api.post('/s2b/temactpi/Add_UserVisiteRecord', data, header)
}

export const AddCustomerFormID = (data) => {
    return api.post('/s2b/customer/AddCustomerFormID', data)
}

//获取openid
export const GetMyOpenid = (data) => {
    return api.post('/api/user/getmyopenid', data)
}