<template>
  <div class="teacher-home">
    <div class="top-info">
      <ul style="list-style:none;" class="clearfix">
        <li class="class-wrap" v-for="(item,index) in pageList" :key="index">
          <img width="420px" height="280px" src="../../assets/images/67ba200c1c606bb9fcceee6cc0f8067.jpg" alt="">
        </li>
        <li class="class-wrap" v-for="(item,index) in pageList" :key="index">
          <h2 style="margin-top: 1px">{{item.rybjmc}}</h2>
          <p><span style="font-weight: bold">开班时间</span> : {{item.kbsj}}</p>
          <p><span style="font-weight: bold">开班人数</span> : {{item.bjrs}}</p>
          <p>
            <span style="font-weight: bold">教材</span> :{{item.jcmc}}
            <el-button style="margin-left: 44%" type="primary" icon="el-icon-date" @click="toPage('teacherTeachingHome',item.id)">教学计划</el-button>
          </p>
          <div>
            <p><span style="font-weight: bold">开班照</span></p>
            <div>
              <el-image
                v-for="(list,j) in item.kbzArr"
                :key="j"
                style="width: 50px; height: 50px;margin:5px"
                :src="list"
                :preview-src-list="item.kbzArr"
              ></el-image>
            </div>
            <p><span style="font-weight: bold">英语成绩</span></p>
            <div>
              <el-image
                v-for="(list,i) in item.jtzArr"
                :key="i"
                style="width: 50px; height: 50px;margin:5px"
                :src="list"
                :preview-src-list="item.jtzArr"
              ></el-image>
            </div>
          </div>
          <div>
            <el-button
              icon="el-icon-user"
              type="primary"
              @click="toPage('student',item.id)"
            >学生信息</el-button>
            <el-button
              icon="el-icon-s-custom"
              type="danger"
              @click="toPage('getSstugrade',item.id)"
            >学生成绩</el-button>
            <el-button
              icon="el-icon-s-grid"
              type="warning"
              @click="toPage('viewcCassCourseTeacher',item.id)"
            >班级课表</el-button>
            <el-button
              icon="el-icon-school"
              type="danger"
              @click="toPage('classPerformance',item.id)"
            >班级成绩</el-button>
          </div>
        </li>
        <li class="class-wrap">
          <h2 style="margin-top: 1px">通知</h2>
          <ul style="list-style:none; font-size:25px;">
            <li v-for="(item,index) in messageList" :key="index">
              <el-link
                v-if="item.messageStatus == 0 || item.messageStatus == 3 "
                type="danger"
                icon="el-icon-warning"
                @click="getMessageDetails(item.xxnr)"
              >{{statusFormat(item)}} -主题:{{item.xxbt}}-通知时间:{{item.createTime}}</el-link>
              <el-link
                v-else
                icon="el-icon-success"
                type="success"
                @click="getMessageDetails(item.xxnr)"
              >{{statusFormat(item)}} -主题:{{item.xxbt}}-通知时间:{{item.createTime}}</el-link>
            </li>
          </ul>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </li>
      </ul>
    </div>
    <div class="bottom-passageway">
      <h2>快速通道</h2>
      <div>
        <el-button icon="el-icon-edit" type="primary" @click="toPage('log')">填写工作日志</el-button>
        <el-button
          icon="el-icon-s-order"
          type="primary"
          @click="toPage('lessonPreparationHome')"
        >备课主页</el-button>
        <el-button icon="el-icon-s-promotion" type="warning" @click="toPage('teacherBx')">报销主页</el-button>
        <el-button icon="el-icon-document-copy" type="success" @click="toPage('applyPaper')">试卷管理</el-button>
        <el-button icon="el-icon-s-platform" type="success" @click="toPage('train-index')">培训管理</el-button>
        <el-button icon="el-icon-s-check" type="primary" @click="toPage('pybc-index')">培优补差</el-button>
        <el-button icon="el-icon-edit-outline" type="primary" @click="toPage('task-log-index')">作业日志</el-button>
        <el-button icon="el-icon-folder-opened" type="success" @click="toPage('jfzlFile')">教辅资料</el-button>
      </div>
    </div>

    <el-dialog title="消息查看" :visible.sync="dialogFormVisible">
      <div v-html="messageDetails"></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPageList, getMessageList } from "@/api/basic/teacher";
export default {
  data() {
    return {
      pageList: [],
      messageList: [],
      confirmOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 5
      },
      total: 0,
      messageDetails: "",
      dialogFormVisible: false
    };
  },
  created() {
    this.getDicts("confirmStatus").then(response => {
      this.confirmOptions = response.data;
    });
  },
  mounted() {
    this.getList();
  },
  computed: {},
  methods: {
    getList() {
      getPageList({ lsid: this.$store.state.user.glrid }).then(res => {
        this.pageList = res.rows;
      });
      getMessageList(this.queryParams).then(res => {
        this.messageList = res.rows;
        this.total = res.total;
      });
    },
    statusFormat(row) {
      return this.selectDictLabel(this.confirmOptions, row.messageStatus);
    },
    getMessageDetails(title) {
      this.messageDetails = title;
      this.dialogFormVisible = true;
    },
    toPage(path, bjid) {
      this.getConfigKey(path).then(res => {
        this.$router.push({
          path: res.msg,
          query: {
            bjid
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.teacher-home {
  width: 100%;
  height: 100%;
  .top-info {
    .class-wrap {
      width: 40%;
      height: 100%;
      border: 2px solid #aaa;
      padding: 10px;
      float: left;
      margin-left: 20px;
    }
  }
  .bottom-passageway {
    padding: 40px;
    box-sizing: border-box;
  }
}
</style>
