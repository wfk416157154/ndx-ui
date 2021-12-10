<template>
  <div class="lesson-preparation-statistics">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="视频培训" name="first">
        <el-form ref="form" :model="queryParams" :inline="true" label-width="80px">
          <el-form-item label="课程名称">
            <el-select v-model="queryParams.courseName" filterable placeholder="请选择老师">
              <el-option
                v-for="item in listCurriculum"
                :key="item.id"
                :label="item.curriculumName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="进度">
            <el-select v-model="queryParams.spjd" placeholder="请选择活动区域">
              <el-option
                v-for="dict in prepareStatsProgress"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="applyComplete">申请完成培训</el-button>
          </el-form-item>
        </el-form>
        <el-table border :data="videoList" style="width: 100%;font-size : 18px">
          <el-table-column label="课程名称" prop="courseName" />
          <el-table-column label="视频名称" prop="videoName" />
          <el-table-column label="分配时间" prop="fpsj">
            <template slot-scope="scope">{{parseTime(scope.row.fpsj,"{y}-{m}-{d}")}}</template>
          </el-table-column>
          <el-table-column label="完成时间" prop="wcsj">
            <template slot-scope="scope">{{parseTime(scope.row.wcsj,"{y}-{m}-{d}")}}</template>
          </el-table-column>
          <el-table-column label="视频进度" prop="spjd" />
          <el-table-column label="操作" width="400px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleViews(scope.row)">学习</el-button>
              <el-button size="mini" type="success" @click="handleNotice(scope.row)">查看笔记</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="onSubmit"
        />
      </el-tab-pane>

      <el-tab-pane label="考试" name="second">
        <el-table border :data="listDataStatisticsQuery" style="width: 100%;font-size : 18px">
          <el-table-column label="班级" prop="rybjmc" />
          <el-table-column label="老师姓名" prop="lsxm" />
          <el-table-column label="教案数量/合格/不合格/优秀" prop="sftxkb">
            <template slot-scope="scope">
              <span>{{scope.row.jasl}} / {{scope.row.hg}} / {{scope.row.bhg}} / {{scope.row.yx}}</span>
            </template>
          </el-table-column>
          <el-table-column label="进度" prop="jd" :formatter="jdFormat" />
          <el-table-column label="操作" width="400px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleViews(scope.row)">学习</el-button>
              <el-button size="mini" @click="handleViews(scope.row)">考试</el-button>
              <el-button size="mini" type="success" @click="handleViews(scope.row)">查看考试</el-button>
              <el-button size="mini" type="success" @click="handleNotice(scope.row)">查看笔记</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="ksTotal>0"
          :total="ksTotal"
          :page.sync="ksQueryParams.pageNum"
          :limit.sync="ksQueryParams.pageSize"
          @pagination="onSubmit"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 添加或修改消息管理对话框 -->
    <el-dialog width="800px" :visible.sync="dialogFormVisible">
      <div>
        <img
          style="width : 200px;margin : 20px"
          v-for="(item,index) in 6"
          :key="index"
          src="https://ndx-file.nandouxingriyu.com/statics/2021/09/10/c2aa5f01-a1ba-4999-a9bf-68ad7a7bb042.jpg"
          alt
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitForm">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 申请完成 -->
    <el-dialog title="培训感想" :visible.sync="dialogApplyCompleteVisible">
      <el-form :model="applyCompleteForm">
        <editor v-model="applyCompleteForm.pxgx" :item="items" :min-height="300" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogApplyCompleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogApplyCompleteVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCurriculum } from "@/api/basic/curriculum";
import { getExamList, getVideoList } from "@/api/basic/train-teacher";

import { teacherList } from "@/api/basic/assignTeachers";
import { dataStatisticsQuery } from "@/api/basic/statistics";
import { addMessage } from "@/api/basic/message";
export default {
  data() {
    return {
      queryParams: {
        pageNum: 0,
        pageSize: 10,
        courseName: null,
        spjd: null
      },
      ksQueryParams: {
        pageNum: 0,
        pageSize: 10,
        lsid: null,
        jd: null
      },
      Total: 0,
      ksTotal: 0,
      activeName: "first",
      // 表单参数
      form: {
        sfqbfs: "0",
        xxlx: "2",
        jsrArr: []
      },
      applyCompleteForm: {},
      // 表单校验
      formRules: {
        xxlx: [{ required: true, message: "必填项", trigger: "change" }],
        xxbt: [{ required: true, message: "必填项", trigger: "blur" }],
        sfqbfs: [{ required: true, message: "必填项", trigger: "change" }],
        xxqrlx: [{ required: true, message: "必填项", trigger: "change" }]
      },
      total: 0,
      dialogFormVisible: false,
      dialogApplyCompleteVisible: false,
      listCurriculum: [],
      videoList: []
    };
  },
  created() {
    listCurriculum().then(res => {
      this.listCurriculum = res.rows;
    });
    teacherList().then(response => {
      this.teacherListOption = response.rows;
    });
    this.getDicts("prepareStatsProgress").then(response => {
      this.prepareStatsProgress = response.data;
    });
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    onSubmit() {
      getVideoList(this.queryParams).then(res => {
        console.log(res);
        this.videoList = res.rows;
      });
    },
    jdFormat(row, column) {
      return this.selectDictLabel(this.prepareStatsProgress, row.jd);
    },
    handleNotice(row) {
      if (row.lsxm) {
        this.teacherListData.push(row.lsxm + "-" + row.dhhm);
        this.dialogFormVisible = true;
      }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          addMessage(this.form).then(res => {
            if (200 == res.code) {
              this.onSubmit();
              this.reset();
              this.msgSuccess("操作成功！");
              this.dialogFormVisible = false;
            } else {
              this.msgError("操作失败！请联系管理员！");
            }
          });
        } else {
          return false;
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        xxbt: null,
        xxnr: null,
        sfqbfs: "0",
        xxlx: "2",
        xxqrlx: null,
        remark: null,
        userId: null,
        userName: null,
        status: "0",
        dataOrder: null,
        createTime: null,
        updateTime: null,
        kzzd1: null,
        kzzd2: null,
        kzzd3: null,
        kzzd4: null,
        kzzd5: null,
        jsrArr: []
      };
      this.resetForm("form");
    },
    applyComplete() {
      this.dialogApplyCompleteVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.lesson-preparation-statistics {
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>
