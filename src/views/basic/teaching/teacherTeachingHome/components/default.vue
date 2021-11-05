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
        <div>
          <div
            v-for="(item,index) in zcReview"
            :key="index"
            style="display : flex;justify-content : space-between;align-items : center"
          >
            <!-- <p></p> -->
            <el-divider content-position="left">
              <span style="font-size : 16px">{{++index}} ) {{item.name}} :</span>
            </el-divider>
            <p style="width : 260px">{{item.sjfw}}</p>
          </div>
        </div>
      </li>
      <li class="review-progress">
        <h4>当前复习进度 {{jdbfb}}%</h4>
        <div class="wrap-item">
          <div class="left">
            <el-tree
              node-key="id"
              ref="fxtree"
              :highlight-current="true"
              :default-expanded-keys="fxDefaultExpandedKeys"
              :data="fxTreeListTeacherData"
              :props="fxDefaultProps"
              @node-click="fxHandleNodeClick"
            ></el-tree>
          </div>
          <div class="right">
            <!-- <ul style="list-style : none"> -->
            <!-- <li class="right-item" style="border : none;padding : 0" v-for="(item,index) in fxTemplatetreeListTeacher" :key="index">
                <template v-if="fxTemplatetreeListTeacher">
            <div style="width : 100%">-->
            <span
              style="color : #F56C6C;margin : 0;padding : 0;line-height : 20px;display:inline-block;width : 30%; margin: 10px 4px"
              v-for="(item,index) in fxTemplatetreeListTeacher"
              :key="index"
            >{{++index}}), {{item.name}}</span>
            <!-- </div>
            </template>-->
            <!-- </li>
            </ul>-->
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { topHalfQuery, lowerHalf } from "@/api/teaching/generate";
import { fxTreeListTeacher } from "@/api/basic/lessonPreparationHome";
export default {
  data() {
    return {
      defaultExpandedKeys: [],
      zcdefaultExpandedKeys: [],
      treeListTeacherData: [],
      templatetreeListTeacher: null,
      zctemplatetreeListTeacher: null,
      zcTreeTeachingClassPlan: [],
      fxTemplatetreeListTeacher: null,
      fxDefaultExpandedKeys: [],
      fxTreeListTeacherData: [],
      fxDefaultProps: {
        children: "children",
        label: "name"
      },
      defaultProps: {
        children: "children",
        label: "name"
      },
      zcdefaultProps: {
        children: "children",
        label: "name"
      },
      zcReview: null,
      jdbfb: null
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
      fxTreeListTeacher(this.item).then(res => {
        this.fxTreeListTeacherData = res.data.treeReview;
        this.jdbfb = res.data.jdbfb;
        this.zcReview = res.data.zcReview;
        this.fxDataProcessing(this.fxTreeListTeacherData);
      });
    },
    fxDataProcessing(item) {
      for (let i = 0; i < item.length; i++) {
        item[i].label = item[i].name;
        if (item[i].children && item[i].children.length > 0) {
          if (item[i].weight == "2") {
            if (item[i].isLastPrepare == "1") {
              this.$nextTick(() => {
                this.$refs.fxtree.setCurrentKey(item[i].id);
                this.fxDefaultExpandedKeys.push(item[i].id);
              });
              this.fxTemplatetreeListTeacher = item[i].children;
            }
            item[i].ifChildren = item[i].children;
            delete item[i].children;
          } else {
            this.fxDataProcessing(item[i].children);
          }
        } else {
          item[i].xzid = item[i].id;
        }
      }
    },
    // 复习
    fxHandleNodeClick(data) {
      if (data.weight == "2") {
        this.fxTemplatetreeListTeacher = data.ifChildren;
      } else {
        this.fxTemplatetreeListTeacher = null;
      }
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
        justify-content: space-between;
        .left {
          width: 30%;
        }
        .right {
          width: 68%;
          .right-main {
            display: flex;
            justify-content: space-between;
            margin: 5px 0px;
          }
        }
      }
    }
    .review-progress {
      .wrap-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        border: 2px solid #ddd;
        padding: 20px;
        box-sizing: border-box;
        .left {
          width: 40%;
        }
        .right {
          width: 58%;
          ul {
            width: 100%;
            .right-item {
              width: 100%;
              display: flex;
              margin-bottom: 10px;
              justify-content: space-between;
              align-items: center;
            }
          }
        }
      }
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
