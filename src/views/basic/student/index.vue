<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="校区名称" prop="xqmc">
        <el-input
          v-model="queryParams.xqmc"
          placeholder="请输入校区名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="原班级" prop="ybj">
        <el-input
          v-model="queryParams.ybj"
          placeholder="请输入原班级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日语班" prop="ryb">
        <el-input
          v-model="queryParams.ryb"
          placeholder="请输入日语班"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学生姓名" prop="xsxm">
        <el-input
          v-model="queryParams.xsxm"
          placeholder="请输入学生姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="xb">
        <el-select v-model="queryParams.xb" placeholder="请选择性别" clearable size="small">
          <el-option
            v-for="dict in xbOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选科" prop="xk">
        <el-input
          v-model="queryParams.xk"
          placeholder="请输入选科"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否特长生" prop="sftcs">
        <el-select v-model="queryParams.sftcs" placeholder="请选择是否特长生" clearable size="small">
          <el-option
            v-for="dict in sftcsOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班主任姓名" prop="bzrxm">
        <el-input
          v-model="queryParams.bzrxm"
          placeholder="请输入班主任姓名"
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
          v-hasPermi="['basic:student:add']"
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
          v-hasPermi="['basic:student:edit']"
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
          v-hasPermi="['basic:student:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['basic:student:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="studentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="状态" align="center" prop="id" />
      <el-table-column label="学生头像" align="center" prop="xstx" />
      <el-table-column label="校区名称" align="center" prop="xqmc" />
      <el-table-column label="原班级" align="center" prop="ybj" />
      <el-table-column label="日语班" align="center" prop="ryb" />
      <el-table-column label="入班时间" align="center" prop="rbsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.rbsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退班时间" align="center" prop="tbsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.tbsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生编号" align="center" prop="xsbh" />
      <el-table-column label="学生姓名" align="center" prop="xsxm" />
      <el-table-column label="性别" align="center" prop="xb" :formatter="xbFormat" />
      <el-table-column label="选科" align="center" prop="xk" />
      <el-table-column label="英语分数" align="center" prop="yyfs" />
      <el-table-column label="综合分数" align="center" prop="zhfs" />
      <el-table-column label="QQ号" align="center" prop="qqh" />
      <el-table-column label="学生电话" align="center" prop="xsdh" />
      <el-table-column label="家庭住址" align="center" prop="jtzz" />
      <el-table-column label="是否特长生" align="center" prop="sftcs" :formatter="sftcsFormat" />
      <el-table-column label="家长姓名" align="center" prop="jzxm" />
      <el-table-column label="家长电话" align="center" prop="jzdh" />
      <el-table-column label="班主任姓名" align="center" prop="bzrxm" />
      <el-table-column label="班主任电话" align="center" prop="bzrdh" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:student:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:student:remove']"
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

    <!-- 添加或修改学生信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生头像" prop="xstx">
          <el-input v-model="form.xstx" placeholder="请输入学生头像" />
        </el-form-item>
        <el-form-item label="校区名称" prop="xqmc">
          <el-input v-model="form.xqmc" placeholder="请输入校区名称" />
        </el-form-item>
        <el-form-item label="原班级" prop="ybj">
          <el-input v-model="form.ybj" placeholder="请输入原班级" />
        </el-form-item>
        <el-form-item label="日语班" prop="ryb">
          <el-input v-model="form.ryb" placeholder="请输入日语班" />
        </el-form-item>
        <el-form-item label="入班时间" prop="rbsj">
          <el-date-picker clearable size="small"
            v-model="form.rbsj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择入班时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退班时间" prop="tbsj">
          <el-date-picker clearable size="small"
            v-model="form.tbsj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择退班时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学生编号" prop="xsbh">
          <el-input v-model="form.xsbh" placeholder="请输入学生编号" />
        </el-form-item>
        <el-form-item label="学生姓名" prop="xsxm">
          <el-input v-model="form.xsxm" placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.xb">
            <el-radio
              v-for="dict in xbOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选科" prop="xk">
          <el-input v-model="form.xk" placeholder="请输入选科" />
        </el-form-item>
        <el-form-item label="英语分数" prop="yyfs">
          <el-input v-model="form.yyfs" placeholder="请输入英语分数" />
        </el-form-item>
        <el-form-item label="综合分数" prop="zhfs">
          <el-input v-model="form.zhfs" placeholder="请输入综合分数" />
        </el-form-item>
        <el-form-item label="QQ号" prop="qqh">
          <el-input v-model="form.qqh" placeholder="请输入QQ号" />
        </el-form-item>
        <el-form-item label="学生电话" prop="xsdh">
          <el-input v-model="form.xsdh" placeholder="请输入学生电话" />
        </el-form-item>
        <el-form-item label="家庭住址" prop="jtzz">
          <el-input v-model="form.jtzz" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否特长生" prop="sftcs">
          <el-select v-model="form.sftcs" placeholder="请选择是否特长生">
            <el-option
              v-for="dict in sftcsOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="家长姓名" prop="jzxm">
          <el-input v-model="form.jzxm" placeholder="请输入家长姓名" />
        </el-form-item>
        <el-form-item label="家长电话" prop="jzdh">
          <el-input v-model="form.jzdh" placeholder="请输入家长电话" />
        </el-form-item>
        <el-form-item label="班主任姓名" prop="bzrxm">
          <el-input v-model="form.bzrxm" placeholder="请输入班主任姓名" />
        </el-form-item>
        <el-form-item label="班主任电话" prop="bzrdh">
          <el-input v-model="form.bzrdh" placeholder="请输入班主任电话" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
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
  </div>
</template>

<script>
import { listStudent, getStudent, delStudent, addStudent, updateStudent } from "@/api/basic/student";

export default {
  name: "Student",
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
      // 学生信息表格数据
      studentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 性别字典
      xbOptions: [],
      // 是否特长生字典
      sftcsOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xqmc: null,
        ybj: null,
        ryb: null,
        xsxm: null,
        xb: null,
        xk: null,
        sftcs: null,
        bzrxm: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_user_sex").then(response => {
      this.xbOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.sftcsOptions = response.data;
    });
    this.getDicts("basic_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询学生信息列表 */
    getList() {
      this.loading = true;
      listStudent(this.queryParams).then(response => {
        this.studentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 性别字典翻译
    xbFormat(row, column) {
      return this.selectDictLabel(this.xbOptions, row.xb);
    },
    // 是否特长生字典翻译
    sftcsFormat(row, column) {
      return this.selectDictLabel(this.sftcsOptions, row.sftcs);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
        xstx: null,
        xqmc: null,
        ybj: null,
        ryb: null,
        rbsj: null,
        tbsj: null,
        xsbh: null,
        xsxm: null,
        xb: "0",
        xk: null,
        yyfs: null,
        zhfs: null,
        qqh: null,
        xsdh: null,
        jtzz: null,
        sftcs: null,
        jzxm: null,
        jzdh: null,
        bzrxm: null,
        bzrdh: null,
        status: "0",
        remark: null,
        userId: null,
        uName: null,
        orgBh: null,
        orgName: null,
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
      this.title = "添加学生信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStudent(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStudent(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStudent(this.form).then(response => {
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
      this.$confirm('是否确认删除学生信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delStudent(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basic/student/export', {
        ...this.queryParams
      }, `basic_student.xlsx`)
    }
  }
};
</script>