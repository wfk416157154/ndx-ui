<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="老师" prop="lsxm">
        <el-input
          v-model="queryParams.lsxm"
          placeholder="请输入老师"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="试卷" prop="sjmc">
        <el-input
          v-model="queryParams.sjmc"
          placeholder="请输入试卷"
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

    <el-table
      v-loading="loading"
      :height="$root.tableHeight"
      border
      :data="trainGradeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="老师" align="center" prop="lsxm" />
      <el-table-column label="试卷名称" align="center" prop="sjmc" />
      <el-table-column label="客观题分值" align="center" prop="kgtfz" />
      <el-table-column label="试卷总分" align="center" prop="sjzf" />
      <el-table-column label="提交时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:trainGrade:edit']"
          >判 卷</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['basic:trainGrade:remove']"
          >查 看</el-button>
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

    <!-- 添加或修改培训试卷成绩对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="老师id" prop="lsid">
          <el-input v-model="form.lsid" placeholder="请输入老师id" />
        </el-form-item>
        <el-form-item label="试卷id" prop="sjid">
          <el-input v-model="form.sjid" placeholder="请输入试卷id" />
        </el-form-item>
        <el-form-item label="客观题分值" prop="kgtfz">
          <el-input v-model="form.kgtfz" placeholder="请输入客观题分值" />
        </el-form-item>
        <el-form-item label="试卷总分" prop="sjzf">
          <el-input v-model="form.sjzf" placeholder="请输入试卷总分" />
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
  listTrainGrade,
  getTrainGrade,
  delTrainGrade,
  addTrainGrade,
  updateTrainGrade
} from "@/api/basic/trainGrade";
import { getToken } from "@/utils/auth";

export default {
  name: "TrainGrade",
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
      // 培训试卷成绩表格数据
      trainGradeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        lsid: null,
        sjid: null,
        kgtfz: null,
        sjzf: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询培训试卷成绩列表 */
    getList() {
      this.loading = true;
      listTrainGrade(this.queryParams).then(response => {
        this.trainGradeList = response.rows;
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
        lsid: null,
        sjid: null,
        kgtfz: null,
        sjzf: null,
        userId: null,
        dataOrder: null,
        createTime: null,
        updateTime: null,
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加培训试卷成绩";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getTrainGrade(id).then(response => {
        this.form = response.data;
        this.getConfigKey("mark-exam-papers").then(res => {
          this.$router.push({
            path: res.msg,
            query: {
              list: JSON.stringify(this.form)
            }
          });
        });
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTrainGrade(this.form).then(response => {
              if (200 == response.code) {
                this.getList();
                this.msgSuccess(response.msg);
              } else {
                this.msgError(response.msg);
              }
              this.open = false;
              this.getList();
            });
          } else {
            addTrainGrade(this.form).then(response => {
              if (200 == response.code) {
                this.getList();
                this.msgSuccess(response.msg);
              } else {
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
    handleView(row) {
      this.getConfigKey("train-examination-details").then(res => {
        this.$router.push({
          path: res.msg,
          query: {
            item: JSON.stringify(row)
          }
        });
      });
    }
  }
};
</script>
