<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="班级" prop="rybjid">
        <el-select v-model="queryParams.rybjid" placeholder="请选择班级" filterable>
          <el-option
            :label="item.rybjmc"
            :value="item.id"
            v-for="(item,index) in classList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="kzzd1">
        <el-input v-model="queryParams.kzzd1" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="问题类型" prop="problemType">
        <el-select v-model="queryParams.problemType" placeholder="请选择问题类型" clearable size="small">
          <el-option
            v-for="dict in problemTypesOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="solutionStatus">
        <el-select v-model="queryParams.solutionStatus" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in problemStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="sjArr">
        <el-date-picker
          size=" mini"
          v-model="queryParams.sjArr"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

<!--    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basic:feedback:add']"
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
          v-hasPermi="['basic:feedback:edit']"
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
          v-hasPermi="['basic:feedback:remove']"
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
          v-hasPermi="['basic:feedback:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>-->

    <el-table v-loading="loading" :height="$root.tableHeight" border :data="feedbackList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="班级" align="center" prop="rybjmc" />
      <el-table-column label="姓名" align="center" prop="problemUserNickname" />
      <el-table-column label="标题" align="center" prop="kzzd1"/>
      <el-table-column prop="problemType" label="问题类型">
        <template slot-scope="scope">
            <dict-tag :options="problemTypesOptions" :value="scope.row.problemType" />
        </template>
      </el-table-column>
      <el-table-column label="提问时间" align="center" prop="createTime" width="180"></el-table-column>
      <el-table-column label="文件下载" align="center" prop="wjidArr">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-for="(item,index) in scope.row.wjidArr"
            :key="index"
            @click="downloadFileName(item.wjmc)"
          >{{item.wjmc}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="问题解决时间" align="center" prop="solutionTime" width="180"></el-table-column>
<!--      <el-table-column label="描述" align="center" prop="problemDescribe" />-->
      <el-table-column prop="solutionStatus" label="问题解决状态">
        <template slot-scope="scope">
          <div>
            <dict-tag :options="problemStatusOptions" :value="scope.row.solutionStatus" />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >查看</el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['basic:feedback:remove']"-->
<!--          >删除</el-button>-->
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

    <!-- 添加或修改问题反馈对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班级" prop="rybjmc">
          <el-input v-model="form.rybjmc" disabled/>
        </el-form-item>
        <el-form-item label="姓名" prop="problemUserNickname">
          <el-input v-model="form.problemUserNickname" disabled/>
        </el-form-item>
        <el-form-item label="标题" prop="kzzd1">
          <el-input v-model="form.kzzd1" maxLength="200" placeholder="不能超过200个字" />
        </el-form-item>
        <el-form-item label="问题类型" prop="problemType">
          <el-select v-model="form.problemType" disabled>
            <el-option
              v-for="dict in problemTypesOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述" prop="problemDescribe">
          <editor v-model="form.problemDescribe" :disabled="true" :min-height="192" />
        </el-form-item>
        <el-form-item label="资料上传" prop="wjid">
          <span>请在主页列表中点击文件进行下载</span>
        </el-form-item>
        <el-form-item label="解决方法" prop="solution">
          <editor v-model="form.solution" :min-height="192" />
        </el-form-item>
<!--        <el-form-item label="问题解决人id" prop="solutionUserId">-->
<!--          <el-input v-model="form.solutionUserId" placeholder="请输入问题解决人id" />-->
<!--        </el-form-item>-->
        <el-form-item label="状态">
          <el-select v-model="form.solutionStatus" placeholder="请选择状态" clearable size="small">
            <el-option
              v-for="dict in problemStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="备注">-->
<!--          <editor v-model="form.remark" :min-height="192"/>-->
<!--        </el-form-item>-->
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
import { listFeedback, getFeedback, delFeedback, addFeedback, updateFeedback } from "@/api/basic/feedback";
import { getToken } from "@/utils/auth";
import { listBjclass } from "@/api/basic/bjclass";

export default {
  name: "Feedback",
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
      // 问题反馈表格数据
      feedbackList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        problemType: null,
        solutionStatus: null,
        sjArr: [],
        rybjid: null,
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
          title: "导入问题反馈数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/basic/feedback/importData"
      },
      problemTypesOptions: [],// 问题类型字典类型
      problemStatusOptions: [],// 问题解决状态字典类型
      classList: [],
    };
  },
  created() {
    this.getList();
    this.getDicts("problem_types").then(response => {
      this.problemTypesOptions = response.data;
    });
    this.getDicts("problem_status").then(response => {
      this.problemStatusOptions = response.data;
    });
    listBjclass().then(res => {
      this.classList = res.rows;
    });
  },
  methods: {
    /** 查询问题反馈列表 */
    getList() {
      this.loading = true;
      listFeedback(this.queryParams).then(response => {
        this.feedbackList = response.rows;
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
        problemUserId: null,
        problemUserNickname: null,
        problemType: null,
        problemDescribe: null,
        wjid: null,
        solution: null,
        solutionUserId: null,
        solutionTime: null,
        solutionStatus: "0",
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
      this.title = "添加问题反馈";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFeedback(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "查看问题反馈";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFeedback(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFeedback(this.form).then(response => {
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
          return delFeedback(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e)=>{
          console.log(e);
      })

    },
    /** 下载模板操作 */
    downloadFileName(fileName) {
      this.download('file/filetable/download', {
        wjmc:fileName
      }, fileName)
    },


  }
};
</script>
