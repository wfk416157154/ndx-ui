<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="日期" prop="dateArr">
        <el-date-picker
          v-model="dateArr"
          type="daterange"
          align="right"
          @change="dateOnchange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="组长名称" prop="zzid" v-if="dataRoleId>50">
        <el-select v-model="queryParams.zzid" filterable placeholder="请选择组长" style="width: 100%" >
          <el-option
            v-for="item in userListOption"
            :key="item.id"
            :label="item.nickName"
            :value="item.glrid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门名称" prop="zzbmid" v-if="dataRoleId>50">
        <el-select v-model="queryParams.zzbmid" filterable placeholder="请选择部门" style="width: 100%" >
          <el-option
            v-for="item in deptListOption"
            :key="item.id"
            :label="item.deptName"
            :value="item.deptId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试讲人" prop="sjrid">
        <el-select v-model="queryParams.sjrid" filterable placeholder="请选择试讲人" style="width: 100%" >
          <el-option
            v-for="item in sjrListOption"
            :key="item.id"
            :label="item.nickName"
            :value="item.glrid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试讲内容" prop="sjnr">
        <el-input
          v-model="queryParams.sjnr"
          placeholder="请输入试讲内容"
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
      <el-table-column label="主键" align="center" prop="id" v-if="false" />
      <el-table-column label="组长id" align="center" prop="zzid" v-if="false"/>
      <el-table-column label="时间" align="center" prop="ksrq" >
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.ksrq,'{y}-{m}-{d}')}}至{{parseTime(scope.row.jzrq,'{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="组长名称" align="center" prop="zzmc" />
      <el-table-column label="组长部门id" align="center" prop="zzbmid" v-if="false"/>
      <el-table-column label="部门名称" align="center" prop="zzbmmc" />
      <el-table-column label="试讲人id" align="center" prop="sjrid" v-if="false"/>
      <el-table-column label="试讲人" align="center" prop="sjrmc" />
      <el-table-column label="试讲人部门id" align="center" prop="sjrbmid" v-if="false"/>
      <el-table-column label="试讲用时" align="center" prop="sjys"/>
      <el-table-column label="试讲内容" align="center" prop="sjnr"/>
      <el-table-column label="试讲评价" align="center" prop="sjpj" v-if="false"/>
      <el-table-column label="班级管理" align="center" prop="bjgl" v-if="false"/>
      <el-table-column label="问题解答" align="center" prop="wtjd" v-if="false"/>
      <el-table-column label="备注" align="center" prop="remark" v-if="false"/>
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
  import {listSupervisor, getSupervisor, delSupervisor, addSupervisor, updateSupervisor,getLoginUnderGroup,listUser,listDept} from "@/api/basic/supervisor";
  import {getToken} from "@/utils/auth";
  import {parseTime} from "../../../utils/ruoyi";
  export default {
    name: "Supervisor",
    components: {},
    data() {
      return {
        dateArr:[],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },

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
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          zzid: null,
          zzbmid: null,
          sjrid: null,
          sjrbmid: null,
          ksrqStr:null,
          jzrqStr:null
        },
        userListOption:[],
        deptListOption:[],
        sjrListOption:[],
        dataRoleId : 0,
      };
    },
    created() {
      let nickName=this.$store.state.user.nickName;
      this.dataRoleId=this.$store.state.user.dataRoleWeightId;
      this.getList();
      if(this.dataRoleId>50){// 当角色权限大于老师50
        listUser().then(data=>{
          this.userListOption=data
        });
        listDept().then(data=>{
          this.deptListOption=data
        });
      }
      listUser({"nickName":nickName}).then(data=>{
        this.sjrListOption=data
      });

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
        this.getConfigKey("supervisorForm").then(resp => {
          this.$router.push({
            path: resp.msg,
            query:{pageType:"add"}
          });
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        const id = row.id || this.ids
        this.getConfigKey("supervisorForm").then(resp => {
          this.$router.push({
            path: resp.msg,
            query:{pageType:"update",id:id}
          });
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
      // 日期范围选择后触发
      dateOnchange(date){
        if(date){
          this.queryParams.ksrqStr=parseTime(date[0],'{y}-{m}-{d}')
          this.queryParams.jzrqStr=parseTime(date[1],'{y}-{m}-{d}')
        }
      },
    }
  };
</script>
