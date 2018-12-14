<template>
  <div class="voteComplete">
    <div class="header">
      <div class="title">
        <i class="icon-chenggong iconfont"></i>
        <h2>投票成功</h2>
      </div>
      <div class="tips">感谢您投出的选票，评选结果请留意公告</div>
    </div>
    <div class="section">
      <div class="my-vote">我的投票信息</div>
      <div class="chooseList">
        <div class="item" v-for="(item,index) in dataList" :key="index">
          <div class="candidate-info">
            <div class="left">
              <img :src="item.avatar?item.avatar:'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/696ee4f1455e43b88b78a110d0b803fb'" />
            </div>
            <div class="right">
              <h3>{{item.userName}}</h3>
              <div class="comments">{{item.reason}}</div>
            </div>
          </div>
          <div class="border"></div>
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
      dataList: []
    };
  },
  created() {
    this.$vux.loading.show({
      text: "正在加载"
    });
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
      let url = "wish/wishPrimary/nominationRecord?userId=" + this.user.userid;
      this.$api
        .get(url)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.dataList = res.data;
            this.$vux.loading.hide();
          } else {
            this.$vux.loading.hide();
            this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: "18em",
              time: "1500"
            });
          }
        })
        .catch(err => {
          this.$vux.loading.hide();
          this.$vux.toast.show({
            text: "系统错误！",
            type: "text",
            width: "18em",
            time: "1500"
          });
        });
    }
  }
};
</script>
<style lang="less">
@import "~common/css/defult.less";
.voteComplete {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  z-index: 10;
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
  .section {
    .my-vote {
      color: #888888;
      font-size: 28 / @rem;
      height: 80 / @rem;
      line-height: 80 / @rem;
      padding-left: 40 / @rem;
      box-sizing: border-box;
      background-color: #fafafa;
    }
    .chooseList {
      .candidate-info {
        padding: 40 / @rem;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        .left {
          width: 100 / @rem;
          img {
            width: 100 / @rem;
            height: 100 / @rem;
            border-radius: 100%;
          }
        }
        .right {
          width: 570 / @rem;
          padding-left: 20 / @rem;
          box-sizing: border-box;
          h3 {
            color: #484848;
            font-size: 26 / @rem;
            font-weight: bold;
            height: 45 / @rem;
            line-height: 45 / @rem;
            margin-bottom: 12 / @rem;
          }
          .comments {
            width: 100%;
            color: #888888;
            font-size: 24 / @rem;
            word-wrap:break-word;
            line-height: 40 / @rem;
          }
        }
      }
      .border {
        width: 100%;
        height: 10 / @rem;
        background-color: #fafafa;
      }
    }
  }
}
</style>


