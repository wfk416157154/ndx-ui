<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="书名" prop="bookName">
        <el-input
          v-model="queryParams.bookName"
          placeholder="请输入书名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程进度" prop="kcjd">
        <el-select v-model="queryParams.kcjd" placeholder="请选择课程进度" clearable size="small">
          <el-option
            v-for="dict in kcjdOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="资料标题" prop="zlbt">
        <el-input
          v-model="queryParams.zlbt"
          placeholder="请输入资料标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="success" size="mini" v-has-role="['admin','academicAdministrator']" @click="seeHistorical">查看下载历史</el-button>
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
          v-has-role="['admin','academicAdministrator']"
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
          v-has-role="['admin','academicAdministrator']"
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
          v-has-role="['admin','academicAdministrator']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :height="$root.tableHeight"
      border
      :data="jfzlFileList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" v-if="false" />
      <el-table-column label="适用范围" align="center" prop="syfw">
        <template slot-scope="scope">
          <span v-if="scope.row.syfw!=null&&scope.row.syfw.length>0">
            <span v-for="(item,index) in scope.row.syfw.split(',')" :key="index">
              <dict-tag :options="syfwOptions" :value="item" />
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="书名" align="center" prop="bookName" />
      <el-table-column label="课程进度" align="center" prop="kcjd">
        <template slot-scope="scope">
          <dict-tag :options="kcjdOptions" :value="scope.row.kcjd" />
        </template>
      </el-table-column>
      <el-table-column label="资料标题" align="center" prop="zlbt" />
      <el-table-column label="课件下载(点击下载)" align="center" prop="wjidArr" width="250px">
        <template slot-scope="scope">
          <el-link
            type="danger"
            size="mini"
            icon="el-icon-bottom"
            v-for="(item,index) in scope.row.wjidArr"
            :key="index"
            @click="downloadFileName(item)"
          >{{item.wjmc}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="考卷下载(点击下载)" align="center" prop="kjidArr" width="250px">
        <template slot-scope="scope">
          <el-link
            type="danger"
            size="mini"
            icon="el-icon-bottom"
            v-for="(item,index) in scope.row.kjidArr"
            :key="index"
            @click="downloadAndAddExam(scope.row,item)"
          >{{item.wjmc}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="是否公开" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="statusOptions" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-has-role="['admin','academicAdministrator']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-has-role="['admin','academicAdministrator']"
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

    <!-- 添加或修改教辅资料对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="适用范围" prop="syfw">
          <el-checkbox-group v-model="form.syfw">
            <el-checkbox
              v-for="dict in syfwOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="书名" prop="bookName">
          <el-input v-model="form.bookName" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="课程进度" prop="kcjd">
          <el-radio-group v-model="form.kcjd" @change="kcjdChange" >
            <el-radio
              v-for="dict in kcjdOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否公开" prop="status">
          <el-radio-group v-model="form.status" >
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="资料标题" prop="zlbt">
          <el-input v-model="form.zlbt" placeholder="请输入资料标题" />
        </el-form-item>
        <el-form-item label="数字课程" prop="dataOrder">
          <el-input-number v-model="form.dataOrder" :min="0" :max="100" placeholder="请输入数字课程" />
        </el-form-item>
        <el-form-item label="课件上传">
          <el-upload
            ref="upload"
            :limit="maxUploadNum"
            accept="*"
            :headers="upload.headers"
            :action="upload.url"
            :disabled="upload.isUploading"
            :on-remove="handleRemove"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :auto-upload="true"
            :file-list="wjidFile"
            drag
            v-loading="fullscreenLoading"
            element-loading-text="正在进行上传·······"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="考卷上传">
          <el-upload
            ref="upload"
            :limit="maxUploadNum"
            accept="*"
            :headers="upload.headers"
            :action="upload.url"
            :disabled="upload.isUploading"
            :on-remove="handleRemove"
            :on-progress="handleFileUploadProgress"
            :on-success="handleKjFileSuccess"
            :auto-upload="true"
            :file-list="kjidFile"
            drag
            v-loading="fullscreenLoading"
            element-loading-text="正在进行上传·······"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <Progress :progress-data="progressData" @data-callback="callBack" ref="progress" />
    <el-dialog title="下载历史" :visible.sync="dialogFormVisible" width="80%">
      <div>
        <historical-records :ssmk="filessmk" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="班级选择" :visible.sync="dialogBjFormVisible" width="30%">
      <div>
        <span style="">提示：请选择该考卷的使用班级</span>
        <el-select v-model="rybjObj" placeholder="请选择该考卷的使用班级" @change="chooseBjChange" >
          <el-option
            v-for="item in bjclassList "
            :key="item.id"
            :label="item.rybjmc"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBjFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBjidBtn">确 定</el-button>
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
import {
  listJfzlFile,
  getJfzlFile,
  delJfzlFile,
  addJfzlFile,
  updateJfzlFile
} from "@/api/basic/jfzlFile";
  import { listBjclass } from "@/api/basic/bjclass";
import { getToken } from "@/utils/auth";
import { addImg, selectFileList, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
export default {
  name: "JfzlFile",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      importBtn: false,
      fullscreenLoading: false,
      // 日语班级对象
      rybjObj:null,
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
      // 教辅资料表格数据
      jfzlFileList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 适用范围字典
      syfwOptions: [],
      // 课程进度字典
      kcjdOptions: [],
      statusOptions:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        syfw: null,
        bookName: null,
        kcjd: null,
        zlbt: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        syfw: [{ required: true, message: "必填项", trigger: "change" }],
        bookName: [{ required: true, message: "必填项", trigger: "blur" }],
        kcjd: [{ required: true, message: "必填项", trigger: "change" }],
        zlbt: [{ required: true, message: "必填项", trigger: "blur" }],
        dataOrder:[{ required: true, message: "必填项", trigger: "blur" }],
        status:[{ required: true, message: "必填项", trigger: "change" }],
      },
      // 导入参数
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "上传",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/file/upload"
      },
      // 文件id数组
      wjidFile: [],
      // 最多上传的文件数量
      maxUploadNum: 1,
      progressData: {},
      // 文件所属模块
      filessmk: "教辅资料",
      dialogFormVisible: false,
      // 考卷文件数组
      kjidFile:[],
      // 考试试卷查询参数
      examQueryParams:{
        bjid:null,
        ksfw:null
      },
      // 班级数据集合
      bjclassList:[],
      // 选择日语班级的对话框
      dialogBjFormVisible:false,
      // 文件对象
      fileObj:null,
      // 考卷对象
      examForm:{},
    };
  },
  created() {
    this.getList();
    this.getDicts("jfzl-syfw").then(response => {
      this.syfwOptions = response.data;
    });
    this.getDicts("jfzl-kcjd").then(response => {
      this.kcjdOptions = response.data;
    });
    this.getDicts("isOrNot").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    // 选择课程进度后
    kcjdChange(val){
      console.log("val:",val)
    },
    /** 查询教辅资料列表 */
    getList() {
      this.loading = true;
      listJfzlFile(this.queryParams).then(response => {
        this.jfzlFileList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //查看历史
    seeHistorical() {
      this.dialogFormVisible = true;
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
        syfw: [],
        bookName: null,
        kcjd: null,
        zlbt: null,
        wjid: null,
        remark: null,
        userId: null,
        userName: null,
        status: null,
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.wjidFile = [];
      this.kjidFile = [];
      this.reset();
      this.open = true;
      this.title = "添加教辅资料";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getJfzlFile(id).then(response => {
        this.form = response.data;
        this.form.syfw = this.form.syfw.split(",");
        this.wjidFile = this.ifNullToNewArray(response.data.wjidArr);
        this.kjidFile = this.ifNullToNewArray(response.data.kjidArr);
        this.open = true;
        this.title = "修改教辅资料";
      });
    },
    ifNullToNewArray(arr) {
      if (null == arr) {
        return [];
      }
      return arr;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.syfw = this.form.syfw.join(",");
          if (this.form.id != null) {
            updateJfzlFile(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addJfzlFile(this.form).then(response => {
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
      this.$confirm("是否确认删除选中的数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delJfzlFile(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(e => {
          console.log(e);
        });
    },

    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 课件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.ifFileLimit(fileList.length, " 个文件");
      this.upload.open = false;
      this.upload.isUploading = false;
      let data = response.data;
      data.kzzd1 = this.form.wjid || secretKey();
      this.form.wjid = data.kzzd1;
      addImg(data).then(res => {
        file.id = res.data.id;
        this.msgSuccess("文件上传成功");
        this.wjidFile = fileList;
      });
      this.$refs.upload.clearFiles();
    },
    // 考卷上传成功处理
    handleKjFileSuccess(response, file, fileList) {
      this.ifFileLimit(fileList.length, " 个文件");
      this.upload.open = false;
      this.upload.isUploading = false;
      let data = response.data;
      data.kzzd1 = this.form.kzzd1 || secretKey();
      this.form.kzzd1 = data.kzzd1;
      addImg(data).then(res => {
        file.id = res.data.id;
        this.msgSuccess("文件上传成功");
        this.kjidFile = fileList;
      });
      this.$refs.upload.clearFiles();
    },
    // 文件上传限制判断
    ifFileLimit(num, msg) {
      if (num >= this.maxUploadNum) {
        this.$message({
          message: "最多上传 " + this.maxUploadNum + msg,
          type: "warning"
        });
      }
    },
    //公共文件删除
    handleRemove(file, fileList) {
      deleteImg(file.id).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    // 下载文件且添加试卷
    downloadAndAddExam(row,item){
      let num=row.zlbt.indexOf("第")
      if(num<0){
        this.msgError("提示:该考卷无法下载，请联系管理员修改【资料标题】,该标题中必须包含“第”字")
        return
      }
      let ksfw=row.zlbt.substr(num,row.zlbt.length)
      this.rybjObj=null
      this.examQueryParams.ksfw=ksfw // 考试范围
      this.fileObj=item  // 文件对象
      listBjclass().then(res => {
        this.bjclassList=res.rows
        this.resetExamForm() // 清空考卷对象
        this.examForm.ksfw=ksfw
        if(res.total>1){// 当有两个以上的班级
          this.dialogBjFormVisible=true
        }else if(res.total==1){ // 当只有一个班级
          let obj=res.rows[0]
          this.examQueryParams.bjid=obj.id // 班级id
          this.examForm.bjid=obj.id
          this.examForm.bjmc=obj.rybjmc // 日语班级名称
          this.examForm.jcid=obj.jcid // 教材id
          this.examForm.jcmc=obj.jcmc // 教材名称
          this.getExaminationPaperList()
          this.downloadFileName(this.fileObj)
        }
      });
    },
    // 获取考试试卷数据
    getExaminationPaperList(){
      listExaminationPaper(this.examQueryParams).then(res => {
        if(res.total<1){
          addExaminationPaper(this.examForm).then(res => {
            this.msgSuccess("考卷新增成功");
          });
        }
      });
    },
    // 选择班级后触发
    chooseBjChange(obj){
      this.rybjObj=obj
      this.examForm.bjid=obj.id // 班级id
      this.examForm.bjmc=obj.rybjmc // 日语班级名称
      this.examForm.jcid=obj.jcid // 教材id
      this.examForm.jcmc=obj.jcmc // 教材名称
    },
    // 提交选择班级的对话框
    submitBjidBtn(){
      if(this.rybjObj){
        this.examQueryParams.bjid=this.rybjObj.id
        this.getExaminationPaperList()
        this.downloadFileName(this.fileObj)
        this.dialogBjFormVisible=false // 隐藏对话框
      }else{
        this.msgError("提示：请选择该考卷的使用班级 ");
      }
    },
    /** 下载操作 */
    downloadFileName(item) {
      this.progressData = {
        url: "file/filetable/download",
        params: {
          ssmk: this.filessmk,
          wjmc: item.wjmc
        },
        filename: item.wjmc
      };
      this.$nextTick(() => {
        this.$refs.progress.download();
      });
    },
    callBack(data) {
      console.log("data:", data);
    },
    resetExamForm(){
      this.examForm={
        id: null,
        bjid: null,
        bjmc: null,
        lsid: this.$store.state.user.glrid,
        kslx: "1",
        ksnr: null,
        ksfw: null,
        jcid: null,
        jcmc: null,
        jwsjzt: "1",// 老师试卷状态:其他试卷
        lssjzt: "4",// //教务试卷状态:默认已发送
        kskssj: null,
        ksjssj: null,
        kssjwb: null,
        fssj: null,
        fsrid: null,
        fsrmc: null,
        status: "1",
        remark: "下载考卷后系统自动添加的其他试卷",
        dataOrder: null,
        addOrUpdateTime: null,
        kzzd1: null,
        kzzd2: "1",// 未上传考试成绩
        kzzd3: null,
        kzzd4: null,
        kzzd5: null
      }
    },
  }
};
</script>
