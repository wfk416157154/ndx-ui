<template>
  <div class="score-upload-statistics">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="学校">
        <el-select
          v-model="queryParams.xqmc"
          filterable
          placeholder="请选择校区名称"
          @change="xqmcOnChange"
        >
          <el-option v-for="item in selectXqmc" :key="item.id" :label="item.xxmc" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="queryParams.bjid" filterable placeholder="请选择日语班级">
          <el-option
            v-for="item in bjclassList "
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师">
        <el-input v-model="queryParams.lsxm" placeholder="老师"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="singleTable" :data="scoreUploadStatisticsList" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="日语班级" align="center" prop="bjmc" />
      <el-table-column label="老师" align="center" prop="lsxm" />
      <el-table-column label="教材" align="center" prop="jcmc" />
      <el-table-column label="考试类型" align="center" :formatter="getKslx" prop="kslx" />
      <el-table-column label="考试范围" align="center" prop="ksfw"></el-table-column>
      <el-table-column label="考试时间" align="center" prop="kskssj" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.kskssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column property="address" label="滞后时间" prop="zhts">
        <template slot-scope="scope">
          <span>{{ scope.row.zhts }} 天</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleRemind(scope.$index, scope.row)" disabled>提 醒</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
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
        kzzd2: 9
      },
      total: 0,
      selectXqmc: [],
      bjclassList: [],
      kslxOptions: [],
      scoreUploadStatisticsList: []
    };
  },
  created() {
    this.getDicts("examination_type").then(response => {
      this.kslxOptions = response.data;
    });
    listSchool().then(response => {
      this.selectXqmc = response.rows;
    });
  },
  mounted() {},
  methods: {
    xqmcOnChange(id) {
      listBjclass({ kzzd1: id }).then(response => {
        this.bjclassList = response.rows;
      });
    },
    getList() {
      queryNotUploadGradeExamlist(this.queryParams).then(res => {
        this.scoreUploadStatisticsList = res.rows;
        this.total = res.total;
      });
    },
    getKslx(row, column) {
      return this.selectDictLabel(this.kslxOptions, row.kslx);
    },
    handleRemind() {}
  }
};
</script>

<style lang="scss" scoped>
.score-upload-statistics {
  padding: 40px;
  box-sizing: border-box;
}
</style>
