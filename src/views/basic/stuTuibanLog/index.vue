<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联id" prop="glid">
        <el-input
          v-model="queryParams.glid"
          placeholder="请输入关联id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="shzt">
        <el-select v-model="queryParams.shzt" placeholder="请选择审核状态" clearable size="small">
          <el-option
            v-for="dict in shztOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="退还金额" prop="thje">
        <el-input
          v-model="queryParams.thje"
          placeholder="请输入退还金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="录入或修改人ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入录入或修改人ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字段1" prop="kzzd1">
        <el-input
          v-model="queryParams.kzzd1"
          placeholder="请输入扩展字段1"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字段2" prop="kzzd2">
        <el-input
          v-model="queryParams.kzzd2"
          placeholder="请输入扩展字段2"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字段3" prop="kzzd3">
        <el-input
          v-model="queryParams.kzzd3"
          placeholder="请输入扩展字段3"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字段4" prop="kzzd4">
        <el-input
          v-model="queryParams.kzzd4"
          placeholder="请输入扩展字段4"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字段5" prop="kzzd5">
        <el-input
          v-model="queryParams.kzzd5"
          placeholder="请输入扩展字段5"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['basic:stuTuibanLog:add']"
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
          v-hasPermi="['basic:stuTuibanLog:edit']"
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
          v-hasPermi="['basic:stuTuibanLog:remove']"
        >删除</el-button>
      </el-col>
    <el-col :span="1.5">
        <el-button
                type="info"
                icon="el-icon-upload2"
                size="mini"
                @click="handleImport"
        >导入</el-button>
    </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['basic:stuTuibanLog:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :height="$root.tableHeight" border :data="stuTuibanLogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="关联id" align="center" prop="glid" />
      <el-table-column label="审核状态" align="center" prop="shzt" >
          <template slot-scope="scope">
              <dict-tag :options="shztOptions" :value="scope.row.shzt"/>
          </template>
      </el-table-column>
      <el-table-column label="异议" align="center" prop="objection" />
      <el-table-column label="退还金额" align="center" prop="thje" />
      <el-table-column label="退还规则" align="center" prop="thgz" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="录入或修改人ID" align="center" prop="userId" />
      <el-table-column label="扩展字段1" align="center" prop="kzzd1" />
      <el-table-column label="扩展字段2" align="center" prop="kzzd2" />
      <el-table-column label="扩展字段3" align="center" prop="kzzd3" />
      <el-table-column label="扩展字段4" align="center" prop="kzzd4" />
      <el-table-column label="扩展字段5" align="center" prop="kzzd5" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:stuTuibanLog:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:stuTuibanLog:remove']"
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

    <!-- 添加或修改学生退班-流程记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联id" prop="glid">
          <el-input v-model="form.glid" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="审核状态" prop="shzt">
          <el-select v-model="form.shzt" placeholder="请选择审核状态">
            <el-option
              v-for="dict in shztOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="异议" prop="objection">
          <el-input v-model="form.objection" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="退还金额" prop="thje">
          <el-input v-model="form.thje" placeholder="请输入退还金额" />
        </el-form-item>
        <el-form-item label="退还规则" prop="thgz">
          <el-input v-model="form.thgz" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="录入或修改人ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入录入或修改人ID" />
        </el-form-item>
        <el-form-item label="扩展字段1" prop="kzzd1">
          <el-input v-model="form.kzzd1" placeholder="请输入扩展字段1" />
        </el-form-item>
        <el-form-item label="扩展字段2" prop="kzzd2">
          <el-input v-model="form.kzzd2" placeholder="请输入扩展字段2" />
        </el-form-item>
        <el-form-item label="扩展字段3" prop="kzzd3">
          <el-input v-model="form.kzzd3" placeholder="请输入扩展字段3" />
        </el-form-item>
        <el-form-item label="扩展字段4" prop="kzzd4">
          <el-input v-model="form.kzzd4" placeholder="请输入扩展字段4" />
        </el-form-item>
        <el-form-item label="扩展字段5" prop="kzzd5">
          <el-input v-model="form.kzzd5" placeholder="请输入扩展字段5" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
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
                  v-loading="fullscreenLoading"
                  element-loading-text="正在进行数据导入·······"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
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
              <el-button type="primary" v-prevent-re-click :disabled="importBtn" @click="submitFileForm">确 定</el-button>
              <el-button @click="upload.open = false">取 消</el-button>
          </div>
      </el-dialog>

  </div>


</template>

<script>
import { listStuTuibanLog, getStuTuibanLog, delStuTuibanLog, addStuTuibanLog, updateStuTuibanLog } from "@/api/basic/stuTuibanLog";
import { getToken } from "@/utils/auth";

export default {
  name: "StuTuibanLog",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      importBtn:false,
      fullscreenLoading:false,
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
      // 学生退班-流程记录表格数据
      stuTuibanLogList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 审核状态字典
      shztOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        glid: null,
        shzt: null,
        objection: null,
        thje: null,
        thgz: null,
        userId: null,
        kzzd1: null,
        kzzd2: null,
        kzzd3: null,
        kzzd4: null,
        kzzd5: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 导入参数
      upload: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "导入学生退班-流程记录数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/basic/stuTuibanLog/importData"
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("tuiban_status").then(response => {
      this.shztOptions = response.data;
    });
  },
  methods: {
    /** 查询学生退班-流程记录列表 */
    getList() {
      this.loading = true;
      listStuTuibanLog(this.queryParams).then(response => {
        this.stuTuibanLogList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        glid: null,
        shzt: null,
        objection: null,
        thje: null,
        thgz: null,
        remark: null,
        userId: null,
        createTime: null,
        updateTime: null,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加学生退班-流程记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStuTuibanLog(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生退班-流程记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStuTuibanLog(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStuTuibanLog(this.form).then(response => {
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
      this.$confirm('是否确认删除选中的数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delStuTuibanLog(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e)=>{
          console.log(e);
      })

    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basic/stuTuibanLog/export', {
        ...this.queryParams
      }, `学生退班-流程记录-${new Date().getTime()}.xlsx`)
    },

      /** 导入按钮操作 */
      handleImport() {
          this.importBtn=false
          this.upload.title = "学生退班-流程记录数据导入";
          this.upload.open = true;
          this.$nextTick(() => {// 页面元素加载完成后执行该方法
              this.$refs.upload.clearFiles();
          });
      },
      /** 下载模板操作 */
      importTemplate() {
          this.download('basic/stuTuibanLog/importTemplate', {
              ...this.queryParams
          }, `学生退班-流程记录-导入模板-${new Date().getTime()}.xlsx`)
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
          this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
          this.fullscreenLoading = false;
          this.upload.open = false;
          this.upload.isUploading = false;
          this.$refs.upload.clearFiles();
          this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
          this.getList();
      },
      // 提交上传文件
      submitFileForm() {
        this.importBtn=true
        this.fullscreenLoading = true;
        this.$refs.upload.submit();
      }


  }
};
</script>
