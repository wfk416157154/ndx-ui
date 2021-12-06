<template>
  <div class="top-title">
    <div class="left">
      <img
        style="height : 100%"
        src="https://ndx-file.nandouxingriyu.com/statics/2021/11/15/18-1-8531e54a.jpg"
        alt
      />
    </div>
    <div class="right">
      <div>
        <p>张三</p>
        <p>总分 : 129分</p>
        <p>考试时间</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
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
