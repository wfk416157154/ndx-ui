<template>
  <div class="wrap-examine">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="queryParams.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="queryParams.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="家长手机号">
        <el-input v-model="queryParams.parentTel" placeholder="家长手机号"></el-input>
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="queryParams.userId" placeholder="学号"></el-input>
      </el-form-item>

      <el-form-item label="班级">
        <el-select v-model="queryParams.rybjidArr" filterable placeholder="请选择" multiple clearable>
          <el-option v-for="item in classList" :key="item.value" :label="item.rybjmc" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onQuerySubmit('0')">查询</el-button>
        <el-button type="success" @click="onQuerySubmit('1')">通过</el-button>
        <el-button type="danger" @click="onQuerySubmit('2')">驳回</el-button>
        <el-button type="info" @click="onQuerySubmit('0')">待审核</el-button>
        (默认查询待审核的数据)
        <el-button type="primary" @click="exportWxUser">导出微信用户</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="examineTableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="55"/>
      <el-table-column prop="openId" label="微信id" width="180">
      </el-table-column>
      <el-table-column prop="kzzd4" label="微信昵称" width="180">
      </el-table-column>
      <el-table-column prop="typeName" label="角色">
      </el-table-column>
      <el-table-column prop="rybjmc" label="班级名称">
      </el-table-column>
      <el-table-column prop="xqmc" label="校区名称">
      </el-table-column>
      <el-table-column prop="name" label="姓名/称呼">
      </el-table-column>
      <el-table-column prop="userId" label="学号/老师id">
      </el-table-column>
      <el-table-column prop="phone" label="手机号">
      </el-table-column>
      <el-table-column prop="parentTel" label="家长手机号">
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==0">待审核</span>
          <span v-if="scope.row.status==1">审核通过</span>
          <span v-if="scope.row.status==2">驳回</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="是否通过" width="200px">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="onAgree(scope.row)" :disabled="scope.row.status == 1 ">同 意
          </el-button>
          <el-button type="danger" size="mini" @click="onReject(scope.row)"
                     :disabled="scope.row.status == 2||scope.row.status == 1">驳 回
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="onQuerySubmit('0')"/>

    <el-dialog title="驳回原因" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="驳回原因" label-width="120px">
          <el-input v-model="form.kzzd2" type="textarea" rows="8" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onHandleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {wxUserList, updateWxUser, checkRoleSendMsg} from "@/api/basic/weixin"
  import {
    listBjclass,
  } from "@/api/basic/bjclass";

  export default {
    data() {
      return {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        form: {},
        total: 0,
        classList: [],
        examineTableData: [],
        dialogFormVisible: false,
      }
    },
    created() {
      this.onQuerySubmit(0)
      listBjclass().then(res => {
        this.classList = res.rows
      })
    },
    methods: {
      // 查询列表数据
      onQuerySubmit(status) {
        this.queryParams.status = status
        wxUserList(this.queryParams).then(res => {
          if (res.code == 200) {
            this.examineTableData = res.rows;
            this.total = res.total
          }
        })
      },
      // 同意
      onAgree(row) {
        row.status = "1"
        updateWxUser(row).then(res => {
          if (res.code == 200) {
            this.msgSuccess("操作成功")
            this.sendMsg(row.openId);
          }
        })
      },
      // 驳回
      onReject(row) {
        this.form = row
        this.dialogFormVisible = true
      },
      // 驳回确定按钮
      onHandleSubmit() {
        this.form.status = "2"
        updateWxUser(this.form).then(res => {
          if (res.code == 200) {
            this.msgSuccess("操作成功")
            this.sendMsg(this.form.openId);
            this.dialogFormVisible = false
          }
        })
      },
      sendMsg(openId){
        this.getConfigKey("wecharServerUrl").then(resp => {
          checkRoleSendMsg(resp.msg,{openId})
        });
      },
      exportWxUser() {
        this.download(
          "basic/wxUser/wxUserExport",
          {},
          `微信用户信息.xlsx`
        );
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrap-examine {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
  }
</style>
