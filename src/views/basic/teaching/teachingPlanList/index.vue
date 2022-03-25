<template>
  <div class="teaching-plan-list">
    <el-form :inline="true" :model="queryParams" ref="teachingPlanForm">
      <el-form-item label="教材" prop="jcid">
        <el-select
          filterable
          v-model="queryParams.jcid"
          placeholder="请选择教材"
        >
          <el-option
            v-for="(item, index) in listTeachingMaterial"
            :key="index"
            :label="item.jcmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开班时间" prop="sjall">
        <el-date-picker
          v-model="queryParams.sjall"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="学期" prop="kbxq">
        <el-select
          filterable
          v-model="queryParams.kbxq"
          placeholder="请选择学期"
        >
          <el-option
            v-for="(item, index) in teachingTermConfig"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="届数" prop="rybjmc">
        <el-input
          v-model="queryParams.rybjmc"
          placeholder="请输入届数"
        ></el-input>
      </el-form-item>
      <el-form-item label="校区" prop="xqid">
        <el-select
          filterable
          v-model="queryParams.xqid"
          @change="xqmcOnChange"
          placeholder="请选择校区"
        >
          <el-option
            v-for="item in schoolList"
            :key="item.id"
            :label="item.xxmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级" prop="rybjid">
        <el-select
          filterable
          v-model="queryParams.rybjid"
          placeholder="请选择班级"
        >
          <el-option
            :label="item.rybjmc"
            :value="item.id"
            v-for="(item, index) in classList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师" prop="lsid">
        <el-select
          filterable
          v-model="queryParams.lsid"
          placeholder="请选择老师"
        >
          <el-option
            v-for="(item, index) in teacherList"
            :key="index"
            :label="item.lsxm"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教学进度" prop="jxjd">
        <el-select filterable v-model="queryParams.jxjd" placeholder="请选择">
          <el-option
            v-for="(item, index) in teachingProgress"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程类型" prop="kclx">
        <el-select
          filterable
          v-model="queryParams.kclx"
          placeholder="请选择教学内容"
        >
          <el-option
            v-for="(item, index) in kcType"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList"
          >查询</el-button
        >
        <el-button @click="resetForm('teachingPlanForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="central-navigation">
      <ul>
        <li>
          <el-button type="primary" class="el-icon-plus" size="mini"
            >新增教学计划</el-button
          >
        </li>
        <li>
          <el-button
            type="danger"
            class="el-icon-refresh-right"
            size="mini"
            @click="updateClassPlanClick"
            >更新教学计划列表的数据</el-button
          >
        </li>
        <li>
          <div style="display: flex; width: 100%">
            <div style="width: 180px">进度条颜色标注</div>
            <ul class="navigation-title">
              <li>
                <span
                  style="
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    background: #409eff;
                    margin-right: 5px;
                  "
                ></span>
                <span style="isplay: inline-block; margin-right: 10px"
                  >正常</span
                >
              </li>
              <li>
                <span
                  style="
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    background: #67c23a;
                    margin-right: 5px;
                  "
                ></span>
                <span style="isplay: inline-block; margin-right: 10px"
                  >超前</span
                >
              </li>
              <li>
                <span
                  style="
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    background: #f56c6c;
                    margin-right: 5px;
                  "
                ></span>
                <span style="isplay: inline-block; margin-right: 10px"
                  >滞后</span
                >
              </li>
              <li>
                <span
                  style="
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    background: #e6a23c;
                    margin-right: 5px;
                  "
                ></span>
                <span style="isplay: inline-block; margin-right: 10px"
                  >复习</span
                >
              </li>
            </ul>
          </div>
          <!-- <div style="display : flex;width : 100%">
            <div style="width : 180px">班级信息卡标注</div>
            <ul class="navigation-title">
              <li>
                <span
                  style="display : inline-block;width : 10px;height : 10px;background : #409EFF;margin-right : 5px"
                ></span>
                <span style="isplay : inline-block;margin-right : 10px">测验</span>
              </li>
              <li>
                <span
                  style="display : inline-block;width : 10px;height : 10px;background : #67C23A;margin-right : 5px"
                ></span>
                <span style="isplay : inline-block;margin-right : 10px">新课</span>
              </li>
              <li>
                <span
                  style="display : inline-block;width : 10px;height : 10px;background : #E6A23C;margin-right : 5px"
                ></span>
                <span style="isplay : inline-block;margin-right : 10px">复习</span>
              </li>
              <li></li>
            </ul>
          </div>-->
        </li>
        <li>
          <div style="display: flex; align-items: center">
            <div style="margin-right: 20px">
              <h5>教学计划</h5>
            </div>
            <div>
              <span
                style="cursor: pointer"
                :class="['MonthView' == ifContent ? 'active-color' : '']"
                @click="toComponent('MonthView', 1)"
                >月</span
              >
              <el-divider direction="vertical"></el-divider>
              <span
                style="cursor: pointer"
                :class="['SemesterView' == ifContent ? 'active-color' : '']"
                @click="toComponent('SemesterView', 2)"
                >学期</span
              >
              <el-divider direction="vertical"></el-divider>
              <span
                style="cursor: pointer"
                :class="['WholeView' == ifContent ? 'active-color' : '']"
                @click="toComponent('WholeView', 3)"
                >全部</span
              >
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="teaching-plan-item">
      <ul class="teaching-list-content">
        <li v-for="(item, index) in teachingPlanData" :key="index">
          <div class="content-top">
            <div class="content-top-left">
              <div class="info-left">
                <h4>{{ item.rybjmc }}</h4>
                <div>
                  <span>当前课程 :</span>
                  <span>{{ item.nowCourseName }}</span>
                </div>
                <div>
                  <span>老师: {{ item.lsxm }}</span>
                </div>   
                <div>
                  <span>教学进度:</span>
                  <span>{{ jxjd(item.jxjd) }}</span>
                  <span v-if="item.jxjd == 0">{{ item.errorMsg }}</span>
                </div>

                <div>
                  <span>正常教学计划 :</span>
                  <span v-if="item.kclx == '1' && item.normalClassPlanObj">{{
                    item.normalClassPlanObj.sxmc
                  }}</span>
                  <span v-else> 已进入总复习 {{ item.startReviewDate }}</span>
                </div>
                <div>
                  <span>教材名称 :</span>
                  <span>{{ item.jcmc }}</span>
                </div>
                <div>
                  <span>时间区间 :</span>
                  <span
                    >{{ parseTime(item.kbsj, "{y}-{m}-{d}") }}至{{
                      parseTime(item.gksj, "{y}-{m}-{d}")
                    }}</span
                  >
                </div>
              </div>
              <div class="info-right">
                <el-button
                  size="mini"
                  style="width: 80px"
                  @click="toAddTeaching('addTeaching', item)"
                  >修正|查看</el-button
                >
                <br />
                <el-button size="mini" style="width: 80px">调用</el-button>
                <br />
                <el-button size="mini" style="width: 80px">导出</el-button>
              </div>
            </div>
            <div class="content-top-right">
              <el-scrollbar style="height: 100%">
                <!-- <ul>
                  <li v-for="(item,index) in 10" :key="index">
                    <h4>异常记录</h4>
                    <div>
                      <span>时间 :</span>
                      <span>2021-08-09</span>
                    </div>
                    <div>
                      <span>记录 :</span>
                      <span>张三将高二下学期9月第一周的课进行了延后操作。张三将高二下学期9月第一周的课进行了延后操作。张三将高二下学期9月第一周的课进行了延后操作。张三将高二下学期9月第一周的课进行了延后操作。张三将高二下学期9月第一周的课进行了延后操作。张三将高二下学期9月第一周的课进行了延后操作。</span>
                    </div>
                    <div>
                      <span>原因 :</span>
                      <span>学校运动会</span>
                    </div>
                  </li>
                </ul>-->
              </el-scrollbar>
            </div>
          </div>
          <div class="content-bottom">
            <!-- <div v-if="queryParams.kclx == 1" class="content-sj">
              <ul>
                <template v-if="item.monthList && item.monthList.length > 0">
                  <li v-for="(month, index) in item.monthList" :key="index">
                    <el-divider>{{ month }}</el-divider>
                  </li>
                </template>
                <template v-if="item.weekList && item.weekList.length > 0">
                  <li v-for="(week, index) in item.weekList" :key="index">
                    <el-divider>{{ week }}</el-divider>
                  </li>
                </template>
                <template
                  v-if="item.termDictList && item.termDictList.length > 0"
                >
                  <li
                    v-for="(termDict, index) in item.termDictList"
                    :key="index"
                  >
                    <el-divider>{{ termDict.dictLabel }}</el-divider>
                  </li>
                </template>
              </ul>
            </div> -->
            <div>
              <div v-if="item.lessonProcessObjList.length > 0">
                <ndx-progress
                  v-if="item.normalClassPlanObj"
                  :progressItem="item.lessonProcessObjList"
                  :propressTitle="item.classPlanNodeInfoList"
                  :nowCourseName="item.nowCourseName"
                  :jcmc="item.normalClassPlanObj.sxmc"
                />
              </div>
              <!-- <div  v-if="item.reviewProcessObjList.length > 0">
                <el-button type="success" @click="dialogVisxibleFx = true"
                  >查看复习进度</el-button
                >
                <el-dialog
                  title="查看复习进度"
                  :visible.sync="dialogVisxibleFx"
                  width="80%"
                >
                  <div v-for="(row, j) in item.reviewProcessObjList" :key="j">
                    <p style="margin-right: 30px; width: 100%">
                      {{ row.reviewName }}
                    </p>
                    <el-progress
                      :text-inside="true"
                      :stroke-width="22"
                      :percentage="row.reviewProcessList[0].percentage"
                      status="warning"
                    ></el-progress>
                  </div>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisxibleFx = false"
                      >取 消</el-button
                    >
                  </span>
                </el-dialog>
              </div> -->
            </div>
          </div>
        </li>
      </ul>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { adminList, updateClassPlanResult } from "@/api/teaching/classPlan";
import { listTeachingMaterial } from "@/api/basic/teachingMaterial";
import { listSchool } from "@/api/basic/school";
import { listBjclass } from "@/api/basic/bjclass";
import { listTeacher } from "@/api/basic/teacher";
import NewPropress from "@/components/ndx-progress/new-propress";
export default {
  data() {
    return {
      teachingPlanData: [],
      ifContent: "SemesterView",
      dialogVisxibleFx: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jcid: null,
        sjall: [],
        kbxq: null,
        rybjmc: null,
        xqid: null,
        rybjid: null,
        lsid: null,
        jxjd: null,
        kclx: null,
        ksrq: null,
        jzrq: null,
        queryType: 2,
      },
      total: 0,
      // 学期
      teachingTermConfig: [],
      // 教学进度
      teachingProgress: [],
      // 教材
      listTeachingMaterial: [],
      // 课程类型
      kcType: [],
      // 校区
      schoolList: [],
      // 班级
      classList: [],
      // 老师
      teacherList: [],
    };
  },
  components: {
    NewPropress,
  },
  created() {
    this.getDicts("nianji").then((response) => {
      this.teachingTermConfig = response.data;
    });
    this.getDicts("teachingProgress").then((response) => {
      this.teachingProgress = response.data;
    });
    this.getDicts("jfzl-kcjd").then((response) => {
      this.kcType = response.data;
    });
    listSchool().then((response) => {
      this.schoolList = response.rows;
    });
    listBjclass().then((res) => {
      this.classList = res.rows;
    });
    listTeacher().then((response) => {
      this.teacherList = response.rows;
    });
    listTeachingMaterial({ parentId: 0 }).then((res) => {
      this.listTeachingMaterial = res.data;
    });
  },
  mounted() {
    //this.getList();
  },
  methods: {
    // 进度转换
    jxjd(type) {
      let label = "";
      this.teachingProgress.map((value) => {
        if (value.dictValue == type) {
          label = value.dictLabel;
        }
      });
      return label;
    },
    // 基础数据
    getList() {
      this.queryParams.ksrq = this.queryParams.sjall[0];
      this.queryParams.jzrq = this.queryParams.sjall[1];
      adminList(this.queryParams).then((res) => {
        this.teachingPlanData = res.rows;
        this.total = res.total;
      });
    },
    // 获取班级
    xqmcOnChange(xqid) {
      if (!xqid) {
        this.classList = [];
        return;
      }
      listBjclass({ kzzd1: xqid }).then((res) => {
        this.classList = res.rows;
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getList();
    },
    // 组件
    toComponent(value, type) {
      this.ifContent = value;
      this.queryParams.queryType = type;
      this.getList();
    },
    // 修正按钮
    toAddTeaching(path, item) {
      this.getConfigKey(path).then((res) => {
        this.$router.push({
          path: res.msg,
          query: {
            flag: "addTeachingPage", // 生成教学计划页面
            [path]: item,
          },
        });
      });
    },
    updateClassPlanClick() {
      updateClassPlanResult().then((res) => {
        this.msgSuccess(res.msg);
      });
    },
  },
};
</script>

<style lang="scss">
.teaching-plan-list {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  .central-navigation {
    width: 100%;
    ul {
      width: 100%;
      list-style: none;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      padding: 0 40px;
      li {
        width: 30%;
        .navigation-title {
          width: 100%;
          li {
            width: 100%;
            float: left;
          }
        }
        .active-color {
          color: #409eff;
        }
      }
    }
  }
  .teaching-plan-item {
    width: 100%;
    height: 100%;
    -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 1px solid #e6ebf5;
    padding: 20px 30px;
    box-sizing: border-box;
    .teaching-list-content {
      width: 100%;
      height: 100%;
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        width: 100%;
        height: 100%;
        border: 2px solid #ccc;
        margin-bottom: 20px;
        .content-top {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          .content-top-left {
            width: 35%;
            height: 100%;
            display: flex;
            padding: 20px;
            box-sizing: border-box;
            border: 2px solid #ccc;
            border-left: none;
            border-top: none;
            border-bottom: none;
            .info-left {
              width: 80%;
              height: 100%;
              h4 {
                margin: 5px 0px;
              }
              div {
                span {
                  line-height: 30px;
                }
              }
            }
            .info-right {
              width: 20%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
          }
          .content-top-right {
            width: 60%;
            height: 100%;
            // border-bottom: 2px solid #ccc;
            padding-top: 10px;
            .el-scrollbar__wrap {
              overflow-x: hidden;
            }
            ul {
              width: 600px;
              height: 180px;
              list-style: none;
              white-space: nowrap;
              margin: 0;
              padding: 0;
              li {
                width: 300px;
                height: 160px;
                margin-right: 20px;
                display: inline-block;
                padding: 10px;
                box-sizing: border-box;
                h4 {
                  margin: 0;
                  margin-bottom: 5px;
                }
                div {
                  width: 100%;
                  padding-left: 10px;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  span {
                    white-space: pre-wrap !important;
                    line-height: 30px;
                    color: olive;
                  }
                }
              }
              li:nth-child(1) {
                margin-left: 20px;
              }
            }
          }
        }
        .content-bottom {
          width: 100%;
          height: 100%;
          // background: crimson;
          border-top: 2px solid #ccc;
          padding: 10px 10px;
          box-sizing: border-box;
          .progress {
            display: flex;
            margin-top: 0;
          }
          .content-sj {
            width: 100%;
            margin-top: 10px;
            ul {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: space-between;
              list-style: none;
              text-align: center;
              li {
                height: 45px;
                border: 1px solid #ccc;
                border-top: 0;
                border-bottom: 0;
                margin: 0;
              }
            }
          }
          .progress-title {
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
</style>

