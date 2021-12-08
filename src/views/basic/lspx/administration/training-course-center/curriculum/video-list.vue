<template>
  <div class="video-list">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="课时管理" name="first">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="一致性 Consistency" name="1">
            <div class="video-item">
              <p>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</p>
              <el-button @click="seeVideo">查看</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="学员管理" border name="second">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <video controls width="100%" src=""></video>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: "second",
      activeNames: ["1"],
      dialogFormVisible: false,
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleChange(val) {
      console.log(val);
    },
    seeVideo(){
      this.dialogFormVisible = true
    }
  }
};
</script>

<style lang="scss" scoped>
.video-list {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  .video-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
