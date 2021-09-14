<template>
  <div
    style="width : 100%;height : 100%;padding : 40px; box-sizing : border-box;text-align : center"
  >
    <h3>免责申请</h3>
    <div>
      <table style="width : 100%;" border="1" cellspacing="0">
        <thead>
          <tr>
            <th>班级</th>
            <th>汉川二中20级22届</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>老师</td>
            <td>张三</td>
          </tr>
          <tr>
            <td>入班时间</td>
            <td>2021-1-18</td>
          </tr>
          <tr>
            <td>原因</td>
            <td class="clearfix">
              <div>
                <el-input type="textarea" :rows="4" placeholder="请输入休学原因" v-model="textarea"></el-input>
              </div>
            </td>
          </tr>
          <tr>
            <td>免责资料</td>
            <td>
              <div style="width : 180px;height : 180px; margin-top : 30px">
                <el-upload
                  :action="upload.imgUrl"
                  :headers="upload.headers"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :on-success="jswsSuccess"
                  :file-list="files1"
                  :disabled="ifRoleHasPerms"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
              </div>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <el-input type="textarea" :rows="4" placeholder="请输入银行卡号" v-model="textarea"></el-input>
            </td>
          </tr>
          <tr>
            <td>操作</td>
            <td>
              <el-button type="primary">提交申请</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
    
<script>
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      radio: "1",
      textarea: "",
      value1: "",
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
      dialogVisible: false,
      files1: null,
      dialogImageUrl: null
    };
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
    // 教室卫生图片上传成功回调
    jswsSuccess(response, file, fileList) {
      if (response.code == 500) {
        this.$notify({
          message: "上传失败",
          type: "error"
        });
        return;
      }
      let data = response.data;
      data.kzzd1 = this.ruleForm.jswsFile || secretKey();
      this.ruleForm.jswsFile = data.kzzd1;
      this.photoNum1 = fileList.length;
      addImg(data).then(res => {
        file.id = res.data.id;
        this.ifPhotoLimit(this.photoNum1);
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