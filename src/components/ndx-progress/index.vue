<template>
  <div class="wrap-propress">
    <h2>{{ dqkcmc }}</h2>
    <br />
    <div style="display: flex; align-items: center;position:relative">
      <div style="width: 100px;position:absolute;top:65px;left:-80px">{{ xkStartDate }}</div>
      <div class="propress">
        <div>
          <div class="wrap-date">
            <template
              v-if="classSemesterPlanlist && classSemesterPlanlist.length > 0"
            >
              <div
                class="propress-line"
                v-for="(title, j) in classSemesterPlanlist"
                :key="j"
                :style="{ width: `${title.termPercent}%` }"
              >
                <p class="lastKcmc">
                  {{ title.lastKcmc }}
                </p>
                <p class="jzrq">
                  {{ title.jzrq }}
                </p>
              </div>
            </template>
          </div>
          <div class="wrap-box">
            <div class="propress-item">
              <div
                :class="xkPercent.type"
                :style="{
                  width: `${xkPercent.percent}%`,
                }"
              ></div>
              <div
                :class="fxPercent.type"
                :style="{
                  width: `${fxPercent.percent}%`,
                  display: 'flex',
                  alignItems: 'center',
                }"
              >
                <span style="line-heihgt: 40px"> 进入复习时间: {{parseTime(fxPercent.reviewStartDate,'{y}-{m}-{d}')}} </span>
              </div>
            </div>
          </div>
          <div class="propress-title">
            <template
              v-if="classSemesterPlanlist && classSemesterPlanlist.length > 0"
            >
              <div
                class="propress-line"
                v-for="(title, j) in classSemesterPlanlist"
                :key="j"
                :style="{ width: `${title.termPercent}%` }"
              >
                <span>
                  {{ title.xqmc }}
                </span>
              </div>
            </template>
          </div>
        </div>
        <br />
        <br />
        <div style="width: 100%; height: 100%">
          <div style="display: flex">
            <div :style="{ width: `${xkPercent.percent}%` }"></div>
            <div
              :style="{
                width: `${fxPercent.percent}%`,
              }"
            >
              <span style="line-heihgt: 40px; color: #e6a23c">
                {{ fxInfo }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fxPercent: {},
      xkPercent: {},
      dqkcmc: null,
      xkStartDate: null,
      fxInfo: null,
      classSemesterPlanlist: [],
    };
  },
  props: ["propressItem"],
  // watch: {
  //   propressItem() {
  //     // this.getData();
  //   },
  // },
  mounted() {
    // this.getData();
    this.propressItem.then((res) => {
      console.log(res);
      this.fxPercent = res.data.fxPercent;
      this.xkPercent = res.data.xkPercent;
      this.dqkcmc = res.data.dqkcmc;
      this.classSemesterPlanlist = res.data.classSemesterPlanlist;
      this.xkStartDate = res.data.xkStartDate;
      this.fxInfo = res.data.fxInfo;
    });
  },
  methods: {
    // getData() {
    //   let countArr = [];
    //   this.progressItem.forEach((value, index) => {
    //     value.style = {};
    //     countArr.push(value.type);
    //     value.show = false;
    //     value.typeShow = false;
    //     if (this.titletype.indexOf(value.type) != -1) {
    //       value.typeShow = true;
    //     }
    //     this.typeList.forEach((el) => {
    //       if (countArr.lastIndexOf(el) > -1) {
    //         this.progressItem[countArr.lastIndexOf(el)].show = true;
    //       }
    //       value.style = this.getStyle(value, index);
    //     });
    //   });
    //   this.nodeStartDate = this.progressItem[0].nodeStartDate;
    //   this.nodeEndDate =
    //     this.progressItem[this.progressItem.length - 1].nodeStartDate;
    // },
    // getStyle(item, index) {
    //   let style = {
    //     width: `${item.percentage}%`,
    //   };
    //   if (item && item.show) {
    //     style.borderRight = "1px solid #000";
    //   }
    //   if (index == 0) {
    //     style.borderLeft = "1px solid #000";
    //   }
    //   if (index == this.progressItem.length - 1) {
    //     style.borderRight = "1px solid #000";
    //   }
    //   return style;
    // },
  },
};
</script>

<style lang="scss" scoped>
.primary {
  background-color: #409eff;
}
.success {
  background-color: #67c23a;
}
.info {
  background-color: #909399;
}
.warning {
  background-color: #e6a23c;
}
.danger {
  background-color: #f56c6c;
}
.white {
  background-color: #eee;
}
.wrap-propress {
  width: 100%;
  height: 100%;
  // display: flex;
  // align-items: center;
  padding: 40px 45px;
  .propress {
    width: 100%;
    height: 100%;
    padding: 40px 10px;
    box-sizing: border-box;
    .wrap-x {
      width: 100%;
      .propress-x {
        display: flex;
        p {
          padding: 0px;
          margin: 0px;
        }
      }
    }
    .propress-title {
      display: flex;
      justify-content: space-between;
      .propress-line {
        // width: 1px;
        height: 20px;
        border-left: 1px solid #000;
        text-align: right;
        position: relative;
        span {
          position: absolute;
          bottom: -150%;
          right: 0;
          transform: translateX(50%);
          // transform: translateY(50%);
        }
      }
      .propress-line:last-child {
        border-right: 1px solid #000;
      }
      .title-content {
        text-align: center;
      }
    }
    .wrap-date {
      display: flex;
      justify-content: space-between;
      .propress-line {
        // width: 1px;
        height: 20px;
        border-left: 1px solid #000;
        text-align: right;
        position: relative;
        .lastKcmc {
          position: absolute;
          top: -400%;
          right: 0;
          transform: translateX(50%);
          // transform: translateY(50%);
        }
        .jzrq {
          position: absolute;
          top: -200%;
          right: 0;
          transform: translateX(50%);
          // transform: translateY(50%);
        }
      }
      .propress-line:last-child {
        border-right: 1px solid #000;
      }
      .title-content {
        text-align: center;
      }
    }
    .wrap-box {
      width: 100%;
      height: 30px;
      display: flex;
      background: #eee;
      border-radius: 10px;
      overflow: hidden;
      .propress-item {
        width: 100%;
        height: 100%;
        display: flex;
      }
    }
  }
}
</style>
