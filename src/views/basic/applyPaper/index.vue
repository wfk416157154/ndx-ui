<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="日语班级" prop="bjid">
        <el-select v-model="queryParams.bjid" @change="getClassList" placeholder="请选择日语班级">
          <el-option
            v-for="dict in classList"
            :key="dict.id"
            :label="dict.rybjmc"
            :value="dict.id"
          ></el-option>
        </el-select>
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">申请试卷</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table
      border
      v-loading="loading"
      :data="examinationPaperList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="日语班级" align="center" prop="bjmc" />
      <el-table-column label="老师" align="center" prop="fsrmc" />
      <el-table-column label="教材" align="center" prop="jcmc" />
      <el-table-column label="考试类型" align="center" :formatter="getKslx" prop="kslx" />
      <el-table-column label="考试范围" align="center" prop="ksfw" />
      <el-table-column label="考试时间" align="center" prop="kskssj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.kskssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试结束时间" align="center" v-if="false" prop="ksjssj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ksjssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="试卷状态" align="center" :formatter="getKszt" prop="lssjzt" />
      <el-table-column label="发送时间" align="center" prop="fssj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.fssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送人" align="center" prop="fsrmc" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span v-if="scope.row.lssjzt == '1'">暂无试卷</span>
          <el-button
            size="mini"
            type="text"
            @click="handleExport(scope.row)"
            v-if="scope.row.lssjzt == '2' || scope.row.lssjzt == '3' || scope.row.lssjzt == '4'"
          >下载</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="formState" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="老师姓名" label-width="120px" prop="fsrmc">
          <el-input v-model="form.fsrmc" placeholder="请输入老师姓名" readonly />
        </el-form-item>
        <el-form-item label="日语班级" label-width="120px" prop="bjid">
          <el-select v-model="form.bjid" @change="getClassList" placeholder="请选择日语班级">
            <el-option
              v-for="dict in classList"
              :key="dict.id"
              :label="dict.rybjmc"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教材" label-width="120px" prop="jcid">
          <el-select v-model="form.jcid" @change="getJcList" placeholder="请输入考试类型">
            <el-option
              v-for="(item,index) in jsList"
              :key="index"
              :label="item.jcmc"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试类型" label-width="120px" prop="kslx">
          <el-select v-model="form.kslx" plac输入eholder="请考试类型">
            <el-option
              v-for="dict in kslxOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试范围" label-width="120px" prop="ksfw">
          <el-input v-model="form.ksfw" placeholder="请输入考试范围" maxlength="40" />
        </el-form-item>
        <el-form-item label="考试时间" label-width="120px" prop="kskssj">
          <el-date-picker
            v-model="form.kskssj"
            type="date"
            value-format=" yyyy-MM-dd"
            placeholder="选择考试时间"
          ></el-date-picker>
        </el-form-item>
        <!--<el-form-item label="考试结束时间" label-width="120px" prop="ksjssj">
          <el-date-picker
            v-model="form.ksjssj"
            type="datetime"
            value-format=" yyyy-MM-dd HH:mm"
            placeholder="选择考试开始时间"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item label="备注" label-width="120px" prop="remark">
          <el-input v-model="form.remark" placeholder />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitForm">提交</el-button>
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
  listExaminationPaper,
  getExaminationPaper,
  delExaminationPaper,
  addExaminationPaper,
  updateExaminationPaper
} from "@/api/basic/examinationPaper";
import { getToken } from "@/utils/auth";
import { listBjclass } from "@/api/basic/bjclass";
import { listType } from "@/api/teaching/type";
export default {
  name: "ExaminationPaper",
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
        bjid: null,
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
        bjid: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        jcid: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        kslx: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        ksfw: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        kskssj: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
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
      // 用户关联id
      glrid: "",
      // 老师教学班级
      classList: [],
      // 老师试卷状态
      getStatusList: [],
      // 教材名称
      jsList: []
    };
  },
  created() {
    this.getDicts("examination_type").then(response => {
      this.kslxOptions = response.data;
    });
    this.getDicts("sjzt").then(response => {
      this.getStatusList = response.data;
    });
  },
  mounted() {
    this.getList();
    this.getListType();
    this.getListBjclass();
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
    // 教材
    getListType() {
      listType().then(res => {
        this.jsList = res.rows;
      });
    },
    // 获取老师所带班级
    getListBjclass() {
      this.glrid = this.$store.state.user.glrid;
      listBjclass({ kzzd2: this.glrid }).then(res => {
        this.classList = res.rows;
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.fsrmc = this.$store.state.user.nickName;
      this.form.lsid = this.$store.state.user.glrid;
      this.open = true;
      this.title = "添加考卷";
    },
    /** 提交按钮 */
    submitForm(status) {
      if (status === "3") {
        // this.form = status;
        this.form.lssjzt = status;
      }
      this.$refs.formState.validate(valid => {
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
    /** 下载试卷 */
    handleExport(row) {
      this.download(
        "file/filetable/download",
        {
          kzzd1: row.id
        },
        `考卷-${new Date().getTime()}.zip`
      );
      // 修改老师试卷状态
      this.submitForm("3");
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "考卷数据导入";
      this.upload.open = true;
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
    },
    //班级id 和 名称
    getClassList(value) {
      for (let i = 0; i < this.classList.length; i++) {
        if (this.classList[i].id == value) {
          this.form.bjid = value;
          this.form.bjmc = this.classList[i].rybjmc;
        }
      }
    },
    //教材id 和 名称
    getJcList(value) {
      for (let i = 0; i < this.jsList.length; i++) {
        if (this.jsList[i].id == value) {
          this.form.jcid = value;
          this.form.jcmc = this.jsList[i].jcmc;
        }
      }
    },
    // 考试类型字典翻译
    getKslx(row, column) {
      return this.selectDictLabel(this.kslxOptions, row.kslx);
    },
    // 考试状态字典翻译
    getKszt(row, column) {
      return this.selectDictLabel(this.getStatusList, row.lssjzt);
    }
  }
};
</script>
