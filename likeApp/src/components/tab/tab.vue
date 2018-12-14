<template>
  <div id="tab">
    <router-link to="/hall" class="item" :class="{active:$route.path === $route.to}">
      <!-- <i class="iconImg"></i> -->
      <div class="iconfont icon-shouye1"></div>
      <p class="tx">大厅</p>
    </router-link>

    <router-link to="/rank" class="item" :class="{active:$route.path === $route.to}">
      <!-- <i class="iconImg"></i> -->
      <div class="iconfont icon-paihang"></div>
      <p class="tx">排行</p>
    </router-link>

    <router-link to="/like" class="item" :class="{active:$route.path === $route.to}">
      <div class="good">
        <div class="good-border">
          <i class="iconImg"></i>
        </div>
      </div>
      <p class="tx">赞赏</p>
      <!-- <div class="like">点赞</div> -->
    </router-link>

    <router-link to="/explore" class="item" :class="{active:$route.path === $route.to}">
      <!-- <i class="iconImg"></i> -->
      <div class="iconfont icon-2"></div>
      <p class="tx">发现</p>
    </router-link>

    <router-link to="/mine" class="item" :class="{active:$route.path === $route.to}">
      <!-- <i class="iconImg"></i> -->
      <div class="iconfont icon-wo1"></div>
      <p class="tx">我</p>
    </router-link>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["role_type", "token"])
  }
};
</script>


<style lang="less" scoped>
@import "~common/css/defult.less";
#tab {
  width: 100%;
  // background: red linear-gradient(to bottom, #fff, #f2f2f2);
  background-color: #fff;
  position: fixed;
  // border-bottom: #eee 1 / @rem solid;
  border-top: #eee 1 / @rem solid;
  bottom: 0 / @rem;
  height: 100 / @rem;
  display: flex;
  box-sizing: border-box;
  padding: 16 / @rem 0;
  z-index: 101;
  .icon-shouye1, .icon-paihang, .icon-2, .icon-wo1{
    color: #c8cbd3;
    font-size: 36/@rem;
  }
  .like{
    width: 78/@rem;
    height: 78/@rem;
    background-color: #525356;
    text-align: center;
    line-height: 78/@rem;
    color: #fff;
    border-radius: 50%;
    margin: 0 auto;
    font-size: 22/@rem;
  }
  .iconImg {
    display: block;
    width: 40 / @rem;
    height: 37 / @rem;
    margin: 0 auto;
  }
  .tx {
    color: #c0c0c0;
    font-size: 18 / @rem;
    margin-top: 5 / @rem;
  }
  .item.active .tx {
    color: #222;
    font-size: 18 / @rem;
    margin-top: 5 / @rem;
  }
  .item {
    flex: 1;
    margin-top: 2 / @rem;
    text-align: center;
  }
  .good {
    background-color: #fff;
    margin-top: -60 / @rem;
    margin-left: 30 / @rem;
    width: 100 / @rem;
    height: 100 / @rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: #ededed 0 0 10 / @rem 3 / @rem;
  }
  .good-border {
    width: 80 / @rem;
    height: 80 / @rem;
    border-radius: 50%;
    border: red 1px solid;
    .iconImg {
      display: block;
      width: 45 / @rem;
      height: 45 / @rem;
      margin: 15 / @rem auto;
      line-height: 80 / @rem;
    }
  }
  .item:nth-of-type(1) .iconImg {
    // background: url("~common/images/index/forum1.png") center center no-repeat;
    // background-size: contain;
  }
  .item:nth-of-type(2) .iconImg {
    // background: url("~common/images/index/ranking1.png") center center no-repeat;
    // background-size: contain;
  }
  .item:nth-of-type(3) .iconImg {
    background: url("~common/images/index/good.png") center center no-repeat;
    background-size: contain;
  }
  .item:nth-of-type(4) .iconImg {
    // background: url("~common/images/index/shop1.png") center center no-repeat;
    // background-size: contain;
  }
  .item:nth-of-type(5) .iconImg {
    // background: url("~common/images/index/me1.png") center center no-repeat;
    // background-size: contain;
  }
  .item.active:nth-of-type(1) .iconfont {
    // background: url("~common/images/index/forum.png") center center no-repeat;
    // background-size: contain;
    color: #5a5c60;
  }
  .item.active:nth-of-type(2) .iconfont {
    // background: url("~common/images/index/ranking.png") center center no-repeat;
    // background-size: contain;
    color: #5a5c60;
  }
  .item.active:nth-of-type(3) .iconfont {
    background: url("~common/images/index/good.png") center center no-repeat;
    background-size: contain;
    color: #5a5c60;
  }
  .item.active:nth-of-type(4) .iconfont {
    // background: url("~common/images/index/shop.png") center center no-repeat;
    // background-size: contain;
    color: #5a5c60;
  }
  .item.active:nth-of-type(5) .iconfont {
    // background: url("~common/images/index/me.png") center center no-repeat;
    // background-size: contain;
    color: #5a5c60;
  }
}
</style>

