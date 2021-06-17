<template>
  <div class="work-log">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="clearfix" style="margin-bottom : 10px">
        <el-button style="float: right" type="primary" icon="el-icon-search" size="medium">查看工作日志</el-button>
      </div>
      <!-- 课程 -->
      <div class="wrap-log">
        <div class="curriculum-title">
          <span>课程 :</span>
        </div>
        <div class="log-content">
          <el-input
            resize="none"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 5}"
            placeholder="请输入内容"
            v-model="ruleForm.kczj"
          ></el-input>
        </div>
      </div>
      <!-- 备课 -->
      <div class="wrap-preparation clearfix">
        <div class="preparation-title">
          <span>备课 :</span>
        </div>
        <div class="preparation-list">
          <div class="wrap-history">
            <div class="history-log-content">
              <el-form-item label="系统生成的日志" label-width="120px">
                <el-input
                  resize="none"
                  disabled
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5}"
                  v-model="ruleForm.bkXtrz"
                ></el-input>
              </el-form-item>
            </div>
            <div class="history-log-content">
              <el-form-item label="补充日志" label-width="120px">
                <el-input
                  resize="none"
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5}"
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
          <span>课中 :</span>
        </div>
        <div class="in-class-list">
          <div class="in-class-content">
            <ul>
              <li v-for="(item,index) in ruleForm.basicTeacherWorkLogLessonList" :key="index">
                <el-form-item :label="item.courseTypeName">
                  <el-input v-model="ruleForm.basicTeacherWorkLogLessonList[index].content"></el-input>
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
          <span>课后 :</span>
        </div>
        <div class="preparation-list">
          <div class="wrap-history">
            <div class="history-log-content">
              <el-form-item label="系统生成的日志" label-width="120px">
                <el-input
                  resize="none"
                  disabled
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5}"
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
                  :autosize="{ minRows: 5, maxRows: 5}"
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
                  style="width : 200px"
                  @change="examinationStatus"
                  v-model="ruleForm.isExam"
                >
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div v-if="ifExamination" class="examination-upload">
              <div style="width : 50%; display: inline-block">
                <el-form-item label="考试状态">
                  <el-select v-model="ruleForm.kzzd2">
                    <el-option
                      v-for="(item,index) in getExaminationStatus"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="考试类型">
                  <el-select v-model="ruleForm.kzzd3">
                    <el-option
                      v-for="(item,index) in getExaminationType"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="考试名称">
                  <el-input style="width :90%" placeholder="请输入考试名称" v-model="ruleForm.kzzd4"></el-input>
                </el-form-item>
              </div>
              <div class="button">
                <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
              </div>
            </div>
          </div>
          <!-- 课堂照片 -->
          <div class="class-photos">
            <div>
              <el-form-item label-width="100px" label="教室卫生" prop="qtzs">
                <el-upload
                  :action="upload.fileUrl"
                  :headers="upload.headers"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :limit="maxPhotoNum"
                  :on-success="jswsSuccess"
                  :file-list="files1"
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
                  :action="upload.fileUrl"
                  :headers="upload.headers"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :limit="maxPhotoNum"
                  :on-success="xsbxSuccess"
                  :file-list="files2"
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
                :autosize="{ minRows: 4, maxRows: 4}"
                placeholder="请输入内容"
                v-model="ruleForm.remark"
              ></el-input>
            </el-form-item>
          </div>
          <!-- 发送到人 -->
          <div class="send-out">
            <h4>发送到人</h4>
            <el-select v-model="ruleForm.fsr" filterable multiple placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="sendOut">发送</el-button>
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
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { workLogListQuery, addSave } from "@/api/basic/basicTeacherWorkLog";
import { getToken } from "@/utils/auth";
import { addImg, selectFileList, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
export default {
  data() {
    return {
      //日志集合
      ruleForm: {},
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
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
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/basic/bjclass/importData",
        // 上传图片地址
        fileUrl: process.env.VUE_APP_BASE_API + "/file/upload"
      },
      // 教室图片
      dialogImageUrl: "",
      dialogVisible: false,
      // 是否有考试
      ifExamination: false,
      // 发送人
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
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
      photoNum2: 0
    };
  },
  created() {
    this.getDicts("kc_type").then(response => {
      this.kcType = response.data;
    });
    this.getDicts("examination_status").then(response => {
      this.getExaminationStatus = response.data;
    });
    this.getDicts("examination_type").then(response => {
      this.getExaminationType = response.data;
    });
    // this.getDicts("kh_log_type").then(response => {
    //   this.khLogType = response.data;
    // });
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取课中课表信息
    getList() {
      let json = {
        lsid: "202106158174553586164977e3534f46dba4673f3bbc6da884",
        kzzd1: "202106158170307455f835e6850ed84b93a019c65f4b0234c4"
      };
      workLogListQuery(json).then(res => {
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
      });
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "考试成绩导入";
      this.upload.open = true;
    },
    // 下载模板操作
    importTemplate() {
      this.download(
        "basic/teacherTalk/importTemplate",
        {
          ...this.queryParams
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
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    //是否有考试
    examinationStatus(value) {
      this.ifExamination = value ? true : false;
    },
    // 图片上传 大图
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
          message: "新增成功",
          type: "success"
        });
      }
    },
    // 查询照片
    selectPhotoList(glid, file) {
      let kzzdJson = {
        kzzd1: glid
      };
      // console.log(kzzdJson)
      selectFileList(kzzdJson).then(res => {
        // console.log(res);
        this.photoNum = res.total;
        this[file] = res.rows;
      });
    },
    // 发送
    sendOut() {
      addSave(this.ruleForm).then(res => {
        if (res.code == 200) {
          this.getList()
          this.$notify({
            title: "成功",
            message: "发送成功",
            type: "success"
          });
        }
      });
    }
  }
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
      span {
        line-height: 150px;
      }
    }
    .log-content {
      padding: 10px;
      box-sizing: border-box;
      float: right;
      width: 80%;
      height: 100%;
      padding-left: 20px;
      box-sizing: border-box;
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
      text-align: center;
      float: left;
      border-right: 2px #ccc solid;
      position: absolute;
      top: 0;
      bottom: 0;
      span {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        transform: translateX(-50%);
      }
    }
    .in-class-list {
      float: right;
      width: 80%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
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
      .wrap-examination {
        width: 100%;
        height: 100%;
        margin-bottom: 20px;
        .examination-text {
          float: left;
          width: 20%;
        }
        .examination-upload {
          width: 60%;
          height: 160px;
          float: right;
          background-color: #ccc;
          .button {
            display: inline-block;
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