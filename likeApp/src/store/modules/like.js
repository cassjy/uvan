export default {
  state: {
    likeperson: {
      avatar:
        "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/696ee4f1455e43b88b78a110d0b803fb",
      name: "选择联系人",
      id: ""
    },
    access: ""
  },
  getters: {
    likeperson: state => {
      var p = JSON.parse(window.localStorage.getItem("likeperson"));
      state.likeperson; //这里一定要引用一个state这个字段才更新
      if (p) return p;
      else return state.likeperson;
    }
  },
  mutations: {
    setLikePerson(state, p) {
      window.localStorage.setItem("likeperson", JSON.stringify(p));
      state.likeperson = p;
    }
  },
  actions: {}
};
