<template>
  <div class="Log-home-page">
    <el-form ref="queryForm" :inline="true" :model="queryParams">
      <el-form-item label="校区" v-if="xqIsShow" prop="xqid">
        <el-select v-model="queryParams.xqid" filterable @change="getSchoolId" placeholder="请选择校区">
          <el-option
            v-for="(item,index) in getListSchool"
            :label="item.xxmc"
            :value="item.id"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日语班级" prop="rybid">
        <el-select v-model="queryParams.rybid" filterable placeholder="请选择班级">
          <el-option
            v-for="(item,index) in getBjClass"
            :label="item.rybjmc"
            :value="item.id"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师姓名" prop="lsxm">
        <el-input v-model="queryParams.lsxm" placeholder="请输入老师姓名"></el-input>
      </el-form-item>
      <el-form-item label="日志日期" prop="sj">
        <el-date-picker
          v-model="queryParams.sj"
          type="daterange"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="排序方式" prop="orderChoose">
        <el-radio v-model="queryParams.orderChoose" label="0" border @change="getList">升序</el-radio>
        <el-radio v-model="queryParams.orderChoose" label="1" border @change="getList">倒序</el-radio>
      </el-form-item>

      <el-form-item label="选项" prop="isRead">
        <el-radio v-model="queryParams.isRead" label="0" border @change="getList">未读</el-radio>
        <el-radio v-model="queryParams.isRead" label="1" border @change="getList">已读</el-radio>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button type="primary" icon="el-icon-download" disabled @click="handleExport">导出日志</el-button>
      <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>

      <!--<el-button
        type="success"
        icon="el-icon-plus"
        v-has-role="['teacher']"
        @click="toDetails(':id')"
      >填写日志</el-button>-->
    </el-form>
    <div class="wrap-log-list">
      <ul>
        <li v-for="(item,index) in allLogs" :key="index">
          <div class="personal-information __float">
            <div class="personal-information-content">
              <div class="information-box">
                <span>姓名 :</span>
                <span>{{item.lsxm}}</span>
              </div>
            </div>
            <div class="personal-information-content">
              <div class="information-box">
                <span>日语班级 :</span>
                <span>{{item.rybjmc}}</span>
              </div>
            </div>
            <div class="personal-information-content">
              <div class="information-box">
                <span>校区 :</span>
                <span>{{item.xxmc}}</span>
              </div>
            </div>
          </div>
          <div class="log-information __float">
            <div class="log-header">
              <div class="log-header-left __float">
                <span>日期 :</span>
                <span>{{item.date}}</span>
              </div>
              <div class="log-header-right __float" v-if="dataRoleWeightId > 50">
                <el-tag type="success" v-if="item.isRead == '0'">未读</el-tag>
                <el-tag type="info" v-if="item.isRead == '1'">已读</el-tag>
              </div>
            </div>
            <div class="title-content">
              <span>工作日志</span>
            </div>
            <div>
              <span>课程内容 :</span>
              <span>{{item.kczj}}</span>
            </div>
            <div>
              <span>课中内容 :</span>
              <span v-for="(list,j) in item.teacherWorkLogLessonList" :key="j">{{list.content}}</span>
              <br />
            </div>
            <div>
              <span>课后内容 :</span>
              <span>{{item.khBcrz}}</span>
            </div>
            <div class="button">
              <el-button
                type="success"
                :disabled="item.spFileList == null || item.spFileList.length == 0"
                @click="toFileVideo(item.spFileList)"
              >视频</el-button>
              <el-button type="warning" plain @click="toDetails(item.teacherWorkLogId)">查看详情</el-button>
              <el-button type="success" plain @click="downloadZipFile(item.teacherWorkLogId)">下载压缩包</el-button>
            </div>
          </div>
          <div class="img-list __float">
            <div class="jswsImg">
              <div class="img-item" v-for="(jsImgList,key) in item.jswsFileList" :key="key">
                <el-image
                  style="width : 100%"
                  :src="jsImgList.wjlj"
                  :preview-src-list="item.jswsImg"
                ></el-image>
              </div>
              <el-radio
                v-if="dataRoleWeightId > 50"
                v-model="item.isJswsHg"
                label="1"
                @change="jianYan(true,item)"
              >合格</el-radio>
              <el-radio
                v-if="dataRoleWeightId > 50"
                v-model="item.isJswsHg"
                label="0"
                @change="jianYan(false,item)"
              >不合格</el-radio>
            </div>
            <div class="xsbxImg">
              <div class="img-item" v-for="(xsImgList,key) in item.xsbxFileList" :key="key">
                <el-image style="width : 100%" :src="xsImgList.url" :preview-src-list="xsbxImg"></el-image>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog title="视频" :visible.sync="dialogVideoFileVisible">
      <div class="wrap-box">
        <div class="left-list">
          <ul>
            <li v-for="(item,index) in videoList" :key="index">
              <el-link @click="getVideoUrl(item.url)" type="primary">{{++index}} ) {{item.name}}</el-link>
            </li>
          </ul>
        </div>
        <div class="video-box">
          <video
            width="100%"
            ref="video"
            height="100%"
            :src="videoUrl"
            autoplay="autoplay"
            style="opacity: 1;"
            controls
          ></video>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelVideo">取 消</el-button>
        <el-button type="primary" @click="cancelVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listSchool } from "@/api/basic/school";
import { listBjclass } from "@/api/basic/bjclass";
import { selectFileList } from "@/api/tool/common";
import {
  homePageQuery,
  updateBasicTeacherWorkLog
} from "@/api/basic/basicTeacherWorkLog";
import { updateClassroom, addClassroom } from "@/api/basic/classroom";
import { getVideo } from "@/api/tool/common";
export default {
  data() {
    return {
      //是否显示校区
      xqIsShow: true,
      dataRoleWeightId: null,
      dialogVideoFileVisible: false,
      // 查询条件
      queryParams: {
        pageNum: 1,
        pageSize: 50,
        orderChoose: null,
        isRead: null,
        xqid: null,
        rybid: null,
        lsxm: null,
        sj: []
      },
      // 总条数
      total: 0,
      // 校区
      getListSchool: [],
      // 班级
      getBjClass: [],
      // 学生表现图片预览
      //所有日志
      allLogs: [],
      // session键、保存的查询参数
      sessionKey: "logHomePageQueryParams",
      videoUrl: "",
      videoList: []
    };
  },
  created() {
    listBjclass().then(res => {
      this.getBjClass = res.rows;
      if (res.rows.length == 1) {
        this.queryParams.rybid = res.rows[0].id;
      }
    });
  },
  mounted() {
    this.getSchool();
    this.dataRoleWeightId = this.$store.state.user.dataRoleWeightId;
    let obj = sessionStorage.getItem(this.sessionKey);
    if (null != obj) {
      this.queryParams = JSON.parse(obj);
    }
    this.getList();
  },
  methods: {
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.getList();
    },
    // 获取校区
    getSchool() {
      listSchool().then(res => {
        this.getListSchool = res.rows;
        if (res.code == 200 && res.rows.length == 1) {
          this.queryParams.xqid = res.rows[0].id;
          this.xqIsShow = false;
        }
      });
    },
    // 查询日志
    getList() {
      if (null != this.queryParams.sj && this.queryParams.sj.length == 2) {
        let dateArr = [];
        this.queryParams.sj.forEach(date => {
          if (date.toString().indexOf("-") < 0) {
            // 如果是未格式化的时间则进行格式化
            dateArr.push(
              date.getFullYear() +
                "-" +
                this.addZero(date.getMonth() + 1) +
                "-" +
                this.addZero(date.getDate())
            );
          } else {
            // 如果是已格式化的日期则直接添加到字符串类型的日期数组中
            dateArr.push(date);
          }
        });
        this.queryParams.sj = dateArr;
      }
      homePageQuery(this.queryParams).then(response => {
        this.allLogs = response.rows;
        this.total = response.total;
        if (this.allLogs.length == 0) {
          this.allLogs = null;
          return;
        }
        this.allLogs.forEach(value => {
          value.jswsImg = [];
          value.xsbxImg = [];
          if(value.jswsFileList){
            value.jswsFileList.forEach(img => {
              value.jswsImg.push(img.url);
            });
          }
          if(value.xsbxFileList) {
            value.xsbxFileList.forEach(img => {
              value.xsbxImg.push(img.url);
            });
          }
        });
      });
    },
    // 小于10则补0
    addZero(num) {
      if (num < 10) {
        return "0" + num;
      }
      return num;
    },
    // 获取班级
    getSchoolId(schoolId) {
      this.queryParams.rybid = null;
      listBjclass({ kzzd1: schoolId }).then(res => {
        this.getBjClass = res.rows;
        if (res.rows.length == 1) {
          this.queryParams.rybid = res.rows[0].id;
        }
      });
    },
    jianYan(bol, logItem) {
      if (!logItem.classroomId) {
        let jsonInsert = {
          ryb: logItem.bjid,
          rylsxm: logItem.lsid,
          kzzd1: logItem.teacherWorkLogId,
          status: ""
        };
        if (bol) {
          jsonInsert.status = 1;
        } else {
          jsonInsert.status = 0;
        }
        addClassroom(jsonInsert).then(res => {
          if (res.code == 200) {
            this.getList();
            this.msgSuccess("操作成功");
          }
        });
      } else {
        let json = {
          status: "",
          id: logItem.classroomId
        };
        if (bol) {
          json.status = 1;
        } else {
          json.status = 0;
        }
        updateClassroom(json).then(res => {
          if (res.code == 200) {
            this.getList();
            this.msgSuccess("操作成功");
          }
        });
      }
    },
    // 导出按钮操作
    handleExport() {
      this.download(
        "basic/teacher/export",
        {
          ...this.queryParams
        },
        `basic_teacher.xlsx`
      );
    },
    // 跳转到日志详情页面
    toDetails(id) {
      sessionStorage.setItem(this.sessionKey, JSON.stringify(this.queryParams));
      if (this.$store.state.user.dataRoleWeightId > 50) {
        if (
          this.$store.state.user.dataRoleWeightId == 80 ||
          this.$store.state.user.dataRoleWeightId == 90
        ) {
          updateBasicTeacherWorkLog({ id: id, isRead: 1 });
        }
        // 获取页面中参数配置的路由
        this.getRout("jwLogDetails", id);
      } else {
        // 获取页面中参数配置的路由
        this.getRout("worklogDetail", id);
      }
    },
    getRout(key, id) {
      this.getConfigKey(key).then(resp => {
        this.router = resp.msg;
        this.$router.push({
          path: this.router + id
        });
      });
    },
    downloadZipFile(id) {
      let param = {
        kzzd1: id
      };
      // 查询文件表的文件名称
      selectFileList(param).then(res => {
        if (200 == res.code) {
          if (res.rows.length > 0) {
            this.download("file/filetable/download", param, res.rows[0].name);
          } else {
            this.msgError("未上传压缩文件！");
          }
        }
      });
    },
    toFileVideo(sp) {
      this.videoList = sp;
      this.dialogVideoFileVisible = true;
      this.videoUrl = "";
    },
    getVideoUrl(url) {
      this.videoUrl = url;
    },
    cancelVideo() {
      this.dialogVideoFileVisible = false;
    }
  }
};
</script>

<style lang="scss">
.Log-home-page {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: block;
  overflow-wrap: break-word;
  line-height: 20px;

  .wrap-log-list {
    width: 100%;
    height: 100%;

    ul {
      width: 100%;
      height: 100%;

      li {
        list-style: none;
        width: 100%;
        height: 200px;
        // color: #fff;
        color: #000;
        margin-bottom: 20px;
        border: 1px #000 solid;
        // background-image: linear-gradient(to right, #ff9569 0%, #e92758 100%);
        .__float {
          float: left;
        }

        .personal-information {
          width: 20%;
          height: 100%;
          padding: 20px;
          box-sizing: border-box;

          .personal-information-content {
            width: 100%;
            height: 33%;
            font-size: 14px;
            position: relative;

            .information-box {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              line-height: 100%;

              span {
                line-height: 20px;
              }
            }
          }
        }

        .log-information {
          width: 50%;
          height: 100%;
          padding: 10px;
          box-sizing: border-box;
          border-left: 2px #eee solid;
          border-right: 2px #eee solid;
          //   background-color: aquamarine;
          font-size: 14px;
          position: relative;

          .log-header {
            width: 100%;
            height: 40px;

            .log-header-left {
              width: 90%;
              height: 100%;
              line-height: 40px;
            }

            .log-header-right {
              width: 10%;
              line-height: 40px;
            }
          }

          .title-content {
            width: 100%;
            height: 30px;

            span {
              line-height: 30px;
            }
          }

          .button {
            position: absolute;
            right: 10px;
            bottom: 10px;
          }
        }

        .img-list {
          width: 30%;
          height: 100%;
          padding: 16px;
          box-sizing: border-box;

          .jswsImg {
            width: 100%;
            height: 50%;
            cursor: pointer;
            // position: relative;
            .img-item {
              width: 15%;
              // height: 100px;
              float: left;
              margin: 5px;
              //   position: absolute;
              //   top: 50%;
              //   transform: translateY(-50%);
            }
          }

          .xsbxImg {
            width: 100%;
            height: 50%;
            cursor: pointer;
            // position: relative;
            .img-item {
              width: 15%;
              // height: 100px;
              float: left;
              margin: 5px;
              //   position: absolute;
              //   top: 50%;
              //   transform: translateY(-50%);
            }
          }
        }
      }
    }
  }
}
.wrap-box {
  display: flex;
  .left-list {
    width: 50%;
    ul {
      list-style: none;
    }
  }
  .video-box {
    width: 50%;
  }
}
</style>
