<template>
  <div class="InventoryRegistration">
    <el-form :inline="true" :model="inventoryRegistrationForm">
      <el-form-item label="资料名称">
        <el-input v-model="inventoryRegistrationForm.bookName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button type="success" @click="addData">新增资料</el-button>
        <el-button type="warning" @click="handleExport">导出库存</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="inventoryRegistrationData" border style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="bookName" label="资料名称"> </el-table-column>
      <el-table-column prop="stock" label="库存数量" width="200px">
      </el-table-column>
      <el-table-column prop="bookPrice" label="价格" width="200px" />
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <el-table-column prop="srzcxq" label="收入支出详情" width="400px">
        <template slot-scope="scope">
          <el-popover placement="right" width="700px" trigger="click">
            <el-table :data="detailsData" border>
              <el-table-column
                width="150px"
                property="registerDate"
                label="日期"
              ></el-table-column>
              <el-table-column
                :formatter="registerTypeFormat"
                width="100px"
                property="registerType"
                label="收入/支出"
              ></el-table-column>
              <el-table-column
                width="100px"
                property="registerCount"
                label="数量"
              ></el-table-column>
              <el-table-column width="150px" property="remark" label="说明备注">
                <template slot-scope="scope">
                  <div v-html="scope.row.remark"></div>
                </template>
              </el-table-column>
            </el-table>
            <el-button slot="reference" @click="viewDetails(scope.row.id)"
              >查看详情</el-button
            >
          </el-popover>
          <el-button
            style="margin-left: 20px"
            @click="editInventoryRegistration(scope.row)"
            >编辑</el-button
          >
          <el-button type="warning" @click="handleExportDetails(scope.row.id)"
            >导出收/出详情</el-button
          >
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
                v-model="addDataForm.bookName"
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
                v-model="addDataForm.bookPrice"
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
import {
  addBook,
  updateBook,
  listBook,
  listRegisterDetail,
} from "@/api/basic/InventoryRegistration";
export default {
  data() {
    return {
      inventoryRegistrationForm: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      formLabelWidth: "120px",
      inventoryRegistrationData: [],
      bookRegisterTpye: [],
      detailsData: [{}],
      addDataVisible: false,
      addDataForm: {
        bookName: null,
        bookPrice: null,
        remark: null,
      },
    };
  },
  created() {
    this.getDicts("book_register_tpye").then((response) => {
      this.bookRegisterTpye = response.data;
    });
  },
  mounted() {},
  methods: {
    getList() {
      listBook(this.inventoryRegistrationForm).then((res) => {
        if (res.code == 200) {
          this.inventoryRegistrationData = res.rows;
          this.total = res.total;
        }
      });
    },
    addData() {
      this.addDataForm = {};
      this.addDataVisible = true;
    },
    addDataSubmit() {
      if (this.addDataForm.id) {
        updateBook(this.addDataForm).then((res) => {
          if (res.code == 200) {
            this.msgSuccess("修改成功");
            this.addDataVisible = false;
          }
        });
      } else {
        addBook(this.addDataForm).then((res) => {
          if (res.code == 200) {
            this.msgSuccess("新增成功");
            this.addDataVisible = false;
          }
        });
      }
    },
    viewDetails(id) {
      listRegisterDetail({ bookId: id }).then((res) => {
        this.detailsData = res.rows;
      });
    },
    editInventoryRegistration(row) {
      this.addDataForm = row;
      this.addDataVisible = true;
    },
    registerTypeFormat(row) {
      return this.selectDictLabel(this.bookRegisterTpye, row.registerType);
    },
    handleExport() {
      this.download(
        "basic/book/export",
        {
          ...this.inventoryRegistrationForm,
        },
        `资料列表.xlsx`
      );
    },
    handleExportDetails(bookId) {
      this.download(
        "basic/registerDetail/export",
        {
          bookId,
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
