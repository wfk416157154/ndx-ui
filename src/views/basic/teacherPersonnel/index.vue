<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="xm">
        <el-input
          v-model="queryParams.xm"
          placeholder="请输入姓名"
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
      <el-form-item label="电话号码" prop="dhhm">
        <el-input
          v-model="queryParams.dhhm"
          placeholder="请输入电话号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="家庭住址" prop="jtzz">
        <el-input
          v-model="queryParams.jtzz"
          placeholder="请输入家庭住址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="意向地区" prop="yxdq">
        <el-input
          v-model="queryParams.yxdq"
          placeholder="请输入意向地区"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="意向状态" prop="yxzt">
        <el-select v-model="queryParams.yxzt" placeholder="请选择意向状态" clearable size="small">
          <el-option
            v-for="dict in yxztOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="zt">
        <el-select v-model="queryParams.zt" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in ztOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="来汉时间" prop="lhsj">
        <el-date-picker clearable size="small"
                        v-model="queryParams.lhsj"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择来汉时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="派遣地区" prop="pqdq">
        <el-input
          v-model="queryParams.pqdq"
          placeholder="请输入派遣地区"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="沟通记录" prop="gtjl">
        <el-input
          v-model="queryParams.gtjl"
          placeholder="请输入沟通记录"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="面试状态" prop="mszt">
        <el-select v-model="queryParams.mszt" placeholder="请选择面试状态" clearable size="small">
          <el-option
            v-for="dict in msztOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="面试时间" prop="mssj">
        <el-date-picker clearable size="small"
                        v-model="queryParams.mssj"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择面试时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="通过事由" prop="tgsy">
        <el-input
          v-model="queryParams.tgsy"
          placeholder="请输入通过事由"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="到汉时间" prop="dhsj">
        <el-date-picker clearable size="small"
                        v-model="queryParams.dhsj"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择到汉时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="推荐人" prop="tjj">
        <el-input
          v-model="queryParams.tjj"
          placeholder="请输入推荐人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否培训" prop="isTrain">
        <el-select v-model="queryParams.isTrain" placeholder="请选择是否培训" clearable size="small">
          <el-option
            v-for="dict in isTrainOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['basic:teacherPersonnel:add']"
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
          v-hasPermi="['basic:teacherPersonnel:edit']"
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
          v-hasPermi="['basic:teacherPersonnel:remove']"
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
          v-hasPermi="['basic:teacherPersonnel:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table style="width: 100%;font-size : 18px" border v-loading="loading" :data="teacherPersonnelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="姓名" align="center" prop="xm" />
      <el-table-column label="性别" align="center" prop="xb" :formatter="xbFormat" />
      <el-table-column label="电话号码" align="center" prop="dhhm" />
      <el-table-column label="家庭住址" align="center" prop="jtzz" />
      <el-table-column label="意向地区" align="center" prop="yxdq" />
      <el-table-column label="意向状态" align="center" prop="yxzt" :formatter="yxztFormat" />
      <el-table-column label="状态" align="center" prop="zt" :formatter="ztFormat" />
      <el-table-column label="来汉时间" align="center" prop="lhsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lhsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="派遣地区" align="center" prop="pqdq" />
      <el-table-column label="沟通记录" align="center" prop="gtjl" />
      <el-table-column label="面试状态" align="center" prop="mszt" :formatter="msztFormat" />
      <el-table-column label="面试时间" align="center" prop="mssj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.mssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通过事由" align="center" prop="tgsy" />
      <el-table-column label="到汉时间" align="center" prop="dhsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dhsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐人" align="center" prop="tjj" />
      <el-table-column label="是否培训" align="center" prop="isTrain" :formatter="isTrainFormat" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:teacherPersonnel:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:teacherPersonnel:remove']"
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

    <!-- 添加或修改老师人事对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="xm">
          <el-input v-model="form.xm" placeholder="请输入姓名" />
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
        <el-form-item label="电话号码" prop="dhhm">
          <el-input v-model="form.dhhm" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="家庭住址" prop="jtzz">
          <el-input v-model="form.jtzz" placeholder="请输入家庭住址" />
        </el-form-item>
        <el-form-item label="意向地区" prop="yxdq">
          <el-input v-model="form.yxdq" placeholder="请输入意向地区" />
        </el-form-item>
        <el-form-item label="意向状态" prop="yxzt">
          <el-select v-model="form.yxzt" placeholder="请选择意向状态">
            <el-option
              v-for="dict in yxztOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="zt">
          <el-select v-model="form.zt" placeholder="请选择状态">
            <el-option
              v-for="dict in ztOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来汉时间" prop="lhsj">
          <el-date-picker clearable size="small"
                          v-model="form.lhsj"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择来汉时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="派遣地区" prop="pqdq">
          <el-input v-model="form.pqdq" placeholder="请输入派遣地区" />
        </el-form-item>
        <el-form-item label="沟通记录" prop="gtjl">
          <el-input v-model="form.gtjl" placeholder="请输入沟通记录" />
        </el-form-item>
        <el-form-item label="面试状态">
          <el-radio-group v-model="form.mszt">
            <el-radio
              v-for="dict in msztOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面试时间" prop="mssj">
          <el-date-picker clearable size="small"
                          v-model="form.mssj"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择面试时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="通过事由" prop="tgsy">
          <el-input v-model="form.tgsy" placeholder="请输入通过事由" />
        </el-form-item>
        <el-form-item label="到汉时间" prop="dhsj">
          <el-date-picker clearable size="small"
                          v-model="form.dhsj"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择到汉时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="推荐人" prop="tjj">
          <el-input v-model="form.tjj" placeholder="请输入推荐人" />
        </el-form-item>
        <el-form-item label="是否培训">
          <el-radio-group v-model="form.isTrain">
            <el-radio
              v-for="dict in isTrainOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
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

    <!-- 导入对话框 -->
    <el-dialog :close-on-click-modal="false" :title="upload.title" :visible.sync="upload.open" width="400px">
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
  import { listTeacherPersonnel, getTeacherPersonnel, delTeacherPersonnel, addTeacherPersonnel, updateTeacherPersonnel } from "@/api/basic/teacherPersonnel";
  import { getToken } from "@/utils/auth";

  export default {
    name: "TeacherPersonnel",
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
        // 老师人事表格数据
        teacherPersonnelList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 性别字典
        xbOptions: [],
        // 意向状态字典
        yxztOptions: [],
        // 状态字典
        ztOptions: [],
        // 面试状态字典
        msztOptions: [],
        // 是否培训字典
        isTrainOptions: [],
        // 状态字典
        statusOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          xm: null,
          xb: null,
          dhhm: null,
          jtzz: null,
          yxdq: null,
          yxzt: null,
          zt: null,
          lhsj: null,
          pqdq: null,
          gtjl: null,
          mszt: null,
          mssj: null,
          tgsy: null,
          dhsj: null,
          tjj: null,
          isTrain: null,
          status: null,
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
          title: "导入老师人事数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "basic/teacherPersonnel/importData"
        },
      };
    },
    created() {
      this.getList();
      this.getDicts("sys_user_sex").then(response => {
        this.xbOptions = response.data;
      });
      this.getDicts("intention_type").then(response => {
        this.yxztOptions = response.data;
      });
      this.getDicts("tea_per_type").then(response => {
        this.ztOptions = response.data;
      });
      this.getDicts("sys_yes_no").then(response => {
        this.msztOptions = response.data;
      });
      this.getDicts("sys_yes_no").then(response => {
        this.isTrainOptions = response.data;
      });
      this.getDicts("basic_status").then(response => {
        this.statusOptions = response.data;
      });
    },
    methods: {
      /** 查询老师人事列表 */
      getList() {
        this.loading = true;
        listTeacherPersonnel(this.queryParams).then(response => {
          this.teacherPersonnelList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 性别字典翻译
      xbFormat(row, column) {
        return this.selectDictLabel(this.xbOptions, row.xb);
      },
      // 意向状态字典翻译
      yxztFormat(row, column) {
        return this.selectDictLabel(this.yxztOptions, row.yxzt);
      },
      // 状态字典翻译
      ztFormat(row, column) {
        return this.selectDictLabel(this.ztOptions, row.zt);
      },
      // 面试状态字典翻译
      msztFormat(row, column) {
        return this.selectDictLabel(this.msztOptions, row.mszt);
      },
      // 是否培训字典翻译
      isTrainFormat(row, column) {
        return this.selectDictLabel(this.isTrainOptions, row.isTrain);
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
          xm: null,
          xb: "0",
          dhhm: null,
          jtzz: null,
          yxdq: null,
          yxzt: null,
          zt: null,
          lrrid: null,
          lrrxm: null,
          lhsj: null,
          pqdq: null,
          gtjl: null,
          mszt: "0",
          mssj: null,
          tgsy: null,
          dhsj: null,
          tjj: null,
          isTrain: "0",
          status: "0",
          remark: null,
          userId: null,
          uName: null,
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
        this.title = "添加老师人事";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getTeacherPersonnel(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改老师人事";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateTeacherPersonnel(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addTeacherPersonnel(this.form).then(response => {
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
        this.$confirm('是否确认删除老师人事编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeacherPersonnel(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e)=>{
          console.log(e);
        })

      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('basic/teacherPersonnel/export', {
          ...this.queryParams
        }, `老师人事.xlsx`)
      },

      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = "老师人事数据导入";
        this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
        this.download('basic/teacherPersonnel/importTemplate', {
          ...this.queryParams
        }, `老师人事-导入模板.xlsx`)
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
