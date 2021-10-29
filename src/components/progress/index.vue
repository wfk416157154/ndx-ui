<template>
  <div>
    <div :style="getstyle" id="wrap-box" v-if="visibleSync" @click="eventvisibleSync($event)">
      <div class="center_zs fl">
        <div class="data-box1 box1-back" style="position : relative">
          <i class="topL"></i>
          <i class="topR"></i>
          <i class="bottomL"></i>
          <i class="bottomR"></i>
          <div class="data-title">
            <span>[ {{progressData.filename}} ]</span>
          </div>
          <div>
            <!-- <div style="text-align : center;color : #fff;margin-top : 16%">
              <h1>{{progressData.filename}}</h1>
            </div>
            <br />-->
            <div style="width : 75%;height : 23px;margin: 20px auto;margin-top : 100px">
              <div style="width : 100%">
                <div style="width :88%;display:inline-block">
                  <el-progress :text-inside="true" :stroke-width="20" :percentage="loading"></el-progress>
                </div>
                <div
                  style="width : 10%;display:inline-block;margin-left : 12px"
                  ref="loadingTitle"
                  v-html="loadingTitle"
                ></div>
              </div>
            </div>
          </div>
          <div style="position : absolute; right : 20px;bottom : 60px" v-if="ifBtn">
            <div class="btn" @click="ifVisibleSync">确定</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { tansParams } from "@/utils/ruoyi";
export default {
  data() {
    return {
      loading: 0,
      loadingTitle: null,
      IFTEMPLATE: false,
      getstyle: {},
      visibleSync: false,
      loadedData: null,
      totalData: null,
      ifBtn: false
    };
  },
  props: {
    progressData: {
      type: Object,
      default: ""
    }
  },
  mounted() {
    let _that = this;
    let style = {};
    let offsetObject = _that.getViewportOffset();
    style.width = `${offsetObject.w}px`;
    style.height = `${offsetObject.h}px`;
    style.background = "rgba(0, 0, 0, 0.5)";
    style.position = "fixed";
    style.top = 0;
    style.left = 0;
    style.right = 0;
    style.bottom = 0;
    style.zIndex = 100000;
    this.getstyle = style;
    window.addEventListener(
      "resize",
      function() {
        let offsetObject = _that.getViewportOffset();
        style.width = `${offsetObject.w}px`;
        style.height = `${offsetObject.h}px`;
      },
      false
    );
  },
  methods: {
    getViewportOffset() {
      if (window.innerWidth || window.innerHeight) {
        return {
          w: window.innerWidth,
          h: window.innerHeight
        };
      } else {
        if (document.compatMode == "CSS1Compat") {
          return {
            w: document.documentElement.clientWidth,
            h: document.documentElement.clientHeight
          };
        } else {
          return {
            w: document.body.clientWidth,
            h: document.body.clientHeight
          };
        }
      }
    },
    eventvisibleSync(e) {
      e.returnValue = false;
    },
    download() {
      this.loading = 0;
      this.visibleSync = true;
      this.loadingTitle = "<span style='color:#fff'>下载中</span>";
      let { url, params, filename } = this.progressData;
      let timer;
      let timerTem;
      let _that = this;
      this.$nextTick(() => {
        if (!this.IFTEMPLATE) {
          _that.IFTEMPLATE = true;
          request
            .post(url, params, {
              transformRequest: [
                params => {
                  return tansParams(params);
                }
              ],
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              timeout: 1000 * 60 * 10,
              responseType: "blob",
              onDownloadProgress: function(e) {
                _that.loadedData = e.loaded;
                _that.totalData = e.total;
                _that.loading =
                  (_that.loadedData / _that.totalData).toFixed() * 100;
                if (_that.loading === 100) {
                  _that.$nextTick(() => {
                    _that.loadingTitle =
                      "<span style='color:#fff'>下载完成</span>";
                  });
                  _that.ifBtn = true;
                }
              }
            })
            .then(fileData => {
              _that.IFTEMPLATE = false;
              if (_that.loadedData != _that.totalData) {
                _that.visibleSync = false;
                _that.$emit("data-callback", false);
                _that.msgError("提示 : 文件下载失败,请稍后再操作或联系管理员");
                return;
              }
              _that.$emit("data-callback", true);
              const CONTENT = fileData;
              const BlOB_LIST = new Blob([CONTENT]);
              if ("download" in document.createElement("a")) {
                const ELINKDOM = document.createElement("a");
                ELINKDOM.download = filename;
                ELINKDOM.style.display = "none";
                ELINKDOM.href = URL.createObjectURL(BlOB_LIST);
                document.body.appendChild(ELINKDOM);
                ELINKDOM.click();
                URL.revokeObjectURL(ELINKDOM.href);
                document.body.removeChild(ELINKDOM);
              } else {
                navigator.msSaveBlob(BlOB_LIST, filename);
              }
            })
            .catch(error => {
              console.error(error);
            });
        }
      });
    },
    ifVisibleSync() {
      this.visibleSync = false;
      this.ifBtn = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.progress-list {
  width: 0px;
  height: 100%;
  background: #67c23a;
  border-radius: 10px;
}
.center_zs {
  width: 80%;
  margin: 10%;
}
.topL {
  width: 20px;
  height: 20px;
  border-top-width: 2px;
  border-top-color: #26c6f0;
  border-top-style: solid;
  border-left-width: 2px;
  border-left-color: #26c6f0;
  border-left-style: solid;
  position: absolute;
  top: -2px;
  left: -2px;
}
.topR {
  width: 20px;
  height: 20px;
  border-top-width: 2px;
  border-top-color: #26c6f0;
  border-top-style: solid;
  border-right-width: 2px;
  border-right-color: #26c6f0;
  border-right-style: solid;
  position: absolute;
  top: -2px;
  right: -2px;
}
.bottomL {
  width: 20px;
  height: 20px;
  border-bottom-width: 2px;
  border-bottom-color: #26c6f0;
  border-bottom-style: solid;
  border-left-width: 2px;
  border-left-color: #26c6f0;
  border-left-style: solid;
  position: absolute;
  bottom: -2px;
  left: -2px;
}
.bottomR {
  width: 20px;
  height: 20px;
  border-bottom-width: 2px;
  border-bottom-color: #26c6f0;
  border-bottom-style: solid;
  border-right-width: 2px;
  border-right-color: #26c6f0;
  border-right-style: solid;
  position: absolute;
  bottom: -2px;
  right: -2px;
}
.data-title {
  text-align: center;
  color: #fff;
  font-size: 20px;
  span {
    background-color: #000c3b;
    padding: 10px;
  }
}
.data-box1 {
  height: 300px;
  border: 2px solid #032d60;
  -webkit-box-shadow: #07417a 0 0 10px;
  -moz-box-shadow: #07417a 0 0 10px;
  box-shadow: inset 0 0 30px #07417a;
  position: relative;
}

.btn {
  position: relative;
  padding: 10px 30px;
  margin: 0 45px;
  color: #fff;
  text-decoration: none;
  font-size: 20px;
  text-transform: uppercase;
  transition: 0.5s;
  cursor: pointer;
  font-weight: 800;
  overflow: hidden;
  -webkit-box-reflect: below 1px linear-gradient(transparent, #0003);
}

.btn:hover {
  background: #409eff;
  color: #111;
  box-shadow: 0 0 50px #409eff;
  transition-delay: 0.5s;
}

.btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  border-top: 2px solid #409eff;
  border-left: 2px solid #409eff;
  transition: 0.5s;
  transition-delay: 0.5s;
}

.btn:hover::before {
  width: 100%;
  height: 100%;
  transition-delay: 0s;
}

.btn::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #409eff;
  border-right: 2px solid #409eff;
  transition: 0.5s;
  transition-delay: 0.5s;
}

.btn:hover::after {
  width: 100%;
  height: 100%;
  transition-delay: 0s;
}
</style>
