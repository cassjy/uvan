// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
import Vue from "vue";
// import Es6Promise from "es6-promise";
// Es6Promise.polyfill();
import App from "./App";
import router from "./router";
import fastclick from "fastclick";
import VueLazyload from "vue-lazyload";
import store from "./store";
// import VueAwesomeSwiper from "vue-awesome-swiper";
import VueClipboard from "vue-clipboard2";
require("!style-loader!css-loader!less-loader!common/css/reset.less");
import "common/js/lessSize.js";
import { ToastPlugin, LoadingPlugin,ConfirmPlugin } from "vux";

import { checkenv, pcMessLogin, pcDingLogin, mobileLogin } from "api/dingenv.js";
// import vuePicturePreview from "vue-picture-preview";

// Vue.use(vuePicturePreview);
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

Vue.use(ToastPlugin).use(ConfirmPlugin);

import { handleCodeLoading } from "common/js/apiCode.js";
Vue.prototype.message = function(text) {
this.$vux.toast.text({
    text: text
});
};
Vue.prototype.showCodeMes = handleCodeLoading;

var u = navigator.userAgent;

var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
console.log("测试是否为ios");
console.log(isiOS);

// document.body.addEventListener("touchstart", function() {}); //ios active伪类不兼容勿删
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
// Vue.use(VueAwesomeSwiper);

Vue.use(LoadingPlugin); // 加载中
Vue.use(VueClipboard); //复制到粘贴板

import api from "api/api";

import user from "./store/modules/user";
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
    if (to.meta.title) {
        debugger;
        document.title = to.meta.title;
    }
    if (dd.version) {
        dd.biz.navigation.setTitle({
            title: to.meta.title, //控制标题文本，空字符串表示显示默认文本
            onSuccess: function(result) {},
            onFail: function(err) {}
        });
    }
    debugger;
    //路由判断是否有token和用户信息，有直接跳转，无则需要登录，token过期，在接口部分做重新登录
    console.log(store.getters.token);
    console.log(store.getters.token != "undefined");
    //有token的 情况
    if (
            !!(
            store.getters.token !== "undefined" &&
            store.getters.token !== undefined &&
            store.getters.token != 123
            )
    ) {
        next();
    } else {
        //回调成功才进行跳转
        Vue.$vux.loading.show({
            text: "正在加载"
        });
        var env = checkenv();
        if (env == "mobile") {
            mobileLogin().then(res => {
                console.log(res);
                //最好输出tokenuserid查看一下
                Vue.$vux.loading.hide();
                next();
            });
        } else if (env == "pc" && window.frames.length != parent.frames.length) {
            //微应用进入pc
            debugger;
            var data = "relogin";
            console.log("登录用的pc登录~~~~~~~~~~~");
            parent.postMessage(data, "*");
            pcDingLogin().then(res => {
                console.log(res);
                //最好输出tokenuserid查看一下
                Vue.$vux.loading.hide();
                next();
            });
        } else if (env == "pc" && window.frames.length == parent.frames.length) {
            pcMessLogin().then(res => {
                console.log(res);
                //最好输出tokenuserid查看一下
                Vue.$vux.loading.hide();
                next();
            });
        } else if ( (env = "chrome") ) {
            let time = setInterval(() => {
                console.log("token的值为" + store.getters.token);
                if (store.getters.token != 123 && store.getters.token) {
                    next();
                    clearInterval(time);
                }
            }, 1000);
        }
    }
});

new Vue({
    el: "#app",
    router,
    store,
    components: {
        App
    },
    template: "<App/>"
});

// 注册到全局的公用方法声明
//1.接口返回报错显示错误信息，并且关闭加载框  this.showCodeMes()
