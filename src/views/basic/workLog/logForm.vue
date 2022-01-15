<template>
  <div class="work-log" ref="prent">
    <el-form ref="forms" :inline="true" label-width="80px">
      <el-form-item label="请选择班级" label-width="100px" v-if="!ifRoleHasPerms">
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
        <el-checkbox v-model="sfbrz" @change="chooseBrz" v-if="!ifRoleHasPerms">补日志</el-checkbox>
      </el-form-item>
      <el-form-item label="选择日期" v-if="showxzrq">
        <el-date-picker
          v-model="logTiem"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期时间"
          @change="onLogTime"
          :picker-options="pickerOptions0"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="新课复习" label-width="100px">
        <el-radio-group style="width: 200px" v-model="bkBcrz">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-tooltip class="item" effect="dark" content="请先填写课程" placement="top-start">
        <el-button type="primary" size="mini" :disabled="!ruleForm.id" @click="selectZfx">总复习</el-button>
      </el-tooltip>
    </el-form>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      v-if="ifForm"
    >
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
      <!-- 备课 -->
      <!-- <div class="wrap-preparation clearfix">
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
              <el-form-item label="备课内容" label-width="120px">
                <editor v-model="ruleForm.kzzd5" :item="items" :min-height="130"/>
              </el-form-item>
            </div>
            <div class="history-log-content">
              <el-form-item label="补充日志" label-width="120px">
                <editor v-model="ruleForm.bkBcrz" :item="items" :min-height="130"/>
              </el-form-item>
            </div>
            <div class="history-log-content">
              <el-form-item label="文件上传" label-width="120px">
                <div style="width : 280px">
                  <el-upload
                    ref="upload"
                    :limit="1"
                    :accept="upload.type"
                    :headers="upload.headers"
                    :action="upload.imgUrl"
                    :disabled="upload.isUploading"
                    :on-progress="addFileUploadProgress"
                    :before-upload="beforeAvatarUploadZIP"
                    :on-success="addFileSuccess"
                    :auto-upload="false"
                    drag>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                      将文件拖到此处，或
                      <em>点击上传</em>
                    </div>
                    <div
                      class="el-upload__tip"
                      style="color:red"
                      slot="tip"
                    >提示：仅允许导入"{{upload.type}}"格式文件！
                    </div>
                  </el-upload>
                  <div slot="footer" class="dialog-footer" v-if="getselectFileList.length == 0">
                    <el-button type="primary" @click="submitFileForm" :disabled="rzid == null">确 定</el-button>
                    <el-button @click="upload.open = false">取 消</el-button>
                  </div>
                  <div v-else style="text-align : center">文件已上传</div>
                </div>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>-->
      <!-- 是否辅导 -->
      <div class="in-class clearfix" v-if=" ruleForm.kc && bkBcrz == '0'">
        <div class="in-class-title clearfix">
          <span>{{ruleForm.kc.sxmc}}</span>
        </div>
        <div class="in-class-list">
          <div class="in-class-content">
            <ul>
              <li>
                <el-checkbox-group v-model="ruleForm.gxidList">
                  <el-checkbox
                    :label="itemname.id"
                    v-for="(itemname, index) in ruleForm.kcapList"
                    :key="index"
                  >{{itemname.jdmc}}</el-checkbox>
                </el-checkbox-group>
              </li>
            </ul>
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
              <div style="display : flex;align-items : center">
                <el-button type="primary" size="mini" @click="uploadVideo">视频上传</el-button>
                <div style="margin-left : 20px">
                  <p
                    style
                    v-for="(item,index) in ruleForm.spFileList"
                    :key="index"
                  >{{++index}} ) {{item.name}}</p>
                </div>
              </div>
              <li v-for="(item, index) in ruleForm.basicTeacherWorkLogLessonList" :key="index">
                <el-form-item :label="item.courseTypeName">
                  <el-input v-model="ruleForm.basicTeacherWorkLogLessonList[index].content"></el-input>
                </el-form-item>
              </li>
            </ul>
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
                  <el-select v-model="ruleForm.kzzd4" @change="ksmcChange" placeholder="请选择考试名称">
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
                  <el-select v-model="ruleForm.kzzd3" placeholder="不可选" :disabled="true">
                    <el-option
                      v-for="(item, index) in getExaminationType"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label-width="100px" label="考试状态" aria-disabled>
                  <el-select v-model="ruleForm.kzzd2" placeholder="不可选" :disabled="true">
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
                >导入成绩</el-button>
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
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
              </el-form-item>
              <div class="lsxm">
                <el-form-item label="未上传原因">
                  <el-input v-model="ruleForm.lsxm" placeholder="请输入原因"></el-input>
                </el-form-item>
              </div>
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
        </div>
      </div>
      <!-- 课中 -->
      <div class="in-class clearfix">
        <div class="in-class-title clearfix">
          <span>提交</span>
        </div>
        <div class="in-class-list">
          <div class="in-class-content" style="text-align : center">
            <el-button type="primary" v-prevent-re-click @click="sendOut">保存日志</el-button>
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
        :data="{ ksmc: getKsName, kslx: ruleForm.kzzd3, kssj: getKssj ,bjid: bjNameId,workLogId: rzid }"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-link type="info" style="font-size: 12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 考试成绩分析总结 -->
    <el-dialog title="考试分析总结" :close-on-click-modal="false" :visible.sync="kscjzj" width="60%">
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

    <el-dialog title="添加复习" :visible.sync="sffx">
      <fx-form :rzid="ruleForm.id" :bjid="bjNameId" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="sffx = false">取 消</el-button>
        <el-button type="primary" @click="saveSbmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="视频上传" :visible.sync="dialogUploadVideoisible">
      <div>
        <el-upload
          ref="uploadvideo"
          :headers="upload.headers"
          :action="upload.imgUrl"
          :on-progress="vHandleFileUploadProgress"
          :on-success="vHandleFileSuccess"
          :on-error="vHandleFileError"
          :auto-upload="false"
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="vsubmitFileForm">确 定</el-button>
        <el-button @click="dialogUploadVideoisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  workLogListQuery,
  addSave,
  updateBasicTeacherWorkLog,
  workLogTemplateQuery,
  workLogStatusQuery
} from "@/api/basic/basicTeacherWorkLog";
import { getToken } from "@/utils/auth";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
import {
  updateExaminationPaper,
  listExaminationPaper,
  getExaminationPaper
} from "@/api/basic/examinationPaper";
import { listBjclass } from "@/api/basic/bjclass";
import { listClassCourse } from "@/api/basic/classCourse";
import { addExamSummary } from "@/api/basic/examSummary";
import { homePageQuery } from "@/api/basic/basicTeacherWorkLog";
import { planIsFinish } from "@/api/basic/teachingReview";
import FxForm from "./fxForm";
export default {
  data() {
    return {
      sfbrz: null, // 是否补日志
      showxzrq: false, // 显示【选择日期】
      ifRoleHasPerms: false,
      ksmcdisable: false,
      enableBos: false,
      //日志集合
      ruleForm: {
        sendUserArr: [],
        gxidList: []
      },
      kcapList: [],
      ifsfyks: false,
      rules: {
        kczj: [{ required: true, message: "请填写课程日志", trigger: "blur" }]
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
        imgUrl: process.env.VUE_APP_BASE_API + "/file/upload"
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
      //是否上传文件
      getselectFileList: [],
      // 是否辅导
      bkBcrz: "0",
      // 是否复习
      sffx: false,
      dialogUploadVideoisible: false,
      formLoading:null,
      isLoad:false,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        }
      }
    };
  },
  components: {
    FxForm
  },
  created() {
    let dataRoleId = this.$store.state.user.dataRoleWeightId;
    if (dataRoleId != 50) {
      // 角色权重不等于50，表示该角色无权上传图片
      this.ifRoleHasPerms = true;
    }
    this.getDicts("kc_type").then(response => {
      this.kcType = response.data;
    });
    this.getDicts("examination_status").then(response => {
      this.getExaminationStatus = response.data;
    });
    this.getDicts("examination_type").then(response => {
      this.getExaminationType = response.data;
    });
    this.getConfigKey("zipFile").then(res => {
      this.upload.type = res.msg;
    });
  },
  mounted() {
    this.initBjClassList();
    this.initGetListExaminationPaper();
  },
  methods: {
    openFullScreen() {
      if(this.isLoad){
        this.formLoading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      }
    },
    //视频上传
    uploadVideo() {
      this.dialogUploadVideoisible = true;
    },
    // 文件上传中处理
    vHandleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 上传失败
    vHandleFileError(err, file, fileList) {},
    // 文件上传成功处理
    vHandleFileSuccess(response, file, fileList) {
      if (response.code == 200) {
        let data = response.data;
        data.kzzd1 = this.ruleForm.id;
        this.ruleForm.id = data.kzzd1;
        addImg(data).then(res => {
          file.id = res.data.id;
          this.dialogUploadVideoisible = false;
          this.getList();
        });
        this.msgSuccess("上传成功");
      } else {
        this.msgError("上传失败");
      }
      this.getList("false");
    },
    // 提交上传文件
    vsubmitFileForm() {
      this.$refs.uploadvideo.submit();
    },
    selectZfx() {
      // 判断该班级教学计划是否全部完成 完成才能点击
      planIsFinish(this.bjNameId).then(res => {
        if (1 === res.data) {
          this.sffx = true;
        } else {
          this.msgError("课程还未全部完成，无法进行复习！");
        }
      });
    },
    saveSbmit() {
      this.sffx = false;
    },
    initBjClassList() {
      // 获取班级信息
      listBjclass().then(res => {
        this.getListBjclass = res.rows;
        if (res.rows.length == 1) {
          this.isLoad=true
          this.openFullScreen()
          this.bjNameId = res.rows[0].id;
          this.getList();
        }else if(res.total>1){
          // 添加页面
          if (this.$route.params.id == ":id") {
            this.msgInfo("请手动选择班级！")
          }else{
            this.getList();
          }
        }else{
          this.msgError("请联系管理员分配班级！")
        }
      });
    },
    // 查询当前未上传的考试试卷
    initGetListExaminationPaper() {
      let json = {
        jwsjzt: "1", //教务试卷状态(0未发送1已发送)
        kzzd2: "9", //未上传的考卷
        bjid: this.bjNameId //班级
      };
      listExaminationPaper(json).then(res => {
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
      this.rzid = null;
    },
    // 获取课中课表信息
    getList($false) {
      // 当从主页面点击查看详情时跳转过来时
      if (this.$route.params.id && this.$route.params.id != ":id") {
        homePageQuery({ teacherWorkLogId: this.$route.params.id }).then(res => {
          if (res.rows[0].isRead == 1) {
            this.msgError("当前日志只能预览,不可编辑");
            this.$refs.prent.style.pointerEvents = "none";
          }
          this.bjNameId=res.rows[0].bjid
        });
        this.rzid = this.$route.params.id;
        workLogListQuery({ id: this.rzid }).then(res => {
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
        if(this.bjNameId){
          this.getWorkLogTemplateQuery($false);
        }
      }
    },
    // 填写日志进来的页面，需要根据班级id查询该班级启用的课表
    getWorkLogTemplateQuery($false) {
      if(!this.isLoad){
        this.isLoad=true
        this.openFullScreen()
      }
      this.initGetListExaminationPaper();
      if ($false == "false") return;
      this.getWorkLogStatusQuery();
    },
    // 查询日志状态(1:未填写,2:已填写未发送,3:已发送)
    getWorkLogStatusQuery() {
      this.getselectFileList = [];
      let json = {
        bjid: this.bjNameId,
        lsid: this.$store.state.user.glrid
      };
      for (let i = 0; i < this.getListBjclass.length; i++) {
        if (this.getListBjclass[i].id === this.bjNameId) {
          var rybjName = this.getListBjclass[i].rybjmc;
          this.bjName = rybjName;
        }
      }
      if (this.logTiem) {
        json.date = this.logTiem;
      }
      workLogStatusQuery(json).then(res => {
        switch (res.logStatus) {
          case 1:
            this.findTemplateQuery(json.date); // 查询课表的课中模板
            break;
          case 2:
            this.$confirm(`是否修改《${rybjName}》当前日志?`, "提示", {
              confirmButtonText: "返回主页",
              cancelButtonText: "修改日志",
              type: "warning"
            })
              .then(() => {
                this.skipToLogHomePage();
              })
              .catch(() => {
                this.getWorkLogListQuery(this.bjNameId, this.logTiem, res.rzid); // 查询已填写未发送的日志
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
                type: "warning"
              }
            )
              .then(() => {
                this.skipToLogHomePage();
              })
              .catch(() => {});
            break;
          default:
            this.findTemplateQuery(json.date); // 查询课表的课中模板
            this.files1 = [];
            this.files2 = [];
            break;
        }
        this.formLoading.close()
        this.isLoad=false
      });
    },
    // 查询课中的课表模板
    findTemplateQuery(date) {
      this.rzid = null;
      workLogTemplateQuery({
        bjid: this.bjNameId,
        date,
        lsid: this.$store.state.user.glrid
      }).then(res => {
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
      });
    },
    // 获取页面中参数配置的路由
    skipToLogHomePage() {
      this.getConfigKey("logHomePage").then(resp => {
        this.$router.push({ path: resp.msg });
      });
    },
    // 查询某一班级日志
    async getWorkLogListQuery(bjid, date, rzid) {
      if (!this.rzid) {
        if (!bjid) {
          this.$notify({
            message: "请选择班级和日期",
            type: "warning"
          });
          return;
        }
        this.ifForm = true;
        let json = {
          lsid: this.$store.state.user.glrid, // 老师id
          kzzd1: bjid, // 班级 id
          date: date // 时间
        };
        if (typeof json.date != "string" && json.date) {
          json.date =
            json.date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate();
        }
        this.ruleForm = json;
        workLogListQuery(json).then(res => {
          // 获取日志信息
          if (res.data.length != 0) {
            this.rzid = res.data[0].id;
            this.ruleForm.id = this.rzid;
            selectFileList({ kzzd1: this.rzid }).then(res => {
              if (200 == res.code) {
                this.getselectFileList = res.rows;
              }
            });
            if (res.data[0].kzzd4 != null && res.data[0].kzzd2 === "3") {
              this.ksmcdisable = true; //如果已保存考试信息并且上传则禁用下拉框
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
      } else {
        workLogListQuery({ id: rzid }).then(res => {
          // 获取日志信息
          if (res.data.length != 0) {
            this.rzid = res.data[0].id;
            this.ruleForm.id = this.rzid;
            selectFileList({ kzzd1: this.rzid }).then(res => {
              if (200 == res.code) {
                this.getselectFileList = res.rows;
              }
            });
            if (res.data[0].kzzd4 != null && res.data[0].kzzd2 === "3") {
              this.ksmcdisable = true; //如果已保存考试信息并且上传则禁用下拉框
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
      }
    },
    /** 导入按钮操作 */
    handleImport() {
      let obj = {
        ksfw: this.ruleForm.kzzd4,
        bjid: this.bjNameId
      };
      listExaminationPaper(obj).then(res => {
        if (res.rows[0].kzzd2 === "3") {
          this.$notify({
            message: "该成绩已上传,不可重复上传",
            type: "error"
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
        { bjid: this.bjNameId },
        `考试成绩-导入模板.xlsx`
      );
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 上传失败
    handleFileError(err, file, fileList) {},
    // 文件上传成功处理
    async handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      if (response.code == 200) {
        this.msgSuccess("上传成功");
        // 日志表变为上传状态
        let rzjson = {
          id: this.rzid,
          kzzd2: "3",
          kzzd3: this.ruleForm.kzzd3,
          //之所以不直接用this.ruleForm.kzzd4是因为上传后getListExaminationPaper就没有对应值了
          kzzd4: this.getKsName
        };
        updateBasicTeacherWorkLog(rzjson).then(res => {
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
      getExaminationPaper(value).then(res => {
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
      deleteImg(file.id).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "删除成功",
            type: "success"
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
          type: "error"
        });
        return;
      }
      let data = response.data;
      data.kzzd1 = this.ruleForm.jswsFile || secretKey();
      this.ruleForm.jswsFile = data.kzzd1;
      this.photoNum1 = fileList.length;
      addImg(data).then(res => {
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
      addImg(data).then(res => {
        file.id = res.data.id;
        this.ifPhotoLimit(this.photoNum2);
      });
    },
    // 图片限制判断
    ifPhotoLimit(num) {
      if (num >= this.maxPhotoNum) {
        this.$message({
          message: "最多上传 5 张图片",
          type: "warning"
        });
      } else {
        this.$message({
          message: "图片上传成功",
          type: "success"
        });
      }
    },
    // 查询照片
    selectPhotoList(glid, file) {
      let kzzdJson = {
        kzzd1: glid
      };
      selectFileList(kzzdJson).then(res => {
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
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.ruleForm.bkBcrz = this.bkBcrz;
          this.addWorkLog($if);
        } else {
          this.$notify({ message: "请先填写日志内容", type: "error" });
          return false;
        }
      });
    },
    // 第一次添加日志时， this.rzid为空
    addWorkLog($if) {
      $if = $if == "$if" ? true : false;
      this.ruleForm.kzzd1 = this.bjNameId;
      this.ruleForm.date = this.logTiem;
      this.ruleForm.lsid = this.$store.state.user.glrid;
      addSave(this.ruleForm).then(async res => {
        this.rzid = res.data.id;
        this.ruleForm.id = this.rzid;
        // if (!this.logTiem) {
        //   this.logTiem = new Date();
        // }
        await this.getWorkLogListQuery(
          this.bjNameId,
          this.logTiem,
          res.data.id
        );
        if (res.code == 200) {
          this.ifsfyks = false;
          if (this.ruleForm.kzzd4) {
            // 选择考试范围
            let jsonObj = {
              id: this.ruleForm.kzzd4,
              kzzd3: res.data.id
            };
            // 保存日志id到对应试卷
            await updateExaminationPaper(jsonObj);
          }
          if ($if) return;
          this.$notify({ message: "日志保存成功", type: "success" });
          this.skipToLogHomePage();
        }
      });
    },
    // 获取页面中参数配置的路由
    skipLogHome() {
      this.getConfigKey("logHomePage").then(resp => {
        this.router = resp.msg;
        this.$router.push({
          path: this.router
        });
      });
    },
    // 考试分析总结
    addKscjfxzj() {
      let json = {
        teacherWorklogId: this.rzid,
        examPaperId: this.ruleForm.kzzd4,
        ksfxzj: this.getKscjzj
      };
      addExamSummary(json).then(res => {
        if (res.code == 200) {
          this.$notify({
            message: res.msg,
            type: "success"
          });
          this.ruleForm.kzzd2 = "3";
          this.kscjzj = false;
        } else {
          this.$notify({
            message: res.msg,
            type: "error"
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
        type: "success"
      });
      data.kzzd1 = this.rzid;
      // 保存文件上传地址
      addFile(data).then(res => {});
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./logFormStyle.scss";
</style>
