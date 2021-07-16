<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="校区名称" prop="xqmc">
        <el-select
          v-model="queryParams.xqmc"
          :disabled="xqmcDisabled"
          placeholder="请选择校区名称"
          @change="xqmcOnChange"
          filterable
        >
          <el-option v-for="item in selectXqmc" :key="item.id" :label="item.xxmc" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日语班级" prop="kzzd1">
        <el-select
          v-model="queryParams.kzzd1"
          :disabled="rybjDisabled"
          placeholder="请选择日语班"
          @change="rybjOnChange"
          filterable
        >
          <el-option
            v-for="item in bjclassList"
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学生姓名" prop="xsbh">
        <el-select
          v-model="queryParams.xsbh"
          filterable
          remote
          reserve-keyword
          :disabled="xsbhDisabled"
          :remote-method="chooseStudents"
          placeholder="请选择/搜索学生"
        >
          <el-option
            v-for="item in studentsList"
            :key="item.id"
            :label="item.xsxm"
            :value="item.xsbh"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试类型" prop="kslx">
        <el-select
          v-model="queryParams.kslx"
          placeholder="请选择考试类型"
          multiple
        >
          <el-option
            v-for="dict in getExaminationType"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="文理" prop="wl">
        <el-input
          v-model="queryParams.wl"
          placeholder="请输入文理"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button type="primary" size="mini" @click="getWhole">全部</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--<el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basic:stugrade:add']"
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
          v-hasPermi="['basic:stugrade:edit']"
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
          v-hasPermi="['basic:stugrade:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['basic:stugrade:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <div>
      <el-table
        :data="listAll"
        border
        :summary-method="getSummaries"
        show-summary
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column
          :fixed="item.fixed"
          :label="item.label"
          align="center"
          v-for="(item,index) in columnNameList"
          :key="index"
          :prop="item.prop"
        >
          <template slot-scope="scope">
            <span
              v-if="item.prop == 'xsxm' || item.prop == 'rybj'  || item.prop == 'zhcj'">{{scope.row[item.prop]}}</span>
            <span
              v-else-if="item.prop == 'wl'">
                <dict-tag :options="wlOption" :value="scope.row[item.prop]"/>
            </span>
            <div v-else>
              <div
                v-if="scope.row[item.colour] == 1"
                style="background : #67C23A; display : inline-block ; width :100%;color : #fff"
              >{{scope.row[item.prop]}}
              </div>
              <span
                v-if="scope.row[item.colour] == 2"
                style="background : #E6A23C; display : inline-block ; width :100%;color : #fff"
              >{{scope.row[item.prop]}}</span>
              <span
                v-if="scope.row[item.colour] == 3"
                style="background : red; display : inline-block ; width :100%;color : #fff"
              >{{scope.row[item.prop]}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="totalNum">
        <span>共{{total}}条</span>
      </div>
    </div>

    <!-- 成绩分析 -->
    <chart ref="chart" v-if="allData" :query="queryParams"/>

    <!-- 添加或修改学生成绩基础表对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生编号" prop="xsbh">
          <el-input v-model="form.xsbh" placeholder="请输入学生编号"/>
        </el-form-item>
        <el-form-item label="学生姓名" prop="xsxm">
          <el-input v-model="form.xsxm" placeholder="请输入学生姓名"/>
        </el-form-item>
        <el-form-item label="日语班级" prop="rybj">
          <el-input v-model="form.rybj" placeholder="请输入日语班级"/>
        </el-form-item>
        <el-form-item label="文理" prop="wl">
          <el-input v-model="form.wl" placeholder="请输入文理"/>
        </el-form-item>
        <el-form-item label="英语分数" prop="yyfs">
          <el-input v-model="form.yyfs" placeholder="请输入英语分数"/>
        </el-form-item>
        <el-form-item label="综合成绩" prop="zhcj">
          <el-input v-model="form.zhcj" placeholder="请输入综合成绩"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
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
          <el-checkbox v-model="upload.updateSupport"/>
          是否更新已经存在的数据
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
  import {
    listStugrade,
    getStugrade,
    delStugrade,
    addStugrade,
    updateStugrade,
    listAll,
    getColumnNameList
  } from "@/api/basic/stugrade";
  import {listBjclass} from "@/api/basic/bjclass";
  import {listSchool} from "@/api/basic/school";
  import {getToken} from "@/utils/auth";
  import {listStudent} from "@/api/basic/student";
  import chart from "./chart";

  export default {
    name: "Stugrade",
    components: {},
    data() {
      return {
        // 所有数据详细数据切换
        allData: false,
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
        // 学生成绩基础表表格数据
        stugradeList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 状态字典
        statusOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          xqmc: null,
          xsxm: null,
          rybj: null,
          kzzd1: null,
          kslx: [],
          wl: null,
          status: null
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
          title: "导入学生成绩基础表数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: {Authorization: "Bearer " + getToken()},
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/basic/stugrade/importData"
        },
        rules: {
          yyfs: [
            {
              required: false,
              message: "格式不对,只能填写数字",
              trigger: "blur",
              pattern: /^[0-9]+$/
            }
          ],
          zhcj: [
            {
              required: false,
              message: "格式不对,只能填写数字",
              trigger: "blur",
              pattern: /^[0-9]+$/
            }
          ]
        },
        // 动态table-column
        columnNameList: [],
        // 获取学生成绩表
        listAll: [],
        //校区名称字典
        selectXqmc: [],
        // 日语班级字典
        bjclassList: [],
        // 学生list
        studentsList: [],
        xqmcDisabled: false,
        rybjDisabled: true,
        xsbhDisabled: true,
        //  考试类型
        getExaminationType: [],
        wlOption:[],
        importBtn:false,
        fullscreenLoading:false
      };
    },
    created() {
      this.getDicts("basic_status").then(response => {
        this.statusOptions = response.data;
      });
      this.getDicts("examination_type").then(response => {
        this.getExaminationType = response.data;
      });
      this.getDicts("xkType").then(response => {
        this.wlOption = response.data;
      });
    },
    components: {
      chart
    },
    mounted() {
      // this.getList();
      this.getListSchool();
    },
    methods: {
      arrToStr(array) {
      let str = "";
      for (let i = 0; i < array.length; i++) {
        str += array[i] + ",";
      }
      str=str.substr(0, str.length - 1);
      return str;
    },
      // 获取校区
      getListSchool() {
        listSchool().then(response => {
          this.selectXqmc = response.rows;
        });
      },
      /** 查询学生成绩基础表列表 */
      async getList() {
        this.loading = true;
        let one=this.queryParams.kslx;
        if (undefined != one && one.length > 0) {
        one = this.arrToStr(one);
       }
        let listAllJson = {
          xsbh: this.queryParams.xsbh,
          kzzd1: this.queryParams.kzzd1,
           xqmc: this.queryParams.xqmc,
           xsxm: this.queryParams.xsxm,
           kslx: one,
        };

        // 学生成绩表数据
        let res = await listAll(listAllJson);
        if (res.rows && res.rows.length > 0) {
          this.listAll = res.rows;
          this.total = res.total;
          this.listAll.forEach(value => {
            if (value.xsbh == this.queryParams.xsbh) {
              this.allData = true;
              this.allData ? this.monitor() : null;
            }
          });
        } else {
          if (!this.queryParams.xsxm) {
            return;
          }
          this.$notify.error({
            title: "错误",
            message: `不存在编号为"${this.queryParams.xsbh}"的学生`
          });
        }
        // 学生成绩表title列
        getColumnNameList(listAllJson).then(res => {
          this.columnNameList = res.data;
          for (let i = 0; i < 5; i++) {
            this.columnNameList[i].fixed = true;
          }
        });
      },
      // 组件加载完毕成功后执行
      monitor() {
        this.$nextTick(() => {
          if (this.$refs.chart) {
            this.$refs.chart.getChart();
          }
        });
      },
      // 状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },
      xqmcOnChange(id) {
        listBjclass({kzzd1: id}).then(response => {
          this.bjclassList = response.rows;
        });
        this.queryParams.kzzd1 = null;
        this.rybjDisabled = false;
      },
      rybjOnChange(id) {
        this.xsbhDisabled = false;
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
          xsbh: null,
          xsxm: null,
          rybj: null,
          wl: null,
          yyfs: null,
          zhcj: null,
          status: "1",
          remark: null,
          userId: null,
          uName: null,
          orgBh: null,
          orgName: null,
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
        if(this.queryParams.kzzd1==null||this.queryParams.xqmc==null){
          this.msgError("请选择校区和班级后再查询");
          return;
        }
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.rybjDisabled = true;
        this.xsbhDisabled = true;
        this.resetForm("queryForm");

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
        this.title = "添加学生成绩基础表";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getStugrade(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改学生成绩基础表";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateStugrade(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addStugrade(this.form).then(response => {
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
        this.$confirm(
          '是否确认删除学生成绩基础表编号为"' + ids + '"的数据项?',
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(function () {
            return delStugrade(ids);
          })
          .then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          });
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download(
          "basic/stugrade/export",
          {
            ...this.queryParams
          },
          `学生成绩基础表.xlsx`
        );
      },
      /** 导入按钮操作 */
      handleImport() {
        this.importBtn=false
        this.upload.title = "学生成绩基础表数据导入";
        this.upload.open = true;
        this.$nextTick(() => {
          // 页面元素加载完成后执行该方法
          this.$refs.upload.clearFiles();
        });
      },
      /** 下载模板操作 */
      importTemplate() {
        this.download(
          "basic/stugrade/importTemplate",
          {
            ...this.queryParams
          },
          `学生成绩基础表-导入模板.xlsx`
        );
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(res, file, fileList) {
        if(undefined!=res.code&&res.code==200){
          this.notify()
          this.getList();
          this.msgSuccess(res.msg)
        }else{
          this.notify()
          this.msgError(res.msg)
        }
      },
      notify(){
        this.fullscreenLoading = false;
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$nextTick(() => {
          // 页面元素加载完成后执行该方法
          this.$refs.upload.clearFiles();
        });
      },
      // 提交上传文件
      submitFileForm() {
        this.importBtn=true
        this.fullscreenLoading = true;
        this.$refs.upload.submit();
      },
      // 全部按钮
      getWhole() {
        (this.queryParams = {
          pageNum: 1,
          pageSize: 10,
          xsxm: null,
          rybj: null,
          kzzd1: null,
          wl: null,
          status: null
        }),
          (this.studentsList = null);
        this.getList();
        this.allData = false;
        this.rybjDisabled = true;
        this.xsbhDisabled = true;
      },
      // 平均数
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = "平均分";
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += "分";
          } else {
            sums[index] = "N/A";
          }
        });
        for (let i = 1; i < 3; i++) {
          sums[i] = "";
        }
        for (let i = 3; i < sums.length; i++) {
          sums[i] = (parseInt(sums[i]) / this.listAll.length).toFixed(2) + "分";
        }
        return sums;
      },
      // 搜索学生
      chooseStudents(xsxm) {
        this.queryParams.xsxm = xsxm;
        let json = {
          kzzd1: this.queryParams.kzzd1,
          xsxm: this.queryParams.xsxm
        };
        // 学生基础数据表
        listStudent(json).then(res => {
          this.studentsList = res.rows;
        });
      }
    }
  };
</script>
<style lang="scss">
  .totalNum {
    height: 50px;
    line-height: 50px;
    margin-right: 20px;
    font-size: 16px;
    font-weight: 200;
    float: right;
  }
</style>
