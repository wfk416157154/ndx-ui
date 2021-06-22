<template>
  <div id="statisticalChartTtem">
    <div class="wrap-statisticalChartTtem">
      <el-form ref="form" :model="form" label-width="100px">
        <el-col :span="4">
          <el-form-item label="校区">
            <el-select width="100px" height="“10px" v-model="form.xq" placeholder="请选择校区">
              <el-option label="武汉" value="武汉"></el-option>
              <el-option label="长沙" value="长沙"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="日语班级">
            <el-select width="100px" height="“10px" v-model="form.rybj" placeholder="请选择班级">
              <el-option label="武汉一班" value="武汉"></el-option>
              <el-option label="武汉二班" value="长沙"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="老师姓名">
            <el-input v-model="form.lsxm" placeholder="请输入老师姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="考试范围" label-width="120px">
            <el-select
              width="100px"
              height="“10px"
              @change="selectYear(form[index],item.id)"
              v-model="form.zsdfw"
              placeholder="请选择知识点范围"
            >
              <el-option label="1" value="2020"></el-option>
              <el-option label="2" value="2021"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="最高分">
            <el-input v-model="form.zdz" placeholder="请输入最高分"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="最低分">
            <el-input v-model="form.zxz" placeholder="请输入最低分"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="年份">
            <el-select width="100px" height="“10px" v-model="form.nf" placeholder="请选择校区">
              <el-option label="武汉" value="武汉"></el-option>
              <el-option label="长沙" value="长沙"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="月份">
            <el-select width="100px" height="“10px" v-model="form.yf" placeholder="请选择校区">
              <el-option label="武汉" value="武汉"></el-option>
              <el-option label="长沙" value="长沙"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="学期">
            <el-select width="100px" height="“10px" v-model="form.yf" placeholder="请选择校区">
              <el-option label="武汉" value="武汉"></el-option>
              <el-option label="长沙" value="长沙"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-button type="primary" class="el-btn" plain>查询</el-button>
        <el-button type="primary" class="el-btn" plain>导出成绩</el-button>
      </el-form>
    </div>
    <ul class="wrap-achievement clearfix">
      <li v-for="(item,index) in listClassGradeItem" :key="index">
        <div class="wrap-left">
          <div class="student-information">
            <h4>老师姓名 :</h4>&nbsp;
            <span>{{item.lsxm}}</span>
          </div>
          <div class="student-information">
            <h4>老师电话 :</h4>&nbsp;
            <span>{{item.lsdh}}</span>
          </div>
          <div class="student-information">
            <h4>所属校区 :</h4>&nbsp;
            <span>{{item.xqmc}}</span>
          </div>
          <div class="student-information">
            <h4>日语班级 :</h4>&nbsp;
            <span>{{item.rybjmc}}</span>
          </div>
          <div class="student-information">
            <h4>班级人数 :</h4>&nbsp;
            <span>{{item.bjrs}}</span>
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
          </div>
          <div class="wrap-input">
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
              <h4 style="color: #FFCC00" @click="selectChart('bar')">柱状图</h4>
              <h4 style="color: #33CC00" @click="selectChart('line')">折线图</h4>
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
import {
  listClassGrade,
  getColumnNameList,
  getListAll
} from "@/api/basic/classPerformance";
export default {
  name: "statisticalChartTtem",
  data() {
    return {
      form: {
        nian: "1223",
        yue: ""
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
            type: "bar",
            stack: "总量",
            data: []
          }
        ]
      },
      isShow: 1,
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
      // 列名
      columnNameList: [],
      // 列数据
      columnDataList: []
    };
  },
  mounted() {
    this.getListClassGrade();
    this.getColumnNameList();
    this.getColumnDataList();
  },
  methods: {
    //获取班级成绩
    getListClassGrade(pageNum) {
      if (pageNum && typeof pageNum != "object") {
        this.queryList.pageNum = pageNum;
      } else if (pageNum && typeof pageNum == "object") {
        this.queryList = pageNum;
      }
      listClassGrade(this.queryList).then(res => {
        if (res.code == 200) {
          this.listClassGradeItem = getClassGrade.rows;
          this.pagination.total = getClassGrade.total;
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
          let chartDom = document.getElementById(i);
          obj[i + "a"] = echarts.init(chartDom);
          //   obj[i + "a"].on("click", a => {
          //     this.$router.push({
          //       path: "/index/studentAchievementStatistics",
          //       query: {
          //         rybjmc: item[i].rybjmc,
          //         ksmc: a.name
          //       }
          //     });
          //   });
          for (let j = 0; j < item[i].listMap.length; j++) {
            if (j >= item[i].listMap.length - 1) {
              continue;
            } else {
              obj[i].xAxis[0].data.push(item[i].listMap[j].label);
              obj[i].series[0].data.push(item[i].listMap[j].grade);
              obj[i].series[0].name = item[i].xsxm;
            }
          }
          obj[i] && obj[i + "a"].setOption(obj[i]);
        }
      });
    },
    selectDtate(value) {
      this.isShow = value;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
      height: 350px;
      border: 1px #ccc solid;
      border-radius: 30px;
      overflow: hidden;
      margin-bottom: 20px;
      padding-top: 10px;
      box-sizing: border-box;
      .wrap-left {
        width: 22%;
        height: 100%;
        background-color: #fff;
        padding: 20px;
        box-sizing: border-box;
        float: left;
        .student-information {
          font-size: 14px;
          height: 50px;
          h4 {
            display: inline-block;
            text-align: center;
          }
        }
      }
      .wrap-right {
        width: 78%;
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
