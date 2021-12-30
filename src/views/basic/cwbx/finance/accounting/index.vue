<template>
  <div class="public-reimbursement">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="报销类型">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发生时间">
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="listExpense" style="width: 100%">
      <el-table-column label="报销人" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.applyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.departName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报销类型" width="180" prop="expenseData" :formatter="statusFormat"></el-table-column>
      <el-table-column label="发生时间" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.happenTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报销金额" width="180">
        <template slot-scope="scope">
          <p style="margin-left: 10px">{{ scope.row.cost }}</p>
          <p style="margin-left: 10px">{{ scope.row.costUpper }}</p>
        </template>
      </el-table-column>
      <el-table-column label="报销说明">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.costExplain }}</span>
        </template>
      </el-table-column>
      <el-table-column label="附件" width="200">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.attachmentUrl.split(',')" :key="index">
            <a target="_blank" :href="item">{{item}}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发票状态" width="180">
        <template slot-scope="scope">
          <p v-if="scope.row.invoiceFormat == 1" style="margin-left: 10px">电子发票</p>
          <div v-else style="margin-left: 10px">
            <p v-if="scope.row.invoiceStatusPaper == 1">需寄回</p>
            <p v-else>已收回</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="审批状态"
        width="180"
        prop="auditStatus"
        :formatter="getExpenseAuditStatus"
      ></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="scope.row.auditStatus != 7"
            @click="handleView(scope.$index, scope.row)"
          >审 核</el-button>
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
  addExpense,
  editExpense,
  listExpense,
  digitToChinese,
  listExpenseProcess,
  listAreaManager
} from "@/api/basic/cw-teacher";
export default {
  data() {
    return {
      formInline: {
        user: "",
        region: ""
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      listExpense: [],
      expenseType: [],
      expenseAuditStatus: [],
    };
  },
  created() {
    this.getDicts("expense_type").then(response => {
      this.expenseType = response.data;
    });
    this.getDicts("expense_data").then(response => {
      this.expenseDataList = response.data;
    });
    this.getDicts("invoice_format").then(response => {
      this.invoiceFormat = response.data;
    });
    this.getDicts("expense_audit_status").then(response => {
      this.expenseAuditStatus = response.data;
    });
    listAreaManager().then(res => {
      this.getListAreaManager = res.rows;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      listExpense(this.queryParams).then(res => {
        this.listExpense = res.rows;
        this.total = res.total;
      });
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.expenseType, row.expenseData);
    },
    getExpenseAuditStatus(row, column) {
      return this.selectDictLabel(this.expenseAuditStatus, row.auditStatus);
    },
    handleExamine() {
      //examine-page
      this.getConfigKey("examine-page").then(res => {
        this.$router.push({
          path: res.msg
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.public-reimbursement {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>
