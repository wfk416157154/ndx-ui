<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :rules="queryParamsRules"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="校区名称" prop="xqid" v-hasPermi="['basic:school:list']" label-width="100px">
        <el-select
          v-model="queryParams.xqid"
          @change="getSchoolListId"
          filterable
          placeholder="请选择校区名称"
        >
          <el-option v-for="item in schoolList" :key="item.id" :label="item.xxmc" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日语班" label-width="100px">
        <el-select v-model="queryParams.bjid" filterable placeholder="请选择班级名称">
          <el-option
            v-for="item in listBjclass"
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年份" prop="kzzd2">
        <el-select v-model="queryParams.kzzd2" placeholder="请选择年份" clearable size="small">
          <el-option
            v-for="dict in yearList"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictLabel"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课表类型" prop="kbType" label-width="100px">
        <el-select v-model="queryParams.kbType" placeholder="请选择课表类型" clearable size="small">
          <el-option
            v-for="dict in kbTypeOptionsEL"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom : 20px">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="老师姓名" label-width="100px">
          <el-select v-model="queryParams.lsid" filterable placeholder="请选择老师" clearable>
            <el-option
              v-for="item in teacherListOption"
              :key="item.id"
              :label="item.lsxm"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button
            style="margin-left : 10px"
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="lsQuery"
          >查询老师</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card>
          <el-tabs v-model="activeTab" @tab-click="switchingClasses(activeTab)">
            <el-tab-pane
              v-for="item in listBjclass"
              :key="item.id"
              :label="item.rybjmc"
              :name="item.id"
            >
              <div class="wrap-info" v-if="classData != {}">
                <ul class="list-group list-group-striped">
                  <li style="padding-bottom : 10px; font-size : 14px">
                    日语班级
                    <div class="pull-right">{{classData.rybjmc}}</div>
                  </li>
                  <li class="list-group-item">
                    姓名
                    <div class="pull-right">{{classData.lsxm}}</div>
                  </li>
                  <li class="list-group-item">
                    校区
                    <div class="pull-right">{{classData.xqmc}}</div>
                  </li>
                  <li class="list-group-item">
                    开班时间
                    <div class="pull-right">{{classData.kbsj}}</div>
                  </li>
                  <li class="list-group-item">
                    班级人数
                    <div class="pull-right">{{classData.bjrs}}</div>
                  </li>
                  <li class="list-group-item">
                    录入时间
                    <div class="pull-right">{{classData.kzzd3}}</div>
                  </li>
                </ul>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="color: #00afff">课表</span>
            <el-tooltip class="item" effect="dark" content="更多课表" placement="top-end">
              <span
                @click="switchingClasses(activeTab)"
                style="float :right ;color: #00afff;cursor: pointer;"
                class="el-icon-d-arrow-right"
              ></span>
            </el-tooltip>
          </div>
          <div v-for="(item,index) in classCourseBasicList" :key="index" class="list-group-item">
            <el-switch
              v-model="item.sfqy"
              @change="setSfqy(item)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
            <div style="float: right">
              {{item.nd}} 年度-
              {{item.kbTypeName}}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{kbName}}</span>
          </div>
          <el-tabs v-model="tabsActiveTab">
            <el-tab-pane label="班级课表" name="kb">
              <div style="margin-bottom: 10px">
                <el-form :inline="true">
                  <el-select
                    style="margin-right : 10px"
                    v-model="queryParams.kzzd2"
                    placeholder="请选择年份"
                    clearable
                    size="small"
                    @change="getCourse"
                  >
                    <el-option
                      v-for="dict in yearList"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictLabel"
                    />
                  </el-select>
                  <el-select
                    style="margin-right : 10px"
                    v-model="queryParams.kbType"
                    placeholder="请选择课表类型"
                    clearable
                    size="small"
                    @change="getCourse"
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
                  >新增课表</el-button>
                  <el-button
                    type="success"
                    icon="el-icon-check"
                    size="mini"
                    :disabled="btnDisabled"
                    @click="submitTimetable"
                  >保存课表</el-button>
                  <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                  >导出</el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="btnDisabled"
                    @click="deleteData"
                  >删除选中行</el-button>
                  <el-form-item
                    v-if="classCourseList.length > 0"
                    label="有效课时"
                    prop="kbType"
                    label-width="100px"
                  >
                    <el-input-number v-model="yxsj" disabled placeholder="请输入有效课时"></el-input-number>
                  </el-form-item>
                </el-form>
              </div>

              <el-table
                v-if="classCourseList.length > 0"
                ref="multipleTable"
                :data="classCourseList"
                tooltip-effect="dark"
                style="width: 100%;font-size : 18px"
                border
                @selection-change="handleSelectionChange"
                :cell-style="tableStyle"
                :header-cell-style="tableStyle"
                @cell-click="cellRow"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="开始时间" width="120">
                  <template slot-scope="scope">
                    <el-time-select
                      style="width : 100%"
                      placeholder="开始时间"
                      v-model="scope.row.kssj"
                      :picker-options="{
                      start: '05:40',
                      step: '00:05',
                      end: '23:00'
                    }"
                    ></el-time-select>
                  </template>
                </el-table-column>
                <el-table-column label="结束时间" width="120">
                  <template slot-scope="scope">
                    <el-time-select
                      style="width : 100%"
                      placeholder="结束时间"
                      v-model="scope.row.jssj"
                      :picker-options="{
                      start: '05:40',
                      step: '00:05',
                      end: '23:00'
                    }"
                    ></el-time-select>
                  </template>
                </el-table-column>
                <el-table-column label="课程类型" width="120">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.kcType" placeholder="请选择">
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
                        v-for="(item,index) in scope.row.mondayDetails"
                        :key="index"
                      >
                        <el-link
                          v-if="item.kzzd1 == 0"
                          type="success"
                        >{{item.ybj}} : 共 {{item.yjskrs}} 人</el-link>
                        <el-link v-else type="success">全部</el-link>
                      </div>
                    </div>
                    <el-link type="primary" v-else @click="addCourse(scope.$index)">未添加</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="周二" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.tuesdayDetails.length > 0">
                      <div
                        @click="addCourse(scope.$index)"
                        v-for="(item,index) in scope.row.tuesdayDetails"
                        :key="index"
                      >
                        <el-link
                          v-if="item.kzzd1 == 0"
                          type="success"
                        >{{item.ybj}} : 共 {{item.yjskrs}} 人</el-link>
                        <el-link v-else type="success">全部</el-link>
                      </div>
                    </div>
                    <el-link type="primary" v-else @click="addCourse(scope.$index)">未添加</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="周三" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.wednesdayDetails.length > 0">
                      <div
                        @click="addCourse(scope.$index)"
                        v-for="(item,index) in scope.row.wednesdayDetails"
                        :key="index"
                      >
                        <el-link
                          v-if="item.kzzd1 == 0"
                          type="success"
                        >{{item.ybj}} : 共 {{item.yjskrs}} 人</el-link>
                        <el-link v-else type="success">全部</el-link>
                      </div>
                    </div>
                    <el-link type="primary" v-else @click="addCourse(scope.$index)">未添加</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="周四" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.thursdayDetails.length > 0">
                      <div
                        @click="addCourse(scope.$index)"
                        v-for="(item,index) in scope.row.thursdayDetails"
                        :key="index"
                      >
                        <el-link
                          v-if="item.kzzd1 == 0"
                          type="success"
                        >{{item.ybj}} : 共 {{item.yjskrs}} 人</el-link>
                        <el-link v-else type="success">全部</el-link>
                      </div>
                    </div>
                    <el-link type="primary" v-else @click="addCourse(scope.$index)">未添加</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="周五" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.fridayDetails.length > 0">
                      <div
                        @click="addCourse(scope.$index)"
                        v-for="(item,index) in scope.row.fridayDetails"
                        :key="index"
                      >
                        <el-link
                          v-if="item.kzzd1 == 0"
                          type="success"
                        >{{item.ybj}} : 共 {{item.yjskrs}} 人</el-link>
                        <el-link v-else type="success">全部</el-link>
                      </div>
                    </div>
                    <el-link type="primary" v-else @click="addCourse(scope.$index)">未添加</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="周六" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.saturdayDetails.length > 0">
                      <div
                        @click="addCourse(scope.$index)"
                        v-for="(item,index) in scope.row.saturdayDetails"
                        :key="index"
                      >
                        <el-link
                          v-if="item.kzzd1 == 0"
                          type="success"
                        >{{item.ybj}} : 共 {{item.yjskrs}} 人</el-link>
                        <el-link v-else type="success">全部</el-link>
                      </div>
                    </div>
                    <el-link type="primary" v-else @click="addCourse(scope.$index)">未添加</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="周日" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.sundayDetails.length > 0">
                      <div
                        @click="addCourse(scope.$index)"
                        v-for="(item,index) in scope.row.sundayDetails"
                        :key="index"
                      >
                        <el-link
                          v-if="item.kzzd1 == 0"
                          type="success"
                        >{{item.ybj}} : 共 {{item.yjskrs}} 人</el-link>
                        <el-link v-else type="success">全部</el-link>
                      </div>
                    </div>
                    <el-link type="primary" v-else @click="addCourse(scope.$index)">未添加</el-link>
                  </template>
                </el-table-column>
              </el-table>
              <div v-else v-html="alertHtml"></div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加或修改课程对话框 -->
    <el-dialog :title="courseTitle" :visible.sync="courseOpen" width="500px" append-to-body>
      <el-table :data="ybjQueryList" ref="ybjquery" @selection-change="courseHandleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column property="ybj" label="原班级"></el-table-column>
        <el-table-column property="rs" label="班级人数"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="courseSubmitForm">确 定</el-button>
        <el-button @click="courseCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBjclass } from "@/api/basic/bjclass";
import { teacherList } from "@/api/basic/assignTeachers";
import {
  listClassCourse,
  saveList,
  addClassCourse,
  updateClassCourse,
  ybjQuery
} from "@/api/basic/classCourse";
import { listSchool } from "@/api/basic/school";
import { delClassCourse, classCourseBasicSave } from "@/api/basic/classCourse";
import {
  listClassCourseBasic,
  getClassCourseBasic,
  delClassCourseBasic,
  addClassCourseBasic,
  updateClassCourseBasic
} from "@/api/basic/classCourseBasic";

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
        kzzd5: null
      },
      queryParamsRules: {
        xqid: [{ required: true, message: "请选择", trigger: "change" }],
        kzzd2: [
          {
            required: true,
            message: "请选择该课表对应的年份",
            trigger: "change"
          }
        ],
        kbType: [
          {
            required: true,
            message: "请选择该课表对应的课表类型",
            trigger: "change"
          }
        ]
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
        kzzd2: null,
        bjid: null,
        xqid: null
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
      teacherListOption: [],
      yxsj: null
    };
  },
  created() {
    this.getDicts("year-list").then(response => {
      this.yearList = response.data;
    });
    this.getDicts("kb_type").then(response => {
      this.kbTypeOptionsEL = response.data;
    });
    this.getDicts("is_course").then(response => {
      this.isCourse = response.data;
    });
    this.getDicts("kc_type").then(response => {
      this.kcType = response.data;
    });
    listSchool().then(response => {
      this.schoolList = response.rows;
      if (this.$store.state.user.dataRoleWeightId == 50) {
        this.schoolList.length == 1
          ? (this.queryParams.xqid = this.schoolList[0].id)
          : null;
        this.getSchoolListId();
      }
    });
    teacherList().then(response => {
      this.teacherListOption = response.rows;
    });
  },
  methods: {
    // 导出
    handleExport() {
      let { bjid, kbType, kzzd2 } = this.queryParams;
      this.download(
        "basic/classCourse/exportClassCourse",
        {
          bjid,
          kbType,
          nd: kzzd2
        },
        `${kzzd2}-${this.selectDictLabel(
          this.kbTypeOptionsEL,
          kbType
        )}-课表.xlsx`
      );
    },
    // 班级列表基础信息
    getList() {
      // let obj = {
      //   // 根据关联校区id进行查询
      //   kzzd1: this.queryParams.xqid
      // };
      // listBjclass(obj).then(res => {
      //   this.listBjclass = res.rows;
      //   if (res.rows.length > 0) {
      this.activeTab = this.queryParams.bjid;
      this.switchingClasses(this.activeTab, this.queryParams.kzzd2);
      this.getClassId(this.activeTab);
      // }
      // });
    },
    // 获取班级
    getSchoolListId(xqid) {
      xqid = xqid || this.queryParams.xqid;
      listBjclass({ kzzd1: xqid }).then(res => {
        this.listBjclass = res.rows;
        this.listBjclass.length == 1
          ? (this.queryParams.xqid = this.schoolList[0].id)
          : null;
      });
    },
    // 获取选中班级数据
    getClassId(bjid) {
      this.listBjclass.forEach(value => {
        if (value.id == bjid) {
          this.classData = value;
        }
      });
    },
    // 获取课表详细数据
    getCourse() {
      if (!this.queryParams.kzzd2) {
        this.msgError("请选择该新增课表的所属年份！");
        return;
      }
      if (!this.queryParams.kbType) {
        this.msgError("请选择该新增课表的课表类型！");
        return;
      }
      /** 查询班级课程列表 */
      this.loading = true;
      listClassCourse(this.queryParams).then(response => {
        this.classCourseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //查询课表
    handleQuery() {
      this.$refs.queryForm.validate(res => {
        if (res) {
          this.getList();
        } else {
          this.msgError("请选择查询条件！");
        }
      });
    },
    // 查询老师
    lsQuery() {
      let lsid = this.queryParams.lsid;
      (this.queryParams = {
        pageNum: 1,
        pageSize: 100,
        lsid: lsid,
        kbType: null,
        kzzd2: null,
        bjid: null,
        xqid: null
      }),
        listBjclass({ lsid }).then(res => {
          if (res.rows.length == 0) {
            this.listBjclass = [];
            this.classCourseList = [];
          }
          this.listBjclass = res.rows;
          this.listBjclass.length == 1
            ? (this.queryParams.xqid = this.schoolList[0].id)
            : null;
        });
    },
    // 切换班级课表
    switchingClasses(bjid, nd) {
      this.queryParams.bjid = bjid;
      this.getClassCourseBasicList(bjid, nd);
      this.getClassId(bjid);
    },
    // 拿到该班级的所有课表
    getClassCourseBasicList(rybjid, nd, $sfqy) {
      if (!$sfqy) {
        this.classCourseList = [];
      }
      let obj = {
        bjid: rybjid
      };
      if (nd) {
        obj.nd = nd;
        obj.kbType = this.queryParams.kbType;
      }
      listClassCourseBasic(obj).then(response => {
        this.classCourseBasicList = response.rows;
        if (this.classCourseBasicList.length == 0) {
          this.classCourseList = [];
          this.alertHtml =
            "<div style='text-align : center;color : red'>暂无课表</div>";
          return;
        }
        let arr = [];
        this.classCourseBasicList.forEach(value => {
          value.sfqy = Boolean(value.sfqy);
          arr.push(value.sfqy);
          if (value.sfqy) {
            this.queryParams.kzzd2 = value.nd;
            this.queryParams.kbType = value.kbType;
            this.yxsj = value.kzzd1;
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
      ybjQuery(rybjid).then(res => {
        this.ybjQueryList = res.rows;
      });
    },
    // 是否启用
    setSfqy(value) {
      if (value) {
        this.queryParams.kzzd2 = value.nd;
        this.queryParams.kbType = value.kbType;
        this.submitTimetable(value);
      }
      if (value.sfqy) {
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
        this.msgError("请点击搜索选择对应班级！");
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
        wednesdayDetails: []
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
        title: column.label
      };
    },
    // 选中课程对话框数据
    courseHandleSelectionChange(selection) {
      this.ybjSelection = selection;
      if (selection && selection.length > 0) {
        this.courseHandleSelectionJson = {
          ybj: "",
          yjskrs: 0
        };
        if (this.ybjQueryList.length == selection.length) {
          for (let i = 0; i < selection.length; i++) {
            this.courseHandleSelectionJson.kzzd1 = 1;
            this.courseHandleSelectionJson.ybj += selection[i].ybj + ",";
            this.courseHandleSelectionJson.yjskrs += selection[i].rs;
          }
          this.courseHandleSelectionJson.ybj = this.courseHandleSelectionJson.ybj.slice(
            0,
            this.courseHandleSelectionJson.ybj.length - 1
          );
        } else {
          for (let i = 0; i < selection.length; i++) {
            this.courseHandleSelectionJson.kzzd1 = 0;
            this.courseHandleSelectionJson.ybj += selection[i].ybj + ",";
            this.courseHandleSelectionJson.yjskrs += selection[i].rs;
          }
          this.courseHandleSelectionJson.ybj = this.courseHandleSelectionJson.ybj.slice(
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
    async submitTimetable(value) {
      if (value) {
        if (!this.queryParams.kbType || !this.queryParams.kzzd2) {
          return this.msgError("请选择课表类型！");
        }
      }
      let result = await classCourseBasicSave({
        bjid: this.queryParams.bjid,
        nd: this.queryParams.kzzd2,
        kbType: this.queryParams.kbType,
        sfqy: Number(value.sfqy),
        id: value.id
      });
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
              updateClassCourse(this.multipleSelection[i]).then(res => {
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
              addClassCourse(this.multipleSelection[i]).then(res => {
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
        type: "warning"
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
              message: "删除成功!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 表格数据居中
    tableStyle() {
      return "text-align : center";
    }
  }
};
</script>

<style>
</style>

