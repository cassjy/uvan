<template>
    <div class="tip-body">
        <i class="iconfont icon-zhuyi"></i>
        <div class="tip">请在钉钉浏览器打开</div>
    </div>
</template>

<script>
    export default {
        name:'tip'
    }
</script>

<style lang="less" scoped>
@import "~common/css/defult.less";
.tip-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.icon-zhuyi {
  display: block;
  flex: 0 0 300 / @rem;
  font-size: 200 / @rem;
  color: red;
}
.tip {
  display: block;
  font-size: 40 / @rem;
}
</style>