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
      <el-table-column label="培训时间" width="180">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
          >{{ parseTime(scope.row.fpsj) }} 至 {{ parseTime(scope.row.wcsj) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="视频进度" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.spjd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高考卷子分数" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.gkjzfs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试成绩" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.kscj }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="editSubmit(scope.$index, scope.row)">编 辑</el-button>
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
import { trainResultList } from "@/api/basic/teacher-training-completed";
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
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  created() {
    this.querySubmit();
  },
  methods: {
    querySubmit() {
      trainResultList(this.queryParams).then(res => {
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
