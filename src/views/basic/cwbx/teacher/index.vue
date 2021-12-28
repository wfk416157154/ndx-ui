<template>
  <div class="public-reimbursement">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="报销类型">
        <el-select v-model="queryParams.region">
          <el-option
            v-for="(item,index) in expenseType"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.region" placeholder="活动区域">
          <el-option
            v-for="(item,index) in expenseAuditStatus"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发生时间">
        <el-date-picker
          v-model="queryParams.value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="报销时间">
        <el-date-picker
          v-model="queryParams.value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button type="primary" @click="addReimbursement">添加报销</el-button>
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
      <el-table-column label="报销说明">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="附件" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票状态" width="180">
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
          <el-button size="mini" @click="handleView(scope.$index, scope.row)">查 看</el-button>
          <el-button size="mini" @click="handleWithdraw(scope.$index, scope.row)">撤 回</el-button>
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

    <el-dialog title="添加报销" :visible.sync="dialogFormVisible">
      <table style="width : 100%;" border="1" cellspacing="0">
        <tbody>
          <tr>
            <td class="tds">报销人</td>
            <td>{{form.applyName}}</td>
          </tr>
          <tr>
            <td class="tds">所属班级</td>
            <td>
              <el-select v-model="form.departName">
                <el-option
                  v-for="(item,index) in bjlist"
                  :key="index"
                  :label="item.rybjmc"
                  :value="item.id"
                ></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td class="tds">报销类型</td>
            <td>
              <el-select v-model="form.expenseCode" @change="getExpenseData">
                <el-option
                  v-for="(item,index) in expenseType"
                  :key="index"
                  :label="item.dictLabel"
                  :value="item.dictCode"
                ></el-option>
              </el-select>-
              <el-select v-model="form.expenseData">
                <el-option
                  v-for="(item,index) in expenseData"
                  :key="index"
                  :label="item.dictLabel"
                  :value="item.dictCode"
                ></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td class="tds">发生时间</td>
            <td>
              <el-date-picker v-model="form.happenTimeArr" type="date" placeholder="选择日期"></el-date-picker>
            </td>
          </tr>
          <tr>
            <td class="tds">
              费用金额
              大写
            </td>
            <td>
              <el-input v-model="form.cost" placeholder="请输入金额"></el-input>
              <span>{{form.costUpper}}</span>
            </td>
          </tr>
          <tr>
            <td class="tds">费用说明</td>
            <td>
              <el-popover placement="right" width="400" trigger="click">
                <div>
                  <p>7.15武汉-随州 火车票 50元</p>
                  <p>7.18随州-武汉 火车票50元</p>
                  <p>7.15-7.17随州住宿费3晚 住宿费300元</p>
                  <p>随县二中23届3-10课打印费50元</p>
                  <p>随县二中23届 21年下半年期中考试试卷打印费60元</p>
                </div>
                <el-button slot="reference" type="primary">查看填写模板</el-button>
              </el-popover>
              <br />
              <br />
              <el-input type="textarea" v-model="form.costExplain" :rows="5" placeholder="请输入内容"></el-input>
            </td>
          </tr>
          <tr>
            <td class="tds">附件</td>
            <td>
              <el-select v-model="form.invoiceFormat">
                <el-option label="电子发票" value="shanghai"></el-option>
              </el-select>
              <br />
              <br />
              <el-upload
                class="upload-demo"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </td>
          </tr>
          <tr>
            <td class="tds">审批</td>
            <td>李翠平</td>
          </tr>
          <tr>
            <td class="tds">操作</td>
            <td>
              <el-button type="success">提 交</el-button>
            </td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addExpense, editExpense, listExpense } from "@/api/basic/cw-teacher";
import { listBjclass } from "@/api/basic/bjclass";
import { listData } from "@/api/system/dict/data";
export default {
  data() {
    return {
      form: {
        applyId: this.$store.state.user.glrid,
        applyName: this.$store.state.user.nickName
      },
      tableData: [{}],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dialogFormVisible: false,
      expenseType: [],
      expenseDataList: [],
      expenseData: [],
      expenseAuditStatus: [],
      bjlist: []
    };
  },
  created() {
    this.getDicts("expense_type").then(response => {
      this.expenseType = response.data;
    });
    this.getDicts("expense_data").then(response => {
      this.expenseDataList = response.data;
    });
    this.getDicts("expense_audit_status").then(response => {
      this.expenseAuditStatus = response.data;
    });
    listBjclass().then(res => {
      this.bjlist = res.rows;
    });
  },
  methods: {
    getList() {
      console.log("submit!");
    },
    handleView() {
      this.dialogFormVisible = true;
    },
    addReimbursement() {
      this.dialogFormVisible = true;
    },
    getExpenseData(value) {
      this.expenseData = [];
      this.expenseType.forEach(value => {
        if (value.dictCode == this.form.expenseCode) {
          this.form.expenseType = value.dictValue;
        }
      });
      this.expenseDataList.forEach(value => {
        if (value.remark == this.form.expenseCode) {
          this.form.expenseType = value.dictValue;
          this.expenseData.push(value);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.public-reimbursement {
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
