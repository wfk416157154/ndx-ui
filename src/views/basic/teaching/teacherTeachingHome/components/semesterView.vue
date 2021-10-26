<template>
  <div class="semester-vaiew">
    <div class="wrap-left">
      <ul style="margin : 0;padding : 0;list-style : none">
        <li
          style="padding: 2px;
          box-sizing: border-box;
          border: 2px solid #ccc;
          margin-bottom: 10px;
          text-align: center;
          cursor: pointer;"
          :class="{ 'back': item.ifClass}"
          @click="toGrade(item)"
          v-for="(item,index) in monthMapKey"
          :key="index"
        >{{item.key}}</li>
      </ul>
      <div class="itemTemplate">
        <ul v-if="monthMapTemplate" style="width : 100%;margin : 0;padding : 0;list-style : none">
          <li
            style="width : 100% ; display: flex;
            justify-content: space-between;align-items : center"
            v-for="(item,index) in monthMapTemplate"
            :key="index"
          >
            <p style="width :60%">
              <el-divider content-position="left">
                <span style="font-size : 18px">{{item.jdmc}}</span>
              </el-divider>
            </p>
            <p>{{item.ksrq}} - {{item.jzrq}}</p>
          </li>
        </ul>
      </div>
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
      monthMapKey: [],
      monthMapValue: {},
      monthMapTemplate: [],
      defaultExpandedKeys: [],
      templatetreeListTeacher: null,
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  props: ["item"],
  methods: {
    getList() {
      lowerHalf(this.item).then(res => {
        if (res.code == 200) {
          this.monthMapKey = [];
          this.monthMapValue = res.data.monthMap;
          let disposable = true;
          for (const key in this.monthMapValue) {
            if (this.monthMapValue.hasOwnProperty(key)) {
              if (disposable) {
                this.monthMapKey.push({
                  key,
                  ifClass: true
                });
                this.monthMapTemplate = this.monthMapValue[key];
                disposable = false;
              } else {
                this.monthMapKey.push({
                  key,
                  ifClass: false
                });
              }
            }
          }
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
    // 当前获取备课的详细信息
    handleNodeClick(data) {
      if (data.weight == "1") {
        this.templatetreeListTeacher = data.ifChildren;
      } else {
        this.templatetreeListTeacher = null;
      }
    },
    toGrade(item) {
      for (let index = 0; index < this.monthMapKey.length; index++) {
        if (item.key == this.monthMapKey[index].key) {
          this.monthMapKey[index].ifClass = true;
          this.monthMapTemplate = this.monthMapValue[item.key];
        } else {
          this.monthMapKey[index].ifClass = false;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.semester-vaiew {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .wrap-left {
    width: 49%;
    height: 100%;
    border: 2px solid #ccc;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    ul {
      width: 20%;
      li {
        // padding: 2px;
        // box-sizing: border-box;
        // border: 2px solid #ccc;
        // margin-bottom: 10px;
        // text-align: center;
        // cursor: pointer;
      }
      .back {
        background: #409eff;
        color: #fff;
      }
    }
    .itemTemplate {
      width: 68%;
    }
  }
  .wrap-right {
    width: 49%;
    height: 100%;
    border: 2px solid #ccc;
    padding: 20px;
    box-sizing: border-box;
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
