<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="校区名称" prop="xqmc">
        <el-select v-model="queryParams.xqmc" placeholder="请选择校区名称" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="日语班" prop="ryb">
        <el-select v-model="queryParams.ryb" placeholder="请选择日语班" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="老师姓名" prop="lsxm">
        <el-input
          v-model="queryParams.lsxm"
          placeholder="请输入老师姓名"
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
          v-hasPermi="['basic:gaokao:add']"
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
          v-hasPermi="['basic:gaokao:edit']"
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
          v-hasPermi="['basic:gaokao:remove']"
        >删除</el-button>
      </el-col>
    <el-col :span="1.5">
        <el-button
                type="info"
                icon="el-icon-upload2"
                size="mini"
                @click="handleImport"
        >导入</el-button>
    </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['basic:gaokao:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gaokaoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="校区名称" align="center" prop="xqmc" />
      <el-table-column label="日语班" align="center" prop="ryb" />
      <el-table-column label="老师姓名" align="center" prop="lsxm" />
      <el-table-column label="进班英语平均成绩" align="center" prop="jbyypjcj" />
      <el-table-column label="高考日语平均成绩" align="center" prop="gkrypjcj" />
      <el-table-column label="平均进步分" align="center" prop="pjjbf" />
      <el-table-column label="日语最高分" align="center" prop="ryzgf" />
      <el-table-column label="日语最低分" align="center" prop="ryzdf" />
      <el-table-column label="日语班级人数" align="center" prop="rybjrs" />
      <el-table-column label="100分以上的人数" align="center" prop="ybfys" />
      <el-table-column label="120分以上的人数" align="center" prop="ybesfys" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:gaokao:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:gaokao:remove']"
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

    <!-- 添加或修改班级高考成绩对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="校区名称" prop="xqmc">
          <el-select v-model="form.xqmc" placeholder="请选择校区名称">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="日语班" prop="ryb">
          <el-select v-model="form.ryb" placeholder="请选择日语班">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="老师姓名" prop="lsxm">
          <el-input v-model="form.lsxm" placeholder="请输入老师姓名" />
        </el-form-item>
        <el-form-item label="进班英语平均成绩" prop="jbyypjcj">
          <el-input v-model="form.jbyypjcj" placeholder="请输入进班英语平均成绩" />
        </el-form-item>
        <el-form-item label="高考日语平均成绩" prop="gkrypjcj">
          <el-input v-model="form.gkrypjcj" placeholder="请输入高考日语平均成绩" />
        </el-form-item>
        <el-form-item label="平均进步分" prop="pjjbf">
          <el-input v-model="form.pjjbf" placeholder="请输入平均进步分" />
        </el-form-item>
        <el-form-item label="日语最高分" prop="ryzgf">
          <el-input v-model="form.ryzgf" placeholder="请输入日语最高分" />
        </el-form-item>
        <el-form-item label="日语最低分" prop="ryzdf">
          <el-input v-model="form.ryzdf" placeholder="请输入日语最低分" />
        </el-form-item>
        <el-form-item label="日语班级人数" prop="rybjrs">
          <el-input v-model="form.rybjrs" placeholder="请输入日语班级人数" />
        </el-form-item>
        <el-form-item label="100分以上的人数" prop="ybfys">
          <el-input v-model="form.ybfys" placeholder="请输入100分以上的人数" />
        </el-form-item>
        <el-form-item label="120分以上的人数" prop="ybesfys">
          <el-input v-model="form.ybesfys" placeholder="请输入120分以上的人数" />
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
          >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                  <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据
                  <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
              </div>
              <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitFileForm">确 定</el-button>
              <el-button @click="upload.open = false">取 消</el-button>
          </div>
      </el-dialog>

  </div>


</template>

<script>
import { listGaokao, getGaokao, delGaokao, addGaokao, updateGaokao } from "@/api/basic/gaokao";
import { getToken } from "@/utils/auth";

export default {
  name: "Gaokao",
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
      // 班级高考成绩表格数据
      gaokaoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xqmc: null,
        ryb: null,
        lsxm: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 用户导入参数
      upload: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "导入班级高考成绩数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "basic/gaokao/importData"
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询班级高考成绩列表 */
    getList() {
      this.loading = true;
      listGaokao(this.queryParams).then(response => {
        this.gaokaoList = response.rows;
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
        xqmc: null,
        ryb: null,
        lsxm: null,
        jbyypjcj: null,
        gkrypjcj: null,
        pjjbf: null,
        ryzgf: null,
        ryzdf: null,
        rybjrs: null,
        ybfys: null,
        ybesfys: null,
        status: "0",
        remark: null,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加班级高考成绩";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGaokao(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改班级高考成绩";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGaokao(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGaokao(this.form).then(response => {
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
      this.$confirm('是否确认删除班级高考成绩编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGaokao(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basic/gaokao/export', {
        ...this.queryParams
      }, `班级高考成绩.xlsx`)
    },

      /** 导入按钮操作 */
      handleImport() {
          this.upload.title = "班级高考成绩数据导入";
          this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
          this.download('basic/gaokao/importTemplate', {
              ...this.queryParams
          }, `班级高考成绩-导入模板.xlsx`)
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
          this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
          this.upload.open = false;
          this.upload.isUploading = false;
          this.$refs.upload.clearFiles();
          this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
          this.getList();
      },
      // 提交上传文件
      submitFileForm() {
          this.$refs.upload.submit();
      }


  }
};
</script>