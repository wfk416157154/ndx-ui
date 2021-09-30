
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
            <td>{{paramsList.kcjxck}}</td>
          </tr>
          <tr>
            <td>教参内容</td>
            <td style="text-align : left">
              <editor v-model="form.kzzd1" :min-height="192" />
            </td>
          </tr>
          <tr>
            <td>备课</td>
            <td style="text-align : left">
              <p>图片上传</p>
              <el-upload
                :action="upload.imgUrl"
                :headers="upload.headers"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="bkSuccess"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
              <p>文件上传</p>
              <el-upload
                ref="upload"
                :limit="1"
                accept="*"
                :headers="upload.headers"
                :action="upload.imgUrl"
                :disabled="upload.isUploading"
                :before-upload="beforeAvatarUploadZIP"
                :on-success="addFileSuccess"
                :auto-upload="false"
                drag
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <div
                  class="el-upload__tip"
                  style="color:red"
                  slot="tip"
                >提示：仅允许导入"{{upload.type}}"格式文件！</div>
              </el-upload>
              <br />
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
                <el-button @click="upload.open = false">取 消</el-button>
              </div>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <editor v-model="form.remark" :min-height="192" />
            </td>
          </tr>
          <tr>
            <td>操作</td>
            <td>
              <el-button type="primary" @click="addSuspension">提交</el-button>
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
import { addPrepareLessons } from "@/api/basic/lessonPreparationHome";
export default {
  data() {
    return {
      form: {},
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传考试成绩地址
        fileUrl:
          process.env.VUE_APP_BASE_API +
          "/basic/examinationPaper/importClassGradeData",
        // 上传图片地址
        imgUrl: process.env.VUE_APP_BASE_API + "/file/upload"
      },
      paramsList: null,
      dialogVisible: false,
      dialogImageUrl: ""
    };
  },
  created() {
    if (this.$route.query.list) {
      this.paramsList = JSON.parse(this.$route.query.list);
    }
  },
  mounted() {
    console.log(this.paramsList);
  },
  methods: {
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
