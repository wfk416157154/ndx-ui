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
        <el-select v-model="queryParams.xqmc" filterable placeholder="请选择校区名称">
          <el-option
            v-for="item in selectXqmc"
            :key="item.id"
            :label="item.xxmc"
            :value="item.xxmc"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日语班级" prop="rybj">
        <el-select v-model="queryParams.rybj" filterable placeholder="请选择日语班级">
          <el-option
            v-for="item in bjclassList "
            :key="item.id"
            :label="item.rybjmc"
            :value="item.rybjmc"
          ></el-option>
        </el-select>
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
          v-hasPermi="['basic:teacher:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
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
      >删除</el-button>-->
      <!-- </el-col> -->
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
      <ul v-if="teacherList.length != 0">
        <li v-for="(item,index) in teacherList" :key="index">
          <div class="wrap-img">
            <img :src="item.lstx" alt />
          </div>
          <div class="wrap-content">
            <div class="wrap-content-item">
              <div class="content-list">
                <h4>校区名称 :</h4>
                <el-tooltip class="item" effect="dark" :content="item.xqmc" placement="top-start">
                  <span>{{item.xqmc}}</span>
                </el-tooltip>
              </div>
              <div class="content-list">
                <h4>入职工龄 :</h4>
                <el-tooltip class="item" effect="dark" :content="item.rzgl" placement="top-start">
                  <span>{{item.rzgl}}</span>
                </el-tooltip>
              </div>
              <div class="content-list">
                <h4>紧急联系人电话 :</h4>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.jjlxrdh"
                  placement="top-start"
                >
                  <span>{{item.jjlxrdh}}</span>
                </el-tooltip>
              </div>
              <div class="content-list">
                <h4>日语班级 :</h4>
                <el-tooltip class="item" effect="dark" :content="item.rybj" placement="top-start">
                  <span>{{item.rybj}}</span>
                </el-tooltip>
              </div>
              <div class="content-list">
                <h4>身份证号 :</h4>
                <el-tooltip class="item" effect="dark" :content="item.sfzh" placement="top-start">
                  <span>{{item.sfzh}}</span>
                </el-tooltip>
              </div>
              <div class="content-list">
                <h4>毕业学校 :</h4>
                <el-tooltip class="item" effect="dark" :content="item.byxx" placement="top-start">
                  <span>{{item.byxx}}</span>
                </el-tooltip>
              </div>
              <div class="content-list">
                <h4>老师姓名 :</h4>
                <el-tooltip class="item" effect="dark" :content="item.lsxm" placement="top-start">
                  <span>{{item.lsxm}}</span>
                </el-tooltip>
              </div>
              <div class="content-list">
                <h4>电话号码 :</h4>
                <el-tooltip class="item" effect="dark" :content="item.dhhm" placement="top-start">
                  <span>{{item.dhhm}}</span>
                </el-tooltip>
              </div>
              <div class="content-list">
                <h4>毕业专业 :</h4>
                <el-tooltip class="item" effect="dark" :content="item.byzy" placement="top-start">
                  <span>{{item.byzy}}</span>
                </el-tooltip>
              </div>
              <div class="content-list">
                <h4>性别 :</h4>
                <span v-if="item.xb == '0'">女</span>
                <span v-else>男</span>
              </div>
              <div class="content-list">
                <h4>家庭地址 :</h4>
                <el-tooltip class="item" effect="dark" :content="item.jtzz" placement="top-start">
                  <span>{{item.jtzz}}</span>
                </el-tooltip>
              </div>
              <div class="content-list">
                <h4>是否有教师资格证 :</h4>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.sfyjszgz"
                  placement="top-start"
                >
                  <span v-if="item.sfyjszgz == 'Y'">是</span>
                  <span v-else>否</span>
                </el-tooltip>
              </div>
              <div class="content-list">
                <h4>入职时间 :</h4>
                <el-tooltip class="item" effect="dark" :content="item.rzsj" placement="top-start">
                  <span>{{item.rzsj}}</span>
                </el-tooltip>
              </div>
              <div class="content-list">
                <h4>现住址 :</h4>
                <el-tooltip class="item" effect="dark" :content="item.xzz" placement="top-start">
                  <span>{{item.xzz}}</span>
                </el-tooltip>
              </div>
              <div class="content-list">
                <h4>备注 :</h4>
                <el-tooltip class="item" effect="dark" :content="item.remark" placement="top-start">
                  <span>{{item.remark}}</span>
                </el-tooltip>
              </div>
              <div class="content-list">
                <h4>紧急联系人 :</h4>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.jjlxrdh"
                  placement="top-start"
                >
                  <span>{{item.jjlxrdh}}</span>
                </el-tooltip>
              </div>
            </div>
            <div class="wrap-link">
              <div class="__el-button1" @click="handleUpdate(item.id)">修改</div>
              <div class="__el-button2" @click="handleDelete(item)">删除</div>
              <div class="__el-button3" @click="teacherDetails(item.id)">更多</div>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="no-item">暂无数据</div>
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
import { listBjclass } from "@/api/basic/bjclass";
import { listSchool } from "@/api/basic/school";
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
       form : {
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
      },
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
        url: process.env.VUE_APP_BASE_API + "/basic/teacher/importData"
      },
      imageUrl: "",
      //校区名称
      selectXqmc: [],
      // 班级选择
      bjclassList: []
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
    listSchool().then(response => {
      this.selectXqmc = response.rows;
    });
    listBjclass().then(response => {
      this.bjclassList = response.rows;
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
      this.title = "添加老师信息";
      // 获取页面中参数配置的路由
      this.getConfigKey("addTeacher").then(resp=>{
        this.router=resp.msg;
        this.$router.push({
          path: this.router
        });
      })
    },
    /** 修改按钮操作 */
    handleUpdate(id) {
      this.$router.push({
        path: "/teacherForm/" + id
      });
    },
    // 老师详细信息
    teacherDetails(id) {
      this.$router.push({
        path: "/teacherInformation/" + id
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
        })
        .catch(e => {
          console.log(e);
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
      this.upload.title = "老师导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "basic/teacher/importTemplate",
        {
          ...this.queryParams
        },
        `老师信息导入模板_${new Date().getTime()}.xlsx`
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
    padding: 30px 30px;
    box-sizing: border-box;

    font-family: Sans-serif !important;
    li {
      list-style: none;
      width: 96%;
      // height: 100%;
      border: 1px #ccc solid;
      padding: 10px;
      box-sizing: border-box;
      position: relative;
      margin-bottom: 20px;
      border-radius: 20px;
      .wrap-img {
        width: 10%;
        height: 200px;
        display: inline-block;
        position: relative;
        margin-left: 20px;
        img {
          width: 90%;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 15px;
        }
      }
      .wrap-content {
        width: 86%;
        display: inline-block;
        padding: 20px;
        box-sizing: border-box;
        background-color: #eee;
        border-radius: 10px;
        height: 85%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        .wrap-content-item {
          width: 85%;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          .content-list {
            float: left;
            margin-right: 10px;
            height: 30px;
            width: 210px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            h4 {
              display: inline;
              font-weight: 300;
            }
          }
        }
        .wrap-link {
          width: 100px;
          position: absolute;
          top: 20px;
          right: 0;
          .__el-button1 {
            width: 70px;
            background-color: #3cb371;
            color: #fff;
            margin: 5px 5px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
            border-radius: 5px;
          }
          .__el-button2 {
            width: 70px;
            background-color: #ff7f50;
            color: #fff;
            margin: 5px 5px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
            border-radius: 5px;
          }
          .__el-button3 {
            width: 70px;
            background-color: #1e90ff;
            color: #fff;
            margin: 5px 5px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
            border-radius: 5px;
          }
        }
      }
    }
  }
  .no-item {
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #ccc;
  }
}
</style>
