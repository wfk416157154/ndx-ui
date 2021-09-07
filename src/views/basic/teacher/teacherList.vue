<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <!--<el-form-item label="校区名称" prop="xqmc">
        <el-select v-model="queryParams.xqmc" placeholder="请选择校区名称">
          <el-option
            v-for="item in selectXqmc"
            :key="item.id"
            :label="item.xxmc"
            :value="item.xxmc"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日语班级" prop="rybj">
        <el-select v-model="queryParams.rybj" placeholder="请选择日语班级">
          <el-option
            v-for="item in bjclassList "
            :key="item.id"
            :label="item.rybjmc"
            :value="item.rybjmc"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="老师姓名" prop="lsxm">
        <el-input
          v-model="queryParams.lsxm"
          placeholder="可模糊查询老师姓名"
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
      <el-form-item label-width="100px" label="是否在职" prop="kzzd4">
        <el-select v-model="queryParams.kzzd4" placeholder="请选择" clearable size="small">
          <el-option
            v-for="dict in zaizhiStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label-width="150px" label="是否有教师资格证" prop="sfyjszgz">
        <el-select v-model="queryParams.sfyjszgz" placeholder="请选择是否有教师资格证" clearable size="small">
          <el-option
            v-for="dict in sfyjszgzOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>-->
        <el-form-item label="毕业状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择毕业状态" clearable size="small">
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
      <!-- <el-col :span="1.5">
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
      >删除</el-button>-->
      <!-- </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['basic:teacher:export']"
        >导出Excel</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      border
      :height="$root.tableHeight"
      :data="teacherList"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" v-if="false" />
      <el-table-column label="老师头像" align="center" prop="lstx" >
        <template slot-scope="scope">
          <div class="block" style="display : flex; width : 100% ; height : 100%">
            <el-image v-if="scope.row.lstx!=null&&scope.row.lstx!=''"
              :src="scope.row.lstx" :preview-src-list="previewPhoto(scope.row.lstx)">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="校区名称" align="center" prop="xqmc" v-if="false" />
      <el-table-column label="老师姓名" align="center" prop="lsxm" />
      <el-table-column label="性别" align="center" prop="xb" :formatter="xbFormat" />
<!--      <el-table-column label="分配的日语班级" align="center" prop="fpbj" />-->
      <el-table-column label="代课日语班级" align="center" prop="dkrybj" />
      <el-table-column label="已代毕业班" align="center" prop="ydrybj" />
      <el-table-column label="入职时间" align="center" prop="rzsj" width="180"  />
      <el-table-column label="工龄(月)" align="center" prop="rzgl" />
      <el-table-column label="身份证号" align="center" prop="sfzh" v-if="false" />
      <el-table-column label="电话号码" align="center" prop="dhhm" />
      <el-table-column label="家庭地址" align="center" prop="jtzz" v-if="false" />
      <el-table-column label="现住址" align="center" prop="xzz" v-if="false" />
      <el-table-column label="紧急联系人" align="center" prop="jjlxr" v-if="false" />
      <el-table-column label="紧急联系人电话" align="center" prop="jjlxrdh" v-if="false" />
      <el-table-column label="毕业学校" align="center" prop="byxx" />
      <el-table-column label="日语等级证书" align="center" prop="kzzd3" />
      <el-table-column label="毕业专业" align="center" prop="byzy" v-if="false" />
      <el-table-column
        label="教师资格证"
        align="center"
        prop="jszgzArr"
        :width="flexColumnWidth('jszgzArr',teacherList)"
      >
        <template slot-scope="scope">
          <div class="block" style="display : flex; width : 100% ; height : 100%">
            <el-image
              style="width: 60px; height: 60px; margin : 0px 5px"
              v-for="(item,index) in scope.row.jszgzArr"
              :key="index"
              :src="item"
              :preview-src-list="scope.row.jszgzArr"
            >
              <div
                slot="error"
                style="width : 100%; height : 100%; display : flex; align-items : center;background : #eee; font-size : 12px;justify-content:center;color : #c0c4cc"
                class="image-slot"
              >
                <span>加载失败</span>
              </div>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="在职状态" align="center" prop="kzzd4">
        <template slot-scope="scope">
          <dict-tag :options="zaizhiStatusOptions" :value="scope.row.kzzd4" />
        </template>
      </el-table-column>
      <el-table-column label="离职时间" align="center" prop="kzzd5" v-if="lzShow"/>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-upload"
            @click="uploadTeacherFilePage(scope.row.id)"
          >上传资料</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="teacherDetails(scope.row.id)"
            v-hasPermi="['basic:teacher:query']"
          >查看更多</el-button>
          <!--<el-button
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
          >删除</el-button>-->
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
  </div>
</template>

<script>
import {
  listHomepage,
  getTeacher,
  delTeacher,
  addTeacher,
  updateTeacher
} from "@/api/basic/teacher";
import { listBjclass } from "@/api/basic/bjclass";
import { listSchool } from "@/api/basic/school";
import { getToken } from "@/utils/auth";
export default {
  name: "TeacherList",
  components: {},
  data() {
    return {
      lzShow:false,//离职信息是否展示
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
        status: "1",// 默认未毕业
        kzzd4: "1" //默认在职
      },
      // 表单参数
      form: {
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
        status: "1",
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
      },
      // 表单校验
      rules: {},
      // 头像
      imageUrl: "",
      //证件照
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      //是否有教师资格证
      isCertificais: false,
      //校区名称
      selectXqmc: [],
      // 班级选择
      bjclassList: [],
      zaizhiStatusOptions: []
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
    this.getDicts("graduateStatus").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("zaizhiStatus").then(response => {
      this.zaizhiStatusOptions = response.data;
    });
    listSchool().then(response => {
      this.selectXqmc = response.rows;
    });
    listBjclass().then(response => {
      this.bjclassList = response.rows;
    });
  },
  methods: {
    /** 查询老师信息列表 */
    getList() {
      this.loading = true;
      listHomepage(this.queryParams).then(response => {
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
        status: "1",
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
      if (this.queryParams.kzzd4==="2"){
        this.lzShow = true
      }else {
        this.lzShow = false
      }
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
      this.title = "添加老师信息";
      // 获取页面中参数配置的路由
      this.getConfigKey("addTeacher").then(resp => {
        this.router = resp.msg;
        this.$router.push({
          path: this.router
        });
      });
    },
    /** 修改按钮操作 */
    handleUpdate(id) {
      this.$router.push({
        path: "/teacherForm/" + id
      });
    },
    // 老师详细信息
    teacherDetails(id) {
      // 获取页面中参数配置的路由
      this.getConfigKey("checkTeacherInformationPage").then(resp => {
        this.router = resp.msg;
        this.$router.push({
          path: this.router + id
        });
      });
    },
    // 上传老师证件照资料的页面
    uploadTeacherFilePage(id){
      // 获取页面中参数配置的路由
      this.getConfigKey("teacherForm").then(resp => {
        this.$router.push({
          path: resp.msg + id
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除老师信息编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delTeacher(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(e => {
          console.log(e);
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "basic/teacher/export",
        {
          ...this.queryParams
        },
        `basic_teacher.xlsx`
      );
    },
    // 宽度适配
    flexColumnWidth(str, tableData) {
      let arr = [];
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i] && tableData[i][str] && tableData[i][str].length > 0) {
          tableData.forEach(obj => {
            if (obj[str] && obj[str].length) arr.push(obj[str].length);
          });
        } else {
          continue;
        }
      }
      return Math.max.call(null, ...arr) * 75;
    },
    // 预览老师头像
    previewPhoto(lstx){
      let arr=[]
      arr.push(lstx)
      return arr
    }
  }
};
</script>

