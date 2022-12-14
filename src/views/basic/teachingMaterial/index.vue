<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="教材名称" prop="jcmc">
        <el-input
          v-model="queryParams.jcmc"
          placeholder="请输入教材名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="父教材id" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入父教材id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
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
          v-hasPermi="['basic:teachingMaterial:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      border
      v-loading="loading"
      :data="teachingMaterialList"
      row-key="id"
      default-expand-all
      style="width: 100%;font-size : 18px"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="教材名称" prop="jcmc" />
      <el-table-column label="父教材id" align="center" prop="parentId" />
      <el-table-column label="教材图片" align="center" prop="jctp" />
      <el-table-column label="教材册数" align="center" prop="jcce" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:teachingMaterial:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['basic:teachingMaterial:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:teachingMaterial:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改教材对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="教材名称" prop="jcmc">
          <el-input v-model="form.jcmc" placeholder="请输入教材名称" />
        </el-form-item>
        <el-form-item label="父教材id" prop="parentId">
          <treeselect v-model="form.parentId" :options="teachingMaterialOptions" :normalizer="normalizer" placeholder="请选择父教材id" />
        </el-form-item>
        <el-form-item label="教材图片" prop="jctp">
          <el-upload
            :action="upload.url"
            :headers="upload.headers"
            list-type="picture-card"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :limit="maxPhotoNum"
            :file-list="jctpPhoto"
            :before-upload="beforeFile"
            :data="fileForm"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="教材册数" prop="jcce">
          <el-input v-model="form.jcce" placeholder="请输入教材册数" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listTeachingMaterial, getTeachingMaterial, delTeachingMaterial, addTeachingMaterial, updateTeachingMaterial, exportTeachingMaterial } from "@/api/basic/teachingMaterial";
import Treeselect from "@riophae/vue-treeselect";
import { getToken } from "@/utils/auth";
import { addImg, selectFileList, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "TeachingMaterial",
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 教材表格数据
      teachingMaterialList: [],
      // 教材树选项
      teachingMaterialOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        jcmc: null,
        parentId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 上传参数
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "上传图片",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/file/renameUpload"
      },
      fileForm: {
            renameFileName: ""
          },
      // 图片示例数组
      jctpPhoto:[],
      // 最多上传的图片数量
      maxPhotoNum:3
    };
  },
  created() {
    this.getList();
  },
  methods: {
     //  文件上传修改名称
       beforeFile(file) {
        this.fileForm.renameFileName ='教材列表-'+file.name
    },
    /** 查询教材列表 */
    getList() {
      this.loading = true;
      listTeachingMaterial(this.queryParams).then(response => {
        this.teachingMaterialList = this.handleTree(response.data, "id", "parentId");
        this.loading = false;
      });
    },
    /** 转换教材数据结构 */
    normalizer(node) {
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
    getTreeselect() {
      listTeachingMaterial().then(response => {
        this.teachingMaterialOptions = [];
        const data = { id: 0, jcmc: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.teachingMaterialOptions.push(data);
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
        jcmc: null,
        parentId: null,
        jctp: null,
        jcce: null,
        status: 0,
        remark: null,
        userId: null,
        userName: null,
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
      this.getTreeselect();
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加教材";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.id;
      }
      getTeachingMaterial(row.id).then(response => {
        this.form = response.data;
        this.jctpPhoto=this.ifNullToNewArray(response.data.jctpArr)
        this.open = true;
        this.title = "修改教材";
      });
    },
    ifNullToNewArray(arr){
      if(null==arr){
        return [];
      }
      return arr;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeachingMaterial(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeachingMaterial(this.form).then(response => {
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
          return delTeachingMaterial(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e)=>{
          console.log(e);
      })
    },

    // 图片上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      this.ifPhotoLimit(fileList.length," 张图片")
      let data = response.data;
      data.kzzd1 = this.form.jctp || secretKey();
      this.form.jctp = data.kzzd1;
      addImg(data).then(res => {
        file.id=res.data.id;
        this.msgSuccess("图片上传成功")
      });
    },

    //公共图片删除
    handleRemove(file, fileList) {
      deleteImg(file.id).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    // 图片限制判断
    ifPhotoLimit(num,msg) {
      if (num >= this.maxPhotoNum) {
        this.$message({
          message: "最多上传 "+this.maxPhotoNum+msg,
          type: "warning"
        });
      }
    },

  }
};
</script>
