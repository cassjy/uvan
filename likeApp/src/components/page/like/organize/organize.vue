<template>
  <div class="departmentBody">

    <!-- <transition name="fadeInLeft"> -->
    <div v-if="showDepartment">
      <div class="header-ua">
        <div class="searchbar">
          <i class="iconfont icon-sousuo1"></i>
          <form action="javascript:return true;">
            <input type="search" placeholder="优梵星空（北京）文化传播有限公司" v-model="searchName" @keyup.enter="search('1')">
          </form>
          <div class="search-cancel" v-if="showSearch" @click="cancelSearch">取消</div>
        </div>
        <div class="breadheader">
          <!-- <scroll class="breadheader-scroll"> -->
          <div class="contact-icon" ref="contact">联系人
            <span v-for="(b,index) in headerList" :key="index">
              <i class="iconfont icon-jiantou"></i>
              <i @click="shipDetail(b)" :class="[index==headerList.length-1?'contact-now':'']">{{b.name}}</i>
            </span>
          </div>
          <!-- </scroll> -->
        </div>
      </div>
      <div class="header-line"></div>
      <div class="body-ua" ref="departmentBody" :style="{height: fullHeight-116+'px'}">
        <div>
          <div v-if="showD">
            <div class="department" v-for="(department,index) in departmentList" :key="index" @click="shipDetail(department)" v-if="department.userCount!=0">
              <div>{{department.name}} ({{department.userCount}})</div>
              <div class="iconfont icon-jiantou"></div>
            </div>
            <div v-if="user.userid !=p.userid" class="colleagues" v-for="(p,i) in dUserList" @click="back(p)">
              <img :src="p.avatar" alt="" class="c-pi">
              <div class="c-name">
                <div class="e-name">{{p.name}}</div>
                <div class="e-position">{{p.position}}</div>
              </div>

            </div>
          </div>

          <div class="search-win" v-if="showSearch">
            <div class="colleagues" v-for="(person,index) in userList" :key="index" @click="back(person)">
              <img :src="person.avatar" alt="" class="c-pi">
              <div class="c-name">
                <div class="e-name">{{person.name}}</div>
                <div class="e-position">{{person.position}}</div>
              </div>
            </div>
          </div>

          <div class="colleagues" v-if="showP &&user.userid !=person.userid" v-for="(person,index) in userList" :key="index" @click="back(person)">

            <img :src="person.avatar" alt="" class="c-pi">
            <div class="c-name">
              <div class="e-name">{{person.name}}</div>
              <div class="e-position">{{person.position}}</div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <!-- </transition> -->

  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import BScroll from "better-scroll";
import { Loading, Toast } from "vux";
export default {
  name: "organize",
  data() {
    return {
      options: {
        pullDownRefresh: {
          threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 20 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        pullUpLoad: {
          threshold: -20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
        },
        pullDownRefresh: false, //关闭下拉
        // pullUpLoad: false, // 关闭上拉
        click: true,
        probeType: 3,
        startY: 0,
        scrollbar: false,
        mouseWheel: true,
        click: true,
        tap: true,
        // preventDefault: false
        preventDefaultException: {
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|DIV)$/
        },
        bounce: {
          top: false,
          bottom: false,
          left: false,
          right: false
        }
      },
      departmentList: ["27364234", "54235235"],
      show: false,
      headerList: [],
      showD: true,
      showP: false,
      userList: [],
      dUserList: [],
      fullHeight: document.documentElement.clientHeight,
      searchName: "",
      showSearch: false,
      searchpageNo: 1,
      searchTotal: 0,
      canSearch: true,
      showDepartment: false,
      fromwhere: "", //进入通讯录的来源地址
      candidateId: 0, //候选人id
      departmentId: "", //部门ID
      departmentName: "" //部门名称
    };
  },
  components: {
    Loading
  },
  created() {
    console.log(this.$route.params);
    if (!!this.$route.params.from) {
      //from不为空时记录来源路径
      this.fromwhere = this.$route.params.from;
      this.candidateId = parseInt(this.$route.params.id);
    }
    this.$vux.loading.show({
      text: "正在加载"
    });
    this.getDepartment(1);
  },
  mounted() {},
  computed: {
    ...mapGetters(["user"])
  },
  watch: {},
  methods: {
    cancelSearch() {
      this.showD = true;
      this.showSearch = false;
      this.searchName = "";
      this.getDepartment(1);
    },
    search(flag) {
      if (!this.canSearch) {
        return;
      }
      this.canSearch = false;
      this.$vux.loading.show({
        text: "正在加载"
      });
      if (this.searchName != this.lastSearchName || flag == "1") {
        this.userList = [];
      }
      this.showSearch = true;
      this.showD = false;
      let url =
        "/ding/dingUser/getUserList?name=" +
        this.searchName +
        "&pageNo=" +
        this.searchpageNo +
        "&userid=" +
        this.user.userid;
      this.$api.post(url).then(res => {
        console.log(res);
        debugger;
        this.userList = this.userList.concat(res.data.userList);
        this.searchTotal = res.data.count;
        this.lastSearchName = this.searchName;
        this.canSearch = true;
        this.$vux.loading.hide();
        this.$nextTick(() => {
          setTimeout(() => {
            this.pullingDownUp();
          }, 500);
          this.departmentBody.on("pullingUp", () => {
            this.searchpageNo++;
            if (this.searchpageNo * 20 - this.searchTotal > 20) {
              return;
            }
            this.search("2");
          });
        });
      });
    },
    pullingDownUp() {
      this.departmentBody.finishPullUp(); //告诉 better-scroll 数据已加载
      this.departmentBody.refresh(); //重新计算元素高度
    },
    shipDetail: function(d) {
      this.showSearch = false;
      var _this = this;
      this.show = false;
      if (d.treeLeaf == 0) {
        this.getDepartment(d.departmentId);
        this.showD = true;
        this.showP = false;
      } else {
        //显示用户样式；
        if (this.headerList.indexOf(d) == -1) {
          this.headerList.push(d);
        }
        var data1 = {
          id: d.departmentId
        };
        this.$api
          .post("ding/dingUser/getUserListByDepartmentId", data1)
          .then(res => {
            console.log(res);
            this.userList = res.data;
            this.$nextTick(() => {
              this.departmentBody = new BScroll(
                this.$refs.departmentBody,
                this.options
              );
            });
          });
        this.showD = false;
        this.showP = true;
        setTimeout(function() {
          _this.show = true;
        }, 0.5);
      }
    },
    //根据部门id获取子集部门
    getDepartment: function(id) {
      var _this = this;
      var data = {
        departmentId: id
      };
      this.$api.post("ding/dingDepartment/getDepartments", data).then(res => {
        console.log(res);
        if (res.code == 200) {
          debugger;
          this.departmentList = res.data.childdept;
          var head = {
            name: res.data.name,
            departmentId: res.data.departmentId,
            treeLeaf: res.data.treeLeaf
          };
          var no = _this.headerList.findIndex(function(i) {
            return i.name == head.name;
          });
          if (no != -1) {
            var a = _this.headerList.slice(no, _this.headerList.length);
            _this.headerList.splice(no + 1, a.length);
          } else {
            _this.headerList.push(head);
          }
          this.departmentId = res.data.departmentId;
          this.departmentName = res.data.name;
          this.dUserList = res.data.userList;
          this.show = true;
          this.$vux.loading.hide();
          this.showDepartment = true;
          this.$nextTick(() => {
            this.departmentBody = new BScroll(
              this.$refs.departmentBody,
              this.options
            );
          });
          setTimeout(function() {
            _this.show = true;
          }, 0.5);
        }
      });
    },
    back: function(p) {
      console.log(this.fromwhere);
      // return
      if (this.fromwhere == "primary") {
        let localSelectedPerson =
          JSON.parse(window.localStorage.getItem("localSelectedPerson")) || [];
        // 判断缓存是否存在已选人
        let selectState = false; //用户判断是否已经选过该同学
        localSelectedPerson.forEach(item => {
          if (item.id == p.id) {
            this.$vux.toast.show({
              text: "亲！不能重复选择该同学哦~",
              type: "text",
              width: "20em",
              time: "1000"
            });
            selectState = true;
            return;
          }
        });
        if (selectState) {
          return;
        }
        // 重构用户数据（添加部门id和部门名称）
        p.departmentId = this.departmentId;
        p.departmentName = this.departmentName;
        // 根据候选人id进行数组元素替换
        localSelectedPerson.splice(this.candidateId, 1, p);
        console.log(localSelectedPerson);
        // localSelectedPerson.push(p);
        window.localStorage.setItem(
          "localSelectedPerson",
          JSON.stringify(localSelectedPerson)
        );
        this.$router.go(-1);
        // this.$router.replace({
        //   name: "primary"
        // });
      } else {
        this.$store.commit("setLikePerson", p);
        this.$router.replace({ path: "/like" });
      }
      // this.$store.commit("setLikePerson", p);
      // this.$router.replace({ path: "/like" });
      //缓存weex
      // this.$store.
      // this.$router.push(
      //     {
      //         name:"like",
      //         params:{
      //             person:p
      //         }
      //     }
      // )
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/css/defult.less";
img {
  object-fit: cover;
}
.header-ua {
  // margin-bottom: 28 / @rem;
  background-color: #fff;
  .searchbar {
    margin: 33 / @rem 30 / @rem 18 / @rem;
    background-color: #ededef;
    height: 72 / @rem;
    width: 698 / @rem;
    display: flex;
    // text-align: center;
    line-height: 72 / @rem;
    .icon-sousuo1 {
      flex: 0 0 50 / @rem;
      font-size: 26 / @rem;
      margin-left: 20 / @rem;
      color: #989b9e;
    }
    form {
      // overflow: auto;
      flex: 1;
    }
    input {
      font-size: 30 / @rem;
      // flex: 1;
      width: 100%;
      background-color: #ededef;
    }
    .search-cancel {
      background-color: #fff;
      flex: 0 0 106 / @rem;
      font-size: 30 / @rem;
      color: #0e0e0e;
      text-align: right;
    }
  }
  .breadheader {
    width: 690 / @rem;
    // height: 30 / @rem;
    line-height: 34 / @rem;
    font-size: 30 / @rem;
    margin: 30 / @rem;
    .breadheader-scroll {
      width: 690 / @rem;
      // overflow: hidden;
    }
    .contact-icon {
      color: #0c8dfc;
      .icon-jiantou {
        font-size: 26 / @rem;
        color: #dfdfdf;
      }
      .contact-now {
        color: #7e8285;
      }
    }
  }
}
.header-line {
  height: 30 / @rem;
  width: 100%;
  background-color: #f6f6f6;
}
.body-ua {
  padding: 0 30 / @rem;
  overflow: hidden;
  .department {
    font-size: 28 / @rem;
    height: 30 / @rem;
    padding: 35 / @rem 0 / @rem;
    border-bottom: #eee 1 / @rem solid;
    display: flex;
    justify-content: space-between;
    .icon-jiantou {
      color: #e3e3e3;
    }
  }
  .colleagues {
    font-size: 30 / @rem;
    height: 128 / @rem;
    display: flex;
    img {
      margin: 30 / @rem 22 / @rem 30 / @rem 0;
      flex: 0 0 70 / @rem;
      border-radius: 50%;
      width: 70 / @rem;
      height: 70 / @rem;
    }
    .c-name {
      box-sizing: border-box;
      height: 128 / @rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 30 / @rem 0;
      border-bottom: #eee 1 / @rem solid;
      .e-name {
        font-size: 30 / @rem;
        line-height: 40 / @rem;
        flex: 0 0 40 / @rem;
      }
      .e-position {
        flex: 0 0 32 / @rem;
        font-size: 22 / @rem;
        line-height: 32 / @rem;
      }
    }
  }
}
.departmentBody {
  width: 100%;
  min-height: 100%;
  background-color: #f6f6f6;
  position: fixed;
  z-index: 110;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #fff;
}

.department-enter-active,
.department-leave-active {
  transition: opacity 2s;
}
.department-enter, .department-leave-to /* .department-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.fadeInLeft-enter-active,
.fadeInLeft-leave-active {
  transition: all 0.5s ease;
}
.fadeInLeft-enter, .fadeInLeft-leave-to /* .department-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
}

// #animation{
// -webkit-animation:fadeInLeft 1s .2s ease both;
// -moz-animation:fadeInLeft 1s .2s ease both;}
// @-webkit-keyframes fadeInLeft{
// 0%{opacity:0;
// -webkit-transform:translateX(-20px)}
// 100%{opacity:1;
// -webkit-transform:translateX(0)}
// }
// @-moz-keyframes fadeInLeft{
// 0%{opacity:0;
// -moz-transform:translateX(-20px)}
// 100%{opacity:1;
// -moz-transform:translateX(0)}
// }
.search-win {
  background-color: #fff;
  .colleagues {
    font-size: 30 / @rem;
    height: 128 / @rem;
    display: flex;
    img {
      margin: 30 / @rem 22 / @rem 30 / @rem 0;
      flex: 0 0 70 / @rem;
      border-radius: 50%;
      width: 70 / @rem;
      height: 70 / @rem;
    }
    .c-name {
      box-sizing: border-box;
      height: 128 / @rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 30 / @rem 0;
      border-bottom: #eee 1 / @rem solid;
      .e-name {
        font-size: 30 / @rem;
        line-height: 40 / @rem;
        flex: 0 0 40 / @rem;
      }
      .e-position {
        flex: 0 0 32 / @rem;
        font-size: 22 / @rem;
        line-height: 32 / @rem;
      }
    }
  }
}
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none; //此处只是去掉默认的小×
}

input::-webkit-input-placeholder {
  color: #bfbfbf;
  font-size: 30 / @rem;
}

input:-moz-input-placeholder {
  color: #bfbfbf;
  font-size: 30 / @rem;
}

input:-ms-input-placeholder {
  color: #bfbfbf;
  font-size: 30 / @rem;
}
</style>