<template>
  <div class="video-list">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="课时管理" name="first">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item
            v-for="(item,index) in curriculumManageList"
            :key="index"
            :title="item.curriculumName"
            name="1"
          >
            <div class="video-item" v-for="(list,j) in item.videoList" :key="j">
              <p>{{list.videoName}}。</p>
              <el-button @click="seeVideo(list.wjlj)">查看</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="学员管理" name="second">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <video controls width="100%" :src="videoUrl"></video>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { curriculumManage } from "@/api/basic/curriculum";
export default {
  data() {
    return {
      activeName: "first",
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
      ],
      parentId: null,
      videoUrl: null,
      curriculumManageList: []
    };
  },
  created() {
    this.getDicts("videoType").then(response => {
      this.videoTypeOptions = response.data;
    });
    if (this.$route.query.name == "app-curriculum-index") {
      this.parentId = JSON.parse(this.$route.query.list).id;
      this.getList();
    }
  },
  methods: {
    getList() {
      curriculumManage({ id: this.parentId }).then(res => {
        this.curriculumManageList = res.data;
      });
    },
    seeVideo(url) {
      this.videoUrl = url;
      this.dialogFormVisible = true;
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
