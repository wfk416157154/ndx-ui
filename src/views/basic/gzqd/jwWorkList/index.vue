<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="日语班级" prop="rybjid">
        <el-select
          v-model="queryParams.rybjid"
          filterable
          placeholder="请选择日语班级">
          <el-option
            v-for="item in bjclassList "
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="老师" prop="lsid">
        <el-select
          v-model="queryParams.lsid"
          filterable
          placeholder="请选择老师">
          <el-option
            v-for="item in teacherListOption"
            :key="item.id"
            :label="item.lsxm"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务完成状态" prop="rwwczt" label-width="120px">
        <el-select v-model="queryParams.rwwczt" placeholder="请选择任务完成状态" clearable size="small">
          <el-option
            v-for="dict in rwwcztOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--<el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basic:teacherTasklist:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basic:teacherTasklist:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basic:teacherTasklist:remove']"
        >删除</el-button>
      </el-col>
    <el-col :span="1.5">
        <el-button
                type="info"
                icon="el-icon-upload2"
                size="mini"
                @click="handleImport"
        >导入</el-button>
    </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['basic:teacherTasklist:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>-->

    <el-table style="width: 100%;font-size : 18px" v-loading="loading" :height="$root.tableHeight" border :data="teacherTasklistList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" v-if="false" />
      <el-table-column label="日语班级" align="center" prop="rybjmc" />
      <el-table-column label="老师" align="center" prop="lsxm" />
      <el-table-column label="第一周" align="center" prop="oneWeek" >
        <template slot-scope="scope">
          <span v-if="null!=scope.row.oneWeek">
            <span v-for="(item,index) in scope.row.oneWeek.split(',')" :key="index">
              <dict-tag :options="oneWeekOptions" :value="item"/>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="第二周" align="center" prop="twoWeek" >
        <template slot-scope="scope">
          <span v-if="null!=scope.row.twoWeek">
            <span v-for="(item,index) in scope.row.twoWeek.split(',')" :key="index">
              <dict-tag :options="twoWeekOptions" :value="item"/>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="第三四周" align="center" prop="threeWeek" >
        <template slot-scope="scope">
          <span v-if="null!=scope.row.threeWeek">
            <span v-for="item in scope.row.threeWeek.split(',')">
              <dict-tag :options="threeWeekOptions" :value="item"/>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="完成任务时长(天)" align="center" prop="wcrwsc" />
      <el-table-column label="任务完成状态" align="center" prop="rwwczt" >
        <template slot-scope="scope">
          <dict-tag :options="rwwcztOptions" :value="scope.row.rwwczt"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="录入或修改人ID" align="center" prop="userId" v-if="false" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:teacherTasklist:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:teacherTasklist:remove']"
          >删除</el-button>-->
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
  import { listTeacherTasklist, getTeacherTasklist, delTeacherTasklist, addTeacherTasklist, updateTeacherTasklist } from "@/api/basic/teacherTasklist";
  import { getToken } from "@/utils/auth";
  import { listBjclass } from "@/api/basic/bjclass";
  import {teacherList,} from "@/api/basic/assignTeachers";

  export default {
    name: "TeacherTasklist",
    components: {
    },
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
        // 新教师工作清单表格数据
        teacherTasklistList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 任务完成状态字典
        rwwcztOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          rybjid: null,
          lsid: null,
          oneWeek: null,
          twoWeek: null,
          threeWeek: null,
          wcrwsc: null,
          rwwczt: null,
          userId: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
        },
        // 班级基础信息数据
        bjclassList: [],
        // 老师信息数据
        teacherListOption:[],
        oneWeekOptions:[],
        twoWeekOptions:[],
        threeWeekOptions:[],
      };
    },
    created() {
      this.getList();
      this.getDicts("taskStatus").then(response => {
        this.rwwcztOptions = response.data;
      });
      this.getDicts("oneWeek").then(response => {
        this.oneWeekOptions = response.data;
      });
      this.getDicts("twoWeek").then(response => {
        this.twoWeekOptions = response.data;
      });
      this.getDicts("threeWeek").then(response => {
        this.threeWeekOptions = response.data;
      });

      listBjclass().then(response => {
        this.bjclassList = response.rows;
      });
      this.getTeacherList()
    },
    methods: {
      // 获取老师列表
      getTeacherList() {
        teacherList().then(response => {
          this.teacherListOption = response.rows;
        });
      },
      /** 查询新教师工作清单列表 */
      getList() {
        this.loading = true;
        listTeacherTasklist(this.queryParams).then(response => {
          this.teacherTasklistList = response.rows;
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
          rybjid: null,
          lsid: null,
          oneWeek: null,
          twoWeek: null,
          threeWeek: null,
          wcrwsc: null,
          rwwczt: null,
          remark: null,
          userId: null,
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
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加新教师工作清单";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getTeacherTasklist(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改新教师工作清单";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateTeacherTasklist(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addTeacherTasklist(this.form).then(response => {
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
        }).then(function() {
          return delTeacherTasklist(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e)=>{
          console.log(e);
        })

      },


    }
  };
</script>
