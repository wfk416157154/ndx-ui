<template>
  <div class="class-distribution">

    <el-table :data="distributionTableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="55"/>
      <el-table-column prop="typeName" label="角色">
      </el-table-column>
      <el-table-column prop="name" label="姓名/称呼">
      </el-table-column>
      <el-table-column prop="phone" label="手机号">
      </el-table-column>
      <el-table-column prop="address" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="ondistribution(scope.row)">分 配</el-button>
          <el-button type="danger" size="mini" @click="onView(scope.row)">查 看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <el-dialog title="分配班级" :visible.sync="dialogFormVisible">
      <el-form :model="form" :inline="true">
        <el-form-item label="校区" label-width="120px" v-if="form.type == '5'">
          <el-select v-model="form.kzzd1" filterable placeholder="请选择" clearable  >
            <el-option v-for="item in schoolList" :key="item.value" :label="item.xxmc" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" label-width="120px" v-if="form.type == '7'">
          <el-select v-model="rybjidArr" filterable placeholder="请选择" multiple clearable >
            <el-option v-for="item in classList" :key="item.value" :label="item.rybjmc" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onHandleSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配班级" :visible.sync="viewDialogFormVisible">
      <el-form :model="form" :inline="true">
        <el-form-item label="角色" label-width="120px">
          <el-input v-model="form.type" disabled/>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px">
          <el-input v-model="form.name" disabled/>
        </el-form-item>
        <el-form-item label="电话" label-width="120px">
          <el-input v-model="form.phone" disabled/>
        </el-form-item>
        <el-form-item label="班级" label-width="120px">
          <el-input v-model="form.kzzd3" disabled/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="viewDialogFormVisible = false; form = {}">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listBjclass,
  } from "@/api/basic/bjclass";
  import {
    listSchool,
  } from "@/api/basic/school";
  import {wxUserList, updateWxUser} from "@/api/basic/weixin"

  export default {
    data() {
      return {
        distributionTableData: [],
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          typeArr: ["5", "7"]
        },
        rybjidArr:[],
        form: {},
        total: 0,
        dialogFormVisible: false,
        viewDialogFormVisible: false,
        classList: [],
        schoolList: [],
        classTemplateList: []
      }
    },
    created() {
      listBjclass().then(res => {
        this.classList = res.rows
      })
      listSchool().then(res => {
        this.schoolList = res.rows
      })
      this.getList()
    },
    methods: {
      getList() {
        wxUserList(this.queryParams).then(res => {
          if (res.code == 200) {
            this.distributionTableData = res.rows;
            this.total = res.total;
          }
        })
      },
      // 分配
      ondistribution(row) {
        this.form = row;
        this.classTemplateList = []
        this.dialogFormVisible = true
      },
      // 查看
      onView(row) {
        this.form = row
        this.viewDialogFormVisible = true
      },
      // 确定分配
      onHandleSubmit() {
        if(this.rybjidArr.length>0){
          this.form.kzzd3=this.rybjidArr.join(",");
        }
        updateWxUser(this.form).then(res => {
          if (res.code == 200) {
            this.dialogFormVisible = false
            this.msgSuccess("操作成功")
            this.form = {}
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .class-distribution {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
  }
</style>
