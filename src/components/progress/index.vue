<template>
  <div>
    <div :style="getstyle" name="wrap-box" v-if="visibleSync" @click="eventvisibleSync($event)">
      <div style="text-align : center;color : #fff;margin-top : 16%">
        <h1>{{progressData.filename}}</h1>
      </div>
      <br />
      <div style="width : 75%;height : 23px;margin: 20px auto;">
        <div style="width : 100%">
          <div style="width :88%;display:inline-block">
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="loading"
              status="success"
            ></el-progress>
          </div>
          <div
            style="width : 10%;display:inline-block;margin-left : 12px"
            ref="loadingTitle"
            v-html="loadingTitle"
          ></div>
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
      visibleSync: false
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
      this.visibleSync = true;
      this.loadingTitle = "<span style='color:#fff'>下载中</span>";
      this.loading = 0;
      let { url, params, filename } = this.progressData;
      let timer;
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
                _that.loading = (e.loaded / e.total).toFixed() * 100;
                if (_that.loading === 100) {
                  _that.loadingTitle =
                    "<span style='color:#fff'>下载完成</span>";
                  timer = setTimeout(() => {
                    _that.visibleSync = false;
                    clearTimeout(timer);
                  }, 3000);
                }
              }
            })
            .then(fileData => {
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
                _that.IFTEMPLATE = false;
              } else {
                navigator.msSaveBlob(BlOB_LIST, filename);
              }
            })
            .catch(error => {
              console.error(error);
            });
        }
      });
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
</style>
