<template>
  <div class="logDetails">
    <table style="width : 100%" border="1" cellspacing="0">
      <thead>
        <tr>
          <th></th>
          <th
            style="padding : 20px;box-sizing : border-box"
          >{{logItem.lsxm}} - {{logItem.bjmc}} - {{logItem.date}} - {{logItem.status}}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding : 20px;box-sizing : border-box; text-align : center">课程</td>
          <td style="padding : 20px;box-sizing : border-box; ">{{logItem.kczj}}</td>
        </tr>
<!--        <tr>
          <td style="padding : 20px;box-sizing : border-box; text-align : center">备课</td>
          <td style="padding : 20px;box-sizing : border-box;">
            <div>
              <el-button type="primary" @click="downloadBk(logItem.workLogId,logItem.bkljlx)">下载备课资料</el-button>
            </div>
            <br />
            <div>
              <h4>系统日志</h4>
              <div v-if="logItem.bkXtrz" v-html="logItem.bkXtrz"></div>
              <div v-else>暂无系统日志</div>
            </div>
            &lt;!&ndash; <div>
              <h4>备课内容</h4>
              <div v-if="logItem.bknr" v-html="logItem.bknr"></div>
              <div v-else>暂无备课内容</div>
            </div> &ndash;&gt;
            <div>
              <h4>补充日志</h4>
              <div v-if="logItem.bkBcrz" v-html="logItem.bkBcrz"></div>
              <div v-else>暂无补充日志</div>
            </div>
          </td>
        </tr>-->
        <tr>
          <td style="padding : 20px;box-sizing : border-box; text-align : center">课中</td>
          <td style="padding : 20px;box-sizing : border-box;">
            <ul>
              <li v-for="(item,index) in logItem.basicTeacherWorkLogLessonList" :key="index">
                <span style="line-height : 30px">{{item.courseTypeName}} :</span>
                <span style="line-height : 30px">{{item.content}}</span>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="padding : 20px;box-sizing : border-box; text-align : center">课后</td>
          <td style="padding : 20px;box-sizing : border-box;">{{logItem.khBcrz}}</td>
        </tr>
        <tr>
          <td style="padding : 20px;box-sizing : border-box; text-align : center">教室卫生</td>
          <td style="padding : 20px;box-sizing : border-box;">
            <div>
              <el-image
                style="width: 100px; height: 100px;margin : 30px"
                v-for="(item,index) in logItem.jszp"
                :key="index"
                :src="item.url"
                :preview-src-list="[item.url]"
              ></el-image>
            </div>
            <div>
              <div v-if="logItem.reason"> <el-input v-model="logItem.reason" placeholder="未上传原因" readonly></el-input>  </div>
              <el-radio v-model="logItem.ishg" label="1" @change="jianYan(true,logItem)">合格</el-radio>
              <el-radio v-model="logItem.ishg" label="0" @change="jianYan(false,logItem)">不合格</el-radio>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding : 20px;box-sizing : border-box; text-align : center">学生表现</td>
          <td style="padding : 20px;box-sizing : border-box;">
            <div>
              <el-image
                style="width: 100px; height: 100px;margin : 30px"
                v-for="(item,index) in logItem.xsbx"
                :key="index"
                :src="item.url"
                :preview-src-list="[item.url]"
              ></el-image>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { workLogQueryForEducational } from "@/api/basic/basicTeacherWorkLog";
import { updateClassroom,addClassroom } from "@/api/basic/classroom";
export default {
  data() {
    return {
      logId: "",
      logItem: {},
      kcType: []
    };
  },
  created() {
    this.getDicts("kc_type").then(response => {
      this.kcType = response.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.logId = this.$route.params.id;
      if (this.logId && this.logId != ":id") {
        workLogQueryForEducational(this.logId).then(res => {
          this.logItem = res.data;
          this.logItem.basicTeacherWorkLogLessonList.map((value, index) => {
            for (let i = 0; i < this.kcType.length; i++) {
              if (this.kcType[i].dictValue == value.courseType) {
                value.courseTypeName = this.kcType[i].dictLabel;
                this.logItem.basicTeacherWorkLogLessonList[index] = value;
              }
            }
          });
        });
      }
    },
    downloadBk(logId, bkljlx) {
      if (!bkljlx) {
        this.msgError("资料暂未上传");
        return;
      }
      this.download(
        "/file/filetable/download",
        {
          kzzd1: logId
        },
        `备课资料.${bkljlx}`
      );
    },
    jianYan(bol, logItem) {
      if (!logItem.classroomId){
        let jsonInsert = {
          ryb: logItem.bjid,
          rylsxm: logItem.lsid,
          kzzd1: logItem.workLogId,
          status: "",
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
      }else {
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

    }
  }
};
</script>

<style lang="scss" scoped>
.logDetails {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  ul {
    list-style: none;
  }
}
</style>
