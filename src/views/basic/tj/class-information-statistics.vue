<template>
  <div class="class-information-statistics">
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="学校">
        <el-select v-model="form.xqmc" filterable placeholder="请选择校区名称" clearable>
          <el-option
            v-for="item in selectXqmc"
            :key="item.id"
            :label="item.xxmc"
            :value="item.xxmc"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="form.rybjmc" filterable placeholder="请选择日语班级" clearable>
          <el-option
            v-for="item in pageList "
            :key="item.id"
            :label="item.rybjmc"
            :value="item.rybjmc"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师">
        <el-input v-model="form.lsxm" placeholder="可模糊查询老师姓名"></el-input>
      </el-form-item>
      <el-form-item label="届数">
        <el-input v-model="form.jieshu" placeholder="请输入届数"></el-input>
      </el-form-item>
      <el-form-item label="班级状态">
        <el-select v-model="form.status" placeholder="请选择毕业状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="pageList" border style="width: 100%">
      <el-table-column prop="xqmc" label="学校" width="180"></el-table-column>
      <el-table-column prop="rybjmc" label="班级" width="180"></el-table-column>
      <el-table-column prop="lsxm" label="老师"></el-table-column>
      <el-table-column prop="bjrs" label="班级人数">
        <template slot-scope="scope">
          <div v-if="scope.row.bjrs == 0">{{scope.row.bjrs}}</div>
          <el-link v-else type="success" @click="handleExport(scope.row)">{{scope.row.bjrs}}</el-link>
        </template>
      </el-table-column>
      <el-table-column  label="课表">
        <template slot-scope="scope">
          <el-link type="success" @click="timetableExport(scope.row)">课表下载</el-link>
        </template>
      </el-table-column>
      <el-table-column label="班级成绩">
        <template slot-scope="scope">
          <el-link type="success" @click="toPages(scope.row.id)">班级成绩</el-link>
        </template>
      </el-table-column>
      <el-table-column  label="学生成绩">
        <template slot-scope="scope">
          <el-link type="success" @click="stugradeExport(scope.row)">学生成绩下载</el-link>
        </template>
      </el-table-column>
      <el-table-column  label="班级信息文件">
        <template slot-scope="scope">
          <el-link type="success">班级信息文件下载</el-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="form.pageNum"
      :limit.sync="form.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getPageList, getMessageList } from "@/api/basic/teacher";
import { listSchool } from "@/api/basic/school";
export default {
  data() {
    return {
      form: {
        status:"1",// 只查询正常的班级
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      statusOptions: [],
      pageList: [],
      //校区名称
      selectXqmc: [],
    };
  },
  created() {
    this.getDicts("graduateStatus").then(response => {
      this.statusOptions = response.data;
    });
    listSchool().then(response => {
      this.selectXqmc = response.rows;
    });
    this.getList()
  },
  methods: {
    getList() {
      getPageList(this.form).then(res => {
        this.pageList = res.rows;
        this.total = res.total;
      });
    },
    handleExport(row) {
      this.download(
        "basic/student/export",
        {
          ryb: row.id
        },
        `${row.rybjmc}-${row.lsxm}-学生信息基础表.xlsx`
      );
    },
    stugradeExport(row) {
      this.download(
        "basic/stugrade/exportEveryGrade",
        {
          kzzd1: row.id
        },
        `${row.rybjmc}-${row.lsxm}-学生成绩表.xlsx`
      );
    },
    timetableExport(bj) {
      this.download(
        "basic/classCourse/exportClassCourse",
        {
          bjid: bj.id,
          enableOnly: 1
        },
        `${bj.rybjmc}-${bj.lsxm}-课表.xlsx`
      );
    },
    toPages(bjid) {
      this.getConfigKey("class-grade").then(res => [
        this.$router.push({
          path: `${res.msg}?bjid=${bjid}`
        })
      ]);
    }
  }
};
</script>
<style lang="scss" scoped>
.class-information-statistics {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>
