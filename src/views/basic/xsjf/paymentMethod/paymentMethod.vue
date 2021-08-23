<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basic:paymentIncome:add']"
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
          v-hasPermi="['basic:paymentIncome:edit']"
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
          v-hasPermi="['basic:paymentIncome:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :height="$root.tableHeight"
      border
      :data="paymentIncomeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="进账名称" align="center" prop="jzmc" />
      <el-table-column label="微信" align="center" prop="weixin">
        <template slot-scope="scope">
          <div class="demo-image__preview">
            <el-image
              v-for="(item,index) in scope.row.weixinArr"
              :key="index"
              style="width: 100px; height: 100px;margin-right : 10px"
              :src="item.url"
              :preview-src-list="scope.row.weixinArr"
            ></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="支付宝" align="center" prop="zhifubao">
        <template slot-scope="scope">
          <div class="demo-image__preview">
            <el-image
              v-for="(item,index) in scope.row.zhifubaoArr"
              :key="index"
              style="width: 100px; height: 100px;margin-right : 10px"
              :src="item.url"
              :preview-src-list="scope.row.zhifubaoArr"
            ></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="银行卡" align="center" prop="yhk" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:paymentIncome:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:paymentIncome:remove']"
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

    <!-- 添加或修改缴费进账方式对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="进账名称" prop="jzmc">
          <el-input v-model="form.jzmc" placeholder="请输入进账名称" />
        </el-form-item>
        <el-form-item label="微信" prop="weixin">
          <el-upload
            :action="upload.imgUrl"
            :headers="upload.headers"
            list-type="picture-card"
            :on-preview="WhandlePictureCardPreview"
            :on-remove="WhandleRemove"
            :on-success="wxSuccess"
            :file-list="form.weixinArr"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="WdialogVisible">
            <img width="100%" :src="WdialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="支付宝" prop="zhifubao">
          <el-upload
            :action="upload.imgUrl"
            :headers="upload.headers"
            list-type="picture-card"
            :on-preview="ZhandlePictureCardPreview"
            :on-remove="ZhandleRemove"
            :on-success="zfbSuccess"
            :file-list="form.zhifubaoArr"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="ZdialogVisible">
            <img width="100%" :src="ZdialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="银行卡" prop="yhk">
          <el-input v-model="form.yhk" placeholder="请输入银行卡" />
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
import {
  listPaymentIncome,
  listAndPhoto,
  getPaymentIncome,
  delPaymentIncome,
  addPaymentIncome,
  updatePaymentIncome
} from "@/api/basic/paymentIncome";
import { getToken } from "@/utils/auth";
import { secretKey } from "@/utils/tools";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
export default {
  name: "PaymentIncome",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      importBtn: false,
      fullscreenLoading: false,
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
      // 缴费进账方式表格数据
      paymentIncomeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jzmc: null,
        weixin: null,
        zhifubao: null,
        yhk: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 导入参数
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "导入缴费进账方式数据",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传图片地址
        imgUrl: process.env.VUE_APP_BASE_API + "/file/upload"
      },
      WdialogImageUrl: "",
      ZdialogImageUrl: "",
      WdialogVisible: false,
      ZdialogVisible: false,
      file1: null,
      file2: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询缴费进账方式列表 */
    getList() {
      this.loading = true;
      listAndPhoto(this.queryParams).then(response => {
        this.paymentIncomeList = response.rows;
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
        jzmc: null,
        weixin: null,
        zhifubao: null,
        yhk: null,
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加缴费进账方式";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getPaymentIncome(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改缴费进账方式";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePaymentIncome(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPaymentIncome(this.form).then(response => {
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
      this.$confirm("是否确认删除选中的数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delPaymentIncome(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 图片预览 大图(微信)
    WhandlePictureCardPreview(file) {
      this.WdialogImageUrl = file.url;
      this.WdialogVisible = true;
    },
    //图片删除(微信)
    WhandleRemove(file, fileList) {
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
    // 支付宝上传文件成功回调
    wxSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.weixin || secretKey();
      this.form.weixin = data.kzzd1;
      addImg(data).then(res => {
        if (res.code == 200) {
          this.msgSuccess("上传成功");
        }
      });
    },
    // 图片预览 大图(支付宝)
    ZhandlePictureCardPreview(file) {
      this.ZdialogImageUrl = file.url;
      this.ZdialogVisible = true;
    },
    //图片删除(支付宝)
    ZhandleRemove(file, fileList) {
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
    // 支付宝上传文件成功回调
    zfbSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.zhifubao || secretKey();
      this.form.zhifubao = data.kzzd1;
      addImg(data).then(res => {
        if (res.code == 200) {
          this.msgSuccess("上传成功");
        }
      });
    }
  }
};
</script>
