<template>
  <div class="app-container">
    <el-tabs type="border-card" @tab-click="tabClick" value="1">
      <el-tab-pane label="原版课件" name="1">
        <iframe style="width: 100%;" height="750px" :src="iframeSrc" v-if="showYbkjIframe"></iframe>
      </el-tab-pane>
      <el-tab-pane label="上传修改后的课件" name="2">
        <div>
          <div slot="footer" class="dialog-footer" style="margin: 0px 0px 10px 10px;">
            <el-button type="primary" @click="updateCoursewareByStatus" :disabled="enableBtn||!isUploadXgkj">启用修改后的课件</el-button>
            <el-button type="success" v-if="enableBtn">该课件已启用</el-button>
          </div>
          <iframe style="width: 100%;" height="750px" :src="xgkjIframeSrc" v-if="showXgkjIframe"></iframe>
          <el-upload
            v-if="showUpload"
            ref="xgkjUpload"
            :limit="1"
            accept="*"
            :headers="upload.headers"
            :action="upload.url"
            :on-remove="handleRemove"
            :on-progress="handleFileUploadProgress"
            :on-success="handleXgkjSuccess"
            :auto-upload="true"
            :file-list="xgkjWjidFile"
            drag
            v-loading="fullscreenLoading"
            element-loading-text="正在进行上传·······"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </div>
      </el-tab-pane>
      <el-tab-pane label="查看修改记录" name="3">

      </el-tab-pane>
    </el-tabs>


  </div>


</template>

<script>
  import {getToken} from "@/utils/auth";
  import {addFile, selectFileList, delFile} from "@/api/tool/common";
  import {secretKey} from "@/utils/tools";
  import {listCourseware, getCourseware, delCourseware, addCourseware, updateCourseware} from "@/api/basic/courseware";

  let Base64 = require("js-base64").Base64;
  export default {
    data() {
      return {
        showYbkjIframe: false,// 默认不展示
        showXgkjIframe: false,// 默认不展示
        iframeSrc: "",
        xgkjIframeSrc: "",
        fullscreenLoading: false,
        showUpload: false,
        // 导入参数
        upload: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "上传",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: {Authorization: "Bearer " + getToken()},
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/file/upload"
        },
        xgkjWjidFile: [],// 修改后的课件列表
        xgkjWjid: secretKey(),// 修改后的课件id
        kcrwId: "",// 课程任务id
        parentParams: null,
        kjLoading: null,
        enableBtn: true,// 启用按钮，默认true,禁用状态
        isUploadXgkj:false,// 是否上传修改课件，默认未上传
      };
    },
    created() {

    },
    mounted() {
      this.parentParams = Object.assign(this.$route.query);
      /* 是否显示上传组件 */
      this.showUpload = this.parentParams.courseware.xgkjUrl ? false : true;
      /* 启用按钮 是否启用 */
      this.enableBtn = this.parentParams.courseware.status && this.parentParams.courseware.status != "3" ? false : true;
      /* 显示原版课件 */
      this.showYbkj(this.parentParams.courseware.ybkjUrl)
      if("2"==this.parentParams.courseware.status){
        this.isUploadXgkj=true;
      }
    },
    methods: {
      tabClick(e) {
        switch (e.name) {
          case "1":
            break;
          case "2":
            this.showXgkj(this.parentParams.courseware.xgkjUrl);
            break;
          case "3":

            break;
          default:
            break;
        }
      },
      showLoading() {
        this.kjLoading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
      },
      /* 展示原版课件 */
      showYbkj(url) {
        this.showLoading();
        let encodeurl = Base64.encode(url);
        this.getConfigKey("onlinePreviewUrl").then((res) => {
          this.iframeSrc = res.msg + encodeURIComponent(encodeurl);
          this.kjLoading.close();
          this.showYbkjIframe = true;
        });
      },
      /* 展示修改课件 */
      showXgkj(url) {
        if(!url){
          this.msgError("还未上传修改课件！")
          return;
        }
        this.showLoading();
        let encodeurl = Base64.encode(url);
        this.getConfigKey("onlinePreviewUrl").then((res) => {
          this.xgkjIframeSrc = res.msg + encodeURIComponent(encodeurl);
          this.kjLoading.close();
          this.showXgkjIframe = true;
        });
      },
      //文件删除
      handleRemove(file, fileList) {
        delFile(file.id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message.error("删除失败");
          }
        });
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 修改后的课件上传成功的回调
      handleXgkjSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        let data = response.data;
        data.kzzd1 = this.xgkjWjid;
        addFile(data).then(res => {
          file.id = res.data.id;
          this.msgSuccess("文件上传成功");
          this.xgkjWjidFile = fileList;
          this.updateCourseware(data);
          this.showUpload=false;
          this.isUploadXgkj=true;
          this.parentParams.courseware.xgkjUrl=data.url
          this.showXgkj(data.url)
        });
      },
      /* 修改课件信息 */
      updateCourseware(data) {
        let obj = {
          id: this.parentParams.courseware.id,
          xgkjWjid: this.xgkjWjid,// 修改后课件-文件id
          xgkjUrl: data.url,// 修改后课件-文件路径
          status: "2",// 修改后的课件已上传
        }
        updateCourseware(obj).then(res => {
        });
      },
      /* 修改课件状态为启用 */
      updateCoursewareByStatus() {
        let obj = {
          id: this.parentParams.courseware.id,
          status: "3",// 修改课件为启用
        }
        updateCourseware(obj).then(res => {
          this.msgSuccess(res.msg);
          this.enableBtn=true;
        });
      },

    }
  };
</script>
