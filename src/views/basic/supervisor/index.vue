<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="组长id" prop="zzid">
        <el-input
          v-model="queryParams.zzid"
          placeholder="请输入组长id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组长部门id" prop="zzbmid">
        <el-input
          v-model="queryParams.zzbmid"
          placeholder="请输入组长部门id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="试讲人id" prop="sjrid">
        <el-input
          v-model="queryParams.sjrid"
          placeholder="请输入试讲人id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="试讲人部门id" prop="sjrbmid">
        <el-input
          v-model="queryParams.sjrbmid"
          placeholder="请输入试讲人部门id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basic:supervisor:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basic:supervisor:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basic:supervisor:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :height="$root.tableHeight" border :data="supervisorList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id"/>
      <el-table-column label="组长id" align="center" prop="zzid"/>
      <el-table-column label="组长部门id" align="center" prop="zzbmid"/>
      <el-table-column label="试讲人id" align="center" prop="sjrid"/>
      <el-table-column label="试讲人部门id" align="center" prop="sjrbmid"/>
      <el-table-column label="试讲用时" align="center" prop="sjys"/>
      <el-table-column label="试讲内容" align="center" prop="sjnr"/>
      <el-table-column label="试讲评价" align="center" prop="sjpj"/>
      <el-table-column label="班级管理" align="center" prop="bjgl"/>
      <el-table-column label="问题解答" align="center" prop="wtjd"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:supervisor:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:supervisor:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>


</template>

<script>
  import {listSupervisor, getSupervisor, delSupervisor, addSupervisor, updateSupervisor,getLoginUnderGroup} from "@/api/basic/supervisor";
  import {getToken} from "@/utils/auth";
  export default {
    name: "Supervisor",
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 督导会议记录表格数据
        supervisorList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          zzid: null,
          zzbmid: null,
          sjrid: null,
          sjrbmid: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
      };
    },
    created() {
      this.getList();

    },
    mounted() {


    },
    methods: {

      /** 查询督导会议记录列表 */
      getList() {
        this.loading = true;
        listSupervisor(this.queryParams).then(response => {
          this.supervisorList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          ksrq:null,
          jzrq:null,
          zzid: null,
          zzbmid: null,
          sjrid: null,
          sjrbmid: null,
          sjys: null,
          sjnr: null,
          sjpj: null,
          bjgl: null,
          wtjd: null,
          status: "0",
          remark: null,
          userId: null,
          dataOrder: null,
          createTime: null,
          updateTime: null,
          kzzd1: null,
          kzzd2: null,
          kzzd3: null,
          kzzd4: null,
          kzzd5: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        //this.getConfigKey(key).then(resp => {
          //this.router = resp.msg;
          this.$router.push({
            path: "/ddz/supervisorForm",
            query:{pageType:"add"}
          });
        //});
        this.title = "添加督导会议记录";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getSupervisor(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改督导会议记录";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateSupervisor(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addSupervisor(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除选中的数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delSupervisor(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e) => {
          console.log(e);
        })

      },


    }
  };
</script>
<style lang="scss" scoped>
  th,
  td {
    padding: 15px;
    box-sizing: border-box;
    font-size: 30px;
  }


</style>
