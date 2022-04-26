<template>
  <div class="stockList">
    <el-form :inline="true" :model="stockForm" class="demo-form-inline">
      <el-form-item label="登记类型">
        <el-select v-model="stockForm.registerType">
          <el-option
            v-for="(dic, index) in bookRegisterTpye"
            :key="index"
            :label="dic.dictLabel"
            :value="dic.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资料名称">
        <el-select style="margin-right: 20px" v-model="stockForm.bookName">
          <el-option
            v-for="(list, j) in inventoryRegistrationData"
            :key="j"
            :label="list.bookName"
            :value="list.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="stockForm.sjArr"
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
        <el-button type="warning" @click="handleExportStockData"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="stockData" border style="width: 100%">
      <el-table-column
        prop="registerType"
        label="登记类型"
        :formatter="registerTypeFormat"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="registerTypeData"
        label="登记类型"
        :formatter="registerTypeDataFormat"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="bookName" label="资料名称" width="180">
      </el-table-column>
      <el-table-column prop="provenance" label="资料出处"> </el-table-column>
      <el-table-column prop="remark" label="备注">
        <template slot-scope="scope">
          <div v-html="scope.row.remark"></div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            slot="reference"
            :disabled="scope.row.registerTypeData == '6'"
            @click="editStock(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="stockForm.pageNum"
      :limit.sync="stockForm.pageSize"
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
                <el-select
                  @change="registerTypeChange"
                  v-model="handleRegisterForm.registerType"
                >
                  <el-option
                    v-for="(dic, index) in bookRegisterTpye"
                    :key="index"
                    :label="dic.dictLabel"
                    :value="dic.dictValue"
                  ></el-option>
                </el-select>
              </div>
              <div style="margin-right: 20px">
                <el-select v-model="handleRegisterForm.registerTypeData">
                  <el-option
                    v-show="handleRegisterForm.registerType == dic.remark"
                    v-for="(dic, i) in bookRegisterData"
                    :key="i"
                    :label="dic.dictLabel"
                    :value="dic.dictValue"
                    :disabled="dic.dictValue == '6'"
                  >
                  </el-option>
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
                v-for="(
                  item, index
                ) in handleRegisterForm.basicBookRegisterDetailList"
                :key="index"
                style="margin-bottom: 20px"
              >
                <el-select
                  style="margin-right: 20px"
                  @change="getBookDetails(item.bookId, index)"
                  v-model="item.bookId"
                >
                  <el-option
                    v-for="(list, j) in inventoryRegistrationData"
                    :key="j"
                    :label="list.bookName"
                    :value="list.id"
                  ></el-option>
                </el-select>
                <el-input-number
                  style="margin-right: 20px"
                  v-model="item.registerCount"
                  @change="handleChange"
                  :min="1"
                  :max="5000"
                  label="描述文字"
                ></el-input-number>
                <el-button
                  class="el-icon-delete"
                  @click="dropDataName(index)"
                ></el-button>
                <el-tag
                  style="margin-left: 20px"
                  v-if="item.stock || item.stock == 0"
                  >{{ item.stock }}</el-tag
                >
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
                v-model="handleRegisterForm.provenance"
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
  </div>
</template>

<script>
import {
  addRegister,
  updateRegister,
  listRegister,
  registerDetalis,
} from "@/api/basic/stockList";
import { listBook, bookDetalis } from "@/api/basic/InventoryRegistration";
export default {
  data() {
    return {
      stockData: [],
      bookRegisterTpye: [],
      inventoryRegistrationData: [],
      bookRegisterData: [],
      bookDeatils: {},
      stockForm: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      handleRegisterVisible: false,
      handleRegisterForm: {
        basicBookRegisterDetailList: [
          {
            stock: 0,
          },
        ],
      },
      gIndex: null,
    };
  },
  created() {
    this.getDicts("book_register_tpye").then((response) => {
      this.bookRegisterTpye = response.data;
    });
    this.getDicts("book_register_data").then((response) => {
      this.bookRegisterData = response.data;
    });
    listBook().then((res) => {
      if (res.code == 200) {
        this.inventoryRegistrationData = res.rows;
      }
    });
  },
  mounted(){
    this.getList()
  },
  methods: {
    getList() {
      listRegister(this.stockForm).then((res) => {
        this.stockData = res.rows;
        this.total = res.total;
      });
    },
    handleRegister() {
      this.handleRegisterForm = {
        basicBookRegisterDetailList: [
          {
            stock: 0,
          },
        ],
      };
      this.handleRegisterVisible = true;
    },
    registerTypeChange() {
      if (this.handleRegisterForm.registerTypeData) {
        this.handleRegisterForm.registerTypeData = "";
      }
    },
    handleRegisterSubmit() {
      if (!this.handleRegisterForm.registerType) {
        this.msgError("请填写登记类型数据");
        return;
      }
      if (!this.handleRegisterForm.registerTypeData) {
        this.msgError("请填写登记类型数据");
        return;
      }
      if (this.handleRegisterForm.basicBookRegisterDetailList.length >= 1) {
        for (
          let i = 0;
          i < this.handleRegisterForm.basicBookRegisterDetailList.length;
          i++
        ) {
          if (!this.handleRegisterForm.basicBookRegisterDetailList[i].bookId) {
            this.msgError("至少添加一条资料名称数据");
            return;
          }
          if (
            !this.handleRegisterForm.basicBookRegisterDetailList[i]
              .registerCount
          ) {
            this.msgError("至少添加一条资料名称数据");
            return;
          }
        }
      }
      if (this.handleRegisterForm.id) {
        updateRegister(this.handleRegisterForm).then((res) => {
          if (res.code == 200) {
            this.msgSuccess("修改成功");
            this.handleRegisterVisible = false;
            this.getList();
          }
        });
      } else {
        addRegister(this.handleRegisterForm).then((res) => {
          if (res.code == 200) {
            this.msgSuccess("新增成功");
            this.handleRegisterVisible = false;
            this.getList();
          }
        });
      }
    },
    editStock(row) {
      registerDetalis(row.id).then((res) => {
        this.bookDeatils = {};
        this.handleRegisterForm = res.data;
        this.handleRegisterVisible = true;
      });
    },
    getBookDetails(id, index) {
      bookDetalis(id).then((res) => {
        this.handleRegisterForm.basicBookRegisterDetailList[index].stock =
          res.data.stock;
      });
    },
    addDataName() {
      this.handleRegisterForm.basicBookRegisterDetailList.push({
        stock: null,
      });
    },
    registerTypeFormat(row) {
      return this.selectDictLabel(this.bookRegisterTpye, row.registerType);
    },
    registerTypeDataFormat(row) {
      return this.selectDictLabel(this.bookRegisterData, row.registerTypeData);
    },
    dropDataName(index) {
      this.handleRegisterForm.basicBookRegisterDetailList.splice(index, 1);
    },
    handleChange(value) {
      console.log(value);
    },
    handleExportStockData() {
      this.download(
        "basic/register/exportRegisterInfo",
        {
          sjArr: this.stockForm.sjArr,
        },
        `导出库存数据.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.stockList {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>
