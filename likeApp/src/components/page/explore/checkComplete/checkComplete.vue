<template>
  <div class="checkComplete">
    <div class="header">
      <div class="title0">
        <i class="icon-chenggong iconfont"></i>
        <h2>投票成功</h2>
      </div>
      <div class="tips">感谢您的投票，评选结果请留意后续公布，谢谢！</div>
    </div>
    <div class="title1">我的投票信息</div>
    <div class="content-list">
      <div class="wrapper" v-for="(item,index) in selectedCandidates" :key="index">
        <div class="item">
          <div class="user-info">
            <div class="left">
              <img :src="item.avatar?item.avatar:'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/696ee4f1455e43b88b78a110d0b803fb'" />
              <div class="message">
                <h3>{{item.userName}}</h3>
                <p>{{item.department}}</p>
                <p>{{item.position}}</p>
              </div>
            </div>
            <div class="right">
              <!-- <div class="cancel">取消选择</div> -->
            </div>
          </div>
          <div class="user-profile">
            <div class="card-content" v-if="item.packup">
              <div style="word-wrap:break-word" v-if="(item.personalProfile).length<=23">{{(item.personalProfile).substr(0,23)}}
                <span @click="openMore(index)" v-if="(item.photoList).length>0">...<a style="text-decoration:underline;color:#4491fa;">展开</a></span>
              </div>
              <div style="word-wrap:break-word" v-if="(item.personalProfile).length>23">{{(item.personalProfile).substr(0,46)}}
                <span @click="openMore(index)">...<a style="text-decoration:underline;color:#4491fa;">展开</a></span>
              </div>
            </div>
            <div class="card-content" style="word-wrap:break-word" v-if="!item.packup">
              {{item.personalProfile}}
              <span class="content-open" v-if="(item.personalProfile).length>60&&(item.photoList).length==0" @click="closeMore(index)" style="color:#4491fa;">收起</span>
            </div>
          </div>
          <div class="user-photo" v-if="!item.packup">
            <div class="addPhoto">
              <!-- <div class="photo" v-for="(item,index) in item.photoList" :key="index"> -->
              <img v-for="(item,id) in item.photoList" :key="id" :preview="index" v-lazy="item.img" />
              <!-- </div> -->
            </div>
          </div>
          <p v-if="item.photoList.length>0&&!item.packup"><a @click="closeMore(index)">收起</a></p>
        </div>
        <div class="border"></div>
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
      selectedCandidates: []
    };
  },
  created() {
    this.$vux.loading.show({
      text: "加载中..."
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
      let url = "wish/wishShortlist/pollResults?userId=" + this.user.userid;
      this.$api
        .get(url)
        .then(res => {
          console.log(res);
          this.$vux.loading.hide();
          if (res.code == 200) {
            this.selectedCandidates = res.data;
            this.$nextTick(() => {
              setTimeout(() => {
                this.$previewRefresh();
              }, 300);
            });
          } else {
            this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: "20em",
              time: "1500"
            });
          }
        })
        .catch(err => {
          this.$vux.loading.hide();
          this.$vux.toast.show({
            text: "服务器异常！",
            type: "text",
            width: "20em",
            time: "1500"
          });
        });
    },
    // 展示更多
    openMore(index) {
      console.log(parseInt(index));
      this.selectedCandidates[parseInt(index)].packup = false;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$previewRefresh();
        }, 300);
      });
      // this.packup = false;
    },

    // 收起
    closeMore(index) {
      console.log(index);
      this.selectedCandidates[parseInt(index)].packup = true;
    }
  }
};
</script>
<style lang="less">
@import "~common/css/defult.less";
.checkComplete {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 15;
  overflow: scroll;
  .header {
    width: 100%;
    height: 230 / @rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .title0 {
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
  .title1 {
    color: #888888;
    font-size: 28 / @rem;
    width: 100%;
    height: 80 / @rem;
    padding-left: 40 / @rem;
    box-sizing: border-box;
    line-height: 80 / @rem;
    background-color: #fafafa;
  }
  .content-list {
    .item {
      padding: 40 / @rem 40 / @rem 25 / @rem;
      .user-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          img {
            width: 128 / @rem;
            height: 128 / @rem;
            border-radius: 100%;
            margin-right: 20 / @rem;
          }
          .message {
            font-size: 22 / @rem;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            h3 {
              color: #424242;
              font-weight: bold;
              margin-top: 4 / @rem;
              margin-bottom: 8 / @rem;
            }
            p {
              font-size: 18 / @rem;
              color: #888888;
              margin-top: 8 / @rem;
            }
          }
        }
        .right {
          .cancel {
            color: #666666;
            font-size: 28 / @rem;
            width: 156 / @rem;
            height: 74 / @rem;
            line-height: 74 / @rem;
            text-align: center;
            border-radius: 10 / @rem;
            border: 1px solid #d2d2d2;
            background-color: #f8f8f8;
          }
        }
      }
      .user-profile {
        margin-top: 34 / @rem;
        .card-content {
          // float: right;
          width: 100%;
          font-size: 26 / @rem;
          line-height: 42 / @rem;
          color: #888888;
          margin-bottom: 16 / @rem;
          .content-more {
            color: #888;
          }
          .content-open {
            color: #5e7fb3;
          }
        }
      }
      .addPhoto {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        margin-top: 10 / @rem;
        // .photo {
        //   width: 31%;
        //   height: 210 / @rem;
        //   margin-right: 20 / @rem;
        //   margin-bottom: 20 / @rem;
        //   font-size: 0;
        //   position: relative;
        img {
          width: 31%;
          height: 210 / @rem;
          margin-right: 20 / @rem;
          margin-bottom: 20 / @rem;
          font-size: 0;
          position: relative;
          z-index: 15;
        }
        // }
        img:nth-of-type(3n) {
          margin-right: 0;
        }
      }
      p {
        text-align: right;
        a {
          color: #4491fa;
          font-size: 26 / @rem;
          text-decoration: underline;
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
</style>

