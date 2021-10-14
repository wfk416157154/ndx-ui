<template>
  <div style="padding : 40px">
    <el-form ref="queryForm" :inline="true" :model="lineChartForm" label-width="100px">
      <el-form-item>
        <el-button
          type="primary"
          v-for="item in studentGradeType"
          :key="item.dictValue"
          @click="getChart(item.dictValue)"
        >{{item.dictLabel}}</el-button>
      </el-form-item>
    </el-form>

    <div id="line" v-if="true" style="width : 90%; height : 340px; display: inline-block;"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { studentGradeBrokenLine } from "@/api/basic/student";
export default {
  data() {
    return {
      // 统计图数据模板
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: []
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
        series: []
      },
      lineChartForm: {
        studentGradeType: null,
        xsbh: null,
        bjid: null
      },
      studentGradeType: []
    };
  },
  props: ["query"],
  created() {
    this.getDicts("studentGradeType").then(response => {
      this.studentGradeType = response.data;
      this.lineChartForm.studentGradeType = this.studentGradeType[0].dictValue;
    });
  },
  mounted(){
      this.getChart(150)
  },
  methods: {
    getChart(studentGradeType) {
      if(null==this.query){
        return
      }
      this.option.yAxis[0].max = studentGradeType;
      this.lineChartForm.xsbh = this.query.xsbh;
      this.lineChartForm.bjid = this.query.ryb || this.query.kzzd1;
      this.lineChartForm.studentGradeType = studentGradeType;
      let chartDom = document.getElementById("line");
      chartDom = echarts.init(chartDom);
      studentGradeBrokenLine(this.lineChartForm).then(res => {
        if (res.code == 200) {
          this.option.legend.data = res.data.legend;
          this.option.xAxis[0].data = res.data.xAxisTitle;
          this.option.series = res.data.yData;
          this.option && chartDom.setOption(this.option);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
