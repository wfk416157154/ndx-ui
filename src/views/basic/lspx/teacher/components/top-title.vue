<template>
  <div class="top-title">
    <div class="left">
      <img style="height : 100%" :src="teacherInfoDto.lstx" alt />
    </div>
    <div class="right">
      <div>
        <p v-if="teacherInfoDto.teacherName">老师 : {{teacherInfoDto.teacherName}}</p>
        <p v-else>老师 : {{teacherInfoDto.lsxm}}</p>
        <p>总分 : {{teacherInfoDto.zf}}分</p>
        <p>考试时间: {{teacherInfoDto.fpsj}} 至 {{teacherInfoDto.wcsj}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["teacherInfoDto"],
  created() {
    console.log(this.teacherInfoDto);
  }
};
</script>

<style lang="scss" scoped>
.top-title {
  width: 100%;
  height: 100%;
  background-color: #eee;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  .left {
    width: 120px;
    height: 120px;
  }
  .right {
  }
}
</style>
