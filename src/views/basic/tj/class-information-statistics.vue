<template>
  <div class="class-information-statistics">
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="学校">
        <el-input v-model="form.xqmc" placeholder="请输入学校"></el-input>
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="form.rybjmc" placeholder="请输入班级"></el-input>
      </el-form-item>
      <el-form-item label="老师">
        <el-input v-model="form.lsxm" placeholder="请输入老师"></el-input>
      </el-form-item>
      <el-form-item label="届数">
        <el-input v-model="form.rybjmc" placeholder="请输入届数"></el-input>
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
          <el-link v-else type="success" @click="handleExport(scope.row.id)">{{scope.row.bjrs}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="lsxm" label="课表">
        <template slot-scope="scope">
          <el-link type="success">课表下载</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="lsxm" label="班级成绩">
        <template slot-scope="scope">
          <el-link type="success" @click="toPages(scope.row.id)">班级成绩</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="lsxm" label="学生成绩">
        <template slot-scope="scope">
          <el-link type="success" @click="stugradeExport(scope.row.id)">学生成绩下载</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="lsxm" label="班级信息文件">
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
export default {
  data() {
    return {
      form: {
        pageNum: 0,
        pageSize: 10
      },
      total: 0,
      statusOptions: [],
      pageList: []
    };
  },
  created() {
    this.getDicts("graduateStatus").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    getList() {
      getPageList(this.form).then(res => {
        this.pageList = res.rows;
        this.total = res.total;
        // console.log(this.pageList);
      });
    },
    handleExport(id) {
      this.download(
        "basic/student/export",
        {
          ryb: id
        },
        `学生信息基础表.xlsx`
      );
    },
    stugradeExport(id) {
      this.download(
        "basic/stugrade/export",
        {
          rybj: id
        },
        `学生成绩基础表.xlsx`
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
