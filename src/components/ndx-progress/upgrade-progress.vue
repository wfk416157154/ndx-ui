<template>
  <div class="propress">
    <div class="propress-title">
      <template v-if="propressTitle && propressTitle.length > 0">
        <div
          class="propress-line"
          v-for="(title, j) in propressTitle"
          :key="j"
        ></div>
      </template>
    </div>
    <div class="wrap-box">
      <div class="propress-item">
        <div
          v-for="(item, index) in progressItem"
          :key="index"
          :class="item.type"
          :style="{ width: `${item.percentage}%` }"
        ></div>
      </div>
    </div>
    <div class="propress-title">
      <template v-if="propressTitle && propressTitle.length > 0">
        <div
          class="propress-line"
          v-for="(title, j) in propressTitle"
          :key="j"
        ></div>
      </template>
    </div>
    <div class="propress-title">
      <template v-if="propressTitle && propressTitle.length > 0">
        <div class="title-content" v-for="(title, j) in propressTitle" :key="j">
          <span>{{ title }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  //   data() {
  //     return {
  //       propressNumber: [],
  //       propressTitle: [],
  //       propressDate:[]
  //     };
  //   },
  props: {
    progressItem: {
      type: Array,
      default() {
        return [];
      },
    },
    propressTitle: {
      type: Array,
      default() {
        return [];
      },
    },
    propressDate: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {
    console.log(this.propressTitle);
  },
};
</script>

<style lang="scss" scoped>
.primary {
  background-color: #409eff;
}
.success {
  background-color: #67c23a;
}
.info {
  background-color: #909399;
}
.warning {
  background-color: #e6a23c;
}
.danger {
  background-color: #f56c6c;
}
.white {
  background-color: #eee;
}
.propress {
  width: 100%;
  height: 100%;
  .propress-title {
    display: flex;
    justify-content: space-between;
    .propress-line {
      width: 1px;
      height: 15px;
      //   border: 1px solid #000;
      background-color: #000;
    }
    .title-content {
      //   color: #67c23a;
      text-align: center;
    }
  }
  .wrap-box {
    width: 100%;
    height: 15px;
    display: flex;
    background: #eee;
    border-radius: 10px;
    overflow: hidden;
    .propress-item {
      width: 100%;
      height: 100%;
      display: flex;
    }
  }
}
</style>