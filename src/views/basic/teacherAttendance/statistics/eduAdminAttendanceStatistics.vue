<template>
  <div class="eduAdminAttendanceStatistics">
    <el-form
      ref="form"
      :model="StatisticsForm"
      :rules="rulesForm"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker
          v-model="StatisticsForm.startDate"
          type="date"
          format="yyyy-MM-dd"
          placeholder="开始日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker
          v-model="StatisticsForm.endDate"
          type="date"
          format="yyyy-MM-dd"
          placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="校区" prop="xqid">
        <el-select
          v-model="StatisticsForm.xqid"
          filterable
          placeholder="请选择校区名称"
          @change="xqmcOnChange"
        >
          <el-option v-for="item in schoolList" :key="item.id" :label="item.xxmc" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日语班级" prop="bjid">
        <el-select v-model="StatisticsForm.bjid" filterable placeholder="请选择日语班级">
          <el-option
            v-for="item in queryBjclassList "
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryResult">查询</el-button>
        <el-button type="success" plain @click="selectTeacher">选择老师并导出Excel</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <template>
      <el-table :data="jwTeaAttenDataItem" border style="width: 100%;font-size : 18px">
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          v-for="(item,index) in jwColumnNameItem"
          :key="index"
        >
          <template slot-scope="scope">
            <div v-if="item.prop == 'talk'">
              <div v-if="scope.row[item.prop] >= '8'">合格-{{scope.row[item.prop]}}</div>
              <div v-else>不合格-{{scope.row[item.prop]}}</div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="pageTurnTeacherAttendanceDetail(scope.$index, scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="StatisticsForm.pageNum"
      :limit.sync="StatisticsForm.pageSize"
      @pagination="queryResult"
    />

    <el-dialog title="导出日志考勤统计的数据" :visible.sync="dialogFormVisible">
      <table style="width : 100%;" border="1" cellspacing="0">
        <tbody>
        <tr>
          <td>
            选择统计月份
          </td>
          <td class="tds">
            <el-date-picker
              v-model="monthDate"
              type="month"
              placeholder="月份"
            ></el-date-picker>
          </td>
        </tr>
          <tr>
            <td class="tds">
              <el-radio v-model="radio" @change="updeteTeacher" label="1">全部</el-radio>
            </td>
            <td>
              <el-form :model="teacherFrom">
                <el-form-item label="届数" label-width="80px">
                  <el-input v-model="teacherFrom.rybjmc" @input="getTeacher" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="老师" label-width="80px">
                  <el-input v-model="teacherFrom.lsxm" @input="getTeacher" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
            </td>
          </tr>
          <tr>
            <td class="tds">老师</td>
            <td>
              <el-checkbox-group v-model="teacherCheckbox">
                <el-checkbox
                  :label="item.id"
                  v-for="(item,index) in teacherList"
                  :key="index"
                >{{item.lsxm}}</el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="distributionSubmit">提 交并导出Excel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  jwColumnNamelist,
  jwTeaAttenDatalist,
  statisticTest
} from "@/api/basic/teacherAttendance";
import { listBjclass } from "@/api/basic/bjclass";
import { listSchool } from "@/api/basic/school";
import { listTeacher } from "@/api/basic/teacher";
export default {
  data() {
    return {
      StatisticsForm: {
        startDate: null,
        endDate: null,
        teacherId: null,
        xqid: null,
        bjid: null,
        pageNum: 1,
        pageSize: 10
      },
      rulesForm: {
        startDate: [
          { required: true, message: "请选择开始日期", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "请选择结束日期", trigger: "blur" }
        ]
      },
      total: 0,
      jwColumnNameItem: [],
      jwTeaAttenDataItem: [],
      //校区列表
      schoolList: [],
      // 班级信息
      queryBjclassList: [],
      limitDays: 31, // 查询范围最多可允许的天数
      dialogFormVisible: false,
      teacherCheckbox: [],
      teacherList: [],
      teacherFrom: {
        kzzd4:"1" // 默认查询在职状态的老师
      },
      radio: false,
      monthDate:null
    };
  },
  created() {
    this.queryJwTeacherAttendanceColumnNameList();
    this.getLimitDays();
    // 获取校区
    listSchool().then(response => {
      this.schoolList = response.rows;
      if (response.rows.length == 1) {
        // 当只有一个校区则自动赋值
        this.StatisticsForm.xqid = response.rows[0].id;
      }
    });
  },
  methods: {
    // 选择老师
    selectTeacher() {
      this.teacherCheckbox = [];
      this.radio = false;
      this.dialogFormVisible = true;
    },
    getTeacher() {
      this.teacherCheckbox = [];
      listTeacher(this.teacherFrom).then(response => {
        this.teacherList = response.rows;
      });
    },
    updeteTeacher() {
      this.teacherCheckbox = [];
      listTeacher(this.teacherFrom).then(response => {
        this.teacherList = response.rows;
        this.teacherList.forEach(value => {
          this.teacherCheckbox.push(value.id);
        });
      });
    },
    async distributionSubmit() {
      let obj = {
        monthDate: this.formatDate(this.monthDate),
        lsidArr: this.teacherCheckbox
      }
      let loading=this.$loading({
        lock: true,
        text: "请稍后，正在进行统计~~~",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      await this.download(
        "basic/teacherAttendanceStatistics/exportWorkLogStatisticsData",
        obj,
        `日志考勤统计表-${this.formatDate(new Date())}.xlsx`
      );
      loading.close()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("form");
    },
    /* 选择校区触发 */
    xqmcOnChange(id) {
      listBjclass({ kzzd1: id }).then(response => {
        this.queryBjclassList = response.rows;
      });
    },
    /**
     * 从参数配置中获取限制的最大日期范围天数
     */
    getLimitDays() {
      this.getConfigKey("Limit_days").then(res => {
        this.limitDays = res.msg;
      });
    },
    /* 查询教务主页面的动态列名 */
    queryJwTeacherAttendanceColumnNameList() {
      jwColumnNamelist().then(res => {
        if (res.code == 200) {
          this.jwColumnNameItem = res.data;
        }
      });
    },
    /* 点击查询按钮 */
    queryResult() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let startDate = this.StatisticsForm.startDate;
          let endDate = this.StatisticsForm.endDate;
          let date1 = new Date(startDate);
          let date2 = new Date(endDate);
          let date3 =
            (date2.getTime() / 1000 - date1.getTime() / 1000) / 60 / 60 / 24;
          if (date3 > this.limitDays) {
            this.msgError("查询考勤最大天数不得超过" + this.limitDays + "天");
            return;
          }
          this.StatisticsForm.startDate = this.formatDate(date1);
          this.StatisticsForm.endDate = this.formatDate(date2);
          jwTeaAttenDatalist(this.StatisticsForm).then(res => {
            this.jwTeaAttenDataItem = res.rows;
            this.total = res.total;
          });
        }
      });
    },
    /* 日期格式化 */
    formatDate(date) {
      if (null != date) {
        return (
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate()
        );
      }
      return null;
    },
    /**
     * 跳转到老师考勤统计详情页
     * @param index
     * @param row
     */
    pageTurnTeacherAttendanceDetail(index, row) {
      this.getConfigKey("teacherAttendanceStatistics").then(res => {
        if (res.code == 200) {
          this.$router.push({
            path:
              res.msg +
              JSON.stringify({ lsid: row.lsid, params: this.StatisticsForm })
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.eduAdminAttendanceStatistics {
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
