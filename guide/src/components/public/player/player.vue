<template>
    <!-- 视频播放器 -->
    <div id="video">
        <div class="videoBox" @click="playIng">
            <video class="video" :poster="poster" :src="src" ref="v"></video>
            <img :src="poster" class="video videoImg" v-if="!play"/>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    src: {   // 视频地址
      type: String,
      default: ""
    },
    poster: {  // 视频封面图
      type: String,
      default: ""
    }
  },
  data() {
    return {
      play: false  // 当前播放状态
    };
  },
  methods: {
    playIng() {
      let video = this.$refs.v;
      if (!this.play) {
        video.play();
        this.play = true;
      } else {
        video.pause();
        this.play = false;
      }
    }
  }
};
</script>


<style lang="less" scoped>
@import "~common/css/defult.less";

.videoBox {
  position: relative;
  .video {
    width: 100%;
    height: 420/@rem;
  }
  .videoImg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 420/@rem;
  }
}
</style>
