<template>
  <div class="app-container">
    <el-form class="wrap-el-dialog" ref="form" :model="form" :rules="rules" label-width="80px">
      <!-- <el-col :span="12"> -->
      <el-form-item label-width="180px" label="老师头像" prop="lstx">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <!-- </el-col> -->
      <el-col :span="12">
        <el-form-item label-width="180px" label="校区名称" prop="xqmc">
          <el-select v-model="value" placeholder="请选择校区名称">
            <el-option
              v-for="item in campusName"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="日语班级" prop="rybj">
          <el-select v-model="value" placeholder="请选择日语班级">
            <el-option
              v-for="item in japaneseClass "
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="老师姓名" prop="lsxm">
          <el-input maxlength="4" v-model="form.lsxm" placeholder="请输入老师姓名" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="性别" prop="xb">
          <el-select v-model="form.xb" placeholder="请选择性别">
            <el-option
              v-for="dict in xbOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="入职时间" prop="rzsj">
          <el-date-picker
            clearable
            size="mini"
            v-model="form.rzsj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择入职时间"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="入职工龄" prop="rzgl">
          <el-input v-model="form.rzgl" placeholder="请输入入职工龄" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="身份证号" prop="sfzh">
          <el-input maxlength="18" v-model="form.sfzh" placeholder="请输入身份证号" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="电话号码" prop="dhhm">
          <el-input maxlength="11" v-model="form.dhhm" placeholder="请输入电话号码" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="家庭地址" prop="jtzz">
          <el-input maxlength="50" v-model="form.jtzz" placeholder="请输入家庭地址" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="现住址" prop="xzz">
          <el-input maxlength="50" v-model="form.xzz" placeholder="请输入现住址" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="紧急联系人" prop="jjlxr">
          <el-input maxlength="4" v-model="form.jjlxr" placeholder="请输入紧急联系人" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="紧急联系人电话" prop="jjlxrdh">
          <el-input maxlength="11" v-model="form.jjlxrdh" placeholder="请输入紧急联系人电话" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="毕业学校" prop="byxx">
          <el-input maxlength="50" v-model="form.byxx" placeholder="请输入毕业学校" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="毕业专业" prop="byzy">
          <el-input maxlength="50" v-model="form.byzy" placeholder="请输入毕业专业" />
        </el-form-item>
      </el-col>
      <!-- <el-col :span="12"> -->
      <el-form-item label-width="180px" label="个人身份证正反扫描照" prop="grsfzsmz">
        <el-upload action="#" list-type="picture-card" :auto-upload="false">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <i class="el-icon-download"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- </el-col> -->
      <!-- <el-col :span="12"> -->
      <el-form-item label-width="180px" label="毕业证扫描件" prop="byzsmj">
        <el-upload action="#" list-type="picture-card" :limit="2" :auto-upload="false">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- </el-col> -->
      <!-- <el-col :span="12"> -->
      <el-form-item label-width="180px" label="学位证扫描件" prop="xwzsmj">
        <el-upload action="#" list-type="picture-card" :limit="2" :auto-upload="false">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- </el-col> -->
      <!-- <el-col :span="12"> -->
      <el-form-item label-width="180px" label="个人证件照白底蓝底" prop="grzjzbdld">
        <el-upload action="#" list-type="picture-card" :limit="1" :auto-upload="false">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- </el-col> -->
      <!-- <el-col :span="12"> -->
      <el-form-item label-width="180px" label="日语登记证书" prop="rydjzs">
        <el-upload action="#" list-type="picture-card" :limit="3" :auto-upload="false">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- </el-col> -->
      <el-col :span="12">
        <el-form-item label-width="180px" label="是否有教师资格证" prop="sfyjszgz">
          <el-select
            v-model="form.sfyjszgz"
            @change="selectChange(form.sfyjszgz)"
            placeholder="请选择是否有教师资格证"
          >
            <el-option
              v-for="dict in sfyjszgzOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="12"> -->
      <el-form-item v-if="isCertificais" label-width="180px" label="教师资格证" prop="jszgz">
        <el-upload action="#" list-type="picture-card" :limit="3" :auto-upload="false">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- </el-col> -->
      <el-col :span="12">
        <el-form-item label-width="180px" label="其他证书" prop="qtzs">
          <el-input v-model="form.qtzs" placeholder="请输入其他证书" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-form-item label-width="180px" label="备注" prop="remark">
        <el-input maxlength="300" v-model="form.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {
  listTeacher,
  getTeacher,
  delTeacher,
  addTeacher,
  updateTeacher
} from "@/api/basic/teacher";

export default {
  name: "Teacher",
  components: {},
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
      // 老师信息表格数据
      teacherList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: true,
      // 性别字典
      xbOptions: [],
      // 是否有教师资格证字典
      sfyjszgzOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xqmc: null,
        rybj: null,
        lsxm: null,
        xb: null,
        sfyjszgz: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 头像
      imageUrl: "",
      //证件照
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      //是否有教师资格证
      isCertificais: false,
      // 校区名称
      campusName: [],
      //日语班级
      japaneseClass : [],
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_user_sex").then(response => {
      this.xbOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.sfyjszgzOptions = response.data;
    });
    this.getDicts("basic_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询老师信息列表 */
    getList() {
      this.loading = true;
      listTeacher(this.queryParams).then(response => {
        this.teacherList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 性别字典翻译
    xbFormat(row, column) {
      return this.selectDictLabel(this.xbOptions, row.xb);
    },
    // 是否有教师资格证字典翻译
    sfyjszgzFormat(row, column) {
      return this.selectDictLabel(this.sfyjszgzOptions, row.sfyjszgz);
    },
    // 状态字典翻译
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
        id: null,
        lstx: null,
        xqmc: null,
        rybj: null,
        lsxm: null,
        xb: null,
        rzsj: null,
        rzgl: null,
        sfzh: null,
        dhhm: null,
        jtzz: null,
        xzz: null,
        jjlxr: null,
        jjlxrdh: null,
        byxx: null,
        byzy: null,
        grsfzsmz: null,
        byzsmj: null,
        xwzsmj: null,
        grzjzbdld: null,
        rydjzs: null,
        sfyjszgz: null,
        jszgz: null,
        qtzs: null,
        status: "0",
        remark: null,
        userId: null,
        uName: null,
        orgBh: null,
        orgName: null,
        dataOrder: null,
        addOrUpdateTime: null,
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
      this.title = "添加老师信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getTeacher(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改老师信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTeacher(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeacher(this.form).then(response => {
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
      this.$confirm(
        '是否确认删除老师信息编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delTeacher(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "basic/teacher/export",
        {
          ...this.queryParams
        },
        `basic_teacher.xlsx`
      );
    },
    // 头像处理
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //证件照处理
    handleRemove(file) {
      console.log(file);
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //是否有教师资格证
    selectChange(value) {
      if (value == "Y") {
        this.isCertificais = true;
      } else {
        this.isCertificais = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-col {
  float: none;
  display: inline-block;
}
.wrap-el-dialog {
  padding-right: 40px;
  box-sizing: border-box;
}
// .hide .el-upload--picture-card {
//   display: none;
// }
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.dialog-footer {
  float: right;
}
.app-container {
  padding-bottom: 50px;
  box-sizing: border-box;
}
</style>