<template>
  <div class="wrap-propress">
    <div style="width: 100px">
      {{ parseTime(nodeStartDate, "{y}-{m}-{d}") }}
    </div>
    <div class="propress">
      <div class="wrap-date">
        <div class="propress-item">
          <div
            class="propress-top-title"
            v-for="(item, index) in propressTitle"
            :key="index"
            :style="{ width: `${item.termPercent}%` }"
          >
            <div style="text-align: center">
              <span>{{ item.ksrq }} - {{ item.jzrq }}</span>
              <br />
              <span>{{ item.firstKcmc }} - {{ item.lastKcmc }}</span>
            </div>
          </div>
        </div>
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
            :style="{ width: `${title.termPercent}%` }"
          >
            <span>
              {{ title.xqmc }}
            </span>
          </div>
        </template>
      </div>
    </div>
    <div style="width: 100px">
      {{ parseTime(nodeEndDate, "{y}-{m}-{d}") }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      typeList: ["primary", "success", "info", "warning", "danger", "white"],
      titletype: ["danger", "primary"],
      nodeStartDate: null,
      nodeEndDate: null,
    };
  },
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
    nowCourseName: {
      type: String,
    },
    jcmc: {
      type: String,
    },
  },
  watch: {
    progressItem() {
      this.getData();
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let countArr = [];
      this.progressItem.forEach((value, index) => {
        value.style = {};
        countArr.push(value.type);
        value.show = false;
        value.typeShow = false;
        if (this.titletype.indexOf(value.type) != -1) {
          value.typeShow = true;
        }
      });
      this.typeList.forEach((el) => {
        if (countArr.lastIndexOf(el) != -1) {
          this.progressItem[countArr.lastIndexOf(el)].show = true;
        }
      });
      this.progressItem.forEach((value, index) => {
        value.style = this.getStyle(value, index);
      });
      this.nodeStartDate = this.propressTitle[0].ksrq;
      this.nodeEndDate =
        this.propressTitle[this.propressTitle.length - 1].jzrq;
    },
    getStyle(item, index) {
      let style = {
        width: `${item.percentage}%`,
      };
      if (item && item.show && item.typeShow) {
        style.borderRight = "1px solid #000";
      }
      if (index == 0) {
        style.borderLeft = "1px solid #000";
      }
      if (index == this.progressItem.length - 1) {
        style.borderRight = "1px solid #000";
      }
      return style;
    },
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
.wrap-propress {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  .propress {
    width: 100%;
    height: 100%;
    padding: 40px 10px;
    box-sizing: border-box;
    .wrap-x {
      width: 100%;
      .propress-x {
        display: flex;
        p {
          padding: 0px;
          margin: 0px;
        }
      }
    }
    .propress-title {
      display: flex;
      justify-content: space-between;
      .propress-line {
        // width: 1px;
        height: 20px;
        border-left: 1px solid #000;
        text-align: right;
        position: relative;
        span {
          position: absolute;
          bottom: -150%;
          right: 0;
          transform: translateX(50%);
        }
      }
      .propress-line:last-child {
        border-right: 1px solid #000;
      }
      .title-content {
        text-align: center;
      }
    }
    .wrap-date {
      width: 100%;
      height: 60px;
      .propress-item {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        .propress-top-title {
          border-left: 1px solid #000;
        }
        .propress-top-title:last-child {
          border-right: 1px solid #000;
        }
      }
      .show {
        border: none;
        color: #409eff;
        text-align: right;
        position: relative;
        span {
          position: absolute;
          top: -120%;
          right: 0;
          transform: translateX(50%);
          // transform: translateY(50%);
        }
      }
      .show:first-child {
        border-right: 1px solid #000;
      }
      .date-scale {
        height: 30px;
        border-right: 1px solid #000;
        .date-content {
          width: 100%;
          height: 100%;
          left: 50%;
        }
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
}
</style>