<template>
  <div class="wrap-pybc">
    <table border="1" style="width : 100%" cellspacing="0">
      <tbody>
        <tr>
          <td class="td-left-box">班级</td>
          <td>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">老师</td>
          <td style="text-align : center">吴珂</td>
        </tr>
        <tr>
          <td class="td-left-box">作业类型</td>
          <td>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">作业主题</td>
          <td>
            <el-input v-model="input" placeholder="请输入内容"></el-input>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">内容</td>
          <td>
            <editor v-model="value1" :min-height="200" />
          </td>
        </tr>
        <tr>
          <td class="td-left-box">针对学生</td>
          <td>
            <el-radio v-model="radio" label="1">备选项</el-radio>
            <el-radio v-model="radio" label="2">备选项</el-radio>
            <el-radio v-model="radio" label="3">备选项</el-radio>
            <el-radio v-model="radio" label="3">备选项</el-radio>
            <el-radio v-model="radio" label="3">备选项</el-radio>
            <el-radio v-model="radio" label="3">备选项</el-radio>
            <el-radio v-model="radio" label="3">备选项</el-radio>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">文件</td>
          <td>
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
          <td class="td-left-box">备注</td>
          <td>
            <editor v-model="value1" :min-height="200" />
          </td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top :20px;text-align: center;">
      <el-button type="primary">提交</el-button>
    </div>

    <el-dialog title="张倩" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="作业主题" label-width="120px">
          <span>xxxx主题</span>
        </el-form-item>
        <el-form-item label="作业类型" label-width="120px">
          <span>xxxx类型</span>
        </el-form-item>
        <el-form-item label="图片上传" label-width="120px">
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
          <el-dialog :visible.sync="dialogVisibleForm">
            <img width="100%" :src="dialogImageFormUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="内容" label-width="120px">
          <editor v-model="value1" :min-height="200" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { getToken } from "@/utils/auth";
import { secretKey } from "@/utils/tools";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
export default {
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      value1: "",
      input: "",
      radio: "",
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
      dialogImageUrl: "",
      dialogVisibleForm: false,
      dialogFormVisible: true,
      dialogImageFormUrl: ""
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
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap-pybc {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  th,
  td {
    padding: 20px;
  }
  .td-left-box {
    width: 20%;
    text-align: center;
  }
}
</style>
