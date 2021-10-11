<template>
  <div class="defaults">
    <ul>
      <li class="wrap-current-course-progress">
        <h4>当前进度教学计划</h4>
        <div class="current-course-progress">
          <div class="left">
            <el-tree
              node-key="id"
              ref="tree"
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
                <span style="color : #303133;margin : 0;padding : 0">{{item.kcmc}} - {{item.name}}</span>
                <div>
                  <el-tag
                    style="width : 80px;text-align : center"
                    type="success"
                    effect="dark"
                    v-if="item.sfbk == '1'"
                  >已备课</el-tag>
                  <el-tag
                    style="width : 80px;text-align : center"
                    type="danger"
                    effect="dark"
                    v-else
                  >未完成</el-tag>
                </div>
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
              ref="tree"
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
                <span style="color : #303133;margin : 0;padding : 0">{{item.kcmc}} - {{item.name}}</span>
                <div>
                  <el-tag
                    style="width : 80px;text-align : center"
                    type="success"
                    effect="dark"
                    v-if="item.sfbk == '1'"
                  >已完成</el-tag>
                  <el-tag
                    style="width : 80px;text-align : center"
                    type="danger"
                    effect="dark"
                    v-else
                  >未完成</el-tag>
                </div>
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
import { treeListTeacher } from "@/api/basic/lessonPreparationHome";
export default {
  data() {
    return {
      defaultExpandedKeys: [],
      treeListTeacherData: [],
      templatetreeListTeacher: null,
      defaultProps: {
        children: "children",
        label: "label"
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
  created() {},
  mounted() {},
  methods: {
    getList() {
      treeListTeacher(this.item).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].children = res.data[i].treeTeachingTemplateList;
          delete res.data[i].treeTeachingTemplateList;
        }
        this.treeListTeacherData = JSON.parse(JSON.stringify(res.data));
        this.dataProcessing(this.treeListTeacherData);
        console.log(this.treeListTeacherData);
      });
    },
    dataProcessing(item) {
      for (let i = 0; i < item.length; i++) {
        item[i].label = item[i].name;
        if (item[i].children && item[i].children.length > 0) {
          if (item[i].weight == "2") {
            if (item[i].isLastPrepare == "1") {
              this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(item[i].id);
                this.defaultExpandedKeys.push(item[i].id);
              });
              this.templatetreeListTeacher = item[i].children;
            }
            item[i].ifChildren = item[i].children;
            delete item[i].children;
          } else {
            this.dataProcessing(item[i].children);
          }
        } else {
          item[i].xzid = item[i].id;
        }
      }
    },
    // 获取备课的详细信息
    handleNodeClick(data) {
      // console.log(data);
      if (data.weight == "2") {
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
