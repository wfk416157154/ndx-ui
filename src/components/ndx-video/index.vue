<template>
  <div class="wrap-video" style>
    <div class="video" style="width ; 100%;height : 100%">
      <video
        ref="video"
        controlslist="nodownload"
        disablepictureinpicture
        :src="executeDocument.videoUrl"
        preload
        :disabled="executeDocument.disabledProgress"
        @timeupdate="getTimeupdate"
        @play="monitorPlay"
        muted
        class="video-box"
      ></video>
    </div>
    <div class="video-bar full-screen-style carousel-btn">
      <div class="wrap-video-bar">
        <div class="wrap-play-pause">
          <img v-if="playStatus" class="play" src="./icon/bofang.png" alt @click="startPlaying" />
          <img v-else class="pause" src="./icon/zanting.png" alt @click="stopPlaying" />
        </div>
        <div class="wrap-progress">
          <div>
            <el-slider
              @change="toVideoProgress"
              @mousedown.native="stopVideo"
              v-model="videoProgress"
              :disabled="executeDocument.disabledProgress"
              :show-tooltip="false"
            ></el-slider>
          </div>
        </div>
        <div class="voice">
          <div class="voice-slider">
            <el-slider
              v-model="voiceSlider"
              @change="eaitVoiceSlider"
              class="slider"
              vertical
              height="80px"
            ></el-slider>
          </div>
          <div>
            <img
              v-if="voiceStatus"
              class="sound-on"
              src="./icon/shengyinkai.png"
              alt
              @click="adjustmentVoice"
            />
            <img v-else class="sound-off" src="./icon/shengyinguan.png" alt @click="muteSubmit" />
          </div>
        </div>
        <div class="wrap-full-screen">
          <img class="full-screen" src="./icon/quanping.png" alt @click="fullScreen" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import videoBar from "./components/video-bar";
export default {
  data() {
    return {
      playStatus: true,
      voiceStatus: true,
      videoProgress: null,
      timer: null,
      newCurrentTime: 0,
      targetDuration: 0,
      voiceSlider: 30
    };
  },
  props: {
    executeDocument: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted() {
    this.$refs.video.addEventListener(
      "contextmenu",
      function(e) {
        e = window.e || e;
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = true;
        }
      },
      false
    );
  },
  methods: {
    getTimeupdate() {
      this.newCurrentTime = this.$refs.video.currentTime;
      this.targetDuration = this.$refs.video.duration;
      this.videoProgress = Math.round(
        (this.newCurrentTime / this.targetDuration) * 100
      );
      this.$emit("realTimePush", {
        newCurrentTime: this.newCurrentTime,
        targetDuration: this.targetDuration
      });
      if (this.newCurrentTime === this.targetDuration) {
        this.playStatus = true;
        this.$emit("executionFun");
      }
      let index = this.executeDocument.stopTime.indexOf(
        +this.newCurrentTime.toFixed(0)
      );
      if (index != -1) {
        this.stopPlaying();
        this.$emit("executionFun", this.executeDocument.stopTime[index]);
        this.executeDocument.stopTime.splice(index, 1);
      }
    },
    // ??????
    eaitVoiceSlider(val) {
      this.$refs.video.volume = val / 100;
    },
    monitorPlay() {
      this.playStatus = false;
    },
    // ??????
    stopVideo() {
      this.stopPlaying();
    },
    // ??????
    toVideoProgress(val) {
      this.newCurrentTime = val;
      this.$refs.video.currentTime = (val / 100) * this.targetDuration;
      this.startPlaying();
    },
    // ????????????
    startPlaying() {
      this.playStatus = false;
      this.$refs.video.volume = this.voiceSlider / 100;
      this.$refs.video.play();
    },
    // ????????????
    resetVideo() {
      this.$refs.video.currentTime = 0;
      this.playStatus = false;
      this.$refs.video.play();
    },
    // ????????????
    stopPlaying() {
      this.playStatus = true;
      this.$refs.video.pause();
    },
    // ????????????
    adjustmentVoice() {
      this.voiceStatus = false;
      this.$refs.video.muted = true;
    },
    // ??????
    muteSubmit() {
      this.voiceStatus = true;
      this.$refs.video.muted = false;
    },
    // ??????
    fullScreen() {
      if (this.$refs.video.requestFullscreen) {
        this.$refs.video.requestFullscreen();
      } else if (this.$refs.video.mozRequestFullScreen) {
        this.$refs.video.mozRequestFullScreen();
      } else if (this.$refs.video.msRequestFullscreen) {
        this.$refs.video.msRequestFullscreen();
      } else if (this.$refs.video.oRequestFullscreen) {
        this.$refs.video.oRequestFullscreen();
      } else if (this.$refs.video.webkitRequestFullscreen) {
        this.$refs.video.webkitRequestFullScreen();
      } else {
        const docHtml = document.documentElement;
        const docBody = document.body;
        const videobox = document.getElementById("video");
        const cssText = "width:100%;height:100%;overflow:hidden;";
        docHtml.style.cssText = cssText;
        docBody.style.cssText = cssText;
        videobox.style.cssText = cssText + ";" + "margin:0px;padding:0px;";
        document.IsFullScreen = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap-video {
  width: 100%;
  height: 100%;
  position: relative;
  &:hover {
    .carousel-btn {
      opacity: 0.5;
    }
  }
  video {
    width: 100%;
    height: 100%;
    .video-box {
      width: 100%;
      height: 100%;
    }
  }
  .video-bar {
    width: 100%;
    height: 15%;
    background-image: linear-gradient(#aaa, #000);
    position: absolute;
    bottom: 0%;
    opacity: 0.8;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    opacity: 0;
    transition: all 1s;
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
        position: relative;
        display: flex;
        justify-content: center;
        &:hover {
          .voice-slider {
            .slider {
              opacity: 1;
            }
          }
        }
        .voice-slider {
          position: absolute;
          top: -90px;
          width: 100%;
          height: 30px;
          text-align: center;
          display: flex;
          justify-content: center;
          .slider {
            transition: all 1s;
            opacity: 0;
          }
        }
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
  }
  video::-webkit-media-controls-timeline {
    display: none;
  }
}
</style>
