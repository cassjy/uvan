/*
    header点击返回派发goBack; @goBack="xxx" 调用关闭页面
*/
<template>
  <div id="header">
      <x-header 
        class="header"
        :left-options="{showBack:false,backText: ''}"
        :right-options="{showMore:showMores}"
        @on-click-more= "showAction = true"
      >
      <div slot="overwrite-left" class="goBack iconfont icon-back" @click="goBack" v-if="showBacks"></div>
      <div slot="right">历史接待记录</div>
      {{title}}
      </x-header>
      
      
      <!-- 分享 -->
      <div transfer-dom>
        <actionsheet 
          v-model="showAction"
          @close-on-clicking-mask="true"
          :menus="menus"
        ></actionsheet>
      </div>
  </div>
</template>

<script>
import { XHeader, Actionsheet, TransferDom } from "vux";
export default {
  data() {
    return {
      showAction: false,   // 分享弹窗显示状态
      menus: {   // 分享文本列表
        m1: "关于优梵艺术丨梵店",
        m2: '暂缺'
      }
    };
  },
  props: {
    title: {  // 标题
      type: String,
      default: "标题"
    },
    showBacks: {   // 显示返回
      type: Boolean,
      default: false
    },
    showMores: {  // 显示分享
      type: Boolean,
      default: false
    }
  },
  methods:{
    // 派发点击返回事件
    goBack(){
      this.$emit('goBack')
    }
  },
  components: {
    XHeader,
    Actionsheet,
    TransferDom
  }
};
</script>

<style lang="less" scoped>
@import "~common/css/defult.less";
.header{background-color: #333;}
.goBack{font-size: 22px}
</style>
