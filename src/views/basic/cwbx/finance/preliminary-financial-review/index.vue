<template>
  <div class="public-reimbursement">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="报销类型">
        <el-select v-model="queryParams.expenseType">
          <el-option
            v-for="(item,index) in expenseType"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.auditStatus" placeholder="状态">
          <el-option
            v-for="(item,index) in expenseAuditStatus"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发生时间">
        <el-date-picker
          v-model="queryParams.happenTimeArr"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker
          v-model="queryParams.applyTimeArr"
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

    <el-table :data="listExpense" border style="width: 100%">
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
      <el-table-column label="报销类型" width="180" prop="expenseType">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
          >{{ statusFormat(scope.row.expenseType)}}/{{statusFormatData(scope.row.expenseData)}}</span>
        </template>
      </el-table-column>
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
          <div v-for="(item,index) in scope.row.attachmentFileList" :key="index">
            <el-link
              type="primary"
              @click="openDocument(item.wjlj)"
              v-if="item.fileType == 'pdf'"
            >{{item.wjmc}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发票状态" width="180">
        <template slot-scope="scope">
          <p v-if="scope.row.invoiceFormat == 1" style="margin-left: 10px">电子发票</p>
          <div v-else style="margin-left: 10px">
            <span>纸质发票</span>
            <p v-if="scope.row.invoiceStatusPaper == 1">(已提醒)</p>
            <p v-if="scope.row.invoiceStatusPaper == 2">(已收回)</p>
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
            @click="handleExamine(scope.$index, scope.row)"
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
        pageSize: 10,
        auditStatus: "1"
      },
      total: 0,
      listExpense: [],
      expenseType: [],
      expenseAuditStatus: []
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
      this.expenseAuditStatus = [];
      response.data.forEach(value => {
        let son = ["1", "2", "4"];
        if (son.indexOf(value.dictValue) != -1) {
          this.expenseAuditStatus.push(value);
        }
      });
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
    openDocument(path) {
      // window.open(`https://view.officeapps.live.com/op/view.aspx?src=${path}`);
      window.open(path);
    },
    statusFormat(expenseType) {
      return this.selectDictLabel(this.expenseType, expenseType);
    },
    statusFormatData(expenseData) {
      return this.selectDictLabel(this.expenseDataList, expenseData);
    },
    getExpenseAuditStatus(row, column) {
      return this.selectDictLabel(this.expenseAuditStatus, row.auditStatus);
    },
    handleExamine(index, row) {
      this.getConfigKey("examine-page").then(res => {
        this.$router.push({
          path: res.msg,
          query: {
            item: JSON.stringify(row),
            name: "cs"
          }
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
