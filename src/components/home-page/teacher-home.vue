<template>
  <div class="teacher-home">
    <div class="top-info">
      <ul style="list-style:none;" class="clearfix">
        <li class="class-wrap" v-for="(item,index) in pageList" :key="index">
          <h3>{{item.rybjmc}}</h3>
          <p>开班时间 : {{item.kbsj}}</p>
          <p>开班人数 : {{item.bjrs}}</p>
          <p>
            教材 :
            <el-link type="success" @click="toPage('teacherTeachingHome',item.id)">教学计划</el-link>
          </p>
          <div>
            <p>开班照</p>
            <div>
              <el-image
                v-for="(list,j) in item.kbzArr"
                :key="j"
                style="width: 50px; height: 50px;margin:5px"
                :src="list"
                :preview-src-list="item.kbzArr"
              ></el-image>
            </div>
            <p>英语成绩</p>
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
            <el-link
              style="margin-right:10px"
              type="success"
              @click="toPage('student',item.id)"
            >学生信息</el-link>
            <el-link
              style="margin-right:10px"
              type="success"
              @click="toPage('getSstugrade',item.id)"
            >学生成绩</el-link>
            <el-link
              style="margin-right:10px"
              type="success"
              @click="toPage('viewcCassCourseTeacher',item.id)"
            >班级课表</el-link>
            <el-link
              style="margin-right:10px"
              type="success"
              @click="toPage('classPerformance',item.id)"
            >班级成绩</el-link>
          </div>
        </li>
        <li class="class-wrap">
          <h2>通知</h2>
          <ul style="list-style:none;">
            <li v-for="(item,index) in messageList" :key="index">
              <p
                style="cursor: pointer;"
                @click="getMessageDetails(item.xxnr)"
              >{{statusFormat(item)}} {{item.createTime}}</p>
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
        <el-link style="margin-right:10px" type="success" @click="toPage('log')">填写工作日志</el-link>
        <el-link
          style="margin-right:10px"
          type="success"
          @click="toPage('lessonPreparationHome')"
        >备课</el-link>
        <el-link style="margin-right:10px" type="success" @click="toPage('teacherBx')">报销</el-link>
        <el-link style="margin-right:10px" type="success" @click="toPage('applyPaper')">试卷管理</el-link>
        <el-link style="margin-right:10px" type="success" @click="toPage('train-index')">培训管理</el-link>
        <el-link style="margin-right:10px" type="success" @click="toPage('pybc-index')">培优补差</el-link>
        <el-link style="margin-right:10px" type="success" @click="toPage('task-log-index')">作业日志</el-link>
        <el-link style="margin-right:10px" type="success" @click="toPage('jfzlFile')">教辅资料</el-link>
      </div>
    </div>

    <el-dialog title="消息" :visible.sync="dialogFormVisible">
      <div v-html="messageDetails"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
      width: 30%;
      height: 100%;
      border: 1px solid #aaa;
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
