<template>
  <div class="semester-view">
    <div class="wrap-left-tar">
      <ul>
        <li
          v-for="(item,index) in arr"
          @click="toGrade(item)"
          :class="{ 'back': item.ifClass}"
          :key="index"
        >{{item.name}}</li>
      </ul>
    </div>
    <div class="wrap-right-item">
      <div>
        <h3>新标准日语</h3>
        <h4>第一章节</h4>
      </div>
      <div class="wrap-ksItem">
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
.semester-view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .wrap-left-tar {
    width: 30%;
    ul {
      width: 100%;
      list-style: none;
      li {
        width: 80%;
        height: 40px;
        border: 2px solid #ccc;
        margin: 5px 0px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }
      li:hover {
        background: #409eff;
        color: #fff;
      }
      .back {
        background: #409eff;
        color: #fff;
      }
    }
  }
  .wrap-right-item {
    width: 70%;
    .wrap-ksItem {
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

