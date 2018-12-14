// 全局
export const islogin = state => state.islogin; // 是否登录

export const password = state => state.password; // 密码

export const token = state => state.token; // token

export const code = state => state.code; // code

export const loginname = state => state.loginname; // 登录名

// export const role_type = state => state.role_type  // 角色

export const addRouter = state => state.addRouter; // 动态路由

// export const openID = state => state.openID // openID

export const personType = state => state.personType; // 个人中心页面选择

export const Privilege = state => state.Privilege; // 蒲公英特權

export const showTab = state => state.showTab; // // 是否显示底部tab, 内页为false

// export const sid = state => state.sid
export const sid = function(state) {
  if (state.sid) {
    return state.sid;
  } else {
    return window.localStorage.getItem("sid");
  }
}; //用户的sessionid

export const usercode = function(state) {
  if (state.usercode) {
    return state.usercode;
  } else {
    return window.localStorage.getItem("usercode");
  }
}; //用户账号

export const address = state => state.address; // 用户当前地址

export const username = function(state) {
  if (state.username) {
    return state.username;
  } else {
    return window.localStorage.getItem("username");
  }
}; //用户昵称

export const whiteList = function(state) {
  // 路由白名单- 陌生人可访问
  let whiteList = [];

  function whiteArr(item) {
    item.forEach(c => {
      let str = c.path.indexOf("/") !== -1 ? c.path : `/${c.path}`; // 手动加"/",方便main白名单判断
      whiteList.push(str);
      c.children && c.children.length > 0 && whiteArr(c.children); // 如果有children则继续遍历
    });
    return whiteList;
  }

  whiteArr(state.routers);
  return whiteList;
};
