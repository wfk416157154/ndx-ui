<template>
  <div class="class-schedule-statistics">
    <el-form :rules="rules" :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="校区名称" prop="xqid" v-hasPermi="['basic:school:list']" label-width="100px">
        <el-select
          v-model="queryParams.xqid"
          @change="getSchoolListId"
          filterable
          placeholder="请选择校区名称"
        >
          <el-option v-for="item in schoolList" :key="item.id" :label="item.xxmc" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级" prop="bjid" label-width="100px">
        <el-select v-model="queryParams.bjid" filterable placeholder="请选择班级名称">
          <el-option
            v-for="item in listBjclass"
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年份" prop="nd">
        <el-select v-model="queryParams.nd" placeholder="请选择年份" clearable size="small">
          <el-option
            v-for="dict in yearList"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictLabel"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课表类型" prop="kbType" label-width="100px">
        <el-select v-model="queryParams.kbType" placeholder="请选择课表类型" clearable size="small">
          <el-option
            v-for="dict in kbTypeOptionsEL"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="老师姓名" prop="lsid" label-width="100px">
        <el-select v-model="queryParams.lsid" filterable placeholder="请选择老师" clearable>
          <el-option
            v-for="item in teacherListOption"
            :key="item.id"
            :label="item.lsxm"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="onSubmit">搜索</el-button>
        <el-button @click="resetForm('queryForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table border :data="bjCourseListAcdemicDeanList" style="width: 100%;font-size : 18px">
      <el-table-column label="班级" prop="rybjmc" />
      <el-table-column label="年份/课表类型">
        <template slot-scope="scope">
          <span>{{scope.row.nd}}</span>
          <span>{{scope.row.kblxLabel}}</span>
        </template>
      </el-table-column>
      <el-table-column label="老师姓名" prop="lsxm" />
      <el-table-column label="是否填写课表" prop="sftxkb" />
      <el-table-column label="填写时间" prop="txsj" />
      <el-table-column label="是否启用" prop="sfqy">
        <template slot-scope="scope">
          <span v-if="scope.row.sfqy == 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleViews(scope.row)">查看</el-button>
          <el-button size="mini" type="danger" @click="handleNotice(scope.row)">提醒老师</el-button>
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

    <!-- 添加或修改消息管理对话框 -->
    <el-dialog width="800px" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
        <el-form-item label="消息类型" prop="xxlx">
          <el-select v-model="form.xxlx" disabled placeholder="请选择消息类型">
            <el-option
              v-for="dict in xxlxOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息标题" prop="xxbt">
          <el-input v-model="form.xxbt" maxlength="100" placeholder="请输入消息标题" />
        </el-form-item>
        <el-form-item label="消息内容" prop="xxnr">
          <editor v-model="form.xxnr" :min-height="192" />
        </el-form-item>
        <el-form-item label="全部发送" prop="sfqbfs">
          <el-select v-model="form.sfqbfs" disabled placeholder="请选择是否发送给所有用户">
            <el-option
              v-for="dict in sfqbfsOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接收人" prop="sfqbfs">
          <el-checkbox-group v-model="form.jsrArr">
            <el-checkbox v-for="(item,index) in teacherListData" :key="index" :label="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="消息确认" prop="xxqrlx">
          <el-radio-group v-model="form.xxqrlx">
            <el-radio
              v-for="dict in xxqrlxOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitForm">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBjclass } from "@/api/basic/bjclass";
import { teacherList } from "@/api/basic/assignTeachers";
import { listSchool } from "@/api/basic/school";
import { bjCourseListAcdemicDean } from "@/api/basic/statistics";
import { addMessage } from "@/api/basic/message";
export default {
  data() {
    return {
      // 查询课表
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        kbType: null,
        nd: null,
        bjid: null,
        xqid: null,
        lsid: null
      },
      // 表单参数
      form: {
        sfqbfs: "0",
        xxlx: "2",
        jsrArr: []
      },
      rules: {
        // xqid: [{ required: true, message: "请选择校区", trigger: "change" }],
        nd: [{ required: true, message: "请选择年份", trigger: "change" }],
        kbType: [
          { required: true, message: "请选择课表类型", trigger: "change" }
        ]
      },
      // 表单校验
      formRules: {
        xxlx: [{ required: true, message: "必填项", trigger: "change" }],
        xxbt: [{ required: true, message: "必填项", trigger: "blur" }],
        sfqbfs: [{ required: true, message: "必填项", trigger: "change" }],
        xxqrlx: [{ required: true, message: "必填项", trigger: "change" }]
      },
      total: 0,
      xxlxOptions: [],
      bjCourseListAcdemicDeanList: [],
      teacherListOption: [],
      listBjclass: [],
      schoolList: [],
      kbTypeOptionsEL: [],
      yearList: [],
      sfqbfsOptions: [],
      xxqrlxOptions: [],
      teacherListData: [],
      dialogFormVisible: false
    };
  },
  created() {
    this.getDicts("year-list").then(response => {
      this.yearList = response.data;
    });
    this.getDicts("kb_type").then(response => {
      this.kbTypeOptionsEL = response.data;
    });
    this.getDicts("kc_type").then(response => {
      this.kcType = response.data;
    });
    listSchool().then(response => {
      this.schoolList = response.rows;
    });
    teacherList().then(response => {
      this.teacherListOption = response.rows;
    });
    this.getDicts("messageType").then(response => {
      this.xxlxOptions = response.data;
    });
    this.getDicts("isOrNot").then(response => {
      this.sfqbfsOptions = response.data;
    });
    this.getDicts("messageConfirmWay").then(response => {
      this.xxqrlxOptions = response.data;
    });
  },
  methods: {
    getSchoolListId(xqid) {
      xqid = xqid || this.queryParams.xqid;
      listBjclass({ kzzd1: xqid }).then(res => {
        this.listBjclass = res.rows;
      });
    },
    onSubmit() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          bjCourseListAcdemicDean(this.queryParams).then(res => {
            this.bjCourseListAcdemicDeanList = res.rows;
            this.total = res.total;
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.onSubmit();
    },
    handleViews(row) {
      this.getConfigKey("teacherTimetable").then(res => [
        this.$router.push({
          path: `${res.msg}?bjid=${row.bjid}`
        })
      ]);
    },
    handleNotice(row) {
      if (row.lsxm) {
        let lsxmArr = row.lsxm.split(",");
        row.dhhmArr.forEach((value, index) => {
          this.teacherListData.push(lsxmArr[index] + "-" + value);
        });
        this.dialogFormVisible = true;
      }
    },
    submitForm() {
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
    }
  }
};
</script>

<style lang="scss" scoped>
.class-schedule-statistics {
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>
