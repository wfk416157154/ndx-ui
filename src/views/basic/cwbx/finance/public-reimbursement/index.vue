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
      <el-form-item label="复审时间">
        <el-date-picker
          v-model="queryParams.applyTimeArr"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="报销人">
        <el-input v-model="queryParams.applyName" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select placeholder v-model="queryParams.payType">
          <el-option
            v-for="(item,index) in expensePaytype"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="纸质发票状态">
        <el-select placeholder v-model="queryParams.invoiceStatusPaper">
          <el-option
            v-for="(item,index) in invoiceStatusPaper"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额范围">
        <el-input v-model="queryParams.costMin" style="width : 100px" placeholder="请输入内容"></el-input>-
        <el-input v-model="queryParams.costMax" style="width : 100px" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
        <el-button type="primary" @click="handleSettlement">结算</el-button>
        <el-button type="primary" @click="noPrint(0)">未打印</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="multipleTable"
      :data="listExpense"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
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
          <div v-for="(item,index) in scope.row.attachmentFileList" :key="index">
            <el-link type="primary" @click="openDocument(item.wjlj)">{{item.wjmc}}</el-link>
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
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.row)">查 看</el-button>
          <el-button size="mini" @click="handlePrint(scope.row)">打 印</el-button>
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

    <el-dialog title="结算" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="报销人" label-width="100px">
          <span>{{reimbursementForm.name}}</span>
        </el-form-item>
        <el-form-item label="报销总金额" label-width="100px">
          <span>{{reimbursementForm.jexx}}元({{reimbursementForm.jedx}})</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="toSettlement">结 算</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listExpense,
  digitToChinese,
  listExpenseProcess,
  listAreaManager,
  settleAccount
} from "@/api/basic/cw-teacher";
export default {
  data() {
    return {
      expensePaytype: [],
      invoiceStatusPaper: [],
      expenseType: [],
      expenseDataList: [],
      listExpense: [],
      expenseAuditStatus: [],
      invoiceFormat: [],
      multipleSelection: [],
      reimbursementForm: {
        ids: [],
        name: "",
        jexx: 0,
        jedx: ""
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dialogFormVisible: false
    };
  },
  created() {
    this.getDicts("expense_paytype").then(response => {
      this.expensePaytype = response.data;
    });
    this.getDicts("invoice_status_paper").then(response => {
      this.invoiceStatusPaper = response.data;
    });
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
    openDocument(path) {
      window.open(`https://view.officeapps.live.com/op/view.aspx?src=${path}`);
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.expenseType, row.expenseData);
    },
    getExpenseAuditStatus(row, column) {
      return this.selectDictLabel(this.expenseAuditStatus, row.auditStatus);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleView(row) {
      this.getConfigKey("public-reimbursement-details").then(res => {
        this.$router.push({
          path: res.msg,
          query: {
            item: JSON.stringify(row)
          }
        });
      });
    },
    handleExport() {},
    handleSettlement() {
      if (this.multipleSelection.length == 0) {
        this.msgError("提示 : 请选择对应报销数据");
        return;
      }
      this.reimbursementForm = {
        ids: [],
        name: "",
        jexx: 0,
        jedx: ""
      };
      this.multipleSelection.forEach(value => {
        this.reimbursementForm.ids.push(value.id);
        this.reimbursementForm.name += `${value.applyName},`;
        this.reimbursementForm.jexx += parseFloat(value.cost);
      });
      digitToChinese(this.reimbursementForm.jexx).then(res => {
        this.reimbursementForm.jedx = res.data;
        this.dialogFormVisible = true;
      });
    },
    toSettlement() {
      settleAccount({ ids: this.reimbursementForm.ids }).then(res => {
        this.msgSuccess(res.msg);
        this.getList();
        this.dialogFormVisible = false;
      });
    },
    handleExport() {
      this.download(
        "/basic/expense/export",
        {
          ...this.queryParams
        },
        `报销-${new Date().getTime()}.xlsx`
      );
    },
    handlePrint(row) {
      this.getConfigKey("print-page").then(res => {
        this.$router.push({
          path: res.msg,
          query: {
            item: JSON.stringify(row)
          }
        });
      });
    },
    noPrint(num) {
      this.queryParams.kzzd1 = num;
      this.getList();
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
