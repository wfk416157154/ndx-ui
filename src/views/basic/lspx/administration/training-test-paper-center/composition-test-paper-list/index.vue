<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="试卷名称" prop="sjmc">
        <el-input
          v-model="queryParams.sjmc"
          placeholder="请输入试卷名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="视频类别" prop="splb">
        <el-select v-model="queryParams.splb" placeholder="请选择视频类别" clearable size="small">
          <el-option
            v-for="dict in splbOptions"
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
          v-hasPermi="['basic:trainPaper:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basic:trainPaper:edit']"
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
          v-hasPermi="['basic:trainPaper:remove']"
      >删除</el-button>-->
      <!-- </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :height="$root.tableHeight"
      border
      :data="trainPaperList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="id" align="center" prop="id" /> -->
      <el-table-column label="试卷名称" align="center" prop="sjmc" />
      <el-table-column label="视频类别" align="center" prop="splb">
        <template slot-scope="scope">
          <dict-tag :options="splbOptions" :value="scope.row.splb" />
        </template>
      </el-table-column>
      <el-table-column label="试卷满分" align="center" prop="sjmf" />
      <el-table-column label="考试时长(分钟)" align="center" prop="kssc" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:trainPaper:edit']"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:trainPaper:remove']"
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

    <!-- 添加或修改培训试卷对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="试卷名称" prop="sjmc">
          <el-input v-model="form.sjmc" placeholder="请输入试卷名称" />
        </el-form-item>
        <el-form-item label="视频类别" prop="splb">
          <el-select v-model="form.splb" placeholder="请选择视频类别">
            <el-option
              v-for="dict in splbOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试卷满分" prop="sjmf">
          <el-input v-model="form.sjmf" placeholder="请输入试卷满分" />
        </el-form-item>
        <el-form-item label="考试时长(分钟)" prop="kssc">
          <el-input v-model="form.kssc" placeholder="请输入考试时长(分钟)" />
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
  listTrainPaper,
  getTrainPaper,
  delTrainPaper,
  addTrainPaper,
  updateTrainPaper
} from "@/api/basic/trainPaper";
import { getToken } from "@/utils/auth";

export default {
  name: "TrainPaper",
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
      // 培训试卷表格数据
      trainPaperList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 视频类别字典
      splbOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sjmc: null,
        splb: null,
        sjmf: null,
        kssc: null,
        createTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
    this.getDicts("videoType").then(response => {
      this.splbOptions = response.data;
    });
  },
  methods: {
    /** 查询培训试卷列表 */
    getList() {
      this.loading = true;
      listTrainPaper(this.queryParams).then(response => {
        this.trainPaperList = response.rows;
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
        sjmc: null,
        splb: null,
        sjmf: null,
        kssc: null,
        userId: null,
        status: "0",
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加培训试卷";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      this.getConfigKey("edit-test-paper").then(res => [
        this.$router.push({
          path: res.msg,
          query: {
            id: row.id,
            name: "composition-test-paper-list"
          }
        })
      ]);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTrainPaper(this.form).then(response => {
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
            addTrainPaper(this.form).then(response => {
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
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认删除选中的数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delTrainPaper(ids);
        })
        .then(res => {
          if (200 == res.code) {
            this.getList();
            this.msgSuccess("删除成功");
          } else {
            this.msgError("删除失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>
