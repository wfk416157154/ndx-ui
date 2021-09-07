<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="lx">
        <el-select v-model="queryParams.lx" placeholder="请选择类型" clearable size="small">
          <el-option
            v-for="dict in lxOptions"
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
          v-hasPermi="['basic:fileManagement:add']"
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
          v-hasPermi="['basic:fileManagement:edit']"
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
          v-hasPermi="['basic:fileManagement:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :height="$root.tableHeight" border :data="fileManagementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" v-if="false" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="类型" align="center" prop="lx" >
        <template slot-scope="scope">
          <dict-tag :options="lxOptions" :value="scope.row.lx"/>
        </template>
      </el-table-column>
      <el-table-column label="要求" align="center" prop="yaoqiu"  />
      <el-table-column label="图片示例id" align="center" prop="tpslid" v-if="false" />
      <el-table-column label="图片示例" align="center" prop="tpslArr" :width="flexColumnWidth('tpslArr',fileManagementList)" >
        <template slot-scope="scope">
          <div class="block" style="display : flex; width : 100% ; height : 100%">
            <el-image
              style="width: 60px; height: 60px; margin : 0px 5px"
              v-for="(item,index) in scope.row.tpslArr"
              :key="index"
              :src="item"
              :preview-src-list="scope.row.tpslArr"
            >
              <div
                slot="error"
                style="width : 100%; height : 100%; display : flex; align-items : center;background : #eee; font-size : 12px;justify-content:center;color : #c0c4cc"
                class="image-slot"
              >
                <span>加载失败</span>
              </div>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="文件id" align="center" prop="wjid" v-if="false" />
      <el-table-column label="点击文件名下载" align="center" prop="wjidArr" width="280px" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-for="(item,index) in scope.row.wjidArr"
            :key="index"
            @click="downloadFileName(item.wjmc,scope.row.title)"
          >{{item.wjmc}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:fileManagement:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:fileManagement:remove']"
          >删除</el-button>
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

    <!-- 添加或修改文件管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="类型" prop="lx">
          <el-select v-model="form.lx" placeholder="请选择类型">
            <el-option
              v-for="dict in lxOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="要求" prop="yaoqiu">
          <el-input type="textarea" v-model="form.yaoqiu"  placeholder="请输入要求" />
        </el-form-item>
        <el-form-item label="图片示例" prop="tpslid">
          <el-upload
            :action="upload.url"
            :headers="upload.headers"
            list-type="picture-card"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :limit="maxPhotoNum"
            :file-list="tpslPhoto"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="文件" prop="wjid">
          <el-upload
            ref="upload"
            :limit="maxPhotoNum"
            accept=".*"
            :headers="upload.headers"
            :action="upload.url"
            :disabled="upload.isUploading"
            :on-remove="handleRemove"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :auto-upload="true"
            :file-list="wjidFile"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许上传“xls”或“xlsx”格式文件！</div>
          </el-upload>
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
  import { listFileManagement, getFileManagement, delFileManagement, addFileManagement, updateFileManagement } from "@/api/basic/fileManagement";
  import { getToken } from "@/utils/auth";
  import { addImg, selectFileList, deleteImg } from "@/api/tool/common";
  import { secretKey } from "@/utils/tools";
  import Template from "../../teaching/template/index";
  export default {
    name: "FileManagement",
    components: {
      Template
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        importBtn:false,
        fullscreenLoading:false,
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
        // 文件管理表格数据
        fileManagementList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 类型(码表：fileManagementType)字典
        lxOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          title: null,
          lx: null,
          tpslid: null,
          wjid: null,
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
          title: "上传文件",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/file/upload"
        },
        // 图片示例数组
        tpslPhoto:[],
        // 文件id数组
        wjidFile:[],
        // 最多上传的图片数量
        maxPhotoNum:3
      };
    },
    created() {
      this.getList();
      this.getDicts("fileManagementType").then(response => {
        this.lxOptions = response.data;
      });
    },
    methods: {
      /** 查询文件管理列表 */
      getList() {
        this.loading = true;
        listFileManagement(this.queryParams).then(response => {
          this.fileManagementList = response.rows;
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
          title: null,
          lx: null,
          yaoqiu: null,
          tpslid: null,
          wjid: null,
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
        this.title = "添加文件管理";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getFileManagement(id).then(response => {
          this.form = response.data;
          this.tpslPhoto=this.ifNullToNewArray(response.data.tpslArr);
          this.wjidFile=this.ifNullToNewArray(response.data.wjidArr);
          this.open = true;
          this.title = "修改文件管理";
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
              updateFileManagement(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addFileManagement(this.form).then(response => {
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
          return delFileManagement(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e)=>{
          console.log(e);
        })
      },
      /** 下载模板操作 */
      downloadFileName(fileName,title) {
        title=title+fileName.substring(fileName.indexOf("."),fileName.length);
        this.download('file/filetable/download', {
          wjmc:fileName
        }, title)
      },

      // 图片上传成功的回调
      handleAvatarSuccess(response, file, fileList) {
        this.ifPhotoLimit(fileList.length," 张图片")
        let data = response.data;
        data.kzzd1 = this.form.tpslid || secretKey();
        this.form.tpslid = data.kzzd1;
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
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.ifPhotoLimit(fileList.length," 个文件")
        this.upload.open = false;
        this.upload.isUploading = false;
        let data = response.data;
        data.kzzd1 = this.form.wjid || secretKey();
        this.form.wjid = data.kzzd1;
        addImg(data).then(res => {
          file.id=res.data.id;
          this.msgSuccess("文件上传成功")
          this.wjidFile=fileList;
        });
        this.$refs.upload.clearFiles();
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
      // 宽度适配
      flexColumnWidth(str, tableData) {
        let arr = [];
        for (let i = 0; i < tableData.length; i++) {
          if (tableData[i] && tableData[i][str] && tableData[i][str].length > 0) {
            tableData.forEach(obj => {
              if (obj[str] && obj[str].length) arr.push(obj[str].length);
            });
          } else {
            continue;
          }
        }
        return Math.max.call(null, ...arr) * 75;
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
