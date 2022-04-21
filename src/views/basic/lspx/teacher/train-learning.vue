<template>
  <div class="train-learning">
    <div class="top-video">
      <div class="title">
        <h3>视频</h3>
      </div>
      <div class="video">
        <ndx-video
          ref="video"
          @realTimePush="realTimePush"
          :executeDocument="executeDocument"
          @executionFun="testQuestions"
        ></ndx-video>
      </div>
      <div class="jd">
        <span>学习进度: {{ rateOfIearning }}%</span>
      </div>
    </div>
    <div class="content">
      <h3>笔记上传</h3>
      <div>
        <el-upload
          :action="upload.imgUrl"
          :headers="upload.headers"
          list-type="picture-card"
          :on-preview="bjPreview"
          :on-remove="bjRemove"
          :on-success="bjSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </div>
      <div style="padding: 20px">
        <el-button type="primary" :disabled="!answerStatus" @click="saveSubimit"
          >保存</el-button
        >
      </div>
    </div>

    <el-dialog
      title="测试题"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="dialogFormVisible"
    >
      <div class="question-board">
        <ul>
          <li>
            <div v-for="(item, index) in videoQuestionData" :key="index">
              <div style="padding: 20px 0px">
                {{ ++index }}, {{ item.topic }}
              </div>
              <el-radio
                v-model="item[index]"
                @change="toAnswer(item[index], item.answer, index)"
                label="A"
                >A, {{ item.optionA }}</el-radio
              >
              <el-radio
                v-model="item[index]"
                @change="toAnswer(item[index], item.answer, index)"
                label="B"
                >B, {{ item.optionB }}</el-radio
              >
              <el-radio
                v-model="item[index]"
                @change="toAnswer(item[index], item.answer, index)"
                label="C"
                >C, {{ item.optionC }}</el-radio
              >
              <el-radio
                v-model="item[index]"
                @change="toAnswer(item[index], item.answer, index)"
                label="D"
                >D, {{ item.optionD }}</el-radio
              >
            </div>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="answerOver">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  learnRecordList,
  videoQuestionList,
  addLearnRecord,
  updateLearnRecord,
} from "@/api/basic/train-index";
import { getToken } from "@/utils/auth";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
export default {
  data() {
    return {
      executeDocument: {
        videoUrl: "",
        disabledProgress: true,
        stopTime: [],
      },
      dialogFormVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      radio: "1",
      videoQuestionData: [],
      answerStatus: false,
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
        imgUrl: process.env.VUE_APP_BASE_API + "/file/upload",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      learnRecordForm: {},
      rateOfIearning: 0,
    };
  },
  created() {
    this.studyList = JSON.parse(this.$route.query.list);
    selectFileList({ kzzd1: this.studyList.videoFileId }).then(async (res) => {
      // this.executeDocument.videoUrl = res.rows[0].url;
      this.executeDocument.videoUrl = `${
        process.env.VUE_APP_BASE_API
      }/file/play?fileId=${res.rows[0].id}&Authorization=${
        "Bearer " + getToken()
      }`;
    });
    learnRecordList({
      lsid: this.studyList.lsid,
      spid: this.studyList.spid,
      kzzd1: this.studyList.allocateId,
    }).then((res) => {
      this.answerStatus = true;
      if (res.rows.length > 0) {
        this.learnRecordForm = res.rows[0];
        if (this.learnRecordForm.spjd == "1") {
          this.executeDocument.disabledProgress = false;
        } else {
          this.executeDocument.disabledProgress = true;
        }
      }
    });
  },
  methods: {
    onUpdateLearnRecord() {
      this.learnRecordForm.spjd = "1";
      updateLearnRecord(this.learnRecordForm).then((res) => {
        console.log(res);
      });
    },
    testQuestions(data) {
      videoQuestionList({ trainVideoId: this.studyList.spid }).then((res) => {
        this.videoQuestionData = res.rows;
        if (this.videoQuestionData.length == 0) {
          this.onUpdateLearnRecord();
        } else {
          this.dialogFormVisible = true;
        }
      });
    },
    cancel() {
      this.dialogFormVisible = false;
    },
    answerOver() {
      let correctV = this.videoQuestionData.filter((val) => {
        if (val.correct) {
          return val;
        } else {
          return val;
        }
      });
      if (correctV.length == this.videoQuestionData.length) {
        this.onUpdateLearnRecord();
        this.dialogFormVisible = false;
      }
    },
    toAnswer(target, origin, index) {
      target = target.toLowerCase();
      origin = origin.toLowerCase();
      if (target == origin) {
        this.videoQuestionData[--index].correct = true;
        this.answerStatus = true;
      } else {
        this.videoQuestionData[--index].correct = false;
        this.answerStatus = false;
        this.dialogFormVisible = false;
        this.$refs.video.resetVideo();
        this.msgError("您的答题错误，需重新进行视频学习");
      }
    },
    bjPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    bjRemove(file, fileList) {
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
    bjSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.learnRecordForm.bjtpid || secretKey();
      this.learnRecordForm.bjtpid = data.kzzd1;
      addImg(data).then((res) => {
        file.id = res.data.id;
        this.msgSuccess("上传成功");
      });
    },
    realTimePush(data) {
      if (!data.targetDuration) {
        this.rateOfIearning;
        return;
      }
      this.rateOfIearning =
        (data.newCurrentTime / data.targetDuration).toFixed(2) * 100;
    },
    saveSubimit() {
      this.learnRecordForm.xxjd = this.rateOfIearning;
      this.learnRecordForm.lsid = this.studyList.lsid;
      this.learnRecordForm.spid = this.studyList.spid;
      this.learnRecordForm.lsxm = this.$store.state.user.nickName;
      this.learnRecordForm.kzzd1 = this.studyList.courseId;
      if (this.rateOfIearning < 100) {
        this.msgError("请先学习完视频");
        return;
      }
      if (!this.learnRecordForm.bjtpid) {
        this.msgError("请上传笔记");
        this.learnRecordForm.spjd = 1;
        return;
      }
      if (this.learnRecordForm.id) {
        updateLearnRecord(this.learnRecordForm).then((res) => {
          this.msgSuccess(res.msg);
          this.$router.go(-1);
        });
      } else {
        addLearnRecord(this.learnRecordForm).then((res) => {
          this.msgSuccess(res.msg);
          this.$router.go(-1);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.train-learning {
  padding: 40px;
  box-sizing: border-box;
  .top-video {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    padding: 10px 40px;
    padding-bottom: 20px;
    box-sizing: border-box;
    .title {
      margin: 20px 0px;
    }
    .video {
      width: 100%;
      height: 550px;
      // border: 2px solid #aaa;
      background: #eee;
    }
    .jd {
      margin-top: 20px;
    }
  }
  .content {
    width: 100%;
    height: 100%;
    border: 2px solid #eee;
    padding: 40px;
    box-sizing: border-box;
    margin-top: 50px;
  }
  .question-board {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #aaa;
    ul {
      list-style: none;
    }
  }
}
</style>
