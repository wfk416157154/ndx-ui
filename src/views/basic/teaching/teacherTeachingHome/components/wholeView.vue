
<template>
  <div class="wrap-all">
    <div class="left">
      <el-table border :data="xueqiMapMap" :span-method="objectSpanMethod" style="width: 100%">
        <el-table-column prop="xqmc" label="学期名称"></el-table-column>
        <el-table-column prop="ssyf" label="月份"></el-table-column>
        <el-table-column prop="yxz" label="有效周"></el-table-column>
        <el-table-column prop="jincheng" label="进程"></el-table-column>
        <el-table-column prop="kclx" label="课程类型" :formatter="getKclx"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="时间" width="200px">
          <template slot-scope="scope">
            <span>{{scope.row.ksrq}} - {{scope.row.jzrq}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="wrap-right">
      <h4>当前进度教学计划</h4>
      <div class="current-course-progress">
        <div class="left">
          <el-tree
            node-key="id"
            ref="dqtree"
            :highlight-current="true"
            :default-expanded-keys="defaultExpandedKeys"
            :data="treeListTeacherData"
            :props="defaultProps"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
        <div class="right">
          <div class="right-main" v-for="(item,index) in templatetreeListTeacher" :key="index">
            <template v-if="templatetreeListTeacher">
              <span
                style="color :#67C23A;margin : 0;padding : 0"
                v-if="item.isLastkc == '1'"
              >{{item.name}}</span>
              <span style="color : #303133;margin : 0;padding : 0" v-else>{{item.name}}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { lowerHalf } from "@/api/teaching/generate";
export default {
  data() {
    return {
      typeNameArr: [],
      typeNamePos: 0,
      defaultExpandedKeys: [],
      xueqiMapMap: [],
      templatetreeListTeacher: null,
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  props: ["item"],
  created() {
    this.getDicts("teachingCourseType").then(response => {
      this.teachingCourseType = response.data;
    });
  },
  mounted() {
    this.merage();
  },
  methods: {
    getList() {
      lowerHalf(this.item).then(res => {
        if (res.code == 200) {
          this.xueqiMapMap = res.data.xueqiMapMap.xueqiMap;
          this.merage();
          this.treeListTeacherData = JSON.parse(
            JSON.stringify(res.data.dqTreeTeachingClassPlan)
          );
          this.dataProcessing(
            this.treeListTeacherData,
            "defaultExpandedKeys",
            "templatetreeListTeacher",
            "dqtree"
          );
        }
      });
    },
    dataProcessing(item, key, templates, trees) {
      for (let i = 0; i < item.length; i++) {
        if (item[i].children && item[i].children.length > 0) {
          if (item[i].weight == "1") {
            if (item[i].isLastdy == "1") {
              this.$nextTick(() => {
                this.$refs[trees].setCurrentKey(item[i].id);
                this[key].push(item[i].id);
              });
              this[templates] = item[i].children;
            }
            item[i].ifChildren = item[i].children;
            delete item[i].children;
          } else {
            this.dataProcessing(item[i].children, key, templates, trees);
          }
        }
      }
    },
    handleNodeClick(data) {
      if (data.weight == "1") {
        this.templatetreeListTeacher = data.ifChildren;
      } else {
        this.templatetreeListTeacher = null;
      }
    },
    getKclx(row, column) {
      return this.selectDictLabel(this.teachingCourseType, row.kclx);
    },
    merageInit() {
      this.typeNameArr = [];
      this.typeNamePos = 0;
    },
    merage() {
      this.merageInit();
      for (let i = 0; i < this.xueqiMapMap.length; i += 1) {
        if (i === 0) {
          this.typeNameArr.push(1);
          this.typeNamePos = 0;
        } else {
          if (this.xueqiMapMap[i].xqmc === this.xueqiMapMap[i - 1].xqmc) {
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

<style lang="scss" scoped>
.wrap-all {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .left {
    width: 49%;
  }
  .wrap-right {
    width: 49%;
    border: 2px solid #ccc;
    padding: 25px;
    .current-course-progress {
      display: flex;
      justify-content: space-between;
      .left {
        width: 30%;
      }
      .right {
        width: 65%;
        .right-main {
          display: flex;
          justify-content: space-between;
          margin: 5px 0px;
        }
      }
    }
  }
}
</style>

