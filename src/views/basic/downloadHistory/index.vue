<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文件名称" prop="wjmc">
        <el-input
          v-model="queryParams.wjmc"
          placeholder="请输入文件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属模块" prop="ssmk">
        <el-input
          v-model="queryParams.ssmk"
          placeholder="请输入所属模块"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下载人手机号" prop="xzrsjh">
        <el-input
          v-model="queryParams.xzrsjh"
          placeholder="请输入下载人手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下载人名称" prop="xzrmc">
        <el-input
          v-model="queryParams.xzrmc"
          placeholder="请输入下载人名称"
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
          v-hasPermi="['basic:downloadHistory:add']"
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
          v-hasPermi="['basic:downloadHistory:edit']"
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
          v-hasPermi="['basic:downloadHistory:remove']"
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
          v-hasPermi="['basic:downloadHistory:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :height="$root.tableHeight" border :data="downloadHistoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="文件表id" align="center" prop="wjbid" />
      <el-table-column label="文件名称" align="center" prop="wjmc" />
      <el-table-column label="文件大小" align="center" prop="wjdx" />
      <el-table-column label="所属模块" align="center" prop="ssmk" />
      <el-table-column label="下载人id" align="center" prop="xzrid" />
      <el-table-column label="下载人手机号" align="center" prop="xzrsjh" />
      <el-table-column label="下载人名称" align="center" prop="xzrmc" />
      <el-table-column label="下载时间" align="center" prop="downloadTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.downloadTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:downloadHistory:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:downloadHistory:remove']"
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

    <!-- 添加或修改下载历史记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文件表id" prop="wjbid">
          <el-input v-model="form.wjbid" placeholder="请输入文件表id" />
        </el-form-item>
        <el-form-item label="文件名称" prop="wjmc">
          <el-input v-model="form.wjmc" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item label="文件大小" prop="wjdx">
          <el-input v-model="form.wjdx" placeholder="请输入文件大小" />
        </el-form-item>
        <el-form-item label="所属模块" prop="ssmk">
          <el-input v-model="form.ssmk" placeholder="请输入所属模块" />
        </el-form-item>
        <el-form-item label="下载人id" prop="xzrid">
          <el-input v-model="form.xzrid" placeholder="请输入下载人id" />
        </el-form-item>
        <el-form-item label="下载人手机号" prop="xzrsjh">
          <el-input v-model="form.xzrsjh" placeholder="请输入下载人手机号" />
        </el-form-item>
        <el-form-item label="下载人名称" prop="xzrmc">
          <el-input v-model="form.xzrmc" placeholder="请输入下载人名称" />
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
import { listDownloadHistory, getDownloadHistory, delDownloadHistory, addDownloadHistory, updateDownloadHistory } from "@/api/basic/downloadHistory";
import { getToken } from "@/utils/auth";

export default {
  name: "DownloadHistory",
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
      // 下载历史记录表格数据
      downloadHistoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        wjmc: null,
        ssmk: null,
        xzrsjh: null,
        xzrmc: null,
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
          title: "导入下载历史记录数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/basic/downloadHistory/importData"
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询下载历史记录列表 */
    getList() {
      this.loading = true;
      listDownloadHistory(this.queryParams).then(response => {
        this.downloadHistoryList = response.rows;
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
        wjbid: null,
        wjmc: null,
        wjdx: null,
        ssmk: null,
        xzrid: null,
        xzrsjh: null,
        xzrmc: null,
        downloadTime: null,
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
      this.title = "添加下载历史记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDownloadHistory(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改下载历史记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDownloadHistory(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDownloadHistory(this.form).then(response => {
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
          return delDownloadHistory(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e)=>{
          console.log(e);
      })

    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basic/downloadHistory/export', {
        ...this.queryParams
      }, `下载历史记录-${new Date().getTime()}.xlsx`)
    },

      /** 导入按钮操作 */
      handleImport() {
          this.importBtn=false
          this.upload.title = "下载历史记录数据导入";
          this.upload.open = true;
          this.$nextTick(() => {// 页面元素加载完成后执行该方法
              this.$refs.upload.clearFiles();
          });
      },
      /** 下载模板操作 */
      importTemplate() {
          this.download('basic/downloadHistory/importTemplate', {
              ...this.queryParams
          }, `下载历史记录-导入模板-${new Date().getTime()}.xlsx`)
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
