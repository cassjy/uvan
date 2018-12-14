<template>
  <div id="categories">
    <!-- <search class="search"
    :auto-fixed="true"
    ref="search" 
    @on-focus="onFocusSearch" ></search> -->
    <!-- 分类头部标签 -->
    <!-- <div class="cate-titile">
      <div :class="['cate',nowCateName=='cate'?'bb':'']"
      @click="showCate">分类</div>
      <div :class="['cate',nowCateName=='style'?'bb':'']"
      @click="showStyle">风格</div>
    </div> -->
    <div class="win">
      <!-- 父级列表 -->
      <div class="parentswrapper" ref="parentswrapper" :style="{height: fullHeight-50+'px'}">
        <div class="parents">
          <!-- 分类父级 -->
          <div  
            v-for="(cate,index) in catelist" :key="index" 
            :class="['parents-name',nowCateIndex==index?'hl':'']" 
            :data-index="index" 
            @click="choosecate($event)">
            <div class="parents-name-inside">{{cate.categoryName||cate.seriesName}}</div>
          </div>
        <!-- 风格父级 -->   
          <!-- <div 
            v-for="(style,index) in stylelist" :key="index"
            :class="['parents-name',nowCateIndex==style.id?'hl':'']" @click="choosestyle(index)">
            <div class="parents-name-inside">{{style.seriesName}}</div>
          </div> -->
        </div>
      </div>
      <!-- 子级列表 -->
      <div class="childwrapper" ref="childwrapper" :style="{height: fullHeight-50+'px'}">
        <div class="children">
          <!-- 分类子级 -->
          <!-- <div :class="['child-name',index%2==0?'fl':'fr']" -->
          <div :class="['child-name','fl',(index+1)%3==0?'child-name-nomargin':'']"
              v-if="nowCateName=='cate'"
              v-for="(catechildren,index) in catechildrenlist"
              :data-id="catechildren.id"
              :key="catechildren.id">
            <router-link  :to="{name:'productlist', params:{pid:catechildren.id}}" class="child-name-link">
              <img class="child-img" :src="catechildren.imgPath">
              <div class="child-text">{{catechildren.categoryName||catechildren.seriesName}}</div>
            </router-link >
          
          </div>
        </div>
      </div>
    </div>
    
    <router-view></router-view>
  </div>
</template>

<script>
import { Search } from 'vux'
import BScroll from 'better-scroll'
import { mapGetters } from 'vuex'
export default {
  data(){
    return {
      nowCateName:'cate',//当前列表的名字（分类or风格）
      catelist:[],//分类父级列表
      stylelist:[],//风格父级列表
      catechildrenlist: [],//分类子级列表
      // stylechildrenlist: [],//风格子级列表
      nowCateIndex: 0,//当前选中的分类的索引
      // nowStyleIndex: 0,//当前选中的风格的索引
      fullHeight: document.documentElement.clientHeight,
      fromSearch: false,//控制显示搜索页面还是商品列表页面
      baseurl:'http://am.frp.uvanart.com:9200'
    }
  },
  components:{
    Search
  },
  created(){
    if (process.env.NODE_ENV == 'development') {
        this.baseurl = 'http://am.frp.uvanart.com:9200';
    } else if (process.env.NODE_ENV == 'debug') {
        this.baseurl = 'http://am.frp.uvanart.com:9200';
    } else if (process.env.NODE_ENV == 'production') {
        this.baseurl = 'http://am.frp.uvanart.com:9200';
    }
    let data = {
      
    }
    let url = '/a/product/productOuter/product?__sid='+this.sid
    this.$api.post(url,data)
    .then(res=>{
      console.log(res)
      if(res.code==200){
        this.catelist = res.data.products.concat(res.data.series)
        this.catechildrenlist = this.catelist[0].children;
      }
    })
    .catch(err=>{
      console.log(err)
    })
  },
  mounted(){
    this.$nextTick(() => {
      this.parentswrapper = new BScroll(this.$refs.parentswrapper, { mouseWheel: true, click: true, tap: true })
      this.childwrapper = new BScroll(this.$refs.childwrapper, {mouseWheel: true, click: true, tap: true});
    })
    const that = this
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight
        that.fullHeight = window.fullHeight
      })()
    }
  },
  computed: {
    ...mapGetters(['sid'])
  },
  watch: {
    fullHeight(val) {
      if (!this.timer) {
        this.fullHeight = val
        this.timer = true
        setTimeout(()=> {
          this.timer = false
        }, 400)
      }
    }
  },
  methods:{
    toproductlist(id){
      this.$router.push({
        name:"productlist",
        params:{
          pid:id
        }
      })
    },
    //展示分类和风格列表
    // showCate(){
    //   this.nowCateName = "cate";

    // },
    // showStyle(){
    //   this.nowCateName = "style";
    // },
    // 选择分类
    choosecate(e){
      this.nowCateIndex = e.currentTarget.dataset.index;
      this.catechildrenlist = this.catelist[this.nowCateIndex].children;
    },
    // 选择风格
    // choosestyle(index){
    //   this.nowStyleIndex = index;
    //   this.stylechildrenlist = this.stylelist[index].children;
    // },
    //请求分类or风格列表
    // cateAPI(apiName){
    //   this.$api.get('/lr/s2bapi/'+apiName).then(res => {
    //     console.log(res.data);
    //     if(apiName=="getproductcategories"){
    //       this.catelist = res.data;
    //       this.catechildrenlist = res.data[0].children;
    //    }else{
    //       this.stylelist = res.data;
    //       this.stylechildrenlist = res.data[0].children;
    //    }
        
    //   }).catch(err => {
    //     console.log(err);
    //   });
    // },
    //点击输入框（获取焦点）的时候跳转到搜索页面
    onFocusSearch(){
      this.fromSearch = true;
      let openid = 'oQCP70B01miObAGPrRIT9H_3nAG4';
      let searchHistory = [];
      this.$api.get('/lr/s2bapi/GetNewSearchHistory?data='+openid)
      .then(res=>{
        if(res.code == 200){
          searchHistory = res.data.Data;
        }
        this.$router.push({name:'productlist', params:{fromCate: true, searchHistory: searchHistory}});
      })
      .catch(err=>{
        console.log(err);
      })
      
    }, 
  }
}

</script>
	
<style lang="less" scoped>
  @import "~common/css/defult.less";
  #categories{
    // touch-action: none;
    position: fixed;
    top: 100/@rem;
    box-sizing: border-box;
    // padding-top: 100/@rem;
    // padding-bottom: 100/@rem;
    width: 100%;
    height: 1334/@rem;
    .search{
      position: fixed !important;
      top: 0;
      z-index: 10;
    }
    .cate-titile{
      position: fixed;
      top: 88/@rem;
      z-index: 10;
      display: flex;
      flex-direction: row;
      width: 100%;
      background-color: #fff;
      .cate{
        font-size: 32/@rem;
        flex: 1;
        height: 60/@rem;
        line-height: 60/@rem;
        text-align: center;
      }
      .bb{
        border-bottom: 4/@rem solid #917253;
      }
    }
    .win{
      box-sizing: border-box;
      height: 1234/@rem;
      display: flex;
      flex-direction: row;
      font-size: 26/@rem;
      // padding-top: 152/@rem;
      padding-bottom: 100/@rem;
      color: #666;
      background-color: #f7f8fa;
      .parentswrapper{
        flex: 1;
        // height: 1082/@rem;
        overflow: hidden;
        .parents{
          padding-bottom: 100/@rem;
          .parents-name{
            box-sizing: border-box;
            padding-left: 18/@rem;
            padding-right: 18/@rem;
            height: 104/@rem;
            width: 100%;
            text-align: left;
            line-height: 104/@rem;
            .parents-name-inside{
              box-sizing: border-box;
              height: 100%;
              // padding-left: 20/@rem;
              border-bottom: 1px solid #dedede;
              text-align: center;
            }
          }
          .hl{
            background-color: #fff;
          }
        }
      }
      .childwrapper{
        flex: 3.7;
        background-color: #fff;
        // height: 1082/@rem;
        overflow: hidden;
        .children{
          padding: 40/@rem 30/@rem 100/@rem 30/@rem;
          overflow: hidden;
          .child-name{
            box-sizing: border-box;
            width: 154/@rem;
            height: 186/@rem;
            text-align: center;
            margin-bottom: 40/@rem;
            margin-right: 30/@rem;
            .child-name-link{
              display: inline-block;
              // height: 100%;
              .child-img{
                box-sizing: border-box;
                border: 1px solid #eeeeee;
                width: 154/@rem;
                height: 154/@rem;
              }
              .child-text{
                font-size: 26/@rem;
                text-align: center;
                // margin-top: 10/@rem;
              }
            }
            
          }
          .child-name-nomargin{
            margin-right: 0;
          }
          .fl{
            float: left;
          }
          .fr{
            float: right;
          }
        }
        
      }
    }
  }
  
</style>
