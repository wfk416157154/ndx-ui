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
      <el-table-column prop="date" label="时间" width="180"></el-table-column>
      <el-table-column prop="kcType" label="课程类型" width="180"></el-table-column>
      <el-table-column prop="monday" title="周一" label="周一" width="180">
        <template slot-scope="scope">
          <el-link
            type="success"
            v-if="scope.row.monday"
            style="color : #67C23A"
          >{{scope.row.monday}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="tuesday" label="周二" width="180">
        <template slot-scope="scope">
          <el-link
            type="success"
            v-if="scope.row.tuesday"
            style="color : #67C23A"
          >{{scope.row.tuesday}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="wednesday" label="周三" width="180">
        <template slot-scope="scope">
          <el-link
            type="success"
            v-if="scope.row.wednesday"
            style="color : #67C23A"
          >{{scope.row.wednesday}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="thursday" label="周四" width="180">
        <template slot-scope="scope">
          <el-link
            type="success"
            v-if="scope.row.thursday"
            style="color : #67C23A"
          >{{scope.row.thursday}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="friday" label="周五" width="180">
        <template slot-scope="scope">
          <el-link
            type="success"
            v-if="scope.row.friday"
            style="color : #67C23A"
          >{{scope.row.friday}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="saturday" label="周六" width="180">
        <template slot-scope="scope">
          <el-link
            type="success"
            v-if="scope.row.saturday"
            style="color : #67C23A"
          >{{scope.row.saturday}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="sunday" label="周日" width="180">
        <template slot-scope="scope">
          <el-link
            type="success"
            v-if="scope.row.sunday"
            style="color : #67C23A"
          >{{scope.row.sunday}}</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "6 : 30 - 7 : 30",
          kcType: "早自习",
          monday: "有课",
          tuesday: "无课",
          wednesday: "有课",
          thursday: "有课",
          friday: "无课",
          saturday: "有课",
          sunday: "有课",
          remark: ""
        },
        {
          date: "8 : 00 - 8 : 45",
          kcType: "第一节课",
          monday: "有课",
          tuesday: "无课",
          wednesday: "有课",
          thursday: "有课",
          friday: "无课",
          saturday: "有课",
          sunday: "有课",
          remark: ""
        }
      ]
    };
  },
  methods: {
    toStudentAttendance(row, column, cell, event) {
      if (column.property === "date" || column.property === "kcType") return;
      let params = {
        date: row.date,
        kcType: row.kcType,
        rq: column.property
      };
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