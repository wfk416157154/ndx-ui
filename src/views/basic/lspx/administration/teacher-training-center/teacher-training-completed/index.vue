<template>
  <div class="qrientation-assignment">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="老师">
        <el-input v-model="queryParams.lsxm" placeholder="老师"></el-input>
      </el-form-item>
      <el-form-item label="课程类别">
        <el-select v-model="queryParams.courseName" placeholder="培训类别">
          <el-option
            v-for="item in listCurriculum"
            :key="item.id"
            :label="item.curriculumName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="querySubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="trainResultData" border style="width: 100%">
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
      <el-table-column label="试卷名称" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.sjmc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试分数" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.sjzf }}</span>
        </template>
      </el-table-column>
      <el-table-column label="视频类别" width="180">
        <template slot-scope="scope">
          <dict-tag :options="splbOptions" :value="scope.row.splb" />
        </template>
      </el-table-column>
      <el-table-column label="培训时间" width="180">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
          >{{ parseTime(scope.row.fpsj,'{y}-{m}-{d}') }} 至 {{ parseTime(scope.row.wcsj,'{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="completeSubmit(scope.$index, scope.row)"
          >完成培训</el-button>
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
import { updateTeacher } from "@/api/basic/teacher";
import { listCurriculum } from "@/api/basic/curriculum";
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
      listCurriculum: [],
      trainResultData: [],
      // 视频类别
      splbOptions: []
    };
  },
  created() {
    listCurriculum().then(res => {
      this.listCurriculum = res.rows;
    });
    this.getDicts("videoType").then(response => {
      this.splbOptions = response.data;
    });
    this.querySubmit();
  },
  methods: {
    querySubmit() {
      trainResultList(this.queryParams).then(res => {
        this.trainResultData = res.rows;
        this.total = res.total;
      });
    },
    completeSubmit(index, row) {
      this.$confirm("是否完成培训?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateTeacher({
            id: this.$store.state.user.glrid,
            kzzd4: 1
          }).then(res => {
            this.msgSuccess(res.msg);
          });
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    viewSubmit(index, row) {
      this.getConfigKey("teacher-training-completed-detalis").then(res => [
        this.$router.push({
          path: res.msg,
          query: {
            list: JSON.stringify(row)
          }
        })
      ]);
    }
  }
};
</script>

<style lang="scss" scoped>
.qrientation-assignment {
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
