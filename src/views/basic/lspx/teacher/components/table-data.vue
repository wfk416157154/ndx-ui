<template>
  <div class="table-data">
    <el-table :data="gradeStatisticsDtoList" style="width: 100%" border>
      <el-table-column prop="date" label="题型">
        <template slot-scope="scope">
          <span v-if="scope.row.tmlx == 1">单选 ({{scope.row.zs}})</span>
          <span v-if="scope.row.tmlx == 2">判断 ({{scope.row.zs}})</span>
          <span v-if="scope.row.tmlx == 3">填空 ({{scope.row.zs}})</span>
          <span v-if="scope.row.tmlx == 4">阅读 ({{scope.row.zs}})</span>
        </template>
      </el-table-column>
      <el-table-column prop="zqs" label="正确"></el-table-column>
      <el-table-column prop="cws" label="错误"></el-table-column>
      <el-table-column prop="bds" label="半对"></el-table-column>
      <el-table-column prop="wds" label="未答"></el-table-column>
      <el-table-column prop="df" label="得分"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  props: ["gradeStatisticsDtoList"]
};
</script>

<style lang="scss" scoped>
.table-data {
  width: 100%;
  height: 100%;
  margin-top: 40px;
}
</style>
