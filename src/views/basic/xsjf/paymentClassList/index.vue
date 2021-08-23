<template>
  <div class="paymentClassList">
    <el-form
      ref="paymentClassListForm"
      :inline="true"
      :model="paymentClassListForm"
      label-width="80px"
    >
      <el-form-item label="负责人">
        <el-select v-model="paymentClassListForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学校">
        <el-select v-model="paymentClassListForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="paymentClassListForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级状态">
        <el-select v-model="paymentClassListForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="进账方式">
        <el-select v-model="paymentClassListForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间周期">
        <el-select v-model="paymentClassListForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="缴费状态">
        <el-select v-model="paymentClassListForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="paymentClassListData" :border="true" stripe style="width: 100%">
      <el-table-column prop="xqmc" label="负责人"></el-table-column>
      <el-table-column prop="xqmc" label="学校"></el-table-column>
      <el-table-column prop="bjmc" label="班级"></el-table-column>
      <el-table-column prop="lsmc" label="老师"></el-table-column>
      <el-table-column prop="lsmc" label="状态"></el-table-column>
      <el-table-column prop="lsmc" label="收费说明"></el-table-column>
      <el-table-column prop="lsmc" label="期数"></el-table-column>
      <el-table-column prop="lsmc" label="开班人数"></el-table-column>
      <el-table-column prop="lsmc" label="收费金额"></el-table-column>
      <el-table-column prop="lsmc" label="未交金额"></el-table-column>
      <el-table-column prop="cz" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="queryData(scope.$index, scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paymentClassListForm: {},
      paymentClassListData: [
          {
          
          }
      ]
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleExport() {},
    queryData(){}
  }
};
</script>

<style lang="scss" scoped>
.paymentClassList {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>