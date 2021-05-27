<template>
  <div id="statisticalChartTtem">
    <ul class="wrap-achievement">
      <li v-for="(item,index) in 3" :key="index">
        <div class="wrap-left">
          <div class="student-information">
            <h4>学生姓名 :</h4>&nbsp;
            <span>刘彤</span>
          </div>
          <div class="student-information">
            <h4>学生性别 :</h4>&nbsp;
            <span>男</span>
          </div>
          <div class="student-information">
            <h4>学生校区 :</h4>&nbsp;
            <span>南斗星武汉校区</span>
          </div>
          <div class="student-information">
            <h4>日语班级 :</h4>&nbsp;
            <span>2108</span>
          </div>
          <div class="student-information">
            <h4>进班日语成绩 :</h4>&nbsp;
            <span>123分</span>
          </div>
        </div>
        <div class="wrap-right">
          <div class="wrap-conversion">
            <div class="left-title">成绩统计表</div>
            <div class="right-title">
              <span @click="selectDtate(1)">月</span>
              <span @click="selectDtate(2)">学期</span>
              <span @click="selectDtate(3)">年</span>
              <span @click="selectDtate()">全部</span>
            </div>
          </div>
          <div class="wrap-input">
            <el-form ref="form" :model="form" label-width="80px">
              <el-col :span="5">
                <el-form-item label="年份">
                  <el-select
                    width="100px"
                    height="“10px"
                    @change="selectYear(form[index],item.id)"
                    v-model="form[index]"
                    placeholder="请选择年份"
                  >
                    <el-option label="1" value="2020"></el-option>
                    <el-option label="2" value="2021"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="月份">
                  <el-select
                    width="100px"
                    v-model="form[index]"
                    @change="selectMonth(form[index],item.id)"
                    placeholder="请选择年份"
                  >
                    <el-option
                      :label="index + 1"
                      :value="index + 1"
                      v-for="(item,index) in 12"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-button type="primary" class="el-btn" plain>统计</el-button>
              <div class="wrap-title" v-if="isShow == 3" >
                <span class="title-content">年考</span>
              </div>
              <div class="wrap-title" v-if="isShow == 1" >
                <span class="title-content">月考</span>
              </div>
              <div class="wrap-title" v-if="isShow == 2" >
                <span class="title-content">学期</span>
                <span class="title-content">期中</span>
                <span class="title-content">期末</span>
              </div>
            </el-form>
          </div>
          <div class="wrap-chart">
            <div
              :id="index"
              v-if="true"
              style="width : 90%; height : 240px; display: inline-block;"
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
import * as echarts from "echarts";
export default {
  name: "statisticalChartTtem",
  data() {
    return {
      form: {
        nian: "",
        yue: ""
      },
      itemList: [1, 2, 3],
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
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            axisTick: {
              alignWithLabel: true
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
            name: "刘彤",
            type: "bar",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
      },
      isShow : 1,
    };
  },
  mounted() {
    this.getChart();
  },
  methods: {
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
      console.log(value);
      this.option.series[0].type = value;
      this.getChart();
    },
    getChart() {
      // 可视化统计图
      for (let i = 0; i < this.itemList.length; i++) {
        let chartDom = document.getElementById(i);
        let myChart = echarts.init(chartDom);
        this.option && myChart.setOption(this.option);
      }
    },
    selectDtate(value){
        this.isShow = value
    }
  }
};
</script>

<style lang='scss'>
#statisticalChartTtem {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //   text-align: center;
  color: #2c3e50;
  margin-top: 20px;
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
  }
}
</style>
