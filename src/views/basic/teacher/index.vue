<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="校区名称" prop="xqmc">
        <el-input
          v-model="queryParams.xqmc"
          placeholder="请输入校区名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日语班级" prop="rybj">
        <el-input
          v-model="queryParams.rybj"
          placeholder="请输入日语班级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <el-form-item label="是否有教师资格证" prop="sfyjszgz">
        <el-select v-model="queryParams.sfyjszgz" placeholder="请选择是否有教师资格证" clearable size="small">
          <el-option
            v-for="dict in sfyjszgzOptions"
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
          v-hasPermi="['basic:teacher:add']"
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
          v-hasPermi="['basic:teacher:edit']"
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
          v-hasPermi="['basic:teacher:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['basic:teacher:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teacherList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="状态" align="center" prop="id" />
      <el-table-column label="老师头像" align="center" prop="lstx" />
      <el-table-column label="校区名称" align="center" prop="xqmc" />
      <el-table-column label="日语班级" align="center" prop="rybj" />
      <el-table-column label="老师姓名" align="center" prop="lsxm" />
      <el-table-column label="性别" align="center" prop="xb" :formatter="xbFormat" />
      <el-table-column label="入职时间" align="center" prop="rzsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.rzsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入职工龄" align="center" prop="rzgl" />
      <el-table-column label="身份证号" align="center" prop="sfzh" />
      <el-table-column label="电话号码" align="center" prop="dhhm" />
      <el-table-column label="家庭地址" align="center" prop="jtzz" />
      <el-table-column label="现住址" align="center" prop="xzz" />
      <el-table-column label="紧急联系人" align="center" prop="jjlxr" />
      <el-table-column label="紧急联系人电话" align="center" prop="jjlxrdh" />
      <el-table-column label="毕业学校" align="center" prop="byxx" />
      <el-table-column label="毕业专业" align="center" prop="byzy" />
      <el-table-column label="个人身份证正反扫描照" align="center" prop="grsfzsmz" />
      <el-table-column label="毕业证扫描件" align="center" prop="byzsmj" />
      <el-table-column label="学位证扫描件" align="center" prop="xwzsmj" />
      <el-table-column label="个人证件照白底蓝底" align="center" prop="grzjzbdld" />
      <el-table-column label="日语登记证书" align="center" prop="rydjzs" />
      <el-table-column label="是否有教师资格证" align="center" prop="sfyjszgz" :formatter="sfyjszgzFormat" />
      <el-table-column label="教师资格证" align="center" prop="jszgz" />
      <el-table-column label="其他证书" align="center" prop="qtzs" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:teacher:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:teacher:remove']"
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

    <!-- 添加或修改老师信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="老师头像" prop="lstx">
          <el-input v-model="form.lstx" placeholder="请输入老师头像" />
        </el-form-item>
        <el-form-item label="校区名称" prop="xqmc">
          <el-input v-model="form.xqmc" placeholder="请输入校区名称" />
        </el-form-item>
        <el-form-item label="日语班级" prop="rybj">
          <el-input v-model="form.rybj" placeholder="请输入日语班级" />
        </el-form-item>
        <el-form-item label="老师姓名" prop="lsxm">
          <el-input v-model="form.lsxm" placeholder="请输入老师姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="xb">
          <el-select v-model="form.xb" placeholder="请选择性别">
            <el-option
              v-for="dict in xbOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间" prop="rzsj">
          <el-date-picker clearable size="small"
            v-model="form.rzsj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择入职时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入职工龄" prop="rzgl">
          <el-input v-model="form.rzgl" placeholder="请输入入职工龄" />
        </el-form-item>
        <el-form-item label="身份证号" prop="sfzh">
          <el-input v-model="form.sfzh" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="电话号码" prop="dhhm">
          <el-input v-model="form.dhhm" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="家庭地址" prop="jtzz">
          <el-input v-model="form.jtzz" placeholder="请输入家庭地址" />
        </el-form-item>
        <el-form-item label="现住址" prop="xzz">
          <el-input v-model="form.xzz" placeholder="请输入现住址" />
        </el-form-item>
        <el-form-item label="紧急联系人" prop="jjlxr">
          <el-input v-model="form.jjlxr" placeholder="请输入紧急联系人" />
        </el-form-item>
        <el-form-item label="紧急联系人电话" prop="jjlxrdh">
          <el-input v-model="form.jjlxrdh" placeholder="请输入紧急联系人电话" />
        </el-form-item>
        <el-form-item label="毕业学校" prop="byxx">
          <el-input v-model="form.byxx" placeholder="请输入毕业学校" />
        </el-form-item>
        <el-form-item label="毕业专业" prop="byzy">
          <el-input v-model="form.byzy" placeholder="请输入毕业专业" />
        </el-form-item>
        <el-form-item label="个人身份证正反扫描照" prop="grsfzsmz">
          <el-input v-model="form.grsfzsmz" placeholder="请输入个人身份证正反扫描照" />
        </el-form-item>
        <el-form-item label="毕业证扫描件" prop="byzsmj">
          <el-input v-model="form.byzsmj" placeholder="请输入毕业证扫描件" />
        </el-form-item>
        <el-form-item label="学位证扫描件" prop="xwzsmj">
          <el-input v-model="form.xwzsmj" placeholder="请输入学位证扫描件" />
        </el-form-item>
        <el-form-item label="个人证件照白底蓝底" prop="grzjzbdld">
          <el-input v-model="form.grzjzbdld" placeholder="请输入个人证件照白底蓝底" />
        </el-form-item>
        <el-form-item label="日语登记证书" prop="rydjzs">
          <el-input v-model="form.rydjzs" placeholder="请输入日语登记证书" />
        </el-form-item>
        <el-form-item label="是否有教师资格证" prop="sfyjszgz">
          <el-select v-model="form.sfyjszgz" placeholder="请选择是否有教师资格证">
            <el-option
              v-for="dict in sfyjszgzOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师资格证" prop="jszgz">
          <el-input v-model="form.jszgz" placeholder="请输入教师资格证" />
        </el-form-item>
        <el-form-item label="其他证书" prop="qtzs">
          <el-input v-model="form.qtzs" placeholder="请输入其他证书" />
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
  </div>
</template>

<script>
import { listTeacher, getTeacher, delTeacher, addTeacher, updateTeacher } from "@/api/basic/teacher";

export default {
  name: "Teacher",
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
      // 老师信息表格数据
      teacherList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 性别字典
      xbOptions: [],
      // 是否有教师资格证字典
      sfyjszgzOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xqmc: null,
        rybj: null,
        lsxm: null,
        xb: null,
        sfyjszgz: null,
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
    this.getDicts("sys_user_sex").then(response => {
      this.xbOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.sfyjszgzOptions = response.data;
    });
    this.getDicts("basic_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询老师信息列表 */
    getList() {
      this.loading = true;
      listTeacher(this.queryParams).then(response => {
        this.teacherList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 性别字典翻译
    xbFormat(row, column) {
      return this.selectDictLabel(this.xbOptions, row.xb);
    },
    // 是否有教师资格证字典翻译
    sfyjszgzFormat(row, column) {
      return this.selectDictLabel(this.sfyjszgzOptions, row.sfyjszgz);
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
        lstx: null,
        xqmc: null,
        rybj: null,
        lsxm: null,
        xb: null,
        rzsj: null,
        rzgl: null,
        sfzh: null,
        dhhm: null,
        jtzz: null,
        xzz: null,
        jjlxr: null,
        jjlxrdh: null,
        byxx: null,
        byzy: null,
        grsfzsmz: null,
        byzsmj: null,
        xwzsmj: null,
        grzjzbdld: null,
        rydjzs: null,
        sfyjszgz: null,
        jszgz: null,
        qtzs: null,
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
      this.title = "添加老师信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTeacher(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改老师信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeacher(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeacher(this.form).then(response => {
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
      this.$confirm('是否确认删除老师信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeacher(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basic/teacher/export', {
        ...this.queryParams
      }, `basic_teacher.xlsx`)
    }
  }
};
</script>