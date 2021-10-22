<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="日语班级" prop="bjmc">
        <el-input
          v-model="queryParams.bjmc"
          placeholder="请输入日语班级名称"
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="changeStatus(1)">已发送</el-button>
        <el-button type="primary" size="mini" @click="changeStatus(0)">未发送</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table
      border
      v-loading="loading"
      :data="examinationPaperList"
      @selection-change="handleSelectionChange"
      style="width: 100%;font-size : 18px"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="日语班级" align="center" prop="bjmc"/>
      <el-table-column label="日语老师" align="center" prop="lsxm"/>
      <el-table-column label="教材" align="center" prop="jcmc"/>
      <el-table-column label="考试类型" align="center" :formatter="getKslx" prop="kslx"/>
      <el-table-column label="考试范围" align="center" prop="ksfw">
        <!--<template slot-scope="scope">
          <span v-if="'1'==scope.row.kslx">
            <dict-tag :options="sjglKsfwJsbfList" :value="scope.row.ksfw"/>
          </span>
          <span v-else>
            <dict-tag :options="sjglKsfwJsbfList" :value="scope.row.ksfw.split('-')[0]"/>-至-
            <dict-tag :options="sjglKsfwJsbfList" :value="scope.row.ksfw.split('-')[1]"/>
          </span>
        </template>-->
      </el-table-column>
      <el-table-column label="考试时间" align="center" prop="kskssj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.kskssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试结束时间" align="center" v-if="false" prop="ksjssj" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ksjssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="试卷状态" align="center" :formatter="getKszt" prop="jwsjzt"/>
      <el-table-column label="发送时间" align="center" prop="fssj" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.fssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            v-if="scope.row.jwsjzt == '0'"
          >上传试卷
          </el-button>
          <!-- <el-button
            size="mini"
            type="text"
            @click="submitForm(scope.row)"
            v-if="scope.row.jwsjzt == '0'"
          >发送试卷</el-button>-->
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

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept="*"
        :headers="upload.headers"
        :action="upload.fileUrl"
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
          <el-checkbox v-model="upload.updateSupport"/>
          是否更新已经存在的数据
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入".zip"格式文件！</div>
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
  import {getToken} from "@/utils/auth";
  import {listBjclass} from "@/api/basic/bjclass";
  import {addFile} from "@/api/tool/common";

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
          bjmc: null,
          kslx: null,
          ksnr: null,
          jcmc: null,
          jwsjzt: null,
          lssjzt: null,
          status: "1", // 默认查询正常的数据
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
        rules: {},
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
          headers: {Authorization: "Bearer " + getToken()},
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "basic/examinationPaper/importData",
          // 上传图片地址
          fileUrl: process.env.VUE_APP_BASE_API + "/file/upload"
        },
        // 用户关联id
        glrid: "",
        // 老师教学班级
        classList: [],
        // 老师试卷状态
        getStatusList: [],
        // 考试信息id
        examinationInformationId: "",
        sjglKsfwKsbfList: [],
        sjglKsfwJsbfList: [],
        examinationInformationId: "",
        $row: null
      };
    },
    created() {
      this.getList();
      this.getListBjclass();
      this.getDicts("examination_type").then(response => {
        this.kslxOptions = response.data;
      });
      this.getDicts("sjzt").then(response => {
        this.getStatusList = response.data;
      });
      // 试卷管理-考试范围-开始部分
      this.getDicts("sjgl-ksfw-ksbf").then(response => {
        this.sjglKsfwKsbfList = response.data;
      });
      // 试卷管理-考试范围-结束部分
      this.getDicts("sjgl-ksfw-jsbf").then(response => {
        this.sjglKsfwJsbfList = response.data;
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
      changeStatus(value) {
        this.queryParams.jwsjzt = value;
        this.queryParams.pageNum = 1;
        this.getList()
      },

      // 获取老师所带班级
      getListBjclass() {
        this.glrid = this.$store.state.user.glrid;
        listBjclass({kzzd2: this.glrid}).then(res => {
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
          status: "1",
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
        this.open = true;
        this.title = "添加考卷";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.$row = row;
        this.examinationInformationId = row.id;
        this.upload.open = true;
      },
      // 考卷发送
      submitForm(row) {
        this.form = row;
        this.form.jwsjzt = "1";
        this.form.lssjzt = "2";
        if (this.form.id != null) {
          this.form.fsrid = this.$store.state.user.glrid;
          this.form.fsrmc = this.$store.state.user.nickName;
          updateExaminationPaper(this.form).then(response => {
            this.msgSuccess("上传并试卷成功");
            this.open = false;
            this.getList();
          });
        }
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
      // 文件上传之前处理
      beforeAvatarUpload(file) {
        const isZIP = file.type === "application/x-zip-compressed";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isZIP) {
          this.$message.error("上传头像zip文件 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isZIP && isLt2M;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        let data = response.data;
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        if (response.code === 200){
          this.submitForm(this.$row);
          data.kzzd1 = this.examinationInformationId;
          // 保存文件上传地址
          addFile(data).then(res => {
          });
        }else {
          this.msgError("上传失败");
        }
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
      // 考试类型字典翻译
      getKslx(row, column) {
        return this.selectDictLabel(this.kslxOptions, row.kslx);
      },
      // 考试状态字典翻译
      getKszt(row, column) {
        return row.jwsjzt == "1" ? "已发送" : "未发送";
      }
    }
  };
</script>
