<template>
  <div class="wrap-notice-bar" v-if="switchNotice">
    <div class="content">
      <div
        style="width : 30px;background : rgb(255, 251, 232);height : 30px;position : fixed;z-index : 10000;left : 0;"
      ></div>
      <span class="wrap-title" ref="title">{{title}}</span>
      <div
        style="width : 30px;background : rgb(255, 251, 232);height : 30px;position : fixed;z-index : 10000;right : 0;"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["switchNotice", "title"],
  mounted() {
    this.notice();
  },
  methods: {
    notice() {
      let son = window.innerWidth;
      let timer;
      clearInterval(timer);
      timer = setInterval(() => {
        son -= 2;
        this.$refs.title.style.marginLeft = son + "px";
        if (
          this.$refs.title.offsetLeft <= -(this.$refs.title.offsetWidth - 30)
        ) {
          this.$refs.title.style.marginRight =
            window.innerWidth + this.$refs.title.offsetWidth - 30;
          son = window.innerWidth;
        }
      }, 50);
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap-notice-bar {
  width: 100%;
  height: 30px;
  background-color: rgb(255, 251, 232);
  position: fixed;
  top: 0;
  z-index: 10000;
  color: rgb(242, 146, 73);
  overflow: hidden;
  .content {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    .wrap-title {
      // position: absolute;
      white-space: nowrap;
    }
  }
}
</style>
