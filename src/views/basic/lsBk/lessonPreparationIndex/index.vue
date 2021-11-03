
<template>
  <div
    style="width : 100%;height : 100%;padding : 40px; box-sizing : border-box;text-align : center"
  >
    <div>
      <table style="width : 100%;" border="1" cellspacing="0">
        <thead>
          <tr>
            <th>课程</th>
            <th>{{paramsList.kcmc}}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>课程安排</td>
            <td>{{paramsList.name}}</td>
          </tr>
          <tr>
            <td>课程教学参考</td>
            <td>
              <editor v-model="paramsList.kcjxck" :disabled="true" :min-height="192" />
            </td>
          </tr>
          <tr>
            <td>教参内容</td>
            <td style="text-align : left">
              <editor v-model="paramsList.kcapjxck" :disabled="true" :min-height="192" />
            </td>
          </tr>
          <tr>
            <td>备课</td>
            <td style="text-align : left">
              <h3>已上传的图片</h3>
              <div class="clearfix">
                <div
                  v-for="(item,index) in itemResult.bkTpArr"
                  :key="index"
                  style="float : left;margin-right : 10px"
                >
                  <img style="width : 200px" :src="item" alt />
                </div>
              </div>
              <h3>已上传的文件</h3>
              <div class="clearfix">
                <div v-for="(item,index) in itemResult.bkWjArr" :key="index">
                  <a :href="item" style="color : #409EFF">{{++index}} ) {{item}}</a>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <editor v-model="itemResult.remark" :disabled="true" :min-height="192" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { secretKey } from "@/utils/tools";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
import {
  addPrepareLessons,
  prepareLessons
} from "@/api/basic/lessonPreparationHome";
export default {
  data() {
    return {
      form: {},
      paramsList: null,
      itemResult: {}
    };
  },
  created() {
    if (this.$route.query.list) {
      this.paramsList = JSON.parse(this.$route.query.list);
    }
  },
  mounted() {
    console.log(this.paramsList);
    this.getPrepareLessons();
  },
  methods: {
    getPrepareLessons() {
      prepareLessons(this.paramsList.prepareLessonsId).then(res => {
        if (res.code == 200) {
          this.itemResult = res.data;
        }
        console.log(res);
      });
    },
    // 图片预览 大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片删除
    handleRemove(file, fileList) {
      deleteImg(file.id).then(res => {
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
    // 学生表现图片上传成功回调
    bkSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.bkTpid || secretKey();
      this.form.bkTpid = data.kzzd1;
      addImg(data).then(res => {
        if (res.code == 200) {
          this.msgSuccess("成功 : 上传成功");
        } else {
          this.msgError("错误 : 上传失败");
        }
      });
    },
    // 文件上传前验证
    beforeAvatarUploadZIP(file) {
      const isLt40M = file.size / 1024 / 1024 < 40;
      if (!isLt40M) {
        this.$message.error("上传文件大小不能超过 40MB!");
      }
      return isLt40M;
    },
    // 文件上传成功处理压缩包
    addFileSuccess(response, file, fileList) {
      if (response.code == 200) {
        let data = response.data;
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        data.kzzd1 = this.form.bkWjid || secretKey();
        this.form.bkWjid = data.kzzd1;
        // 保存文件上传地址
        addFile(data).then(res => {
          if (res.code == 200) {
            this.msgSuccess("成功 : 上传成功");
          } else {
            this.msgError("错误 : 上传失败");
          }
        });
      } else {
        this.msgError("错误 : 上传失败");
      }
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    //提交备课
    addSuspension() {
      this.form.lsid = this.paramsList.lsid;
      this.form.rybjid = this.paramsList.bjid;
      this.form.templateId = this.paramsList.id;
      addPrepareLessons(this.form).then(res => {
        if (res.code == 200) {
          this.msgSuccess("成功 : 备课成功");
          this.$router.go(-1);
        } else {
          this.msgError("错误 : 备课失败");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
th,
td {
  padding: 20px;
  box-sizing: border-box;
}
</style>
