<template>
  <div class="dataDownload">
    <div style="text-align : center">
      <h1>南斗星资料</h1>
    </div>

    <el-form ref="dataDownloadForm" model="dataDownloadForm">
      <el-form-item label="类型">
        <el-select v-model="dataDownloadForm.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column prop="date" label="标题"></el-table-column>
      <el-table-column prop="name" label="要求"></el-table-column>
      <el-table-column prop="address" width="180" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="queryData(scope.$index, scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataDownloadForm: {},
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
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.dataDownload {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>