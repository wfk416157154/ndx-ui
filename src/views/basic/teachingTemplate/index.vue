<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="节点名称" prop="jdmc">
        <el-input
          v-model="queryParams.jdmc"
          placeholder="请输入节点名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程名称" prop="kcmc">
        <el-input
          v-model="queryParams.kcmc"
          placeholder="请输入课程名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程类型" prop="kclx">
        <el-select v-model="queryParams.kclx" placeholder="新课、复习课" clearable size="small">
          <el-option
            v-for="dict in kclxOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="层级类型" prop="cjlx">
        <el-select v-model="queryParams.cjlx" placeholder="单元/课程/课程任务" clearable size="small">
          <el-option
            v-for="dict in cjlxOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="教材或册数" label-width="100px" prop="glid" >
        <treeselect v-model="queryParams.glid" style="width: 200px" :options="teachingMaterialOptions" :normalizer="normalizerMaterial" placeholder="请选择教材或册数" />
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
          v-hasPermi="['basic:teachingTemplate:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      border
      v-loading="loading"
      :data="teachingTemplateList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="关联教材表id" prop="glid" v-if="false" />
      <el-table-column label="父节点id" align="center" prop="parentId" v-if="false" />
      <el-table-column label="节点名称" align="center" prop="jdmc" />
      <el-table-column label="层级类型(单元/课程/课程任务)" align="center" prop="cjlx" :formatter="cjlxFormat" />
      <el-table-column label="课程名称" align="center" prop="kcmc" />
      <el-table-column label="预计所需课时" align="center" prop="yjsxks" />
      <el-table-column label="预计所需天数" align="center" prop="yjsxts" />
      <el-table-column label="教学要求" align="center" prop="jxyq" />
      <el-table-column label="课程类型(新课、复习课)" align="center" prop="kclx" :formatter="kclxFormat" />
      <el-table-column label="对应学期数" align="center" prop="dyxqs" />
      <el-table-column label="主要内容" align="center" prop="zynr" />

      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:teachingTemplate:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['basic:teachingTemplate:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:teachingTemplate:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改教学计划模板对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="教材或册数" prop="glid">
          <treeselect v-model="form.glid" :options="teachingMaterialOptions" :normalizer="normalizerMaterial" placeholder="请选择教材或册数" />
        </el-form-item>
        <el-form-item label="归属节点" prop="parentId">
          <treeselect v-model="form.parentId" :options="teachingTemplateOptions" :normalizer="normalizer" placeholder="请选择父节点" />
        </el-form-item>
        <el-form-item label="层级类型" prop="cjlx">
          <el-select v-model="form.cjlx" placeholder="单元/课程/课程任务" @change="onCjlxChange" >
            <el-option
              v-for="dict in cjlxOptions"
              :key="dict.dictCode"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="jdmcRender" prop="jdmc">
          <el-input v-model="form.jdmc" placeholder="请输入" maxLength="100" />
        </el-form-item>
        <el-form-item label="课程" prop="kcmc" v-if="enableShow">
          <el-input v-model="form.kcmc" placeholder="请输入课程名称,例如:第1课，第2课，第3课·····" maxLength="50" />
        </el-form-item>
        <el-form-item label="预计所需课时" prop="yjsxks" v-if="enableShow">
          <el-input v-model="form.yjsxks" placeholder="请输入预计所需课时" maxLength="5" />
        </el-form-item>
        <el-form-item label="预计所需天数" prop="yjsxts" v-if="enableShow">
          <el-input v-model="form.yjsxts" placeholder="请输入预计所需天数" maxLength="5" />
        </el-form-item>
        <el-form-item label="教学要求" prop="jxyq">
          <el-input v-model="form.jxyq" type="textarea" placeholder="请输入教学要求" maxLength="200" />
        </el-form-item>
        <el-form-item label="课程类型" prop="kclx" v-if="enableShow">
          <el-select v-model="form.kclx" placeholder="新课、复习课">
            <el-option
              v-for="dict in kclxOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对应学期数" prop="dyxqs" v-if="enableShow">
          <el-input v-model="form.dyxqs" placeholder="请输入对应学期数" maxLength="5" />
        </el-form-item>
        <el-form-item label="主要内容" prop="zynr" v-if="enableShow">
          <el-input v-model="form.zynr" type="textarea" placeholder="请输入主要内容" maxLength="100" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" maxLength="80" />
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
import { listTeachingTemplate, getTeachingTemplate, delTeachingTemplate, addTeachingTemplate, updateTeachingTemplate, exportTeachingTemplate } from "@/api/basic/teachingTemplate";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listTeachingMaterial} from "@/api/basic/teachingMaterial";
export default {
  name: "TeachingTemplate",
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 教学计划模板表格数据
      teachingTemplateList: [],
      // 教学计划模板树选项
      teachingTemplateOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 课程类型(新课、复习课)字典
      kclxOptions: [],
      // 层级类型(单元/课程/课程任务)字典
      cjlxOptions: [],
      // 查询参数
      queryParams: {
        glid: null,
        parentId: null,
        jdmc: null,
        kcmc: null,
        kclx: null,
        cjlx: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 教材树选项
      teachingMaterialOptions:[],
      // 渲染:节点名称
      jdmcRender:"名称",
      // 启用显示
      enableShow:false
    };
  },
  created() {
    this.getList();
    this.getDicts("teachingCourseType").then(response => {
      this.kclxOptions = response.data;
    });
    this.getDicts("teachingCjlx").then(response => {
      this.cjlxOptions = response.data;
    });
    this.getMaterialTreeselect()
  },
  methods: {
    /** 查询教学计划模板列表 */
    getList() {
      this.loading = true;
      listTeachingTemplate(this.queryParams).then(response => {
        this.teachingTemplateList = this.handleTree(response.data, "id", "parentId");
        this.loading = false;
      });
    },
    /** 转换教学计划模板数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.jdmc,
        children: node.children
      };
    },
	/** 查询教学计划模板下拉树结构 */
    getTreeselect() {
      listTeachingTemplate().then(response => {
        this.teachingTemplateOptions = [];
        const data = { id: 0, jdmc: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.teachingTemplateOptions.push(data);
      });
    },
    /** 转换教材数据结构 */
    normalizerMaterial(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.jcmc,
        children: node.children
      };
    },
    /** 查询教材下拉树结构 */
    getMaterialTreeselect() {
      listTeachingMaterial().then(response => {
        this.teachingMaterialOptions = [];
        const data = { id: 0, jcmc: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.teachingMaterialOptions.push(data);
      });
    },
    // 课程类型(新课、复习课)字典翻译
    kclxFormat(row, column) {
      return this.selectDictLabel(this.kclxOptions, row.kclx);
    },
    // 层级类型(单元/课程/课程任务)字典翻译
    cjlxFormat(row, column) {
      return this.selectDictLabel(this.cjlxOptions, row.cjlx);
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
        glid: null,
        parentId: null,
        jdmc: null,
        kcmc: null,
        yjsxks: null,
        yjsxts: null,
        jxyq: null,
        kclx: null,
        dyxqs: null,
        zynr: null,
        cjlx: null,
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
      this.invokeTreeselect();
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加教学计划模板";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.invokeTreeselect();
      this.onCjlxChange(row.cjlx);
      if (row != null) {
        this.form.parentId = row.id;
      }
      getTeachingTemplate(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改教学计划模板";
      });
    },
    invokeTreeselect(){
      this.getTreeselect();
      this.getMaterialTreeselect()
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeachingTemplate(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeachingTemplate(this.form).then(response => {
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
      this.$confirm('是否确认删除选中数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeachingTemplate(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e)=>{
          console.log(e);
      })
    },
    // 选择层级类型触发
    onCjlxChange(val){
      let dict=this.cjlxOptions
      for (let i = 0; i <dict.length ; i++) {
        if(dict[i].dictValue==val){
          this.jdmcRender=dict[i].dictLabel;
        }
      }
      if("1"!==val){// 不是单元类型时显示
        this.enableShow=true
      }else{
        this.enableShow=false
      }

    },
  }
};
</script>
