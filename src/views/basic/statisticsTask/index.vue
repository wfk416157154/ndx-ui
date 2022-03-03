<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="统计月份" prop="tjyf">
        <el-date-picker v-model="queryParams.tjyf" type="month" value-format="yyyy-MM" placeholder="月份"></el-date-picker>
      </el-form-item>
      <el-form-item label="文件名称" prop="wjmc">
        <el-input
          v-model="queryParams.wjmc"
          placeholder="请输入文件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="处理状态" prop="clzt">
        <el-select v-model="queryParams.clzt" placeholder="请选择处理状态" clearable size="small">
          <el-option
            v-for="dict in clztOptions"
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
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basic:statisticsTask:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          v-if="false"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basic:statisticsTask:edit']"
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
          v-hasPermi="['basic:statisticsTask:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :height="$root.tableHeight" border :data="statisticsTaskList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" v-if="false" />
      <el-table-column label="统计月份" align="center" prop="tjyf" />
      <el-table-column label="老师姓名" align="center" prop="lsxm" />
      <el-table-column label="文件下载(点击文件)" align="center" prop="wjmc" >
        <template slot-scope="scope">
          <el-link
            v-if="'1'==scope.row.clzt"
            type="danger"
            size="mini"
            icon="el-icon-bottom"
            @click="downloadFileName(scope.row.wjlj)"
          >{{scope.row.wjmc}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" align="center" prop="clzt" >
        <template slot-scope="scope">
          <dict-tag :options="clztOptions" :value="scope.row.clzt" />
        </template>
      </el-table-column>
      <el-table-column label="执行时间" align="center" prop="zxsj" width="180">
        <template slot-scope="scope">
          {{parseTime(scope.row.zxsj,'{y}-{m}-{d} {h}:{i}:{s}')}}
        </template>
      </el-table-column>
      <el-table-column label="完成时间" align="center" prop="wcsj" width="180">
        <template slot-scope="scope">
          {{parseTime(scope.row.wcsj,'{y}-{m}-{d} {h}:{i}:{s}')}}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template slot-scope="scope">
          <span v-if="'1'==scope.row.status">立即执行</span>
          <span v-else>定时执行</span>
        </template>
      </el-table-column>
      <el-table-column label="提交人ID" align="center" prop="userId" v-if="false" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="false"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:statisticsTask:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:statisticsTask:remove']"
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

    <!-- 添加或修改老师日志考勤结果统计任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="何时执行" label-width="80px">
          <el-radio-group v-model="form.status" @change="chooseInvokeType">
            <el-radio :label="1">立即执行</el-radio>
            <el-radio :label="2">定时执行</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="执行时间" prop="zxsj" v-if="invokeFlag">
          <el-date-picker v-model="form.zxsj" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择具体执行时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="统计月份" prop="tjyf">
          <el-date-picker v-model="form.tjyf" type="month" value-format="yyyy-MM" placeholder="月份"></el-date-picker>
        </el-form-item>
        <el-form-item label="届数" label-width="80px">
          <el-input v-model="teacherFrom.rybjmc" @input="getTeacher" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="老师姓名" label-width="80px">
          <el-input v-model="teacherFrom.lsxm" @input="getTeacher" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择老师" label-width="80px">
          <el-button v-model="chooseAll" @click="getTeacher" type="success" size="mini" icon="el-icon-check" >勾选全部</el-button>
          <el-checkbox-group v-model="teacherCheckbox">
            <el-checkbox
              :label="item.id"
              v-for="(item,index) in teacherList"
              :key="index"
            >{{item.lsxm}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>


</template>

<script>
import { listStatisticsTask, getStatisticsTask, delStatisticsTask, addStatisticsTask, updateStatisticsTask } from "@/api/basic/statisticsTask";
import { getToken } from "@/utils/auth";
import { listTeacher } from "@/api/basic/teacher";
export default {
  name: "StatisticsTask",
  components: {
  },
  data() {
    return {
      chooseAll:null,
      // 遮罩层
      loading: true,
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
      // 老师日志考勤结果统计任务表格数据
      statisticsTaskList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tjyf: null,
        lsxm: null,
        wjmc: null,
        clzt: null,
        zxsj: null,
        wcsj: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        zxsj:[{ required: true, message: "执行时间不能为空", trigger: "blur" }],
        tjyf:[{ required: true, message: "统计月份不能为空", trigger: "blur" }],
      },
      // 处理状态-码表
      clztOptions:[],
      teacherList: [],
      // 选择的老师
      teacherCheckbox: [],
      teacherFrom: {
        kzzd4:"1" // 默认查询在职状态的老师
      },
      invokeFlag:false,// 默认为 立即执行
    };
  },
  created() {
    this.getList();
    this.getDicts("lskq-clzt").then(response => {
      this.clztOptions = response.data;
    });
  },
  methods: {
    /** 查询老师日志考勤结果统计任务列表 */
    getList() {
      this.loading = true;
      listStatisticsTask(this.queryParams).then(response => {
        this.statisticsTaskList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 选择调用方式
    chooseInvokeType(val){
      if("1"==val){
        this.invokeFlag=false
      }else{
        this.invokeFlag=true
        this.form.zxsj=null
      }
    },
    // 获取查询的老师信息
    getTeacher() {
      this.teacherCheckbox = [];
      listTeacher(this.teacherFrom).then(response => {
        this.teacherList = response.rows;
        this.teacherList.forEach(value => {
          this.teacherCheckbox.push(value.id);
        });
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.invokeFlag=false
      this.teacherCheckbox = [];
      this.form = {
        id: null,
        tjyf: null,
        lsid: null,
        lsxm: null,
        wjlj: null,
        wjmc: null,
        clzt: "0",// 默认待处理
        zxsj: null,
        wcsj: null,
        userId: null,
        status: 1,// 默认 立即执行
        dataOrder: null,
        createTime: null,
        kzzd1: null,
        kzzd2: null
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
      this.title = "添加老师日志考勤结果统计任务";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStatisticsTask(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改老师日志考勤结果统计任务";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.teacherCheckbox.length>0){
            this.form.lsid=this.teacherCheckbox.join(",");
          }else{
            this.msgError("请选择一个老师进行日志考勤统计！")
            return
          }
          if (this.form.id != null) {
            updateStatisticsTask(this.form).then(response => {
                if(200==response.code){
                    this.getList();
                    this.msgSuccess(response.msg);
                }else{
                    this.msgError(response.msg);
                }
              this.open = false;
              this.getList();
            });
          } else {
            addStatisticsTask(this.form).then(response => {
                if(200==response.code){
                    this.getList();
                    this.msgSuccess(response.msg);
                }else{
                    this.msgError(response.msg);
                }
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
          return delStatisticsTask(ids);
        }).then((res) => {
            if(200==res.code){
                this.getList();
                this.msgSuccess("删除成功");
            }else{
                this.msgError("删除失败");
            }
        }).catch((e)=>{
          console.log(e);
      })

    },
    /** 下载按钮操作 */
    downloadFileName(wjlj) {
      this.$confirm('是否下载文件?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        window.open(wjlj)
      }).catch((e)=>{
        console.log(e);
      })

    },



  }
};
</script>
