
<template>
  <div
    style="width : 100%;height : 100%;padding : 40px; box-sizing : border-box;text-align : center"
  >
    <div>
      <table style="width : 100%;" border="1" cellspacing="0">
        <thead>
          <tr>
            <th>课程</th>
            <th>第一课</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>课程安排</td>
            <td>第1课时 词汇讲解</td>
          </tr>
          <tr>
            <td>课程教学参考</td>
            <td>
              教学目标
              本课活动参考 教学设计（建议4-7课时完成教学任务）
            </td>
          </tr>
          <tr>
            <td>教参内容</td>
            <td style="text-align : left">
              <p>第1课时 词汇讲解</p>
              <p>一．开场白（2分钟）</p>
              <p>与学生寒暄，带动气氛。</p>
              <p>二．内容讲解（32分钟）</p>
              <p>教师带读单词，教师读一遍，学生读三遍。</p>
            </td>
          </tr>
          <tr>
            <td>备课</td>
            <td style="text-align : left">
              <p>图片上传</p>
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
              <p>文件上传</p>
              <el-upload
                class="upload-demo"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
               <editor v-model="form.name" :min-height="192" />
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
import { addXiuxue, updateXiuxue } from "@/api/basic/xiuxue.js";
import { secretKey } from "@/utils/tools";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
export default {
  data() {
    return {
      form : {},
      radio: "1",
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
      dialogImageUrl: null,
      getInfo: null,
      lsid: null,
      lsName: null,
      xXform: {
        id: ""
      },
      ifELE: true
    };
  },
  created() {
    if (this.$route.query.query) {
      this.ifELE = true;
      this.getInfo = JSON.parse(this.$route.query.query);
    } else {
      this.ifELE = false;
      this.getInfo = JSON.parse(this.$route.query.row);
      this.getImg();
    }
    this.lsid = this.$store.state.user.glrid;
    this.lsName = this.$store.state.user.nickName;
  },
  methods: {
    // 获取图片
    getImg() {
      selectFileList({ kzzd1: this.getInfo.id }).then(res => {
        this["files1"] = res.rows;
      });
    },
    // 休学图片预览
    handlePictureCardPreviewEdit(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //休学图片删除
    handleRemoveEdit(file) {
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
    // 休学成功回调
    xxSuccessEdit(response, file) {
      if (response.code == 500) {
        this.msgError("错误 : 上传失败");
        return;
      }
      let data = response.data;
      data.kzzd1 = this.getInfo.id || secretKey();
      this.getInfo.id = data.kzzd1;
      addImg(data).then(res => {
        file.id = res.data.id;
      });
    },
    editupdateXiuxue() {
      this.getImg();
      if (!this.getInfo.sj) {
        this.msgError("错误 : 请选择休学时间");
        return;
      }
      if (!this.getInfo.xxyy) {
        this.msgError("错误 : 请填写休学原因");
        return;
      }
      if (this.files1.length == 0) {
        this.msgError("错误 : 请上传休学申请资料");
        return;
      }
      this.getInfo.shzt = 1;
      updateXiuxue(this.getInfo).then(res => {
        if (res.code == 200) {
          this.msgSuccess("成功 : 修改成功");
          this.$router.go(-1);
        }
      });
    },
    // 休学图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //休学图片删除
    handleRemove(file) {
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
    // 休学成功回调
    xxSuccess(response, file) {
      if (response.code == 500) {
        this.msgError("错误 : 上传失败");
        return;
      }
      let data = response.data;
      data.kzzd1 = this.xXform.id || secretKey();
      this.xXform.id = data.kzzd1;
      addImg(data).then(res => {
        file.id = res.data.id;
      });
    },
    addSuspension() {
      if (!this.xXform.sj) {
        this.msgError("错误 : 请选择休学时间");
        return;
      }
      if (!this.xXform.xxyy) {
        this.msgError("错误 : 请填写休学原因");
        return;
      }
      if (!this.xXform.id) {
        this.msgError("错误 : 请上传休学申请资料");
        return;
      }
      let jsonList = {
        id: this.xXform.id || secretKey(),
        lsid: this.lsid,
        remark: this.xXform.remark,
        rybjid: this.getInfo.ryb,
        xsbh: this.getInfo.xsbh,
        sj: this.xXform.sj,
        xxyy: this.xXform.xxyy
      };
      addXiuxue(jsonList).then(res => {
        if (res.code == 200) {
          this.msgSuccess("成功 : 操作成功");
          this.$router.go(-1);
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
