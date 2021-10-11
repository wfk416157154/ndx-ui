<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="校区名称" prop="xqmc" >
        <el-select v-model="queryParams.xqmc" filterable placeholder="请选择校区名称" @change="xqmcOnChange">
          <el-option
            v-for="item in schoolList"
            :key="item.id"
            :label="item.xxmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日语班" prop="ryb">
        <el-select v-model="queryParams.ryb" filterable placeholder="请选择日语班级">
          <el-option
            v-for="item in bjclassList "
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="老师姓名" prop="rylsxm">
        <el-input
          v-model="queryParams.rylsxm"
          placeholder="请输入老师姓名"
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
      <!--<el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basic:classroom:add']"
        >新增</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-tag type="info" style="margin-right: 10px">请先勾选数据再点击审核按钮</el-tag>
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleShenhe(true)"
          v-hasPermi="['basic:classroom:edit']"
        >合格</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="single"
          @click="handleShenhe(false)"
          v-hasPermi="['basic:classroom:edit']"
        >不合格</el-button>
      </el-col>
      <el-col :span="1.5">
          <el-input
            v-model="queryParams.reason"
            placeholder="请输入审核不通过的原因"
            clearable
            size="small"
          />
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basic:classroom:remove']"
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
          v-hasPermi="['basic:classroom:export']"
        >导出</el-button>
      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table style="width: 100%;font-size : 18px" border v-loading="loading" :data="classroomList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" v-if="false" />
      <el-table-column label="校区名称" align="center" prop="xqmc" v-if="false" />
      <el-table-column label="日语班" align="center" prop="ryb" />
      <el-table-column label="老师姓名" align="center" prop="rylsxm" />
      <el-table-column label="教室图片" align="center" prop="jstpArr" :width="flexColumnWidth('jstpArr',classroomList)" >
        <template slot-scope="scope">
          <div class="block" style="display : flex; width : 100% ; height : 100%">
            <el-image
              style="width: 60px; height: 60px; margin : 0px 5px"
              v-for="(item,index) in scope.row.jstpArr"
              :key="index"
              :src="item"
              :preview-src-list="scope.row.jstpArr"
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
      <el-table-column label="是否合格" align="center" prop="status" >
        <template slot-scope="scope">
          <dict-tag :options="spztOptions" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="上传时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="false" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:classroom:edit']"
          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:classroom:remove']"
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

    <!-- 添加或修改教室图片对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="校区名称" prop="xqmc">
          <el-select v-model="form.xqmc" placeholder="请选择校区名称">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="日语班" prop="ryb">
          <el-select v-model="form.ryb" placeholder="请选择日语班">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="老师姓名" prop="rylsxm">
          <el-input v-model="form.rylsxm" placeholder="请输入老师姓名" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

      <!-- 导入对话框 -->
      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
          <el-upload
                  ref="upload"
                  :limit="1"
                  accept=".xlsx, .xls"
                  :headers="upload.headers"
                  :action="upload.url + '?updateSupport=' + upload.updateSupport"
                  :disabled="upload.isUploading"
                  :on-progress="handleFileUploadProgress"
                  :on-success="handleFileSuccess"
                  :auto-upload="false"
                  drag
          >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                  <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据
                  <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
              </div>
              <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitFileForm">确 定</el-button>
              <el-button @click="upload.open = false">取 消</el-button>
          </div>
      </el-dialog>

  </div>


</template>

<script>
import { listClassroom, getClassroom, delClassroom, addClassroom, updateClassroom } from "@/api/basic/classroom";
import { getToken } from "@/utils/auth";
import { listBjclass } from "@/api/basic/bjclass";
import { listSchool } from "@/api/basic/school";

export default {
  name: "Classroom",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 审批状态数组
      spzts:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 教室图片表格数据
      classroomList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xqmc: null,
        ryb: null,
        rylsxm: null,
        reason:null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 用户导入参数
      upload: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "导入教室图片数据",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "basic/classroom/importData"
      },
      //校区信息
      schoolList: [],
      // 班级信息
      bjclassList: [],
      // 审批状态
      spztOptions:[],
    };
  },
  created() {
    this.getList();
    listSchool().then(response => {
      this.schoolList = response.rows;
      if (this.schoolList.length==1){
        this.queryParams.xqmc =response.rows[0].id;
      }
    });
    // 日语班级选项 -当老师角色登录
    if(this.$store.state.user.dataRoleWeightId==50){
      listBjclass().then(response => {
        this.bjclassList = response.rows
        if (response.rows.length==1){
          this.queryParams.ryb=response.rows[0].id
        }
      });
    }
    // 是否通过
    this.getDicts("isOrNot").then(response => {
      this.spztOptions = response.data;
    });

  },
  methods: {
    /** 查询教室图片列表 */
    getList() {
      this.loading = true;
      listClassroom(this.queryParams).then(response => {
        this.classroomList = response.rows;
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
        xqmc: null,
        ryb: null,
        rylsxm: null,
        status: "0",
        remark: null,
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
      this.single = selection.length<1
      this.multiple = !selection.length
      this.spzts = selection.map(item => item.status)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加教室图片";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getClassroom(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改教室图片";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateClassroom(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addClassroom(this.form).then(response => {
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
      this.$confirm('是否确认删除教室图片编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delClassroom(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basic/classroom/export', {
        ...this.queryParams
      }, `教室图片.xlsx`)
    },

      /** 导入按钮操作 */
      handleImport() {
          this.upload.title = "教室图片数据导入";
          this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
          this.download('basic/classroom/importTemplate', {
              ...this.queryParams
          }, `教室图片-导入模板.xlsx`)
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
          this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
          this.upload.open = false;
          this.upload.isUploading = false;
          this.$refs.upload.clearFiles();
          this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
          this.getList();
      },
      // 提交上传文件
      submitFileForm() {
          this.$refs.upload.submit();
      },
      // 处理审核
      async handleShenhe(flag) {
        if (flag) {// 点击审核通过
          this.form.status = 1
        } else {// 点击审核不通过
          if(this.queryParams.reason){
            this.form.status = 0
            this.form.remark=this.queryParams.reason // 赋值给备注字段
          }else{
            this.msgError("请输入审核不通过的原因！")
            return;
          }
        }
        let idsArr = this.ids
        for (let i = 0; i < idsArr.length; i++) {
          let spzt=this.spzts[i]
          if(null!=spzt&&""!=spzt){
            this.msgError("选中的数据中包含已审核的数据！请选择未审核的数据")
            return;
          }
          this.form.id = idsArr[i]
          await updateClassroom(this.form).then(response => {
          });
        }
        this.msgSuccess("操作成功");
        this.getList();
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
      // 校区名称选择后调用的方法
      xqmcOnChange(id){
        listBjclass({kzzd1:id}).then(response => {
          this.bjclassList = response.rows
        });
      },


  }
};
</script>
