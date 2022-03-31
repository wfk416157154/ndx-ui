<template>
  <div class="InventoryRegistration">
    <el-form :inline="true" :model="inventoryRegistrationForm">
      <el-form-item label="资料名称">
        <el-select v-model="inventoryRegistrationForm.zlmc">
          <el-option label="一" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="inventoryRegistrationForm.sjArr"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button type="success" @click="handleRegister">登记</el-button>
        <el-button type="success" @click="addData">新增资料</el-button>
        <el-button type="warning" @click="handleExport">导出</el-button>
        <el-button type="warning" @click="handleExportStockData"
          >导出库存数据</el-button
        >
        <el-button type="warning" @click="handleExportDetails"
          >导出收/出详情</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="inventoryRegistrationData" border style="width: 100%">
      <el-table-column prop="index" label="序号" width="180"> </el-table-column>
      <el-table-column prop="zlmc" label="资料名称"> </el-table-column>
      <el-table-column prop="kcsl" label="库存数量" width="200px">
      </el-table-column>
      <el-table-column prop="srzcxq" label="收入支出详情" width="300px">
        <template slot-scope="scope">
          <el-popover placement="right" width="700px" trigger="click">
            <el-table :data="detailsData" border>
              <el-table-column
                width="150px"
                property="date"
                label="日期"
              ></el-table-column>
              <el-table-column
                width="100px"
                property="name"
                label="收入/支出"
              ></el-table-column>
              <el-table-column
                width="100px"
                property="address"
                label="数量"
              ></el-table-column>
              <el-table-column
                width="150px"
                property="address"
                label="说明备注"
              ></el-table-column>
            </el-table>
            <el-button slot="reference">查看详情</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="inventoryRegistrationForm.pageNum"
      :limit.sync="inventoryRegistrationForm.pageSize"
      @pagination="getList"
    />

    <el-dialog title="登记" :visible.sync="handleRegisterVisible">
      <table style="width: 100%" border="1" cellspacing="0">
        <tbody>
          <tr>
            <td
              style="
                padding: 20px;
                box-sizing: border-box;
                text-align: center;
                width: 200px;
              "
            >
              登记类型
            </td>
            <td
              style="
                padding: 20px;
                box-sizing: border-box;
                display: flex;
                justify-content: scope-bewteen;
              "
            >
              <div style="margin-right: 20px">
                <el-select v-model="handleRegisterForm.count">
                  <el-option label="新增" value="1"></el-option>
                  <el-option label="减少" value="0"></el-option>
                </el-select>
              </div>
              <div
                style="margin-right: 20px"
                v-if="handleRegisterForm.count == 1"
              >
                <el-select v-model="handleRegisterForm.type">
                  <el-option label="新增的" value="1"></el-option>
                </el-select>
              </div>
              <div style="margin-right: 20px" v-else>
                <el-select v-model="handleRegisterForm.type">
                  <el-option label="减少的" value="1"></el-option>
                </el-select>
              </div>
            </td>
          </tr>
          <tr>
            <td
              style="padding: 20px; box-sizing: border-box; text-align: center"
            >
              资料名称
            </td>
            <td style="padding: 20px; box-sizing: border-box">
              <el-button class="el-icon-plus" @click="addDataName"></el-button>
              <br />
              <br />
              <div
                v-for="(item, index) in handleRegisterForm.dataNameList"
                :key="index"
                style="margin-bottom: 20px"
              >
                <el-select style="margin-right: 20px" v-model="item.zlmc">
                  <el-option label="减少的" value="1"></el-option>
                </el-select>
                <el-input-number
                  style="margin-right: 20px"
                  v-model="item.num"
                  @change="handleChange"
                  :min="1"
                  :max="10"
                  label="描述文字"
                ></el-input-number>
                <el-button
                  class="el-icon-delete"
                  @click="dropDataName(index)"
                ></el-button>
              </div>
            </td>
          </tr>
          <tr>
            <td
              style="padding: 20px; box-sizing: border-box; text-align: center"
            >
              资料出处
            </td>
            <td style="padding: 20px; box-sizing: border-box">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="handleRegisterForm.textarea"
              >
              </el-input>
            </td>
          </tr>
          <tr>
            <td
              style="padding: 20px; box-sizing: border-box; text-align: center"
            >
              备注
            </td>
            <td style="padding: 20px; box-sizing: border-box">
              <editor v-model="handleRegisterForm.remark" :min-height="200" />
            </td>
          </tr>
        </tbody>
      </table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleRegisterVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRegisterSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="新增资料" :visible.sync="addDataVisible">
      <table style="width: 100%" border="1" cellspacing="0">
        <tbody>
          <tr>
            <td
              style="
                padding: 20px;
                box-sizing: border-box;
                text-align: center;
                width: 200px;
              "
            >
              资料名称
            </td>
            <td style="padding: 20px; box-sizing: border-box">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="addDataForm.zlmc"
              >
              </el-input>
            </td>
          </tr>
          <tr>
            <td
              style="
                padding: 20px;
                box-sizing: border-box;
                text-align: center;
                width: 200px;
              "
            >
              资料价格
            </td>
            <td style="padding: 20px; box-sizing: border-box">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="addDataForm.zljg"
              >
              </el-input>
            </td>
          </tr>
          <tr>
            <td
              style="
                padding: 20px;
                box-sizing: border-box;
                text-align: center;
                width: 200px;
              "
            >
              备注
            </td>
            <td style="padding: 20px; box-sizing: border-box">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="addDataForm.remark"
              >
              </el-input>
            </td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDataVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDataSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inventoryRegistrationForm: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      formLabelWidth: "120px",
      inventoryRegistrationData: [{}],
      detailsData: [{}],
      addDataVisible: false,
      handleRegisterVisible: false,
      handleRegisterForm: {
        dataNameList: [{}],
      },
      addDataForm: {},
    };
  },
  created() {},
  mounted() {},
  methods: {
    getList() {},
    handleRegister() {
      this.handleRegisterVisible = true;
    },
    handleRegisterSubmit() {
      this.handleRegisterVisible = false;
    },
    addDataName() {
      this.handleRegisterForm.dataNameList.push({});
    },
    dropDataName(index) {
      console.log(index);
      this.handleRegisterForm.dataNameList.splice(index, 1);
    },
    handleChange(value) {
      console.log(value);
    },
    addData() {
      this.addDataVisible = true;
    },
    addDataSubmit() {
      this.addDataVisible = false;
    },
    handleExport() {
      this.download(
        "basic/examSummary/export",
        {
          ...this.inventoryRegistrationData,
        },
        `库存登记.xlsx`
      );
    },
    handleExportStockData() {
      this.download(
        "basic/examSummary/export",
        {
          ...this.inventoryRegistrationData,
        },
        `导出库存数据.xlsx`
      );
    },
    handleExportDetails() {
      this.download(
        "basic/examSummary/export",
        {
          ...this.inventoryRegistrationData,
        },
        `导出收/出详情.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.InventoryRegistration {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>
