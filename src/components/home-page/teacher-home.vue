<template>
  <div class="teacher-home">
    <div class="top-info">
      <ul style="list-style:none;" class="clearfix">
        <li class="class-wrap" v-for="(item,index) in 2" :key="index">
          <h3>班级名称</h3>
          <p>开班时间 :</p>
          <p>开班人数 :</p>
          <p>
            教材 :
            <el-link type="success">教学计划</el-link>
          </p>
          <div>
            <p>开班照</p>
            <p>英语成绩</p>
          </div>
          <div>
            <el-link style="margin-right:10px" type="success">学生信息</el-link>
            <el-link style="margin-right:10px" type="success">学生成绩</el-link>
            <el-link style="margin-right:10px" type="success">班级课表</el-link>
            <el-link style="margin-right:10px" type="success">班级成绩</el-link>
          </div>
        </li>
        <li class="class-wrap">
          <h2>通知</h2>
          <ul style="list-style:none;">
            <li v-for="(item,index) in 2" :key="index">
              <p>未读信息2022-02-25</p>
              <p>未读信息2022-02-25</p>
              <p>未读信息2022-02-25</p>
              <p>未读信息2022-02-25</p>
              <p>未读信息2022-02-25</p>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="bottom-passageway">
      <h2>快速通道</h2>
      <div>
        <el-link style="margin-right:10px" type="success">填写工作日志</el-link>
        <el-link style="margin-right:10px" type="success">备课</el-link>
        <el-link style="margin-right:10px" type="success">报销</el-link>
        <el-link style="margin-right:10px" type="success">试卷管理</el-link>
        <el-link style="margin-right:10px" type="success">培训管理</el-link>
        <el-link style="margin-right:10px" type="success">培优补差</el-link>
        <el-link style="margin-right:10px" type="success">作业日志</el-link>
        <el-link style="margin-right:10px" type="success">教辅资料</el-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.teacher-home {
  width: 100%;
  height: 100%;
  .top-info {
    .class-wrap {
      width: 30%;
      height: 100%;
      border: 1px solid #aaa;
      padding: 10px;
      float: left;
      margin-left: 20px;
    }
  }
  .bottom-passageway {
    padding: 40px;
    box-sizing: border-box;
  }
}
</style>
