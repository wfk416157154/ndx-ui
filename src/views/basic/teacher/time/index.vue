<template>
  <div class="tiemForm">
    <tiemForm ref="tiemForm" />
    <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="xm" label="姓名" width="120"></el-table-column>
      <el-table-column property="xb" label="性别" :formatter="getSex" width="120"></el-table-column>
      <el-table-column property="dhhm" label="电话" width="120"></el-table-column>
      <el-table-column property="jtzz" label="家庭住址"></el-table-column>
      <el-table-column property="yxdq" label="期望地区"></el-table-column>
      <el-table-column property="lrrid" label="录入"></el-table-column>
      <el-table-column property="mszt" label="面试状态" :formatter="statusFormat"></el-table-column>
      <!-- <el-table-column property="status" label="数据状态" :formatter="statusFormat"></el-table-column> -->
      <el-table-column property="zt" label="初试结果" :formatter="getResult"></el-table-column>
      <el-table-column property="dhsj" label="来汉时间"></el-table-column>
      <el-table-column property="pqdq" label="派遣地区"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import tiemForm from "./tiemForm";
import { getItem } from "@/api/basic/firstTry";
export default {
  data() {
    return {
      tableData: [],
      tiemForm: null
    };
  },
  components: {
    tiemForm
  },
  created() {
    this.getDicts("tea_per_type").then(response => {
      this.status = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sex = response.data;
    });
    this.getDicts("preliminary_test_results").then(response => {
      this.result = response.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    //获取表格老师信息
    getList() {
      getItem().then(res => {
        this.tableData = res.rows;
      });
    },
    // 编辑老师基本信息
    handleEdit(index, row) {
      // console.log(index, row);
      this.$refs.tiemForm.editFirstTryForm(row);
    },
    // 状态字典翻译 状态
    statusFormat(row, column) {
      return this.selectDictLabel(this.status, row.mszt);
    },
    // 状态字典翻译 性别
    getSex(row, column) {
      return this.selectDictLabel(this.sex, row.xb);
    },
    // 状态字典翻译 面试结果
    getResult(row, column) {
      return this.selectDictLabel(this.result, row.zt);
    }
  }
};
</script>

<style lang="scss">
.tiemForm {
  padding: 50px;
  box-sizing: border-box;
  .tiemForm-add {
    margin-bottom: 20px;
  }
}
</style>