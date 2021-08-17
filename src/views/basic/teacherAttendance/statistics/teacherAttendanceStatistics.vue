<template>
  <div class="teacherAttendanceStatistics">
    <el-form ref="StatisticsForm" :model="StatisticsForm" :inline="true" label-width="100px">
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="StatisticsForm.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker
          v-model="StatisticsForm.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="学校">
        <el-select v-model="StatisticsForm.xqid" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="StatisticsForm.bjid" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTeacherAttendanceStatisticsList">查询</el-button>
      </el-form-item>
    </el-form>

    <div
      style="text-align : center;padding : 20px;box-sizing : border-box;font-size : 16px"
    >张宁姿宜兴二中19级22届五月考勤</div>

    <div style="display : flex;justify-content : space-between">
      <div style="width : 49%">
        <el-table :data="resultItem" border style="width: 100%">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            width="100"
            v-for="(item,index) in resultList"
            :key="index"
          ></el-table-column>
        </el-table>
      </div>

      <div style="width : 49%">
        <el-table :data="detailItem" border style="width: 100%">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            width="130"
            v-for="(item,index) in detailList"
            :key="index"
          >
            <template slot-scope="scope">
              <div
                v-if="item.prop == 'worklog' || item.prop == 'leave' || item.prop == 'classRoomPhoto'"
              >
                <dict-tag :options="statisticsResultType" :value="scope.row[item.prop]" />
              </div>
              <div v-else>{{scope.row[item.prop]}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  teacherAttendanceStatistics,
  teacherAttendanceStatisticsList
} from "@/api/basic/teacherAttendance";
export default {
  data() {
    return {
      StatisticsForm: {
        startDate: "",
        endDate: "",
        teacherId: "",
        xqid: "",
        bjid: ""
      },
      detailList: [],
      resultList: [],
      detailItem: [],
      resultItem: [],
      statisticsProject: [],
      statisticsResultType: []
    };
  },
  created() {
    this.gitList();
    this.getTeacherAttendanceStatisticsList();
    this.getDicts("statistics_project").then(res => {
      this.statisticsProject = res.data;
    });
    this.getDicts("statistics_result_type").then(res => {
      this.statisticsResultType = res.data;
    });
  },
  methods: {
    gitList() {
      teacherAttendanceStatistics().then(res => {
        if (res.code == 200) {
          this.detailList = res.data.detailList;
          this.resultList = res.data.resultList;
        }
      });
    },
    getTeacherAttendanceStatisticsList() {
      if (this.$route.params.list == ":list") {
        let no = this.getDate(this.StatisticsForm);
        if (!no) {
          this.getStatisticsList();
        }
        this.StatisticsForm.teacherId = this.$store.state.user.glrid;
      } else {
        let result = JSON.parse(this.$route.params.list);
        this.StatisticsForm.teacherId = result.lsid;
        this.StatisticsForm.startDate = result.sj.startDate;
        this.StatisticsForm.endDate = result.sj.endDate;
        let no = this.getDate(this.StatisticsForm);
        if (!no) {
          this.getStatisticsList();
        }
      }
    },
    getStatisticsList() {
      teacherAttendanceStatisticsList(this.StatisticsForm).then(res => {
        if (res.code == 200) {
          this.resultItem = res.data.resultList;
          this.detailItem = res.data.detailList;
          for (let j = 0; j < this.resultItem.length; j++) {
            for (let i = 0; i < this.statisticsProject.length; i++) {
              if (
                this.resultItem[j].project ==
                this.statisticsProject[i].dictValue
              ) {
                this.resultItem[j].project = this.statisticsProject[
                  i
                ].dictLabel;
              }
            }
          }
        }
      });
    },
    getDate() {
      let date1 = new Date(this.StatisticsForm.startDate);
      let date2 = new Date(this.StatisticsForm.endDate);
      let date3 = date2.getTime() / 1000 - date1.getTime() / 1000;
      this.getConfigKey("Limit days").then(res => {
        if (res.code == 200) {
          if (date > res.msg) {
            this.msgError("查询考勤最大天数不得超过60天");
            return true;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.teacherAttendanceStatistics {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>