<template>
  <div class="payment">
    <div style="text-align : center">
      <h4>姓名：张三 班级：汉川二中19级21届</h4>
      <h5>总费用18000 期数：4期 本学期应缴费：4500元 已缴费：9000元 剩余费用：9000元</h5>
    </div>

    <el-table :data="paymentData" :border="true" stripe style="width: 100%">
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="班级"></el-table-column>
      <el-table-column prop="address" label="本期应缴费金额"></el-table-column>
      <el-table-column prop="address" label="实缴金额"></el-table-column>
      <el-table-column prop="address" label="期数"></el-table-column>
      <el-table-column prop="address" label="状态"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="queryData(scope.$index, scope.row)">缴费</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paymentData: [{}]
    };
  },
  created() {},
  mounted() {},
  methods: {}
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