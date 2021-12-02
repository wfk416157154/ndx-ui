<template>
  <div class="train-learning">
    <div class="top-video">
      <div class="title">
        <h3>视频</h3>
      </div>
      <div class="video">
        <ndx-video ref="video" :executeDocument="executeDocument" @executionFun="demo"></ndx-video>
      </div>
      <div class="jd">
        <span>学习进度：0%</span>
      </div>
    </div>
    <div class="content">
      <h3>笔记上传</h3>
      <div>
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
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
            <p>
              <el-radio v-model="radio" label="1">高一</el-radio>
            </p>
          </li>
          <li>
            <p>
              <el-radio v-model="radio" label="2">高二</el-radio>
            </p>
          </li>
          <li>
            <p>
              <el-radio v-model="radio" label="3">高三</el-radio>
            </p>
          </li>
          <li>
            <p>
              <el-radio v-model="radio" label="4">高四</el-radio>
            </p>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="a">取 消</el-button>
        <el-button type="primary" @click="b">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      executeDocument: {
        videoUrl:
          "http://192.168.0.129:9300/statics/2021/11/25/视频-53b3361a.mp4",
        disabledProgress: false,
        stopTime: [5, 9]
      },
      dialogFormVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      radio: "1"
    };
  },
  created() {},
  methods: {
    demo(data) {
      console.log(data);
      this.dialogFormVisible = true;
      console.log(this.executeDocument.stopTime);
    },
    a() {
      this.$refs.video.resetVideo();
      this.dialogFormVisible = false;
    },
    b() {
      this.$refs.video.startPlaying();
      this.dialogFormVisible = false;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
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
