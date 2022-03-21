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
        <el-select v-model="queryParams.menuType" placeholder="菜单类型 " clearable size="small">
          <el-option
            v-for="dict in menusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单显示 " prop="visible">
        <el-select v-model="queryParams.visible" placeholder="菜单显示 " clearable size="small">
          <el-option
            v-for="dict in visibleOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单状态 " prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态 " clearable size="small">
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
      <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="250px">
        <template slot-scope="scope">
          <span v-if="scope.row.menuType=='M'" style="color:#f8ac59 ">{{scope.row.menuName}}</span>
          <span v-else-if="scope.row.menuType=='C'" style="color: #13ce66">{{scope.row.menuName}}</span>
          <span v-else-if="scope.row.menuType=='F'" style="color: red">{{scope.row.menuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="菜单类型 " align="center" prop="menuType" :formatter="menusFormat"/>
      <el-table-column label="菜单显示 " align="center" prop="visible" :formatter="visibleFormat"/>
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="菜单状态 " align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="权限标识" align="center" prop="perms" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.menuType == 'C'"
            icon="el-icon-edit"
            @click="guanlianUrl(scope.row)"
          >关联按钮功能</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item :span="24" label="上级菜单">
          <treeselect
            v-model="form.parentId"
            :options="menuOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="form.menuType">
            <el-radio label="M">目录</el-radio>
            <el-radio label="C">菜单</el-radio>
            <el-radio label="F">按钮功能</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.menuType != 'F'" label="菜单图标">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
              <svg-icon
                v-if="form.icon"
                slot="prefix"
                :icon-class="form.icon"
                class="el-input__icon"
                style="height: 32px;width: 16px;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item :span="12" v-if="form.menuType != 'F'">
              <span  slot="label">
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                显示状态
              </span>
          <el-radio-group v-model="form.visible">
            <el-radio
              v-for="dict in visibleOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
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
        <el-form-item v-if="form.menuType != 'F'" prop="path">
              <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
          <el-input v-model="form.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item v-if="form.menuType == 'C'" prop="component">
              <span slot="label">
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                组件路径
              </span>
          <el-input v-model="form.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item v-if="form.menuType != 'M'">
          <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
          <span slot="label">
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                权限字符
              </span>
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
import { listMenu, getMenu, delMenu, addMenu, updateMenu,listAllPreAuthorizeMethods,menuAddPermission,findMenuPermissionByMenuId,selectMenuRoleList,exportMenu } from "@/api/pad/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

export default {
  name: "Menu",
  components: {
    Treeselect, IconSelect
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
      //显示按钮类型数据字典
      menusOptions: [],
      // 显示状态数据字典
      visibleOptions: [],
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
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_show_hide").then(response => {
      this.visibleOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_menu_type").then(response => {
      this.menusOptions = response.data;
      console.log(this.menusOptions)
    });
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
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
    // 显示状态字典翻译
    visibleFormat(row, column) {
      if (row.menuType == "F") {
        return "";
      }
      return this.selectDictLabel(this.visibleOptions, row.visible);
    },
    // 菜单状态字典翻译
    statusFormat(row, column) {
      if (row.menuType == "F") {
        return "";
      }
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 菜单状态字典翻译
    menusFormat(row, column) {
      if (row.menuType == "F") {
        return "";
      }
      return this.selectDictLabel(this.menusOptions, row.menuType);
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
        parentId: 0,
        orderNum: null,
        path: null,
        component: null,
        menuType: "M",
        visible: "0",
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
    guanlianUrl(row) {
      selectMenuRoleList({menuId:row.menuId}).then(res=>{
        if(200==res.code){
          this.urlReset();
          this.getTreeselect();
          getMenu(row.menuId).then(response => {
            this.urlform = response.data;
            this.urlopen = true;
            this.title = "菜单关联URL按钮功能";
            findMenuPermissionByMenuId({ parentId: row.menuId }).then(res => {
              let arr = [];
              for (const key in res.data) {
                arr.push(res.data[key].perms);
              }
              this.menuValue = arr;
              this.urlform.permsArray = arr;
              this.findAllPreAuthorizeMethods();
            });
          });
        }else{
          this.msgError(res.msg)
        }
      }).catch(e=>{})

    },
    findAllPreAuthorizeMethods() {
      listAllPreAuthorizeMethods().then(res => {
        this.menuData = res.data;
      });
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
