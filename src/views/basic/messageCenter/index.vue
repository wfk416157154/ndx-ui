<template>
  <div class="msgHome">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="接收者">
        <el-select v-model="queryParams.region" filterable placeholder="接收者">
          <el-option label="接收者一" value="shanghai"></el-option>
          <el-option label="接收者二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息">
        <el-select v-model="queryParams.region" filterable placeholder="消息">
          <el-option label="消息一" value="shanghai"></el-option>
          <el-option label="消息二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息模块">
        <el-select
          v-model="queryParams.region"
          filterable
          placeholder="消息模块"
        >
          <el-option label="消息一" value="shanghai"></el-option>
          <el-option label="消息二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间">
        <el-date-picker
          v-model="queryParams.sj"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查 询</el-button>
        <el-button type="success" @click="addMsg">添 加 消 息</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="msgTableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="55"> </el-table-column>
      <el-table-column prop="date" label="消息主题" width="180">
      </el-table-column>
      <el-table-column prop="name" label="消息类型" width="180">
      </el-table-column>
      <el-table-column prop="address" label="消息模块"> </el-table-column>
      <el-table-column prop="address" label="发送时间"> </el-table-column>
      <el-table-column prop="address" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="handelViews"
            >查 看</el-button
          >
          <el-button size="mini" type="success" @click="handelSend"
            >再 次 发 送</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 查看 -->
    <el-dialog title="消息" :visible.sync="dialogFormVisible">
      <div style="text-align: center">
        <h1 style="margin: 10px 0px; padding: 0">xiaoxi</h1>
      </div>
      <el-table :data="msgTableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="55">
        </el-table-column>
        <el-table-column prop="date" label="接收人" width="180">
        </el-table-column>
        <el-table-column prop="name" label="接收人电话" width="180">
        </el-table-column>
        <el-table-column prop="address" label="消息状态"> </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 添加消息 -->
    <el-dialog title="消息" :visible.sync="msgDialogFormVisible">
      <table style="width: 100%" border="1" cellspacing="0">
        <tbody>
          <tr>
            <td
              style="padding: 20px; box-sizing: border-box; text-align: center"
            >
              消息模块
            </td>
            <td style="padding: 20px; box-sizing: border-box">系统后台</td>
          </tr>
          <tr>
            <td
              style="padding: 20px; box-sizing: border-box; text-align: center"
            >
              消息类型
            </td>
            <td style="padding: 20px; box-sizing: border-box">
              <el-select filterable v-model="msgHomeForm.region">
                <el-option label="接收者一" value="shanghai"></el-option>
                <el-option label="接收者二" value="beijing"></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td
              style="padding: 20px; box-sizing: border-box; text-align: center"
            >
              接收人
            </td>
            <td style="padding: 20px; box-sizing: border-box">
              <div>
                <el-select
                  filterable
                  v-model="msgHomeForm.region"
                  placeholder="姓名"
                  style="margin-right: 10px"
                >
                  <el-option label="接收者一" value="shanghai"></el-option>
                  <el-option label="接收者二" value="beijing"></el-option>
                </el-select>
                <el-checkbox v-model="msgHomeForm.checked">全 选</el-checkbox>
              </div>
              <div style="margin: 20px 0px">
                <el-checkbox-group v-model="msgHomeForm.checkList">
                  <el-checkbox label="复选框 A"></el-checkbox>
                  <el-checkbox label="复选框 B"></el-checkbox>
                  <el-checkbox label="复选框 C"></el-checkbox>
                </el-checkbox-group>
              </div>
            </td>
          </tr>
          <tr>
            <td
              style="padding: 20px; box-sizing: border-box; text-align: center"
            >
              消息主题
            </td>
            <td style="padding: 20px; box-sizing: border-box">
              <el-input v-model="msgHomeForm.zt" />
            </td>
          </tr>
          <tr>
            <td
              style="padding: 20px; box-sizing: border-box; text-align: center"
            >
              消息内容
            </td>
            <td style="padding: 20px; box-sizing: border-box">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="msgHomeForm.textarea"
              >
              </el-input>
            </td>
          </tr>
          <tr>
            <td
              style="padding: 20px; box-sizing: border-box; text-align: center"
            >
              MediaId
            </td>
            <td style="padding: 20px; box-sizing: border-box"></td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="msgDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handelSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      dialogFormVisible: false,
      msgDialogFormVisible: false,
      msgHomeForm: {
        checkList: [],
      },
      msgTableData: [{}],
    };
  },
  methods: {
    getList() {},
    addMsg() {
      this.msgDialogFormVisible = true;
    },
    handelViews() {
      this.dialogFormVisible = true;
    },
    handelSend() {},
    handelSave() {
      msgDialogFormVisible = fals;
    },
  },
};
</script>

<style lang="scss" scoped>
.msgHome {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>