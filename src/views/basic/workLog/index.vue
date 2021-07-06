<template>
  <div class="work-log">
    <el-form ref="forms" :inline="true" label-width="80px">
      <el-form-item label="选择班级">
        <el-select v-model="bjNameId">
          <el-option
            v-for="(item, index) in getListBjclass"
            :key="index"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择日期">
        <el-date-picker
          v-model="logTiem"
          format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="getWorkLogListQuery(bjNameId, logTiem)"
        >日志查询
        </el-button
        >
      </el-form-item>
    </el-form>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      v-if="ifForm"
    >
      <div class="clearfix" style="margin-bottom: 10px">
        <el-button
          style="float: right"
          type="primary"
          icon="el-icon-search"
          size="medium"
        >查看工作日志
        </el-button
        >
      </div>
      <!-- 课程 -->
      <div class="wrap-log">
        <div class="curriculum-title">
          <span>课程</span>
        </div>
        <div class="log-content">
          <el-form-item label-width="120px" prop="kczj">
            <el-input
              @blur="sendOut"
              resize="none"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 5 }"
              placeholder="请输入内容"
              v-model="ruleForm.kczj"
            ></el-input>
          </el-form-item>
        </div>
      </div>
      <!-- 备课 -->
      <div class="wrap-preparation clearfix">
        <div class="preparation-title">
          <span>备课</span>
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
                  v-model="ruleForm.bkXtrz"
                ></el-input>
              </el-form-item>
            </div>
            <div class="history-log-content">
              <el-form-item label="补充日志" label-width="120px">
                <el-input
                  resize="none"
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5 }"
                  v-model="ruleForm.bkBcrz"
                ></el-input>
              </el-form-item>
            </div>
          </div>
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
      <div class="wrap-preparation clearfix">
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
            <div class="examination-text">
              <el-form-item label="是否有考试" label-width="100px">
                <el-radio-group
                  style="width: 200px"
                  @change="examinationStatus"
                  v-model="ruleForm.isExam"
                >
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
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
                  aria-disabled=""
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
                </el-button
                >
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
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt/>
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
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt/>
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
          <div class="send-out">
            <h4>发送到人</h4>
            <el-select
              v-model="ruleForm.kzzd5"
              filterable
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in getListUser"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="sendOut(true)" v-has-permi="['basic:basicTeacherWorkLog:save']">发送
            </el-button>
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
        :auto-upload="false"
        :data="{ ksmc: getKsName, kslx: ruleForm.kzzd3, kssj: getKssj }"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport"/>
          是否更新已经存在的数据
          <el-link type="info" style="font-size: 12px" @click="importTemplate"
          >下载模板
          </el-link
          >
        </div>
        <div class="el-upload__tip" style="color: red" slot="tip">
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
          <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 10 }"
            v-model="getKscjzj"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="kscjzj = false">取 消</el-button>
        <el-button type="primary" @click="addKscjfxzj">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    workLogListQuery,
    addSave,
    updateBasicTeacherWorkLog,
  } from "@/api/basic/basicTeacherWorkLog";
  import {getToken} from "@/utils/auth";
  import {addImg, selectFileList, deleteImg} from "@/api/tool/common";
  import {secretKey} from "@/utils/tools";
  import {
    updateExaminationPaper,
    listExaminationPaper,
    getExaminationPaper,
  } from "@/api/basic/examinationPaper";
  import {listBjclass} from "@/api/basic/bjclass";
  import {listUser} from "@/api/system/user";
  import {listClassCourse} from "@/api/basic/classCourse";
  import {addExamSummary} from "@/api/basic/examSummary";

  export default {
    data() {
      return {
        ifRoleHasPerms: false,
        ksmcdisable: false,
        enableBos: false,
        //日志集合
        ruleForm: {},
        rules: {
          kczj: [{required: true, message: "请填写课程日志", trigger: "blur"}],
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
          headers: {Authorization: "Bearer " + getToken()},
          // 上传考试成绩地址
          fileUrl:
            process.env.VUE_APP_BASE_API +
            "/basic/examinationPaper/importClassGradeData",
          // 上传图片地址
          imgUrl: process.env.VUE_APP_BASE_API + "/file/upload",
        },
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
        maxPhotoNum: 5,
        //图片列表
        files1: [],
        files2: [],
        // 图片上传计数
        photoNum1: 0,
        photoNum2: 0,
        // 获取考试名称
        getListExaminationPaper: [],
        // 老师所带班级
        bjNameId: "",
        // 日志填写时间
        logTiem: "",
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
        rzid: "",
      };
    },
    created() {
      let dataRoleId = this.$store.state.user.dataRoleWeightId;
      if (dataRoleId != 50) {// 角色权重不等于50，表示该角色无权上传图片
        this.ifRoleHasPerms = true
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
    },
    mounted() {
      this.getList();
    },
    methods: {
      // 获取课中课表信息
      getList() {
        // 获取班级信息
        listBjclass({kzzd2: this.$store.state.user.glrid}).then((res) => {
          this.getListBjclass = res.rows;
          // 获取个人日志 考试范围
          //只查已发送,并且未上传的考卷
          let json = {
            jwsjzt: "1",
            kzzd2: "9", //未上传的考卷
          };
          listExaminationPaper(json).then((res) => {
            this.getListExaminationPaper = res.rows;
          });
        });
        // 获取用户列表
        listUser().then((res) => {
          this.getListUser = res.rows;
        });
        // 日志主页进来的详情页
        let logId = this.$route.params.id;
        workLogListQuery({id: logId}).then((res) => {
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
          if (
            this.ruleForm.basicTeacherWorkLogLessonList &&
            this.ruleForm.basicTeacherWorkLogLessonList.length == 0
          ) {
            this.ruleForm.basicTeacherWorkLogLessonList = dataInClass;
          }
        });
      },
      // 查询某一班级日志
      async getWorkLogListQuery(bjid, date) {
        if (!bjid || !date) {
          this.$notify({
            message: "请选择班级和日期",
            type: "warning",
          });
          return;
        }
        date =
          date &&
          date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        this.ifForm = true;
        for (let i = 0; i < this.getListBjclass.length; i++) {
          if (this.getListBjclass[i].id == bjid) {
            this.bjName = this.getListBjclass[i].rybjmc;
          }
        }
        // 课表获取
        let listClassCourseResult = await listClassCourse({bjid: bjid});
        this.listClassCourse = listClassCourseResult.rows;
        // 课中数据
        let dataInClass = [];
        this.listClassCourse.forEach((value) => {
          for (let i = 0; i < this.kcType.length; i++) {
            if (value.kcType == this.kcType[i].dictValue) {
              dataInClass.push({
                courseTypeName: this.kcType[i].dictLabel,
                courseType: this.kcType[i].dictValue,
                content: "",
              });
            }
          }
        });

        let json = {
          // 老师id
          lsid: this.$store.state.user.glrid,
          // 班级 id
          kzzd1: bjid,
          // 时间
          date: date,
        };
        this.ruleForm = json;
        // 获取日志信息
        workLogListQuery(json).then((res) => {
          if (res.data.length != 0) {
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
            this.ruleForm.basicTeacherWorkLogLessonList = dataInClass;
          }
        });
      },
      /** 导入按钮操作 */
      handleImport() {
        if (this.ruleForm.kczj == null) {
          this.$notify({
            message: "请先填写课程日志",
            type: "error",
          });
          return;
        }
        if (this.ruleForm.kzzd3 == null) {
          this.$notify({
            message: "请先填写考试类型",
            type: "error",
          });
          return;
        }
        if (!this.ruleForm.kzzd4) {
          this.$notify({
            message: "请选择考试",
            type: "error",
          });
          return;
        }
        getExaminationPaper(this.ruleForm.kzzd4).then((res) => {
          if (res.data.kzzd2 === "3") {
            this.$notify({
              message: "该成绩已上传,不可重复上传",
              type: "error",
            });
          } else {
            this.upload.title = "考试成绩导入";
            this.upload.open = true;
          }
        });

        for (let j = 0; j < this.getListExaminationPaper.length; j++) {
          if (this.getListExaminationPaper[j].id == this.ruleForm.kzzd4) {
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
            rybjmc: this.bjName,
          },
          `考试-导入模板.xlsx`
        );
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$notify({
          message: response.msg,
          type: "success",
        });
        this.getList();
        let json = {
          lssjzt: "4",
          kzzd2: "3",
          id: this.ruleForm.kzzd4,
          kzzd3: this.rzid,
        };
        // 改变老师试卷状态
        updateExaminationPaper(json).then((res) => {
          this.kscjzj = true;
        });
        // 日志表变为上传状态
        let rzjson = {
          id: this.rzid,
          kzzd2: "3",
        };
        updateBasicTeacherWorkLog(rzjson);
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
      //是否有考试
      examinationStatus(value) {
        this.ifExamination = value == "1" ? true : false;
      },
      //考试名称筛选
      ksmcChange(value) {
        getExaminationPaper(value).then((res) => {
          this.ruleForm.kzzd2 = res.data.kzzd2
          this.ruleForm.kzzd3 = res.data.kslx
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
            message: "最多上传 5 张图片",
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
      // 发送
      sendOut(value) {
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            // 暂时不发送到人 null
            this.ruleForm.kzzd5 = null;
            addSave(this.ruleForm).then(async (res) => {
              if (res.code == 200) {
                this.getWorkLogListQuery(this.bjNameId, this.logTiem);
                this.getList();
                if (this.ruleForm.kzzd4) {
                  let jsonObj = {
                    id: this.ruleForm.kzzd4,
                    kzzd3: res.data.id,
                  };
                  this.rzid = res.data.id;
                  // 保存日志id到对应试卷
                  await updateExaminationPaper(jsonObj);
                }
                // 点击发送按钮弹出
                if (value == true) {
                  this.$notify({
                    message: "日志发送成功",
                    type: "success",
                  });
                } else {
                  if (!this.ruleForm.kczj) {
                    return;
                  }
                  this.$notify({
                    message: "日志保存成功",
                    type: "success",
                  });
                }
              }
            });
          } else {
            this.$notify({
              message: "请先填写日志内容",
              type: "error",
            });
            return false;
          }
        });
      },
      // 考试分析总结
      addKscjfxzj() {
        this.kscjzj = false;
        let json = {
          teacherWorklogId: this.rzid,
          examPaperId: this.ruleForm.kzzd4,
          ksfxzj: this.getKscjzj,
          teacherWorklogId: res.data.id,
        };
        addExamSummary(json).then((res) => {
          this.$notify({
            message: res.msg,
            type: "success",
          });
        });
      },
    },
  };
</script>

<style lang="scss">
  .work-log {
    padding: 20px;
    box-sizing: border-box;

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
        background-color: #84af9b;
        color: #fff;

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
        padding-left: 20px;
        box-sizing: border-box;
        background-color: #aedd81;
      }
    }

    .wrap-preparation {
      width: 100%;
      height: 300px;
      position: relative;
      border: 2px #ccc solid;
      border-top: none;

      .preparation-title {
        width: 20%;
        height: 100%;
        text-align: center;
        border-right: 2px #ccc solid;
        float: left;
        background-color: #84af9b;
        color: #fff;

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
        background-color: #aedd81;

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
        background-color: #84af9b;
        color: #fff;

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
        background-color: #aedd81;

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
        background-color: #84af9b;
        color: #fff;

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
        background-color: #aedd81;

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
            background-color: greenyellow;
            // background-image: linear-gradient( to right, greenyellow , green);
            background: linear-gradient(to right, #bb313e25);

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
