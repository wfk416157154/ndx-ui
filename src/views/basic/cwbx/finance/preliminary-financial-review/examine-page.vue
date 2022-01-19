<template>
  <div class="examine-page">
    <table style="width : 100%;" border="1" cellspacing="0">
      <tbody>
        <tr>
          <td class="tds">报销人</td>
          <td>{{reimbursementTiem.applyName}}</td>
        </tr>
        <tr>
          <td class="tds">所属部门</td>
          <td>{{reimbursementTiem.departName}}</td>
        </tr>
        <tr>
          <td class="tds">报销类型</td>
          <td>{{statusFormat()}}</td>
        </tr>
        <tr>
          <td class="tds">发生时间</td>
          <td>{{reimbursementTiem.happenTime}}</td>
        </tr>
        <tr>
          <td class="tds">
            费用金额
            大写
          </td>
          <td>
            <p>{{reimbursementTiem.cost}}</p>
            <p>{{reimbursementTiem.costUpper}}</p>
          </td>
        </tr>
        <tr>
          <td class="tds">费用说明</td>
          <td>{{reimbursementTiem.costExplain}}</td>
        </tr>
        <tr>
          <td class="tds">附件</td>
          <td>
            <div v-if="reimbursementTiem.invoiceFormat == 2">
              <el-radio-group
                @change="getInvoicePtatusPaper"
                v-model="reimbursementTiem.invoiceStatusPaper"
              >
                <el-radio
                  :label="item.dictValue"
                  v-for="(item,index) in invoicePtatusPaper"
                  :key="index"
                >{{item.dictLabel}}</el-radio>
              </el-radio-group>
            </div>
            <!-- <h3>图片</h3>
            <div v-for="(item,index) in reimbursementTiem.photoFileList" :key="index">
              <el-image
                style="width: 100px; height: 100px"
                :src="item.wjlj"
                :preview-src-list="[item.wjlj]"
              ></el-image>
            </div> -->
            <h3>文件</h3>
            <div v-for="(item,index) in reimbursementTiem.attachmentFileList" :key="++index">
              <el-link type="primary" @click="openDocument(item.wjlj)">{{item.wjmc}}</el-link>
            </div>
          </td>
        </tr>
        <tr></tr>
        <tr>
          <td class="tds">支付方式</td>
          <td>
            <el-select placeholder v-model="reimbursementTiem.payType">
              <el-option
                v-for="(item,index) in expensePaytype"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="tds">审批意见</td>
          <td>
            <editor
              v-if="pageName == 'fs'"
              v-model="reimbursementTiem.auditReviewOpinion"
              :min-height="300"
            />
            <editor v-else v-model="reimbursementTiem.auditInitOpinion" :min-height="300" />
          </td>
        </tr>
        <tr>
          <td class="tds">操作</td>
          <td>
            <div v-if="pageName == 'cs'">
              <el-button type="success" @click="saveSubmit(2)">同 意</el-button>
              <el-button type="danger" @click="saveSubmit(4)">驳 回</el-button>
            </div>
            <div v-else>
              <el-button type="success" @click="saveSubmit(3)">同 意</el-button>
              <el-button type="danger" @click="saveSubmit(5)">驳 回</el-button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { expenseAudit, editExpense } from "@/api/basic/cw-teacher";
export default {
  data() {
    return {
      reimbursementTiem: {},
      pageName: "",
      expenseType: [],
      expensePaytype: [],
      invoicePtatusPaper: []
    };
  },
  created() {
    this.reimbursementTiem = JSON.parse(this.$route.query.item);
    this.pageName = this.$route.query.name;
    this.getDicts("expense_type").then(response => {
      this.expenseType = response.data;
    });
    this.getDicts("expense_paytype").then(response => {
      this.expensePaytype = response.data;
    });
    this.getDicts("invoice_status_paper").then(response => {
      this.invoicePtatusPaper = response.data;
    });
  },
  methods: {
    openDocument(path) {
      // window.open(`https://view.officeapps.live.com/op/view.aspx?src=${path}`);
      window.open(path);
    },
    statusFormat() {
      return this.selectDictLabel(
        this.expenseType,
        this.reimbursementTiem.expenseType
      );
    },
    getInvoicePtatusPaper() {
      editExpense({
        id: this.reimbursementTiem.id,
        invoiceStatusPaper: this.reimbursementTiem.invoiceStatusPaper
      }).then(res => {
        this.msgSuccess(res.msg);
      });
    },
    saveSubmit(num) {
      this.reimbursementTiem.auditStatus = num;
      expenseAudit(this.reimbursementTiem).then(res => {
        this.msgSuccess(res.msg);
        this.$router.go(-1);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.examine-page {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  th,
  td {
    padding: 40px;
  }
  .tds {
    width: 20%;
  }
}
</style>
