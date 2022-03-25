<template>
  <div class="score-upload-statistics">
    <el-form
      :inline="true"
      ref="queryParams"
      :model="queryParams"
      class="demo-form-inline"
    >
      <el-form-item label="学校" prop="xqid">
        <el-select
          v-model="queryParams.xqid"
          filterable
          placeholder="请选择校区名称"
          @change="xqmcOnChange"
        >
          <el-option
            v-for="item in selectXqmc"
            :key="item.id"
            :label="item.xxmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级" prop="bjid">
        <el-select
          v-model="queryParams.bjid"
          filterable
          placeholder="请选择日语班级"
        >
          <el-option
            v-for="item in bjclassList"
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试类型" prop="kslxArr">
        <el-select
          v-model="queryParams.kslxArr"
          placeholder="请选择考试类型"
          multiple
        >
          <el-option
            v-for="(dict, index) in getExaminationType"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="老师" prop="lsxm">
        <el-input v-model="queryParams.lsxm" placeholder="老师"></el-input>
      </el-form-item>
      <el-form-item label="滞后时间" prop="zhsjsx">
        <el-select
          v-model="queryParams.zhsjsx"
          filterable
          placeholder="滞后时间"
        >
          <el-option label="0到7天" value="1"></el-option>
          <el-option label="8到15天" value="2"></el-option>
          <el-option label="16到30天" value="3"></el-option>
          <el-option label="30天以上" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        <el-button
          type="success"
          :disabled="multipleSelection.length == 0"
          @click="handleOneKeyRemind()"
          >一 键 提 醒</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      ref="singleTable"
      :data="scoreUploadStatisticsList"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="日语班级" align="center" prop="bjmc" />
      <el-table-column label="老师" align="center" prop="lsxm" />
      <el-table-column label="教材" align="center" prop="jcmc" />
      <el-table-column
        label="考试类型"
        align="center"
        :formatter="getKslx"
        prop="kslx"
      />
      <el-table-column
        label="考试范围"
        align="center"
        prop="ksfw"
      ></el-table-column>
      <el-table-column
        label="考试时间"
        align="center"
        prop="kskssj"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.kskssj, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column property="address" label="滞后时间" prop="zhts">
        <template slot-scope="scope">
          <span>{{ scope.row.zhts }} 天</span>
        </template>
      </el-table-column>
      <el-table-column property="remindCount" label="提醒次数" prop="zhts">
        <template slot-scope="scope">
          <span>{{ scope.row.remindCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        property="lastRemindDays"
        label="距离上一次提醒天数"
        prop="zhts"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.lastRemindDays }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.remindCount == 0"
            size="mini"
            type="danger"
            @click="handleRemind(scope.row)"
            >提 醒</el-button
          >
          <el-button
            v-else
            size="mini"
            type="danger"
            @click="handleRemind(scope.row)"
            >再 次 提 醒</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog
      :title="`第${getListMessage.remindCount + 1}次提醒`"
      :visible.sync="open"
      width="800px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <h4
          v-if="
            getListMessage.lastRemindDays || getListMessage.lastRemindDays == 0
          "
        >
          距离上一次提醒 : {{ getListMessage.lastRemindDays }} 天
        </h4>
        <el-form-item label="消息标题" prop="xxbt">
          <el-input
            v-model="form.xxbt"
            maxlength="100"
            placeholder="请输入消息标题"
          />
        </el-form-item>
        <el-form-item label="消息内容" prop="xxnr">
          <editor v-model="form.xxnr" :min-height="192" />
        </el-form-item>
        <el-form-item label="消息确认" prop="xxqrlx">
          <el-radio-group v-model="form.xxqrlx">
            <el-radio
              v-for="dict in xxqrlxOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listMessage,
  getMessage,
  delMessage,
  addMessage,
  oneKeyRemind,
  updateMessage,
  listNoReplyMessage,
} from "@/api/basic/message";
import { listTeacher } from "@/api/basic/teacher";
import { listBjclass } from "@/api/basic/bjclass";
import { listSchool } from "@/api/basic/school";
import { queryNotUploadGradeExamlist } from "@/api/basic/examinationPaper";
export default {
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: 1,
        kzzd2: 9,
        xqid: "",
        bjid: "",
        kslxArr: [],
        lsxm: "",
        zhsjsx: "",
      },
      total: 0,
      selectXqmc: [],
      bjclassList: [],
      kslxOptions: [],
      scoreUploadStatisticsList: [],
      open: false,
      form: {
        id: null,
        xxlx: "1",
        xxbt: null,
        xxnr: null,
        sfqbfs: "0",
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
        jsrArr: [],
      },
      xxlxOptions: [],
      sfqbfsOptions: [],
      teacherList: [],
      xxqrlxOptions: [],
      lsphone: null,
      // 表单校验
      rules: {
        xxlx: [{ required: true, message: "必填项", trigger: "change" }],
        xxbt: [{ required: true, message: "必填项", trigger: "blur" }],
        sfqbfs: [{ required: true, message: "必填项", trigger: "change" }],
        xxqrlx: [{ required: true, message: "必填项", trigger: "change" }],
      },
      getListMessage: {},
      getExaminationType: [],
      multipleSelection: [],
    };
  },
  created() {
    this.getDicts("examination_type").then((response) => {
      this.kslxOptions = response.data;
    });
    this.getDicts("messageType").then((response) => {
      this.xxlxOptions = response.data;
    });
    this.getDicts("isOrNot").then((response) => {
      this.sfqbfsOptions = response.data;
    });
    this.getDicts("messageConfirmWay").then((response) => {
      this.xxqrlxOptions = response.data;
    });
    this.getDicts("examination_type").then((response) => {
      this.getExaminationType = response.data;
    });
    listSchool().then((response) => {
      this.selectXqmc = response.rows;
    });
  },
  mounted() {},
  methods: {
    // 一键提醒获取数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 一键提醒
    handleOneKeyRemind() {
      oneKeyRemind(this.multipleSelection).then((res) => {
        if (res.code == 200) {
          this.msgSuccess(res.msg);
          this.multipleSelection = [];
          this.getList();
        }
      });
    },
    // 重置
    resetQuery() {
      this.resetForm("queryParams");
    },
    xqmcOnChange(id) {
      listBjclass({ kzzd1: id }).then((response) => {
        this.bjclassList = response.rows;
      });
      this.lsphone = null;
      listTeacher({ xqmc: id }).then((response) => {
        this.teacherList = response.rows;
      });
    },
    getList() {
      queryNotUploadGradeExamlist(this.queryParams).then((res) => {
        this.scoreUploadStatisticsList = res.rows;
        this.total = res.total;
      });
    },
    getKslx(row, column) {
      return this.selectDictLabel(this.kslxOptions, row.kslx);
    },
    handleRemind(row) {
      this.getListMessage = row;
      this.reset();
      this.form.jsrArr[0] = row.lsxm + "-" + row.dhhm;
      this.form.kzzd2 = row.id;
      this.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if ("1" == this.form.sfqbfs) {
            // 如果发送给全部用户，则接收人数组置空
            this.form.jsrArr = [];
          }
          if (this.form.id != null) {
            updateMessage(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.id = this.wjid;
            addMessage(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        xxlx: "1",
        xxbt: null,
        xxnr: null,
        sfqbfs: "0",
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
        jsrArr: [],
      };
      this.resetForm("form");
    },
  },
};
</script>

<style lang="scss" scoped>
.score-upload-statistics {
  padding: 40px;
  box-sizing: border-box;
}
</style>
