<template>
  <div id="statistical">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="formInline.fpsjArr"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button type="warning" plain icon="el-icon-download" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="rownum" label="序号" width="180"></el-table-column>
      <el-table-column prop="zzm" label="组长名" width="180"></el-table-column>
      <el-table-column prop="wshs" label="未审核数"></el-table-column>
      <el-table-column prop="yshs" label="已审核数"></el-table-column>
      <el-table-column prop="zs" label="总数"></el-table-column>
      <el-table-column prop="jcmc" label="教材名称"></el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="formInline.pageNum"
      :limit.sync="formInline.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { leaderPrepareLessonsStatistics } from "@/api/basic/tj";
export default {
  data() {
    return {
      formInline: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      tableData: []
    };
  },
  methods: {
    getList() {
      leaderPrepareLessonsStatistics(this.formInline).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    handleExport() {
      this.download(
        "basic/prepareLessons/leaderPrepareLessonsStatisticsExport",
        {
          ...this.formInline
        },
        `组长审核备课统计.xlsx`
      );
    }
  }
};
</script>

<style lang="scss" scoped>
#statistical {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>
