<template>
  <div class="add-curriculum">
    <div>
      <table style="width : 100%;" border="1" cellspacing="0">
        <tbody>
          <tr>
            <td class="tds">课程名称</td>
            <td>
              <el-input v-model="addCurriculumForm.curriculumName" placeholder="请输入内容"></el-input>
            </td>
          </tr>
          <tr>
            <td class="tds">所属视频类别</td>
            <td>
              <el-checkbox-group v-model="addCurriculumForm.videoTypeDtoList">
                <el-checkbox
                  @change="getVideoList"
                  :label="dict.dictValue"
                  v-for="(dict,index) in videoTypeOptions"
                  :key="index"
                >{{dict.dictLabel}}</el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
          <tr>
            <td class="tds">视频</td>
            <td>
              <el-checkbox-group v-model="addCurriculumForm.videoIdList">
                <el-checkbox
                  :label="dict.id"
                  v-for="(dict,index) in videoList"
                  :key="index"
                >{{dict.videoName}}</el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
          <tr>
            <td class="tds">
              课程介绍
              (选填）
            </td>
            <td>
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="addCurriculumForm.curriculumIntroduction"
              ></el-input>
            </td>
          </tr>
          <tr>
            <td class="tds"></td>
            <td>
              <el-button type="primary" @click="addCurriculumSubmit">提交</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { listTrainVideo } from "@/api/basic/trainVideo";
import {
  listCurriculum,
  getCurriculum,
  delCurriculum,
  saveCurriculumWithVideos,
  updateCurriculum,
  curriculumManage
} from "@/api/basic/curriculum";
export default {
  data() {
    return {
      addCurriculumForm: {
        videoTypeDtoList: [],
        videoIdList: []
      },
      videoTypeOptions: [],
      videoList: []
    };
  },
  created() {
    this.getDicts("videoType").then(response => {
      this.videoTypeOptions = response.data;
    });
    if (this.$route.query.name == "app-curriculum-index") {
      let result = JSON.parse(this.$route.query.list);
      let video = [],
        videoType = [];
      result.videoTypeDtoList.forEach(value => {
        video.push(value.dictValue);
      });
      result.videoList.forEach(value => {
        videoType.push(value.id);
      });
      this.addCurriculumForm = result;
      this.addCurriculumForm.videoTypeDtoList = video;
      this.addCurriculumForm.videoIdList = videoType;
      this.getVideoList();
    }
  },
  methods: {
    getVideoList() {
      listTrainVideo({
        videoTypeArr: this.addCurriculumForm.videoTypeDtoList
      }).then(res => {
        this.videoList = res.rows;
      });
    },
    addCurriculumSubmit() {
      let json = {
        ...this.addCurriculumForm
      };
      delete json.videoTypeDtoList;
      saveCurriculumWithVideos(json).then(res => {
        this.msgSuccess(res.msg);
        this.$router.go(-1);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.add-curriculum {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  th,
  td {
    padding: 40px;
  }
  .tds {
    width: 13%;
  }
}
</style>
