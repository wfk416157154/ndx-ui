<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="广告类型" prop="advertisementType">
        <el-select v-model="queryParams.advertisementType" placeholder="请选择广告类型" clearable size="small">
          <el-option label="请选择字典生成" value="" >
            v-for="dict in advertisementTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告标题" prop="advertisementTitle">
        <el-input
          v-model="queryParams.advertisementTitle"
          placeholder="请输入广告标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="是否发送所有(0:否 1:是)" prop="sffbsy">
        <el-input
          v-model="queryParams.sffbsy"
          placeholder="请输入是否发送所有(0:否 1:是)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="备注" prop="remake">
        <el-input
          v-model="queryParams.remake"
          placeholder="请输入备注"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        /> -->
      <!-- </el-form-item> -->
      <!-- <el-form-item label="发送者id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入发送者id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="校区id" prop="xqid">
        <el-input
          v-model="queryParams.xqid"
          placeholder="请输入校区id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="发送者姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入发送者姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序号" prop="dataOrder">
        <el-input
          v-model="queryParams.dataOrder"
          placeholder="请输入排序号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
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
          v-hasPermi="['pad:advertisement:add']"
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
          v-hasPermi="['pad:advertisement:edit']"
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
          v-hasPermi="['pad:advertisement:remove']"
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
          v-hasPermi="['pad:advertisement:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :height="$root.tableHeight" border :data="advertisementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column label="广告类型" align="center" prop="advertisementType" :formatter="advertisementFormat"/>
      <el-table-column label="广告标题" align="center" prop="advertisementTitle" />
      <el-table-column label="广告内容" align="center" prop="advertisementContent" />
<!--      <el-table-column label="是否发送所有(0:否 1:是)" align="center" prop="sffbsy" />-->
      <!-- <el-table-column label="备注" align="center" prop="remake" />
      <el-table-column label="校区id" align="center" prop="xqid" />
      <el-table-column label="发送者姓名" align="center" prop="userName" /> -->
      <el-table-column label="状态" align="center" prop="status" :formatter="typeFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pad:advertisement:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pad:advertisement:remove']"
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

    <!-- 添加或修改广告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="广告类型" prop="advertisementType">
          <el-select v-model="form.advertisementType" placeholder="请选择广告类型">
            <el-option
              v-for="dict in advertisementOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告标题" prop="advertisementTitle">
          <el-input v-model="form.advertisementTitle" placeholder="请输入广告标题" />
        </el-form-item>
        <el-form-item label="文件" prop="id">
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
            :before-upload="beforeFile"
            :data="fileForm"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许上传50M以内的文件！</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否发送所有(0:否 1:是)" prop="sffbsy">
          <el-select v-model="form.sffbsy" placeholder="请选择是否发送给所有用户"  >
            <el-option
              v-for="dict in sffbsyOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接收人" prop="jsrArr" v-if="form.sffbsy=='0'">
          <el-select
            v-model="form.xqid"
            filterable
            placeholder="请选择校区名称"
            @change="xqmcOnChange"
          >
            <el-option v-for="(item,index) in selectXqmc" :key="index" :label="item.xxmc" :value="item.id"></el-option>
          </el-select>
          <el-select
            v-model="lsphone"
            filterable
            placeholder="请选择老师"
            @change="teacherOnChange"
          >
            <el-option v-for="(item,index) in teacherList" :key="index" :label="item.lsxm+'-'+item.dhhm"
                       :value="item.lsxm+'-'+item.dhhm"></el-option>
          </el-select>

          <el-checkbox-group v-model="form.jsrArr">
            <el-checkbox
              v-for="(item,index) in teacherList"
              :key="index"
              :label="item.lsxm+'-'+item.dhhm"
              name="jsrArr"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="备注" prop="remake">
          <el-input v-model="form.remake" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="发送者id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入发送者id" />
        </el-form-item>
        <el-form-item label="校区id" prop="xqid">
          <el-input v-model="form.xqid" placeholder="请输入校区id" />
        </el-form-item>
        <el-form-item label="发送者姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入发送者姓名" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序号" prop="dataOrder">
          <el-input v-model="form.dataOrder" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="扩展字段1" prop="kzzd1">
          <el-input v-model="form.kzzd1" placeholder="请输入扩展字段1" />
        </el-form-item>
        <el-form-item label="扩展字段2" prop="kzzd2">
          <el-input v-model="form.kzzd2" placeholder="请输入扩展字段2" />
        </el-form-item>
        <el-form-item label="扩展字段3" prop="kzzd3">
          <el-input v-model="form.kzzd3" placeholder="请输入扩展字段3" />
        </el-form-item>
        <el-form-item label="扩展字段4" prop="kzzd4">
          <el-input v-model="form.kzzd4" placeholder="请输入扩展字段4" />
        </el-form-item>
        <el-form-item label="扩展字段5" prop="kzzd5">
          <el-input v-model="form.kzzd5" placeholder="请输入扩展字段5" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


  </div>


</template>

<script>
import { listAdvertisement, getAdvertisement, delAdvertisement, addAdvertisement, updateAdvertisement } from "@/api/pad/advertisement";
import { getToken } from "@/utils/auth";
import {listSchool} from "@/api/basic/school";
import {listTeacher} from "@/api/basic/teacher";
import {addImg, selectFileList, deleteImg} from "@/api/tool/common";
import {secretKey} from "@/utils/tools";

export default {
  name: "Advertisement",
  components: {
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
      // 广告表格数据
      advertisementList: [],
      // 广告类型字典数据
      advertisementOptions: [],
      //是否发布所有字典数据
      sffbsyOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        advertisementType: null,
        advertisementTitle: null,
        advertisementContent: null,
        sffbsy: null,
        remake: null,
        userId: null,
        xqid: null,
        userName: null,
        status: null,
        dataOrder: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        advertisementType: [
          { required: true, message: "广告类型不能为空", trigger: "blur" }
        ],
        advertisementTitle: [
          { required: true, message: "广告标题不能为空", trigger: "blur" }
        ],
        advertisementContent: [
          { required: true, message: "广告内不能为空", trigger: "blur" }
        ],
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
        headers: {Authorization: "Bearer " + getToken()},
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/file/renameUpload"
      },
      fileForm: {
        renameFileName: ""
      },
      // 文件id数组
      wjidFile: [],
      // 老师列表
      teacherList: [],
      //校区名称
      selectXqmc: [],
      // 校区id
      xqid: null,
      wjid: null,
      //老师电话
      lsphone: null
    };
  },
  created() {
    this.getList();
    this.getDicts("pad_advertisement_type").then(response => {
      this.advertisementOptions = response.data;
      console.log(this.advertisementOptions)
    });
    this.getDicts("sys_common_status").then(response => {
      this.typeOptions = response.data;
      console.log(this.typeOptions)
    });
    this.getDicts("isOrNot").then(response => {
      this.sffbsyOptions = response.data;
      console.log(this.sffbsyOptions)
    });
    // 获取校区
    listSchool().then(response => {
      this.selectXqmc = response.rows;
    });
  },
  methods: {
    //  文件上传修改名称
       beforeFile(file) {
        this.fileForm.renameFileName ='平板公告管理-'+file.name
    },
    /** 查询广告列表 */
    getList() {
      this.loading = true;
      listAdvertisement(this.queryParams).then(response => {
        this.advertisementList = response.rows;
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
        advertisementType: null,
        advertisementTitle: null,
        advertisementContent: null,
        sffbsy: null,
        remake: null,
        userId: null,
        xqid: null,
        userName: null,
        status: 0,
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
    // 广告类型字典翻译
    advertisementFormat(row, column) {
      return this.selectDictLabel(this.advertisementOptions, row.advertisementType);
    },
    // 广告类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.status);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加广告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAdvertisement(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改广告";
      });
    },
    // 选择老师触发
    teacherOnChange(lsdh) {
      this.form.jsrArr = [lsdh]
    },
    // 选择校区触发
    xqmcOnChange(xqid) {
      this.lsphone = null
      listTeacher({xqmc: xqid}).then(response => {
        this.teacherList = response.rows;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAdvertisement(this.form).then(response => {
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
            addAdvertisement(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除选中的数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAdvertisement(ids);
        }).then((res) => {
            if(200==res.code){
                this.getList();
                this.msgSuccess("删除成功");
            }else{
                this.msgError("删除失败");
            }
        }).catch((e)=>{
          console.log(e);
      })

    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('pad/advertisement/export', {
        ...this.queryParams
      }, `广告-${new Date().getTime()}.xlsx`)
    },

      /** 导入按钮操作 */
      handleImport() {
          this.importBtn=false
          this.upload.title = "广告数据导入";
          this.upload.open = true;
          this.$nextTick(() => {// 页面元素加载完成后执行该方法
              this.$refs.upload.clearFiles();
          });
      },
      /** 下载模板操作 */
      importTemplate() {
          this.download('pad/advertisement/importTemplate', {
              ...this.queryParams
          }, `广告-导入模板-${new Date().getTime()}.xlsx`)
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
          this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.ifPhotoLimit(fileList.length, " 个文件")
        this.upload.open = false;
        this.upload.isUploading = false;
        console.log(response)
        this.form.advertisementContent = response.data.url
        console.log(response.data.url)
        this.$refs.upload.clearFiles();
      },
    // 文件限制判断
    ifPhotoLimit(num, msg) {
      if (num >= this.maxPhotoNum) {
        this.$message({
          message: "最多上传 " + this.maxPhotoNum + msg,
          type: "warning"
        });
      }
    },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      }


  }
};
</script>
