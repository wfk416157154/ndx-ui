<template>
  <div class="work-log" ref="prent">
    <el-form ref="forms" :inline="true" label-width="80px">
      <el-form-item
        label="请选择班级"
        label-width="100px"
        v-if="!ifRoleHasPerms"
      >
        <el-select v-model="bjNameId" @change="getWorkLogTemplateQuery">
          <el-option
            v-for="(item, index) in getListBjclass"
            :key="index"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="sfbrz" @change="chooseBrz" v-if="!ifRoleHasPerms"
          >补日志</el-checkbox
        >
      </el-form-item>
      <el-form-item label="选择日期" v-if="showxzrq">
        <el-date-picker
          v-model="logTiem"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期时间"
          @change="onLogTime"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="sendOut">保存日志</el-button>
      </el-form-item>-->
      <!--<el-form-item>
        <el-button
          type="primary"
          @click="getWorkLogListQuery(bjNameId, logTiem)"
        >日志查询
        </el-button
        >
      </el-form-item>-->
    </el-form>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      v-if="ifForm"
    >
      <!-- <div class="clearfix" style="margin-bottom: 10px">
        <el-button
          style="float: right"
          type="primary"
          icon="el-icon-search"
          size="medium"
        >查看工作日志
        </el-button
        >
      </div>-->
      <!-- 课程 -->
      <div class="wrap-log">
        <div class="curriculum-title">
          <span>课程</span>
        </div>
        <div class="log-content">
          <el-form-item label-width="120px" prop="kczj">
            <el-input
              @blur="sendOut('$if')"
              resize="none"
              type="textarea"
              placeholder="请输入内容"
              v-model="ruleForm.kczj"
            ></el-input>
          </el-form-item>
        </div>
      </div>
      <!-- 课中 -->
      <div class="in-class clearfix">
        <div class="in-class-title clearfix">
          <span>课中</span>
        </div>
        <div class="in-class-list">
          <div class="in-class-content">
            <ul>
              <li
                v-for="(item, index) in ruleForm.basicTeacherWorkLogLessonList"
                :key="index"
              >
                <el-form-item :label="item.courseTypeName">
                  <el-input
                    v-model="
                      ruleForm.basicTeacherWorkLogLessonList[index].content
                    "
                  ></el-input>
                </el-form-item>
              </li>
            </ul>
            <!-- <el-form-item label="补充" label-width="120px">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="ruleForm.bc"></el-input>
            </el-form-item>-->
          </div>
        </div>
      </div>
      <!-- 课后 -->
      <div class="kh-wrap-preparation clearfix">
        <div class="preparation-title">
          <span>课后</span>
        </div>
        <div class="preparation-list">
          <div class="wrap-history">
            <div class="history-log-content">
              <el-form-item label="系统生成的日志" label-width="120px">
                <el-input
                  resize="none"
                  disabled
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5 }"
                  v-model="ruleForm.khXtrz"
                ></el-input>
              </el-form-item>
            </div>
            <!-- <div style="margin-left : 120px ;margin-bottom : 10px">
              <el-checkbox v-model="ruleForm.tx">听写</el-checkbox>
              <el-checkbox v-model="ruleForm.kwbs">课文背诵</el-checkbox>
              <el-checkbox v-model="ruleForm.tl">听力</el-checkbox>
            </div>-->
            <div class="history-log-content">
              <el-form-item label="补充日志" label-width="120px">
                <el-input
                  resize="none"
                  type="textarea"
                  placeholder="听写 课文背诵 听力"
                  :autosize="{ minRows: 5, maxRows: 5 }"
                  v-model="ruleForm.khBcrz"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
      <!-- 个人日志 -->
      <div class="personal-log clearfix">
        <div class="personal-title">
          <span>个人日志</span>
        </div>
        <div class="personal-log-list">
          <!-- 是否有考试 -->
          <div class="wrap-examination clearfix">
            <!--            <div class="examination-text">
              <el-form-item label="是否有考试" label-width="100px">
                <el-radio-group
                  style="width: 200px"
                  @change="examinationStatus"
                  v-model="ruleForm.isExam"
                  :disabled="ifsfyks"
                >
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>-->
            <div v-if="ifExamination" class="examination-upload">
              <div style="width: 500px; display: inline-block">
                <el-form-item label-width="100px" label="考试名称">
                  <el-select
                    v-model="ruleForm.kzzd4"
                    @change="ksmcChange"
                    placeholder="请选择考试名称"
                  >
                    <el-option
                      v-for="(item, index) in getListExaminationPaper"
                      :key="index"
                      :label="item.ksfw"
                      :value="item.id"
                      :disabled="ksmcdisable"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label-width="100px" label="考试类型">
                  <el-select
                    v-model="ruleForm.kzzd3"
                    placeholder="不可选"
                    :disabled="true"
                  >
                    <el-option
                      v-for="(item, index) in getExaminationType"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label-width="100px"
                  label="考试状态"
                  aria-disabled
                >
                  <el-select
                    v-model="ruleForm.kzzd2"
                    placeholder="不可选"
                    :disabled="true"
                  >
                    <el-option
                      v-for="(item, index) in getExaminationStatus"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="button">
                <el-button
                  type="info"
                  icon="el-icon-upload2"
                  size="mini"
                  @click="handleImport"
                  v-has-role="['teacher']"
                  >导入成绩
                </el-button>
              </div>
            </div>
          </div>
          <!-- 课堂照片 -->
          <div class="class-photos">
            <div>
              <el-form-item label-width="100px" label="教室卫生" prop="qtzs">
                <el-upload
                  :action="upload.imgUrl"
                  :headers="upload.headers"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :limit="maxPhotoNum"
                  :on-success="jswsSuccess"
                  :file-list="files1"
                  :disabled="ifRoleHasPerms"
                  :before-upload="beforeFile"
                  :data="fileForm"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
              </el-form-item>
            </div>

            <div>
              <el-form-item label-width="100px" label="学生表现" prop="qtzs">
                <el-upload
                  :action="upload.imgUrl"
                  :headers="upload.headers"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :limit="maxPhotoNum"
                  :on-success="xsbxSuccess"
                  :file-list="files2"
                  :disabled="ifRoleHasPerms"
                  :before-upload="beforeFile"
                  :data="fileForm"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
              </el-form-item>
            </div>
          </div>
          <!-- 备注 -->
          <div class="bz">
            <el-form-item label="备注">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 4 }"
                placeholder="请输入内容"
                v-model="ruleForm.remark"
              ></el-input>
            </el-form-item>
          </div>
          <!-- 发送到人 -->
          <!--<div class="send-out">
            <h4>发送到人</h4>
            <el-select
              v-model="ruleForm.sendUserArr"
              filterable
              multiple
              placeholder="请选择"
              @change="validSentBtn"
            >
              <el-option
                v-for="item in getListUser"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              ></el-option>
            </el-select>
            <el-button
              :disabled="sendBtn"
              type="primary"
              v-prevent-re-click
              @click="updateWorkLog()"
              v-has-permi="['basic:basicTeacherWorkLog:save']"
            >发送</el-button>
          </div>-->
        </div>
      </div>
      <!-- 课中 -->
      <div class="in-class clearfix">
        <div class="in-class-title clearfix">
          <span>提交</span>
        </div>
        <div class="in-class-list">
          <div class="in-class-content" style="text-align: center">
            <el-button type="primary" @click="sendOut">保存日志</el-button>
          </div>
        </div>
      </div>
    </el-form>

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.fileUrl"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :auto-upload="false"
        :data="{
          ksmc: getKsName,
          kslx: ruleForm.kzzd3,
          kssj: getKssj,
          bjid: bjNameId,
          workLogId: rzid,
        }"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-link type="info" style="font-size: 12px" @click="importTemplate"
            >下载模板</el-link
          >
        </div>
        <div class="el-upload__tip" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 考试成绩分析总结 -->
    <el-dialog
      title="考试分析总结"
      :close-on-click-modal="false"
      :visible.sync="kscjzj"
      width="60%"
    >
      <el-form label-width="120px">
        <el-form-item label="考试总结">
          <editor v-model="getKscjzj" :item="items" :min-height="130" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="kscjzj = false">取 消</el-button>
        <el-button type="primary" @click.once="addKscjfxzj">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  workLogListQuery,
  addSave,
  updateBasicTeacherWorkLog,
  workLogTemplateQuery,
  workLogStatusQuery,
} from "@/api/basic/basicTeacherWorkLog";
import { getToken } from "@/utils/auth";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
import {
  updateExaminationPaper,
  listExaminationPaper,
  getExaminationPaper,
} from "@/api/basic/examinationPaper";
import { listBjclass } from "@/api/basic/bjclass";
import { listUser, selectInRoleUser } from "@/api/system/user";
import { listClassCourse } from "@/api/basic/classCourse";
import { addExamSummary } from "@/api/basic/examSummary";
import { homePageQuery } from "@/api/basic/basicTeacherWorkLog";

export default {
  data() {
    return {
      fileForm: {
        renameFileName: "",
      },
      sfbrz: null, // 是否补日志
      showxzrq: false, // 显示【选择日期】
      ifRoleHasPerms: false,
      ksmcdisable: false,
      enableBos: false,
      //日志集合
      ruleForm: {
        sendUserArr: [],
      },
      ifsfyks: false,
      rules: {
        kczj: [{ required: true, message: "请填写课程日志", trigger: "blur" }],
      },
      // 文件图片上传
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传考试成绩地址
        fileUrl:
          process.env.VUE_APP_BASE_API +
          "/basic/examinationPaper/importClassGradeData",
        // 上传图片地址
        imgUrl: process.env.VUE_APP_BASE_API + "/file/renameUpload",
      },
      items: "height : 150px",
      // 教室图片
      dialogImageUrl: "",
      dialogVisible: false,
      kscjzj: false,
      // 是否有考试
      ifExamination: false,
      // 发送人
      getListUser: [],
      // 课中数据
      basicTeacherWorkLogLessonList: [],
      // 课程数据
      kcType: [],
      // // 课后 听说读写
      // khLogType : [],
      // 个人日志 考试上传状态
      getExaminationStatus: [],
      // 个人日志 考试类型
      getExaminationType: [],
      // 限制图片上传数量
      maxPhotoNum: 20,
      //图片列表
      files1: [],
      files2: [],
      // 图片上传计数
      photoNum1: 0,
      photoNum2: 0,
      // 获取考试名称
      getListExaminationPaper: [],
      // 老师所带班级
      bjNameId: null,
      // 日志填写时间
      logTiem: null,
      // 班级名称
      bjName: "",
      // 班级信息数据
      getListBjclass: [],
      // 课中数据
      listClassCourse: [],
      // 课中开始时间
      getKssj: "",
      // 考试范围[名称]
      getKsName: "",
      // 显示日志
      ifForm: false,
      // 考试分析总结
      getKscjzj: "",
      // 日志id
      rzid: null,
      sendBtn: true, // 发送按钮：默认禁用，当选择发送人和填写课程日志时才启用
      //是否上传文件
      getselectFileList: [],
    };
  },
  created() {
    let dataRoleId = this.$store.state.user.dataRoleWeightId;
    if (dataRoleId != 50) {
      // 角色权重不等于50，表示该角色无权上传图片
      this.ifRoleHasPerms = true;
    }
    this.getDicts("kc_type").then((response) => {
      this.kcType = response.data;
    });
    this.getDicts("examination_status").then((response) => {
      this.getExaminationStatus = response.data;
    });
    this.getDicts("examination_type").then((response) => {
      this.getExaminationType = response.data;
    });
    this.getConfigKey("zipFile").then((res) => {
      this.upload.type = res.msg;
    });
  },
  mounted() {
    this.initBjClassList();
    this.getList();
    this.validSentBtn();
    this.initGetListExaminationPaper();
  },
  methods: {
    beforeFile(file) {
      this.fileForm.renameFileName = "老师工作日志—" + file.name;
    },
    initBjClassList() {
      // 获取班级信息
      listBjclass().then((res) => {
        this.getListBjclass = res.rows;
        if (res.rows.length >= 1) {
          this.bjNameId = res.rows[0].id;
        }
      });
    },
    // 查询当前未上传的考试试卷
    initGetListExaminationPaper() {
      let json = {
        jwsjzt: "1", //教务试卷状态(0未发送1已发送)
        kzzd2: "9", //未上传的考卷
        bjid: this.bjNameId, //班级
      };
      listExaminationPaper(json).then((res) => {
        this.getListExaminationPaper = res.rows;
      });
    },
    chooseBrz(flag) {
      // 当选择补日志时：true
      if (flag) {
        this.showxzrq = true;
        this.ruleForm.status = 0; // 表示后续补的日志
      } else {
        this.showxzrq = false;
        this.ruleForm.status = 1; // 表示正常填写的日志
      }
      this.sfbrz = flag;
    },
    onLogTime(val) {
      this.getWorkLogTemplateQuery();
    },
    // 获取课中课表信息
    getList($false) {
      /* 默认查询角色是教务员的用户 */
      /*selectInRoleUser({ roleId: "4" }).then(res => {
          this.getListUser = res.rows;
        });*/
      // 当从主页面点击查看详情时跳转过来时
      if (this.$route.params.id && this.$route.params.id != ":id") {
        homePageQuery({ teacherWorkLogId: this.$route.params.id }).then(
          (res) => {
            if (res.rows[0].isRead == 1) {
              this.msgError("当前日志只能预览,不可编辑");
              this.$refs.prent.style.pointerEvents = "none";
            }
          }
        );
        this.rzid = this.$route.params.id;
        workLogListQuery({ id: this.rzid }).then((res) => {
          if (res.data.length != 0) {
            this.ifForm = true;
            this.ruleForm = res.data[0];
            this.ruleForm.basicTeacherWorkLogLessonList.map((value, index) => {
              for (let i = 0; i < this.kcType.length; i++) {
                if (this.kcType[i].dictValue == value.courseType) {
                  value.courseTypeName = this.kcType[i].dictLabel;
                  this.ruleForm.basicTeacherWorkLogLessonList[index] = value;
                }
              }
            });
            this.ifExamination = this.ruleForm.isExam == "1" ? true : false;
            // 教室卫生照片回显
            this.selectPhotoList(
              (this.ruleForm.jswsFile = this.ruleForm.jswsFile || secretKey()),
              "files1"
            );
            // 学生表现照片回显
            this.selectPhotoList(
              (this.ruleForm.xsbxFile = this.ruleForm.xsbxFile || secretKey()),
              "files2"
            );
          }
        });
      } else {
        listBjclass().then((res) => {
          if (res.rows.length > 0) {
            this.bjNameId = res.rows[0].id;
            this.getWorkLogTemplateQuery($false);
          }
        });
      }
    },
    // 填写日志进来的页面，需要根据班级id查询该班级启用的课表
    getWorkLogTemplateQuery($false) {
      this.initGetListExaminationPaper();
      if ($false == "false") return;
      this.getWorkLogStatusQuery();
    },
    // 查询日志状态(1:未填写,2:已填写未发送,3:已发送)
    getWorkLogStatusQuery() {
      this.getselectFileList = [];
      let json = {
        bjid: this.bjNameId,
      };
      for (let i = 0; i < this.getListBjclass.length; i++) {
        if (this.getListBjclass[i].id === this.bjNameId) {
          var rybjName = this.getListBjclass[i].rybjmc;
          this.bjName = rybjName;
        }
      }
      if (this.logTiem) {
        json.date = this.logTiem;
      } else {
        json.date = new Date();
      }
      workLogStatusQuery(json).then((res) => {
        switch (res.data) {
          case 1:
            this.findTemplateQuery(json.date); // 查询课表的课中模板
            break;
          case 2:
            this.$confirm(`是否修改《${rybjName}》当前日志?`, "提示", {
              confirmButtonText: "返回主页",
              cancelButtonText: "修改日志",
              type: "warning",
            })
              .then(() => {
                this.skipToLogHomePage();
              })
              .catch(() => {
                // this.findTemplateQuery(json.date); // 查询课表的课中模板
                console.log("js", json.date);
                this.getWorkLogListQuery(this.bjNameId, json.date); // 查询已填写未发送的日志
              });
            break;
          case 3:
            this.ifForm = false;
            this.$confirm(
              `您的日志已记录，不能进行修改。联系教务老师!`,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                this.skipToLogHomePage();
              })
              .catch(() => {
                // this.skipToLogHomePage();
              });
            break;
          default:
            this.findTemplateQuery(json.date); // 查询课表的课中模板
            this.files1 = [];
            this.files2 = [];
            break;
        }
      });
    },
    // 查询课中的课表模板
    findTemplateQuery(date) {
      console.log(date);
      this.rzid = null;
      workLogTemplateQuery({ bjid: this.bjNameId, date }).then((res) => {
        console.log(res);
        if (res.data.length != 0) {
          this.ifForm = true;
          this.ruleForm = res.data;
          this.rzid = this.ruleForm.id || null;
          this.ruleForm.basicTeacherWorkLogLessonList.map((value, index) => {
            for (let i = 0; i < this.kcType.length; i++) {
              if (this.kcType[i].dictValue == value.courseType) {
                value.courseTypeName = this.kcType[i].dictLabel;
                this.ruleForm.basicTeacherWorkLogLessonList[index] = value;
              }
            }
          });
          this.ifExamination = this.ruleForm.isExam == "1" ? true : false;
        }
        if (
          this.ruleForm.basicTeacherWorkLogLessonList &&
          this.ruleForm.basicTeacherWorkLogLessonList.length == 0
        ) {
          this.ruleForm.basicTeacherWorkLogLessonList = [];
        }
        console.log("ruleForm", this.ruleForm);
      });
    },
    // 获取页面中参数配置的路由
    skipToLogHomePage() {
      this.getConfigKey("logHomePage").then((resp) => {
        this.$router.push({
          path: resp.msg,
        });
      });
    },
    // 查询某一班级日志
    async getWorkLogListQuery(bjid, date) {
      // console.log("date",date)
      if (!bjid || !date) {
        this.$notify({
          message: "请选择班级和日期",
          type: "warning",
        });
        return;
      }
      // date =
      //   date &&
      //   date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      this.ifForm = true;
      let json = {
        // 老师id
        lsid: this.$store.state.user.glrid,
        // 班级 id
        kzzd1: bjid,
        // 时间
        date: date,
      };
      if (typeof json.date != "string") {
        json.date =
          json.date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate();
      }
      this.ruleForm = json;
      // 获取日志信息
      workLogListQuery(json).then((res) => {
        if (res.data.length != 0) {
          this.rzid = res.data[0].id;
          this.ruleForm.id = this.rzid;
          selectFileList({ kzzd1: this.rzid }).then((res) => {
            if (200 == res.code) {
              this.getselectFileList = res.rows;
            }
          });
          //如果已保存考试信息并且上传则禁用下拉框
          if (res.data[0].kzzd4 != null && res.data[0].kzzd2 === "3") {
            this.ksmcdisable = true;
          } else {
            this.ksmcdisable = false;
          }
          this.ruleForm = res.data[0];
          this.ruleForm.basicTeacherWorkLogLessonList.map((value, index) => {
            for (let i = 0; i < this.kcType.length; i++) {
              if (this.kcType[i].dictValue == value.courseType) {
                value.courseTypeName = this.kcType[i].dictLabel;
                this.ruleForm.basicTeacherWorkLogLessonList[index] = value;
              }
            }
          });
          this.ifExamination = this.ruleForm.isExam == "1" ? true : false;
          // 教室卫生照片回显
          this.selectPhotoList(
            (this.ruleForm.jswsFile = this.ruleForm.jswsFile || secretKey()),
            "files1"
          );
          // 学生表现照片回显
          this.selectPhotoList(
            (this.ruleForm.xsbxFile = this.ruleForm.xsbxFile || secretKey()),
            "files2"
          );
        }
        if (
          this.ruleForm.basicTeacherWorkLogLessonList &&
          this.ruleForm.basicTeacherWorkLogLessonList.length == 0
        ) {
          this.ruleForm.basicTeacherWorkLogLessonList = [];
        }
      });
    },
    /** 导入按钮操作 */
    handleImport() {
      let obj = {
        ksfw: this.ruleForm.kzzd4,
        bjid: this.bjNameId,
      };
      listExaminationPaper(obj).then((res) => {
        if (res.rows[0].kzzd2 === "3") {
          this.$notify({
            message: "该成绩已上传,不可重复上传",
            type: "error",
          });
        } else {
          this.upload.title = "考试成绩导入";
          this.upload.open = true;
        }
      });
      //上传时导入到表格中
      for (let j = 0; j < this.getListExaminationPaper.length; j++) {
        if (this.getListExaminationPaper[j].ksfw == this.ruleForm.kzzd4) {
          this.getKssj = this.getListExaminationPaper[j].kskssj;
          this.getKsName = this.getListExaminationPaper[j].ksfw;
          return;
        }
      }
    },
    // 下载模板操作
    importTemplate() {
      this.download(
        "basic/examinationPaper/importClassGradeTemplate",
        {
          bjid: this.bjNameId,
        },
        `考试成绩-导入模板.xlsx`
      );
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 上传失败
    handleFileError(err, file, fileList) {
      // console.log("errerrerrerr", err);
    },
    // 文件上传成功处理
    async handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      if (response.code == 200) {
        this.msgSuccess("上传成功");
        // let json = {
        //   lssjzt: "4",
        //   kzzd2: "3",
        //   id: this.ruleForm.kzzd4,
        //   kzzd3: this.rzid
        // };
        // 日志表变为上传状态
        let rzjson = {
          id: this.rzid,
          kzzd2: "3",
          kzzd3: this.ruleForm.kzzd3,
          //之所以不直接用this.ruleForm.kzzd4是因为上传后getListExaminationPaper就没有对应值了
          kzzd4: this.getKsName,
        };
        updateBasicTeacherWorkLog(rzjson).then((res) => {
          if (res.code == 200) {
            this.kscjzj = true;
          }
        });
      } else {
        await this.msgError("上传失败");
      }
      this.getList("false");
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    //是否有考试
    examinationStatus(value) {
      if (!this.rzid) {
        this.msgError("错误：请先填写课程内容");
        this.ifsfyks = true;
        return;
      } else {
        this.ifExamination = value == "1" ? true : false;
      }
    },
    //考试名称筛选
    ksmcChange(value) {
      getExaminationPaper(value).then((res) => {
        this.ruleForm.kzzd2 = res.data.kzzd2;
        this.ruleForm.kzzd3 = res.data.kslx;
        this.ruleForm.kzzd4 = res.data.ksfw;
      });
    },
    // 图片预览 大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片删除
    handleRemove(file, fileList) {
      deleteImg(file.id).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    // 教室卫生图片上传成功回调
    jswsSuccess(response, file, fileList) {
      if (response.code == 500) {
        this.$notify({
          message: "上传失败",
          type: "error",
        });
        return;
      }
      let data = response.data;
      data.kzzd1 = this.ruleForm.jswsFile || secretKey();
      this.ruleForm.jswsFile = data.kzzd1;
      this.photoNum1 = fileList.length;
      addImg(data).then((res) => {
        file.id = res.data.id;
        this.ifPhotoLimit(this.photoNum1);
      });
    },
    // 学生表现图片上传成功回调
    xsbxSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.ruleForm.xsbxFile || secretKey();
      this.ruleForm.xsbxFile = data.kzzd1;
      this.photoNum2 = fileList.length;
      addImg(data).then((res) => {
        file.id = res.data.id;
        this.ifPhotoLimit(this.photoNum2);
      });
    },
    // 图片限制判断
    ifPhotoLimit(num) {
      if (num >= this.maxPhotoNum) {
        this.$message({
          message: "最多上传 20 张图片",
          type: "warning",
        });
      } else {
        this.$message({
          message: "图片上传成功",
          type: "success",
        });
      }
    },
    // 查询照片
    selectPhotoList(glid, file) {
      let kzzdJson = {
        kzzd1: glid,
      };
      selectFileList(kzzdJson).then((res) => {
        this.photoNum = res.total;
        this[file] = res.rows;
      });
    },
    // 保存
    sendOut($if) {
      if (true == this.sfbrz) {
        if (null == this.logTiem) {
          this.msgError("请选择补哪一天的日志！");
          return;
        }
      }
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.addWorkLog($if);
        } else {
          this.$notify({
            message: "请先填写日志内容",
            type: "error",
          });
          return false;
        }
      });
    },
    // 校验发送按钮
    validSentBtn() {
      if (
        null == this.ruleForm.sendUserArr ||
        this.ruleForm.sendUserArr.length < 1
      ) {
        this.sendBtn = true;
      } else {
        this.sendBtn = false;
      }
    },
    // 第一次添加日志时， this.rzid为空
    addWorkLog($if) {
      $if = $if == "$if" ? true : false;
      this.ruleForm.kzzd1 = this.bjNameId;
      this.ruleForm.date = this.logTiem;
      this.ruleForm.lsid = this.$store.state.user.glrid;
      addSave(this.ruleForm).then(async (res) => {
        this.rzid = res.data.id;
        this.ruleForm.id = this.rzid;
        this.validSentBtn();
        if (!this.logTiem) {
          this.logTiem = new Date();
        }
        this.getWorkLogListQuery(this.bjNameId, this.logTiem);
        if (res.code == 200) {
          this.ifsfyks = false;
          if (this.ruleForm.kzzd4) {
            // 选择考试范围
            let jsonObj = {
              id: this.ruleForm.kzzd4,
              kzzd3: res.data.id,
            };
            // 保存日志id到对应试卷
            await updateExaminationPaper(jsonObj);
          }
          if ($if) return;
          this.$notify({
            message: "日志保存成功",
            type: "success",
          });
          this.skipToLogHomePage();
        }
      });
    },
    // 更新发送日志， this.rzid为已经不为空
    updateWorkLog() {
      addSave(this.ruleForm).then(async (res) => {
        if (res.code == 200) {
          this.rzid = res.data.id;
          if (this.ruleForm.kzzd4) {
            // 选择考试范围
            let jsonObj = {
              id: this.ruleForm.kzzd4,
              kzzd3: res.data.id,
            };
            // 保存日志id到对应试卷
            await updateExaminationPaper(jsonObj);
          }
          this.$notify({
            message: "日志发送成功",
            type: "success",
          });
          this.skipLogHome();
        }
      });
    },
    // 获取页面中参数配置的路由
    skipLogHome() {
      this.getConfigKey("logHomePage").then((resp) => {
        this.router = resp.msg;
        this.$router.push({
          path: this.router,
        });
      });
    },
    // 考试分析总结
    addKscjfxzj() {
      let json = {
        teacherWorklogId: this.rzid,
        examPaperId: this.ruleForm.kzzd4,
        ksfxzj: this.getKscjzj,
      };
      addExamSummary(json).then((res) => {
        console.log("res", res);
        if (res.code == 200) {
          this.$notify({
            message: res.msg,
            type: "success",
          });
          this.ruleForm.kzzd2 = "3";
          this.kscjzj = false;
        } else {
          this.$notify({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    // 文件上传前验证
    beforeAvatarUploadZIP(file) {
      const isZIP =
        this.upload.type.indexOf(
          file.name.substring(file.name.lastIndexOf(".") + 1)
        ) != -1;
      const isLt40M = file.size / 1024 / 1024 < 40;
      if (!isZIP) {
        this.$message.error("上传文件格式不正确");
      }
      if (!isLt40M) {
        this.$message.error("上传文件大小不能超过 40MB!");
      }
      return isZIP && isLt40M;
    },
    // 文件上传中处理压缩包
    addFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理压缩包
    addFileSuccess(response, file, fileList) {
      let data = response.data;
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$notify({
        title: "成功",
        message: "上传文件成功",
        type: "success",
      });
      data.kzzd1 = this.rzid;
      // 保存文件上传地址
      addFile(data).then((res) => {});
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
};
</script>

<style lang="scss">
.work-log {
  padding: 20px;
  box-sizing: border-box;
  // cursor: not-allowed;
  .wrap-log {
    width: 100%;
    height: 150px;
    position: relative;
    border: 2px #ccc solid;

    .curriculum-title {
      width: 20%;
      height: 100%;
      text-align: center;
      border-right: 2px #ccc solid;
      float: left;
      //background-color: #84af9b;
      //color: #fff;

      span {
        line-height: 150px;
      }
    }

    .log-content {
      padding: 15px;
      box-sizing: border-box;
      float: right;
      width: 80%;
      height: 100%;
      padding-left: 10px;
      box-sizing: border-box;
      //background-color: #aedd81;
    }
  }

  .wrap-preparation {
    width: 100%;
    height: 900px;
    position: relative;
    border: 2px #ccc solid;
    border-top: none;

    .preparation-title {
      width: 20%;
      height: 100%;
      text-align: center;
      float: left;
      //background-color: #84af9b;
      //color: #fff;
      position: relative;
      bottom: 0;
      top: 0;
      border-right: 2px #ccc solid;

      span {
        line-height: 900px;
      }
    }

    .preparation-list {
      float: right;
      width: 80%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      //background-color: #aedd81;

      .wrap-history {
        width: 100%;

        .history-log-content {
          float: right;
          width: 100%;
          height: 100%;

          .el-upload-dragger {
            width: 100%;
            height: 100px;
          }
        }
      }
    }
  }

  .kh-wrap-preparation {
    width: 100%;
    height: 300px;
    position: relative;
    border: 2px #ccc solid;
    border-top: none;

    .preparation-title {
      width: 20%;
      height: 100%;
      text-align: center;
      float: left;
      //background-color: #84af9b;
      //color: #fff;
      position: relative;
      bottom: 0;
      top: 0;
      border-right: 2px #ccc solid;

      span {
        line-height: 300px;
      }
    }

    .preparation-list {
      float: right;
      width: 80%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      //background-color: #aedd81;

      .wrap-history {
        width: 100%;

        .history-log-content {
          float: right;
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .in-class {
    width: 100%;
    height: 100%;
    position: relative;
    border: 2px #ccc solid;
    border-top: none;
    position: relative;

    .in-class-title {
      width: 20%;
      height: 100%;
      // text-align: center;
      float: left;
      border-right: 2px #ccc solid;
      position: absolute;
      top: 0;
      bottom: 0;
      //background-color: #84af9b;
      //color: #fff;

      span {
        position: absolute;
        display: inline-block;
        width: 100%;
        text-align: center;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .in-class-list {
      float: right;
      width: 80%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      //background-color: #aedd81;

      .in-class-content {
        width: 100%;
        height: 100%;

        ul {
          list-style: none;
          padding-left: 20px;
          box-sizing: border-box;

          li {
            width: 100%;
            height: 40px;
            padding-left: 10px;
            box-sizing: border-box;
            margin-bottom: 5px;

            span {
              line-height: 40px;
            }
          }
        }
      }
    }
  }

  .personal-log {
    width: 100%;
    height: 300%;
    position: relative;
    border: 2px #ccc solid;
    border-top: none;
    position: relative;

    .personal-title {
      width: 20%;
      height: 100%;
      text-align: center;
      float: left;
      border-right: 2px #ccc solid;
      position: absolute;
      top: 0;
      bottom: 0;
      //background-color: #84af9b;
      //color: #fff;

      span {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        transform: translateX(-50%);
      }
    }

    .personal-log-list {
      width: 80%;
      height: 100%;
      float: right;
      //background-color: #aedd81;

      .wrap-examination {
        width: 100%;
        height: 100%;
        margin-bottom: 20px;

        .examination-text {
          // float: left;
          // width: 20%;
        }

        .examination-upload {
          padding: 20px;
          box-sizing: border-box;
          //background-color: greenyellow;
          // background-image: linear-gradient( to right, greenyellow , green);
          //background: linear-gradient(to right, #bb313e25);
          .button {
            margin-left: 100px;
          }
        }
      }

      .class-photos {
        width: 100%;
        height: 100%;
        padding-left: 20px;
        box-sizing: border-box;
      }

      .bz {
        margin: 10px;
      }

      .send-out {
        margin: 10px;
      }
    }
  }
}
</style>
