<template>
  <div class="semester-view">
    <div class="wrap-left-tar">
      <ul>
        <li
          v-for="(item,index) in xueqiDict"
          :class="{ 'back': item.ifClass}"
          :key="index"
          @click="dataWwitching(item)"
        >{{item.dictLabel}}</li>
      </ul>
    </div>
    <div class="wrap-right-item">
      <el-table border :data="itemTemplate" style="width: 100%">
        <el-table-column prop="ssyf" label="月份" width="100"></el-table-column>
        <el-table-column prop="yxz" label="有效周" width="100"></el-table-column>
        <el-table-column prop="jincheng" label="进程"></el-table-column>
        <el-table-column prop="kclx" label="课程类型" :formatter="getKclx"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            <span>{{scope.row.ksrq}} - {{scope.row.jzrq}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { queryGenerateTeachingPlanData } from "@/api/teaching/generate";
export default {
  data() {
    return {
      arr: [
        {
          name: "高一上",
          ifClass: false
        },
        {
          name: "高二上",
          ifClass: false
        },
        {
          name: "高三上",
          ifClass: false
        }
      ],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      itemForm: {},
      xueqiDict: [],
      xueqiMap: {},
      itemTemplate: [],
      teachingCourseType: []
    };
  },
  props: ["item"],
  created() {
    this.getDicts("teachingCourseType").then(response => {
      this.teachingCourseType = response.data;
    });
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
            this.xueqiDict = JSON.parse(
              JSON.stringify(res.data.monthMap.xueqiDict)
            );
            this.xueqiMap = res.data.xueqiMap;
            this.dataWwitching(this.xueqiDict[0]);
          }
        });
      }
    },
    dataWwitching(row) {
      this.xueqiDict.forEach(value => {
        if (value.dictValue === row.dictValue) {
          value.ifClass = true;
        } else {
          value.ifClass = false;
        }
      });
      let count = [];
      for (const key in this.xueqiMap) {
        if (this.xueqiMap.hasOwnProperty(key)) {
          if (key == row.remark) {
            count.push(key);
            this.itemTemplate = this.xueqiMap[key];
          }
        }
      }
      if (count.length == 0) {
        this.msgError("提示 : 暂时没有数据");
      }
    },
    getKclx(row, column) {
      return this.selectDictLabel(this.teachingCourseType, row.kclx);
    }
  }
};
</script>

<style lang="scss">
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
  }
}
</style>

