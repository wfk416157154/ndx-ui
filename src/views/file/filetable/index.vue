<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文件名称" prop="wjmc">
        <el-input
          v-model="queryParams.wjmc"
          placeholder="请输入文件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件路径" prop="wjlj">
        <el-input
          v-model="queryParams.wjlj"
          placeholder="请输入文件路径"
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
          v-hasPermi="['file:filetable:add']"
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
          v-hasPermi="['file:filetable:edit']"
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
          v-hasPermi="['file:filetable:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['file:filetable:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="filetableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" v-if="false" />
      <el-table-column label="文件名称" align="center" prop="wjmc" />
      <el-table-column label="文件大小" align="center" prop="wjdx" />
      <el-table-column label="文件路径" align="center" prop="wjlj" />
      <el-table-column label="上传时间" align="center" prop="scsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.scsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="录入或修改人ID" align="center" prop="userId" />
      <el-table-column label="录入或修改人名称" align="center" prop="uName" />
      <el-table-column label="录入或修改人机构号" align="center" prop="orgBh" />
      <el-table-column label="录入或修改人机构名称" align="center" prop="orgName" />
      <el-table-column label="排序号" align="center" prop="dataOrder" />
      <el-table-column label="修改或录入时间" align="center" prop="addOrUpdateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addOrUpdateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['file:filetable:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['file:filetable:remove']"
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

    <!-- 添加或修改文件表对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文件名称" prop="wjmc">
          <el-input v-model="form.wjmc" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item label="文件大小" prop="wjdx">
          <el-input v-model="form.wjdx" placeholder="请输入文件大小" />
        </el-form-item>
        <el-form-item label="文件路径" prop="wjlj">
          <el-input v-model="form.wjlj" placeholder="请输入文件路径" />
        </el-form-item>
        <el-form-item label="上传时间" prop="scsj">
          <el-date-picker clearable size="small"
            v-model="form.scsj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择上传时间">
          </el-date-picker>
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
        <el-form-item label="录入或修改人ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入录入或修改人ID" />
        </el-form-item>
        <el-form-item label="录入或修改人名称" prop="uName">
          <el-input v-model="form.uName" placeholder="请输入录入或修改人名称" />
        </el-form-item>
        <el-form-item label="录入或修改人机构号" prop="orgBh">
          <el-input v-model="form.orgBh" placeholder="请输入录入或修改人机构号" />
        </el-form-item>
        <el-form-item label="录入或修改人机构名称" prop="orgName">
          <el-input v-model="form.orgName" placeholder="请输入录入或修改人机构名称" />
        </el-form-item>
        <el-form-item label="排序号" prop="dataOrder">
          <el-input v-model="form.dataOrder" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="修改或录入时间" prop="addOrUpdateTime">
          <el-date-picker clearable size="small"
            v-model="form.addOrUpdateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择修改或录入时间">
          </el-date-picker>
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
import { listFiletable, getFiletable, delFiletable, addFiletable, updateFiletable } from "@/api/file/filetable";

export default {
  name: "Filetable",
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
      // 文件表表格数据
      filetableList: [],
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
        wjmc: null,
        wjlj: null,
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
    this.getDicts("sys_common_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询文件表列表 */
    getList() {
      this.loading = true;
      listFiletable(this.queryParams).then(response => {
        this.filetableList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        wjmc: null,
        wjdx: null,
        wjlj: null,
        scsj: null,
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
      this.title = "添加文件表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFiletable(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改文件表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFiletable(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFiletable(this.form).then(response => {
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
      this.$confirm('是否确认删除文件表编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFiletable(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('file/filetable/export', {
        ...this.queryParams
      }, `file_filetable.xlsx`)
    }
  }
};
</script>
