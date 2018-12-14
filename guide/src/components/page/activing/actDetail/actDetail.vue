<template>
  <div
    class="actDetail"
    :class="{paddingBottom:showSendBounch&&dataDetail.canComment}"
    id="actDetail"
  >
    <div id="detailBlock">
      <div class="header">
        <h2>{{dataDetail.activityName}}</h2>
        <p class="date">{{dataDetail.createTime}}~{{dataDetail.endTime}}</p>
      </div>
      <div class="content">
        <div v-html="dataDetail.activityIntroduce">
          <div>{{dataDetail.activityIntroduce}}</div>
        </div>
      </div>
      <div class="footer">
        <div class="border"></div>
        <div
          class="tab-wrapper"
          id="listening-area"
        >
          <div
            class="tab"
            :class="{left:tabId==0}"
            @click="selectTab(0)"
          >评论（{{commentNum||0}}）</div>
          <div
            class="tab"
            :class="{right:tabId==1}"
            @click="selectTab(1)"
          >常见问题</div>
        </div>
        <div
          class="comments-wrapper"
          v-if="tabId==0"
        >
          <div
            class="c-item"
            v-for="(item,index) in dataDetail.guideCommentList"
            :key="index"
            :id="index"
          >
            <h3>{{item.askBy}}</h3>
            <div class="info">
              <div class="left">{{item.askShop}}</div>
              <div class="right">{{item.askTime}}</div>
            </div>
            <p>{{item.question}}</p>
            <div
              class="adminReply"
              v-if="!!item.answerId"
            >
              <p class="title">{{item.answerBy}}：</p>
              <p>{{item.answer}}</p>
            </div>
            <div
              class="function"
              v-if="dataDetail.activityGroup"
            >
              <div></div>
              <div class="right">
                <div
                  class="replace"
                  @click.stop="openReplyWrapper(item.commentCode)"
                  v-if="!item.answerId"
                >回复</div>
                <div
                  class="more"
                  v-if="!!item.answerId"
                  @click="openTool(index)"
                >. . .
                  <div
                    class="tool"
                    v-if="showTool&&toolId==index"
                  >
                    <div
                      class="left"
                      @click.stop="deleteData(item.commentCode)"
                    ><span>删除</span></div>
                    <div
                      class="right"
                      v-clipboard:copy="item.answer"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError"
                    ><span>复制</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="noCommentRecord"
            v-if="noCommentRecord"
          >暂无评论记录</div>
        </div>
        <div
          class="problems-wrapper"
          v-if="tabId==1"
        >
          <div class="search-wrapper">
            <div
              class="ipt"
              :class="{reduceDistance:searchState}"
            > <input
                placeholder="输入关键字检索"
                v-model="keyword"
              />
              <div
                class="search"
                @click="search"
              ><i class="icon-sousuo1 iconfont"></i></div>
            </div>
            <div
              class="cancel"
              @click="cancel"
              v-if="searchState"
            >取消</div>
          </div>
          <div class="problem-list">
            <div
              class="item"
              v-for="(item2,index2) in dataDetail.guideFaqList"
              :key="index2"
            >
              <div
                class="top"
                @click="showMoreInfo(index2)"
              >
                <div class="left">
                  <div class="red-area">
                    <span>Q{{index2+1}}</span>
                    <div class="white-area"></div>
                  </div>
                  <div class="title">{{item2.faqQuestion}}</div>
                </div>
                <div class="right"><i
                    class="icon-xia2 iconfont"
                    :class="{rotate:problemIndex==index2&&showMoreText}"
                  ></i></div>
              </div>
              <div
                class="bottom"
                v-if="problemIndex==index2&&showMoreText"
              >
                <p>{{item2.faqAnswer}}</p>
              </div>
            </div>
            <div
              class="noRecord"
              v-if="noRecord"
            >暂无记录</div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="send-wrapper"
      v-if="showSendBounch&&dataDetail.canComment"
    >
      <div class="left"><input
          placeholder="评论"
          v-model="sendComment"
        /></div>
      <div
        class="right"
        @click="sendCommentWay"
      >发送</div>
    </div>
    <div
      class="reply-wrapper"
      v-if="showReplyWrapper"
    >
      <div class="up">
        <div class="title"><i class="icon-huifu2 iconfont"></i>管理员回复</div>
        <textarea
          placeholder="请输入回复内容"
          v-model="replyContent"
        ></textarea>
      </div>
      <div
        class="dowm"
        @click="reply"
      >回复</div>
    </div>
    <div
      class="shadow"
      v-if="showReplyWrapper"
      @click="showReplyWrapper=false"
    ></div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import { mapGetters } from "vuex";
import { Toast, Loading, Confirm } from "vux";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      tabId: 0,
      showTool: false,
      activingCode: "",
      showReplyWrapper: false,
      dataDetail: {},
      commentCode: "", //回复id
      replyContent: "", //回复内容
      problemIndex: -1,
      hisId: "",
      keyword: "",
      showMoreText: false,
      searchState: false,
      noRecord: false,
      noCommentRecord: false,
      toolId: -1, //工具id
      sendComment: "",
      showSendBounch: false,
      commentNum: 0
    };
  },
  created() {
    console.log(this.$route.params);
    this.activingCode = this.$route.params.code;
    this.requireActivingDetail(this.activingCode);
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("scroll", this.handleScroll, true);
    });
  },
  computed: {
    ...mapGetters(["sid", "usercode", "phone"])
  },
  methods: {
    handleScroll() {
      var scrollTop = document.getElementById("actDetail").scrollTop;
      var scrollHeight = document.getElementById("actDetail").scrollHeight;
      var offsetTop = document.querySelector("#listening-area").offsetTop;
      // console.log(scrollTop);
      // console.log(offsetTop);
      if (scrollTop > offsetTop || this.commentNum <= 5) {
        this.showSendBounch = true;
      } else {
        this.showSendBounch = false;
      }
    },

    // 请求活动详情.
    requireActivingDetail(code, source) {
      this.$vux.loading.show({
        text: "加载中"
      });
      let url =
        "a/guide/guideActivity/queryForm?activityCode=" +
        code +
        "&__sid=" +
        this.sid;
      this.$api
        .get(url)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.dataDetail = res.data;
            this.commentNum = res.data.guideCommentList.length;
            // 暂无常见问题记录
            if (res.data.guideFaqList.length == 0) {
              this.noRecord = true;
            } else {
              this.noRecord = false;
            }
            // 暂无评论记录
            if (res.data.guideCommentList.length == 0) {
              this.noCommentRecord = true;
            } else {
              this.noCommentRecord = false;
            }

            this.$nextTick(function() {
              window.addEventListener("scroll", this.handleScroll);
              let blockHeight = document.getElementById("detailBlock")
                .offsetHeight;
              if (blockHeight < 667) {
                this.showSendBounch = true;
              }
            });
            //
            if (source == "comment") {
              this.$nextTick(function() {
                var div = document.getElementById("actDetail");
                div.scrollTop = div.scrollHeight;
              });
            }
          } else {
            this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: "20em",
              time: "1000"
            });
          }
          this.$vux.loading.hide();
        })
        .catch(err => {
          this.$vux.toast.show({
            text: "系统错误！",
            type: "text",
            width: "20em"
          });
          this.$vux.loading.hide();
        });
    },

    // tab标签选择
    selectTab(index) {
      this.tabId = index;
      if(parseInt(index)==1){
        this.showSendBounch = false
      }else if(parseInt(index)==0){
        this.showSendBounch = true
      }
    },
    // 打开工具栏
    openTool(index) {
      console.log(index);
      this.toolId = parseInt(index);
      this.showTool = !this.showTool;
    },
    // 展示更多信息
    showMoreInfo(index) {
      let id = this.hisId;
      if (parseInt(id) === parseInt(index)) {
        this.showMoreText = !this.showMoreText;
      } else {
        this.hisId = index;
        this.showMoreText = true;
        this.problemIndex = parseInt(index);
      }
    },
    // 复制
    onCopy: function(e) {
      //   alert("You just copied: " + e.text);
      this.$vux.toast.show({
        type: "success",
        text: "复制成功",
        width: "12em",
        position: "middle"
      });
    },
    // 复制失败
    onError: function(e) {
      this.$vux.toast.show({
        text: "复制失败！",
        type: "text",
        width: "20em"
      });
    },
    //
    openReplyWrapper(code) {
      this.replyContent = "";
      this.showReplyWrapper = true;
      this.commentCode = code;
    },
    // 回复
    reply() {
      if (!this.replyContent) {
        this.$vux.toast.show({
          text: "请先输入评论内容！",
          type: "text",
          width: "20em",
          position: "middle"
        });
        return;
      }
      this.$vux.loading.show({
        text: "回复中..."
      });
      let replyData = {
        commentCode: this.commentCode,
        answer: this.replyContent
      };
      let replyUrl =
        "a/guide/guideActivity/editComment?__sid=" + this.sid + "&flag=0";
      this.$api
        .post(replyUrl, replyData, "application/json")
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.showReplyWrapper = false;
            this.$vux.toast.show({
              text: "回复成功",
              type: "text",
              width: "20em",
              position: "middle",
              time: '1000'
            });
            this.requireActivingDetail(this.activingCode);
          } else {
            this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: "20em"
            });
          }
          this.$vux.loading.hide();
        })
        .catch(err => {
          this.$vux.toast.show({
            text: "系统错误！",
            type: "text",
            width: "20em"
          });
          this.$vux.loading.hide();
        });
    },

    // 发表评论
    sendCommentWay() {
      if (!this.sendComment) {
        this.$vux.toast.show({
          text: "评论不能为空！",
          type: "text",
          width: "20em"
        });
        return;
      }
      let commentUrl = "a/guide/guideActivity/addComment?__sid=" + this.sid;
      let data = {
        activityCode: this.dataDetail.activityCode,
        question: this.sendComment
      };
      this.$api
        .post(commentUrl, data, "application/json")
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.$vux.toast.show({
              text: "评论成功！",
              type: "text",
              width: "20em",
              position: "middle",
              time: "1000"
            });
            this.sendComment = "";
            this.requireActivingDetail(this.activingCode, "comment");
          } else {
            this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: "20em"
            });
          }
        })
        .catch(err => {
          this.$vux.toast.show({
            text: "系统错误！",
            type: "text",
            width: "20em"
          });
          this.$vux.loading.hide();
        });
    },

    // 删除数据
    deleteData(code) {
      console.log(code);
      this.$vux.loading.show({
        text: "删除中..."
      });
      let replyData = {
        commentCode: code
      };
      let replyUrl =
        "a/guide/guideActivity/editComment?__sid=" + this.sid + "&flag=1";
      this.$api
        .post(replyUrl, replyData, "application/json")
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.showTool = false;
            this.$vux.toast.show({
              text: "删除成功！",
              type: "text",
              width: "20em",
              position: "middle"
            });
            this.requireActivingDetail(this.activingCode);
          } else {
            this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: "20em"
            });
          }
          this.$vux.loading.hide();
        })
        .catch(err => {
          this.$vux.toast.show({
            text: "系统错误！",
            type: "text",
            width: "20em"
          });
          this.$vux.loading.hide();
        });
    },

    // 按关键字查询
    search(state) {
      if (state != "cancel") {
        if (!this.keyword) {
          this.$vux.toast.show({
            text: "请输入搜索关键词！",
            type: "text",
            width: "20em"
          });
          return;
        }
      } else {
        this.keyword = "";
      }
      this.$vux.loading.show({
        text: "查询中"
      });
      let searchUrl =
        "a/guide/guideActivity/getFAQ?__sid=" +
        this.sid +
        "&activityCode=" +
        this.dataDetail.activityCode +
        "&keyword=" +
        this.keyword;
      console.log(searchUrl);
      this.$api
        .get(searchUrl)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.dataDetail.guideFaqList = res.data;
            if (res.data.length == 0) {
              this.noRecord = true;
            } else {
              this.noRecord = false;
            }
            if (state != "cancel") {
              this.searchState = true;
            }
          } else {
            this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: "20em"
            });
          }
          this.$vux.loading.hide();
        })
        .catch(err => {
          this.$vux.toast.show({
            text: "系统错误！",
            type: "text",
            width: "20em"
          });
          this.$vux.loading.hide();
        });
    },
    // 取消筛选
    cancel() {
      this.search("cancel");
      this.searchState = false;
    }
  }
};
</script>
<style  lang="less">
@import "~common/css/defult.less";
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.paddingBottom {
  padding-bottom: 108 / @rem;
}
.actDetail {
  width: 100%;
  height: 100%;
  padding-top: 40 / @rem;
  box-sizing: border-box;
  position: fixed;
  z-index: 100;
  top: 100 / @rem;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  // overflow: scroll;
  background-color: #fff;
  .header {
    padding: 0 40 / @rem 54 / @rem;
    border-bottom: 1px solid #eee;
    h2 {
      color: #222222;
      font-size: 34 / @rem;
      font-weight: bold;
      margin-bottom: 18 / @rem;
    }
    p {
      color: #888888;
      font-size: 24 / @rem;
    }
  }
  .content {
    padding: 40 / @rem 40 / @rem 0;
    p {
      color: #666666;
      font-size: 24 / @rem;
      line-height: 44 / @rem;
      text-indent: 48 / @rem;
      margin-bottom: 40 / @rem;
    }
  }
  .footer {
    padding-bottom: 100 / @rem;
    .border {
      width: 100%;
      height: 20 / @rem;
      background-color: #f4f4f4;
    }
    .tab-wrapper {
      width: 100%;
      height: 94 / @rem;
      line-height: 94 / @rem;
      text-align: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      .tab {
        color: #222;
        font-size: 28 / @rem;
        flex: 1;
        height: 94 / @rem;
        position: relative;
      }
      .tab:last-child {
        border-left: 1px solid #eee;
      }
      .tab.left::after {
        content: "";
        position: absolute;
        left: 29%;
        bottom: 0;
        height: 4 / @rem;
        width: 144 / @rem;
        background-color: #222;
      }
      .tab.left,
      .tab.right {
        font-weight: bold;
      }
      .tab.right::after {
        content: "";
        position: absolute;
        left: 31%;
        bottom: 0;
        height: 4 / @rem;
        width: 144 / @rem;
        background-color: #222;
      }
    }
    .comments-wrapper {
      padding: 0 40 / @rem;
      .c-item {
        padding: 34 / @rem 0 40 / @rem;
        border-bottom: 1px solid #eee;
        h3 {
          color: #222;
          font-size: 28 / @rem;
          font-weight: bold;
          margin-bottom: 8 / @rem;
        }
        .info {
          color: #aaa;
          font-size: 22 / @rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28 / @rem;
        }
        p {
          color: #666;
          font-size: 28 / @rem;
          line-height: 42 / @rem;
          // margin-bottom: 32 / @rem;
        }
        .adminReply {
          width: 100%;
          background-color: #f8f8f8;
          padding: 20 / @rem 20 / @rem 30 / @rem;
          box-sizing: border-box;
          margin-top: 20 / @rem;
          color: #666666;
          font-size: 24 / @rem;
          p {
            line-height: 44 / @rem;
          }
          .title {
            color: #aaaaaa;
            margin-bottom: 6 / @rem;
          }
        }
        .function {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 32 / @rem;
          .right {
            display: flex;
            flex-direction: row;
            align-items: center;
            .replace,
            .more {
              color: #484848;
              width: 96 / @rem;
              height: 40 / @rem;
              line-height: 40 / @rem;
              text-align: center;
              border: 1px solid #7d7d7d;
            }
            .more {
              line-height: 26 / @rem;
              position: relative;
              .tool {
                display: flex;
                flex-direction: row;
                align-items: center;
                position: absolute;
                right: 114 / @rem;
                top: -4 / @rem;
                width: 168 / @rem;
                height: 46 / @rem;
                color: #f8f8f8;
                background-color: #6e6e6e;
                .left,
                .right {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 24 / @rem;
                  flex: 1;
                  height: 46 / @rem;
                  text-align: center;
                  line-height: 46 / @rem;
                }
                .right {
                  border-left: 1px solid #b4b8bb;
                }
              }
              .tool::after {
                content: "";
                position: absolute;
                right: -8 / @rem;
                bottom: 14 / @rem;
                height: 14 / @rem;
                width: 14 / @rem;
                transform: rotate(45deg);
                background-color: #6e6e6e;
              }
            }
            .replace {
              margin-right: 20 / @rem;
            }
          }
        }
      }
      .noCommentRecord {
        color: #aaa;
        text-align: center;
        padding: 100 / @rem 0;
      }
    }
    .problems-wrapper {
      padding: 40 / @rem;
      .search-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        .cancel {
          width: 10%;
          height: 78 / @rem;
          line-height: 78 / @rem;
          text-align: right;
          color: #484848;
          font-size: 26 / @rem;
        }
      }

      .ipt {
        position: relative;
        width: 100%;
        height: 78 / @rem;
        line-height: 78 / @rem;
        padding: 0 100 / @rem 0 40 / @rem;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #c7c7c7;
        input {
          width: 100%;
          height: 74 / @rem;
          line-height: 76 / @rem;
          font-size: 24 / @rem;
        }
        .search {
          position: absolute;
          right: 0;
          top: 0;
          width: 100 / @rem;
          height: 78 / @rem;
          display: flex;
          justify-content: center;
          align-items: center;
          //   background-color: red;
          .icon-sousuo1 {
            color: #666666;
            font-size: 34 / @rem;
          }
        }
      }
      .reduceDistance {
        width: 90%;
      }
      .problem-list {
        width: 100%;
        .item {
          width: 100%;
          //   min-height: 145 / @rem;
          //   display: flex;
          //   justify-content: space-between;
          //   align-items: center;
          border-bottom: 1px solid #e7e6e6;
          .top {
            width: 100%;
            min-height: 145 / @rem;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left {
              width: 590 / @rem;
              display: flex;
              flex-direction: row;
              align-items: center;
              .red-area {
                position: relative;
                width: 50 / @rem;
                height: 40 / @rem;
                line-height: 40 / @rem;
                text-align: center;
                color: #fff;
                font-size: 20 / @rem;
                background-color: #df5353;
              }
              .red-area::after {
                content: "";
                position: absolute;
                left: 0;
                bottom: -12 / @rem;
                height: 12 / @rem;
                width: 12 / @rem;
                background-color: #df5353;
              }
              .white-area {
                position: absolute;
                left: 3 / @rem;
                bottom: -18 / @rem;
                height: 14 / @rem;
                width: 14 / @rem;
                z-index: 2;
                transform: rotate(49deg);
                background-color: #fff;
              }
              .title {
                color: #222;
                font-size: 26 / @rem;
                font-weight: bold;
                width: 550 / @rem;
                height: 40 / @rem;
                line-height: 40 / @rem;
                padding-left: 20 / @rem;
                box-sizing: border-box;
              }
            }
            .right {
              width: 80 / @rem;
              box-sizing: border-box;
              padding-left: 30 / @rem;
              .icon-xia2 {
                font-size: 50 / @rem;
              }
              .rotate {
                display: flex;
                animation: none 0 ease 0 1 normal;
                transform: rotate(180deg);
              }
            }
          }
          .bottom {
            margin-bottom: 40 / @rem;
            p {
              color: #666;
              font-size: 24 / @rem;
              line-height: 42 / @rem;
            }
          }
        }
        .noRecord {
          color: #aaa;
          text-align: center;
          padding: 100 / @rem 0;
        }
      }
    }
  }
  .send-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 108 / @rem;
    padding: 0 40 / @rem;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 0 6 / @rem 4 / @rem #eee;
    .left {
      width: 540 / @rem;
      height: 60 / @rem;
      input {
        width: 100%;
        height: 60 / @rem;
        line-height: 60 / @rem;
      }
    }
    .right {
      color: #fff;
      font-size: 26 / @rem;
      width: 120 / @rem;
      height: 60 / @rem;
      line-height: 60 / @rem;
      text-align: center;
      border-radius: 4 / @rem;
      background-color: #666666;
    }
  }
  .reply-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 505 / @rem;
    background-color: #fff;
    z-index: 3;
    .up {
      width: 100%;
      padding: 40 / @rem 40 / @rem 28 / @rem;
      box-sizing: border-box;
      .title {
        color: #a9a9a9;
        font-size: 26 / @rem;
        margin-bottom: 20 / @rem;
        .icon-huifu2 {
          color: #dadada;
          margin-right: 15 / @rem;
        }
      }
      textarea {
        color: #666;
        font-size: 24 / @rem;
        line-height: 38 / @rem;
        width: 100%;
        height: 280 / @rem;
        background-color: #f4f4f4;
        border: none;
        padding: 10 / @rem;
        box-sizing: border-box;
      }
    }
    .dowm {
      color: #fff;
      font-size: 28 / @rem;
      width: 100%;
      height: 96 / @rem;
      line-height: 96 / @rem;
      text-align: center;
      background-color: #474747;
    }
  }
  .shadow {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.6);
  }
  ::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: #cacaca;
  }
  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #cacaca;
  }
  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #cacaca;
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #cacaca;
  }
}
</style>


