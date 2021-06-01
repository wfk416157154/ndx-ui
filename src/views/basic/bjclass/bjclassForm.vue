<template>
  <div class="app-container">
    <!-- 添加或修改班级基础信息对话框 -->
    <el-form class="wrap-el-form" ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label-width="100px" label="开班照" prop="kbz">
        <el-upload
          :action="upload.fileUrl"
          :headers="upload.headers"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :limit="maxPhotoNum"
          :file-list="files1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label-width="100px" label="集体照" prop="jtz">
        <el-upload
          :action="upload.fileUrl"
          :headers="upload.headers"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="jtzSuccess"
          :limit="maxPhotoNum"
          :file-list="files2"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-col :span="12">
        <el-form-item label-width="100px" label="校区名称" prop="xqmc">
          <!-- <el-input maxlength="50" v-model="form.xqmc" placeholder="请输入校区名称" /> -->
          <el-select v-model="form.xqmc" placeholder="请选择校区名称">
            <el-option
              v-for="item in selectXqmc"
              :key="item.id"
              :label="item.xxmc"
              :value="item.xxmc"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="100px" label="年级" prop="nj">
          <!-- <el-input maxlength="30" v-model="form.nj" placeholder="请输入年级" /> -->
          <el-select v-model="form.nj" placeholder="请输入年级">
            <el-option
              v-for="item in selectNj"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="100px" label="日语班级名称" prop="rybjmc">
          <el-input maxlength="30" v-model="form.rybjmc" placeholder="请输入日语班级名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="100px" label="班级人数" prop="bjrs">
          <el-input maxlength="5" v-model="form.bjrs" placeholder="请输入班级人数" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="100px" label="老师姓名" prop="lsxm">
          <el-input maxlength="4" v-model="form.lsxm" placeholder="请输入老师姓名" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="100px" label="开班时间" prop="kbsj">
          <!-- <el-input v-model="form.kbsj" placeholder="请输入开班时间" /> -->
          <el-date-picker
            clearable
            size="mini"
            v-model="form.kbsj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请输入开班时间"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="100px" label="老师电话" prop="lsdh">
          <el-input maxlength="11" v-model="form.lsdh" placeholder="请输入老师电话" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="100px" label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              disabled
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-form-item label-width="100px" label="备注" prop="remark">
        <el-input maxlength="300" v-model="form.remark" type="textarea" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {
  listBjclass,
  getBjclass,
  delBjclass,
  addBjclass,
  updateBjclass,
  importTemplate
} from "@/api/basic/bjclass";
import { listSchool } from "@/api/basic/school";
import { getToken } from "@/utils/auth";
import { addImg, selectFileList, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
export default {
  name: "Bjclass",
  components: {},
  inject:['reload'],
  data() {
    return {

      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 班级基础信息表格数据
      bjclassList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态字典
      statusOptions: [],
      //校区名称
      selectXqmc: [],
      //年级字典
      selectNj: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xqmc: null,
        nj: null,
        rybjmc: null,
        lsxm: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 用户导入参数
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/basic/bjclass/importData"
      },
      // 图片地址
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/basic/bjclass/importData",
        // 上传图片地址
        fileUrl: process.env.VUE_APP_BASE_API + "/file/upload"
      },
      files1: [],
      files2: [],
      // 图片上传计数
      photoNum1: 0,
      photoNum2: 0,
      // 最大上传次数
      maxPhotoNum: 3,
      rules: {
        bjrs: [
          {
            required: false,
            message: "格式不对,只能填写数字",
            trigger: "blur",
            pattern: /^[0-9]+$/
          }
        ],
        lsdh: [
          {
            required: false,
            message: "格式不对,只能填写数字",
            trigger: "blur",
            pattern: /^[0-9]+$/
          }
        ]
      }
    };
  },
  created() {
    this.getDicts("basic_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("nianji").then(response => {
      this.selectNj = response.data;
    });
    // 获取校区
    listSchool().then(response => {
      this.selectXqmc = response.rows;
    });
  },
  mounted() {
    this.id = this.$route.params.id;
    if (this.id != "addBjclass") {
      this.handleUpdate(this.id);
    } else {
      this.reset();
    }
  },
  methods: {
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$router.go(-1);
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        kbz: null,
        jtz: null,
        xqmc: null,
        nj: null,
        rybjmc: null,
        bjrs: null,
        lsxm: null,
        kbsj: null,
        lsdh: null,
        status: "1",
        remark: null,
        userId: null,
        uName: null,
        orgBh: null,
        orgName: null,
        dataOrder: null,
        addOrUpdateTime: null,
        kzzd1: null,
        kzzd2: null,
        kzzd3: null,
        kzzd4: null,
        kzzd5: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加班级基础信息";
    },
    /** 修改按钮操作 */
    handleUpdate(id) {
      this.reset();
      // const id = row.id || this.ids;
      getBjclass(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改班级基础信息";
        this.selectPhotoList(
          (this.form.kbz = this.form.kbz || secretKey()),
          "files1"
        ); // 开班照
        this.selectPhotoList(
          (this.form.jtz = this.form.jtz || secretKey()),
          "files2"
        ); // 集体照
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBjclass(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.$router.push({
                path: "/jcsjb/basic/bjclass"
              });
              this.reload();
            });
          } else {
            addBjclass(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.$router.push({
                path: "/jcsjb/basic/bjclass"
              });
              this.reload();
            });
          }
        }
      });
    },
    // 查询证件照
    selectPhotoList(glid, file) {
      let kzzdJson = {
        kzzd1: glid
      };
      selectFileList(kzzdJson).then(res => {
        this.photoNum = res.total;
        this[file] = res.rows;
      });
    },
    //公共图片删除
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 开班照上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.kbz || secretKey();
      this.form.kbz = data.kzzd1;
      this.photoNum1 = fileList.length;
      addImg(data).then(res => {
        file.id=res.data.id;
        this.ifPhotoLimit(this.photoNum1);
      });
    },
    // 集体照上传成功的回调
    jtzSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.jtz || secretKey();
      this.form.jtz = data.kzzd1;
      this.photoNum1 = fileList.length;
      addImg(data).then(res => {
        file.id=res.data.id;
        this.ifPhotoLimit(this.photoNum2);
      });
    },
    // 图片限制判断
    ifPhotoLimit(num) {
      if (num >= this.maxPhotoNum) {
        this.$message({
          message: "最多上传 3 张图片",
          type: "warning"
        });
      } else {
        this.$message({
          message: "新增成功",
          type: "success"
        });
      }
    },
    // 保存校区id
    getschoolId(value) {
      this.form.xqmc = value.xxmc;
      this.form.kzzd1 = value.id;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap-el-form {
  padding-right: 30px;
  box-sizing: border-box;
}
.el-col {
  float: none;
  display: inline-block;
}
.dialog-footer {
  float: right;
}
</style>
