<template>
  <div class="firstTryForm">
    <div class="firstTry-add">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="dialogVisible = true"
        >新增</el-button
      >
    </div>
    <el-dialog
      :close-on-click-modal="false"
      title="增加面试老师"
      @close="cancel"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.xm"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.xb" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input maxlength="11" v-model="form.dhhm"></el-input>
        </el-form-item>
        <el-form-item label="家庭住址">
          <el-input v-model="form.jtzz"></el-input>
        </el-form-item>
        <el-form-item label="期望地区">
          <el-input v-model="form.yxdq"></el-input>
        </el-form-item>
        <el-form-item label="文件" prop="wjid">
          <el-upload
            ref="upload"
            :limit="maxFileNum"
            accept=".*"
            :headers="upload.headers"
            :action="upload.url"
            :disabled="upload.isUploading"
            :on-remove="handleRemove"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :before-upload="beforeFile"
            :data="fileForm"
            :auto-upload="true"
            :file-list="wjidFile"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" style="color: red" slot="tip">
              提示：仅允许上传50M以下文件！
            </div>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="初试结果">
          <el-select v-model="form.mszt" clearable placeholder="请选择">
            <el-option
              v-for="item in resultList"
              :key="item.value"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label-width="90px" label="录入人账号">
          <el-input disabled v-model="form.lrrid"></el-input>
        </el-form-item>
        <el-form-item label-width="90px" label="备注">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { teacherPersonnel, editTeacherPersonnel } from "@/api/basic/firstTry";
import { getToken } from "@/utils/auth";
import { addImg, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
export default {
  data() {
    return {
      fileForm: {
        renameFileName: "",
      },
      dialogVisible: false,
      form: {
        xm: "",
        dhhm: null,
        lrrid: this.$store.state.user.name,
        xb: "",
        yxdq: "",
        jtzz: "",
        remark: null,
      },
      // 初试结果
      resultList: [],
      // 上传参数
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "上传文件",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/file/renameUpload",
      },
      // 文件id数组
      wjidFile: [],
      // 最多上传的文件数量
      maxFileNum: 3,
    };
  },
  created() {
    this.getDicts("preliminary_test_results").then((response) => {
      this.resultList = response.data;
    });
  },
  methods: {
    //修改上传
    beforeFile(file) {
      this.fileForm.renameFileName = "教师招聘—" + file.name;
    },
    // 提交按钮
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        this.dialogVisible = false;
        if (valid) {
          if (this.form.id != null) {
            editTeacherPersonnel(this.form).then((res) => {
              this.$notify({
                title: "成功",
                message: res.msg,
                type: "success",
              });
              this.cancel();
            });
          } else {
            teacherPersonnel(this.form).then((res) => {
              this.$notify({
                title: "成功",
                message: res.msg,
                type: "success",
              });
              this.cancel();
            });
          }
        }
      });
    },
    // 编辑数据渲染
    editFirstTryForm(value) {
      this.dialogVisible = true;
      this.form = value;
      this.wjidFile = this.ifNullToNewArray(value.jlArr);
    },
    ifNullToNewArray(arr) {
      if (null == arr) {
        return [];
      }
      return arr;
    },
    // 数据初始化
    cancel() {
      this.$emit("getList");
      this.form = {
        xm: "",
        dhhm: null,
        lrrid: this.$store.state.user.name,
        xb: "",
        yxdq: "",
        jtzz: "",
        id: null,
      };
    },
    //公共图片删除
    handleRemove(file, fileList) {
      deleteImg(file.id).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "删除成功",
            type: "success",
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
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.ifFileLimit(fileList.length, " 个文件");
      this.upload.open = false;
      this.upload.isUploading = false;
      let data = response.data;
      data.kzzd1 = this.form.kzzd1 || secretKey();
      this.form.kzzd1 = data.kzzd1;
      addImg(data).then((res) => {
        file.id = res.data.id;
        this.msgSuccess("文件上传成功");
        this.wjidFile = fileList;
      });
      this.$refs.upload.clearFiles();
    },
    // 图片限制判断
    ifFileLimit(num, msg) {
      if (num >= this.maxFileNum) {
        this.$message({
          message: "最多上传 " + this.maxFileNum + msg,
          type: "warning",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.firstTryForm {
  width: 100%;
  height: 100%;
}
</style>
