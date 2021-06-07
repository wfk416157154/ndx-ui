<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关联id" prop="glid">
        <el-input
          v-model="queryParams.glid"
          placeholder="请输入关联id"
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
          v-hasPermi="['basic:staticform:add']"
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
          v-hasPermi="['basic:staticform:edit']"
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
          v-hasPermi="['basic:staticform:remove']"
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
          v-hasPermi="['basic:staticform:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="staticformList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="关联id" align="center" prop="glid" />
      <el-table-column label="关联id" align="center" prop="oneOne" />
      <el-table-column label="关联id" align="center" prop="oneTwo" />
      <el-table-column label="关联id" align="center" prop="oneThree" />
      <el-table-column label="关联id" align="center" prop="oneFour" />
      <el-table-column label="关联id" align="center" prop="oneFive" />
      <el-table-column label="关联id" align="center" prop="twoOne" />
      <el-table-column label="关联id" align="center" prop="twoTwo" />
      <el-table-column label="关联id" align="center" prop="twoThree" />
      <el-table-column label="关联id" align="center" prop="twoFour" />
      <el-table-column label="关联id" align="center" prop="twoFive" />
      <el-table-column label="关联id" align="center" prop="twoFiveOne" />
      <el-table-column label="关联id" align="center" prop="twoFiveTwo" />
      <el-table-column label="关联id" align="center" prop="twoFiveThree" />
      <el-table-column label="关联id" align="center" prop="twoFiveFour" />
      <el-table-column label="关联id" align="center" prop="twoFiveFive" />
      <el-table-column label="关联id" align="center" prop="threeOne" />
      <el-table-column label="关联id" align="center" prop="threeOneOne" />
      <el-table-column label="关联id" align="center" prop="threeOneTwo" />
      <el-table-column label="关联id" align="center" prop="threeOneThree" />
      <el-table-column label="关联id" align="center" prop="threeOneFour" />
      <el-table-column label="关联id" align="center" prop="threeOneFive" />
      <el-table-column label="关联id" align="center" prop="threeOneSix" />
      <el-table-column label="关联id" align="center" prop="threeOneSeven" />
      <el-table-column label="关联id" align="center" prop="threeOneEight" />
      <el-table-column label="关联id" align="center" prop="threeTwo" />
      <el-table-column label="关联id" align="center" prop="threeThree" />
      <el-table-column label="关联id" align="center" prop="threeFour" />
      <el-table-column label="关联id" align="center" prop="threeFive" />
      <el-table-column label="关联id" align="center" prop="threeSix" />
      <el-table-column label="关联id" align="center" prop="threeSeven" />
      <el-table-column label="关联id" align="center" prop="threeEight" />
      <el-table-column label="关联id" align="center" prop="fourOne" />
      <el-table-column label="关联id" align="center" prop="fourTwo" />
      <el-table-column label="关联id" align="center" prop="fourThree" />
      <el-table-column label="关联id" align="center" prop="fourFour" />
      <el-table-column label="关联id" align="center" prop="fourFive" />
      <el-table-column label="关联id" align="center" prop="fourSix" />
      <el-table-column label="关联id" align="center" prop="fourSeven" />
      <el-table-column label="关联id" align="center" prop="fourEight" />
      <el-table-column label="关联id" align="center" prop="fiveOne" />
      <el-table-column label="关联id" align="center" prop="fiveTwo" />
      <el-table-column label="关联id" align="center" prop="fiveThree" />
      <el-table-column label="关联id" align="center" prop="fiveFour" />
      <el-table-column label="关联id" align="center" prop="fiveFive" />
      <el-table-column label="关联id" align="center" prop="fiveSix" />
      <el-table-column label="关联id" align="center" prop="fiveSeven" />
      <el-table-column label="关联id" align="center" prop="fiveEight" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:staticform:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:staticform:remove']"
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

    <!-- 添加或修改培训内容静态单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联id" prop="glid">
          <el-input v-model="form.glid" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="oneOne">
          <el-input v-model="form.oneOne" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="oneTwo">
          <el-input v-model="form.oneTwo" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="oneThree">
          <el-input v-model="form.oneThree" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="oneFour">
          <el-input v-model="form.oneFour" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="oneFive">
          <el-input v-model="form.oneFive" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="twoOne">
          <el-input v-model="form.twoOne" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="twoTwo">
          <el-input v-model="form.twoTwo" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="twoThree">
          <el-input v-model="form.twoThree" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="twoFour">
          <el-input v-model="form.twoFour" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="twoFive">
          <el-input v-model="form.twoFive" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="twoFiveOne">
          <el-input v-model="form.twoFiveOne" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="twoFiveTwo">
          <el-input v-model="form.twoFiveTwo" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="twoFiveThree">
          <el-input v-model="form.twoFiveThree" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="twoFiveFour">
          <el-input v-model="form.twoFiveFour" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="twoFiveFive">
          <el-input v-model="form.twoFiveFive" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeOne">
          <el-input v-model="form.threeOne" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeOneOne">
          <el-input v-model="form.threeOneOne" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeOneTwo">
          <el-input v-model="form.threeOneTwo" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeOneThree">
          <el-input v-model="form.threeOneThree" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeOneFour">
          <el-input v-model="form.threeOneFour" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeOneFive">
          <el-input v-model="form.threeOneFive" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeOneSix">
          <el-input v-model="form.threeOneSix" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeOneSeven">
          <el-input v-model="form.threeOneSeven" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeOneEight">
          <el-input v-model="form.threeOneEight" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeTwo">
          <el-input v-model="form.threeTwo" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeThree">
          <el-input v-model="form.threeThree" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeFour">
          <el-input v-model="form.threeFour" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeFive">
          <el-input v-model="form.threeFive" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeSix">
          <el-input v-model="form.threeSix" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeSeven">
          <el-input v-model="form.threeSeven" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="threeEight">
          <el-input v-model="form.threeEight" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fourOne">
          <el-input v-model="form.fourOne" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fourTwo">
          <el-input v-model="form.fourTwo" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fourThree">
          <el-input v-model="form.fourThree" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fourFour">
          <el-input v-model="form.fourFour" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fourFive">
          <el-input v-model="form.fourFive" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fourSix">
          <el-input v-model="form.fourSix" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fourSeven">
          <el-input v-model="form.fourSeven" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fourEight">
          <el-input v-model="form.fourEight" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fiveOne">
          <el-input v-model="form.fiveOne" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fiveTwo">
          <el-input v-model="form.fiveTwo" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fiveThree">
          <el-input v-model="form.fiveThree" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fiveFour">
          <el-input v-model="form.fiveFour" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fiveFive">
          <el-input v-model="form.fiveFive" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fiveSix">
          <el-input v-model="form.fiveSix" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fiveSeven">
          <el-input v-model="form.fiveSeven" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="关联id" prop="fiveEight">
          <el-input v-model="form.fiveEight" placeholder="请输入关联id" />
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
import { listStaticform, getStaticform, delStaticform, addStaticform, updateStaticform } from "@/api/basic/staticform";
import { getToken } from "@/utils/auth";

export default {
  name: "Staticform",
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
      // 培训内容静态单表格数据
      staticformList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        glid: null,
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
          title: "导入培训内容静态单数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "basic/staticform/importData"
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询培训内容静态单列表 */
    getList() {
      this.loading = true;
      listStaticform(this.queryParams).then(response => {
        this.staticformList = response.rows;
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
        oneOne: null,
        oneTwo: null,
        oneThree: null,
        oneFour: null,
        oneFive: null,
        twoOne: null,
        twoTwo: null,
        twoThree: null,
        twoFour: null,
        twoFive: null,
        twoFiveOne: null,
        twoFiveTwo: null,
        twoFiveThree: null,
        twoFiveFour: null,
        twoFiveFive: null,
        threeOne: null,
        threeOneOne: null,
        threeOneTwo: null,
        threeOneThree: null,
        threeOneFour: null,
        threeOneFive: null,
        threeOneSix: null,
        threeOneSeven: null,
        threeOneEight: null,
        threeTwo: null,
        threeThree: null,
        threeFour: null,
        threeFive: null,
        threeSix: null,
        threeSeven: null,
        threeEight: null,
        fourOne: null,
        fourTwo: null,
        fourThree: null,
        fourFour: null,
        fourFive: null,
        fourSix: null,
        fourSeven: null,
        fourEight: null,
        fiveOne: null,
        fiveTwo: null,
        fiveThree: null,
        fiveFour: null,
        fiveFive: null,
        fiveSix: null,
        fiveSeven: null,
        fiveEight: null,
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
      this.title = "添加培训内容静态单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStaticform(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改培训内容静态单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStaticform(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStaticform(this.form).then(response => {
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
      this.$confirm('是否确认删除培训内容静态单编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delStaticform(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e)=>{
          console.log(e);
      })

    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basic/staticform/export', {
        ...this.queryParams
      }, `培训内容静态单.xlsx`)
    },

      /** 导入按钮操作 */
      handleImport() {
          this.upload.title = "培训内容静态单数据导入";
          this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
          this.download('basic/staticform/importTemplate', {
              ...this.queryParams
          }, `培训内容静态单-导入模板.xlsx`)
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