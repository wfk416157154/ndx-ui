<template>
  <div class="teacherAttendanceStatistics">
    <el-form ref="StatisticsForm" :model="StatisticsForm" :rules="rulesForm" :inline="true" label-width="100px">
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker
          v-model="StatisticsForm.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker
          v-model="StatisticsForm.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="日语班级" prop="bjid">
        <el-select v-model="StatisticsForm.bjid" filterable placeholder="请选择日语班级">
          <el-option
            v-for="item in queryBjclassList "
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh"  @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div
      style="text-align : center;padding : 20px;box-sizing : border-box;font-size : 16px"
    >{{teacherAndBjmc}}</div>

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
import {
  listBjclass,
} from "@/api/basic/bjclass";
export default {
  data() {
    return {
      /* 老师姓名和班级名称+日期范围 */
      teacherAndBjmc:"",
      StatisticsForm: {
        startDate: "",
        endDate: "",
        teacherId: this.$store.state.user.glrid,
        xqid: "",
        bjid: ""
      },
      rulesForm:{
        startDate: [
          { required: true, message: "请选择开始日期", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "请选择结束日期", trigger: "blur" }
        ],
      },
      detailList: [],
      resultList: [],
      detailItem: [],
      resultItem: [],
      statisticsProject: [],
      statisticsResultType: [],
      queryBjclassList:[],// 班级列表
      limitDays:31 // 查询范围最多可允许的天数
    };
  },
  created() {
    this.getLimitDays();//从参数配置中获取限制的最大日期范围天数
    this.getColumnNameList();// 获取动态列名
    this.pageTurnInvokeMethod();// 从列表页面点击【查看】按钮跳转过来时执行的方法
    this.getDicts("statistics_project").then(res => {
      this.statisticsProject = res.data;
    });
    this.getDicts("statistics_result_type").then(res => {
      this.statisticsResultType = res.data;
    });
  },
  methods: {
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("StatisticsForm");
    },
    /* 获取动态列名 */
    getColumnNameList() {
      teacherAttendanceStatistics().then(res => {
        if (res.code == 200) {
          this.detailList = res.data.detailList;
          this.resultList = res.data.resultList;
        }
      });
    },
    /* 点击查询按钮触发 */
    queryData() {
      this.$refs.StatisticsForm.validate(valid => {
        if (valid) {
          let no = this.getDate();
          if (!no) {
            this.getStatisticsList();
          }
        }
      })
    },
    /* 从列表页面点击【查看】按钮跳转过来时执行的方法 */
    pageTurnInvokeMethod(){
      if (this.$route.params.list != ":list") {// 非老师角色查看
        let result = JSON.parse(this.$route.params.list);// 转成json的格式进行页面传参
        this.StatisticsForm.xqid=result.params.xqid;// 父页面传过来的校区id
        this.StatisticsForm.bjid=result.params.bjid;// 父页面传过来的班级id
        this.StatisticsForm.teacherId = result.lsid;// 父页面传过来的老师id
        this.StatisticsForm.startDate = result.params.startDate;// 父页面传过来的开始日期
        this.StatisticsForm.endDate = result.params.endDate;// 父页面传过来的结束日期
        let bjParams={
          lsid:this.StatisticsForm.teacherId,// 老师id
          id:this.StatisticsForm.bjid // 日语班级id
        }
        // 查询班级列表
        listBjclass(bjParams).then(response => {// 根据父页面传过来的老师id和班级id进行查询
          this.queryBjclassList = response.rows
        });
        // 校验选择的日期范围
        let no = this.getDate();
        if (!no) {
          this.getStatisticsList();
        }
      }else{// 老师选择班级时
        listBjclass().then(response => {
          this.queryBjclassList = response.rows
        });
      }
    },
    /* 获取统计的数据 */
    getStatisticsList() {
      teacherAttendanceStatisticsList(this.StatisticsForm).then(res => {
        if (res.code == 200) {
          this.teacherAndBjmc=res.data.title;
          this.resultItem = res.data.resultList;
          this.detailItem = res.data.detailList;
          for (let j = 0; j < this.resultItem.length; j++) {
            for (let i = 0; i < this.statisticsProject.length; i++) {
              if (this.resultItem[j].project ==this.statisticsProject[i].dictValue) {
                this.resultItem[j].project = this.statisticsProject[i].dictLabel;
              }
            }
          }
        }
      });
    },
    /**
     * 判断选择的日期范围是否是限制的范围内
     * @returns {boolean}
     */
    getDate() {
      let date1 = new Date(this.StatisticsForm.startDate);
      let date2 = new Date(this.StatisticsForm.endDate);
      let date3 =(date2.getTime() / 1000 - date1.getTime() / 1000)/ 60 / 60 / 24;
      if (date3 > this.limitDays) {
        this.msgError("查询考勤最大天数不得超过"+this.limitDays+"天");
        return true;
      }
      return false;
    },
    /**
     * 从参数配置中获取限制的最大日期范围天数
     */
    getLimitDays(){
      this.getConfigKey("Limit_days").then(res => {
        this.limitDays=res.msg;
      })
    },
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
