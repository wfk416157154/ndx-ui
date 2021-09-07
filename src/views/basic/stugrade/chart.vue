<template>
  <div class="score-chart">
    <div class="wrap-chart" v-for="(item,index) in getStudentGradeEverytimeList" :key="index">
      <div
        v-if="optionIf"
        class="wrap-score-chart __float clearfix"
        style="border-right: 4px #fff solid"
      >
        <div class="right-chart __float">
          <div :id="['pie' + index]" style="width: 100%;height:100%;"></div>
        </div>
        <div class="title-content __float">
          <div>
            <i></i>
            <span>60分以下次数 :</span>
            <span>{{item.onegrade}}</span>
          </div>
          <div>
            <i></i>
            <span>60-80分的次数 :</span>
            <span>{{item.twograde}}</span>
          </div>
          <div>
            <i></i>
            <span>80-100分的次数 :</span>
            <span>{{item.threegrade}}</span>
          </div>
          <div>
            <i></i>
            <span>最高分 :</span>
            <span>{{item.maxgrade}}</span>
          </div>
          <div>
            <i></i>
            <span>最低分 :</span>
            <span>{{item.mingrade}}</span>
          </div>
          <div>
            <i></i>
            <span>平均分 :</span>
            <span>{{item.avggrade}}</span>
          </div>
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
          // confine: true //将此限制打开后tooltip将不再溢出
          /*formatter:function(val){   //让series 中的文字进行换行
                 console.log(val);//查看val属性，可根据里边属性自定义内容
                 var content = var['name'];
                 return content;//返回可以含有html中标签
             },*/ //自定义鼠标悬浮交互信息提示，鼠标放在饼状图上时触发事件
        },
        legend: {
          show: true,
          orient: "vertical",
          x: "left",
          data: ["80至100分", "60至80分", "60分及以下"]
        },
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
            radius: ["40%", "60%"], //饼图的半径，数组的第一项是内半径，第二项是外半径。支持百分比，本例设置成环形图。具体可以看文档或改变其值试一试
            //roseType:'area',是否显示成南丁格尔图，默认false
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: "inside",
                  textStyle: { color: "#3c4858", fontSize: "14" },
                  // position: "inside", //此处将展示的文字在内部展示
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
              { value: 25, name: "60分及以下" }
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
        legend: {
          show: true,
          orient: "vertical",
          x: "left",
          data: ["80至100分", "60至80分", "60分及以下"]
        },
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
            radius: ["40%", "60%"], //饼图的半径，数组的第一项是内半径，第二项是外半径。支持百分比，本例设置成环形图。具体可以看文档或改变其值试一试
            //roseType:'area',是否显示成南丁格尔图，默认false
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: "inside",
                  textStyle: { color: "#3c4858", fontSize: "14" },
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
              { value: 25, name: "60分及以下" }
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
      optionIf1: true,
      obj: {},
      myChart: {}
    };
  },
  props: ["query"],
  methods: {
    arrToStr(array) {
      let str = "";
      for (let i = 0; i < array.length; i++) {
        str += array[i] + ",";
      }
      str = str.substr(0, str.length - 1);
      return str;
    },
    getChart() {
      if (!this.query.xsbh) {
        this.msgInfo("请输入学生姓名！");
        return;
      }
      let kslx = this.query.kslx;
      if (undefined != kslx && kslx.length > 0) {
        kslx = this.arrToStr(kslx);
      }
      let obj = {
        xsbh: this.query.xsbh,
        kslx: kslx
      };
      // 学生成绩详细饼状图
      getStudentGradeEverytime(obj).then(res => {
        this.getStudentGradeEverytimeList = res.data.countGrade;
        this.$nextTick(() => {
          for (let i = 0; i < this.getStudentGradeEverytimeList.length; i++) {
            this.obj["state" + i] = this.option;
            if (JSON.stringify(this.getStudentGradeEverytimeList[i]) == "{}") {
              this.optionIf1 = false;
            } else if (
              JSON.stringify(this.getStudentGradeEverytimeList[i]) == "{}"
            ) {
              this.optionIf = false;
            }
            let fz60 = Math.round(
              this.getStudentGradeEverytimeList[i].mf * 0.6
            );
            let fz80 = Math.round(
              this.getStudentGradeEverytimeList[i].mf * 0.8
            );
            // 考试分制
            this.obj[
              "state" + i
            ].graphic.style.text = `${this.getStudentGradeEverytimeList[i].mf}分制`;
            this.obj[
              "state" + i
            ].series[0].data[0].value = this.getStudentGradeEverytimeList[
              i
            ].onegrade;
            this.obj[
              "state" + i
            ].series[0].data[1].value = this.getStudentGradeEverytimeList[
              i
            ].twograde;
            this.obj[
              "state" + i
            ].series[0].data[2].value = this.getStudentGradeEverytimeList[
              i
            ].threegrade;
            this.obj["state" + i].series[0].data[2].name = fz60 + "分以下";
            this.obj["state" + i].legend.data[2] = fz60 + "分以下";
            this.obj["state" + i].series[0].data[1].name =
              fz60 + "分至" + fz80 + "分";
            this.obj["state" + i].legend.data[1] = fz60 + "分至" + fz80 + "分";
            this.obj["state" + i].series[0].data[0].name =
              fz80 + "分至" + this.getStudentGradeEverytimeList[i].mf + "分";
            this.obj["state" + i].legend.data[0] =
              fz80 + "分至" + this.getStudentGradeEverytimeList[i].mf + "分";
            this.myChart[`chart${i}`] = this.$echarts.init(
              document.getElementById("pie" + i)
            );
            this.myChart[`chart${i}`].setOption(this.obj["state" + i]);
          }
        });
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
    border-radius: 20px;
    .right-chart {
      width: 60%;
      height: 300px;
    }
    .title-content {
      width: 40%;
      height: 100%;
      font-size: 14px;
      padding: 10px;
      box-sizing: border-box;
      color: #fff;
      float: right;
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
