import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


//静态
export const staticRouter = [
    { path: '/', redirect: '/reception'},
    {
        path: '/login', name: 'login', component: () => import('page/login/login'),meta:{title:'登录',showtab:false}  // 购物车
    },
    {
        path: '/activing', name: 'activing', component: () => import('page/activing/activing'),meta:{title:'活动列表',showtab:true}, // 活动
        children:[
            {  
                path: 'actDetail', name: 'actDetail', component: () => import('page/activing/actDetail/actDetail'),meta:{title:'活动详情',showtab:false}  // 商品详情
                
            }
        ]
    },
    {
        
        path: '/productlist', name: 'productlist', component: () => import('page/classification/productList/productList'),meta:{title:'商品列表',showtab:true},// 商品
        children:[
            {  
                path: 'detail', name: 'detail', component: () => import('page/classification/productList/detail/detail'),meta:{title:'商品详情',showtab:false}  // 商品详情
                
            }
        ]
    },
    
    {
                path: '/classification', name: 'classification', component: () => import('page/Classification/Classification'), meta:{title:'分类',showtab:true}, // 分类
             },
    {
        path: '/shoppingCart', name: 'shoppingCart', component: () => import('page/shoppingCart/shoppingCart'),meta:{title:'购物车',showtab:true},  // 购物车
        children:[
            {
                path: 'account', name: 'account', component: () => import('page/account/account'),meta:{title:'确认订单',showtab:false}  // 结算页
            },
        ]
    },
    {
        path: '/reception', name: 'reception', component: () => import('page/reception/reception'),meta:{title:'梵导购',showtab:true},  // 接待
        children:[
            {
                path:'historyList',name:'historyList',component: () => import('page/reception/historyList/historyList'),meta:{title:'历史接待',showtab:true},
            }
        ]
    },
    {
        path: '/mine', name: 'mine', component: () => import('page/mine/mine'),meta:{title:'我的',showtab:true},
        children:[
            {
                path:'myorder',name:'myorder',component: () => import('page/mine/myorder/myorder'),meta:{title:'订单列表',showtab:false},
                children:[
                    {
                        path:'orderdetail',name:'orderdetail',component: () => import('page/mine/orderdetail/orderdetail'),meta:{title:'订单详情',showtab:false},
                    }
                ]
            }
        ]
    },

]


export default new Router({
    linkActiveClass: 'active',
    routes: staticRouter
})