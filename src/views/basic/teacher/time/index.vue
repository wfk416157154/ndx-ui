<template>
  <div class="tiemForm">
    <tiemForm ref="tiemForm" />
    <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="xm" label="姓名" width="120"></el-table-column>
      <el-table-column property="xb" label="性别" width="120"></el-table-column>
      <el-table-column property="dh" label="电话" width="120"></el-table-column>
      <el-table-column property="dq" label="地区"></el-table-column>
      <el-table-column property="qw" label="期望"></el-table-column>
      <el-table-column property="lr" label="录入"></el-table-column>
      <el-table-column property="lhsj" label="来汉时间"></el-table-column>
      <el-table-column property="pqdq" label="派遣地区"></el-table-column>
      <el-table-column property="zt" label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.tag === '合格' ? 'primary' : 'success'"
            disable-transitions
          >{{scope.row.tag}}</el-tag>
        </template>
      </el-table-column>
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
export default {
  data() {
    return {
      tableData: [
        {
          xm: "王小虎",
          dh: 15676542345,
          lr: "周老师",
          xb: "男",
          qw: "10k",
          dq: "长沙",
          tag: "合格",
          lhsj: "2021/5/6",
          pqdq: "北京"
        },
        {
          xm: "王小虎",
          dh: 15676542345,
          lr: "周老师",
          xb: "男",
          qw: "10k",
          dq: "长沙",
          tag: "合格",
          lhsj: "2021/5/6",
          pqdq: "北京"
        },
        {
          xm: "王小虎",
          dh: 15676542345,
          lr: "周老师",
          xb: "男",
          qw: "10k",
          dq: "长沙",
          tag: "合格",
          lhsj: "2021/5/6",
          pqdq: "北京"
        }
      ],
      tiemForm: null
    };
  },
  components: {
    tiemForm
  },
  methods: {
    // 编辑老师基本信息
    handleEdit(index, row) {
      console.log(index, row);
      this.$refs.tiemForm.edittiemForm(row);
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