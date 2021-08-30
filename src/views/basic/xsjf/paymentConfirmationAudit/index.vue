<template>
  <div class="paymentConfirmationAudit">
    <el-form
      ref="paymentConfirmationAuditForm"
      :inline="true"
      :model="paymentConfirmationAuditForm"
      label-width="80px"
    >
      <el-form-item label="负责人" prop="qyfzrxm">
        <el-select v-model="paymentConfirmationAuditForm.qyfzrxm" placeholder="请选择区域负责人">
          <el-option
            v-for="item in areaManagerList"
            :key="item.id"
            :label="item.xm"
            :value="item.xm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学校" prop="schoolId">
        <el-select
          v-model="paymentConfirmationAuditForm.schoolId"
          filterable
          placeholder="请选择校区"
          @change="xqmcOnChange"
        >
          <el-option v-for="item in schoolList" :key="item.id" :label="item.xxmc" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级" prop="bjid">
        <el-select v-model="paymentConfirmationAuditForm.bjid" placeholder="请选择班级">
          <el-option
            :label="item.rybjmc"
            :value="item.id"
            v-for="(item,index) in classList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="缴费方式" prop="jffs">
        <el-select v-model="paymentConfirmationAuditForm.jffs" placeholder="请选择班级状态">
          <el-option
            :label="item.dictLabel"
            :value="item.dictValue"
            v-for="(item,index) in paymentWay"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="进账方式" prop="jzfs">
        <el-select v-model="paymentConfirmationAuditForm.jzfs" placeholder="请选择进账方式">
          <el-option
            :label="item.jzmc"
            :value="item.id"
            v-for="(item,index) in paymentIncomeList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getList(3)">已审批</el-button>
        <el-button type="primary" size="mini" @click="getList(2)">未审批</el-button>
        <el-button type="primary" size="mini" @click="getList()">全部</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="paymentConfirmationAuditData" :border="true" stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="xsxm" label="学生姓名"></el-table-column>
      <el-table-column prop="zzsj" label="转账时间"></el-table-column>
      <el-table-column prop="rybjmc" label="班级"></el-table-column>
      <el-table-column prop="lsxm" label="老师"></el-table-column>
      <el-table-column prop="bcyjf" label="缴费金额"></el-table-column>
      <el-table-column prop="jffs" label="缴费方式">
        <template slot-scope="scope">
          <div>
            <dict-tag :options="paymentWay" :value="scope.row.jffs" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="jzfs" label="进账方式">
        <template slot-scope="scope">
          <div>
            <dict-tag :options="paymentIncomeList" :value="scope.row.jzfs" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="qyfzrxm" label="负责人"></el-table-column>
      <el-table-column prop="jfpzid" label="凭证"></el-table-column>
      <el-table-column prop="cz" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            :disabled="scope.row.jfzt == 3 ? true : false"
            @click="paymentSubmit(scope.row,1)"
          >已收到</el-button>
          <el-button
            size="mini"
            type="primary"
            :disabled="scope.row.jfzt == 3 ? true : false"
            @click="paymentSubmit(scope.row,0)"
          >未收到</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="paymentConfirmationAuditForm.pageNum"
      :limit.sync="paymentConfirmationAuditForm.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listSchool } from "@/api/basic/school";
import { listAreaManager } from "@/api/basic/areaManager";
import { listBjclass } from "@/api/basic/bjclass";
import { listAndPhoto } from "@/api/basic/paymentIncome";
import {
  queryStuTeacherChecklist,
  checkStuPayment
} from "@/api/basic/paymentConfirmationAudit";
export default {
  data() {
    return {
      paymentConfirmationAuditForm: {
        pageNum: 1,
        pageSize: 10,
        qyfzrxm: null,
        schoolId: null,
        bjid: null,
        jffs: null,
        jzfs: null
      },
      paymentConfirmationAuditData: [],
      // 区域负责人列表
      areaManagerList: [],
      // 校区列表
      schoolList: [],
      // 班级
      classList: [],
      total: 0,
      // 进账方式
      paymentIncomeList: [],
      // 进账方式
      paymentWay: [],
    };
  },
  created() {
    listSchool().then(response => {
      this.schoolList = response.rows;
    });
    listAreaManager().then(res => {
      this.areaManagerList = res.rows;
    });
    listAndPhoto(this.queryParams).then(response => {
      this.paymentIncomeList = response.rows;
    });
    this.getDicts("payment_way").then(res => {
      this.paymentWay = res.data;
    });
  },
  methods: {
    // 获取班级
    xqmcOnChange(xqid) {
      if (!xqid) {
        this.classList = [];
        return;
      }
      listBjclass({ kzzd1: xqid }).then(res => {
        this.classList = res.rows;
      });
    },
    // 查询数据列表
    getList(jfzt) {
      if (jfzt) {
        this.paymentConfirmationAuditForm.jfzt = jfzt;
      } else {
        this.paymentConfirmationAuditForm.jfzt = "";
      }
      queryStuTeacherChecklist(this.paymentConfirmationAuditForm).then(res => {
        this.paymentConfirmationAuditData = res.rows;
        this.total = res.total;
      });
    },
    // 导出
    handleExport() {},
    // 重置
    resetQuery() {
      this.resetForm("paymentConfirmationAuditForm");
      this.xqmcOnChange();
      this.getList();
    },
    // 是否收到
    paymentSubmit(row, status) {
      let json = {
        shzt: status
      };
      if (row.batchid) {
        json.batchid = row.batchid;
      } else {
        json.xsbh = row.xsbh;
        json.qsid = row.qsid;
      }
      if (!status) {
        this.$confirm(
          "点击'attr-value未收到'将删除当条缴费记录, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.submitBtn(json);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.submitBtn(json);
      }
    },
    submitBtn(json) {
      checkStuPayment(json).then(res => {
        if (res.code == 200) {
          this.getList();
          this.msgSuccess("成功 : 审核完成");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.paymentConfirmationAudit {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>