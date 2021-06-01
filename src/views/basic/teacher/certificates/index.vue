<template>
  <div class="firstTry">
    <firstTryForm/>
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="date" label="日期" width="120"></el-table-column>
      <el-table-column property="name" label="姓名" width="120"></el-table-column>
      <el-table-column property="dh" label="电话" width="120"></el-table-column>
      <el-table-column property="address" label="地区"></el-table-column>
      <el-table-column property="lr" label="录入"></el-table-column>
      <el-table-column property="xs" label="线上"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import firstTryForm from "./firstTryForm"
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
      ],
      currentRow: null,
    };
  },
  components : {
     firstTryForm,
  },
  methods: {
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  }
};
</script>

<style lang="scss">
.firstTry {
  padding: 50px;
  box-sizing: border-box;
  .firstTry-add{
      margin-bottom: 20px;
  }
}
</style>