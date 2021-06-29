<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="申请人" prop="sqr">
        <el-input
          v-model="queryParams.sqr"
          placeholder="请输入申请人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="请假类型" prop="qjlx">
        <el-select v-model="queryParams.qjlx" placeholder="请选择请假类型" clearable size="small">
          <el-option
            v-for="dict in qjlxOptions"
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
          v-hasPermi="['basic:attendance:add']"
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
          v-hasPermi="['basic:attendance:edit']"
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
          v-hasPermi="['basic:attendance:remove']"
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
          v-hasPermi="['basic:attendance:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table  border v-loading="loading" :data="attendanceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="申请人" align="center" prop="sqr" />
      <el-table-column label="请假类型" align="center" prop="qjlx" :formatter="qjlxFormat" />
      <el-table-column label="请假理由" align="center" prop="qjly" />
      <el-table-column label="开始时间" align="center" prop="kssj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.kssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="jssj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.jssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请假天数" align="center" prop="qjts" />
      <el-table-column label="批准人" align="center" prop="pzr" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:attendance:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:attendance:remove']"
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

    <!-- 添加或修改学生考勤对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="申请人" prop="sqr">
          <el-input v-model="form.sqr" placeholder="请输入申请人" />
        </el-form-item>
        <el-form-item label="请假类型" prop="qjlx">
          <el-select v-model="form.qjlx" placeholder="请选择请假类型">
            <el-option
              v-for="dict in qjlxOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请假理由" prop="qjly">
          <el-input v-model="form.qjly" placeholder="请输入请假理由" />
        </el-form-item>
        <el-form-item label="开始时间" prop="kssj">
          <el-date-picker clearable size="small"
            v-model="form.kssj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="jssj">
          <el-date-picker clearable size="small"
            v-model="form.jssj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="请假天数" prop="qjts">
          <el-input v-model="form.qjts" placeholder="请输入请假天数" />
        </el-form-item>
        <el-form-item label="批准人" prop="pzr">
          <el-input v-model="form.pzr" placeholder="请输入批准人" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

      <!-- 导入对话框 -->
      <el-dialog :close-on-click-modal="false" :title="upload.title" :visible.sync="upload.open" width="400px">
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
import { listAttendance, getAttendance, delAttendance, addAttendance, updateAttendance } from "@/api/basic/attendance";
import { getToken } from "@/utils/auth";

export default {
  name: "Attendance",
  components: {
  },
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
      // 学生考勤表格数据
      attendanceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 请假类型字典
      qjlxOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sqr: null,
        qjlx: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 用户导入参数
      upload: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "导入学生考勤数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "basic/attendance/importData"
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("leave_type").then(response => {
      this.qjlxOptions = response.data;
    });
    this.getDicts("basic_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询学生考勤列表 */
    getList() {
      this.loading = true;
      listAttendance(this.queryParams).then(response => {
        this.attendanceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 请假类型字典翻译
    qjlxFormat(row, column) {
      return this.selectDictLabel(this.qjlxOptions, row.qjlx);
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
        glid: null,
        sqr: null,
        qjlx: null,
        qjly: null,
        kssj: null,
        jssj: null,
        qjts: null,
        pzr: null,
        status: null,
        remark: null,
        userId: null,
        userName: null,
        dataOrder: null,
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
      this.title = "添加学生考勤";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAttendance(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生考勤";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAttendance(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAttendance(this.form).then(response => {
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
      this.$confirm('是否确认删除学生考勤编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAttendance(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basic/attendance/export', {
        ...this.queryParams
      }, `学生考勤.xlsx`)
    },

      /** 导入按钮操作 */
      handleImport() {
          this.upload.title = "学生考勤数据导入";
          this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
          this.download('basic/attendance/importTemplate', {
              ...this.queryParams
          }, `学生考勤-导入模板.xlsx`)
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
          this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
          this.getList();
      },
      // 提交上传文件
      submitFileForm() {
          this.$refs.upload.submit();
      }


  }
};
</script>