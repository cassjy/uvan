import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

import mutations from './mutations'
import state from './state'

import { home } from './modules/modules_min'

import createLogger from 'vuex/dist/logger'   // 每次通过mutations修改state都会返回log数据查看

Vue.use(Vuex); // 注册

const debug = process.env.NODE_ENV !== 'production'  // 调试模式,会损耗内存建议开发环境下

const store = new Vuex.Store({
    actions,
    getters,
    mutations,
    state,
    strict: debug,  // 严格模式, state状态变更只要不是 mutation 引起，将会抛出错误
    plugins: debug ? [createLogger()] : [], // 调试
    modules: {
        home: home  // 首页内页数据
    }
})

// 开启热重载
if(module.hot){
    module.hot.accept([
        './actions',
        './getters',
        './mutations',
        './state',
        './modules/modules_min'
    ], () => {
        const newActions = require('./actions').default
        const newGetterss = require('./getters').default
        const newMutation = require('./mutations').default
        const newState = require('./state').default
        const {home} = require('./modules/modules_min').default

        // 加载新模块
        store.hotUpdate({
            state: newState,
            mutations: newMutation,
            actions: newActions,
            getters: newGetterss,
            modules:{
                home: home
            }
        })
    })
}

export default store;