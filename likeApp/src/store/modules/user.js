export default {
  state: {
    dingdingUser:{},
    user: {
      userid: "",
      name: "",
      code: "",
      avatar: "",
      department: ""
    }
  },
  getters: {
    user: state => {
      var u = JSON.parse(window.localStorage.getItem("user"));
      state.user; //这里一定要引用一个state这个字段才更新
      if (u) return u;
      else return state.user;
    },
    dingdingUser:state => {
      var d = JSON.parse(window.localStorage.getItem("dingdingUser"));
      state.dingdingUser; //这里一定要引用一个state这个字段才更新
      if (d) return d;
      else return state.dingdingUser;
    },
  },
  mutations: {
    setUser(state, u) {
      window.localStorage.setItem("user", JSON.stringify(u));
      state.user = u;
    },
    setDingDingUser(state, d) {
      window.localStorage.setItem("dingdingUser", JSON.stringify(d));
      state.dingdingUser = d;
    }
  },
  actions: {}
};
