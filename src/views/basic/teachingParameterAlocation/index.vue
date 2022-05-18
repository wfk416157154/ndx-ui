<template>
  <div class="teachingParameterAlocation">
    <el-form :inline="true" :model="teachingParameterAlocationForm" class="demo-form-inline">
      <el-form-item label="老师">
        <el-input v-model="teachingParameterAlocationForm.lsxm" placeholder="老师"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="teachingParameterAlocationData" border style="width: 100%">
      <el-table-column type="index" width="550" label="序号"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="name" label="课程"></el-table-column>
      <el-table-column prop="address" label="操作" width="180px">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleDistribution(scope.row)">分 配</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="分配" :visible.sync="dialogFormVisible">
      <el-form :model="distributionForm">
        <el-form-item label="教材">
          <el-select v-model="distributionForm.region" placeholder="请选择活动区域">
            <el-option label="教材一" value="shanghai"></el-option>
            <el-option label="教材二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        <el-checkbox-group v-model="distributionCheckList">
          <el-checkbox label="复选框 A"></el-checkbox>
          <el-checkbox label="复选框 B"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handledistributionSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { METHODS } from "http";
export default {
  data() {
    return {
      teachingParameterAlocationForm: {},
      teachingParameterAlocationData: [{}],
      distributionForm: {},
      dialogFormVisible: false,
      distributionCheckList: []
    };
  },
  methods: {
    getList() {},
    handleDistribution(row) {
      this.dialogFormVisible = true;
    },
    handledistributionSubmit() {
      this.dialogFormVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.teachingParameterAlocation {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>