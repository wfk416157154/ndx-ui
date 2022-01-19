<template>
  <div class="performance-appraisal">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="学校">
        <el-select
          v-model="queryParams.xqid"
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
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="queryParams.dateArr"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-download" @click="exportSubmit">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="singleTable" :data="performanceAppraisal" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column property="rybjmc" label="班级"></el-table-column>
      <el-table-column property="lsxm" label="老师" width="120"></el-table-column>
      <el-table-column property="pybcStr" label="培优补差"></el-table-column>
      <el-table-column property="gtStr" label="沟通"></el-table-column>
      <el-table-column property="bkStr" label="备课"></el-table-column>
      <el-table-column property="address" label="配合系统"></el-table-column>
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
import {
  listBjclass,
  classPerformance,
  exportClassPerformance
} from "@/api/basic/bjclass";
import { listSchool } from "@/api/basic/school";
export default {
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      performanceAppraisal: [],
      selectXqmc: [],
      bjclassList: []
    };
  },
  created() {
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
      classPerformance(this.queryParams).then(res => {
        this.performanceAppraisal = res.rows;
        this.total = res.total;
      });
    },
    exportSubmit() {
      this.download(
        "basic/bjclass/exportClassPerformance",
        {
          ...this.queryParams
        },
        `绩效考核.xlsx`
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.performance-appraisal {
  padding: 40px;
  box-sizing: border-box;
}
</style>
