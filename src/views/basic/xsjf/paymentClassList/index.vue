<template>
  <div class="paymentClassList">
    <el-form
      ref="paymentClassListForm"
      :inline="true"
      :model="paymentClassListForm"
      label-width="80px"
    >
      <el-form-item label="负责人" prop="qyfzrid">
        <el-select v-model="paymentClassListForm.qyfzrid" placeholder="请选择区域负责人">
          <el-option
            v-for="item in areaManagerList"
            :key="item.id"
            :label="item.xm"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学校" prop="xxid">
        <el-select
          v-model="paymentClassListForm.xxid"
          filterable
          placeholder="请选择校区"
          @change="xqmcOnChange"
        >
          <el-option v-for="item in schoolList" :key="item.id" :label="item.xxmc" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级" prop="bjid">
        <el-select v-model="paymentClassListForm.bjid" placeholder="请选择班级">
          <el-option
            :label="item.rybjmc"
            :value="item.id"
            v-for="(item,index) in classList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级状态" prop="byzt">
        <el-select v-model="paymentClassListForm.byzt" placeholder="请选择班级状态">
          <el-option
            :label="item.dictLabel"
            :value="item.dictValue"
            v-for="(item,index) in graduateStatusList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="进账方式" prop="jzfs">
        <el-select v-model="paymentClassListForm.jzfs" placeholder="请选择进账方式">
          <el-option
            :label="item.jzmc"
            :value="item.id"
            v-for="(item,index) in paymentIncomeList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间周期" prop="sj">
        <el-date-picker
          size=" mini"
          v-model="paymentClassListForm.sj"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="班级缴费状态" label-width="120px" prop="bjjfzt">
        <el-select v-model="paymentClassListForm.bjjfzt" placeholder="请选择缴费状态">
          <el-option
            :label="item.dictLabel"
            :value="item.dictValue"
            v-for="(item,index) in paymentStatus"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getList">搜索</el-button>
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="paymentClassListData" :border="true" stripe style="width: 100%;font-size : 18px">
      <el-table-column prop="qyfzr" label="负责人"></el-table-column>
      <el-table-column prop="xxmc" label="学校"></el-table-column>
      <el-table-column prop="rybjmc" label="班级"></el-table-column>
      <el-table-column prop="lsxm" label="老师"></el-table-column>
      <el-table-column prop="bjjfzt" label="班级缴费状态">
        <template slot-scope="scope">
          <div>
            <dict-tag :options="paymentStatus" :value="scope.row.bjjfzt" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bqjfzt" label="本期缴费状态">
        <template slot-scope="scope">
          <div>
            <dict-tag :options="bqStatus" :value="scope.row.bqjfzt" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sfsm" label="收费说明"></el-table-column>
      <el-table-column prop="qs" label="期数"></el-table-column>
      <el-table-column prop="bjrs" label="开班人数"></el-table-column>
      <el-table-column prop="sfje" label="收费金额"></el-table-column>
      <el-table-column prop="wjje" label="未交金额"></el-table-column>
      <el-table-column prop="cz" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="queryData(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="paymentClassListForm.pageNum"
      :limit.sync="paymentClassListForm.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listSchool } from "@/api/basic/school";
import { listAreaManager } from "@/api/basic/areaManager";
import { listBjclass } from "@/api/basic/bjclass";
import { listAndPhoto } from "@/api/basic/paymentIncome";
import { paymentClassPageQuery } from "@/api/basic/paymentClassList";
export default {
  data() {
    return {
      paymentClassListForm: {
        pageNum: 1,
        pageSize: 10,
        bjid: null,
        byzt: null,
        bjjfzt: null,
        jzfs: null,
        qyfzrid: null,
        sj: null,
        xxid: null
      },
      paymentClassListData: [],
      // 区域负责人列表
      areaManagerList: [],
      // 校区列表
      schoolList: [],
      // 班级
      classList: [],
      // 班级状态
      graduateStatusList: [],
      total: 0,
      // 进账方式
      paymentIncomeList: [],
      // 缴费状态
      paymentStatus: [],
      bqStatus : []
    };
  },
  created() {
    listAreaManager().then(res => {
      this.areaManagerList = res.rows;
    });
    listSchool().then(response => {
      this.schoolList = response.rows;
    });
    this.getDicts("graduateStatus").then(res => {
      this.graduateStatusList = res.data;
    });
    listAndPhoto(this.queryParams).then(response => {
      this.paymentIncomeList = response.rows;
    });
    this.getDicts("payment_status").then(res => {
      this.paymentStatus = res.data;
    });
    this.getDicts("bjjf_qszt").then(res => {
      this.bqStatus = res.data;
    });
  },
  mounted() {},
  methods: {
    // 获取班级
    xqmcOnChange(xqid) {
      listBjclass({ kzzd1: xqid }).then(res => {
        this.classList = res.rows;
      });
    },
    // 查询数据列表
    getList() {
      paymentClassPageQuery(this.paymentClassListForm).then(res => {
        this.paymentClassListData = res.rows;
        this.total = res.total;
      });
    },
    // 重置
    resetQuery() {
      this.resetForm("paymentClassListForm");
      this.getList();
    },
    // 导出
    handleExport() {
      this.download(
        "basic/paymentFinancial/export",
        {
          ...this.paymentClassListForm
        },
        `缴费设置-${new Date().getTime()}.xlsx`
      );
    },
    // 查看
    queryData(row) {
      this.getConfigKey("paymentClassListDeatils").then(res => {
        if (res.code == 200) {
          this.$router.push({
            path: res.msg + row.bjid
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.paymentClassList {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>
