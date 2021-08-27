<template>
  <div class="classDeatile">
    <div style="text-align : center">
      <h4>{{columnNamelist.bjbt}}</h4>
      <h5>{{columnNamelist.wzsm}}</h5>
    </div>

    <el-table
      ref="multipleTable"
      :data="paymentStudentData"
      tooltip-effect="dark"
      style="width: 100%"
      :border="true"
    >
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column
        v-for="(item,index) in columnNamelist.columnNameList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      >
        <template slot-scope="scope">
          <div v-if="item.prop == 'bqjfzt'">
            <dict-tag :options="paymentStatus" :value="scope.row[item.prop]" />
          </div>
          <div v-else-if="item.prop == 'handle'">
            <el-button
              size="mini"
              v-if="scope.row['bqjfzt'] == '0'"
              type="primary"
              @click="queryData(scope.row)"
              disabled
            >缴费</el-button>
            <el-button
              size="mini"
              v-if="scope.row['bqjfzt'] == '1'"
              type="primary"
              @click="queryData(scope.row)"
              disabled
            >补缴</el-button>
          </div>
          <div v-else>
            <span>{{ scope.row[item.prop] }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  paymentStudent,
  paymentStudentColumnNamelist
} from "@/api/basic/studentPaymentInformation";
export default {
  data() {
    return {
      paymentStudentData: [],
      columnNamelist: []
    };
  },
  created() {
    this.getList(this.$route.params.bjid);
    this.getDicts("payment_status").then(res => {
      this.paymentStatus = res.data;
    });
  },
  methods: {
    // 获取缴费信息列表
    getList(bjid) {
      paymentStudent({ bjid }).then(res => {
        if (res.code == 200) {
          this.paymentStudentData = res.data;
        }
      });
      paymentStudentColumnNamelist({ bjid }).then(res => {
        if (res.code == 200) {
          this.columnNamelist = res.data;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.classDeatile {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>