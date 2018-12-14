<template>
  <div class="historyList">
    <div class="list" id="list" ref="historyList">
      <div class="listWrapper">
        <div class="item" v-for="(item,index) in customerList" :key="index" @click="updateReception(index,item.receptionStatus)" @load="loadInfo">
          <div class="left">
            <div class="userImg" v-if="item.gender==2">
              <img :src="item.receptionStatus==0?'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/396a9375b40d4f2588891388406e000c':'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/54da6532d5354dbe85ce72651dc47b2d'" />
              <!-- <div class="iconfont" :class="[item.gender==0?'icon-nanshengnvshengicon-2':'icon-nanshengnvshengicon-']"></div> -->
            </div>
            <div class="userImg" v-if="item.gender==1">
              <img :src="item.receptionStatus==0?'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/90c9627fc1df448b94b58901a4d12051':'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/afa8f5b69f9748b384659fc53a4d6fb7'" />
              <!-- <div class="iconfont" :class="[item.gender==0?'icon-nanshengnvshengicon-2':'icon-nanshengnvshengicon-']"></div> -->
            </div>
          </div>
          <div class="right">
            <div class="rightWrapper">
              <div class="userInfo">
                <div class="name">{{item.customer}}</div>
                <div class="date">{{item.createDate}}</div>
              </div>
              <div class="userState" @click.stop="overReception(item.receptionCode)" v-if="item.receptionStatus==0">
                <span>结束</span>
              </div>
              <div class="over" v-if="item.receptionStatus==1">
                <span>已结束接待</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="[showBounced?'bounced':'dowmbounced']">
      <div class="header">
        <span>接待备注</span>
      </div>
      <div class="buyState">
        <div class="left" :class="{changeBgColor:state==0}" @click="buyState(0)">未购买</div>
        <div class="right" :class="{changeBgColor:state==1}" @click="buyState(1)">已购买</div>
      </div>
      <textarea placeholder="请填写接待备注" v-model="receptionNote"></textarea>
      <div class="ensure" @click="ensure">
        确认
      </div>
      <div class="colse icon-chuyidong1-copy iconfont" @click="closeBounced"></div>
    </div>
    <div class="shadow" v-show="showBounced" @click="closeBounced"></div>
    <!-- 没有记录 -->
    <div class="noRecode" v-show="showRecord">
      <div class="icon-zanwujilu1 iconfont"></div>
      <div class="recordText">暂无接待记录</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Toast, Loading } from "vux";
import BScroll from "better-scroll";
export default {
  nane: "reception",
  data() {
    return {
      sendVal: false,
      edittype: "新建",
      checkIndex: 0,
      selectedCustId: 0,
      customerList: [],
      showBounced: false,
      isMdShow: false,
      state: -1,
      receptionCode: "", //接待id
      receptionNote: "", //接待备注
      showRecord: false,
      options: {
        pullDownRefresh: {
          threshold: 0, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 0 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        pullUpLoad: {
          threshold: 20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
        },
        pullDownRefresh: true, //关闭下拉
        // pullUpLoad: true, // 关闭上拉
        click: true,
        probeType: 3,
        startY: 0,
        preventDefaultException: {
          tagName: /^(IMG|SELECT)$/
        },
        scrollbar: false
      }
    };
  },
  mounted() {
    // this.init();
    let winHeight = document.documentElement.clientHeight;
    document.getElementById("list").style.height = winHeight - 53 + "px";
    this.requireCustomerList();
    this.$nextTick(() => {
      this.initScroll();
    });
  },
  computed: {
    ...mapGetters(["sid", "usercode", "phone"])
  },
  components: {
    Loading,
    Toast
  },
  methods: {
    // 初始化better-scroll
    initScroll() {
      if (!this.historyList) {
        this.historyList = new BScroll(this.$refs.historyList, this.options);
        this.historyList.on("pullingDown", () => {
          console.log("刷新成功");
          let state = "refresh";
          this.requireCustomerList(state);
          this.historyList.finishPullDown();
        });
        // this.historyList.on("pullingUp", () => {
        //   console.log("加载成功");
        //   this.historyList.finishPullUp();
        // });
      } else {
        this.historyList.refresh();
      }
    },
    loadInfo() {
      console.log(this.historyList);
      this.historyList && this.historyList.refresh();
    },
    // 接待列表
    requireCustomerList(state) {
      console.log(this.sid);
      console.log(this.usercode);
      this.$vux.loading.show({
        text: "加载中..."
      });
      let data = {
        userCode: this.usercode
      };
      let header = "text/plain;charset=UTF-8";
      let url = "/a/sale/saleReception/outer/queryData?__sid=" + this.sid;
      this.$api.post(url, data, header).then(res => {
        console.log(res);
        this.$vux.loading.hide();
        if (res.code == 200 && res.data) {
          if (state == "refresh") {
            this.$vux.toast.show({
              text: "刷新成功",
              type: "text",
              width: "10em"
            });
          }
          this.customerList = res.data;
        } else if (res.code == 10000) {
          this.showRecord == true;
        } else if (res.code == 30001) {
          this.$vux.toast.show({
            text: "账号权限不足",
            type: "text",
            width: "10em"
          });
        } else {
          if (state == "refresh") {
            this.$vux.toast.show({
              text: "刷新失败",
              type: "text",
              width: "10em"
            });
          }
          this.$vux.toast.show({
            text: res.msg,
            type: "text",
            width: "15em"
          });
        }
        console.log(this.customerList);
      });
    },
    // 结束接待
    overReception(id) {
      console.log(id);
      this.receptionCode = id;
      this.showBounced = true;
      this.state = -1;
      this.receptionNote = "";
    },
    // 关闭弹框
    closeBounced() {
      this.showBounced = false;
    },
    // 购买状态
    buyState(state) {
      this.state = state;
    },
    // 结束接待
    ensure() {
      if (this.state == -1) {
        this.$vux.toast.show({
          text: "请完善信息",
          type: "text",
          width: "10em"
        });
        return;
      }
      let header = "text/plain;charset=UTF-8";
      let url = "/a/sale/saleReception/outer/updateStatus?__sid=" + this.sid;
      let formData = {
        receptionCode: this.receptionCode,
        buyingStatus: this.state,
        remarks: this.receptionNote
      };
      this.$api.post(url, formData, header).then(res => {
        console.log(res);
        if (res.code == 200 && res.msg == "请求成功") {
          this.showBounced = false;
          // 再次请求列表
          this.requireCustomerList();
        } else {
          this.$vux.toast.show({
            text: res.msg,
            type: "text",
            width: "10em"
          });
        }
      });
    },
    // 更新接待信息
    updateReception(index, receptionStatus) {
      this.$router.push({
        name: "reception",
        params: { list: this.customerList[index], mark: 2 }
      });
      // if (receptionStatus == 1) {
      //   return;
      // } else if (receptionStatus == 0) {
      // }
    }
  }
};
</script>
<style scoped lang="less">
@import "~common/css/defult.less";
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// icon  B
.icon-nanshengnvshengicon-2,
.icon-nanshengnvshengicon-3,
.icon-nanshengnvshengicon- {
  font-size: 110 / @rem;
}
.icon-zanwujilu1 {
  color: #888;
  font-size: 120 / @rem;
}
// icon  E
.historyList {
  width: 100%;
  min-height: 100%;
  position: fixed;
  z-index: 100;
  top: 100 / @rem;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #fff;
}
.historyList .list {
  width: 100%;
  overflow: hidden;
}
.listWrapper {
  padding-bottom: 100 / @rem;
}
.item {
  padding: 70 / @rem 40 / @rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item .right {
  width: 560 / @rem;
  height: 110 / @rem;
  padding-left: 40 / @rem;
  box-sizing: border-box;
}
.item .right .rightWrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 110 / @rem;
  padding-bottom: 10 / @rem;
  border-bottom: 1px solid #eeeeee;
}
.left .userImg {
  width: 110 / @rem;
  height: 110 / @rem;
}
.left .userImg img {
  width: 110 / @rem;
  height: 110 / @rem;
  border-radius: 100%;
}
.right .userInfo {
  font-size: 30 / @rem;
  display: flex;
  flex-direction: column;
  align-items: left;
  // margin-left: 40 / @rem;
}
.userInfo .name {
  width: 220 / @rem;
  height: 40 / @rem;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 8 / @rem;
}
.userInfo .date {
  color: #aaaaaa;
  font-size: 24 / @rem;
}

.right .userState {
  width: 157 / @rem;
  height: 54 / @rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #222222;
  font-size: 28 / @rem;
  margin-top: 4 / @rem;
  border: 1px solid #eeeeee;
}
.right .changeFontSize {
  border: none;
  color: #aaaaaa;
  font-size: 24 / @rem;
}
.right .over {
  color: #aaa;
  font-size: 24 / @rem;
  margin-top: 40 / @rem;
}
// 弹框
.bounced {
  width: 100%;
  height: 665 / @rem;
  position: fixed;
  left: 0;
  bottom: 98 / @rem;
  z-index: 100;
  padding: 0 40 / @rem;
  box-sizing: border-box;
  background-color: #fff;
  transition: bottom ease 0.4s;
}
.dowmbounced {
  width: 100%;
  height: 665 / @rem;
  position: fixed;
  left: 0;
  bottom: -665 / @rem;
  z-index: 100;
  padding: 0 40 / @rem;
  box-sizing: border-box;
  background-color: #fff;
}
.header {
  color: #424242;
  font-size: 32 / @rem;
  height: 114 / @rem;
  line-height: 114 / @rem;
}
.buyState {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 40 / @rem;
}
.changeBgColor {
  color: #fff !important;
  background-color: #666666;
}
.buyState .left,
.buyState .right {
  flex: 1;
  height: 80 / @rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #424242;
  font-size: 28 / @rem;
  border: 1px solid #eeeeee;
}
.buyState .left {
  margin-right: 40 / @rem;
}
textarea {
  color: #424242;
  font-size: 24 / @rem;
  width: 100%;
  height: 260 / @rem;
  border: none;
  padding: 20 / @rem;
  box-sizing: border-box;
  background-color: #eeeeee;
}
.ensure {
  width: 100%;
  height: 85 / @rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 28 / @rem;
  margin-top: 40 / @rem;
  background-color: #424242;
}
.colse {
  position: absolute;
  right: 25 / @rem;
  top: -65 / @rem;
  color: #fff;
  padding: 10 / @rem 10 / @rem 0;
}
.shadow {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 6;
  background: rgba(0, 0, 0, 0.6);
}
.noRecode {
  position: fixed;
  top: 40%;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.noRecode .recordText {
  color: #888;
  font-size: 24 / @rem;
  margin-top: 15 / @rem;
}
::-webkit-input-placeholder {
  color: #aaaaaa;
}
</style>