<template>
  <div class="semester-view">
    <div class="wrap-left-tar">
      <ul>
        <li
          v-for="(item,index) in MonthList.xueqiDict"
          :class="{ 'back': item.ifClass}"
          :key="index"
          @click="dataWwitching(item)"
        >{{item.dictLabel}}</li>
      </ul>
    </div>
    <div class="wrap-right-item">
      <!-- <div>
        <h3>新标准日语</h3>
        <h4>第一章节</h4>
      </div>-->
      <div class="wrap-ksItem">
        <ul class="ksItem">
          <li style="margin : 10px 0px" v-for="(item,index) in monthitemTemplate" :key="index">
            <h2>{{item.title}}</h2>
            <div
              v-for="(itemson,j) in item.list"
              :key="j"
              style=" display: flex;
          justify-content: space-between;
          align-items: center; margin : 10px 0px;margin-left : 20px"
            >
              <div>
                <span :style="itemson.styles">{{itemson.jdmc}}</span>
                <!-- <span style="margin-left : 10px;color : #67C23A">新课</span> -->
              </div>
              <div>
                <span>{{itemson.ksrq}} - {{itemson.jzrq}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { queryGenerateTeachingPlanData } from "@/api/teaching/generate";
export default {
  data() {
    return {
      MonthList: {},
      monthitemTemplate: []
    };
  },
  props: ["item"],
  computed: {
    getComputed(cjlx) {
      let styles = {};
      console.log(cjlx);
      return styles;
    }
  },
  methods: {
    toGrade() {
      this.itemForm = JSON.parse(JSON.stringify(this.item));
      if (this.itemForm && typeof this.itemForm.zfx == "object") {
        this.itemForm.zfx = this.itemForm.zfx.join(",");
      }
      if (this.itemForm.rybjid) {
        queryGenerateTeachingPlanData(this.itemForm).then(res => {
          if (res.code == 200 && res.data.allData.length > 0) {
            this.MonthList = res.data.monthMap;
            this.dataWwitching(this.MonthList.xueqiDict[0]);
          } else {
            this.MonthList = [];
          }
        });
      }
    },
    dataWwitching(row) {
      let monthitem = this.MonthList.monthList;
      this.MonthList.xueqiDict.forEach(value => {
        if (value.dictValue === row.dictValue) {
          value.ifClass = true;
        } else {
          value.ifClass = false;
        }
      });
      this.$nextTick(() => {
        this.monthitemTemplate = [];
        let count = [];
        for (const key in monthitem) {
          if (monthitem.hasOwnProperty(key)) {
            if (row.remark === key) {
              count.push(key);
              for (const name in monthitem[key]) {
                if (monthitem[key].hasOwnProperty(name)) {
                  monthitem[key][name].forEach(value => {
                    value.cjlx = Number(value.cjlx);
                    switch (value.cjlx) {
                      case 100:
                        value.styles = {
                          "font-size": "22px",
                          color: "#409EFF"
                        };
                        break;
                      case 101:
                        value.styles = {
                          "font-size": "20px",
                          color: "#67C23A"
                        };
                        break;
                      case 1:
                        value.styles = {
                          "font-size": "18px",
                          color: "#E6A23C"
                        };
                        break;
                      case 2:
                        value.styles = {
                          "font-size": "16px",
                          color: "#F56C6C"
                        };
                        break;
                      case 3:
                        value.styles = {
                          "font-size": "14px",
                          color: "#909399"
                        };
                        break;
                    }
                  });
                  this.monthitemTemplate.push({
                    title: `${name}  月`,
                    list: monthitem[key][name]
                  });
                }
              }
            }
          }
        }
        if (count.length == 0) {
          this.msgError("提示 : 暂时没有数据");
        }
      });
    },
    formatTime(time) {
      time = new Date(time);
      let F = time.getFullYear().toString();
      let M = String(time.getMonth() + 1);
      let D = time.getDate().toString();
      M = M.length == 1 ? `0${M}` : M;
      D = D.length == 1 ? `0${D}` : D;
      return F + "-" + M + "-" + D;
    }
  }
};
</script>

<style lang="scss" scoped>
.semester-view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .wrap-left-tar {
    width: 30%;
    ul {
      width: 100%;
      list-style: none;
      li {
        width: 80%;
        height: 40px;
        border: 2px solid #ccc;
        margin: 5px 0px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }
      li:hover {
        background: #409eff;
        color: #fff;
      }
      .back {
        background: #409eff;
        color: #fff;
      }
    }
  }
  .wrap-right-item {
    width: 70%;
    .wrap-ksItem {
      width: 100%;
      .ksItem {
        width: 100%;
        list-style: none;
        li {
          border: 3px solid #ccc;
          padding: 20px;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>

