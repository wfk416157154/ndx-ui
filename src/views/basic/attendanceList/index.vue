<template>
  <div class="attendance-list">
    <el-form :model="attendanceListForm" ref="attendanceListForm" label-width="80px" :inline="true">
      <el-form-item label="时间范围" label-width="120px">
        <el-date-picker
          v-model="attendanceListForm.rq"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="submitQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="attendanceList" border>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="班级" prop="bjid"></el-table-column>
      <el-table-column label="老师" prop="lsid"></el-table-column>
      <el-table-column label="日期" prop></el-table-column>
      <el-table-column label="上课时间" prop></el-table-column>
      <el-table-column label="考勤异常学生" prop></el-table-column>
      <el-table-column label="老师签到情况" prop></el-table-column>
      <el-table-column label="操作" prop>
        <template slot-scope="scope">
          <el-link type="primary" @click="submitQuery(scope.row)">
            <i class="el-icon-view el-icon--right"></i> 查看详情
          </el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      attendanceListForm: {},
      attendanceList: [{}]
    };
  },
  methods: {
    submitQuery(row) {}
  }
};
</script>

<style lang="scss" scoped>
.attendance-list {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>