<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card>
          <el-tabs
            type="card"
            v-model="activeTab"
            @tab-click="switchingClasses(activeTab)"
          >
            <el-tab-pane
              v-for="item in listBjclass"
              :key="item.id"
              :label="item.rybjmc"
              :name="item.id"
            >
              <div class="wrap-info">
                <ul class="list-group list-group-striped">
                  <li style="padding-bottom: 10px; font-size: 14px">
                    日语班级
                    <div class="pull-right">{{ item.rybjmc }}</div>
                  </li>
                  <li class="list-group-item">
                    姓名
                    <div class="pull-right">{{ item.lsxm }}</div>
                  </li>
                  <li class="list-group-item">
                    校区
                    <div class="pull-right">{{ item.xqmc }}</div>
                  </li>
                  <li class="list-group-item">
                    开班时间
                    <div class="pull-right">{{ item.kbsj }}</div>
                  </li>
                  <li class="list-group-item">
                    班级人数
                    <div class="pull-right">{{ item.bjrs }}</div>
                  </li>
                  <li class="list-group-item">
                    录入时间
                    <div class="pull-right">{{ item.kzzd3 }}</div>
                  </li>
                </ul>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="color: #00afff">课表</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="更多课表"
              placement="top-end"
            >
              <span
                @click="switchingClasses(activeTab)"
                style="float: right; color: #00afff; cursor: pointer"
                class="el-icon-d-arrow-right"
              ></span>
            </el-tooltip>
          </div>
          <div
            v-for="(item, index) in classCourseBasicList"
            :key="index"
            class="list-group-item"
          >
            <el-switch
              v-model="item.sfqy"
              @change="setSfqy(item)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
            <div style="float: right" @click="getCourse(item)">
              <el-link type="primary"
                >{{ item.nd }} 年度- {{ item.kbTypeName }}-{{
                  parseTime(item.kzzd2, "{y}-{m}-{d}")
                }}/{{ parseTime(item.kzzd3, "{y}-{m}-{d}") }}</el-link
              >
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{ kbName }}</span>
          </div>
          <el-button type="info" size="mini" @click="clickEdit"
            >点击修改</el-button
          >
          <div ref="prent">
            <el-tabs v-model="tabsActiveTab">
              <el-tab-pane label="班级课表" name="kb">
                <div style="margin-bottom: 10px">
                  <el-form
                    :model="queryParams"
                    ref="queryForm"
                    :rules="queryParamsRules"
                    :inline="true"
                    label-width="68px"
                  >
                    <el-select
                      style="margin-right: 10px"
                      v-model="queryParams.kzzd2"
                      placeholder="请选择年份"
                      clearable
                      size="small"
                    >
                      <el-option
                        v-for="(item, index) in bjkbStartDate"
                        :label="item"
                        :value="item"
                        :key="index"
                      />
                    </el-select>
                    <el-select
                      style="margin-right: 10px"
                      v-model="queryParams.kbType"
                      placeholder="请选择课表类型"
                      clearable
                      size="small"
                    >
                      <el-option
                        v-for="dict in kbTypeOptionsEL"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      />
                    </el-select>
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      @click="insertTimetable"
                      >新增课表</el-button
                    >
                    <el-button
                      type="success"
                      icon="el-icon-check"
                      size="mini"
                      :disabled="btnDisabled"
                      @click="submitTimetable"
                      >保存课表</el-button
                    >
                    <el-button
                      type="warning"
                      plain
                      icon="el-icon-download"
                      size="mini"
                      @click="handleExport"
                      >导出</el-button
                    >
                    <el-button
                      type="primary"
                      plain
                      icon="el-icon-document-copy"
                      size="mini"
                      @click="showCopyDialog"
                      >复制当前已启用的课表</el-button
                    >

                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      :disabled="btnDisabled"
                      @click="deleteData"
                      >删除选中行</el-button
                    >
                    <el-form-item
                      v-if="classCourseList.length > 0"
                      label="有效课时"
                      prop="kbType"
                      label-width="100px"
                    >
                      <el-input-number
                        v-model="yxsj"
                        @change="submitTimetable"
                        placeholder="请输入有效课时"
                      ></el-input-number>
                    </el-form-item>
                  </el-form>
                </div>

                <el-table
                  v-if="classCourseList.length > 0"
                  ref="multipleTable"
                  :data="classCourseList"
                  tooltip-effect="dark"
                  style="width: 100%; font-size: 18px"
                  border
                  @selection-change="handleSelectionChange"
                  :cell-style="tableStyle"
                  :header-cell-style="tableStyle"
                  @cell-click="cellRow"
                >
                  <el-table-column
                    type="selection"
                    width="55"
                  ></el-table-column>
                  <el-table-column label="开始时间" width="120">
                    <template slot-scope="scope">
                      <el-time-select
                        style="width: 100%"
                        placeholder="开始时间"
                        v-model="scope.row.kssj"
                        :picker-options="chooseTimeObj"
                      ></el-time-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="结束时间" width="120">
                    <template slot-scope="scope">
                      <el-time-select
                        style="width: 100%"
                        placeholder="结束时间"
                        v-model="scope.row.jssj"
                        @change="sjYZ(scope.row)"
                        :picker-options="chooseTimeObj"
                      ></el-time-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="课程类型" width="120">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.kcType"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in kcType"
                          :key="item.dictValue"
                          :label="item.dictLabel"
                          :value="item.dictValue"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column ref="demo" label="周一" width="120">
                    <template slot-scope="scope">
                      <div v-if="scope.row.mondayDetails.length > 0">
                        <div
                          @click="addCourse(scope.$index)"
                          v-for="(item, index) in scope.row.mondayDetails"
                          :key="index"
                        >
                          <el-link v-if="item.kzzd1 == 0" type="success"
                            >{{ item.ybj }} : 共 {{ item.yjskrs }} 人</el-link
                          >
                          <el-link v-else type="success">全部</el-link>
                        </div>
                      </div>
                      <el-link
                        type="primary"
                        v-else
                        @click="addCourse(scope.$index)"
                        >未添加</el-link
                      >
                    </template>
                  </el-table-column>
                  <el-table-column label="周二" width="120">
                    <template slot-scope="scope">
                      <div v-if="scope.row.tuesdayDetails.length > 0">
                        <div
                          @click="addCourse(scope.$index)"
                          v-for="(item, index) in scope.row.tuesdayDetails"
                          :key="index"
                        >
                          <el-link v-if="item.kzzd1 == 0" type="success"
                            >{{ item.ybj }} : 共 {{ item.yjskrs }} 人</el-link
                          >
                          <el-link v-else type="success">全部</el-link>
                        </div>
                      </div>
                      <el-link
                        type="primary"
                        v-else
                        @click="addCourse(scope.$index)"
                        >未添加</el-link
                      >
                    </template>
                  </el-table-column>
                  <el-table-column label="周三" width="120">
                    <template slot-scope="scope">
                      <div v-if="scope.row.wednesdayDetails.length > 0">
                        <div
                          @click="addCourse(scope.$index)"
                          v-for="(item, index) in scope.row.wednesdayDetails"
                          :key="index"
                        >
                          <el-link v-if="item.kzzd1 == 0" type="success"
                            >{{ item.ybj }} : 共 {{ item.yjskrs }} 人</el-link
                          >
                          <el-link v-else type="success">全部</el-link>
                        </div>
                      </div>
                      <el-link
                        type="primary"
                        v-else
                        @click="addCourse(scope.$index)"
                        >未添加</el-link
                      >
                    </template>
                  </el-table-column>
                  <el-table-column label="周四" width="120">
                    <template slot-scope="scope">
                      <div v-if="scope.row.thursdayDetails.length > 0">
                        <div
                          @click="addCourse(scope.$index)"
                          v-for="(item, index) in scope.row.thursdayDetails"
                          :key="index"
                        >
                          <el-link v-if="item.kzzd1 == 0" type="success"
                            >{{ item.ybj }} : 共 {{ item.yjskrs }} 人</el-link
                          >
                          <el-link v-else type="success">全部</el-link>
                        </div>
                      </div>
                      <el-link
                        type="primary"
                        v-else
                        @click="addCourse(scope.$index)"
                        >未添加</el-link
                      >
                    </template>
                  </el-table-column>
                  <el-table-column label="周五" width="120">
                    <template slot-scope="scope">
                      <div v-if="scope.row.fridayDetails.length > 0">
                        <div
                          @click="addCourse(scope.$index)"
                          v-for="(item, index) in scope.row.fridayDetails"
                          :key="index"
                        >
                          <el-link v-if="item.kzzd1 == 0" type="success"
                            >{{ item.ybj }} : 共 {{ item.yjskrs }} 人</el-link
                          >
                          <el-link v-else type="success">全部</el-link>
                        </div>
                      </div>
                      <el-link
                        type="primary"
                        v-else
                        @click="addCourse(scope.$index)"
                        >未添加</el-link
                      >
                    </template>
                  </el-table-column>
                  <el-table-column label="周六" width="120">
                    <template slot-scope="scope">
                      <div v-if="scope.row.saturdayDetails.length > 0">
                        <div
                          @click="addCourse(scope.$index)"
                          v-for="(item, index) in scope.row.saturdayDetails"
                          :key="index"
                        >
                          <el-link v-if="item.kzzd1 == 0" type="success"
                            >{{ item.ybj }} : 共 {{ item.yjskrs }} 人</el-link
                          >
                          <el-link v-else type="success">全部</el-link>
                        </div>
                      </div>
                      <el-link
                        type="primary"
                        v-else
                        @click="addCourse(scope.$index)"
                        >未添加</el-link
                      >
                    </template>
                  </el-table-column>
                  <el-table-column label="周日" width="120">
                    <template slot-scope="scope">
                      <div v-if="scope.row.sundayDetails.length > 0">
                        <div
                          @click="addCourse(scope.$index)"
                          v-for="(item, index) in scope.row.sundayDetails"
                          :key="index"
                        >
                          <el-link v-if="item.kzzd1 == 0" type="success"
                            >{{ item.ybj }} : 共 {{ item.yjskrs }} 人</el-link
                          >
                          <el-link v-else type="success">全部</el-link>
                        </div>
                      </div>
                      <el-link
                        type="primary"
                        v-else
                        @click="addCourse(scope.$index)"
                        >未添加</el-link
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <div v-else v-html="alertHtml"></div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加或修改课程对话框 -->
    <el-dialog
      :title="courseTitle"
      :visible.sync="courseOpen"
      width="500px"
      append-to-body
    >
      <el-table
        :data="ybjQueryList"
        ref="ybjquery"
        @selection-change="courseHandleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column property="ybj" label="原班级"></el-table-column>
        <el-table-column property="rs" label="班级人数"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="courseSubmitForm"
          >确 定</el-button
        >
        <el-button @click="courseCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改课程对话框 -->
    <el-dialog
      :title="copyTitle"
      :visible.sync="copyOpen"
      width="500px"
      append-to-body
    >
      <p style="color: red">
        （注意：本次复制的是现在已启用的课表，点击确定之后会直接生成新的课表需要老师进行修改其课表有效期或者按要求进行修改。）
      </p>
      <el-date-picker
        v-model="chooseNianfen"
        type="year"
        :disabled="true"
        placeholder="选择年"
      >
      </el-date-picker>
      <el-select
        style="margin-right: 10px"
        v-model="chooseKblx"
        placeholder="请选择课表类型"
        clearable
        size="small"
      >
        <el-option
          v-for="dict in kbTypeOptionsEL"
          :key="dict.dictValue"
          :label="dict.dictLabel"
          :value="dict.dictValue"
        />
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="copySubmitForm"
          >确 定</el-button
        >
        <el-button @click="copyCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBjclass } from "@/api/basic/bjclass";
import {
  listClassCourse,
  saveList,
  addClassCourse,
  updateClassCourse,
  ybjQuery,
} from "@/api/basic/classCourse";
import { listSchool } from "@/api/basic/school";
import { delClassCourse, classCourseBasicSave } from "@/api/basic/classCourse";
import {
  listClassCourseBasic,
  getClassCourseBasic,
  delClassCourseBasic,
  addClassCourseBasic,
  updateClassCourseBasic,
  copyCourseBasicApi,
} from "@/api/basic/classCourseBasic";
import { parseTime } from "../../../utils/ruoyi";

export default {
  data() {
    return {
      courseTitle: "",
      courseOpen: false,
      startTime: "",
      btnDisabled: true,
      // 班级id
      activeTab: "",
      // 班级课表选择
      tabsActiveTab: "kb",
      // 遮罩
      open: false,
      // 数据切换
      show: {},
      //校区信息
      schoolList: [],
      // 班级信息
      listBjclass: [],
      // 表单参数
      form: {
        id: null,
        bjid: null,
        kbType: null,
        kssj: null,
        jssj: null,
        kcType: null,
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
        remark: null,
        userId: null,
        userName: null,
        createTime: null,
        updateTime: null,
        kzzd1: null,
        kzzd2: null,
        kzzd3: null,
        kzzd4: null,
        kzzd5: null,
      },
      queryParamsRules: {
        xqid: [{ required: true, message: "请选择", trigger: "change" }],
        kzzd2: [
          {
            required: true,
            message: "请选择该课表对应的年份",
            trigger: "change",
          },
        ],
        kbType: [
          {
            required: true,
            message: "请选择该课表对应的课表类型",
            trigger: "change",
          },
        ],
      },
      // 班级课程表格数据
      classCourseList: [],
      // 标记编辑的第几行
      rowNum: null,
      // 上课时间
      getDate: null,
      // 提交课表json数据;
      jsonFrom: {},
      // 查询课表
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        kbType: null,
        kzzd2: new Date().getFullYear(),
        bjid: null,
        xqid: null,
      },
      // 年份字典
      yearList: [],
      // 课表类型
      kbTypeOptionsEL: [],
      // 是否有课
      isCourse: [],
      // 课程类型
      kcType: [],
      // 课表名字
      kbName: "",
      classCourseBasicList: [],
      switchControl: true,
      ybjQueryList: [],
      // 锁定点击的单元格
      jsonCell: null,
      // 课程选择框数据
      courseHandleSelectionJson: null,
      // 选中保存的课表
      multipleSelection: null,
      // 选中的课表id
      selectedTimetableId: null,
      alertHtml: "",
      //选中班级的数据
      classData: {},
      $index: null,
      ybjSelection: null,
      isAdd: true,
      bjkbStartDate: [],
      yxsj: null,
      // 选择时间-对象
      chooseTimeObj: {
        start: "05:40",
        step: "00:05",
        end: "23:00",
      },
      copyTitle: "复制课表的参数(复制后的)",
      // 默认是否展示
      copyOpen: false,
      chooseNianfen: null,
      chooseKblx: null,
      courseId: null,
      courseBasicObj:null
    };
  },
  created() {
    this.getDicts("year-list").then((response) => {
      this.yearList = response.data;
    });
    this.getDicts("kb_type").then((response) => {
      this.kbTypeOptionsEL = response.data;
    });
    this.getDicts("is_course").then((response) => {
      this.isCourse = response.data;
    });
    this.getDicts("kc_type").then((response) => {
      this.kcType = response.data;
    });
    this.getConfigKey("bjkbStartDate").then((res) => {
      let date = new Date().getFullYear() + 1;
      for (let i = res.msg; i <= date; i++) {
        this.bjkbStartDate.push(i);
      }
    });
    this.getList();
  },
  mounted() {
    this.$refs.prent.addEventListener("click", this.msgPrent, false);
  },
  methods: {
    // 点击修改
    clickEdit() {
      this.msgSuccess("开启修改功能成功");
      this.$refs.prent.style.pointerEvents = "";
      this.$refs.prent.removeEventListener("click", this.msgPrent, false);
    },
    // 消息提示
    msgPrent() {
      this.msgError("请点击 '点击修改' 后才可以编辑页面");
      this.$refs.prent.style.pointerEvents = "none";
    },
    /* ------------------------复制课表功能的部分代码----------------------------- */
    // 显示复制课表的弹窗
    showCopyDialog() {
      let year = new Date();
      this.chooseNianfen = year;
      this.chooseKblx = null;
      this.copyOpen = true;
    },
    // 提交复制请求
    copySubmitForm() {
      if (!this.chooseKblx || !this.chooseNianfen) {
        this.msgError("复制课表的参数为必填项!");
        return false;
      }
      let obj = {
        id:this.courseBasicObj.id,
        bjid: this.queryParams.bjid,
        kbType: this.queryParams.kbType,
        nd: this.queryParams.kzzd2,
        updateAfterKbType: this.chooseKblx,
        updateAfterNd: new Date().getFullYear(),
      };
      this.$confirm("此操作将复制当前启用的课表, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return copyCourseBasicApi(obj);
        })
        .then((res) => {
          this.msgSuccess(res.msg);
          this.copyCancel();
          this.getClassCourseBasicList(this.queryParams.bjid);
        })
        .catch((e) => {
          console.log(e);
          this.copyCancel();
        });
    },
    // 关闭复制课表的参数弹窗
    copyCancel() {
      this.copyOpen = false;
    },
    /* ------------------------复制课表功能的部分代码----------------------------- */

    // 导出
    handleExport() {
      this.download(
        "basic/classCourse/exportClassCourse",
        {
          courseBasicId:this.courseBasicObj.id,
          bjid:this.courseBasicObj.bjid
        },
        `${this.queryParams.kzzd2}-${this.selectDictLabel(
          this.kbTypeOptionsEL,
          this.queryParams.kbType
        )}-课表.xlsx`
      );
    },
    // 班级列表基础信息
    getList() {
      listBjclass({ id: this.$route.query.bjid }).then((res) => {
        this.listBjclass = res.rows;
        if (res.rows.length == 1) {
          // 当该老师只有一个日语班
          this.activeTab = res.rows[0].id;
          this.switchingClasses(this.activeTab, this.queryParams.kzzd2);
        }
      });
    },
    // 获取班级
    getSchoolListId(xqid) {
      xqid = xqid || this.queryParams.xqid;
      listBjclass({ kzzd1: xqid }).then((res) => {
        this.listBjclass = res.rows;
        this.listBjclass.length == 1
          ? (this.queryParams.xqid = this.schoolList[0].id)
          : null;
      });
    },
    // 获取课表详细数据
    getCourse(item) {
      if (item && item.id) {
        this.courseBasicObj=item
        this.courseId = item.id;
        this.queryParams.kzzd2 = item.nd;
        this.queryParams.kbType = item.kbType;
      }
      if (!this.queryParams.kzzd2) {
        this.msgError("请选择该新增课表的所属年份！");
        return;
      }
      if (!this.queryParams.kbType) {
        this.msgError("请选择该新增课表的课表类型！");
        return;
      }
      this.queryParams.kzzd1 = this.courseId;
      /** 查询班级课程列表 */
      this.loading = true;
      listClassCourse(this.queryParams).then((response) => {
        this.classCourseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //查询课表
    handleQuery() {
      this.$refs.queryForm.validate((res) => {
        if (res) {
          this.getList();
        } else {
          this.msgError("请选择查询条件！");
        }
      });
    },
    // 切换班级课表
    switchingClasses(bjid, nd) {
      this.queryParams.bjid = bjid;
      this.getClassCourseBasicList(bjid);
    },
    // 拿到该班级的所有课表
    getClassCourseBasicList(rybjid, nd = null, $sfqy) {
      if (!$sfqy) {
        this.classCourseList = [];
      }
      let obj = {
        bjid: rybjid,
      };
      if (nd) {
        obj.nd = nd;
        obj.kbType = this.queryParams.kbType;
      }
      listClassCourseBasic(obj).then((response) => {
        this.classCourseBasicList = response.rows;
        if (this.classCourseBasicList.length == 0) {
          this.classCourseList = [];
          this.alertHtml =
            "<div style='text-align : center;color : red'>暂无课表</div>";
          return;
        }
        let arr = [];
        this.classCourseBasicList.forEach((value) => {
          value.sfqy = Boolean(value.sfqy);
          arr.push(value.sfqy);
          if (value.sfqy) {
            this.queryParams.kzzd2 = value.nd;
            this.queryParams.kbType = value.kbType;
            this.yxsj = value.kzzd1;
            this.courseId = value.id;
            this.courseBasicObj=value;
            if (!$sfqy) {
              this.getCourse();
            }
          }
          for (let i = 0; i < this.kbTypeOptionsEL.length; i++) {
            if (value.kbType == this.kbTypeOptionsEL[i].dictValue) {
              value.kbTypeName = this.kbTypeOptionsEL[i].dictLabel;
            }
          }
        });
        if (arr.indexOf(true) == -1) {
          this.alertHtml =
            "<div style='text-align : center;color : red'>请手动开启课表</div>";
        } else {
          this.alertHtml = "";
        }
      });
      ybjQuery(rybjid).then((res) => {
        this.ybjQueryList = res.rows;
      });
    },
    // 是否启用
    setSfqy(value) {
      if (value) {
        this.queryParams.kzzd2 = value.nd;
        this.queryParams.kbType = value.kbType;
        value.ifAddYxsj = "sfqy";
        updateClassCourseBasic({
          id: value.id,
          bjid: value.bjid,
          sfqy: Number(value.sfqy),
        }).then((res) => {
          this.getClassCourseBasicList(value.bjid);
        });
      }
      if (value.sfqy) {
        this.yxsj = value.kzzd1;
        this.getCourse();
        this.msgSuccess("启动成功");
      } else {
        this.classCourseList = [];
        this.msgSuccess("关闭成功");
      }
    },
    //新增课表
    insertTimetable() {
      if (!this.queryParams.kzzd2) {
        this.msgError("请选择该新增课表的所属年份！");
        return;
      }
      if (!this.queryParams.kbType) {
        this.msgError("请选择该新增课表的课表类型！");
        return;
      }
      if (!this.queryParams.bjid) {
        this.msgError("请选择该新增课表的班级！");
        return;
      }
      if (!this.activeTab) {
        this.msgError("请选择对应班级！");
        return;
      }
      this.classCourseList.push(this.record());
    },
    // 新增加一行表格
    record() {
      return {
        bjid: this.queryParams.bjid,
        kzzd2: this.queryParams.kzzd2,
        kbType: this.queryParams.kbType,
        kssj: null,
        jssj: null,
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
        mondayDetails: [],
        fridayDetails: [],
        saturdayDetails: [],
        sundayDetails: [],
        thursdayDetails: [],
        tuesdayDetails: [],
        wednesdayDetails: [],
      };
    },
    // 弹出添加课程表格
    addCourse(index) {
      this.$index = index;
      this.courseOpen = true;
      this.$nextTick(() => {
        this.$refs.ybjquery.clearSelection();
      });
    },
    // 获取点击的数据
    cellRow(row, column, cell, event) {
      this.jsonCell = {
        bjid: row.bjid,
        id: row.id,
        kzzd2: this.queryParams.kzzd2,
        kbType: this.queryParams.kbType,
        title: column.label,
      };
    },
    // 选中课程对话框数据
    courseHandleSelectionChange(selection) {
      this.ybjSelection = selection;
      if (selection && selection.length > 0) {
        this.courseHandleSelectionJson = {
          ybj: "",
          yjskrs: 0,
        };
        if (this.ybjQueryList.length == selection.length) {
          for (let i = 0; i < selection.length; i++) {
            this.courseHandleSelectionJson.kzzd1 = 1;
            this.courseHandleSelectionJson.ybj += selection[i].ybj + ",";
            this.courseHandleSelectionJson.yjskrs += selection[i].rs;
          }
          this.courseHandleSelectionJson.ybj =
            this.courseHandleSelectionJson.ybj.slice(
              0,
              this.courseHandleSelectionJson.ybj.length - 1
            );
        } else {
          for (let i = 0; i < selection.length; i++) {
            this.courseHandleSelectionJson.kzzd1 = 0;
            this.courseHandleSelectionJson.ybj += selection[i].ybj + ",";
            this.courseHandleSelectionJson.yjskrs += selection[i].rs;
          }
          this.courseHandleSelectionJson.ybj =
            this.courseHandleSelectionJson.ybj.slice(
              0,
              this.courseHandleSelectionJson.ybj.length - 1
            );
        }
      }
    },
    // 提交课程对话框
    courseSubmitForm() {
      this.courseOpen = false;
      if (!this.ybjSelection || this.ybjSelection.length == 0) {
        switch (this.jsonCell.title) {
          case "周一":
            this.classCourseList[this.$index].mondayDetails = [];
            break;
          case "周二":
            this.classCourseList[this.$index].tuesdayDetails = [];
            break;
          case "周三":
            this.classCourseList[this.$index].wednesdayDetails = [];
            break;
          case "周四":
            this.classCourseList[this.$index].thursdayDetails = [];
            break;
          case "周五":
            this.classCourseList[this.$index].fridayDetails = [];
            break;
          case "周六":
            this.classCourseList[this.$index].saturdayDetails = [];
            break;
          case "周日":
            this.classCourseList[this.$index].sundayDetails = [];
            break;
        }
        return;
      } else {
        this.classCourseList.map((value, index) => {
          if (value.id == this.jsonCell.id && index == this.$index) {
            switch (this.jsonCell.title) {
              case "周一":
                value.mondayDetails = [];
                value.mondayDetails.push(this.courseHandleSelectionJson);
                break;
              case "周二":
                value.tuesdayDetails = [];
                value.tuesdayDetails.push(this.courseHandleSelectionJson);
                break;
              case "周三":
                value.wednesdayDetails = [];
                value.wednesdayDetails.push(this.courseHandleSelectionJson);
                break;
              case "周四":
                value.thursdayDetails = [];
                value.thursdayDetails.push(this.courseHandleSelectionJson);
                break;
              case "周五":
                value.fridayDetails = [];
                value.fridayDetails.push(this.courseHandleSelectionJson);
                break;
              case "周六":
                value.saturdayDetails = [];
                value.saturdayDetails.push(this.courseHandleSelectionJson);
                break;
              case "周日":
                value.sundayDetails = [];
                value.sundayDetails.push(this.courseHandleSelectionJson);
                break;
            }
            this.ybjSelection = null;
          }
        });
      }
    },
    // 取消课程对话框
    courseCancel() {
      this.courseOpen = false;
    },
    // 选中保存数据
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.btnDisabled = false;
      } else {
        this.btnDisabled = true;
      }
      this.multipleSelection = val;
    },
    // 保存课表
    async submitTimetable() {
      if (!this.isAdd) {
        this.msgError("错误: 开始时间不能大于结束时间");
        return;
      }
      if (!this.queryParams.kbType || !this.queryParams.kzzd2) {
        return this.msgError("请选择课表类型！");
      }
      let sfqyNumber=1; // 默认启用
      let basicId=null;
      if(this.courseBasicObj){
        sfqyNumber=this.courseBasicObj.sfqy
        basicId=this.courseBasicObj.id
      }
      let json = {
        bjid: this.queryParams.bjid,
        nd: this.queryParams.kzzd2,
        kbType: this.queryParams.kbType,
        sfqy: Number(sfqyNumber),
        id: basicId,
        isUpdateCourse:true, // 后台接口使用的参数，用来判断是否是修改数据后手工进行提交的
      };
      if (this.yxsj) {// 有效课时
        json.kzzd1 = this.yxsj;
      }
      let result = await classCourseBasicSave(json);
      if (result.code == 200) {
        this.getClassCourseBasicList(
          this.activeTab,
          this.queryParams.kzzd2,
          true
        );
        if (this.multipleSelection && this.multipleSelection.length > 0) {
          let num = 0;
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (!this.multipleSelection[i].kcType) {
              this.msgError("请选择课程类型！");
              continue;
            }
            if (!this.multipleSelection[i].kssj) {
              this.msgError("请选择开始时间！");
              continue;
            }
            if (!this.multipleSelection[i].jssj) {
              this.msgError("请选择结束时间！");
              continue;
            }
            this.multipleSelection[i].kzzd1 = result.data.id;
            if (this.multipleSelection[i].id) {
              updateClassCourse(this.multipleSelection[i]).then((res) => {
                if (res.code == 200) {
                  this.multipleSelection = [];
                  this.getClassCourseBasicList(
                    this.activeTab,
                    this.queryParams.kzzd2
                  );
                  this.btnDisabled = true;
                  num++;
                }
              });
            } else {
              addClassCourse(this.multipleSelection[i]).then((res) => {
                if (res.code == 200) {
                  this.multipleSelection = [];
                  this.getClassCourseBasicList(
                    this.activeTab,
                    this.queryParams.kzzd2
                  );
                  this.btnDisabled = true;
                  num++;
                }
              });
            }
          }
          if (this.multipleSelection.length === num) {
            this.msgSuccess("保存成功");
          }
        }
      }
    },
    // 删除选中行
    deleteData() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.btnDisabled = true;
          let num = 0;
          this.multipleSelection.forEach((value, index) => {
            if (!value.id) {
              return;
            }
            delClassCourse(value.id);
            num = index;
          });
          if (num === this.multipleSelection.length - 1) {
            this.handleQuery();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        })
        .catch(() => {
          this.courseHandleSelectionJson.kzzd1 = 1;
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 表格数据居中
    tableStyle() {
      return "text-align : center";
    },
    sjYZ(rows) {
      let date = new Date();
      let n = date.getFullYear();
      let y = date.getMonth();
      y = y + 1;
      let r = date.getDate();
      let date1 = n + "-" + y + "-" + r;
      let date2 = date1;
      let nowTime = new Date(date1 + " " + rows.jssj);
      date1 = new Date(date1 + " " + rows.kssj + ":00").getTime();
      date2 = new Date(date2 + " " + rows.jssj + ":00").getTime();
      if (date1 > date2) {
        this.msgError("错误: 开始时间不能大于结束时间");
        rows.jssj = "";
        this.isAdd = false;
      } else {
        this.isAdd = true;
        if (rows.jssj) {
          let str =
            this.addZero(nowTime.getHours()) +
            ":" +
            this.addZero(nowTime.getMinutes());
          this.chooseTimeObj.start = str;
        }
      }
    },
    addZero(num) {
      if (num < 10) {
        return "0" + num.toString();
      }
      return num;
    },
  },
};
</script>

<style>
</style>

