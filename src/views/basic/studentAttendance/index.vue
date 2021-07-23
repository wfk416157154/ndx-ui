<template>
  <div class="studentAttendance">
    <h4 style="color : #606266">课表</h4>
    <el-table
      @cell-click="toStudentAttendance"
      :data="tableData"
      border
      style="width: 100%;"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column prop="kssj" label="开始时间" width="180"></el-table-column>
      <el-table-column prop="jssj" label="结束时间" width="180"></el-table-column>
      <el-table-column prop="kcType" label="课程类型" width="180">
        <template slot-scope="scope">
          <el-select disabled v-model="scope.row.kcType" placeholder="请选择">
            <el-option
              v-for="item in kcType"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="monday" title="周一" label="周一" width="180">
        <template slot-scope="scope">
          <el-link
            type="success"
            v-if="scope.row.monday"
            style="color : #67C23A"
          >{{scope.row.mondayDetails.ybj + ": 共" + scope.row.mondayDetails.yjskrs + "人"}}</el-link>
          <span v-else type="warning">暂无安排</span>
        </template>
      </el-table-column>
      <el-table-column prop="tuesday" label="周二" width="180">
        <template slot-scope="scope">
          <el-link
            type="success"
            v-if="scope.row.tuesday"
            style="color : #67C23A"
          >{{scope.row.tuesdayDetails.ybj + ": 共" + scope.row.tuesdayDetails.yjskrs + "人"}}</el-link>
          <span v-else type="warning">暂无安排</span>
        </template>
      </el-table-column>
      <el-table-column prop="wednesday" label="周三" width="180">
        <template slot-scope="scope">
          <el-link
            type="success"
            v-if="scope.row.wednesday"
            style="color : #67C23A"
          >{{scope.row.wednesdayDetails.ybj + ": 共" + scope.row.wednesdayDetails.yjskrs + "人"}}</el-link>
          <span v-else type="warning">暂无安排</span>
        </template>
      </el-table-column>
      <el-table-column prop="thursday" label="周四" width="180">
        <template slot-scope="scope">
          <el-link
            type="success"
            v-if="scope.row.thursday"
            style="color : #67C23A"
          >{{scope.row.thursdayDetails.ybj + ": 共" + scope.row.thursdayDetails.yjskrs + "人"}}</el-link>
          <span v-else type="warning">暂无安排</span>
        </template>
      </el-table-column>
      <el-table-column prop="friday" label="周五" width="180">
        <template slot-scope="scope">
          <el-link
            type="success"
            v-if="scope.row.friday"
            style="color : #67C23A"
          >{{scope.row.fridayDetails.ybj + ": 共" + scope.row.fridayDetails.yjskrs + "人"}}</el-link>
          <span v-else type="warning">暂无安排</span>
        </template>
      </el-table-column>
      <el-table-column prop="saturday" label="周六" width="180">
        <template slot-scope="scope">
          <el-link
            type="success"
            v-if="scope.row.saturday"
            style="color : #67C23A"
          >{{scope.row.saturdayDetails.ybj + ": 共" + scope.row.saturdayDetails.yjskrs + "人"}}</el-link>
          <span v-else type="warning">暂无安排</span>
        </template>
      </el-table-column>
      <el-table-column prop="sunday" label="周日" width="180">
        <template slot-scope="scope">
          <el-link
            type="success"
            v-if="scope.row.sunday"
            style="color : #67C23A"
          >{{scope.row.sundayDetails.ybj + ": 共" + scope.row.sundayDetails.yjskrs + "人"}}</el-link>
          <span v-else type="warning">暂无安排</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { teaEnableCourseQuery } from "@/api/basic/classCourseBasic";
export default {
  data() {
    return {
      // 课表数据
      tableData: [],
      // 课程类型
      kcType: []
    };
  },
  created() {
    this.getDicts("kc_type").then(response => {
      this.kcType = response.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      teaEnableCourseQuery(this.$store.state.user.glrid).then(res => {
        res.rows.map(value => {
          value.mondayDetails = value.mondayDetails[0];
          value.tuesdayDetails = value.tuesdayDetails[0];
          value.wednesdayDetails = value.wednesdayDetails[0];
          value.thursdayDetails = value.thursdayDetails[0];
          value.fridayDetails = value.fridayDetails[0];
          value.saturdayDetails = value.saturdayDetails[0];
          value.sundayDetails = value.sundayDetails[0];
        });
        this.tableData = res.rows;
      });
    },
    toStudentAttendance(row, column, cell, event) {
      if (
        !row[column.property] ||
        column.property === "kssj" ||
        column.property === "jssj" ||
        column.property === "kcType"
      )
        return;
      let params = {
        kssj: row.kssj,
        jssj: row.jssj,
        bjid: row.bjid,
        kcType: row.kcType,
        xq: column.property
      };
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          if (key == column.property) {
            params[key] = row[key];
          }
        }
      }
      this.kcType.forEach(value => {
        if (value.dictValue == row.kcType) {
          params.kcTypeName = value.dictLabel;
        }
      });
      this.getConfigKey("attendanceDetails").then(res => {
        if (res.code == 200) {
          this.$router.push({
            path: res.msg + "?query=" + JSON.stringify(params)
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.studentAttendance {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  //   cursor: pointer;
}
</style>