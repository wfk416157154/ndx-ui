<template>
  <div class="semester-view">
    <div class="wrap-right-item">
      <el-table border :data="xueqiMap" :span-method="objectSpanMethod" style="width: 100%">
        <el-table-column prop="xqmc" label="学期名称"></el-table-column>
        <el-table-column prop="ssyf" label="月份"></el-table-column>
        <el-table-column prop="yxz" label="有效周"></el-table-column>
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
      itemForm: {},
      xueqiMap: [],
      teachingCourseType: [],
      typeNameArr: [],
      typeNamePos: 0
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
      this.xueqiMap = [];
      this.itemForm = JSON.parse(JSON.stringify(this.item));
      if (this.itemForm && typeof this.itemForm.zfx == "object") {
        this.itemForm.zfx = this.itemForm.zfx.join(",");
      }
      if (this.itemForm.rybjid) {
        queryGenerateTeachingPlanData(this.itemForm).then(res => {
          if (res.code == 200) {
            this.xueqiMap = res.data.xueqiMap;
            this.merageData();
          }
        });
      }
    },
    getKclx(row, column) {
      return this.selectDictLabel(this.teachingCourseType, row.kclx);
    },
    merageData() {
      for (let i = 0; i < this.xueqiMap.length; i += 1) {
        if (i === 0) {
          this.typeNameArr.push(1);
          this.typeNamePos = 0;
        } else {
          if (this.xueqiMap[i].xqmc === this.xueqiMap[i - 1].xqmc) {
            this.typeNameArr[this.typeNamePos] += 1;
            this.typeNameArr.push(0);
          } else {
            this.typeNameArr.push(1);
            this.typeNamePos = i;
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const row1 = this.typeNameArr[rowIndex];
        const col1 = row1 > 0 ? 1 : 0;
        return {
          rowspan: row1,
          colspan: col1
        };
      }
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
  .wrap-right-item {
    width: 100%;
  }
}
</style>

