<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="日语班级" prop="kzzd1">
        <el-select v-model="queryParams.kzzd1" disabled placeholder="请选择日语班">
          <el-option
            v-for="item in bjclassList"
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学期" prop="xq">
        <el-select v-model="queryParams.xq" placeholder="请选择学期">
          <el-option
            v-for="(item,index) in xueqiList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试范围" prop="ksfw">
        <el-select v-model="queryParams.ksfw" @change="getKsmc" placeholder="请选择考试范围">
          <el-option
            v-for="(item,index) in getListExaminationPaper"
            :key="index"
            :label="item.ksfw"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试类型" prop="kslx">
        <el-select v-model="queryParams.kslx" placeholder="请选择考试类型">
          <el-option
            v-for="(item,index) in getExaminationType"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getWhole">全部</el-button>
        <!-- <el-button type="primary" icon="el-icon-search" size="mini" @click="handleExport">导出成绩</el-button> -->
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 所有数据 -->
    <div v-if="allData">
      <el-table
        :data="listAll"
        border
        :cell-style="addClass"
        :summary-method="getSummaries"
        show-summary
        style="width: 100%"
      >
        <el-table-column
          :fixed="item.fixed"
          :label="item.label"
          align="center"
          v-for="(item,index) in columnNameList"
          :key="index"
          :prop="item.prop"
        >
          <template slot-scope="scope">
            <span
              v-if="item.prop == 'xsxm' || item.prop == 'rybj' ||  item.prop == 'zhcj'"
            >{{scope.row[item.prop]}}</span>

            <span
              v-if="item.prop == 'wl'"
            >{{selectDictLabel(wlOption,scope.row[item.prop])}}</span>
            <div v-else>
              <div
                v-if="scope.row[item.colour] == 1"
                style="background : #67C23A; display : inline-block ; width :100%;color : #fff"
              >{{scope.row[item.prop]}}</div>
              <span
                v-if="scope.row[item.colour] == 2"
                style="background : #E6A23C; display : inline-block ; width :100%;color : #fff"
              >{{scope.row[item.prop]}}</span>
              <span
                v-if="scope.row[item.colour] == 3"
                style="background : red; display : inline-block ; width :100%;color : #fff"
              >{{scope.row[item.prop]}}</span>
              <span
                v-if="scope.row[item.colour] == 4"
              >{{scope.row[item.prop]}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="totalNum">
        <span>共{{total}}条</span>
      </div>
    </div>
    <!-- 详细数据 -->
    <div v-else>
      <scoreChart ref="getChart" :getExaminationType="getExaminationType" :query="queryParams" />
    </div>
  </div>
</template>

<script>
import {
  // listStugrade,
  getStugrade,
  delStugrade,
  addStugrade,
  updateStugrade,
  listAll,
  getColumnNameList
} from "@/api/basic/stugrade";
import { listBjclass } from "@/api/basic/bjclass";
import { listSchool } from "@/api/basic/school";
import { getToken } from "@/utils/auth";
import scoreChart from "./components/scoreChart";
import { listExaminationPaper } from "@/api/basic/examinationPaper";
export default {
  name: "Stugrade",
  components: {},
  inject: ["reload"],
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
      // 学生成绩基础表表格数据
      // stugradeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        kzzd1: null,
        xq: null,
        ksfw: null,
        kslx: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 用户导入参数
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "导入学生成绩基础表数据",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "basic/stugrade/importData"
      },
      rules: {
        yyfs: [
          {
            required: false,
            message: "格式不对,只能填写数字",
            trigger: "blur",
            pattern: /^[0-9]+$/
          }
        ],
        zhcj: [
          {
            required: false,
            message: "格式不对,只能填写数字",
            trigger: "blur",
            pattern: /^[0-9]+$/
          }
        ]
      },
      // 动态table-column
      columnNameList: [],
      // 获取学生成绩表
      listAll: [],
      //校区名称字典
      selectXqmc: [],
      // 日语班级字典
      bjclassList: [],
      // 学期字典
      xueqiList: [],
      // 班级id
      bjid: "",
      // 所有数据详细数据切换
      allData: true,
      // 获取考试范围
      getListExaminationPaper: [],
      //  考试类型
      getExaminationType: [],
      wlOption:[]
    };
  },
  created() {
    this.getList();
    listBjclass().then(response => {
      this.bjclassList = response.rows;
    });
    this.getDicts("basic_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("examination_type").then(response => {
      this.getExaminationType = response.data;
    });
    this.getDicts("nianji").then(response => {
      this.xueqiList = response.data;
    });
    this.getDicts("xkType").then(response => {
      this.wlOption = response.data;
    });

  },
  components: {
    scoreChart
  },
  mounted() {},
  methods: {
    /** 查询学生成绩基础表列表 */
    getList() {
      this.loading = true;
      // 获取传过来的班级id
      this.bjid = this.$route.params.id;
      this.queryParams.kzzd1 = this.bjid;// 给查询日语班级赋值
      // // 校区
      // listSchool(this.queryParams).then(response => {
      //   this.selectXqmc = response.rows;
      // });
      // this.queryParams.rybj=this.bjid // 给查询日语班级赋值
      // 班级

      // 学生成绩表数据
      listAll(this.queryParams).then(res => {
        this.listAll = res.rows;
        this.total = res.total;
      });
      // 学生成绩表title列
      getColumnNameList(this.queryParams).then(res => {
        this.columnNameList = res.data;
        for (let i = 0; i < 5; i++) {
          this.columnNameList[i].fixed = true;
        }
      });
      // 考试范围
      listExaminationPaper({
        bjid: this.bjid,
        lsid: this.$store.state.user.glrid
      }).then(res => {
        this.getListExaminationPaper = res.rows;
      });
    },
    // 获取考试名称
    getKsmc(ksfwId) {
      this.getListExaminationPaper.forEach(value => {
        if (value.id == ksfwId) {
          return (this.queryParams.ksmc = value.ksfw);
        }
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
        xsbh: null,
        xsxm: null,
        kzzd1: null,
        wl: null,
        yyfs: null,
        zhcj: null,
        status: "1",
        remark: null,
        userId: null,
        uName: null,
        orgBh: null,
        orgName: null,
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
      if (this.queryParams.ksmc && this.queryParams.ksfw) {
        // this.allData = false;
        // if (this.$refs.getChart) {
        //   this.$refs.getChart.getChart();
        // }
        this.allData = false;
        this.$nextTick(() => {
          this.$refs.getChart.getChart();
        });
      }
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
      this.title = "添加学生成绩基础表";
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "basic/stugrade/export",
        {
          ...this.queryParams
        },
        `学生成绩基础表.xlsx`
      );
    },
    // 全部按钮
    getWhole() {
      this.allData = true;
      this.reload();
    },
    // 数据单元格背景颜色
    addClass({ row, column, rowIndex, columnIndex }) {
      // console.log(column.property);
      //  for(let i = 0; i < )
    },
    // 平均数
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "平均分";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "分";
        } else {
          sums[index] = "N/A";
        }
      });
      for (let i = 1; i < 3; i++) {
        sums[i] = "";
      }
      for (let i = 3; i < sums.length; i++) {
        sums[i] = (parseInt(sums[i]) / this.listAll.length).toFixed(2) + "分";
      }
      return sums;
    }
  }
};
</script>
<style lang="scss">
.totalNum {
  height: 50px;
  line-height: 50px;
  margin-right: 20px;
  font-size: 16px;
  font-weight: 200;
  float: right;

  .cell-grey {
    background: red;
  }
}
</style>
