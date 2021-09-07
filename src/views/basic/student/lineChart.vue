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

    <div id="pie" v-if="true" style="width : 90%; height : 340px; display: inline-block;"></div>
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
      lineChartForm: {
        studentGradeType: null,
        xsbh: null
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
  methods: {
    getChart(studentGradeType) {
      this.lineChartForm.xsbh = this.query;
      this.lineChartForm.studentGradeType = studentGradeType;
      studentGradeBrokenLine(this.lineChartForm).then(res => {
        this.option.xAxis[0].data = [];
        this.option.series[0].data = [];
        let chartDom = document.getElementById("pie");
        chartDom = echarts.init(chartDom);
        if (res.data.length != 0) {
          for (let j = 0; j < res.data.length; j++) {
            this.option.xAxis[0].data.push(res.data[j].ksmc);
            this.option.series[0].data.push(res.data[j].kscj);
            this.option.series[0].name = `(${res.data[j].ksmc})考试分数`;
          }
          this.option && chartDom.setOption(this.option);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>