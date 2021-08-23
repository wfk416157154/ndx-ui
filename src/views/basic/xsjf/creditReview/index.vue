<template>
  <div class="creditReview">
    <el-form ref="creditReviewForm" :inline="true" :model="creditReviewForm" label-width="80px">
      <el-form-item label="负责人">
        <el-select v-model="creditReviewForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学校">
        <el-select v-model="creditReviewForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="creditReviewForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="creditReviewForm.name" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini">已审批</el-button>
        <el-button type="primary" size="mini">未审批</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="creditReviewData" :border="true" stripe style="width: 100%">
      <el-table-column prop="xqmc" label="学校"></el-table-column>
      <el-table-column prop="bjmc" label="班级"></el-table-column>
      <el-table-column prop="lsmc" label="老师"></el-table-column>
      <el-table-column prop="lsmc" label="学生姓名"></el-table-column>
      <el-table-column prop="lsmc" label="减免期数"></el-table-column>
      <el-table-column prop="lsmc" label="减免金额/每期"></el-table-column>
      <el-table-column prop="lsmc" label="减免后金额/每期"></el-table-column>
      <el-table-column prop="lsmc" label="审核文件"></el-table-column>
      <el-table-column prop="cz" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="queryData(scope.$index, scope.row)">通过</el-button>
          <el-button size="mini" type="primary" @click="queryData(scope.$index, scope.row)">不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      creditReviewForm: {},
      creditReviewData: [{}]
    };
  }
};
</script>

<style lang="scss" scoped>
.creditReview {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>