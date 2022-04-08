<template>
  <div class="dd-class-info">
    <el-form
      :inline="true"
      :model="supervisorClassInfoForm"
      class="demo-form-inline"
    >
      <el-form-item label="老师">
        <el-input
          v-model="supervisorClassInfoForm.lsxm"
          placeholder="老师"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button
          type="danger"
          class="el-icon-refresh-right"
          @click="updateClassPlanClick"
          >更新教学计划列表的数据</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="supervisorClassInfoData" style="width: 100%">
      <el-table-column prop="rybjmc" label="班级" width="180">
      </el-table-column>
      <el-table-column prop="lsxm" label="老师" width="180"> </el-table-column>
      <el-table-column prop="jcmc" label="教材"> </el-table-column>
      <el-table-column prop="zckcmc" label="教学计划进度"> </el-table-column>
      <el-table-column prop="dqkcmc" label="老师上课进度"> </el-table-column>
      <el-table-column prop="jxjd" label="课程状态"> </el-table-column>
      <el-table-column prop="address" label="班级信息">
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="toPages('classPerformance', scope.row.bjid)"
            >班级成绩</el-link
          >
          <br />
          <el-link type="primary" @click="toPages('stugrade', scope.row.bjid)"
            >学生成绩</el-link
          >
          <br />
          <el-link
            type="primary"
            @click="toPages('viewcCassCourseTeacher', scope.row.bjid)"
            >班级课表</el-link
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="supervisorClassInfoForm.pageNum"
      :limit.sync="supervisorClassInfoForm.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { updateClassPlanResult } from "@/api/teaching/classPlan";
import { supervisorClassInfo } from "@/api/basic/supervisorClassInfo.js";
export default {
  data() {
    return {
      supervisorClassInfoForm: {
        pageNum: 1,
        pageSize: 10,
      },
      supervisorClassInfoData: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      supervisorClassInfo(this.supervisorClassInfoForm).then((res) => {
        this.supervisorClassInfoData = res.rows;
        this.total = res.total;
      });
    },
    //跳转对应信息管理选项
    toPages(path, bjid) {
      sessionStorage.setItem(this.sessionKey, JSON.stringify(this.queryParams));
      this.getConfigKey(path).then((res) => [
        this.$router.push({
          path: `${res.msg}?bjid=${bjid}`,
        }),
      ]);
    },
    updateClassPlanClick() {
      updateClassPlanResult().then((res) => {
        this.msgSuccess(res.msg);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dd-class-info {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>
