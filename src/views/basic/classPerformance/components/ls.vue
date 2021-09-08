<template>
  <div id="statisticalChartTtem">
    <div class="wrap-statisticalChartTtem">
      <el-form ref="queryForm" :inline="true" :model="form" label-width="100px">
        <el-form-item label="日语班级" prop="bjid">
          <el-select
            width="100px"
            height="“10px"
            @change="getClassId"
            v-model="form.bjid"
            filterable
            placeholder="请选择班级"
          >
            <el-option
              v-for="(item,index) in getBjClass"
              :label="item.rybjmc"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开班学期" prop="xq">
          <el-select v-model="form.xq" placeholder="请选择开班学期">
            <el-option
              v-for="item in selectNj"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试范围" prop="ksfw" v-if="false" label-width="120px">
          <el-select
            width="100px"
            height="“10px"
            v-model="form.ksfw"
            filterable
            placeholder="请选择考试范围"
          >
            <el-option
              v-for="(item,index) in getExaminationPaper"
              :label="item.ksfw"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最高分" prop="maxfs">
          <el-input v-model="form.maxfs" placeholder="请输入最高分"></el-input>
        </el-form-item>
        <el-form-item label="最低分" prop="minfs">
          <el-input v-model="form.minfs" placeholder="请输入最低分"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="el-btn" plain @click="getAchievement()">查询</el-button>
          <el-button type="primary" class="el-btn" plain @click="handleExport">导出成绩</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery()">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-for="item in studentGradeTypeList"
            :key="item.dictValue"
            type="primary"
            class="el-btn"
            plain
            @click="getAchievement(item.dictValue)"
          >{{item.dictLabel}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <ul class="wrap-achievement clearfix">
      <li v-for="(item,index) in listClassGradeItem" :key="index">
        <div class="wrap-left">
          <div class="student-information">
            <h4>所属校区 :</h4>&nbsp;
            <span>{{item.xqmc}}</span>
          </div>
          <div class="student-information">
            <h4>日语班级 :</h4>&nbsp;
            <span>{{item.rybj}}</span>
          </div>
          <div class="student-information">
            <h4>进班平均英语成绩 :</h4>&nbsp;
            <span>{{item.jbpjyycj}}</span>
          </div>
          <div class="student-information" style="float :right">
            <el-button type="primary" plain @click="toPerformanceAnalysis(item.bjid)">成绩分析</el-button>
          </div>
        </div>
        <div class="wrap-right">
          <!-- <div class="wrap-conversion">
            <div class="left-title">成绩统计表</div>
            <div class="right-title">
              <span @click="selectDtate(1)">月</span>
              <span @click="selectDtate(2)">学期</span>
              <span @click="selectDtate(3)">年</span>
              <span @click="selectDtate()">全部</span>
            </div>
          </div>-->
          <!-- <div class="wrap-input">
            <div class="wrap-title" v-if="isShow == 3">
              <span class="title-content">年考</span>
            </div>
            <div class="wrap-title" v-if="isShow == 1">
              <span class="title-content">月考</span>
            </div>
            <div class="wrap-title" v-if="isShow == 2">
              <span class="title-content">学期</span>
              <span class="title-content">期中</span>
              <span class="title-content">期末</span>
            </div>
          </div>-->
          <div class="wrap-chart">
            <div
              :id="index"
              v-if="true"
              style="width : 90%; height : 340px; display: inline-block;"
            ></div>
            <div class="chart-nav">
              <h4 style="color: #FFCC00" @click="selectChart('bar' ,index)">柱状图</h4>
              <h4 style="color: #33CC00" @click="selectChart('line' ,index)">折线图</h4>
            </div>
          </div>
        </div>
      </li>
      <div class="wrap-pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </ul>
  </div>
</template>


<script>
import * as echarts from "echarts";
import { listClassGrade } from "@/api/basic/classPerformance";
import { listSchool } from "@/api/basic/school";
import { listBjclass } from "@/api/basic/bjclass";
import { listExaminationPaper } from "@/api/basic/examinationPaper";
export default {
  name: "statisticalChartTtem",
  data() {
    return {
      //开班学期字典
      selectNj: [],
      form: {
        pageNum: 1,
        pageSize: 10,
        bjid: null,
        xq: null,
        ksfw: null,
        maxfs: null,
        minfs: null,
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
            data: []
          }
        ]
      },
      //请求数据页码参数
      queryList: {
        pageNum: 1,
        pageSize: 10
        // xsxm: null,
        // rybj: null,
        // wl: null,
        // status: null
      },
      // 默认指向分页
      currentPage1: 1,
      // 获取班级成绩数据
      listClassGradeItem: [],
      // 分页数据表
      pagination: {},
      // 班级
      getBjClass: [],
      // 考试范围
      getExaminationPaper: [],
      // echart 图形化实例
      obj: {},
      studentGradeTypeList: []
    };
  },
  created() {
    this.getDicts("year-list").then(response => {
      this.getYear = response.data;
    });
    this.getDicts("nianji").then(response => {
      this.selectNj = response.data;
    });
    this.getDicts("studentGradeType").then(response => {
      this.studentGradeTypeList = response.data;
    });
  },
  mounted() {
    this.getSchoolId();
    this.getListClassGrade();
  },
  methods: {
    // 获取班级
    getSchoolId() {
      listBjclass().then(res => {
        this.getBjClass = res.rows;
        if (res.rows.length == 1) {
          this.form.bjid = res.rows[0].id;
        }
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
      // 获取当前老师班级成绩
      this.queryList.lsid = this.$store.state.user.glrid;
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
    selectChart(value, index) {
      this.obj[index].series[0].type = value;
      this.getChart(this.listClassGradeItem, index);
    },
    // 可视化统计图
    getChart(item, index) {
      this.$nextTick(() => {
        for (let i = 0; i < item.length; i++) {
          this.obj[i] = this.option;
          obj[i].yAxis[0].max=this.form.studentGradeType
          this.obj[i].xAxis[0].data = [];
          this.obj[i].series[0].data = [];
          let chartDom = document.getElementById(i);
          this.obj[i + "a"] = echarts.init(chartDom);
          if (item[i].everyTimeGradeInfoQueries.length != 0) {
            for (let j = 0; j < item[i].everyTimeGradeInfoQueries.length; j++) {
              this.obj[i].xAxis[0].data.push(
                item[i].everyTimeGradeInfoQueries[j].ksmc
              );
              this.obj[i].series[0].data.push(
                item[i].everyTimeGradeInfoQueries[j].pjfs
              );
              this.obj[i].series[0].name = `(${item[i].rybj})班平均分`;
            }
            this.obj[i] && this.obj[i + "a"].setOption(this.obj[i]);
          }
        }
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 查询按钮
    getAchievement(fz) {
      this.form.studentGradeType = fz;
      this.form.lsid = this.$store.state.user.glrid;
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
    // 成绩分析
    toPerformanceAnalysis(bjid) {
      // 动态获取路由地址
      this.getConfigKey("classPerformanceDetails").then(res => {
        this.$router.push({
          path: res.msg + bjid
        });
      });
    },
    // 置空
    resetQuery() {
      this.resetForm("queryForm");
      this.getListClassGrade();
    }
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
      // height: 380px;
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
