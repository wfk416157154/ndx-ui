<template>
  <div class="add-teaching">
    <!-- <calendar @callback="demo" /> -->
    <div class="wrap-header">
      <div class="left-from">
        <el-form
          :model="teachingForm"
          ref="teachingForm"
          :rules="rules"
          label-width="100px"
          class="demo-teachingForm"
        >
          <el-row>
            <el-col :span="11">
              <el-form-item label="校区" prop="xqid">
                <el-select
                  v-model="teachingForm.xqid"
                  filterable
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
            </el-col>
            <el-col :span="11">
              <el-form-item label="开班时间" prop="kbsjStr">
                <el-date-picker
                  disabled
                  v-model="teachingForm.kbsjStr"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="日语班级" prop="rybjid">
                <el-select
                  v-model="teachingForm.rybjid"
                  @change="bjOnChange"
                  filterable
                  placeholder="请选择班级"
                >
                  <el-option
                    :label="item.rybjmc"
                    :value="item.id"
                    v-for="(item,index) in classList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="高考时间" prop="gksj">
                <el-date-picker
                  v-model="teachingForm.gksj"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="老师姓名" prop="lsid">
                <el-input v-model="teachingForm.lsid" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="班级人数" prop="bjrs">
                <el-input v-model="teachingForm.bjrs"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="原有效课时" prop="yyxks">
                <el-input v-model="teachingForm.yyxks" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="现有效课时" prop="xyxks">
                <el-input v-model="teachingForm.xyxks" @change="calculateClassHours"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="总复习" prop="zfx">
                <el-checkbox-group
                  v-model="teachingForm.zfx"
                  @change="zfxOnChange"
                  :disabled="!showUpdateBtn"
                >
                  <el-checkbox
                    v-for="(item,index) in reviewList"
                    :label="item.jdid"
                    :key="index"
                  >{{item.jdmc}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="日有效课时" prop="ryxks">
                <el-input v-model="teachingForm.ryxks"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="教学计划模板" prop="jcid">
                <el-select
                  v-model="teachingForm.jcid"
                  :disabled="showUpdateBtn"
                  placeholder="请选择教学计划模板"
                >
                  <el-option
                    v-for="(item,index) in listTeachingMaterial"
                    :key="index"
                    :label="item.jcmc"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button
              type="primary"
              @click="getListClassCourseBasic(teachingForm.rybjid)"
              :disabled="!teachingForm.rybjid"
            >点击查看该班课表</el-button>
            <el-button @click="resetForm('teachingForm')">重置</el-button>
            <el-button
              type="primary"
              :disabled="!teachingForm.rybjid"
              v-prevent-re-click
              @click="saveTeachingForm"
            >保存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right-tabel">
        <div>
          <el-button type="primary" @click="addSkiptime" :disabled="!teachingForm.id">添加</el-button>
        </div>
        <div>
          <el-table border :data="itemSkiptime" style="width: 100%;font-size : 18px">
            <el-table-column label="名称" width="120" prop="timeName"></el-table-column>
            <el-table-column label="开始日期" width="120" prop="kssj"></el-table-column>
            <el-table-column label="结束日期" width="120" prop="jssj"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="editSkiptime(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteSkiptime(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog title="添加跳过时间" :visible.sync="dialogFormVisible">
          <el-form :model="skipDateForm">
            <el-form-item label="名称" label-width="120px">
              <el-input v-model="skipDateForm.timeName"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" label-width="120px">
              <el-date-picker
                v-model="skipDateForm.kssj"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" label-width="120px">
              <el-date-picker
                v-model="skipDateForm.jssj"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" v-prevent-re-click @click="saveSkiptime">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div style="width : 100%;text-align : center;margin: 20px 0px">
      <el-button
        type="primary"
        @click="addTeaching"
        v-if="!showUpdateBtn"
        :disabled="!teachingForm.id"
        v-prevent-re-click
      >生成教学计划</el-button>
      <el-button
        type="info"
        @click="editTeaching"
        v-if="showUpdateBtn"
        :disabled="!teachingForm.id"
        v-prevent-re-click
      >更新教学计划</el-button>
    </div>
    <div class="wrap-teaching-content" v-if="showUpdateBtn">
      <div class="teaching-top-tar">
        <div>
          <h4>生成计划</h4>
        </div>
        <div style="display : flex; align-items: center;">
          <div style="margin-right : 20px">
            <h5>教学计划</h5>
          </div>
          <div>
            <span
              style="cursor: pointer;"
              :class="['SemesterView' == ifContent ? 'active-color' : '']"
              @click="toComponent('SemesterView')"
            >学期</span>
            <el-divider direction="vertical"></el-divider>
            <span
              style="cursor: pointer;"
              :class="['MonthView' == ifContent ? 'active-color' : '']"
              @click="toComponent('MonthView')"
            >月</span>
            <el-divider direction="vertical"></el-divider>
            <span
              style="cursor: pointer;"
              :class="['WholeView' == ifContent ? 'active-color' : '']"
              @click="toComponent('WholeView')"
            >全部</span>
          </div>
        </div>
      </div>
      <div class="teaching-content-item">
        <SemesterView v-if="'SemesterView' == ifContent" ref="SemesterView" :item="teachingForm" />
        <MonthView v-if="'MonthView' == ifContent" ref="MonthView" :item="teachingForm" />
        <WholeView v-if="'WholeView' == ifContent" ref="WholeView" :item="teachingForm" />
      </div>
    </div>
    <el-dialog title="课表" :visible.sync="dialogTableVisible" width="80%">
      <el-table
        ref="multipleTable"
        :data="classCourseList"
        tooltip-effect="dark"
        style="width: 100%"
        border
      >
        <el-table-column label="开始时间" prop="kssj"></el-table-column>
        <el-table-column label="结束时间" prop="jssj"></el-table-column>
        <el-table-column label="课程类型" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.kcType" disabled placeholder="请选择">
              <el-option
                v-for="item in kcType"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column ref="demo" label="周一">
          <template slot-scope="scope">
            <div v-if="scope.row.mondayDetails.length > 0">
              <div v-for="(item,index) in scope.row.mondayDetails" :key="index">
                <span v-if="item.kzzd1 == 0">{{item.ybj}} : 共 {{item.yjskrs}} 人</span>
                <span v-else>全部</span>
              </div>
            </div>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="周二">
          <template slot-scope="scope">
            <div v-if="scope.row.tuesdayDetails.length > 0">
              <div v-for="(item,index) in scope.row.tuesdayDetails" :key="index">
                <span v-if="item.kzzd1 == 0">{{item.ybj}} : 共 {{item.yjskrs}} 人</span>
                <span v-else>全部</span>
              </div>
            </div>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="周三">
          <template slot-scope="scope">
            <div v-if="scope.row.wednesdayDetails.length > 0">
              <div v-for="(item,index) in scope.row.wednesdayDetails" :key="index">
                <span v-if="item.kzzd1 == 0">{{item.ybj}} : 共 {{item.yjskrs}} 人</span>
                <span v-else>全部</span>
              </div>
            </div>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="周四">
          <template slot-scope="scope">
            <div v-if="scope.row.thursdayDetails.length > 0">
              <div v-for="(item,index) in scope.row.thursdayDetails" :key="index">
                <span v-if="item.kzzd1 == 0">{{item.ybj}} : 共 {{item.yjskrs}} 人</span>
                <span v-else>全部</span>
              </div>
            </div>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="周五">
          <template slot-scope="scope">
            <div v-if="scope.row.fridayDetails.length > 0">
              <div v-for="(item,index) in scope.row.fridayDetails" :key="index">
                <span v-if="item.kzzd1 == 0">{{item.ybj}} : 共 {{item.yjskrs}} 人</span>
                <span v-else>全部</span>
              </div>
            </div>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="周六">
          <template slot-scope="scope">
            <div v-if="scope.row.saturdayDetails.length > 0">
              <div v-for="(item,index) in scope.row.saturdayDetails" :key="index">
                <span v-if="item.kzzd1 == 0">{{item.ybj}} : 共 {{item.yjskrs}} 人</span>
                <span v-else>全部</span>
              </div>
            </div>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="周日">
          <template slot-scope="scope">
            <div v-if="scope.row.sundayDetails.length > 0">
              <div v-for="(item,index) in scope.row.sundayDetails" :key="index">
                <span v-if="item.kzzd1 == 0">{{item.ybj}} : 共 {{item.yjskrs}} 人</span>
                <span v-else>全部</span>
              </div>
            </div>
            <span v-else></span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="提示消息" :visible.sync="centerDialogVisible" width="30%">
      <h3>注意 : 生成教学计划功能和添加跳过时间功能,需要选择 " 校区班级 " 填写数据并保存后再进行操作!</h3>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SemesterView from "./components/semesterView";
import MonthView from "./components/monthView";
import WholeView from "./components/wholeView";
import { listSchool } from "@/api/basic/school";
import { listBjclass } from "@/api/basic/bjclass";
import { listClassCourseBasic } from "@/api/basic/classCourseBasic";
import { listTeachingMaterial } from "@/api/basic/teachingMaterial";
import {
  addGenerate,
  listGenerate,
  updateGenerate,
  addSkiptime,
  editSkiptime,
  deleteSkiptime,
  listSkiptime,
  generateTeachingHandle
} from "@/api/teaching/generate";
import { listClassCourse } from "@/api/basic/classCourse";
import { listClassPlan } from "@/api/teaching/classPlan";
import { listTeachingReview } from "@/api/basic/teachingReview";
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogTableVisible: false,
      centerDialogVisible: true,
      teachingForm: {
        zfx: [],
        xqid: null,
        kbsjStr: null,
        rybjid: null,
        gksj: null,
        lsid: null,
        bjrs: null,
        yyxks: null,
        xyxks: null,
        ryxks: null,
        jcid: null
      },
      skipDateForm: {
        timeName: null,
        kssj: null,
        jssj: null
      },
      rules: {
        bjrs: [
          { required: true, message: "请输入班级人数", trigger: "blur" },
          {
            pattern: /^[0-9][0-9]*[0-9]*$/g,
            message: "格式错误,只能输入数字"
          }
        ],
        xyxks: [
          { required: true, message: "请输入现有效课时", trigger: "blur" },
          {
            pattern: /^[0-9][0-9]*[0-9]*$/g,
            message: "格式错误,只能输入数字"
          }
        ],
        ryxks: [
          { required: true, message: "请输入日有效课时", trigger: "blur" },
          {
            pattern: /^[0-9][0-9]*[.]?[0-9]*$/g,
            message: "格式错误,只能输入数字"
          }
        ],
        gksj: [{ required: true, message: "请选择高考时间", trigger: "blur" }],
        jcid: [{ required: true, message: "请选择教学模板", trigger: "blur" }]
      },
      ifContent: null,
      reviewList: [],
      schoolList: [],
      classList: [],
      listTeachingMaterial: [],
      classCourseList: [],
      kcType: [],
      listGenerate: [],
      itemSkiptime: [],
      // 是否显示 更新教学计划按钮
      showUpdateBtn: false,
      // 临时保存总复习
      tempZfx: [],
      // 上一次勾选的总复习
      lastZfx: [],
      // 页面类型
      pageType:null
    };
  },
  components: {
    SemesterView,
    MonthView,
    WholeView
  },
  /*watch: {
    teachingForm: {
      handler(value) {
        if (value.id && this.showUpdateBtn && this.ifContent) {
          this.$refs[this.ifContent].toGrade();
        }
      },
      deep: true
    }
  },*/
  created() {
    listSchool().then(response => {
      this.schoolList = response.rows;
    });
    listTeachingMaterial({ parentId: 0 }).then(res => {
      this.listTeachingMaterial = res.data;
    });
    listTeachingReview({ parentId: 0 }).then(res => {
      this.reviewList = res.data;
    });
    this.getDicts("kc_type").then(response => {
      this.kcType = response.data;
    });
    this.pageType=this.$route.query.flag
    // 当父页面传递过来的参数不为空，且是带有页面标志的
    if (this.$route.query.addTeaching && this.pageType == "addTeachingPage") {
      this.teachingForm.xqid = this.$route.query.addTeaching.xqid;
      this.teachingForm.rybjid = this.$route.query.addTeaching.rybjid;
      if (this.teachingForm.xqid && this.teachingForm.rybjid) {
        this.xqmcOnChange(this.teachingForm.xqid);
        this.bjOnChange(this.teachingForm.rybjid);
      }
    }
  },
  methods: {
    // 组件
    toComponent(value) {
      if (!this.teachingForm.rybjid) {
        this.msgError("错误 : 请先选择校区班级!");
        return;
      }
      if (!this.teachingForm.id) {
        this.msgError("错误 : 请填写完整数据并保存!");
        return;
      }
      this.ifContent = value;
      this.$nextTick(() => {
        this.$refs[value].toGrade();
      });
    },
    // 获取课表
    getListClassCourseBasic(bjid) {
      if (!bjid) {
        return;
      }
      // 查课表数据
      listClassCourse({ bjid }).then(response => {
        this.classCourseList = response.rows;
        this.dialogTableVisible = true;
      });
    },
    // 选择总复习后触发的事件
    zfxOnChange(chooseZfxArr) {
      let obj = this.$refs["SemesterView"];
      if (undefined == obj) {
        this.teachingForm.zfx = this.tempZfx;
        this.msgError("请先点击【学期】,然后再勾选总复习选项！");
        return;
      }
      let chooseId = this.rtnChooseId(chooseZfxArr);
      if (chooseId) {
        // 当勾选有值了
        let vo = {
          chooseId: chooseId,
          chooseFxmc: this.rtnChooseFxmc(chooseId)
        };
        obj.insertEvent(vo, -1);
      }
    },
    rtnChooseFxmc(chooseId) {
      let arr = this.reviewList;
      let obj;
      let chooseFxmc = "";
      for (let i = 0; i < arr.length; i++) {
        obj = arr[i];
        if (chooseId == obj.jdid) {
          chooseFxmc = obj.jdmc;
          break;
        }
      }
      return chooseFxmc;
    },
    // 返回当前勾选的id
    rtnChooseId(chooseZfxArr) {
      let id;
      let lastId;
      let chooseId = null;
      if (chooseZfxArr.length > this.lastZfx.length) {
        // 当勾选的总复习大于上次勾选的总复习选项，则可以认定该操作是勾选的操作；反之是取消勾选的操作
        if (chooseZfxArr.length > 1) {
          // 当勾选一个时
          // 当前选择的复习选项
          for (let i = 0; i < chooseZfxArr.length; i++) {
            id = chooseZfxArr[i];
            // 上一次选择的复习选项
            for (let j = 0; j < this.lastZfx.length; j++) {
              lastId = this.lastZfx[j];
              if (id != lastId) {
                chooseId = id;
                break;
              }
            }
          }
        } else if (chooseZfxArr.length == 1) {
          chooseId = chooseZfxArr[0];
        }
      }
      this.lastZfx = chooseZfxArr;
      return chooseId;
    },
    // 获取班级
    xqmcOnChange(xqid) {
      if (!xqid) {
        this.classList = [];
        return;
      }
      if (!this.pageType) {// 当页面标志为空，则表示不是从父页面跳转过来的，需要清掉该日语班级id的值
        this.teachingForm.rybjid = null;
      }
      listBjclass({ kzzd1: xqid }).then(res => {
        this.classList = res.rows;
      });
      if (!this.$route.query.addTeaching) {
        this.teachingForm.rybjid = null;
      }
    },
    // 选择班级锁定老师
    bjOnChange(bjid) {
      this.reset();
      this.itemSkiptime = [];
      this.classList.forEach(value => {
        if (value.id === bjid) {
          this.teachingForm.lsid = value.lsxm;
          this.teachingForm.kbsjStr = value.kbsj;
          this.teachingForm.bjrs = value.bjrs;
        }
      });
      // 查课表
      listClassCourseBasic({ bjid }).then(res => {
        if (res.rows.length != 0) {
          this.teachingForm.yyxks = res.rows[0].kzzd1;
        }
      });
      // 是否生成教学计划
      listClassPlan({ rybjid: bjid }).then(response => {
        if (response.total > 0) {
          this.showUpdateBtn = true;
        } else {
          this.showUpdateBtn = false;
          this.ifContent = null;
        }
      });
      this.getListGenerate(bjid);
    },
    // 查教学计划的表单数据
    getListGenerate(bjid) {
      listGenerate({ rybjid: bjid }).then(res => {
        if (res.rows.length > 0) {
          this.listGenerate = res.rows;
          this.teachingForm = Object.assign(
            this.teachingForm,
            this.listGenerate[0]
          );
          if (
            null != this.listGenerate[0].zfx &&
            "" != this.listGenerate[0].zfx
          ) {
            this.teachingForm.zfx = this.listGenerate[0].zfx.split(",");
            this.tempZfx = this.teachingForm.zfx;
            this.lastZfx = this.tempZfx;
          } else {
            this.teachingForm.zfx = [];
          }
          this.teachingForm.kbsjStr = this.teachingForm.kbsj;
          this.listSkiptime(this.teachingForm.id);
        } else {
          this.listGenerate = [];
        }
      });
    },
    // 计算日有效课时
    calculateClassHours(xyxks) {
      this.teachingForm.ryxks = (xyxks / 7).toFixed(2);
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.itemSkiptime = [];
      this.showUpdateBtn = false;
    },
    // 保存生成教学计划表单数据
    saveTeachingForm() {
      this.$refs["teachingForm"].validate(valid => {
        if (valid) {
          if (null == this.teachingForm.zfx || this.teachingForm.zfx == "") {
            this.teachingForm.zfx = [];
          }
          this.teachingForm.zfx = this.teachingForm.zfx.join();
          if (this.teachingForm.id) {
            updateGenerate(this.teachingForm).then(res => {
              if (res.code == 200) {
                this.msgSuccess("成功 : 更新基础数据完成");
                this.getListGenerate(this.teachingForm.rybjid);
              }
            });
          } else {
            addGenerate(this.teachingForm).then(res => {
              if (res.code == 200) {
                this.msgSuccess("成功 : 保存基础数据完成");
                this.getListGenerate(this.teachingForm.rybjid);
              }
            });
          }
        } else {
          this.msgError("提示 : 请填写完整数据");
          return false;
        }
      });
    },
    // 生成教学计划数据
    addTeaching() {
      this.generateTeachingHandle(this.teachingForm, 0);
    },
    // 更新教学计划数据
    editTeaching() {
      this.generateTeachingHandle(this.teachingForm, 1);
    },
    // 手动生成教学计划
    async generateTeachingHandle(teachingForm, generateAndUpdate) {
      teachingForm.generateAndUpdate = generateAndUpdate;
      this.teachingForm.zfx = this.teachingForm.zfx.join();
      let result = await generateTeachingHandle(teachingForm);
      if (result.code == 200) {
        this.msgSuccess(result.msg);
        this.showUpdateBtn = true;
        this.getListGenerate(this.teachingForm.rybjid);
      }
    },
    // 数据重置
    reset() {
      let xqid = this.teachingForm.xqid;
      let rybjid = this.teachingForm.rybjid;
      this.teachingForm = {
        zfx: [],
        xqid,
        kbsjStr: null,
        rybjid,
        gksj: null,
        lsid: null,
        bjrs: null,
        yyxks: null,
        xyxks: null,
        ryxks: null,
        jcid: null
      };
    },
    // 数据重置
    resetSkipDateForm() {
      this.skipDateForm = {
        timeName: null,
        kssj: null,
        jssj: null
      };
    },
    // 查询跳过时间
    listSkiptime(glid) {
      listSkiptime({ glid }).then(res => {
        this.itemSkiptime = res.rows;
      });
    },
    // 保存跳过时间
    saveSkiptime() {
      let kssj = new Date(this.skipDateForm.kssj).getTime();
      let jssj = new Date(this.skipDateForm.jssj).getTime();
      if (kssj >= jssj) {
        this.msgError("错误 : 开始时间不得大于等于结束时间！");
        return;
      }
      if (this.skipDateForm.id) {
        editSkiptime(this.skipDateForm).then(res => {
          if (res.code == 200) {
            this.dialogFormVisible = false;
            this.listSkiptime(this.teachingForm.id);
            this.msgSuccess("成功 : 修改成功");
          } else {
            this.msgError("错误 : 修改失败");
          }
        });
      } else {
        this.skipDateForm.glid = this.teachingForm.id;
        addSkiptime(this.skipDateForm).then(res => {
          if (res.code == 200) {
            this.listSkiptime(this.teachingForm.id);
            this.dialogFormVisible = false;
            this.msgSuccess("成功 : 新增成功");
          }
        });
      }
    },
    // 添加跳过时间
    addSkiptime() {
      this.resetSkipDateForm();
      this.dialogFormVisible = true;
    },
    // 编辑跳过时间
    editSkiptime(index, row) {
      this.skipDateForm = row;
      this.dialogFormVisible = true;
    },
    // 删除跳过时间
    deleteSkiptime(index, row) {
      this.$confirm("是否删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteSkiptime(row.id).then(res => {
            if (res.code == 200) {
              this.listSkiptime(this.teachingForm.id);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>


<style lang="scss">
.add-teaching {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  .wrap-header {
    width: 100%;
    -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 1px solid #e6ebf5;
    display: flex;
    justify-content: space-between;
    .left-from {
      width: 65%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      // background: burlywood;
    }
    .right-tabel {
      width: 35%;
      height: 100%;
      // background: cornflowerblue;
      padding: 20px;
      box-sizing: border-box;
    }
  }
  .wrap-teaching-content {
    width: 100%;
    // height: 400px;
    -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 1px solid #e6ebf5;
    padding: 20px 30px;
    box-sizing: border-box;
    .teaching-top-tar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .active-color {
        color: #409eff;
      }
    }
    .teaching-content-item {
      width: 100%;
    }
  }
}
</style>
