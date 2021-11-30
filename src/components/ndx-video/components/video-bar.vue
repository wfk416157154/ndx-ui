<template>
  <div class="wrap-video-bar">
    <div class="wrap-play-pause">
      <img v-if="false" class="play" src="../icon/bofang.png" alt />
      <img v-else class="pause" src="../icon/zanting.png" alt />
    </div>
    <div class="wrap-progress">
      <el-slider v-model="value1" :show-tooltip="false"></el-slider>
    </div>
    <div class="voice">
      <img v-if="false" class="sound-on" src="../icon/shengyinkai.png" alt />
      <img v-else class="sound-off" src="../icon/shengyinguan.png" alt />
    </div>
    <div class="wrap-full-screen">
      <img class="full-screen" src="../icon/quanping.png" alt />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: 0
    };
  }
};
</script>

<style lang="scss" scoped>
.wrap-video-bar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  .wrap-play-pause {
    width: 6%;
    .play {
      width: 20px;
    }
    .pause {
      width: 20px;
    }
  }
  .wrap-progress {
    width: 82%;
  }
  .voice {
    width: 3%;
    margin-left: 20px;
    .sound-on {
      width: 20px;
    }
    .sound-off {
      width: 20px;
    }
  }
  .wrap-full-screen {
    width: 3%;
    margin-left: 20px;
    .full-screen {
      width: 20px;
    }
  }
}
</style>
