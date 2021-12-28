<template>
  <div class="teacher-training-home">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="老师">
        <el-input v-model="queryParams.lsxm" placeholder="老师"></el-input>
      </el-form-item>
      <el-form-item label="培训类别">
        <el-input v-model="queryParams.courseName" placeholder="培训类别"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="querySubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="trainResultData" border>
      <el-table-column label="老师" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.lsxm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.courseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分配的视频" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.videoName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="培训时间" width="180">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
          >{{ parseTime(scope.row.fpsj,'{y}-{m}-{d}') }} 至 {{ parseTime(scope.row.wcsj,'{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="视频进度" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.wcspsl }}/{{ scope.row.fpspsl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="笔记" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.bjwcsl }}/{{ scope.row.fpspsl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高考卷子分数" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.gksjfs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试成绩" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.sjmcAndKscj }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editSubmit(scope.$index, scope.row)">编 辑</el-button>
          <el-button size="mini" type="success" @click="viewSubmit(scope.$index, scope.row)">查 看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="querySubmit"
    />
  </div>
</template>

<script>
import { trainTeacherProcess } from "@/api/basic/teacher-training-completed";
export default {
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        courseName: "",
        lsxm: ""
      },
      total: 0,
      trainResultData: [],
    };
  },
  created() {
    this.querySubmit();
  },
  methods: {
    querySubmit() {
      trainTeacherProcess(this.queryParams).then(res => {
        this.trainResultData = res.rows;
        this.total = res.total;
      });
    },
    editSubmit(index, row) {
      this.getConfigKey("teacher-training-home-edit").then(res => [
        this.$router.push({
          path: res.msg,
          query: {
            list: JSON.stringify(row),
            name: "teacher-training-home"
          }
        })
      ]);
    },
    viewSubmit(index, row) {
      this.getConfigKey("teacher-training-completed-detalis").then(res => [
        this.$router.push({
          path: res.msg,
          query: {
            list: JSON.stringify(row),
            name: "teacher-training-home"
          }
        })
      ]);
    }
  }
};
</script>

<style lang="scss" scoped>
.teacher-training-home {
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
