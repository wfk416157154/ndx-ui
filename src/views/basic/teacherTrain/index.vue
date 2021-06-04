<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="参训人" prop="cxr">
        <el-input
          v-model="queryParams.cxr"
          placeholder="请输入参训人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="培训状态(面试状态)" prop="pxzt">
        <el-input
          v-model="queryParams.pxzt"
          placeholder="请输入培训状态(面试状态)"
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
          v-hasPermi="['basic:teacherTrain:add']"
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
          v-hasPermi="['basic:teacherTrain:edit']"
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
          v-hasPermi="['basic:teacherTrain:remove']"
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
          v-hasPermi="['basic:teacherTrain:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teacherTrainList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="参训人" align="center" prop="cxr" />
      <el-table-column label="培训时间" align="center" prop="pxsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.pxsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实习班级" align="center" prop="sxbj" />
      <el-table-column label="上岗班级" align="center" prop="sgbj" />
      <el-table-column label="培训目标" align="center" prop="pxmb" />
      <el-table-column label="培训要求" align="center" prop="pxyq" />
      <el-table-column label="培训状态(面试状态)" align="center" prop="pxzt" :formatter="pxztFormat" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:teacherTrain:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:teacherTrain:remove']"
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

    <!-- 添加或修改老师培训对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联id" prop="glid">
          <el-input v-model="form.glid" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="参训人" prop="cxr">
          <el-input v-model="form.cxr" placeholder="请输入参训人" />
        </el-form-item>
        <el-form-item label="培训时间" prop="pxsj">
          <el-date-picker clearable size="small"
            v-model="form.pxsj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择培训时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实习班级" prop="sxbj">
          <el-input v-model="form.sxbj" placeholder="请输入实习班级" />
        </el-form-item>
        <el-form-item label="上岗班级" prop="sgbj">
          <el-input v-model="form.sgbj" placeholder="请输入上岗班级" />
        </el-form-item>
        <el-form-item label="培训目标" prop="pxmb">
          <el-input v-model="form.pxmb" placeholder="请输入培训目标" />
        </el-form-item>
        <el-form-item label="培训要求" prop="pxyq">
          <el-input v-model="form.pxyq" placeholder="请输入培训要求" />
        </el-form-item>
        <el-form-item label="培训状态(面试状态)" prop="pxzt">
          <el-input v-model="form.pxzt" placeholder="请输入培训状态(面试状态)" />
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
import { listTeacherTrain, getTeacherTrain, delTeacherTrain, addTeacherTrain, updateTeacherTrain } from "@/api/basic/teacherTrain";
import { getToken } from "@/utils/auth";

export default {
  name: "TeacherTrain",
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
      // 老师培训表格数据
      teacherTrainList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 培训状态(面试状态)字典
      pxztOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cxr: null,
        pxzt: null,
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
          title: "导入老师培训数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "basic/teacherTrain/importData"
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("tea_per_type").then(response => {
      this.pxztOptions = response.data;
    });
  },
  methods: {
    /** 查询老师培训列表 */
    getList() {
      this.loading = true;
      listTeacherTrain(this.queryParams).then(response => {
        this.teacherTrainList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 培训状态(面试状态)字典翻译
    pxztFormat(row, column) {
      return this.selectDictLabel(this.pxztOptions, row.pxzt);
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
        cxr: null,
        pxsj: null,
        sxbj: null,
        sgbj: null,
        pxmb: null,
        pxyq: null,
        pxzt: null,
        remark: null,
        userId: null,
        userName: null,
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
      this.title = "添加老师培训";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeacherTrain(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改老师培训";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeacherTrain(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeacherTrain(this.form).then(response => {
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
      this.$confirm('是否确认删除老师培训编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeacherTrain(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e)=>{
          console.log(e);
      })

    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basic/teacherTrain/export', {
        ...this.queryParams
      }, `老师培训.xlsx`)
    },

      /** 导入按钮操作 */
      handleImport() {
          this.upload.title = "老师培训数据导入";
          this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
          this.download('basic/teacherTrain/importTemplate', {
              ...this.queryParams
          }, `老师培训-导入模板.xlsx`)
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