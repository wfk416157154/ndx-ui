<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="培训内容" prop="pxnr">
        <el-input
          v-model="queryParams.pxnr"
          placeholder="请输入培训内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组件id" prop="zjid">
        <el-input
          v-model="queryParams.zjid"
          placeholder="请输入组件id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组件名称" prop="zjmc">
        <el-input
          v-model="queryParams.zjmc"
          placeholder="请输入组件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否有多个选项" prop="sfydgxx">
        <el-select v-model="queryParams.sfydgxx" placeholder="请选择是否有多个选项" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否默认选中" prop="sfmrxz">
        <el-select v-model="queryParams.sfmrxz" placeholder="请选择是否默认选中" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否必填" prop="sfbt">
        <el-select v-model="queryParams.sfbt" placeholder="请选择是否必填" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="字段长度限制" prop="zdcdxz">
        <el-input
          v-model="queryParams.zdcdxz"
          placeholder="请输入字段长度限制"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否启用" prop="sfqy">
        <el-select v-model="queryParams.sfqy" placeholder="请选择是否启用" clearable size="small">
          <el-option label="请选择字典生成" value="" />
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
          v-hasPermi="['basic:trainSingle:add']"
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
          v-hasPermi="['basic:trainSingle:edit']"
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
          v-hasPermi="['basic:trainSingle:remove']"
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
          v-hasPermi="['basic:trainSingle:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table  border v-loading="loading" :data="trainSingleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="培训内容" align="center" prop="pxnr" />
      <el-table-column label="组件id" align="center" prop="zjid" />
      <el-table-column label="组件名称" align="center" prop="zjmc" />
      <el-table-column label="是否有多个选项" align="center" prop="sfydgxx" />
      <el-table-column label="是否默认选中" align="center" prop="sfmrxz" />
      <el-table-column label="是否必填" align="center" prop="sfbt" />
      <el-table-column label="字段长度限制" align="center" prop="zdcdxz" />
      <el-table-column label="是否启用" align="center" prop="sfqy" />
      <el-table-column label="添加时间" align="center" prop="tjsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.tjsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:trainSingle:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:trainSingle:remove']"
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

    <!-- 添加或修改培训内容（默认单选项）对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联id" prop="glid">
          <el-input v-model="form.glid" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="上级培训内容id" prop="sjpxnrid">
          <el-input v-model="form.sjpxnrid" placeholder="请输入上级培训内容id" />
        </el-form-item>
        <el-form-item label="上级培训内容" prop="sjpxnr">
          <el-input v-model="form.sjpxnr" placeholder="请输入上级培训内容" />
        </el-form-item>
        <el-form-item label="培训内容" prop="pxnr">
          <el-input v-model="form.pxnr" placeholder="请输入培训内容" />
        </el-form-item>
        <el-form-item label="组件id" prop="zjid">
          <el-input v-model="form.zjid" placeholder="请输入组件id" />
        </el-form-item>
        <el-form-item label="组件名称" prop="zjmc">
          <el-input v-model="form.zjmc" placeholder="请输入组件名称" />
        </el-form-item>
        <el-form-item label="是否有多个选项">
          <el-radio-group v-model="form.sfydgxx">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否默认选中">
          <el-radio-group v-model="form.sfmrxz">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否必填">
          <el-radio-group v-model="form.sfbt">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="字段长度限制" prop="zdcdxz">
          <el-input v-model="form.zdcdxz" placeholder="请输入字段长度限制" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="form.sfqy">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="添加时间" prop="tjsj">
          <el-date-picker clearable size="small"
            v-model="form.tjsj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加时间">
          </el-date-picker>
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
import { listTrainSingle, getTrainSingle, delTrainSingle, addTrainSingle, updateTrainSingle } from "@/api/basic/trainSingle";
import { getToken } from "@/utils/auth";

export default {
  name: "TrainSingle",
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
      // 培训内容（默认单选项）表格数据
      trainSingleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pxnr: null,
        zjid: null,
        zjmc: null,
        sfydgxx: null,
        sfmrxz: null,
        sfbt: null,
        zdcdxz: null,
        sfqy: null,
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
          title: "导入培训内容（默认单选项）数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "basic/trainSingle/importData"
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询培训内容（默认单选项）列表 */
    getList() {
      this.loading = true;
      listTrainSingle(this.queryParams).then(response => {
        this.trainSingleList = response.rows;
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
        glid: null,
        sjpxnrid: null,
        sjpxnr: null,
        pxnr: null,
        zjid: null,
        zjmc: null,
        sfydgxx: "0",
        sfmrxz: "0",
        sfbt: "0",
        zdcdxz: null,
        sfqy: "0",
        tjsj: null,
        remark: null,
        userId: null,
        userName: null,
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
      this.title = "添加培训内容（默认单选项）";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTrainSingle(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改培训内容（默认单选项）";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTrainSingle(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTrainSingle(this.form).then(response => {
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
      this.$confirm('是否确认删除培训内容（默认单选项）编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTrainSingle(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e)=>{
          console.log(e);
      })

    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basic/trainSingle/export', {
        ...this.queryParams
      }, `培训内容（默认单选项）.xlsx`)
    },

      /** 导入按钮操作 */
      handleImport() {
          this.upload.title = "培训内容（默认单选项）数据导入";
          this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
          this.download('basic/trainSingle/importTemplate', {
              ...this.queryParams
          }, `培训内容（默认单选项）-导入模板.xlsx`)
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