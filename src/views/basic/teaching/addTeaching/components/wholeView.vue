<template>
  <div class="Whole-view">
    <div class="Whole-right-item" v-for="(item,index) in 7" :key="index">
      <div>
        <h3>新标准日语</h3>
        <h4>第一章节</h4>
      </div>
      <div class="wrap-Whole">
        <ul class="ksItem">
          <li>
            <div>
              <span>第一课</span>
              <span style="margin-left : 10px;color : #67C23A">新课</span>
            </div>
            <div>
              <span>2021/9/12</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      arr: [
        {
          name: "高一上",
          ifClass: false
        },
        {
          name: "高二上",
          ifClass: false
        },
        {
          name: "高三上",
          ifClass: false
        }
      ]
    };
  },
  methods: {
    toGrade(item) {
      console.log(item);
      this.arr.forEach(value => {
        if (value.name == item.name) {
          value.ifClass = true;
        } else {
          value.ifClass = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.Whole-view {
  width: 100%;
  height: 100%;
  .Whole-right-item {
    width: 100%;
    .wrap-Whole {
      width: 100%;
      .ksItem {
        width: 100%;
        list-style: none;
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
}
</style>

