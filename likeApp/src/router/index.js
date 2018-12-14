import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

//静态
export const staticRouter = [
  { path: "/", redirect: "/hall" },
  {
    path: "/hall",
    name: "hall",
    component: () => import("page/hall/hall"),
    meta: { title: "赞赏大厅", showtab: false },
    children: [
      {
        path: "follow",
        name: "follow",
        component: () => import("page/hall/follow/follow"),
        meta: { title: "赞赏大厅", showtab: false }
      }
    ]
  },
  {
    path: "/rank",
    name: "rank",
    component: () => import("page/rank/rank"),
    meta: { title: "排行榜", showtab: false }
  },
  {
    path: "/like",
    name: "like",
    component: () => import("page/like/like"),
    meta: { title: "发起赞赏", showtab: true },
    children: [
      {
        path: "organize",
        name: "organize",
        component: () => import("page/like/organize/organize"),
        meta: { title: "选择同事", showtab: true }
      }
    ]
  },
  // {
  //   path: "/organize",
  //   name: "organize",
  //   component: () => import("page/like/organize"),
  //   meta: { title: "选择同事", showtab: true }
  // },
  {
    path: "/tip",
    name: "tip",
    component: () => import("page/tip/tip"),
    meta: { title: "提示", showtab: true }
  },
  {
    path: "/refreash",
    name: "refreash",
    component: () => import("page/refreash/refreash"),
    meta: { title: "重新打开", showtab: true }
  },
  {
    path: "/explore",
    name: "explore",
    component: () => import("page/explore/explore"),
    meta: { title: "发现", showtab: false },
    children: [
      {
        path: "actGuess",
        name: "actGuess",
        component: () => import("page/explore/actGuess/actGuess"),
        meta: { title: "业绩竞猜", showtab: true }
      },
      {
        path: "primary",
        name: "primary",
        component: () => import("page/explore/primary/primary"),
        meta: { title: "个人心愿评选", showtab: true }
      },
      {
        path: "personalProfile",
        name: "personalProfile",
        component: () => import("page/explore/personalProfile/personalProfile"),
        meta: { title: "个人简介录入", showtab: true }
      },
      {
        path: "check",
        name: "check",
        component: () => import("page/explore/check/check"),
        meta: { title: "复选", showtab: true },
      //   children: [{
      //     path: "checkList",
      //     name: "checkList",
      //     component: () => import("page/explore/checkList/checkList"),
      //     meta: { title: "已选列表", showtab: true }
      //   },{
      //     path: "checkComplete",
      //     name: "checkComplete",
      //     component: () => import("page/explore/checkComplete/checkComplete"),
      //     meta: { title: "已选列表", showtab: true }
      //   }
      // ]
      },
      {
        path: "checkList",
        name: "checkList",
        component: () => import("page/explore/checkList/checkList"),
        meta: { title: "已选列表", showtab: true }
      },
      {
        path: "checkComplete",
        name: "checkComplete",
        component: () => import("page/explore/checkComplete/checkComplete"),
        meta: { title: "已选列表", showtab: true }
      },
      {
        path: "voteComplete",
        name: "voteComplete",
        component: () => import("page/explore/voteComplete/voteComplete"),
        meta: { title: "个人心愿评选", showtab: true }
      },
      {
        path: "completeProfile",
        name: "completeProfile",
        component: () => import("page/explore/completeProfile/completeProfile"),
        meta: { title: "个人简介填写", showtab: true }
      }
    ]
  },
  {
    path: "/mine",
    name: "mine",
    component: () => import("page/mine/mine"),
    meta: { title: "我的梵赞", showtab: false },
    children: [
      {
        path: "personalData",
        name: "personalData",
        component: () => import("page/mine/personalData/personalData"),
        meta: { title: "个人资料", showtab: false }
      },
      {
        path: "personalData2",
        name: "personalData2",
        component: () => import("page/mine/personalData2/personalData2"),
        meta: { title: "个人资料", showtab: false }
      },
      {
        path: "exchange",
        name: "exchange",
        component: () => import("page/mine/exchange/exchange"),
        meta: { title: "我的梵钻", showtab: false }
      }
    ]
  }
];

export default new Router({
  linkActiveClass: "active",
  routes: staticRouter
});
