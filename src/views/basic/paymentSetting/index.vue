<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="第N期" prop="dnq">
        <el-input
          v-model="queryParams.dnq"
          placeholder="请输入第N期"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="本期应缴费金额" prop="bqyjfje">
        <el-input
          v-model="queryParams.bqyjfje"
          placeholder="请输入本期应缴费金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收费开始日期" prop="chargeStartDate">
        <el-date-picker clearable size="small"
          v-model="queryParams.chargeStartDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择收费开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="收费截止日期" prop="chargeEndDate">
        <el-date-picker clearable size="small"
          v-model="queryParams.chargeEndDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择收费截止日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="周期-开始年月份" prop="periodStartDate">
        <el-input
          v-model="queryParams.periodStartDate"
          placeholder="请输入周期-开始年月份"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="周期-截止年月份" prop="periodEndDate">
        <el-input
          v-model="queryParams.periodEndDate"
          placeholder="请输入周期-截止年月份"
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
          v-hasPermi="['basic:paymentSetting:add']"
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
          v-hasPermi="['basic:paymentSetting:edit']"
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
          v-hasPermi="['basic:paymentSetting:remove']"
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
          v-hasPermi="['basic:paymentSetting:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table style="width: 100%;font-size : 18px" v-loading="loading" :height="$root.tableHeight" border :data="paymentSettingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="第N期" align="center" prop="dnq" />
      <el-table-column label="本期应缴费金额" align="center" prop="bqyjfje" />
      <el-table-column label="收费开始日期" align="center" prop="chargeStartDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.chargeStartDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收费截止日期" align="center" prop="chargeEndDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.chargeEndDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周期-开始年月份" align="center" prop="periodStartDate" />
      <el-table-column label="周期-截止年月份" align="center" prop="periodEndDate" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:paymentSetting:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:paymentSetting:remove']"
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

    <!-- 添加或修改缴费设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="第N期" prop="dnq">
          <el-input v-model="form.dnq" placeholder="请输入第N期" />
        </el-form-item>
        <el-form-item label="本期应缴费金额" prop="bqyjfje">
          <el-input v-model="form.bqyjfje" placeholder="请输入本期应缴费金额" />
        </el-form-item>
        <el-form-item label="收费开始日期" prop="chargeStartDate">
          <el-date-picker clearable size="small"
            v-model="form.chargeStartDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择收费开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收费截止日期" prop="chargeEndDate">
          <el-date-picker clearable size="small"
            v-model="form.chargeEndDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择收费截止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="周期-开始年月份" prop="periodStartDate">
          <el-input v-model="form.periodStartDate" placeholder="请输入周期-开始年月份" />
        </el-form-item>
        <el-form-item label="周期-截止年月份" prop="periodEndDate">
          <el-input v-model="form.periodEndDate" placeholder="请输入周期-截止年月份" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
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
import { listPaymentSetting, getPaymentSetting, delPaymentSetting, addPaymentSetting, updatePaymentSetting } from "@/api/basic/paymentSetting";
import { getToken } from "@/utils/auth";

export default {
  name: "PaymentSetting",
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
      // 缴费设置表格数据
      paymentSettingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dnq: null,
        bqyjfje: null,
        chargeStartDate: null,
        chargeEndDate: null,
        periodStartDate: null,
        periodEndDate: null,
        status: null,
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
          title: "导入缴费设置数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/basic/paymentSetting/importData"
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询缴费设置列表 */
    getList() {
      this.loading = true;
      listPaymentSetting(this.queryParams).then(response => {
        this.paymentSettingList = response.rows;
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
        rybjid: null,
        dnq: null,
        bqyjfje: null,
        chargeStartDate: null,
        chargeEndDate: null,
        periodStartDate: null,
        periodEndDate: null,
        status: "0",
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
      this.title = "添加缴费设置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPaymentSetting(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改缴费设置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePaymentSetting(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPaymentSetting(this.form).then(response => {
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
          return delPaymentSetting(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e)=>{
          console.log(e);
      })

    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basic/paymentSetting/export', {
        ...this.queryParams
      }, `缴费设置-${new Date().getTime()}.xlsx`)
    },

      /** 导入按钮操作 */
      handleImport() {
          this.importBtn=false
          this.upload.title = "缴费设置数据导入";
          this.upload.open = true;
          this.$nextTick(() => {// 页面元素加载完成后执行该方法
              this.$refs.upload.clearFiles();
          });
      },
      /** 下载模板操作 */
      importTemplate() {
          this.download('basic/paymentSetting/importTemplate', {
              ...this.queryParams
          }, `缴费设置-导入模板-${new Date().getTime()}.xlsx`)
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
