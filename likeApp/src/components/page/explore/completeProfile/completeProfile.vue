<template>
  <div class="completeProfile">
    <div class="header">
      <div class="title">
        <i class="icon-chenggong iconfont"></i>
        <h2>提交成功</h2>
      </div>
      <div class="tips">感谢您投出的选票，评选结果请留意公告</div>
    </div>
    <div class="border"></div>
    <div class="section">
      <div class="title">个人简介</div>
      <div class="abstract">
        <p>{{data.personalProfile}}</p>
        <div class="photoList">
          <!-- <div class="img" v-for="(item,index) in data.photoList" :key="index" :preview="index"> -->
          <img v-for="(item,index) in data.photoList" :key="index" :preview="1" v-lazy="item.img" />
          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Loading, Toast } from "vux";
export default {
  data() {
    return {
      data: ""
    };
  },
  created() {
    // this.$vux.loading.show({
    //   text: "加载中..."
    // });
    this.requireData();
  },
  computed: {
    ...mapGetters(["user"])
  },
  components: {
    Loading
  },
  methods: {
    requireData() {
      let url =
        "wish/wishShortlist/getPersonalProfile?userId=" + this.user.userid;
      this.$api.get(url).then(res => {
        console.log(res);
        this.$vux.loading.hide();
        if (res.code == 200) {
          this.data = res.data;
           this.$previewRefresh()
        } else {
        }
      });
    }
  }
};
</script>
<style lang="less">
@import "~common/css/defult.less";
.completeProfile {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  z-index: 13;
  overflow: scroll;
  .header {
    width: 100%;
    height: 230 / @rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      .icon-chenggong {
        color: #4aba7b;
        font-size: 50 / @rem;
      }
      h2 {
        color: #222222;
        font-size: 34 / @rem;
        font-weight: bold;
        margin-left: 26 / @rem;
      }
    }
    .tips {
      color: #ababab;
      font-size: 24 / @rem;
      margin-top: 28 / @rem;
    }
  }
  .border {
    width: 100%;
    height: 20 / @rem;
    background-color: #fafafa;
  }
  .section {
    .title {
      width: 100%;
      height: 66 / @rem;
      color: #222222;
      font-size: 28 / @rem;
      padding-left: 40 / @rem;
      box-sizing: border-box;
      line-height: 66 / @rem;
      margin-top: 20 / @rem;
      border-bottom: 1px solid #f5f5f5;
    }
    .abstract {
      padding: 28 / @rem 40 / @rem 0;
      p {
        line-height: 42 / @rem;
        font-size: 26 / @rem;
        color: #666;
        margin-bottom: 60 / @rem;
      }
      .photoList {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        // .img {
        //   width: 210 / @rem;
        //   height: 210 / @rem;

        img {
          width: 31%;
          height: 210 / @rem;
          margin-right: 20 / @rem;
          margin-bottom: 20 / @rem;
          font-size: 0;
          position: relative;
        }
        // }
        img:nth-of-type(3n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>


