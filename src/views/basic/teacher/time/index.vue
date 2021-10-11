<template>
  <div class="tiemForm">
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
    <tiemForm ref="tiemForm" @getList="getList" />
    <el-table border ref="singleTable" :data="tableData" highlight-current-row style="width: 100%;font-size : 18px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="xm" label="姓名" width="120"></el-table-column>
      <el-table-column property="xb" label="性别" :formatter="getSex" width="120"></el-table-column>
      <el-table-column property="dhhm" label="电话" width="120"></el-table-column>
      <el-table-column property="jtzz" label="家庭住址"></el-table-column>
      <el-table-column property="yxdq" label="期望地区"></el-table-column>
      <el-table-column property="lrrid" label="录入"></el-table-column>
      <el-table-column property="mszt" label="面试状态" :formatter="statusFormat"></el-table-column>
      <!-- <el-table-column property="status" label="数据状态" :formatter="statusFormat"></el-table-column> -->
      <el-table-column property="zt" label="复试结果" :formatter="getResult"></el-table-column>
      <el-table-column property="dhsj" label="来汉时间"></el-table-column>
      <el-table-column property="pqdq" label="派遣地区"></el-table-column>
      <el-table-column property="jlArr" label="简历下载" width="280px" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-for="(item,index) in scope.row.jlArr"
            :key="index"
            @click="downloadFileName(item.wjmc,(scope.row.xm)+'-'+(index)+(item.wjmc.substring(item.wjmc.indexOf('.'),item.wjmc.length)))"
          >{{scope.row.xm}}-{{index}}{{item.wjmc.substring(item.wjmc.indexOf("."),item.wjmc.length)}}</el-button>
        </template>
      </el-table-column>
      <el-table-column property="fpbjqk" label="分配班级情况"></el-table-column>
      <el-table-column property="remark" label="备注"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">审核</el-button>
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
      tiemForm: null,
      //查询老师条件
      name: ""
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
      let json = {};
      if (this.name) {
        json.xm = this.name;
      }
      getItem(json).then(res => {
        this.tableData = res.rows;
      });
    },
    // 编辑老师基本信息
    handleEdit(index, row) {
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
    },
    /** 下载文件操作 */
    downloadFileName(fileName,name) {
      this.download('file/filetable/download', {
        wjmc:fileName
      }, name)
    },
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
