<template>
  <div class="qrientation-assignment">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="老师">
        <el-input v-model="queryParams.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="培训类别">
        <el-select v-model="queryParams.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="querySubmit">查询</el-button>
        <el-button type="success" @click="assignedSubmit">已分配</el-button>
        <el-button type="danger" @click="unassignedSubmit">未分配</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="日期" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.name }}</p>
            <p>住址: {{ scope.row.address }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="distributionSubmit(scope.$index, scope.row)"
          >分 配</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="querySubmit"
    />

    <el-dialog title="分配" :visible.sync="dialogFormVisible">
      <table style="width : 100%;" border="1" cellspacing="0">
        <tbody>
          <tr>
            <td class="tds">老师</td>
            <td>吴珂</td>
          </tr>
          <tr>
            <td class="tds">课程名称</td>
            <td>
              <el-select v-model="assignmentForm.region" placeholder="活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </td>
          </tr>
          <tr></tr>
          <tr>
            <td class="tds">课程选择</td>
            <td>
              <el-checkbox-group v-model="assignmentForm.checkList">
                <el-checkbox label="复选框 A"></el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
          <tr>
            <td class="tds">视频类别</td>
            <td>
              <el-checkbox-group v-model="assignmentForm.checkList">
                <el-checkbox label="复选框 A">qwerwqr</el-checkbox>
              </el-checkbox-group>
              <el-radio v-model="assignmentForm.radio" label="1">a卷</el-radio>
            </td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        user: "",
        region: ""
      },
      total: 0,
      assignmentForm: {
        checkList: []
      },
      dialogFormVisible: false,
      dialogFormVisibleView: false,
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
    querySubmit() {
      console.log("submit!");
    },
    assignedSubmit() {
      console.log("submit!");
    },
    unassignedSubmit() {
      console.log("submit!");
    },
    distributionSubmit(index, row) {
      this.dialogFormVisible = true;
      console.log(index, row);
    }
  }
};
</script>

<style lang="scss" scoped>
.qrientation-assignment {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  th,
  td {
    padding: 40px;
  }
  .tds {
    width: 20%;
  }
}
</style>
