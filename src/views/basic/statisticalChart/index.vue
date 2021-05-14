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
            <div class="left-title">切换百分比</div>
            <div class="right-title">
              <span>月</span>
              <span>学期</span>
              <span>年</span>
              <span>全部</span>
            </div>
          </div>
          <div class="wrap-input">
            <el-form ref="form" :model="form" label-width="80px">
              <el-col :span="8">
                <el-form-item label="年份">
                  <el-select width="100px" height="“10px" @change="selectYear(form.nian)" v-model="form.nian" placeholder="请选择年份">
                    <el-option label="2020" value="2020"></el-option>
                    <el-option label="2021" value="2021"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="月份">
                  <el-select width="100px" v-model="form.yue" @change="selectMonth(form.yue)" placeholder="请选择年份">
                    <el-option :label="index + 1" :value="index + 1" v-for="(item,index) in 12" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-button type="primary" class="el-btn" plain>统计</el-button>
              <span class="title-content">年考</span>
            </el-form>
          </div>
          <div :id="index" style="width : 100%; height : 240px"></div>
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
       nian : "",
       yue : ""
      },
      itemList: [1, 2, 3],
      option: {
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "刘彤",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
      }
    };
  },
  mounted() {
    // 统计图
    for (let i = 0; i < this.itemList.length; i++) {
      let chartDom = document.getElementById(i);
      let myChart = echarts.init(chartDom);
      this.option && myChart.setOption(this.option);
    }
  },
  methods : {
      // 选中年份
      selectYear(value){
          console.log("年", value)
      },
      // 选中月
      selectMonth(value){
          console.log("月", value)
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
  margin-top: 60px;
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
          .title-content {
            float: right;
            line-height: 40px;
          }
        }
      }
    }
  }
}
</style>
