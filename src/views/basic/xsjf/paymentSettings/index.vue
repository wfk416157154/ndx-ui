<template>
  <div class="paymentSettings">
    <el-form
      ref="paymentSettingsForm"
      :inline="true"
      :model="paymentSettingsForm"
      label-width="80px"
    >
      <el-form-item label="负责人">
        <el-select v-model="paymentSettingsForm.paymentSettingsForm" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学校">
        <el-select v-model="paymentSettingsForm.paymentSettingsForm" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="paymentSettingsForm.paymentSettingsForm" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="querySubmit">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="paymentSettingsData" :border="true" stripe style="width: 100%">
      <el-table-column prop="xqmc" label="学校"></el-table-column>
      <el-table-column prop="rybjmc" label="班级"></el-table-column>
      <el-table-column prop="lsxm" label="老师"></el-table-column>
      <el-table-column prop="kbsj" label="开班时间"></el-table-column>
      <el-table-column prop="status" label="开班状态" :formatter="getStatus"></el-table-column>
      <el-table-column prop="cz" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="settingSubmit(scope.row)">设置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="paymentSettingsForm.pageNum"
      :limit.sync="paymentSettingsForm.pageSize"
      @pagination="getList"
    />

    <el-dialog title="收费设置" :visible.sync="dialogVisible" width="30%">
      <el-form ref="createdForm" :model="createdForm" label-width="80px" style="padding : 20px">
        <el-form-item label="总费用">
          <el-input v-model="createdForm.kzzd2"></el-input>
        </el-form-item>
        <el-form-item label="期数">
          <el-select v-model="createdForm.kzzd4" @change="getQs" placeholder="请选择活动区域">
            <el-option
              :label="item.dictLabel"
              :value="item.dictValue"
              v-for="(item,index) in paymentPeriodsList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <div v-for="(item,index) in createdForm.kzzd4" :key="index">
          <el-form-item label="第一期">
            <el-input v-model="createdForm.name" style="margin-bottom : 10px"></el-input>
            <el-date-picker
              size=" mini"
              v-model="createdForm.name"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="周期">
            <el-date-picker
              size=" mini"
              v-model="createdForm.kzzd5"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="进账方式">
          <el-select v-model="createdForm.name" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listBjclass } from "@/api/basic/bjclass";
import { listPaymentSetting } from "@/api/basic/paymentSetting";
export default {
  data() {
    return {
      paymentSettingsForm: {
        pageNum: 1,
        pageSize: 10,
        name: ""
      },
      total: 0,
      paymentSettingsData: [],
      dialogVisible: false,
      createdForm: {
        kzzd2: "",
        kzzd4: 1,
        kzzd5: ""
      },
      graduateStatusList: [],
      paymentPeriodsList: []
    };
  },
  created() {
    this.getDicts("graduateStatus").then(res => {
      this.graduateStatusList = res.data;
    });
    this.getDicts("payment_periods").then(res => {
      this.paymentPeriodsList = res.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      listBjclass(this.paymentSettingsForm).then(res => {
        this.paymentSettingsData = res.rows;
        this.total = res.total;
      });
    },
    //查询数据
    querySubmit() {},
    // 设置
    settingSubmit(row) {
      this.dialogVisible = true;
      // 总费用
      this.createdForm.kzzd2 = row.kzzd2;
      // 期数
      this.createdForm.kzzd4 = row.kzzd4 || 1;
      // 进账方式
      this.createdForm.kzzd5 = row.kzzd5;
      listPaymentSetting({ rybjid: row.id }).then(res => {
        console.log(res);
      });
    },
    // 重置
    reset() {},
    //动态期数
    getQs(value) {
        this.createdForm.kzzd4 = parseInt(value);
    },
    // 考试类型字典翻译
    getStatus(row, column) {
      return this.selectDictLabel(this.graduateStatusList, row.status);
    }
  }
};
</script>

<style lang="scss" scoped>
.paymentSettings {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>