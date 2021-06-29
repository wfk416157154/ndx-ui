<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="校区名称" prop="xqmc">
        <el-input
          v-model="queryParams.xqmc"
          placeholder="可模糊查询校区名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="年级" prop="nj">
        <el-select v-model="queryParams.nj" placeholder="请选择年级">
          <el-option
            v-for="item in selectNj"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictLabel"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="120px" label="日语班级名称" prop="rybjmc">
        <el-input
          v-model="queryParams.rybjmc"
          placeholder="可模糊查询日语班级名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="老师姓名" prop="lsxm">
        <el-input
          v-model="queryParams.lsxm"
          placeholder="可模糊查询老师姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basic:bjclass:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basic:bjclass:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basic:bjclass:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['basic:bjclass:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload" :disabled="single" size="mini"  @click="onUploadPhoto">查看照片</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border v-loading="loading" :data="bjclassList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column v-if="false" label="状态" align="center" prop="id" />
      <el-table-column v-if="false" label="开班照" align="center" prop="kbz" />
      <el-table-column v-if="false" label="集体照" align="center" prop="jtz" />
      <el-table-column label="校区名称" align="center" prop="xqmc" />
      <el-table-column label="年级" align="center" prop="nj" />
      <el-table-column label="日语班级名称" align="center" prop="rybjmc" />
      <el-table-column label="班级人数" align="center" prop="bjrs" />
      <el-table-column label="老师姓名" align="center" prop="lsxm" />
      <el-table-column label="开班时间" align="center" prop="kbsj" />
      <el-table-column label="老师电话" align="center" prop="lsdh" />
      <el-table-column
        v-if="false"
        label="状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
      />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:bjclass:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:bjclass:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改班级基础信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="校区名称" prop="xqmc">
          <el-select v-model="form.xqmc" placeholder="请选择校区名称" @change="setXqmcId">
            <el-option
              v-for="item in selectXqmc"
              :key="item.id"
              :label="item.xxmc"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="nj">
          <el-select v-model="form.nj" placeholder="请输入年级">
            <el-option
              v-for="item in selectNj"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="110px" label="日语班级名称"  prop="rybjmc">
          <el-input v-model="form.rybjmc" maxlength="30" placeholder="请输入日语班级名称" />
        </el-form-item>
        <el-form-item label="班级人数" prop="bjrs">
          <el-input v-model="form.bjrs" maxlength="5" placeholder="请输入班级人数" />
        </el-form-item>
        <el-form-item label="开班时间" prop="kbsj">
          <el-date-picker
          clearable
          size="mini"
          v-model="form.kbsj"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请输入开班时间"
        ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input maxlength="300" v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 上传班级的开班照和集体照对话框 -->
    <el-dialog :title="title" :visible.sync="imageOpen" width="800px" append-to-body>
      <!-- 添加或修改班级基础信息对话框 -->
      <el-form class="wrap-el-form" ref="photoForm" :model="form" label-width="80px">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitPhotoForm">保存</el-button>
        <el-button @click="cancelPhoto">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
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
      imageOpen:false,
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
      rules: {
        xqmc: [
          { required: true, message: "请选择一个校区名称", trigger: "blur" }
        ],
        nj: [
          { required: true, message: "请选择年级", trigger: "blur" }
        ],
        rybjmc: [
          { required: true, message: "请输入日语班级名称", trigger: "blur" }
        ],
        kbsj: [
          { required: true, message: "请选择开班时间", trigger: "blur" }
        ],
      },
      // 用户导入参数
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
      // 图片地址
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      files1: [],
      files2: [],
      // 图片上传计数
      photoNum1: 0,
      photoNum2: 0,
      // 最大上传次数
      maxPhotoNum: 3,
    };
  },
  created() {
    this.getList();
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
  methods: {
    /** 查询班级基础信息列表 */
    getList() {
      this.loading = true;
      listBjclass(this.queryParams).then(response => {
        this.bjclassList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    setXqmcId(obj){
      this.form.xqmc=obj.xxmc;
      this.form.kzzd1=obj.id;
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
      /*this.$router.push({
        path: "/bjclassForm/" + "addBjclass"
      });*/
      this.reset();
      this.open = true;
      this.title = "添加班级基础信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log("row:",row.id)
      this.reset();
      const id = row.id || this.ids;
      /*this.$router.push({
         path: "/bjclassForm/" + id
      });*/
      /*this.$router.push({
        path: "/jcsjb/basic/banji/educationalForm/" + id
      });*/
      getBjclass(id).then(response => {
         this.form = response.data;
         this.open = true;
         this.title = "修改班级基础信息";
      });
    },
    onUploadPhoto(row){
      const id = row.id || this.ids;
      getBjclass(id).then(response => {
        this.form = response.data;
        this.imageOpen = true;
        this.title = "查看班级的图片信息";
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
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBjclass(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBjclass(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    submitPhotoForm(){
      this.$refs["photoForm"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBjclass(this.form).then(response => {
              this.msgSuccess("保存成功");
              this.imageOpen = false;
            });
          }
        }
      });
    },
    cancelPhoto(){
      this.imageOpen = false;
      this.reset();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除班级基础信息编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delBjclass(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e)=>{
        console.log(e);
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "basic/bjclass/export",
        {
          ...this.queryParams
        },
        `班级基本信息.xlsx`
      );
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "班级基本信息导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "basic/bjclass/importTemplate",
        {
          ...this.queryParams
        },
        `班级基本信息导入模板_${new Date().getTime()}.xlsx`
      );
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
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
</style>
