<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item>
        <el-button type="success" size="mini" @click="getStatus([3])">已审核</el-button>
        <el-button type="danger" size="mini" @click="getStatus([1,2])">未审核</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      style="width: 100%;font-size : 18px"
      :height="$root.tableHeight"
      border
      :data="lessonPreparationDataList"
    >
      <el-table-column label="班级" align="center" prop="rybjmc" />
      <el-table-column label="老师" align="center" prop="lsxm" />
      <el-table-column label="教材" align="center" prop="jcmc" />
      <el-table-column label="教程安排" align="center" prop="kcrwmc" />
      <el-table-column
        label="教案审核状态"
        align="center"
        prop="jashzt"
        :formatter="getPrepareLessonAuditStatus"
      />
      <el-table-column
        label="教案状态"
        align="center"
        prop="shzt"
        :formatter="getPreparelesoonsStatus"
      />
      <!-- <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="viewSecondaryMenu(scope.row)">查看</el-button>
        </template>
      </el-table-column>-->
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
import { listAcdemicDean } from "@/api/basic/bkgl";
export default {
  name: "prepareLessons",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 查询列表数据
      lessonPreparationDataList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jashztArr: []
      },
      form: {},
      // 查看编辑
      viewDialogFormVisible: false,
      assignorList: [],
      // 教案状态
      preparelesoonsStatus: [],
      // 教案审核状态
      prepareLessonAuditStatus: []
    };
  },
  created() {
    this.getList();
    // 教案状态
    this.getDicts("preparelesoons_status").then(response => {
      this.preparelesoonsStatus = response.data;
    });

    // 教案审核状态
    this.getDicts("prepareLessonAuditStatus").then(response => {
      this.prepareLessonAuditStatus = response.data;
    });
  },
  methods: {
    /** 查询备课列表 */
    getList() {
      if (this.$route.query.list) {
        let { fplsid, fpzStartDate, fpzEndDate } = this.$route.query.list;
        this.queryParams.fplsid = fplsid;
        this.queryParams.fpzStartDate = fpzStartDate;
        this.queryParams.fpzEndDate = fpzEndDate;
        this.loading = true;
        listAcdemicDean(this.queryParams).then(response => {
          this.lessonPreparationDataList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      }
    },
    // 状态
    getStatus(zt) {
      this.queryParams.jashztArr = zt;
      this.getList();
    },
    // 教案审核状态字典翻译
    getPrepareLessonAuditStatus(row, column) {
      return this.selectDictLabel(this.prepareLessonAuditStatus, row.jashzt);
    },
    // 教案状态字典翻译
    getPreparelesoonsStatus(row, column) {
      return this.selectDictLabel(this.preparelesoonsStatus, row.shzt);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 查看
    viewSecondaryMenu(row) {
      // this.getConfigKey("dd-zz-lesson-preparation-index").then(res => {
      //   this.router = res.msg;
      //   this.$router.push({
      //     path: this.router,
      //     query: {
      //       list: row
      //     }
      //   });
      // });
    }
  }
};
</script>
