<template>
  <div class="teacher-training-home-details">
    <table style="width : 100%;" border="1" cellspacing="0">
      <tbody>
        <tr>
          <td class="tds">姓名</td>
          <td>{{trainTeacherProcessData.lsxm}}</td>
        </tr>
        <tr>
          <td class="tds">培训时间</td>
          <td>{{ parseTime(trainTeacherProcessData.fpsj) }} 至 {{ parseTime(trainTeacherProcessData.wcsj) }}</td>
        </tr>
        <tr>
          <td class="tds">考试分数</td>
          <td></td>
        </tr>
        <tr>
          <td class="tds">高考试卷分数</td>
          <td>
            <span>{{trainTeacherProcessData.gksjfs}}</span>
          </td>
        </tr>
        <tr>
          <td class="tds">培训过程</td>
          <td>
            <div class="demo-image__preview">
              <el-image
                style="width: 100px; height: 100px"
                v-for="(img,index) in imageList"
                :key="index"
                :src="img.url"
                :preview-src-list="[img.url]"
              ></el-image>
            </div>
            <div>
              <video v-for="(img,index) in videoList" :key="index" :src="img.url"></video>
            </div>
          </td>
        </tr>
        <tr></tr>
        <tr>
          <td class="tds">笔记</td>
          <td>
            <!-- <el-form class="demo-form-inline">
              <el-form-item label="座位表" label-width="120px">
                <div class="demo-image__preview">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="url"
                    :preview-src-list="srcList"
                  ></el-image>
                </div>
              </el-form-item>
              <el-form-item label="备课规范" label-width="120px">
                <div class="demo-image__preview">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="url"
                    :preview-src-list="srcList"
                  ></el-image>
                </div>
              </el-form-item>
              <el-form-item label="早读" label-width="120px">
                <div class="demo-image__preview">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="url"
                    :preview-src-list="srcList"
                  ></el-image>
                </div>
              </el-form-item>
            </el-form>-->
            <div class="demo-image__preview" v-for="(item,index) in notesData" :key="index">
              <el-image
                style="width: 100px; height: 100px;margin-right : 10px"
                v-for="(img,j) in item.bjtpList"
                :key="j"
                :src="img.url"
                :preview-src-list="[img.url]"
              ></el-image>
            </div>
          </td>
        </tr>
        <tr>
          <td class="tds">备注</td>
          <td>
            <editor :min-height="300" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {
  trainTeacherProcess,
  notesList
} from "@/api/basic/teacher-training-completed";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
export default {
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        user: "",
        region: ""
      },
      total: 0,
      parentItem: {},
      trainTeacherProcessData: {},
      imageList: [],
      videoList: [],
      notesData: []
    };
  },
  created() {
    if (this.$route.query.list) {
      this.parentItem = JSON.parse(this.$route.query.list);
    }
    trainTeacherProcess({ lsid: this.parentItem.lsid }).then(res => {
      this.trainTeacherProcessData = res.rows[0];
      this.getImage(this.trainTeacherProcessData.tpid);
      this.getVideo(this.trainTeacherProcessData.spid);
      this.getNotesList(this.parentItem.lsid);
    });
  },
  methods: {
    getImage(tpid) {
      if (!tpid) return;
      selectFileList({ kzzd1: tpid }).then(res => {
        if (200 == res.code) {
          this.imageList = res.rows;
        }
      });
    },
    getVideo(spid) {
      if (!spid) return;
      selectFileList({ kzzd1: spid }).then(res => {
        if (200 == res.code) {
          this.getselectFileList = res.rows;
        }
      });
    },
    getNotesList(lsid) {
      notesList({ lsid }).then(res => {
        this.notesData = res.rows;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.teacher-training-home-details {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  th,
  td {
    padding: 40px;
  }
  .tds {
    width: 20%;
  }
}
</style>
