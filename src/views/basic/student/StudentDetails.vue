<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="1">
      <template slot="title">
        <span style="margin-left: 20px;font-family: 微软雅黑;color: #00afff">学生基本信息</span>
      </template>
      <el-form class="wrap-el-form" ref="form" :model="form" label-width="80px">
        <el-col :span="3">
          <el-avatar
            shape="square"
            style="margin-left: 40px;margin-top: 25px"
            :size="100"
            :src="form.xstx"
          ></el-avatar>
        </el-col>
        <el-col :span="21">
          <div style="font-family: 微软雅黑">
            <span>{{form.xsxm}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>
              <dict-tag style="display: inline-block" :options="xbOptions" :value="form.xb" />
            </span>
            <el-divider direction="vertical"></el-divider>

            <span>{{form.rybjmc}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>原班级：{{form.ybj}}</span>
            <el-divider direction="vertical"></el-divider>

            <span>{{form.xqmc}}</span>
            <el-divider direction="vertical"></el-divider>

            <span>日语老师：{{rylsxm}}</span>

            <el-divider direction="vertical"></el-divider>
            <span>选科：{{form.xk}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>进班英语分数：{{form.yyfs}}</span>
          </div>
          <hr size="B5" width="80%" align="left" />
          <div style="font-family: 微软雅黑">
            <span>入班时间：{{form.rbsj}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>综合分数：{{form.zhfs}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>QQ号：{{form.qqh}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>学生电话：{{form.xsdh}}</span>
          </div>
          <hr size="B5" width="80%" align="left" />

          <div style="font-family: 微软雅黑">
            <span>家庭住址：{{form.jtzz}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>是否特长生：{{form.sftcs}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>家长姓名：{{form.jzxm}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>家长电话：{{form.jzdh}}</span>
          </div>
          <hr size="B5" width="80%" align="left" />

          <div style="font-family: 微软雅黑">
            <span>班主任姓名：{{form.bzrxm}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>班主任电话：{{form.bzrdh}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>退班时间：{{form.tbsj}}</span>
            <el-divider direction="vertical"></el-divider>
            <span>备注：{{form.remark}}</span>
            <el-divider direction="vertical"></el-divider>
          </div>
          <br />
        </el-col>
      </el-form>
    </el-collapse-item>
    <el-collapse-item name="4">
      <template slot="title">
        <span style="margin-left: 20px;font-family: 微软雅黑;color: #00afff">折线图</span>
      </template>
      <lineChart :query="form.xsbh " ref="chart1" />
    </el-collapse-item>
    <el-collapse-item name="3">
      <template slot="title">
        <span style="margin-left: 20px;font-family: 微软雅黑;color: #00afff">成绩统计</span>
      </template>
      <StudentDetailsChart :query="form.xsbh " ref="chart" />
    </el-collapse-item>
    <el-collapse-item name="2">
      <template slot="title">
        <span style="margin-left: 20px;font-family: 微软雅黑;color: #00afff">老师谈话</span>
      </template>
      <el-table border v-loading="loading" :data="teacherTalkList">
        <el-table-column type="selection" width="55" v-if="false" align="center" />
        <el-table-column label="id" align="center" v-if="false" prop="id" />
        <el-table-column label="老师姓名" align="center" prop="lsxm" />
        <el-table-column label="学生姓名" align="center" prop="xsxm" />
        <el-table-column label="谈话时间" align="center" prop="thsj" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.thsj, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="谈话原因" align="center" prop="thyy" />
        <el-table-column label="谈话内容" align="center" prop="thnr" />
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import StudentDetailsChart from "./StudentDetailsChart";
import lineChart from "./lineChart";
import {
  listStudent,
  getStudent,
  delStudent,
  addStudent,
  updateStudent
} from "@/api/basic/student";
import { listTeacherTalk } from "@/api/basic/teacherTalk";
import { getBjclass } from "@/api/basic/bjclass";

export default {
  name: "StudentDetails",
  data() {
    return {
      loading: false,
      activeNames: ["1", "2", "3"],
      form: {
        id: null,
        xstx: null,
        xqmc: null,
        ybj: null,
        ryb: null,
        rybjid: null,
        rbsj: null,
        tbsj: null,
        xsbh: null,
        xsxm: null,
        xb: "0",
        xk: null,
        yyfs: null,
        zhfs: null,
        qqh: null,
        xsdh: null,
        jtzz: null,
        sftcs: null,
        jzxm: null,
        jzdh: null,
        bzrxm: null,
        bzrdh: null,
        status: "1",
        remark: null,
        userId: null,
        uName: null,
        orgBh: null,
        orgName: null,
        dataOrder: null,
        addOrUpdateTime: null,
        kzzd1: null,
        kzzd2: null,
        kzzd3: null,
        kzzd4: null,
        kzzd5: null
      },
      // 日语老师姓名
      rylsxm: null,
      // 老师id
      lsid: null,
      // 性别字典
      xbOptions: [],
      // 是否特长生字典
      sftcsOptions: [],
      // 选科字典
      xkTypeOptions: [],
      // 老师谈话内容表格数据
      teacherTalkList: []
    };
  },
  created() {
    this.getDicts("sys_user_sex").then(response => {
      this.xbOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.sftcsOptions = response.data;
    });
    this.getDicts("xkType").then(response => {
      this.xkTypeOptions = response.data;
    });
  },
  components: {
    StudentDetailsChart,
    lineChart
  },
  mounted() {
    this.form.id = this.$route.params.id;
    this.getStudentRowId();
  },
  methods: {
    getStudentRowId() {
      getStudent(this.form.id).then(response => {
        this.form = response.data;
        if (this.form) {
          this.$nextTick(() => {
            this.$refs.chart.getChart();
            this.$refs.chart1.getChart();
          });
        }
        getBjclass(this.form.ryb).then(res => {
          this.rylsxm = res.data.lsxm;
          this.lsid = res.data.kzzd2;
          this.getTeacherTalkList(this.form.id);
        });
      });
    },
    /** 查询老师学生谈话列表 */
    getTeacherTalkList(id) {
      this.loading = true;
      listTeacherTalk({ xsid: id }).then(response => {
        this.teacherTalkList = response.rows;
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped>
</style>
