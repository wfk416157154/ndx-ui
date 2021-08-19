<template>
  <div class="eduAdminAttendanceStatistics">
    <el-form
      ref="StatisticsForm"
      :model="StatisticsForm"
      :rules="rules"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker
          v-model="StatisticsForm.startDate"
          type="date"
          format="yyyy-MM-dd"
          placeholder="开始日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker
          v-model="StatisticsForm.endDate"
          type="date"
          format="yyyy-MM-dd"
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
        <el-button type="primary" @click="queryResult">查询</el-button>
      </el-form-item>
    </el-form>

    <template>
      <el-table :data="jwTeaAttenDataItem" border style="width: 100%">
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          v-for="(item,index) in jwColumnNameItem"
          :key="index"
          width="180"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleQuery(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="StatisticsForm.pageNum"
      :limit.sync="StatisticsForm.pageSize"
      @pagination="queryResult"
    />
  </div>
</template>

<script>
import {
  jwColumnNamelist,
  jwTeaAttenDatalist
} from "@/api/basic/teacherAttendance";
export default {
  data() {
    return {
      StatisticsForm: {
        startDate: "",
        endDate: "",
        teacherId: "",
        xqid: "",
        bjid: "",
        pageNum: 1,
        pageSize: 10
      },
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
      total: 0,
      jwColumnNameItem: [],
      jwTeaAttenDataItem: [],
      rules: {
        xqid: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        startDate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        endDate: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        bjid: [{ required: true, message: "请选择活动资源", trigger: "change" }]
      }
    };
  },
  created() {
    this.querySubmit();
  },
  methods: {
    querySubmit() {
      jwColumnNamelist().then(res => {
        if (res.code == 200) {
          this.jwColumnNameItem = res.data;
        }
      });
    },
    queryResult() {
      this.$refs["StatisticsForm"].validate(valid => {
        if (valid) {
          let startDate = this.StatisticsForm.startDate;
          let endDate = this.StatisticsForm.endDate;
          let date1 = new Date(this.StatisticsForm.startDate);
          let date2 = new Date(this.StatisticsForm.endDate);
          let date3 = date2.getTime() / 1000 - date1.getTime() / 1000;
          date3 = date3 / 60 / 60 / 24;
          this.getConfigKey("Limit_days").then(res => {
            if (res.code == 200) {
              if (date3 > res.msg) {
                this.msgError("查询考勤最大天数不得超过60天");
                return;
              } else {
                this.StatisticsForm.startDate =
                  startDate.getFullYear() +
                  "-" +
                  startDate.getMonth() +
                  "-" +
                  startDate.getDate();
                this.StatisticsForm.endDate =
                  endDate.getFullYear() +
                  "-" +
                  endDate.getMonth() +
                  "-" +
                  endDate.getDate();
                jwTeaAttenDatalist(this.StatisticsForm).then(res => {
                  this.jwTeaAttenDataItem = res.data;
                  this.total = this.jwTeaAttenDataItem.length;
                });
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    handleQuery(index, row) {
      this.getConfigKey("teacherAttendanceStatistics").then(res => {
        if (res.code == 200) {
          this.$router.push({
            path:
              res.msg +
              "/" +
              JSON.stringify({ lsid: row.lsid, sj: this.StatisticsForm })
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.eduAdminAttendanceStatistics {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>