<template>
  <div class="print-page">
    <div class="content-wrap">
      <el-card shadow="hover">
        <h2>数据打印</h2>
        <div style="float : right">
          <el-button @click="onPrintJs" type="primary">打印</el-button>
        </div>
        <br />
        <br />
        <div id="printRef" style="text-align: center;font-size: 12px;">
          <table style="width : 100%;text-align:center" border="1" cellspacing="0">
            <tbody>
              <tr>
                <td class="tds" style="width : 180px">编号</td>
                <td>
                  <div style="width:100%;display:flex">
                    <div
                      style="width : 40%;height : 40px ;border-right:2px solid #000; line-height : 40px"
                    >{{getExpensePaytype()}}</div>
                    <div
                      style="width : 20%;height : 40px ;border-right:2px solid #000; line-height : 40px"
                    >提交时间</div>
                    <div
                      style="width : 40%;height : 40px ; line-height : 40px"
                    >{{reimbursementPrint.createTime}}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="tds">申请人</td>
                <td>
                  <div style="width:100%;display:flex">
                    <div
                      style="width : 40%;height : 40px ;border-right:2px solid #000; line-height : 40px"
                    >{{reimbursementPrint.applyName}}</div>
                    <div
                      style="width : 20%;height : 40px ;border-right:2px solid #000; line-height : 40px"
                    >所在部门</div>
                    <div
                      style="width : 40%;height : 40px ; line-height : 40px"
                    >{{reimbursementPrint.departName}}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="tds">报销类型</td>
                <td>
                  <div style="width:100%;display:flex">
                    <div
                      style="width : 40%;height : 40px ;border-right:2px solid #000; line-height : 40px"
                    >{{statusFormat()}}</div>
                    <div
                      style="width : 20%;height : 40px ;border-right:2px solid #000; line-height : 40px"
                    >发生时间</div>
                    <div
                      style="width : 40%;height : 40px ; line-height : 40px"
                    >{{reimbursementPrint.happenTime}}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="tds">金额</td>
                <td
                  style="padding : 20px"
                >{{reimbursementPrint.cost}} ({{reimbursementPrint.costUpper}})</td>
              </tr>
              <tr>
                <td class="tds">费用说明</td>
                <td style="padding : 20px">{{reimbursementPrint.costExplain}}</td>
              </tr>
              <tr>
                <td class="tds">初审</td>
                <td>
                  <div style="width:100%;display:flex">
                    <div
                      style="width : 40%;height : 40px ;border-right:2px solid #000; line-height : 40px"
                    >
                      {{reimbursementPrint.auditInitName}}
                      {{reimbursementPrint.auditInitTime}}
                    </div>
                    <div
                      style="width : 20%;height : 40px ;border-right:2px solid #000; line-height : 40px"
                    >复审</div>
                    <div style="width : 40%;height : 40px ; line-height : 40px">
                      {{reimbursementPrint.auditReviewName}}
                      {{reimbursementPrint.auditReviewTime}}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <img width="80%" :src="imgUrl.wjlj" alt />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import printJs from "@/components/print";
export default {
  mixins: [printJs],
  data() {
    return {
      reimbursementPrint: {},
      imgUrl: {},
      expenseType: [],
      expensePaytype: []
    };
  },
  created() {
    this.getDicts("expense_type").then(response => {
      this.expenseType = response.data;
    });
    this.getDicts("expense_paytype").then(response => {
      this.expensePaytype = response.data;
    });
    this.reimbursementPrint = JSON.parse(this.$route.query.item);
    this.imgUrl = this.reimbursementPrint.photoFileList[0];
  },
  methods: {
    statusFormat() {
      return this.selectDictLabel(
        this.expenseType,
        this.reimbursementPrint.expenseType
      );
    },
    getExpensePaytype() {
      let bh = "";
      this.expensePaytype.forEach(value => {
        bh = value.remark + this.reimbursementPrint.serialNumber;
      });
      return bh;
    }
  }
};
</script>

<style lang="scss" scoped>
.print-page {
  width: 100%;
  padding: 100%;
  padding: 40px;
  box-sizing: border-box;
  .content-wrap {
    text-align: center;
  }
  #printRef {
    margin-top: 20px;
  }
  th,
  td {
    // height: 40px;
  }
  .tds {
    width: 15%;
  }
}
</style>
