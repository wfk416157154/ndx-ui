<template>
  <div class="teacherTeachingHome">
    <el-form ref="form" :model="form" :inline="true" label-width="80px">
      <el-form-item label="班级">
        <el-select v-model="form.bjid" placeholder="请选择日语班级" @change="rybjOnChange" filterable>
          <el-option
            v-for="item in bjclassList"
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="wrap-header">
      <h3 style="margin-right : 20px">教学计划</h3>
      <h3
        style="cursor: pointer;"
        :class="['defaults' == ifContent ? 'active-color' : '']"
        @click="toComponent('defaults')"
      >默认</h3>
      <el-divider direction="vertical"></el-divider>
      <h3
        style="cursor: pointer;"
        :class="['SemesterView' == ifContent ? 'active-color' : '']"
        @click="toComponent('SemesterView')"
      >学期</h3>
      <el-divider direction="vertical"></el-divider>
      <h3
        style="cursor: pointer;"
        :class="['MonthView' == ifContent ? 'active-color' : '']"
        @click="toComponent('MonthView')"
      >月</h3>
      <el-divider direction="vertical"></el-divider>
      <h3
        style="cursor: pointer;"
        :class="['WholeView' == ifContent ? 'active-color' : '']"
        @click="toComponent('WholeView')"
      >总</h3>
    </div>
    <div class="wrap-information">
      <div class="main-left">
        <div class="class-name">
          <h3>陇南扬名20级22届（高二上开班）</h3>
        </div>
        <div class="course-information">
          <h3>当前课程 :</h3>
          <h3>第三课</h3>
          <h3 style="color : #67c23a">新课</h3>
        </div>
        <div class="time-frame">
          <span>时间区间 :</span>
          <span>2020-08-01至2022-06-07</span>
        </div>
        <div class="teacher-name">
          <span>老师 :</span>
          <span>吴珂</span>
        </div>
        <div class="teaching-progress">
          <span>教学进度 :</span>
          <span>超前</span>
        </div>
        <div class="adjustment-btn">
          <el-button type="primary" size="mini">调整</el-button>
        </div>
      </div>
      <div class="main-right">
        <div class="normal-progress">
          <h3>教学计划正常进度</h3>
          <div class="Progress-item">
            <div class="range-title">
              <span :style="parentStyle" v-for="(item,index) in arr" :key="index">{{item.name}}</span>
            </div>
            <el-progress
              :text-inside="true"
              color="#67c23a"
              :stroke-width="20"
              :percentage="100"
              status="success"
            ></el-progress>
          </div>
        </div>
        <div class="actual-progress">
          <h3>教学计划当前进度</h3>
          <div class="Progress-item">
            <div class="range-title">
              <span :style="parentStyle" v-for="(item,index) in arr" :key="index">{{item.name}}</span>
            </div>
            <el-progress :text-inside="true" :stroke-width="20" :percentage="50" status="exception"></el-progress>
          </div>
        </div>
      </div>
    </div>
    <div class="wrap-footer">
      <el-card class="box-card">
        <defaults :item="form" v-if="ifContent == 'defaults'" ref="defaults" />
        <MonthView :item="form" v-if="ifContent == 'MonthView'" />
        <SemesterView :item="form" v-if="ifContent == 'SemesterView'" />
        <WholeView :item="form" v-if="ifContent == 'WholeView'" />
      </el-card>
    </div>
  </div>
</template>

<script>
import defaults from "./components/default";
import MonthView from "./components/monthView";
import SemesterView from "./components/semesterView";
import WholeView from "./components/wholeView";
import { listBjclass } from "@/api/basic/bjclass";
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
        lsid: this.$store.state.user.glrid,
        bjid: null,
        jcid: null
      },
      bjclassList: []
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
    MonthView,
    SemesterView,
    WholeView
  },
  created() {
    listBjclass({ lsid: this.form.lsid }).then(response => {
      this.bjclassList = response.rows;
      if (response.rows.length == 1) {
        this.form.bjid = response.rows[0].id;
        this.form.jcid = response.rows[0].uname;
        this.getList();
        this.$refs.defaults.getList();
      } else {
        this.form.bjid = null;
      }
    });
  },
  methods: {
    // 组件
    toComponent(value) {
      this.ifContent = value;
      this.$nextTick(() => {
        this.$refs.defaults.getList();
      });
    },
    // 获取数据
    getList() {},
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
            justify-content: space-between;
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
            justify-content: space-between;
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
