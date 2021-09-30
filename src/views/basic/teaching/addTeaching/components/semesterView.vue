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
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
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
      ],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
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

<style lang="scss">
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
  }
}
</style>

