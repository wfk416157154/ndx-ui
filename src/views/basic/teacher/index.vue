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
          placeholder="请输入校区名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日语班级" prop="rybj">
        <el-input
          v-model="queryParams.rybj"
          placeholder="请输入日语班级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="老师姓名" prop="lsxm">
        <el-input
          v-model="queryParams.lsxm"
          placeholder="请输入老师姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="xb">
        <el-select v-model="queryParams.xb" placeholder="请选择性别" clearable size="small">
          <el-option
            v-for="dict in xbOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label-width="150px" label="是否有教师资格证" prop="sfyjszgz">
        <el-select v-model="queryParams.sfyjszgz" placeholder="请选择是否有教师资格证" clearable size="small">
          <el-option
            v-for="dict in sfyjszgzOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
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
          v-hasPermi="['basic:teacher:add']"
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
          v-hasPermi="['basic:teacher:edit']"
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
          v-hasPermi="['basic:teacher:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['basic:teacher:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- <el-table v-loading="loading" :data="teacherList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="状态" align="center" prop="id" />
      <el-table-column label="老师头像" align="center" prop="lstx" />
      <el-table-column label="校区名称" align="center" prop="xqmc" />
      <el-table-column label="日语班级" align="center" prop="rybj" />
      <el-table-column label="老师姓名" align="center" prop="lsxm" />
      <el-table-column label="性别" align="center" prop="xb" :formatter="xbFormat" />
      <el-table-column label="入职时间" align="center" prop="rzsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.rzsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入职工龄" align="center" prop="rzgl" />
      <el-table-column label="身份证号" align="center" prop="sfzh" />
      <el-table-column label="电话号码" align="center" prop="dhhm" />
      <el-table-column label="家庭地址" align="center" prop="jtzz" />
      <el-table-column label="现住址" align="center" prop="xzz" />
      <el-table-column label="紧急联系人" align="center" prop="jjlxr" />
      <el-table-column label="紧急联系人电话" align="center" prop="jjlxrdh" />
      <el-table-column label="毕业学校" align="center" prop="byxx" />
      <el-table-column label="毕业专业" align="center" prop="byzy" />
      <el-table-column label="个人身份证正反扫描照" align="center" prop="grsfzsmz" />
      <el-table-column label="毕业证扫描件" align="center" prop="byzsmj" />
      <el-table-column label="学位证扫描件" align="center" prop="xwzsmj" />
      <el-table-column label="个人证件照白底蓝底" align="center" prop="grzjzbdld" />
      <el-table-column label="日语登记证书" align="center" prop="rydjzs" />
      <el-table-column label="是否有教师资格证" align="center" prop="sfyjszgz" :formatter="sfyjszgzFormat" />
      <el-table-column label="教师资格证" align="center" prop="jszgz" />
      <el-table-column label="其他证书" align="center" prop="qtzs" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:teacher:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:teacher:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>-->
    <div class="wrap-teacherList">
      <ul>
        <li v-for="(item,index) in 10" :key="index">
          <div class="wrap-img">
            <img
              src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1851283359,3457678391&fm=26&gp=0.jpg"
              alt
            />
          </div>
          <div class="wrap-content">
            <div class="content-list">
              <h4>校区名称 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>入职工龄 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>紧急联系人电话 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>日语班 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>身份证 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>毕业学校 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>老师姓名 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>电话号码 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>毕业专业 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>性别 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>家庭地址 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>是否有教师资格证 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>入职时间 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>现住址 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>备注 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <div class="content-list">
              <h4>紧急联系人 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div>
            <!-- <div class="content-list">
              <h4>状态 :</h4>
              <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
              </el-tooltip>
            </div> -->
            <router-link
              style="background-color : rgb(24,144,255)"
              to="/teacherInformation"
              class="el-button"
            >查看更多</router-link>
          </div>
        </li>
      </ul>
    </div>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 用户导入对话框 -->
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
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
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
  listTeacher,
  getTeacher,
  delTeacher,
  addTeacher,
  updateTeacher
} from "@/api/basic/teacher";
import { getToken } from "@/utils/auth";
export default {
  name: "Teacher",
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
      // 老师信息表格数据
      teacherList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 性别字典
      xbOptions: [],
      // 是否有教师资格证字典
      sfyjszgzOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xqmc: null,
        rybj: null,
        lsxm: null,
        xb: null,
        sfyjszgz: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 头像
      imageUrl: "",
      //证件照
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      //是否有教师资格证
      isCertificais: false,
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
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/basic/bjclass/importData"
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_user_sex").then(response => {
      this.xbOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.sfyjszgzOptions = response.data;
    });
    this.getDicts("basic_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询老师信息列表 */
    getList() {
      this.loading = true;
      listTeacher(this.queryParams).then(response => {
        this.teacherList = response.rows;
        this.total = response.total;
        this.loading = false;
        console.log(this.teacherList  )
      });
    },
    // 性别字典翻译
    xbFormat(row, column) {
      return this.selectDictLabel(this.xbOptions, row.xb);
    },
    // 是否有教师资格证字典翻译
    sfyjszgzFormat(row, column) {
      return this.selectDictLabel(this.sfyjszgzOptions, row.sfyjszgz);
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
        lstx: null,
        xqmc: null,
        rybj: null,
        lsxm: null,
        xb: null,
        rzsj: null,
        rzgl: null,
        sfzh: null,
        dhhm: null,
        jtzz: null,
        xzz: null,
        jjlxr: null,
        jjlxrdh: null,
        byxx: null,
        byzy: null,
        grsfzsmz: null,
        byzsmj: null,
        xwzsmj: null,
        grzjzbdld: null,
        rydjzs: null,
        sfyjszgz: null,
        jszgz: null,
        qtzs: null,
        status: "0",
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
      this.title = "添加老师信息";
      this.$router.push({
        path: "/teacherForm"
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getTeacher(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改老师信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeacher(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeacher(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除老师信息编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delTeacher(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "basic/teacher/export",
        {
          ...this.queryParams
        },
        `basic_teacher.xlsx`
      );
    },
    // 头像处理
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //证件照处理
    handleRemove(file) {
      console.log(file);
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //是否有教师资格证
    selectChange(value) {
      if (value == "Y") {
        this.isCertificais = true;
      } else {
        this.isCertificais = false;
      }
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "basic/bjclass/importTemplate",
        {
          ...this.queryParams
        },
        `导入模板_${new Date().getTime()}.xlsx`
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
      this.$notify({
        title: "成功",
        message: response.msg,
        type: "success"
      });
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
.el-col {
  float: none;
  display: inline-block;
}
.wrap-el-dialog {
  padding-right: 40px;
  box-sizing: border-box;
}
// .hide .el-upload--picture-card {
//   display: none;
// }
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.wrap-teacherList {
  width: 100%;
  ul {
    width: 100%;
    box-shadow: 2px 2px 10px 2px rgba(90, 19, 19, 0.2);
    padding: 20px 20px;
    box-sizing: border-box;
  }
  li {
    list-style: none;
    width: 100%;
    height: 260px;
    border: 1px #ccc solid;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 20px;
    border-radius: 20px;
    .wrap-img {
      width: 15%;
      height: 100%;
      margin-right: 30px;
      display: inline-block;
      position: relative;
      img {
        // width: 200px;
        height: 200px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .wrap-content {
      width: 80%;
      display: inline-block;
      padding: 10px;
      box-sizing: border-box;
      background-color: #eee;
      height: 200px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      .content-list {
        float: left;
        margin-right: 10px;
        height: 30px;
        width: 260px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        h4 {
          display: inline;
        }
      }
      .el-button {
        position: fixed;
        color: #fff;
        bottom: 10px;
        right: 20px;
      }
    }
  }
}
</style>