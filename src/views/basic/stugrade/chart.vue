<template>
  <div class="score-chart">
    <div
      v-if="optionIf"
      class="wrap-score-chart __float clearfix"
      style="border-right: 4px #fff solid"
    >
      <div class="right-chart __float">
        <div id="pie1" style="width: 100%;height:100%;"></div>
      </div>
      <div class="title-content __float">
        <div>
          <i></i>
          <span>60分以下次数 :</span>
          <span>{{fraction150.onegrade}}</span>
        </div>
        <div>
          <i></i>
          <span>60-80分的次数 :</span>
          <span>{{fraction150.twograde}}</span>
        </div>
        <div>
          <i></i>
          <span>80-100分的次数 :</span>
          <span>{{fraction150.threegrade}}</span>
        </div>
        <div>
          <i></i>
          <span>最高分 :</span>
          <span>{{fraction150.maxgrade}}</span>
        </div>
        <div>
          <i></i>
          <span>最低分 :</span>
          <span>{{fraction150.mingrade}}</span>
        </div>
        <div>
          <i></i>
          <span>平均分 :</span>
          <span>{{fraction150.avggrade}}</span>
        </div>
      </div>
    </div>
    <div v-if="optionIf1" class="wrap-score-chart __float clearfix">
      <div class="right-chart __float">
        <div id="pie2" style="width: 100%;height:100%;"></div>
      </div>
      <div class="title-content __float">
        <div>
          <i></i>
          <span>60分以下次数 :</span>
          <span>{{fraction100.onegrade}}</span>
        </div>
        <div>
          <i></i>
          <span>60-80分的次数 :</span>
          <span>{{fraction100.twograde}}</span>
        </div>
        <div>
          <i></i>
          <span>80-100分的次数 :</span>
          <span>{{fraction100.threegrade}}</span>
        </div>
        <div>
          <i></i>
          <span>最高分 :</span>
          <span>{{fraction100.maxgrade}}</span>
        </div>
        <div>
          <i></i>
          <span>最低分 :</span>
          <span>{{fraction100.mingrade}}</span>
        </div>
        <div>
          <i></i>
          <span>平均分 :</span>
          <span>{{fraction100.avggrade}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  listAll,
  getColumnNameList,
  getStudentGradeEverytime
} from "@/api/basic/stugrade";
export default {
  data() {
    return {
      option: {
        title: {
          text: "成绩统计",
          top: "bottom",
          left: "center",
          textStyle: {
            fontSize: 14,
            fontWeight: "",
            color: "#333"
          }
        }, //标题
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
          /*formatter:function(val){   //让series 中的文字进行换行
                 console.log(val);//查看val属性，可根据里边属性自定义内容
                 var content = var['name'];
                 return content;//返回可以含有html中标签
             },*/ //自定义鼠标悬浮交互信息提示，鼠标放在饼状图上时触发事件
        },
        // legend: {
        //   show: true,
        //   orient: "vertical",
        //   x: "left",
        //   data: ["50%-学生1", "25%-老师", "25%-家长"]
        // },
        graphic: {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: "",
            textAlign: "center",
            font: "italic bolder 16px cursive",
            fill: "#fff",
            width: 30,
            height: 30
          }
        },
        series: [
          {
            name: "成绩统计", //tooltip提示框中显示内容
            type: "pie", //图形类型，如饼状图，柱状图等
            radius: ["35%", "65%"], //饼图的半径，数组的第一项是内半径，第二项是外半径。支持百分比，本例设置成环形图。具体可以看文档或改变其值试一试
            //roseType:'area',是否显示成南丁格尔图，默认false
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  textStyle: { color: "#3c4858", fontSize: "18" },
                  formatter: function(val) {
                    //让series 中的文字进行换行
                    return val.name.split("-").join("\n");
                  }
                },
                labelLine: {
                  show: true,
                  lineStyle: { color: "#3c4858" }
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
                textColor: "#000"
              }
            },
            data: [
              { value: 50, name: "80至100分" },
              { value: 25, name: "60至80分" },
              { value: 25, name: "60分" }
            ],
            color: ["#51CEC6", "#FFB703", "#5FA0FA"] //各个区域颜色
          }
        ]
      },
      option1: {
        title: {
          text: "成绩统计",
          top: "bottom",
          left: "center",
          textStyle: {
            fontSize: 14,
            fontWeight: "",
            color: "#333"
          }
        }, //标题
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
          /*formatter:function(val){   //让series 中的文字进行换行
                 console.log(val);//查看val属性，可根据里边属性自定义内容
                 var content = var['name'];
                 return content;//返回可以含有html中标签
             },*/ //自定义鼠标悬浮交互信息提示，鼠标放在饼状图上时触发事件
        },
        // legend: {
        //   show: true,
        //   orient: "vertical",
        //   x: "left",
        //   data: ["50%-学生1", "25%-老师", "25%-家长"]
        // },
        graphic: {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: "",
            textAlign: "center",
            font: "italic bolder 16px cursive",
            fill: "#fff",
            width: 30,
            height: 30
          }
        },
        series: [
          {
            name: "成绩统计", //tooltip提示框中显示内容
            type: "pie", //图形类型，如饼状图，柱状图等
            radius: ["35%", "65%"], //饼图的半径，数组的第一项是内半径，第二项是外半径。支持百分比，本例设置成环形图。具体可以看文档或改变其值试一试
            //roseType:'area',是否显示成南丁格尔图，默认false
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  textStyle: { color: "#3c4858", fontSize: "18" },
                  formatter: function(val) {
                    //让series 中的文字进行换行
                    return val.name.split("-").join("\n");
                  }
                },
                labelLine: {
                  show: true,
                  lineStyle: { color: "#3c4858" }
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
                textColor: "#000"
              }
            },
            data: [
              { value: 50, name: "80至100分" },
              { value: 25, name: "60至80分" },
              { value: 25, name: "60分" }
            ],
            color: ["#51CEC6", "#FFB703", "#5FA0FA"] //各个区域颜色
          }
        ]
      },
      // 动态table-column
      columnNameList: [],
      // 获取学生成绩表
      listAll: [],
      // 饼状图数据统计
      chartList: {},
      // 详细数据
      getStudentGradeEverytimeList: {},
      fraction100: {},
      fraction150: {},
      optionIf: true,
      optionIf1: true
    };
  },
  props: ["query"],
  methods: {
    getChart() {
      if (!this.query.xsbh) {
        return;
      }
      // 学生成绩详细饼状图
      getStudentGradeEverytime({ xsbh: this.query.xsbh }).then(res => {
        this.getStudentGradeEverytimeList = res.data.countGrade;
        this.fraction100 = this.getStudentGradeEverytimeList["100"];
        this.fraction150 = this.getStudentGradeEverytimeList["150"];
        // console.log(this.getStudentGradeEverytimeList)
        if (JSON.stringify(this.fraction100) == "{}") {
          this.optionIf1 = false;
        } else if (JSON.stringify(this.fraction150) == "{}") {
          this.optionIf = false;
        }
        // 100 分制
        this.option1.graphic.style.text = "100分制";
        this.option1.series[0].data[0].value = Math.round(
          (parseInt(this.fraction100.onegrade) /
            (parseInt(this.fraction100.onegrade) +
              parseInt(this.fraction100.twograde) +
              parseInt(this.fraction100.threegrade))) *
            100
        );
        this.option1.series[0].data[1].value = Math.round(
          (parseInt(this.fraction100.twograde) /
            (parseInt(this.fraction100.onegrade) +
              parseInt(this.fraction100.twograde) +
              parseInt(this.fraction100.threegrade))) *
            100
        );
        this.option1.series[0].data[2].value = Math.round(
          (parseInt(this.fraction100.threegrade) /
            (parseInt(this.fraction100.onegrade) +
              parseInt(this.fraction100.twograde) +
              parseInt(this.fraction100.threegrade))) *
            100
        );
        // 150分制
        let myChart2 = this.$echarts.init(document.getElementById("pie2"));
        myChart2.setOption(this.option1);
        this.option.graphic.style.text = "150分制";
        this.option.series[0].data[0].value = Math.round(
          (parseInt(this.fraction150.onegrade) /
            (parseInt(this.fraction150.onegrade) +
              parseInt(this.fraction150.twograde) +
              parseInt(this.fraction150.threegrade))) *
            100
        );
        this.option.series[0].data[1].value = Math.round(
          (parseInt(this.fraction150.twograde) /
            (parseInt(this.fraction150.onegrade) +
              parseInt(this.fraction150.twograde) +
              parseInt(this.fraction150.threegrade))) *
            100
        );
        this.option.series[0].data[2].value = Math.round(
          (parseInt(this.fraction150.threegrade) /
            (parseInt(this.fraction150.onegrade) +
              parseInt(this.fraction150.twograde) +
              parseInt(this.fraction150.threegrade))) *
            100
        );
        let myChart1 = this.$echarts.init(document.getElementById("pie1"));
        myChart1.setOption(this.option);
      });
    }
  }
};
</script>

<style lang="scss">
.score-chart {
  width: 100%;
  height: 100%;
  margin-bottom: 50px;
  display: inline-block;
  .__float {
    float: left;
  }
  .wrap-score-chart {
    width: 50%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
    background: #909399;
    .right-chart {
      width: 50%;
      height: 300px;
    }
    .title-content {
      width: 50%;
      height: 100%;
      font-size: 14px;
      padding: 10px;
      box-sizing: border-box;
      color: #fff;
      span {
        line-height: 25px;
      }
      i {
        display: inline-block;
        background-color: #67c23a;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
}
</style>