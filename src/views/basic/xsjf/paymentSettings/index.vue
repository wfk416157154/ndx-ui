<template>
  <div class="paymentSettings">
    <el-form
      ref="paymentSettingsForm"
      :inline="true"
      :model="paymentSettingsForm"
      label-width="80px"
    >
      <el-form-item label="负责人">
        <el-select v-model="paymentSettingsForm.xqfzr" placeholder="请选择区域负责人">
          <el-option
            v-for="item in areaManagerList"
            :key="item.id"
            :label="item.xm"
            :value="item.xm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="校区名称" prop="kzzd1">
        <el-select
          v-model="paymentSettingsForm.kzzd1"
          filterable
          placeholder="请选择校区名称"
          @change="xqmcOnChange"
        >
          <el-option v-for="item in schoolList" :key="item.id" :label="item.xxmc" :value="item.id"></el-option>
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
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除设置</el-button>
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

    <el-dialog
      :close-on-click-modal="false"
      @closed="cancel"
      title="收费设置"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form
        ref="createdForm"
        :model="createdForm"
        :rules="rules"
        label-width="80px"
        style="padding : 20px"
      >
        <el-form-item label="总费用" prop="kzzd2">
          <el-input v-model="createdForm.kzzd2"></el-input>
        </el-form-item>
        <el-form-item label="期数" prop="kzzd4">
          <el-select v-model="createdForm.kzzd4" @change="getQs" placeholder="请选择期数">
            <el-option
              :label="item.dictLabel"
              :value="item.dictValue"
              v-for="(item,index) in paymentPeriodsList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <div v-for="(item,index) in createdForm.jsonStr" :key="index">
          <el-form-item :label="item.qsm" prop="bqyjfje">
            <el-input v-model="item.bqyjfje" @change="regTest"></el-input>
          </el-form-item>
          <el-form-item label="缴费时间" prop="chargeDateArr">
            <el-date-picker
              size=" mini"
              v-model="item.chargeDateArr"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00','23:59:59']"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="周期" prop="periodDateArr">
            <el-date-picker
              size=" mini"
              v-model="item.periodDateArr"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="进账方式" prop="kzzd5">
          <el-select v-model="createdForm.kzzd5" placeholder="请选择活动区域">
            <el-option
              v-for="(item,index) in listPaymentIncomeList"
              :key="index"
              :label="item.jzmc"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listSchool } from "@/api/basic/school";
import { listAreaManager } from "@/api/basic/areaManager";
import { listBjclass, updateBjclass } from "@/api/basic/bjclass";
import {
  listPaymentSetting,
  addBatchPaymentSetting,
  removePaymentSetting
} from "@/api/basic/paymentSetting";
import { listPaymentIncome } from "@/api/basic/paymentIncome";
export default {
  data() {
    return {
      paymentSettingsForm: {
        pageNum: 1,
        pageSize: 10,
        kzzd1: null,
        xqfzr: null
      },
      total: 0,
      paymentSettingsData: [],
      dialogVisible: false,
      createdForm: {
        kzzd2: "",
        kzzd4: 1,
        kzzd5: "",
        rybjid: "",
        jsonStr: [
          {
            chargeDateArr: [],
            periodDateArr: [],
            bqyjfje: "",
            rybjid: "",
            dnq: 1,
            qsm: `第${1}期`
          }
        ]
      },
      graduateStatusList: [],
      paymentPeriodsList: [],
      listPaymentIncomeList: [],
      rules: {
        kzzd2: [{ required: true, message: "请输入总费用", trigger: "blur" }],
        kzzd4: [{ required: true, message: "请选择期数", trigger: "change" }],
        kzzd5: [{ required: true, message: "请选择期数", trigger: "change" }]
      },
      // 校区列表
      schoolList: [],
      // 区域负责人列表
      areaManagerList: []
    };
  },
  created() {
    this.getDicts("graduateStatus").then(res => {
      this.graduateStatusList = res.data;
    });
    this.getDicts("payment_periods").then(res => {
      this.paymentPeriodsList = res.data;
    });
    listPaymentIncome().then(res => {
      this.listPaymentIncomeList = res.rows;
    });
    listAreaManager().then(res => {
      this.areaManagerList = res.rows;
    });
    // 获取校区
    listSchool().then(response => {
      this.schoolList = response.rows;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    xqmcOnChange(id) {
      listBjclass({ kzzd1: id }).then(response => {
        this.paymentSettingsData = response.rows;
      });
    },
    // 数据列表
    getList() {
      listBjclass(this.paymentSettingsForm).then(res => {
        this.paymentSettingsData = res.rows;
        this.total = res.total;
      });
    },
    //查询数据
    querySubmit() {
      this.getList();
    },
    // 设置
    settingSubmit(row) {
      this.dialogVisible = true;
      if (row) {
        // 总费用
        this.createdForm.kzzd2 = row.kzzd2;
        // 期数
        this.createdForm.kzzd4 = row.kzzd4 || 1;
        // 进账方式
        this.createdForm.kzzd5 = row.kzzd5;
        // 班级id
        this.createdForm.rybjid = row.id;
        this.createdForm.jsonStr[0].rybjid = row.id;
        this.getQs(this.createdForm.kzzd4);
      }
      this.getlistPaymentSetting(this.createdForm.rybjid, row);
    },
    //获取设置数据
    getlistPaymentSetting(bjid, row) {
      listPaymentSetting({ rybjid: bjid }).then(res => {
        if (res.code == 200) {
          if (res.rows.length != 0) {
            res.rows.map((value, index) => {
              value.qsm = `第${index + 1}期`;
            });
            if (row) {
              this.createdForm.jsonStr = res.rows;
            } else {
              for (let i = 0; i < res.rows.length; i++) {
                this.$set(this.createdForm.jsonStr, i, res.rows[i]);
              }
            }
          }
        }
      });
    },
    // 删除栓塞制
    handleDelete(row) {
      listPaymentSetting({ rybjid: row.id }).then(res => {
        if (res.rows.length == 0) {
          this.msgError("未设置缴费内容,请先设置");
        } else {
          this.$confirm("此操作将永久删除该设置吗, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              removePaymentSetting(row.id).then(res => {
                if (res.code == 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        }
      });
    },
    // 重置
    reset() {
      this.createdForm = {
        kzzd2: "",
        kzzd4: 1,
        kzzd5: "",
        rybjid: "",
        jsonStr: [
          {
            chargeDateArr: [],
            periodDateArr: [],
            bqyjfje: "",
            rybjid: "",
            dnq: 1,
            qsm: `第${1}期`
          }
        ]
      };
    },
    // 取消
    cancel() {
      this.dialogVisible = false;
      this.reset();
    },
    //动态期数
    getQs(value) {
      this.createdForm.kzzd4 =
        typeof value == "number" ? value : parseInt(value);
      let leg = this.createdForm.jsonStr.length;
      if (value < leg) {
        this.createdForm.jsonStr = this.createdForm.jsonStr.splice(0, value);
        return;
      }
      for (let i = 0; i < value; i++) {
        if (leg == i + 1) {
          leg++;
          this.$set(this.createdForm.jsonStr, i, {
            chargeDateArr: [],
            periodDateArr: [],
            bqyjfje: "",
            dnq: String(i + 1),
            rybjid: this.createdForm.rybjid,
            qsm: `第${i + 1}期`
          });
        }
      }
      this.settingSubmit();
    },
    // 考试类型字典翻译
    getStatus(row, column) {
      return this.selectDictLabel(this.graduateStatusList, row.status);
    },
    // 验证
    regTest(value) {
      if (value.length == 1) {
        let reg = /[1-9]/g;
        if (!reg.test(value)) {
          this.msgError("错误 : 缴费金额不能为负数和0,且只能输入数字");
          return reg.test(value);
        }
      } else {
        let reg = /^[1-9][0-9]*[0-9]$/g;
        if (!reg.test(value)) {
          this.msgError("错误 : 缴费金额不能为负数和0,且只能输入数字");
          return reg.test(value);
        }
      }
      return true;
    },
    // 保存
    saveSubmit() {
      let { jsonStr, kzzd2 } = this.createdForm;
      let fy = 0;
      for (let i = 0; i < jsonStr.length; i++) {
        fy += parseInt(jsonStr[i].bqyjfje);
        if (!this.regTest(jsonStr[i].bqyjfje)) {
          return;
        }
        if (
          jsonStr[i].chargeDateArr.length == 0 ||
          jsonStr[i].periodDateArr.length == 0 ||
          jsonStr[i].bqyjfje == ""
        ) {
          this.msgError("错误 : 请输入内容");
          return;
        }
      }
      if (fy != kzzd2) {
        this.msgError("错误 : 每期费用总和不等于你输入的总费用");
        return;
      }
      jsonStr = JSON.stringify(jsonStr);
      this.$refs["createdForm"].validate(valid => {
        if (valid) {
          addBatchPaymentSetting(jsonStr).then(res => {
            if (res.code == 200) {
              this.updateBjclassItem();
            }
          });
        }
      });
    },
    // 班级数据修改
    updateBjclassItem() {
      let { kzzd2, kzzd5, kzzd4, rybjid: id } = this.createdForm;
      updateBjclass({ kzzd2, kzzd5, kzzd4, id }).then(res => {
        if (res.code == 200) {
          this.dialogVisible = false;
          this.getList();
          this.reset();
          this.msgSuccess("成功 : 设置成功");
        } else {
          this.msgError(res.msg);
        }
      });
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
