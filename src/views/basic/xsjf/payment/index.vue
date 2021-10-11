<template>
  <div class="payment">
    <div style="text-align : center">
      <h4>姓名 : {{paymentData.xsxm}} 班级 : {{paymentData.rybjmc}}</h4>
      <h5>总费用 : {{paymentData.zfy}}元 总期数 : {{paymentData.zqs}} 本学期应缴费 : {{paymentData.bxqyjf}}元 已缴费 : {{paymentData.yjzfy}}元 剩余费用 : {{paymentData.sywjzfy}}元</h5>
    </div>
    <el-table :data="paymentData.dataList" :border="true" stripe style="width: 100%;font-size : 18px">
      <el-table-column prop="xsxm" label="姓名" width="180"></el-table-column>
      <el-table-column prop="rybjmc" label="班级"></el-table-column>
      <el-table-column prop="bqyjf" label="本期应缴费金额"></el-table-column>
      <el-table-column prop="bqsjf" label="实缴金额"></el-table-column>
      <el-table-column prop="qs" label="期数"></el-table-column>
      <el-table-column prop="jfzt" label="状态">
        <template slot-scope="scope">
          <dict-tag :options="paymentStatus" :value="scope.row.jfzt" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryStuPaymentDetail } from "@/api/basic/payment";
export default {
  data() {
    return {
      paymentData: [],
      paymentStatus: []
    };
  },
  created() {
    this.getList();
    this.getDicts("payment_status").then(res => {
      this.paymentStatus = res.data;
    });
  },
  mounted() {},
  methods: {
    getList() {
      queryStuPaymentDetail({
        xsbh: this.$store.state.user.glrid
      }).then(res => {
        this.paymentData = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.payment {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>
