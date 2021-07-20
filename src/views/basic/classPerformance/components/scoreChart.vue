<template>
  <div class="score-chart">
    <div class="wrap-score-chart clearfix">
      <div class="left-table __float">
        <el-table
          :data="listAll"
          border
          :cell-style="addClass"
          :summary-method="getSummaries"
          show-summary
          style="width: 100%"
        >
          <el-table-column
            :fixed="item.fixed"
            :label="item.label"
            align="center"
            v-for="(item,index) in columnNameList"
            :key="index"
            :prop="item.prop"
          >
            <template slot-scope="scope">
              <span
                v-if="item.prop == 'xsxm' || item.prop == 'rybj'  || item.prop == 'zhcj'"
              >{{scope.row[item.prop]}}</span>
              <span
                v-if="item.prop == 'wl'"
              >{{selectDictLabel(wlOption,scope.row[item.prop])}}</span>
              <div v-else>
                <div
                  v-if="scope.row[item.colour] == 1"
                  style="background : #67C23A; display : inline-block ; width :100%;color : #fff"
                >{{scope.row[item.prop]}}</div>
                <span
                  v-if="scope.row[item.colour] == 2"
                  style="background : #E6A23C; display : inline-block ; width :100%;color : #fff"
                >{{scope.row[item.prop]}}</span>
                <span
                  v-if="scope.row[item.colour] == 3"
                  style="background : red; display : inline-block ; width :100%;color : #fff"
                >{{scope.row[item.prop]}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="right-chart __float">
        <div id="pie1" style="width: 100%;height:100%;"></div>
      </div>
      <div class="title-content __float">
        <div>
          <i></i>
          <span>考试范围 :</span>
          <span>{{chartList.ksfw}}</span>
        </div>
        <div>
          <i></i>
          <span>考试时间 :</span>
          <span>{{chartList.kssj}}</span>
        </div>
        <div>
          <i></i>
          <span>考试类型 :</span>
          <span>{{chartList.kslxmc}}</span>
        </div>
        <div>
          <i></i>
          <span>60分以下人数 :</span>
          <span>{{chartList.bhers}}</span>
        </div>
        <div>
          <i></i>
          <span>60-80分的人数 :</span>
          <span>{{chartList.hers}}</span>
        </div>
        <div>
          <i></i>
          <span>80-100分的人数 :</span>
          <span>{{chartList.yxrs}}</span>
        </div>
        <div>
          <i></i>
          <span>最高分 :</span>
          <span>{{chartList.zgf}}</span>
        </div>
        <div>
          <i></i>
          <span>最低分 :</span>
          <span>{{chartList.zdf}}</span>
        </div>
        <div>
          <i></i>
          <span>平均分 :</span>
          <span>{{chartList.pjf}}</span>
        </div>
        <div>
          <i></i>
          <span>考试人数 :</span>
          <span>{{chartList.ksrs}}</span>
        </div>
        <div>
          <i></i>
          <span>缺考人数 :</span>
          <span>{{chartList.qkrs}}</span>
        </div>
      </div>
    </div>
    <div class="analysis-and-summary">
      <p>考试分析总结</p>
      <span>{{getKsfxzj}}</span>
    </div>
  </div>
</template>

<script>
import { listAll, getColumnNameList } from "@/api/basic/stugrade";
import { listExamSummary } from "@/api/basic/examSummary";
export default {
  data() {
    return {
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
      // 考试分析总结
      getKsfxzj: "",
      wlOption:[],
    };
  },
  props: ["query", "getExaminationType"],
  mounted() {
    // this.getChart();
  },
  created() {
    this.getDicts("xkType").then(response => {
      this.wlOption = response.data;
    });

  },
  methods: {
    getChart() {
      let json = {
        kzzd1: this.query.kzzd1,
        kjid: this.query.ksfw,
        ksmc: this.query.ksmc
      };
      // 学生成绩表title列
      getColumnNameList(json).then(res => {
        this.columnNameList = res.data;
        for (let i = 0; i < 5; i++) {
          this.columnNameList[i].fixed = true;
        }
      });
      // 学生成绩表数据
      listAll(json).then(res => {
        this.listAll = res.rows;
        this.total = res.total;
        this.getExaminationType.forEach(value => {
          if (this.listAll[this.listAll.length - 1].kslx == value.dictValue) {
            this.listAll[this.listAll.length - 1].kslxmc = value.dictLabel;
          }
        });
        this.chartList = this.listAll[this.listAll.length - 1];
        // 考试分制
        this.option1.graphic.style.text = this.chartList.mf + "分制";
        this.option1.series[0].data[0].value = this.chartList.yxbfb;
        this.option1.series[0].data[1].value = this.chartList.hgbfb;
        this.option1.series[0].data[2].value = this.chartList.bhgbfb;
        let myChart1 = this.$echarts.init(document.getElementById("pie1"));
        myChart1.setOption(this.option1);
      });
      // 考试分析总结
      listExamSummary({ examPaperId: this.query.ksfw }).then(res => {
        this.getKsfxzj = res.rows[0].ksfxzj;
      });
    }
  }
};
</script>

<style lang="scss">
.score-chart {
  width: 100%;
  height: 100%;
  background: #909399;

  .__float {
    float: left;
  }
  .wrap-score-chart {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
    .left-table {
      width: 50%;
    }
    .right-chart {
      width: 25%;
      height: 300px;
    }
    .title-content {
      width: 20%;
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
  .analysis-and-summary {
    display: inline-block;
    width: 50%;
    // height: 300px;
    background: #f2f6fc;
    padding: 20px;
    padding-top: 0px;
    box-sizing: border-box;
    border-radius: 20px;
    margin-left: 40px;
    margin-bottom: 40px;
    p {
      color: #606266;
    }
    span {
      // 强制换行
      word-wrap: break-word;
    }
  }
}
</style>
