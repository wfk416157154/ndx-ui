<template>
  <div class="firstTry">
    <el-form :inline="true" label-width="68px">
      <el-form-item label="老师姓名" prop="xxmc">
        <el-input
          v-model="name"
          placeholder="请输入老师姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table  border ref="singleTable" :data="tableData" highlight-current-row style="width: 100%;font-size : 18px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="xm" label="姓名" width="120"></el-table-column>
      <el-table-column property="xb" label="性别" :formatter="getSex" width="120"></el-table-column>
      <el-table-column property="dhhm" label="电话" width="120"></el-table-column>
      <el-table-column property="jtzz" label="家庭住址"></el-table-column>
      <el-table-column property="yxdq" label="期望地区"></el-table-column>
      <el-table-column property="lrrid" label="录入人账号"></el-table-column>
      <el-table-column property="mszt" label="面试状态" :formatter="statusFormat"></el-table-column>
      <!-- <el-table-column property="status" label="数据状态" :formatter="statusFormat"></el-table-column> -->
      <el-table-column property="zt" label="复试结果" :formatter="getResult"></el-table-column>
      <el-table-column property="dhsj" label="来汉时间"></el-table-column>
      <el-table-column property="pqdq" label="派遣地区"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">添加资料</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getItem } from "@/api/basic/firstTry";
export default {
  data() {
    return {
      tableData: [],
      currentRow: null,
      //查询老师条件
      name: "",
      zt:"" // 复试结果:
    };
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
    this.getList({zt:"1"});// 默认查询复试结果为：满意 的数据，即表示通过复试的数据
  },
  methods: {
    //获取表格老师信息
    getList() {
      let json = {};
      if (this.name) {
        json.xm = this.name;
      }
      json.zt = "1";// 默认查询复试结果为：满意 的数据，即表示通过复试的数据
      getItem(json).then(res => {
        this.tableData = res.rows;
      });
    },
    // 编辑老师基本信息
    handleEdit(index, row) {
      // 获取页面中参数配置的路由
      this.getConfigKey("certificatesForm").then(resp => {
        this.router = resp.msg;
        this.$router.push({
          path: this.router + row.id
        });
      });
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
.firstTry {
  padding: 50px;
  box-sizing: border-box;
  .firstTry-add {
    margin-bottom: 20px;
  }
}
</style>
