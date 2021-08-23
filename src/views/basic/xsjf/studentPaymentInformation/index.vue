<template>
  <div class="studentPaymentInformation">
    <div style="text-align : center">
      <h4>汉川二中19级21届--刘福音-武汉南斗星</h4>
      <h5>总费用18000（元）分期：第三期/共四期 本期应缴：4500（元）</h5>
    </div>

    <div style="margin-bottom : 20px">
      <el-button type="primary" size="mini">批量缴费</el-button>
      <el-button type="primary" size="mini" @click="specialAdd">特殊情况申请</el-button>
    </div>

    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :border="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="姓名" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="第一期">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="第二期">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="第三期">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="第四期">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="本期未缴费(总)">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="剩余未缴费(总)">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="queryData(scope.$index, scope.row)">缴费</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="缴费" :visible.sync="dialogVisible" width="30%">
      <el-form
        ref="studentPaymentInformationForm"
        :model="studentPaymentInformationForm"
        label-width="80px"
      >
        <el-form-item label="姓名">
          <div>
            <span>占山,占山,占山,占山,占山,占山,占山,占山,占山,占山,占山,占山,占山,占山,占山,占山,占山,占山,占山,占山,</span>
          </div>
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="studentPaymentInformationForm.name"></el-input>
        </el-form-item>
        <el-form-item label="期数">
          <el-input v-model="studentPaymentInformationForm.name"></el-input>
        </el-form-item>
        <el-form-item label="缴费金额">
          <el-input v-model="studentPaymentInformationForm.name"></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="studentPaymentInformationForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费凭证">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <img width="100%" :src="dialogImageUrl" alt />
        </el-form-item>
        <el-form-item label="转账时间">
          <el-input v-model="studentPaymentInformationForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="特殊情况申请" :visible.sync="specialVisible" width="30%">
      <el-form ref="specialForm" :model="specialForm" label-width="80px">
        <el-form-item label="班级">
          <div>
            <span>汉川二中19级21届</span>
          </div>
        </el-form-item>
        <el-form-item label="老师">
          <div>
            <span>吴珂</span>
          </div>
        </el-form-item>
        <el-form-item label="姓名">
          <div>
            <span>李东</span>
          </div>
        </el-form-item>
        <el-form-item label="减免类型">
          <el-select v-model="specialForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="减免金额">
          <el-input v-model="specialForm.name"></el-input>
        </el-form-item>
        <el-form-item label="减免期数">
          <el-checkbox-group v-model="specialForm.arr">
            <el-checkbox label="第一期"></el-checkbox>
            <el-checkbox label="第二期"></el-checkbox>
            <el-checkbox label="第三期"></el-checkbox>
            <el-checkbox label="第四期"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="申请原因">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="specialForm.yy"></el-input>
        </el-form-item>
        <el-form-item label="申请资料">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <img width="100%" :src="dialogImageUrl" alt />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="specialVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      multipleSelection: [],
      studentPaymentInformationForm: {},
      dialogImageUrl: "",
      dialogVisible: false,
      specialVisible: false,
      specialForm: {
        arr: []
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    queryData() {
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    specialAdd() {
      this.specialVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.studentPaymentInformation {
  width: 1005;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>