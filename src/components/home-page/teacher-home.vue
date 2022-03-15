<template>
  <div class="teacher-home">
    <div class="top-info">
      <div style="display: flex; justify-content: space-between">
        <div class="class-wrap">
          <img
            width="420px"
            height="280px"
            src="../../assets/images/67ba200c1c606bb9fcceee6cc0f8067.jpg"
            alt=""
          />
        </div>
        <div class="class-wrap">
          <h2 style="margin-top: 1px">通知</h2>
          <ul style="list-style: none; font-size: 25px">
            <li v-for="(item, index) in messageList" :key="index">
              <el-link
                v-if="item.messageStatus == 0 || item.messageStatus == 3"
                type="danger"
                icon="el-icon-warning"
                @click="getMessageDetails(item.xxnr)"
                >{{ statusFormat(item) }} -主题:{{ item.xxbt }}-通知时间:{{
                  item.createTime
                }}</el-link
              >
              <el-link
                v-else
                icon="el-icon-success"
                type="success"
                @click="getMessageDetails(item.xxnr)"
                >{{ statusFormat(item) }} -主题:{{ item.xxbt }}-通知时间:{{
                  item.createTime
                }}</el-link
              >
            </li>
          </ul>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </div>
      <ul style="list-style: none" class="clearfix">
        <li class="class-wrap" v-for="(item, index) in pageList" :key="index">
          <h2 style="margin-top: 1px">
            {{ item.rybjmc }} &nbsp;&nbsp;&nbsp; 当前课程 : {{ item.dqkcmc }}
          </h2>
          <div
            style="display: flex;align-items:center;justify:content:space-between"
          >
            <div style="margin-right: 40px">
              <span style="font-weight: bold">开班时间</span> : {{ item.kbsj }}
            </div>
            <div style="margin-right: 40px">
              <span style="font-weight: bold">开班人数</span> : {{ item.bjrs }}
            </div>
            <div style="display: flex; margin-right: 40px">
              <span style="font-weight: bold">教材</span> : {{ item.jcmc }}
            </div>
            <div style="display: flex; margin-right: 40px">
              <p><span style="font-weight: bold">开班照</span></p>
              <div>
                <el-image
                  v-for="(list, j) in item.kbzArr"
                  :key="j"
                  style="width: 50px; height: 50px; margin: 5px"
                  :src="list"
                  :preview-src-list="item.kbzArr"
                ></el-image>
              </div>
              <p>
                <span style="font-weight: bold; margin-left: 40px"
                  >英语成绩</span
                >
              </p>
              <div>
                <el-image
                  v-for="(list, i) in item.jtzArr"
                  :key="i"
                  style="width: 50px; height: 50px; margin: 5px"
                  :src="list"
                  :preview-src-list="item.jtzArr"
                ></el-image>
              </div>
            </div>
          </div>
          <div>
            <el-button
              icon="el-icon-user"
              type="primary"
              @click="toPage('student', item.id)"
              >学生信息</el-button
            >
            <el-button
              icon="el-icon-s-custom"
              type="danger"
              @click="toPage('getSstugrade', item.id)"
              >学生成绩</el-button
            >
            <el-button
              icon="el-icon-s-grid"
              type="warning"
              @click="toPage('viewcCassCourseTeacher', item.id)"
              >班级课表</el-button
            >
            <el-button
              icon="el-icon-school"
              type="danger"
              @click="toPage('classPerformance', item.id)"
              >班级成绩</el-button
            >
            <el-button
              style="margin-left: 20px"
              type="primary"
              icon="el-icon-date"
              @click="toPage('teacherTeachingHome', item.id)"
              >教学计划</el-button
            >
          </div>
          <div>
            <IndexProgress
              :propressItem="getHomePageClassTeachingPlan(item.id)"
            />
          </div>
        </li>
      </ul>
    </div>
    <div class="bottom-passageway">
      <h2>快速通道</h2>
      <div>
        <el-button icon="el-icon-edit" type="primary" @click="toPage('log')"
          >填写工作日志</el-button
        >
        <el-button
          icon="el-icon-s-order"
          type="primary"
          @click="toPage('lessonPreparationHome')"
          >备课主页</el-button
        >
        <el-button
          icon="el-icon-s-promotion"
          type="warning"
          @click="toPage('teacherBx')"
          >报销主页</el-button
        >
        <el-button
          icon="el-icon-document-copy"
          type="success"
          @click="toPage('applyPaper')"
          >试卷管理</el-button
        >
        <el-button
          icon="el-icon-s-platform"
          type="success"
          @click="toPage('train-index')"
          >培训管理</el-button
        >
        <el-button
          icon="el-icon-s-check"
          type="primary"
          @click="toPage('pybc-index')"
          >培优补差</el-button
        >
        <el-button
          icon="el-icon-edit-outline"
          type="primary"
          @click="toPage('task-log-index')"
          >作业日志</el-button
        >
        <el-button
          icon="el-icon-folder-opened"
          type="success"
          @click="toPage('jfzlFile')"
          >教辅资料</el-button
        >
      </div>
    </div>

    <el-dialog title="消息查看" :visible.sync="dialogFormVisible">
      <div v-html="messageDetails"></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false"
          >关闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPageList,
  getMessageList,
  homePageClassTeachingPlan,
} from "@/api/basic/teacher";
import IndexProgress from "@/components/ndx-progress";
export default {
  data() {
    return {
      pageList: [],
      messageList: [],
      confirmOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 5,
      },
      total: 0,
      messageDetails: "",
      dialogFormVisible: false,
    };
  },
  components: {
    IndexProgress,
  },
  created() {
    this.getDicts("confirmStatus").then((response) => {
      this.confirmOptions = response.data;
    });
    this.getList();
  },
  mounted() {},
  computed: {},
  methods: {
    getList() {
      getPageList({ lsid: this.$store.state.user.glrid }).then((res) => {
        this.pageList = res.rows;
        // console.log(this.pageList);
      });
      getMessageList(this.queryParams).then((res) => {
        this.messageList = res.rows;
        this.total = res.total;
      });
    },
    getHomePageClassTeachingPlan(id) {
      // let result =  homePageClassTeachingPlan(id);
      // console.log(result);
      return homePageClassTeachingPlan(id);
    },
    statusFormat(row) {
      return this.selectDictLabel(this.confirmOptions, row.messageStatus);
    },
    getMessageDetails(title) {
      this.messageDetails = title;
      this.dialogFormVisible = true;
    },
    toPage(path, bjid) {
      this.getConfigKey(path).then((res) => {
        this.$router.push({
          path: res.msg,
          query: {
            bjid,
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.teacher-home {
  width: 100%;
  height: 100%;
  .top-info {
    .class-wrap {
      width: 95%;
      height: 100%;
      border: 2px solid #aaa;
      padding: 40px;
      box-sizing: border-box;
      float: left;
      margin-left: 20px;
    }
    .class-wrap-img {
      // widows: ;
    }
  }
  .bottom-passageway {
    padding: 40px;
    box-sizing: border-box;
  }
}
</style>
