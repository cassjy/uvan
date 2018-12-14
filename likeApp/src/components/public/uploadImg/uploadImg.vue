<template>
  <!-- 图片上传 -->
  <div class="uploadImg">
    <div class="imgList">
        <div class="img" v-for="(item, index) in list" :key="index"><img :src="item.src" /><i class="iconfont icon-guanbi" @click="_delImg(index)"></i></div>  
        <label class="upload iconfont icon-add" for="file"></label>
    </div>
    
    <input type="file" multiple="multiple"  @change="fileChange($event)" id="file"  accept="image/*" style="display:none">

    <!-- 提示 -->
    <confirm 
      v-model="show"
      @on-cancel="_onCancel"
      @on-confirm="_onConfirm">
        <p style="text-align:center;">是否删除此图片</p>
    </confirm>
  </div>
</template>

<script>
import {Confirm,Actionsheet, TransferDom} from 'vux'
export default {
  data() {
    return {
      size: 0,
      show: false,
      menus: {
        // 图片上传弹窗列表
        m1: "从相册中选择",
        m2: "拍照"
      },
      delImgIndex: 0,  // 当前删除图片索引
      list: [] // 上传图片列表
    };
  },
  methods: {
    fileChange(e) {
      if (!e.target.files.length ) return;
      if(this.list.length + e.target.files.length > 5){
        alert("最多只能上传5张"); 
        return;
      }else{
        this._tfImg(e.target.files);
      }
    },
    _tfImg(file) {
      // 把图片转换成BASE64
      let _this = this;
      for (let i = 0; i < file.length; i++) {
        this.size = this.size + file[i].size; //总大小
        let reader = new FileReader();
        reader.vue = this;
        reader.readAsDataURL(file[i]);
        reader.onload = function() {
          file[i].src = this.result;
          let t = file[i];
          _this.list.push(t); 
        };
      }
    },
    _delImg(index){
      this.show = true
      this.delImgIndex = index
    },
    // 显示询问弹窗
    _onCancel(){
      this.show = false
    },
    // 确定询问弹窗并删除图片
    _onConfirm(){
      this.list.splice(this.delImgIndex,1)
    },
    // 图片上传弹窗选择
    _menuClick(key) {
      switch(key){
        case 'm1':
          console.log(this.$refs.file.click())
          this.$refs.file.click()
        break;
        case 'm2':
           console.log(this.$refs.file.click())
          this.$refs.file.click()
        break;
      }
    }
  },
  components:{
    Confirm,
    Actionsheet,
    TransferDom,
  }
};
</script>

<style lang="less" scoped>
@import "~common/css/defult.less";
.uploadImg {
  .upload {
    width: 126/@rem;
    height: 126/@rem;
    border: 2/@rem solid #dcdcdc;
    text-align: center;
    line-height: 126/@rem;
    border-radius: 10/@rem;
    margin: 15/@rem;
    padding: 10/@rem;
    overflow: hidden;
    display: inline-block;
    vertical-align: top;
    display: inline-block;
    i {
      font-size: 45/@rem;
      color: #dcdcdc;
    }
  }

  .imgList{
    margin-left: 15/@rem;
    .img{
      position: relative;
      display: inline-block;
      vertical-align: top;
      .icon-guanbi{position: absolute;font-size: 30/@rem;background: #ca0a0a;color: #fff;right: 0;top: 0;padding: 5/@rem}
    }
    img{width: 150/@rem; height: 150/@rem;margin: 15/@rem}
  }
}
</style>
