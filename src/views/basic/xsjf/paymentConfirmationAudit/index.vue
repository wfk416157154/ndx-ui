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
        <el-select v-model="paymentConfirmationAuditForm.jffs" placeholder="请选择缴费方式">
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
            v-for="(item,index) in paymentIncomeList"
            :label="item.jzmc"
            :value="item.id"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="缴费时间" prop="jzfs">
        <el-date-picker
          v-model="paymentConfirmationAuditForm.zzsjDate"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="mini" @click="getList('3')">已审批</el-button>
        <el-button type="warning" size="mini" @click="getList('2')">未审批</el-button>
        <el-button type="primary" size="mini" @click="getList()">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="paymentConfirmationAuditData" :border="true" stripe style="width: 100%;font-size : 18px">
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
      <el-table-column prop="jfzt" label="缴费状态">
        <template slot-scope="scope">
          <div>
            <dict-tag :options="paymentStatus" :value="scope.row.jfzt" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="jzfs" label="进账方式"></el-table-column>
      <el-table-column prop="qyfzrxm" label="负责人"></el-table-column>
      <el-table-column prop="jfpzid" label="凭证" v-if="false"></el-table-column>
      <el-table-column
        prop="jfpzidArr"
        label="凭证图片"
        :width="flexColumnWidth('jfpzidArr',paymentConfirmationAuditData)"
      >
        <template slot-scope="scope">
          <div class="block" style="display : flex; width : 100% ; height : 100%">
            <el-image
              style="width: 60px; height: 60px; margin : 0px 5px"
              v-for="(item,index) in scope.row.jfpzidArr"
              :key="index"
              :src="item"
              :preview-src-list="scope.row.jfpzidArr"
            >
              <div
                slot="error"
                style="width : 100%; height : 100%; display : flex; align-items : center;background : #eee; font-size : 12px;justify-content:center;color : #c0c4cc"
                class="image-slot"
              >
                <span>加载失败</span>
              </div>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="cz" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            :disabled="scope.row.jfzt != '2' ? true : false"
            @click="paymentSubmit(scope.row,1)"
          >已收到</el-button>
          <el-button
            size="mini"
            type="danger"
            :disabled="scope.row.jfzt != '2' ? true : false"
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
      @pagination="getList()"
    />
  </div>
</template>

<script>
import { listSchool } from "@/api/basic/school";
import { listAreaManager } from "@/api/basic/areaManager";
import { listBjclass } from "@/api/basic/bjclass";
import { listPaymentIncome } from "@/api/basic/paymentIncome";
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
      // 缴费方式
      paymentWay: [],
      // 缴费状态
      paymentStatus: []
    };
  },
  created() {
    listSchool().then(response => {
      this.schoolList = response.rows;
    });
    listAreaManager().then(res => {
      this.areaManagerList = res.rows;
    });
    listPaymentIncome().then(response => {
      this.paymentIncomeList = response.rows;
    });
    this.getDicts("payment_way").then(res => {
      this.paymentWay = res.data;
    });
    this.getDicts("payment_status").then(res => {
      this.paymentStatus = res.data;
    });
    this.getList("2"); // 默认进来只查询待审批的数据
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
        this.paymentConfirmationAuditForm.jfzt = null;
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
        shzt: status,
        xsbh: row.xsbh,
        qsid: row.qsid,
        batchid: row.batchid
      };
      if (0 == status) {
        this.$confirm(
          "点击'未收到'将删除当条缴费记录,并且需要当事人重新提交缴费记录, 是否继续?",
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
    },
    // 宽度适配
    flexColumnWidth(str, tableData) {
      let arr = [];
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i] && tableData[i][str] && tableData[i][str].length > 0) {
          tableData.forEach(obj => {
            if (obj[str] && obj[str].length) arr.push(obj[str].length);
          });
        } else {
          continue;
        }
      }
      return Math.max.call(null, ...arr) * 75;
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
