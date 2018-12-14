import * as types from "./mutations-types";
import { staticRouter } from "@/router/index";
import { setCookies, getCookies } from "api/util.js";

// 全局 - 默认
const mutations = {
  [types.SET_IS_LOGIN](state, islogin) {
    // 是否登录
    state.islogin = islogin;
  },
  [types.SET_LOGINNAME](state, loginname) {
    // 设置UserName的cookie
    state.loginname = loginname;
    setCookies("loginname", loginname);
  },
  [types.SET_PASSWORD](state, password) {
    // 设置用户密码的cookie
    state.password = password;
    setCookies("password", password);
  },
  [types.syncLoginState](state) {
    state.password = getCookies("password");
    state.loginname = getCookies("loginname");
  },
  [types.ADD_ROUTERS](state, router) {
    // 添加动态路由并同步到当前白名单
    state.addRouter = router;
    state.routers = staticRouter.concat(router);
  },
  [types.SET_PERSON_TYPE](state, personType) {
    // 设置当前选中状态
    state.personType = personType;
  },
  [types.SET_SHOW_TAB](state, flag) {
    // 是否显示底部tab, 内页为false
    state.showTab = flag;
  },
  [types.SET_Privilege](state, Privilege) {
    // 是否显示底部tab, 内页为false
    state.Privilege = Privilege;
  },
  [types.SET_SID](state, sid) {
    // sid 用户sessionid
    state.sid = sid;
  },
  [types.SET_USERCODE](state, usercode) {
    // 用户账号名
    state.usercode = usercode;
  },
  [types.SET_USERNAME](state, username) {
    // 用户账号名
    state.username = username;
  },
  [types.SET_ADDRESS](state, address) {
    // 用户当前地址
    state.address = address;
  }
};

export default mutations;
