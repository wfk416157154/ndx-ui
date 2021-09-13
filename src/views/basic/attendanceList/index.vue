<template>
  <div class="attendance-list">
    <el-form :model="attendanceListForm" ref="attendanceListForm" label-width="80px" :inline="true">
      <el-form-item label="时间范围" label-width="120px">
        <el-date-picker
          v-model="attendanceListForm.qdsjArr"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="attendanceListForm.bjid" filterable placeholder="请选择班级">
          <el-option
            :label="item.rybjmc"
            :value="item.id"
            v-for="(item,index) in classList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="attendanceList" border>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="班级" prop="rybjmc"></el-table-column>
      <el-table-column label="老师" prop="lsxm"></el-table-column>
      <el-table-column label="日期" prop="sjrq"></el-table-column>
      <el-table-column label="上课时间" prop="sksj" width="300"  >
        <template slot-scope="scope">
          <div style="display : flex">
            <dict-tag :options="weeksOptions" :value="scope.row.sksj.split('-')[0]" /> -
            <dict-tag :options="statusOptions" :value="scope.row.sksj.split('-')[1]" /> -
            <span>{{scope.row.sksj.split('-')[2]}} -</span>
            <span>{{scope.row.sksj.split('-')[3]}} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="考勤异常学生" prop="kqycxsxm"></el-table-column>
      <el-table-column label="老师签到情况" prop="lsqdqk" >
        <template slot-scope="scope">
          <div style="display : flex" v-if="scope.row.lsqdqk!=''&&scope.row.lsqdqk!=null">
            <dict-tag :options="teaCheckInTypeOptions" :value="scope.row.lsqdqk.split('-')[0]" />
            <span>-{{scope.row.lsqdqk.split('-')[1]}}分-</span>
            <span>{{scope.row.lsqdqk.split('-')[2]}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
import { listBjclass } from "@/api/basic/bjclass";
import { queryClassQiandaoList } from "@/api/basic/teacherAttendance";
export default {
  data() {
    return {
      attendanceListForm: {},
      attendanceList: [],
      classList: [],
      weeksOptions: [],
      statusOptions: [],
      teaCheckInTypeOptions:[]
    };
  },
  created() {
    listBjclass().then(res => {
      this.classList = res.rows.map(value => {
        value.value = value.id;
        value.label = value.xxmc;
        return value;
      });
    });
    this.getDicts("kc_type").then(res => {
      this.statusOptions = res.data;
    });
    this.getDicts("weeks").then(res => {
      this.weeksOptions = res.data;
    });
    this.getDicts("tea_checkIn_type").then(res => {
      this.teaCheckInTypeOptions = res.data;
    });
  },
  methods: {
    getList() {
      queryClassQiandaoList(this.attendanceListForm).then(res => {
        this.attendanceList = res.rows;
      });
    },
    submitQuery(row) {
      // this.msgError("提示 : 开发中")
      this.getConfigKey("jwattendanceDetails").then(res => {
        if (res.code == 200) {
          this.$router.push({
            path: res.msg + "?query=" + JSON.stringify(row)
          });
        }
      });
    }
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
