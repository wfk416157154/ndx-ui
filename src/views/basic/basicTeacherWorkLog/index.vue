<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="教师id" prop="teacherId">
        <el-input
          v-model="queryParams.teacherId"
          placeholder="请输入教师id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否已读" prop="isRead">
        <el-select v-model="queryParams.isRead" placeholder="请选择未读:0;已读:1" clearable size="small">
          <el-option
            v-for="dict in isReadOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课后日志类型" prop="khLogType">
        <el-select v-model="queryParams.khLogType" placeholder="请选择课后日志类型:(听写:1;课文背诵:2;听力:3)" clearable size="small">
          <el-option
            v-for="dict in khLogTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
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
          v-hasPermi="['basic:basicTeacherWorkLog:add']"
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
          v-hasPermi="['basic:basicTeacherWorkLog:edit']"
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
          v-hasPermi="['basic:basicTeacherWorkLog:remove']"
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
          v-hasPermi="['basic:basicTeacherWorkLog:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="basicTeacherWorkLogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="教师id" align="center" prop="teacherId" />
      <el-table-column label="日期" align="center" prop="date" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程总结" align="center" prop="kczj" />
      <el-table-column label="备课:系统日志" align="center" prop="bkXtrz" />
      <el-table-column label="备课:补充日志" align="center" prop="bkBcrz" />
      <el-table-column label="课后:系统日志" align="center" prop="khXtrz" />
      <el-table-column label="课后:补充日志" align="center" prop="khBcrz" />
      <el-table-column label="是否有考试 0:否 1:是" align="center" prop="isExam" :formatter="isExamFormat" />
      <el-table-column label="未读:0;已读:1" align="center" prop="isRead" :formatter="isReadFormat" />
      <el-table-column label="课后日志类型:(听写:1;课文背诵:2;听力:3)" align="center" prop="khLogType" :formatter="khLogTypeFormat" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:basicTeacherWorkLog:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:basicTeacherWorkLog:remove']"
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

    <!-- 添加或修改老师工作日志对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="教师id" prop="teacherId">
          <el-input v-model="form.teacherId" placeholder="请输入教师id" />
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker clearable size="small"
            v-model="form.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="课程总结" prop="kczj">
          <el-input v-model="form.kczj" placeholder="请输入课程总结" />
        </el-form-item>
        <el-form-item label="备课:系统日志" prop="bkXtrz">
          <el-input v-model="form.bkXtrz" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备课:补充日志" prop="bkBcrz">
          <el-input v-model="form.bkBcrz" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="课后:系统日志" prop="khXtrz">
          <el-input v-model="form.khXtrz" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="课后:补充日志" prop="khBcrz">
          <el-input v-model="form.khBcrz" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否有考试 0:否 1:是" prop="isExam">
          <el-select v-model="form.isExam" placeholder="请选择是否有考试 0:否 1:是">
            <el-option
              v-for="dict in isExamOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="未读:0;已读:1" prop="isRead">
          <el-select v-model="form.isRead" placeholder="请选择未读:0;已读:1">
            <el-option
              v-for="dict in isReadOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师卫生图片" prop="jswsFile">
          <el-input v-model="form.jswsFile" placeholder="请输入教师卫生图片" />
        </el-form-item>
        <el-form-item label="学生表现图片" prop="xsbxFile">
          <el-input v-model="form.xsbxFile" placeholder="请输入学生表现图片" />
        </el-form-item>
        <el-form-item label="课后日志类型:(听写:1;课文背诵:2;听力:3)" prop="khLogType">
          <el-select v-model="form.khLogType" placeholder="请选择课后日志类型:(听写:1;课文背诵:2;听力:3)">
            <el-option
              v-for="dict in khLogTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
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
import { listBasicTeacherWorkLog, getBasicTeacherWorkLog, delBasicTeacherWorkLog, addBasicTeacherWorkLog, updateBasicTeacherWorkLog } from "@/api/basic/basicTeacherWorkLog";
import { getToken } from "@/utils/auth";

export default {
  name: "BasicTeacherWorkLog",
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
      // 老师工作日志表格数据
      basicTeacherWorkLogList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否有考试 0:否 1:是字典
      isExamOptions: [],
      // 未读:0;已读:1字典
      isReadOptions: [],
      // 课后日志类型:(听写:1;课文背诵:2;听力:3)字典
      khLogTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        teacherId: null,
        isRead: null,
        khLogType: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        teacherId: [
          { required: true, message: "教师id不能为空", trigger: "blur" }
        ],
      },
      // 用户导入参数
      upload: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "导入老师工作日志数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "basic/basicTeacherWorkLog/importData"
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("basic_is_exam").then(response => {
      this.isExamOptions = response.data;
    });
    this.getDicts("basic_is_ read").then(response => {
      this.isReadOptions = response.data;
    });
    this.getDicts("basic_kh_log_type").then(response => {
      this.khLogTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询老师工作日志列表 */
    getList() {
      this.loading = true;
      listBasicTeacherWorkLog(this.queryParams).then(response => {
        this.basicTeacherWorkLogList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 是否有考试 0:否 1:是字典翻译
    isExamFormat(row, column) {
      return this.selectDictLabel(this.isExamOptions, row.isExam);
    },
    // 未读:0;已读:1字典翻译
    isReadFormat(row, column) {
      return this.selectDictLabel(this.isReadOptions, row.isRead);
    },
    // 课后日志类型:(听写:1;课文背诵:2;听力:3)字典翻译
    khLogTypeFormat(row, column) {
      return this.selectDictLabel(this.khLogTypeOptions, row.khLogType);
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
        teacherId: null,
        date: null,
        kczj: null,
        bkXtrz: null,
        bkBcrz: null,
        khXtrz: null,
        khBcrz: null,
        isExam: null,
        isRead: null,
        jswsFile: null,
        xsbxFile: null,
        khLogType: null,
        status: "0",
        remark: null,
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
      this.title = "添加老师工作日志";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBasicTeacherWorkLog(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改老师工作日志";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBasicTeacherWorkLog(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBasicTeacherWorkLog(this.form).then(response => {
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
      this.$confirm('是否确认删除老师工作日志编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBasicTeacherWorkLog(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basic/basicTeacherWorkLog/export', {
        ...this.queryParams
      }, `老师工作日志.xlsx`)
    },

      /** 导入按钮操作 */
      handleImport() {
          this.upload.title = "老师工作日志数据导入";
          this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
          this.download('basic/basicTeacherWorkLog/importTemplate', {
              ...this.queryParams
          }, `老师工作日志-导入模板.xlsx`)
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