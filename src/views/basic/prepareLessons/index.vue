<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="班级" prop="rybjid">
        <el-select v-model="queryParams.rybjid" placeholder="请选择班级" filterable>
          <el-option
            :label="item.rybjmc"
            :value="item.id"
            v-for="(item,index) in classList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师" prop="lsid">
        <el-select v-model="queryParams.lsid" filterable placeholder="请选择老师">
          <el-option
            v-for="item in teacherListOption"
            :key="item.id"
            :label="item.lsxm"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教材" label-width="100px" prop="materialId">
        <treeselect v-model="queryParams.materialId" style="width: 200px" :options="teachingMaterialList"
                    :normalizer="normalizerMaterial" placeholder="请选择教材"/>
      </el-form-item>
      <el-form-item label="教学模板" label-width="100px" prop="templateId">
        <treeselect v-model="queryParams.templateId" style="width: 200px" :options="teachingTemplateList"
                    :normalizer="normalizerTemplate" placeholder="请选择教学模板"/>
      </el-form-item>
      <!--      <el-form-item label="审核状态(合格，优秀，不合格)" prop="shzt">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.shzt"-->
      <!--          placeholder="请输入审核状态(合格，优秀，不合格)"-->
      <!--          clearable-->
      <!--          size="small"-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basic:prepareLessons:add']"
        >新增
        </el-button>
      </el-col>-->
      <!--  <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['basic:prepareLessons:edit']"
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
            v-hasPermi="['basic:prepareLessons:remove']"
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
            v-hasPermi="['basic:prepareLessons:export']"
          >导出</el-button>
        </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table style="width: 100%;font-size : 18px" v-loading="loading" :height="$root.tableHeight" border :data="prepareLessonsList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="班级" align="center" prop="rybjmc"/>
      <el-table-column label="老师" align="center" prop="lsxm"/>
      <el-table-column label="教材" align="center" prop="jcmc"/>
      <el-table-column label="单元" align="center" prop="dymc"/>
      <el-table-column label="课程" align="center" prop="kcmc"/>
      <el-table-column label="课程安排" align="center" prop="kcrwmc"/>
      <!--      <el-table-column label="备注" align="center" prop="remark" />-->
      <!--      <el-table-column label="审核状态(合格，优秀，不合格)" align="center" prop="shzt" />-->
      <el-table-column label="备课时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:prepareLessons:edit']"
          >查看
          </el-button>
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['basic:prepareLessons:remove']"-->
          <!--          >删除</el-button>-->
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

    <!-- 添加或修改备课对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="教材" prop="jcmc">
          <el-input v-model="form.jcmc" disabled/>
        </el-form-item>
        <el-form-item label="单元" prop="dymc">
          <el-input v-model="form.dymc" disabled/>
        </el-form-item>
        <el-form-item label="课程名称" prop="kcmc">
          <el-input v-model="form.kcmc" disabled/>
        </el-form-item>
        <el-form-item label="课程安排" prop="kcrwmc">
          <el-input v-model="form.kcrwmc" disabled/>
        </el-form-item>
        <el-form-item label="备课时间" prop="createTime">
          <el-input v-model="form.createTime" disabled/>
        </el-form-item>
        <el-form-item label="备课图片" >
          <el-image
            style="width: 100px; height: 100px;margin : 30px"
            v-for="(item,index) in form.bkTpArr"
            :key="index"
            :src="item"
            :preview-src-list="[item]"
          ></el-image>
        </el-form-item>
        <el-form-item label="备课文件" >
          <div v-for="(item, index) in form.bkWjArr">
            <el-link :href="form.bkWjArr[index]" target="_blank" type="primary">下载备课文件</el-link>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <editor v-model="form.remark" :min-height="192" :disabled="true" />
        </el-form-item>
        <el-form-item label="审核">
          <el-select v-model="form.shzt" filterable >
            <el-option
              v-for="dict in preparelesoonsStatus"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" v-prevent-re-click @click="submitForm">确 定</el-button>
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
        v-loading="fullscreenLoading"
        element-loading-text="正在进行数据导入·······"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport"/>
          是否更新已经存在的数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click :disabled="importBtn" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>


</template>

<script>
  import {
    listPrepareLessons,
    getPrepareLessons,
    delPrepareLessons,
    addPrepareLessons,
    updatePrepareLessons,
    listAcdemicDean
  } from "@/api/basic/prepareLessons";
  import {getToken} from "@/utils/auth";
  import {listBjclass} from "@/api/basic/bjclass";
  import {teacherList} from "@/api/basic/assignTeachers";
  import {listTeachingTemplate} from "@/api/basic/teachingTemplate";
  import {listTeachingMaterial} from "@/api/basic/teachingMaterial";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  export default {
    name: "prepareLessons",
    components: {
      Treeselect
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        importBtn: false,
        fullscreenLoading: false,
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
        // 备课表格数据
        prepareLessonsList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          lsid: null,
          rybjid: null,
          templatePath: null,
          materialId: null,
          // shzt: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        // 导入参数
        upload: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "导入备课数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: {Authorization: "Bearer " + getToken()},
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/basic/prepareLessons/importData"
        },
        // 班级基础信息数据
        classList: [],
        // 老师信息数据
        teacherListOption: [],
        teachingTemplateList: [],
        teachingMaterialList: [],
        preparelesoonsStatus: [],
      };
    },
    created() {
      this.getList();
      this.getDicts("preparelesoons_status").then(response => {
        this.preparelesoonsStatus = response.data;
      });
      listBjclass().then(res => {
        this.classList = res.rows;
      });
      teacherList().then(response => {
        this.teacherListOption = response.rows;
      });
      listTeachingTemplate().then(response => {
        this.teachingTemplateList = this.handleTree(response.data, "id", "parentId");
      });
      listTeachingMaterial().then(response => {
        this.teachingMaterialList = this.handleTree(response.data, "id", "parentId");
      });
    },
    methods: {
      /** 转换教材数据结构 */
      normalizerMaterial(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.jcmc,
          children: node.children
        };
      },
      /** 转换教学模板数据结构 */
      normalizerTemplate(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.jdmc,
          children: node.children
        };
      },
      /** 查询备课列表 */
      getList() {
        this.loading = true;
        listAcdemicDean(this.queryParams).then(response => {
          this.prepareLessonsList = response.rows;
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
          rybjid: null,
          templateId: null,
          lsid: null,
          bkTpid: null,
          bkWjid: null,
          remark: null,
          userId: null,
          // shzt: null,
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
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加备课";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getPrepareLessons(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updatePrepareLessons(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addPrepareLessons(this.form).then(response => {
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
        this.$confirm('是否确认删除选中的数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delPrepareLessons(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e) => {
          console.log(e);
        })

      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('basic/prepareLessons/export', {
          ...this.queryParams
        }, `备课-${new Date().getTime()}.xlsx`)
      },

      /** 导入按钮操作 */
      handleImport() {
        this.importBtn = false
        this.upload.title = "备课数据导入";
        this.upload.open = true;
        this.$nextTick(() => {// 页面元素加载完成后执行该方法
          this.$refs.upload.clearFiles();
        });
      },
      /** 下载模板操作 */
      importTemplate() {
        this.download('basic/prepareLessons/importTemplate', {
          ...this.queryParams
        }, `备课-导入模板-${new Date().getTime()}.xlsx`)
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.fullscreenLoading = false;
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$alert(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
        this.getList();
      },
      // 提交上传文件
      submitFileForm() {
        this.importBtn = true
        this.fullscreenLoading = true;
        this.$refs.upload.submit();
      }


    }
  };
</script>
