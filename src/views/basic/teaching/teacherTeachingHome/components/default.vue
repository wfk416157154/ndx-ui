<template>
  <div class="defaults">
    <ul>
      <li class="wrap-current-course-progress">
        <h4>正常进度教学计划</h4>
        <div class="current-course-progress">
          <div class="left">
            <el-tree
              node-key="id"
              ref="zctree"
              :highlight-current="true"
              :default-expanded-keys="zcdefaultExpandedKeys"
              :data="zcTreeTeachingClassPlan"
              :props="zcdefaultProps"
              @node-click="handleNodeClick1"
            ></el-tree>
          </div>
          <div class="right">
            <div class="right-main" v-for="(item,index) in zctemplatetreeListTeacher" :key="index">
              <template v-if="zctemplatetreeListTeacher">
                <span
                  style="color :#67C23A;margin : 0;padding : 0"
                  v-if="item.isLastkc == '1'"
                >{{item.name}}</span>
                <span style="color : #303133;margin : 0;padding : 0" v-else>{{item.name}}</span>
              </template>
            </div>
          </div>
        </div>
      </li>
      <li class="wrap-current-course-progress">
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
      </li>
      <li class="review-progress">
        <h4>正常复习进度</h4>
        <div class="wrap-review">
          <div class="review-left-main">
            <div
              v-for="(item,index) in arr"
              @click="toGrade(item)"
              :class="{ 'back': item.ifClass}"
              :key="index"
            >{{item.name}}</div>
          </div>
          <div class="review-right-main">
            <div>复习语法1</div>
          </div>
        </div>
      </li>
      <li class="review-progress">
        <h4>当前复习进度</h4>
        <div class="wrap-review">
          <div class="review-left-main">
            <div
              v-for="(item,index) in arr"
              @click="toGrade(item)"
              :class="{ 'back': item.ifClass}"
              :key="index"
            >{{item.name}}</div>
          </div>
          <div class="review-right-main">
            <div>复习语法1</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { topHalfQuery, lowerHalf } from "@/api/teaching/generate";
export default {
  data() {
    return {
      defaultExpandedKeys: [],
      zcdefaultExpandedKeys: [],
      treeListTeacherData: [],
      templatetreeListTeacher: null,
      zctemplatetreeListTeacher: null,
      zcTreeTeachingClassPlan: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      zcdefaultProps: {
        children: "children",
        label: "name"
      },
      arr: [
        {
          name: "复习1",
          ifClass: false
        },
        {
          name: "复习2",
          ifClass: false
        },
        {
          name: "复习3",
          ifClass: false
        }
      ]
    };
  },
  props: ["item"],
  methods: {
    getList() {
      lowerHalf(this.item).then(res => {
        if (res.code == 200) {
          this.treeListTeacherData = JSON.parse(
            JSON.stringify(res.data.dqTreeTeachingClassPlan)
          );
          this.zcTreeTeachingClassPlan = JSON.parse(
            JSON.stringify(res.data.zcTreeTeachingClassPlan)
          );
          this.dataProcessing(
            this.treeListTeacherData,
            "defaultExpandedKeys",
            "templatetreeListTeacher",
            "dqtree"
          );
          this.dataProcessing(
            this.zcTreeTeachingClassPlan,
            "zcdefaultExpandedKeys",
            "zctemplatetreeListTeacher",
            "zctree"
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
    // 正常获取备课的详细信息
    handleNodeClick1(data) {
      if (data.weight == "1") {
        this.zctemplatetreeListTeacher = data.ifChildren;
      } else {
        this.zctemplatetreeListTeacher = null;
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
      this.arr.forEach(value => {
        if (value.name == item.name) {
          value.ifClass = true;
        } else {
          value.ifClass = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.defaults {
  width: 100%;
  height: 100%;
  ul {
    width: 100%;
    height: 100%;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    li {
      width: 49%;
      border: 2px solid #ccc;
      margin-bottom: 20px;
      padding: 20px;
    }
    .wrap-current-course-progress {
      .current-course-progress {
        display: flex;
        .left {
          width: 30%;
        }
        .right {
          width: 70%;
          .right-main {
            display: flex;
            justify-content: space-between;
            margin: 5px 0px;
          }
        }
      }
    }
    .review-progress {
      .wrap-review {
        width: 100%;
        display: flex;
        .review-left-main {
          width: 30%;
          div {
            width: 100px;
            height: 30px;
            line-height: 30px;
            background: #ccc;
            margin: 5px 0px;
            text-align: center;
            cursor: pointer;
          }
          .back {
            background: #e6a23c;
            color: #fff;
          }
        }
        .review-right-main {
          width: 70%;
          margin: 5px 0px;
          color: #e6a23c;
        }
      }
    }
  }
}
</style>
