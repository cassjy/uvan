import * as types from './mutations-types'


// 局部store

// 首页
export const home = {
    namespaced: true,
    state(){
        return{
            storeAddress: {},  // 选中实体店信息
            videoItem: {}, // 选中视频带描述 - 做生活的艺术家
        }
    },
    mutations: {
        [types.SET_ADDRESS_SEL_DATA](state, address) { // 选中实体店信息
            state.storeAddress = address
        },
        [types.SET_VIDEO_SEL_DATA](state, item) { // 选中视频带描述 - 做生活的艺术家
            state.videoItem = item
        }
    },
    getters: {
        storeAddress: state => { return state.storeAddress },// 实体店信息
        videoItem: state => { return state.videoItem } // 选中视频带描述 - 做生活的艺术家
    }
}