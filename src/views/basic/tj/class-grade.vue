<template>
  <div id="statisticalChartTtem">
    <ul class="wrap-achievement clearfix">
      <div>
        <el-button
          v-for="item in studentGradeTypeList"
          :key="item.dictValue"
          type="primary"
          class="el-btn"
          plain
          @click="getAchievement(item.dictValue)"
        >{{item.dictLabel}}</el-button>
        <el-button type="primary" class="el-btn" plain @click="handleClassStugradeCollect">导出</el-button>
        <el-button type="warning" plain @click="onPrintJs">打印</el-button>
      </div>
      <br>
      <li v-for="(item,index) in listClassGradeItem" :key="index" >
        <div class="wrap-right" id="printRef">
            <span style="float: left"><font style="font-weight: bold">老师姓名 :</font>{{item.lsxm}}</span>
            <span style="float: left;margin-left: 20px"><font style="font-weight: bold">所属校区 :</font>{{item.xqmc}}</span>
            <span style="float: left;margin-left: 20px"><font style="font-weight: bold">日语班级 :</font>{{item.rybj}}</span>
            <span style="float: left;margin-left: 20px"><font style="font-weight: bold">进班平均英语成绩 :</font>{{item.jbpjyycj}}</span>
          <div class="wrap-chart">
            <div
              :id="index"
              v-if="true"
              style="width : 90%; height : 640px; display: inline-block;"
            ></div>
            <div class="chart-nav">
              <h4 style="color: #FFCC00" @click="selectChart('bar')">柱状图</h4>
              <h4 style="color: #33CC00" @click="selectChart('line')">折线图</h4>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import printJs from "@/components/print";
import * as echarts from "echarts";
import { listClassGrade } from "@/api/basic/classPerformance";
import { listSchool } from "@/api/basic/school";
import { listBjclass } from "@/api/basic/bjclass";
import { listExaminationPaper } from "@/api/basic/examinationPaper";
export default {
  name: "statisticalChartTtem",
  mixins: [printJs],
  data() {
    return {
      dcForm: {
        sjArr: [], // 考试时间筛选
        studentGradeType: null
      },
      year: new Date().getFullYear(),
      //查询条件
      form: {
        lsxm: null,
        bjmc: null,
        bjid: null,
        ksfw: null,
        maxfs: null,
        minfs: null,
        year: null,
        month: null,
        nj: null,
        pageNum: 1,
        pageSize: 10,
        studentGradeType: 150 // 默认150分
      },
      itemList: [1, 2, 3],
      // 统计图数据模板
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: 45
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "",
            type: "line",
            stack: "总量",
            data: [, , , , , 1, 2, 3, 4]
          }
        ]
      },
      //请求数据页码参数
      queryList: {
        pageNum: 1,
        pageSize: 10,
        bjid: this.$route.query.bjid
      },
      // 默认指向分页
      currentPage1: 1,
      // 获取班级成绩数据
      listClassGradeItem: [],
      // 分页数据表
      pagination: {},
      // 校区
      getListSchool: [],
      // 班级
      getBjClass: [],
      // 考试范围
      getExaminationPaper: [],
      studentGradeTypeList: [],
      getExaminationType: []
    };
  },
  created() {
    this.getDicts("studentGradeType").then(response => {
      this.studentGradeTypeList = response.data;
    });
    this.getDicts("examination_type").then(response => {
      this.getExaminationType = response.data;
    });
    this.getList();
    listBjclass({ id: this.$route.query.bjid }).then(res => {
      this.form.bjid = this.$route.query.bjid;
      this.getSchoolId(this.form.xqid);
      this.getAchievement();
    });
  },
  mounted() {
    /* 默认进入页面查询成绩*/
    // this.getListClassGrade();
  },
  methods: {
    // 获取校区
    async getList() {
      let listSchoolResult = await listSchool();
      this.getListSchool = listSchoolResult.rows;
    },
    // 获取班级
    getSchoolId(schoolId) {
      listBjclass({ kzzd1: schoolId }).then(res => {
        this.getBjClass = res.rows;
      });
    },
    // 获取考试范围
    getClassId(classId) {
      listExaminationPaper({
        bjid: classId,
        lsid: this.$store.state.user.glrid
      }).then(res => {
        this.getExaminationPaper = res.rows;
      });
    },
    //获取班级成绩
    getListClassGrade(pageNum) {
      if (pageNum && typeof pageNum != "object") {
        this.queryList.pageNum = pageNum;
      } else if (pageNum && typeof pageNum == "object") {
        this.queryList = pageNum;
      }
      listClassGrade(this.queryList).then(res => {
        if (res.code == 200) {
          this.listClassGradeItem = res.rows;
          this.pagination.total = res.total;
          this.getChart(this.listClassGradeItem);
        } else {
          this.$notify.error({
            title: "错误",
            message: getClassGrade.msg
          });
        }
      });
    },
    // 选中年份
    selectYear(value) {
      console.log("年", value);
    },
    // 选中月
    selectMonth(value) {
      console.log("月", value);
    },
    // 切换统计图模型
    selectChart(value) {
      this.option.series[0].type = value;
      this.getListClassGrade();
    },
    // 可视化统计图
    getChart(item) {
      this.$nextTick(() => {
        for (let i = 0; i < item.length; i++) {
          let obj = {};
          obj[i] = this.option;
          obj[i].xAxis[0].data = [];
          obj[i].series[0].data = [];
          obj[i].series[0].label={
            show: true,
            position: 'top'
          };
          let chartDom = document.getElementById(i);
          obj[i + "a"] = echarts.init(chartDom);
          obj[i].yAxis[0].max = this.form.studentGradeType;
          if (item[i].everyTimeGradeInfoQueries.length != 0) {
            for (let j = 0; j < item[i].everyTimeGradeInfoQueries.length; j++) {
              obj[i].xAxis[0].data.push(
                item[i].everyTimeGradeInfoQueries[j].ksmc +
                  this.ifGetExaminationType(
                    item[i].everyTimeGradeInfoQueries[j].kslx
                  ) +
                  item[i].everyTimeGradeInfoQueries[j].kssj
              );
              obj[i].series[0].data.push(
                item[i].everyTimeGradeInfoQueries[j].pjfs
              );
              obj[i].series[0].name = `(${item[i].rybj})班平均分`;
            }
          }
          obj[i] && obj[i + "a"].setOption(obj[i]);
        }
      });
    },
    ifGetExaminationType(kslx) {
      for (let i = 0; i < this.getExaminationType.length; i++) {
        if (this.getExaminationType[i].dictValue == kslx) {
          return `-${this.getExaminationType[i].dictLabel}`;
        }
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryList = Object.assign(this.form, this.queryList);
      this.queryList.pageNum = val;
      this.getListClassGrade();
    },
    // 查询按钮
    getAchievement(fz) {
      if (typeof fz == "string") {
        this.form.studentGradeType = fz;
      }
      this.dcForm.studentGradeType = fz;
      this.queryList = Object.assign(this.form, this.queryList);
      this.getListClassGrade();
    },
    // 导出按钮操作
    handleExport() {
      this.download(
        "basic/everytime/export",
        {
          ...this.queryParams
        },
        `班级成绩表.xlsx`
      );
    },
    // 导出班级课考或正式考试成绩汇总
    handleClassStugradeCollect() {
      this.download(
        "basic/everytime/exportClassStugradeCollect",
        {
          ...this.dcForm
        },
        `班级课考或正式考试成绩汇总.xlsx`
      );
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("form");
      // this.getAchievement();
    },
    // 成绩分析
    toPerformanceAnalysis(bjid) {
      // 动态获取路由地址
      this.getConfigKey("classPerformanceDetails").then(res => {
        this.$router.push({
          path: res.msg + bjid
        });
      });
    },
  }
};
</script>

<style lang='scss' scoped>
#statisticalChartTtem {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //   text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  .wrap-statisticalChartTtem {
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
    .el-btn {
      margin-left: 10px;
    }
  }
  .wrap-achievement {
    width: 95%;
    margin: 30px auto;
    padding: 30px 30px;
    box-sizing: border-box;
    box-shadow: 2px 2px 10px 2px rgba(90, 19, 19, 0.2);
    font-family: Sans-serif !important;
    li {
      list-style: none;
      width: 100%;
      // height: 350px;
      border: 1px #ccc solid;
      border-radius: 30px;
      overflow: hidden;
      margin-bottom: 20px;
      padding-top: 10px;
      box-sizing: border-box;
      .wrap-left {
        padding-left: 20px;
        box-sizing: border-box;
        .student-information {
          font-size: 14px;
          height: 50px;
          margin-right: 30px;
          float: left;
          h4 {
            display: inline-block;
            text-align: center;
          }
        }
      }
      .wrap-right {
        width: 100%;
        height: 100%;
        float: left;
        margin-left: 10px;
        .wrap-conversion {
          width: 100%;
          height: 40px;
          padding: 0px 20px;
          box-sizing: border-box;
          .left-title {
            float: left;
            line-height: 40px;
            cursor: pointer;
          }
          .right-title {
            float: right;
            line-height: 40px;
            cursor: pointer;
            span {
              margin-right: 10px;
            }
          }
        }
        .wrap-input {
          width: 100%;
          height: 40px;
          padding: 0px 20px;
          box-sizing: border-box;
          .el-btn {
            margin-left: 10px;
          }
          .wrap-title {
            float: right;
            margin-right: 50px;
            .title-content {
              float: right;
              line-height: 40px;
              margin-right: 10px;
            }
            span {
              cursor: pointer;
            }
          }
        }
        .wrap-chart {
          .chart-nav {
            float: right;
            margin-right: 20px;
            h4 {
              font-size: 14px;
              line-height: 20px;
              cursor: pointer;
            }
          }
        }
      }
    }
    .wrap-pagination {
      float: right;
      margin-bottom: 50px;
    }
  }
}
</style>
