import { staticRouter } from "@/router/index";
import { getCookies } from "api/util.js";
// 全局 - 默认
const state = {
  isLoading: false,
  islogin: false, // 是否登陆
  token: getCookies("token") ? getCookies("token") : "123",
  openID: getCookies("openID"), // openID
  phone: getCookies("phone"), // 用户手机
  role_type: getCookies("roleType"), // 用户角色
  routers: staticRouter, // 默认路由 - 陌生人可访问
  addRouter: [], // 动态 - 登陆后可访问的路由
  personType: 1, //记录个人中心最后显示页面
  showTab: false, // 是否显示底部tab, 内页为false
  Privilege: "", //蒲公英特權
  sid: "",
  usercode: "",
  username: "",
  address: {}, //用户缓存地址，只有一个对象。实时更新
  code: "123"
};

export default state;
