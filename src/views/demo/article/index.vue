<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文章标题" prop="articleTitle">
        <el-input
          v-model="queryParams.articleTitle"
          placeholder="请输入文章标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文章类型" prop="textType">
        <el-select v-model="queryParams.textType" placeholder="请选择文章类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="设定时间" prop="limitingTime">
        <el-input
          v-model="queryParams.limitingTime"
          placeholder="请输入设定时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="打字模式 " prop="typingPatterns">
        <el-input
          v-model="queryParams.typingPatterns"
          placeholder="请输入打字模式 "
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否启用 " prop="isEnable">
        <el-input
          v-model="queryParams.isEnable"
          placeholder="请输入是否启用 "
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ip最大填写次数" prop="ipMax">
        <el-input
          v-model="queryParams.ipMax"
          placeholder="请输入ip最大填写次数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户最大填写次数" prop="userMax">
        <el-input
          v-model="queryParams.userMax"
          placeholder="请输入用户最大填写次数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间 " prop="startTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择开始时间 ">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间 " prop="endTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择结束时间 ">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="录入或修改人ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入录入或修改人ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改或录入时间" prop="addOrUpdateTame">
        <el-date-picker clearable size="small"
          v-model="queryParams.addOrUpdateTame"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择修改或录入时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="录入或修改人机构号" prop="agency">
        <el-input
          v-model="queryParams.agency"
          placeholder="请输入录入或修改人机构号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序号" prop="dataOrder">
        <el-input
          v-model="queryParams.dataOrder"
          placeholder="请输入排序号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字段1" prop="kzzd1">
        <el-input
          v-model="queryParams.kzzd1"
          placeholder="请输入扩展字段1"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字段2" prop="kzzd2">
        <el-input
          v-model="queryParams.kzzd2"
          placeholder="请输入扩展字段2"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字段3" prop="kzzd3">
        <el-input
          v-model="queryParams.kzzd3"
          placeholder="请输入扩展字段3"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字段4" prop="kzzd4">
        <el-input
          v-model="queryParams.kzzd4"
          placeholder="请输入扩展字段4"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字段5" prop="kzzd5">
        <el-input
          v-model="queryParams.kzzd5"
          placeholder="请输入扩展字段5"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['demo:article:add']"
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
          v-hasPermi="['demo:article:edit']"
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
          v-hasPermi="['demo:article:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['demo:article:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="articleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="扩展字段5" align="center" prop="id" />
      <el-table-column label="文章标题" align="center" prop="articleTitle" />
      <el-table-column label="文章类型" align="center" prop="textType" />
      <el-table-column label="文章内容" align="center" prop="articleContents" />
      <el-table-column label="设定时间" align="center" prop="limitingTime" />
      <el-table-column label="打字模式 " align="center" prop="typingPatterns" />
      <el-table-column label="是否启用 " align="center" prop="isEnable" />
      <el-table-column label="ip最大填写次数" align="center" prop="ipMax" />
      <el-table-column label="用户最大填写次数" align="center" prop="userMax" />
      <el-table-column label="开始时间 " align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间 " align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="录入或修改人ID" align="center" prop="userId" />
      <el-table-column label="修改或录入时间" align="center" prop="addOrUpdateTame" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addOrUpdateTame, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="录入或修改人机构号" align="center" prop="agency" />
      <el-table-column label="排序号" align="center" prop="dataOrder" />
      <el-table-column label="扩展字段1" align="center" prop="kzzd1" />
      <el-table-column label="扩展字段2" align="center" prop="kzzd2" />
      <el-table-column label="扩展字段3" align="center" prop="kzzd3" />
      <el-table-column label="扩展字段4" align="center" prop="kzzd4" />
      <el-table-column label="扩展字段5" align="center" prop="kzzd5" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['demo:article:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['demo:article:remove']"
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

    <!-- 添加或修改文章主题对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文章标题" prop="articleTitle">
          <el-input v-model="form.articleTitle" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="文章类型" prop="textType">
          <el-select v-model="form.textType" placeholder="请选择文章类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="articleContents">
          <el-input v-model="form.articleContents" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="设定时间" prop="limitingTime">
          <el-input v-model="form.limitingTime" placeholder="请输入设定时间" />
        </el-form-item>
        <el-form-item label="打字模式 " prop="typingPatterns">
          <el-input v-model="form.typingPatterns" placeholder="请输入打字模式 " />
        </el-form-item>
        <el-form-item label="是否启用 " prop="isEnable">
          <el-input v-model="form.isEnable" placeholder="请输入是否启用 " />
        </el-form-item>
        <el-form-item label="ip最大填写次数" prop="ipMax">
          <el-input v-model="form.ipMax" placeholder="请输入ip最大填写次数" />
        </el-form-item>
        <el-form-item label="用户最大填写次数" prop="userMax">
          <el-input v-model="form.userMax" placeholder="请输入用户最大填写次数" />
        </el-form-item>
        <el-form-item label="开始时间 " prop="startTime">
          <el-date-picker clearable size="small"
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间 ">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间 " prop="endTime">
          <el-date-picker clearable size="small"
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间 ">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="录入或修改人ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入录入或修改人ID" />
        </el-form-item>
        <el-form-item label="修改或录入时间" prop="addOrUpdateTame">
          <el-date-picker clearable size="small"
            v-model="form.addOrUpdateTame"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择修改或录入时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="录入或修改人机构号" prop="agency">
          <el-input v-model="form.agency" placeholder="请输入录入或修改人机构号" />
        </el-form-item>
        <el-form-item label="排序号" prop="dataOrder">
          <el-input v-model="form.dataOrder" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="扩展字段1" prop="kzzd1">
          <el-input v-model="form.kzzd1" placeholder="请输入扩展字段1" />
        </el-form-item>
        <el-form-item label="扩展字段2" prop="kzzd2">
          <el-input v-model="form.kzzd2" placeholder="请输入扩展字段2" />
        </el-form-item>
        <el-form-item label="扩展字段3" prop="kzzd3">
          <el-input v-model="form.kzzd3" placeholder="请输入扩展字段3" />
        </el-form-item>
        <el-form-item label="扩展字段4" prop="kzzd4">
          <el-input v-model="form.kzzd4" placeholder="请输入扩展字段4" />
        </el-form-item>
        <el-form-item label="扩展字段5" prop="kzzd5">
          <el-input v-model="form.kzzd5" placeholder="请输入扩展字段5" />
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
import { listArticle, getArticle, delArticle, addArticle, updateArticle } from "@/api/demo/article";

export default {
  name: "Article",
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
      // 文章主题表格数据
      articleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        articleTitle: null,
        textType: null,
        articleContents: null,
        limitingTime: null,
        typingPatterns: null,
        isEnable: null,
        ipMax: null,
        userMax: null,
        startTime: null,
        endTime: null,
        userId: null,
        addOrUpdateTame: null,
        agency: null,
        dataOrder: null,
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
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询文章主题列表 */
    getList() {
      this.loading = true;
      listArticle(this.queryParams).then(response => {
        this.articleList = response.rows;
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
        articleTitle: null,
        textType: null,
        articleContents: null,
        limitingTime: null,
        typingPatterns: null,
        isEnable: null,
        ipMax: null,
        userMax: null,
        startTime: null,
        endTime: null,
        userId: null,
        addOrUpdateTame: null,
        agency: null,
        dataOrder: null,
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
      this.title = "添加文章主题";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getArticle(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改文章主题";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateArticle(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addArticle(this.form).then(response => {
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
      this.$confirm('是否确认删除文章主题编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delArticle(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('demo/article/export', {
        ...this.queryParams
      }, `demo_article.xlsx`)
    }
  }
};
</script>