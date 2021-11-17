<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="班级" prop="bjid">
        <el-select v-model="queryParams.bjid" filterable placeholder="请选择班级">
          <el-option
            v-for="item in bjclassList "
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师姓名" prop="lsxm" v-if="this.$store.state.user.dataRoleWeightId != 50">
        <el-input
          v-model="queryParams.lsxm"
          placeholder="请输入老师姓名(可模糊查询)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作业类型" prop="zylx">
        <el-select v-model="queryParams.zylx" placeholder="请选择作业类型" clearable size="small">
          <el-option
            v-for="dict in zylxOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="作业主题" prop="zyzt">
        <el-input
          v-model="queryParams.zyzt"
          placeholder="请输入作业主题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="时间" prop="dateArr">
        <el-date-picker
          v-model="dateArr"
          type="daterange"
          align="right"
          unlink-panels
          @change="changeDataArr"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
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
          v-hasPermi="['basic:homework:add']"
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
          v-hasPermi="['basic:homework:edit']"
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
          v-hasPermi="['basic:homework:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :height="$root.tableHeight"
      border
      :data="homeworkList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="班级id" align="center" prop="bjid" v-if="false" />
      <el-table-column label="老师id" align="center" prop="lsid" v-if="false" />
      <el-table-column label="班级名称" align="center" prop="bjmc" />
      <el-table-column label="老师姓名" align="center" prop="lsxm" />
      <el-table-column label="作业类型" align="center" prop="zylx">
        <template slot-scope="scope">
          <dict-tag :options="zylxOptions" :value="scope.row.zylx" />
        </template>
      </el-table-column>
      <el-table-column label="作业主题" align="center" prop="zyzt" />
      <el-table-column label="作业内容" align="center" prop="zynr">
        <template slot-scope="scope">
          <div v-html="scope.row.zynr"></div>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark">
        <template slot-scope="scope">
          <div v-html="scope.row.remark"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleAdd(scope.row)"
            v-hasPermi="['basic:homework:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDetails(scope.row)"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:homework:remove']"
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

    <!-- 添加或修改作业日志对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班级id" prop="bjid">
          <el-input v-model="form.bjid" placeholder="请输入班级id" />
        </el-form-item>
        <el-form-item label="老师id" prop="lsid">
          <el-input v-model="form.lsid" placeholder="请输入老师id" />
        </el-form-item>
        <el-form-item label="作业类型" prop="zylx">
          <el-select v-model="form.zylx" placeholder="请选择作业类型">
            <el-option
              v-for="dict in zylxOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业主题" prop="zyzt">
          <el-input v-model="form.zyzt" placeholder="请输入作业主题" />
        </el-form-item>
        <el-form-item label="作业内容">
          <editor v-model="form.zynr" :min-height="192" />
        </el-form-item>
        <el-form-item label="图片id">
          <imageUpload v-model="form.tpid" />
        </el-form-item>
        <el-form-item label="备注">
          <editor v-model="form.remark" :min-height="192" />
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
import {
  listHomework,
  getHomework,
  delHomework,
  addHomework,
  updateHomework
} from "@/api/basic/homework";
import { getToken } from "@/utils/auth";
import { listBjclass } from "@/api/basic/bjclass";
import { parseTime } from "@/utils/ruoyi";

export default {
  name: "Homework",
  components: {},
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },

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
      // 作业日志表格数据
      homeworkList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 作业类型字典
      zylxOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bjid: null,
        lsid: this.$store.state.user.glrid,
        lsxm: null,
        zylx: null,
        zyzt: null,
        zynr: null,
        ksrq: null,
        jzrq: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        zylx: [
          { required: true, message: "作业类型不能为空", trigger: "change" }
        ],
        zyzt: [
          { required: true, message: "作业主题不能为空", trigger: "blur" }
        ],
        zynr: [{ required: true, message: "作业内容不能为空", trigger: "blur" }]
      },
      // 日期范围
      dateArr: [],
      // 班级选择
      bjclassList: []
    };
  },
  created() {
    this.getDicts("homework_type").then(response => {
      this.zylxOptions = response.data;
    });
    listBjclass().then(response => {
      this.bjclassList = response.rows;
      // 日语班级选项 -当老师角色登录
      if (this.$store.state.user.dataRoleWeightId == 50) {
        if (response.rows.length == 1) {
          this.queryParams.bjid = response.rows[0].id;
        }
      }
    });
    this.getList();
  },
  methods: {
    changeDataArr(date) {
      this.queryParams.ksrq = parseTime(date[0], "{y}-{m}-{d}");
      this.queryParams.jzrq = parseTime(date[1], "{y}-{m}-{d}");
    },
    /** 查询作业日志列表 */
    getList() {
      this.loading = true;
      listHomework(this.queryParams).then(response => {
        this.homeworkList = response.rows;
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
        bjid: null,
        lsid: null,
        zylx: null,
        zyzt: null,
        zynr: null,
        zdxsid: null,
        tpid: null,
        remark: null,
        userId: null,
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
    handleAdd(row) {
      // this.reset();
      // this.open = true;
      // this.title = "添加作业日志";
      this.getConfigKey("task-log-edi").then(res => {
        this.router = res.msg;
        this.$router.push({
          path: this.router,
          query: row
        });
      });
    },
    handleDetails(row) {
      this.getConfigKey("task-log-details").then(res => {
        this.$router.push({
          path: res.msg,
          query: row
        });
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getHomework(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改作业日志";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHomework(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHomework(this.form).then(response => {
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
          return delHomework(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>
