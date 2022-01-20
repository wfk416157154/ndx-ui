<template>
  <div class="teacherTeachingHome">
    <el-form ref="form" :model="form" :inline="true" label-width="80px">
      <el-form-item label="班级">
        <el-select v-model="form.bjid" filterable placeholder="请选择班级">
          <el-option
            :label="item.rybjmc"
            :value="item.id"
            v-for="(item,index) in classList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <div v-if="ifTemplate">
      <div class="wrap-header">
        <h3 style="margin-right : 20px">教学计划</h3>
        <h3
          style="cursor: pointer;"
          :class="['defaults' == ifContent ? 'active-color' : '']"
          @click="toComponent('defaults','1')"
        >月</h3>
        <el-divider direction="vertical"></el-divider>
        <h3
          style="cursor: pointer;"
          :class="['SemesterView' == ifContent ? 'active-color' : '']"
          @click="toComponent('SemesterView','2')"
        >学期</h3>
        <el-divider direction="vertical"></el-divider>
        <h3
          style="cursor: pointer;"
          :class="['WholeView' == ifContent ? 'active-color' : '']"
          @click="toComponent('WholeView','3')"
        >总</h3>
      </div>
      <div v-if="!progressData.enterReview" class="wrap-information">
        <div class="main-left">
          <div class="class-name">
            <h3>{{progressData.teachingClassInfo.bjmc}}</h3>
          </div>
          <div class="course-information">
            <h3 class="title">当前课程 :</h3>
            <h3>{{progressData.teachingClassInfo.dqkc}}</h3>
          </div>
          <div class="time-frame">
            <span>时间区间 :</span>
            <span>{{progressData.teachingClassInfo.sjqj}}</span>
          </div>
          <div class="teacher-name">
            <span>老师 :</span>
            <span>{{progressData.teachingClassInfo.lsxm}}</span>
          </div>
          <div class="teaching-progress">
            <span>教学进度 :</span>
            <span>{{progressData.teachingClassInfo.jxjd}}</span>
          </div>
          <div class="adjustment-btn">
            <!-- <el-button type="primary" size="mini">调整</el-button> -->
          </div>
        </div>
        <div class="main-right">
          <div class="normal-progress">
            <h3>教学计划正常进度</h3>
            <div class="Progress-item">
              <div class="range-title">
                <span
                  :style="parentStyle"
                  v-for="(item,index) in progressData.zcjd"
                  :key="index"
                >{{item.name}}</span>
              </div>
              <el-progress
                :text-inside="true"
                color="#67c23a"
                :stroke-width="20"
                :percentage="progressData.zcjdbfb"
                status="success"
              ></el-progress>
            </div>
          </div>
          <div class="actual-progress">
            <h3>教学计划当前进度</h3>
            <div class="Progress-item">
              <div class="range-title">
                <span
                  :style="parentStyle"
                  v-for="(item,index) in progressData.dqjd"
                  :key="index"
                >{{item.name}}</span>
              </div>
              <el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="progressData.dqjdbfb"
                status="exception"
              ></el-progress>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="wrap-information">
        <div class="main-left">
          <div class="class-name">
            <h3>{{progressData.teachingClassInfo.bjmc}}</h3>
            <div style="margin-top : 20px">
              <span>老师 :</span>
              <span>{{progressData.teachingClassInfo.lsxm}}</span>
            </div>
          </div>
        </div>
        <div class="main-right">
          <div>
            <div>
              <div v-for="(key,j) in progressData.reviewList" :key="j">
                <p>{{key.reviewName}}</p>
                <el-progress
                  :text-inside="true"
                  :stroke-width="22"
                  :percentage="key.reviewProcessList[0].percentage"
                  status="warning"
                ></el-progress>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="wrap-footer">
        <el-card class="box-card">
          <defaults :item="form" v-if="ifContent == 'defaults'" ref="defaults" />
          <SemesterView :item="form" v-if="ifContent == 'SemesterView'" ref="SemesterView" />
          <WholeView :item="form" v-if="ifContent == 'WholeView'" ref="WholeView" />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import defaults from "./components/default";
import SemesterView from "./components/semesterView";
import WholeView from "./components/wholeView";
import { listBjclass } from "@/api/basic/bjclass";
import { topHalfQuery, lowerHalf } from "@/api/teaching/generate";
export default {
  data() {
    return {
      ifContent: "defaults",
      arr: [
        {
          num: 100,
          name: "第一课"
        },
        {
          num: 100,
          name: "第二课第二课第二课第二课第二课第二课第二课第二课第二课"
        },
        {
          num: 100,
          name: "第三课"
        },
        {
          num: 100,
          name: "第四课"
        }
      ],
      form: {
        bjid: null,
        lx: "1"
      },
      bjclassList: [],
      classList: [],
      progressData: {
        dqjd: [],
        teachingClassInfo: {},
        zcjd: []
      },
      ifTemplate: false
    };
  },
  computed: {
    parentStyle() {
      let styles = {};
      styles.width = 100 / this.arr.length + "%";
      return styles;
    }
  },
  components: {
    defaults,
    SemesterView,
    WholeView
  },
  created() {
    listBjclass().then(res => {
      this.classList = res.rows;
    });
    if (this.$route.query.bjid) {
      this.form.bjid = this.$route.query.bjid;
      this.getList();
    }
  },
  methods: {
    // 组件
    toComponent(value, lx) {
      this.ifContent = value;
      this.form.lx = lx;
      this.$nextTick(() => {
        this.getList();
        this.$refs[value].getList();
      });
    },
    // 获取数据
    getList() {
      topHalfQuery(this.form).then(res => {
        if (res.code == 200) {
          this.progressData = res.data;
          if (this.progressData) {
            this.ifTemplate = true;
            this.$nextTick(() => {
              this.$refs[this.ifContent].getList();
            });
          } else {
            this.ifTemplate = false;
            this.msgError("提示 : 本班级暂时没有教学计划数据");
          }
        } else {
          this.ifTemplate = false;
          this.msgError("提示 : 数据查询错误");
        }
      });
    },
    // 切换班级
    rybjOnChange(id) {
      this.bjclassList.forEach(value => {
        if (value.id == id) {
          this.form.bjid = value.id;
          this.form.jcid = value.uname;
          this.getList();
        }
      });
    }
  }
};
</script>

<style lang="scss">
.teacherTeachingHome {
  width: 100%;
  padding: 100%;
  padding: 40px;
  box-sizing: border-box;
  .wrap-header {
    display: flex;
    align-items: center;
    .active-color {
      color: #409eff;
    }
  }
  .wrap-information {
    width: 100%;
    // height: 300px;
    display: flex;
    .main-left {
      width: 30%;
      // background: pink;
      border: 3px solid #ccc;
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .class-name {
        h3 {
          margin: 0;
          padding: 0;
        }
      }
      .course-information {
        display: flex;
        margin-top: 8px;
        .title {
          width: 180px;
        }
        h3 {
          margin: 0;
          padding: 0;
          margin-right: 10px;
        }
      }
      .time-frame {
        margin-top: 8px;
      }
      .teacher-name {
        margin-top: 8px;
      }
      .teaching-progress {
        margin-top: 8px;
      }
      .adjustment-btn {
        margin-top: 8px;
      }
    }
    .main-right {
      width: 70%;
      // background: coral;
      padding: 20px;
      border: 3px solid #ccc;
      border-left: none;
      box-sizing: border-box;
      .normal-progress {
        margin: 0;
        padding: 0;
        .Progress-item {
          .range-title {
            display: flex;
            justify-content: space-evenly;
            margin-bottom: 10px;
            span {
              text-align: center;
              display: inline-block;
              color: #67c23a;
            }
          }
        }
      }
      .actual-progress {
        margin: 0;
        padding: 0;
        .Progress-item {
          .range-title {
            display: flex;
            justify-content: space-evenly;
            margin-bottom: 10px;
            span {
              text-align: center;
              display: inline-block;
              color: #f56c6c;
            }
          }
        }
      }
    }
  }
  .wrap-footer {
    margin-top: 20px;
    width: 100%;
    height: 100%;
  }
}
</style>
