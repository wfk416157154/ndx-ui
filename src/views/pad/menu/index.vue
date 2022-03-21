<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="菜单类型 " prop="menuType">
        <el-select v-model="queryParams.menuType" placeholder="请选择菜单类型 " clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单显示 " prop="visible">
        <el-input
          v-model="queryParams.visible"
          placeholder="请输入菜单显示 "
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="菜单状态 " prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择菜单状态 " clearable size="small">
          <el-option
            v-for="dict in statusOptions"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['pad:menu:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      border
      v-loading="loading"
      :data="menuList"
      row-key="menuId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="菜单名称" prop="menuName" />
      <el-table-column label="菜单类型 " align="center" prop="menuType" />
      <el-table-column label="菜单显示 " align="center" prop="visible" />
      <el-table-column label="菜单状态 " align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="权限标识" align="center" prop="perms" />
      <el-table-column label="菜单图标" align="center" prop="icon" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pad:menu:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['pad:menu:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pad:menu:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改pad菜单权限对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单类型 " prop="menuType">
          <el-select v-model="form.menuType" placeholder="请选择菜单类型 ">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单显示 " prop="visible">
          <el-input v-model="form.visible" placeholder="请输入菜单显示 " />
        </el-form-item>
        <el-form-item label="菜单状态 ">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限标识" prop="perms">
          <el-input v-model="form.perms" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入菜单图标" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMenu, getMenu, delMenu, addMenu, updateMenu, exportMenu } from "@/api/pad/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Menu",
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // pad菜单权限表格数据
      menuList: [],
      // pad菜单权限树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 菜单状态 字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        menuName: null,
        menuType: null,
        visible: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_show_hide").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询pad菜单权限列表 */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then(response => {
        this.menuList = this.handleTree(response.data, "menuId", "parentId");
        this.loading = false;
      });
    },
    /** 转换pad菜单权限数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
	/** 查询pad菜单权限下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = [];
        const data = { menuId: 0, menuName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "menuId", "parentId");
        this.menuOptions.push(data);
      });
    },
    // 菜单状态 字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        menuId: null,
        menuName: null,
        parentId: null,
        orderNum: null,
        path: null,
        component: null,
        menuType: null,
        visible: null,
        status: "0",
        perms: null,
        icon: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
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
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加pad菜单权限";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.menuId;
      }
      getMenu(row.menuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改pad菜单权限";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.menuId != null) {
            updateMenu(this.form).then(response => {
                if(200==response.code){
                    this.getList();
                    this.msgSuccess(response.msg);
                }else{
                    this.msgError(response.msg);
                }
              this.open = false;
              this.getList();
            });
          } else {
            addMenu(this.form).then(response => {
                if(200==response.code){
                    this.getList();
                    this.msgSuccess(response.msg);
                }else{
                    this.msgError(response.msg);
                }
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除选中数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMenu(row.menuId);
        }).then((response) => {
          this.getList();
          if(200==response.code){
              this.getList();
              this.msgSuccess(response.msg);
          }else{
              this.msgError(response.msg);
          }
        }).catch((e)=>{
          console.log(e);
      })
    }
  }
};
</script>
