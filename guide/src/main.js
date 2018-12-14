// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
import Vue from "vue";
import App from "./App";
import router from "./router";
import fastclick from "fastclick";
import VueLazyload from "vue-lazyload";
import store from "./store";
import VueAwesomeSwiper from "vue-awesome-swiper";
import VueClipboard from "vue-clipboard2";
require("!style-loader!css-loader!less-loader!common/css/reset.less");
import "common/js/lessSize.js";
import { ToastPlugin, LoadingPlugin, ConfirmPlugin } from "vux";
import Scroll from "public/scroll/scroll";
import preview from "vue-photo-preview";
import "vue-photo-preview/dist/skin.css";
Vue.use(preview);
window.eventHub = new Vue();
Vue.config.productionTip = false;
// 全局添加vue属性
Vue.prototype.$store = store;
if (!window.localStorage) {
  alert("浏览器不支持localstorage");
} else {
  Vue.prototype.$storage = window.localStorage;
}

Vue.use(ToastPlugin);
Vue.prototype.message = function(text) {
  this.$vux.toast.text({
    text: text
  });
};

var u = navigator.userAgent;

var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
console.log("测试是否为ios");
console.log(isiOS);

document.body.addEventListener("touchstart", function() {}); //ios active伪类不兼容勿删
Vue.prototype.bus = new Vue();
// 全局引用组件
fastclick.attach(document.body); // 延迟点击

fastclick.prototype.focus = function(targetElement) {
  var length;
  //兼容处理:在iOS7中，有一些元素（如date、datetime、month等）在setSelectionRange会出现TypeError
  //这是因为这些元素并没有selectionStart和selectionEnd的整型数字属性，所以一旦引用就会报错，因此排除这些属性才使用setSelectionRange方法
  if (
    isiOS &&
    targetElement.setSelectionRange &&
    targetElement.type.indexOf("date") !== 0 &&
    targetElement.type !== "time" &&
    targetElement.type !== "month" &&
    targetElement.type !== "email"
  ) {
    length = targetElement.value.length;
    targetElement.setSelectionRange(length, length);
    /*修复bug ios 11.3不弹出键盘，这里加上聚焦代码，让其强制聚焦弹出键盘*/
    targetElement.focus();
  } else {
    targetElement.focus();
  }
};

Vue.use(VueLazyload); // 懒加载图片
Vue.use(VueAwesomeSwiper);

Vue.use(LoadingPlugin); // 加载中
Vue.use(ConfirmPlugin);
Vue.use(VueClipboard); //复制到粘贴板
Vue.component("scroll", Scroll); // 全局滚动条

import api from "api/api";
Vue.prototype.$api = api;
/* eslint-disable no-new */
if (!window.localStorage) {
  alert("浏览器不支持localstorage");
} else {
  var storage = window.localStorage;
}
var autologin = storage.getItem("autologin");
if (autologin == "false") {
  storage.removeItem("usercode");
  storage.removeItem("sid");
}
router.beforeEach((to, from, next) => {
  const get = store.getters;
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (get.sid && get.usercode && to.meta.title != "登录") {
    let pathName = to.path.substring(to.path.lastIndexOf("/")); // 长路径情况下获取最后"/"后的路径名
    to.path.lastIndexOf("/") === 0 && pathName != "/login"
      ? store.commit("SET_SHOW_TAB", true)
      : store.commit("SET_SHOW_TAB", false); // 内页隐藏tab//首页login不是内嵌，但是没有tabbar
    next();
  } else if (to.meta.title != "登录") {
    //开始进来 同时缓存中没有sid，看看cookie中,不成功再抛出错误
    next({ path: "/login" });
  } else {
    next();
  }
  debugger;
  // if (get.token && get.role_type) {  // 判断是否已登录有数据
  //   next()
  // } else {

  // }
});

// window.onbeforeunload = function() {
//   alert("关闭浏览器！");
// };
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
