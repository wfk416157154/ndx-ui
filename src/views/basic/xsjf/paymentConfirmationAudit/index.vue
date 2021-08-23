<template>
  <div class="paymentConfirmationAudit">
    <el-form
      ref="paymentConfirmationAuditForm"
      :inline="true"
      :model="paymentConfirmationAuditForm"
      label-width="80px"
    >
      <el-form-item label="负责人">
        <el-select v-model="paymentConfirmationAuditForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学校">
        <el-select v-model="paymentConfirmationAuditForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="paymentConfirmationAuditForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="缴费方式">
        <el-select v-model="paymentConfirmationAuditForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="进账方式">
        <el-select v-model="paymentConfirmationAuditForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini">已审批</el-button>
        <el-button type="primary" size="mini">未审批</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="paymentConfirmationAuditData" :border="true" stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="xqmc" label="学生姓名"></el-table-column>
      <el-table-column prop="bjmc" label="转账时间"></el-table-column>
      <el-table-column prop="lsmc" label="班级"></el-table-column>
      <el-table-column prop="lsmc" label="老师"></el-table-column>
      <el-table-column prop="lsmc" label="转账金额"></el-table-column>
      <el-table-column prop="lsmc" label='缴费方式'></el-table-column>
      <el-table-column prop="lsmc" label="转账方式"></el-table-column>
      <el-table-column prop="lsmc" label="负责人"></el-table-column>
      <el-table-column prop="lsmc" label="凭证"></el-table-column>
      <el-table-column prop="cz" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="queryData(scope.$index, scope.row)">已收到</el-button>
          <el-button size="mini" type="primary" @click="queryData(scope.$index, scope.row)">未收到</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paymentConfirmationAuditForm: {},
      paymentConfirmationAuditData: [{}]
    };
  }
};
</script>

<style lang="scss" scoped>
.paymentConfirmationAudit {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>