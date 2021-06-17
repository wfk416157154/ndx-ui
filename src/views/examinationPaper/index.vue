<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="班级名称" prop="bjmc">
        <el-input
          v-model="queryParams.bjmc"
          placeholder="请输入班级名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考试类型" prop="kslx">
        <el-select v-model="queryParams.kslx" placeholder="请选择考试类型" clearable size="small">
          <el-option
            v-for="dict in kslxOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="考试内容" prop="ksnr">
        <el-input
          v-model="queryParams.ksnr"
          placeholder="请输入考试内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="教材名称" prop="jcmc">
        <el-input
          v-model="queryParams.jcmc"
          placeholder="请输入教材名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="教务试卷状态" prop="jwsjzt">
        <el-input
          v-model="queryParams.jwsjzt"
          placeholder="请输入教务试卷状态"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="老师试卷状态" prop="lssjzt">
        <el-input
          v-model="queryParams.lssjzt"
          placeholder="请输入老师试卷状态"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序号" prop="dataOrder">
        <el-input
          v-model="queryParams.dataOrder"
          placeholder="请输入排序号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改或录入时间" prop="addOrUpdateTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.addOrUpdateTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择修改或录入时间">
        </el-date-picker>
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
          v-hasPermi="['basic:examinationPaper:add']"
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
          v-hasPermi="['basic:examinationPaper:edit']"
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
          v-hasPermi="['basic:examinationPaper:remove']"
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
          v-hasPermi="['basic:examinationPaper:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="examinationPaperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="班级名称" align="center" prop="bjmc" />
      <el-table-column label="教材名称" align="center" prop="jcmc" />
      <el-table-column label="教务试卷状态" align="center" prop="jwsjzt" />
      <el-table-column label="老师试卷状态" align="center" prop="lssjzt" />
      <el-table-column label="考试开始时间" align="center" prop="kskssj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.kskssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试结束时间" align="center" prop="ksjssj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ksjssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试时间文本" align="center" prop="kssjwb" />
      <el-table-column label="发送时间" align="center" prop="fssj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.fssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送人id" align="center" prop="fsrid" />
      <el-table-column label="发送人名称" align="center" prop="fsrmc" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="排序号" align="center" prop="dataOrder" />
      <el-table-column label="修改或录入时间" align="center" prop="addOrUpdateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addOrUpdateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
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
            v-hasPermi="['basic:examinationPaper:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:examinationPaper:remove']"
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

    <!-- 添加或修改考卷对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班级id" prop="bjid">
          <el-input v-model="form.bjid" placeholder="请输入班级id" />
        </el-form-item>
        <el-form-item label="班级名称" prop="bjmc">
          <el-input v-model="form.bjmc" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="老师id" prop="lsid">
          <el-input v-model="form.lsid" placeholder="请输入老师id" />
        </el-form-item>
        <el-form-item label="考试类型" prop="kslx">
          <el-select v-model="form.kslx" placeholder="请选择考试类型">
            <el-option
              v-for="dict in kslxOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试内容" prop="ksnr">
          <el-input v-model="form.ksnr" placeholder="请输入考试内容" />
        </el-form-item>
        <el-form-item label="考试范围" prop="ksfw">
          <el-input v-model="form.ksfw" placeholder="请输入考试范围" />
        </el-form-item>
        <el-form-item label="教材id" prop="jcid">
          <el-input v-model="form.jcid" placeholder="请输入教材id" />
        </el-form-item>
        <el-form-item label="教材名称" prop="jcmc">
          <el-input v-model="form.jcmc" placeholder="请输入教材名称" />
        </el-form-item>
        <el-form-item label="教务试卷状态" prop="jwsjzt">
          <el-input v-model="form.jwsjzt" placeholder="请输入教务试卷状态" />
        </el-form-item>
        <el-form-item label="老师试卷状态" prop="lssjzt">
          <el-input v-model="form.lssjzt" placeholder="请输入老师试卷状态" />
        </el-form-item>
        <el-form-item label="考试开始时间" prop="kskssj">
          <el-date-picker clearable size="small"
            v-model="form.kskssj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择考试开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考试结束时间" prop="ksjssj">
          <el-date-picker clearable size="small"
            v-model="form.ksjssj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择考试结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考试时间文本" prop="kssjwb">
          <el-input v-model="form.kssjwb" placeholder="请输入考试时间文本" />
        </el-form-item>
        <el-form-item label="发送时间" prop="fssj">
          <el-date-picker clearable size="small"
            v-model="form.fssj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择发送时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发送人id" prop="fsrid">
          <el-input v-model="form.fsrid" placeholder="请输入发送人id" />
        </el-form-item>
        <el-form-item label="发送人名称" prop="fsrmc">
          <el-input v-model="form.fsrmc" placeholder="请输入发送人名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="排序号" prop="dataOrder">
          <el-input v-model="form.dataOrder" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="修改或录入时间" prop="addOrUpdateTime">
          <el-date-picker clearable size="small"
            v-model="form.addOrUpdateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择修改或录入时间">
          </el-date-picker>
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
import { listExaminationPaper, getExaminationPaper, delExaminationPaper, addExaminationPaper, updateExaminationPaper } from "@/api/basic/examinationPaper";
import { getToken } from "@/utils/auth";

export default {
  name: "ExaminationPaper",
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
      // 考卷表格数据
      examinationPaperList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 考试类型字典
      kslxOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bjmc: null,
        kslx: null,
        ksnr: null,
        jcmc: null,
        jwsjzt: null,
        lssjzt: null,
        status: null,
        dataOrder: null,
        addOrUpdateTime: null,
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
      // 用户导入参数
      upload: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "导入考卷数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "basic/examinationPaper/importData"
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("examination_type").then(response => {
      this.kslxOptions = response.data;
    });
  },
  methods: {
    /** 查询考卷列表 */
    getList() {
      this.loading = true;
      listExaminationPaper(this.queryParams).then(response => {
        this.examinationPaperList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 考试类型字典翻译
    kslxFormat(row, column) {
      return this.selectDictLabel(this.kslxOptions, row.kslx);
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
        bjid: null,
        bjmc: null,
        lsid: null,
        kslx: null,
        ksnr: null,
        ksfw: null,
        jcid: null,
        jcmc: null,
        jwsjzt: null,
        lssjzt: null,
        kskssj: null,
        ksjssj: null,
        kssjwb: null,
        fssj: null,
        fsrid: null,
        fsrmc: null,
        status: "0",
        remark: null,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加考卷";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getExaminationPaper(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考卷";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateExaminationPaper(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addExaminationPaper(this.form).then(response => {
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
      this.$confirm('是否确认删除考卷编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delExaminationPaper(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e)=>{
          console.log(e);
      })

    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basic/examinationPaper/export', {
        ...this.queryParams
      }, `考卷.xlsx`)
    },

      /** 导入按钮操作 */
      handleImport() {
          this.upload.title = "考卷数据导入";
          this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
          this.download('basic/examinationPaper/importTemplate', {
              ...this.queryParams
          }, `考卷-导入模板.xlsx`)
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