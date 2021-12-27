<template>
  <div class="public-reimbursement">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="报销类型">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发生时间">
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="复审时间">
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="报销人">
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="纸质发票状态">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额范围">
        <el-input v-model="input" style="width : 100px" placeholder="请输入内容"></el-input>-
        <el-input v-model="input" style="width : 100px" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
        <el-button type="primary" @click="handleSettlement">结算</el-button>
        <el-button type="primary" @click="noPrint">未打印</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="报销人" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报销类型" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发生时间" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报销金额" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报销说明" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票格式" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="附件" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.row)">查 看</el-button>
          <el-button size="mini" @click="handlePrint(scope.row)">打 印</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog title="结算" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="报销人" label-width="100px">
          <span>张三，李四，王五，赵六</span>
        </el-form-item>
        <el-form-item label="报销总金额" label-width="100px">
          <span>1500100.00元(壹佰伍拾万壹佰圆整)</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="toSettlement">结 算</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formInline: {
        user: "",
        region: ""
      },
      tableData: [{}],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dialogFormVisible: false
    };
  },
  methods: {
    getList() {
      console.log("submit!");
    },
    handleView(row) {
      //public-reimbursement-details
      this.getConfigKey("public-reimbursement-details").then(res => {
        this.$router.push({
          path: res.msg,
          query: {
            item: JSON.stringify(row)
          }
        });
      });
    },
    handleExport() {},
    handleSettlement() {
      this.dialogFormVisible = true;
    },
    toSettlement() {
      this.dialogFormVisible = false;
    },
    handlePrint(row) {
      // print-page
      this.getConfigKey("print-page").then(res => {
        this.$router.push({
          path: res.msg,
          query: {
            item: JSON.stringify(row)
          }
        });
      });
    },
    noPrint() {}
  }
};
</script>

<style lang="scss" scoped>
.public-reimbursement {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>
