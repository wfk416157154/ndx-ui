<template>
  <div class="app-container">
    <el-form class="wrap-el-dialog" ref="form" :model="form" :rules="rules" label-width="80px">
      <!-- <el-col :span="12"> -->
      <el-form-item label-width="180px" label="老师头像" prop="lstx">
        <el-upload
          class="avatar-uploader"
          :action="upload.fileUrl"
          :headers="upload.headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-input v-if="false" maxlength="4" v-model="form.lstx" />
      </el-form-item>
      <!-- </el-col> -->
      <!-- <el-col :span="12">
        <el-form-item label-width="180px" label="校区名称" prop="xqmc">
          <el-select v-model="form.xqmc" placeholder="请选择校区名称">
            <el-option
              v-for="item in selectXqmc"
              :key="item.id"
              :label="item.xxmc"
              :value="item.xxmc"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label-width="180px" label="日语班级" prop="rybj">
          <el-select v-model="form.rybj" placeholder="请选择日语班级">
            <el-option
              v-for="item in bjclassList "
              :key="item.id"
              :label="item.rybjmc"
              :value="item.rybjmc"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>-->
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
        <el-upload
          :action="upload.fileUrl"
          :headers="upload.headers"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="grsfzsmzSuccess"
          :limit="maxPhotoNum"
          :file-list="files1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- </el-col> -->
      <!-- <el-col :span="12"> -->
      <el-form-item label-width="180px" label="毕业证扫描件" prop="byzsmj">
        <el-upload
          :action="upload.fileUrl"
          :headers="upload.headers"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :limit="maxPhotoNum"
          :file-list="files2"
          :on-success="byzsmjSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- </el-col> -->
      <!-- <el-col :span="12"> -->
      <el-form-item label-width="180px" label="学位证扫描件" prop="xwzsmj">
        <el-upload
          :action="upload.fileUrl"
          :headers="upload.headers"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :limit="maxPhotoNum"
          :on-success="xwzsmjSuccess"
          :file-list="files3"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- </el-col> -->
      <!-- <el-col :span="12"> -->
      <el-form-item label-width="180px" label="个人证件照白底蓝底" prop="grzjzbdld">
        <el-upload
          :action="upload.fileUrl"
          :headers="upload.headers"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :limit="maxPhotoNum"
          :on-success="grzjzbdldSuccess"
          :file-list="files4"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- </el-col> -->
      <!-- <el-col :span="12"> -->
      <el-form-item label-width="180px" label="日语登记证书" prop="rydjzs">
        <el-upload
          :action="upload.fileUrl"
          :headers="upload.headers"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :limit="maxPhotoNum"
          :on-success="rydjzsSuccess"
          :file-list="files5"
        >
          <i class="el-icon-plus"></i>
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
        <el-upload
          :action="upload.fileUrl"
          :headers="upload.headers"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :limit="maxPhotoNum"
          :on-success="jszgzSuccess"
          :file-list="files6"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- </el-col> -->
      <!-- <el-col :span="12"> -->
      <el-form-item label-width="180px" label="其他证书" prop="qtzs">
        <el-upload
          :action="upload.fileUrl"
          :headers="upload.headers"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :limit="10"
          :on-success="qtzsSuccess"
          :file-list="files7"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <!-- </el-col> -->
      <el-col :span="12">
        <el-form-item label-width="180px" label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              disabled
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-form-item label-width="180px" label="备注" prop="remark">
        <el-input maxlength="300" type="textarea" v-model="form.remark" placeholder="请输入备注" />
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
import { addImg, selectFileList, deleteImg } from "@/api/tool/common";
import { listBjclass } from "@/api/basic/bjclass";
import { listSchool } from "@/api/basic/school";
import { getToken } from "@/utils/auth";
import { secretKey } from "@/utils/tools";
import { getInfoByKzzd2 } from "@/api/basic/firstTry";
export default {
  name: "Teacher",
  components: {},
  inject: ["reload"],
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
      japaneseClass: [],
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/basic/bjclass/importData",
        // 上传图片地址
        fileUrl: process.env.VUE_APP_BASE_API + "/file/upload"
      },
      //老师id
      id: "",
      //图片列表
      files1: [],
      files2: [],
      files3: [],
      files4: [],
      files5: [],
      files6: [],
      files7: [],
      // 限制图片上传数量
      maxPhotoNum: 3,
      // 图片上传计数
      photoNum1: 0,
      photoNum2: 0,
      photoNum3: 0,
      photoNum4: 0,
      photoNum4: 0,
      photoNum6: 0,
      photoNum7: 0,
      // 图片的关联id
      allGlid: "",
      rules: {
        jjlxrdh: [
          {
            required: false,
            message: "格式不对,只能填写数字",
            trigger: "blur",
            pattern: /^[0-9]+$/
          }
        ],
        dhhm: [
          {
            required: false,
            message: "格式不对,只能填写数字",
            trigger: "blur",
            pattern: /^[0-9]+$/
          }
        ],
        sfzh: [
          {
            required: false,
            message: "格式不对",
            trigger: "blur",
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
          }
        ]
      },
      // 校区字典
      selectXqmc: [],
      // 日语班级
      bjclassList: []
    };
  },
  created() {
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
  mounted() {
    this.id = this.$route.params.id;
    if (this.id != "addTeacher") {
      this.handleUpdate(this.id);
    } else {
      this.reset();
    }
    listSchool(this.queryParams).then(response => {
      this.selectXqmc = response.rows;
    });
    listBjclass(this.queryParams).then(response => {
      this.bjclassList = response.rows;
    });
  },
  methods: {
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
      this.$router.go(-1);
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
        status: "1",
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
    // /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 修改按钮操作 */
    handleUpdate(id) {
      this.reset();
      getInfoByKzzd2(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改老师信息";
        this.imageUrl = this.form.lstx;
        this.selectChange(this.form.sfyjszgz);
        this.selectPhotoList(
          (this.form.grsfzsmz = this.form.grsfzsmz || secretKey()),
          "files1"
        ); // 个人身份证正反扫描照
        this.selectPhotoList(
          (this.form.byzsmj = this.form.byzsmj || secretKey()),
          "files2"
        ); // 毕业证扫描件
        this.selectPhotoList(
          (this.form.xwzsmj = this.form.xwzsmj || secretKey()),
          "files3"
        ); // 学位证扫描件
        this.selectPhotoList(
          (this.form.grzjzbdld = this.form.grzjzbdld || secretKey()),
          "files4"
        ); // 个人证件照白底蓝底
        this.selectPhotoList(
          (this.form.rydjzs = this.form.rydjzs || secretKey()),
          "files5"
        ); // 日语登记证书
        this.selectPhotoList(
          (this.form.jszgz = this.form.jszgz || secretKey()),
          "files6"
        ); // 教师资格证
        this.selectPhotoList(
          (this.form.qtzs = this.form.qtzs || secretKey()),
          "files7"
        ); // 其他证书
      });
    },
    // 查询证件照
    selectPhotoList(glid, file) {
      let kzzdJson = {
        kzzd1: glid
      };
      selectFileList(kzzdJson).then(res => {
        this.photoNum = res.total;
        this[file] = res.rows;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateTeacher(this.form).then(response => {
            if (response.code == 200) {
              this.msgSuccess("编辑成功");
              this.open = false;
              // 获取页面中参数配置的路由
              this.getConfigKey("certificates").then(resp => {
                this.router = resp.msg;
                this.$router.push({
                  path: this.router
                });
              });
              this.reload();
            }
          });
        }
      });
    },
    // 头像处理
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.form.lstx = res.data.wjlj;
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    grsfzsmzSuccess(response, file, fileList) {
      //console.log("grsfzsmzSuccess:", this.form.grsfzsmz);
      let data = response.data;
      data.kzzd1 = this.form.grsfzsmz || secretKey();
      this.form.grsfzsmz = data.kzzd1;
      this.photoNum1 = fileList.length;
      addImg(data).then(res => {
        file.id = res.data.id;
        this.ifPhotoLimit(this.photoNum1);
      });
    },
    byzsmjSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.byzsmj || secretKey();
      this.form.byzsmj = data.kzzd1;
      this.photoNum2 = fileList.length;
      addImg(data).then(res => {
        this.photoNum2++;
        file.id = res.data.id;
        this.ifPhotoLimit(this.photoNum2);
      });
    },
    xwzsmjSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.xwzsmj || secretKey();
      this.form.xwzsmj = data.kzzd1;
      this.photoNum3 = fileList.length;
      addImg(data).then(res => {
        file.id = res.data.id;
        this.ifPhotoLimit(this.photoNum3);
      });
    },
    grzjzbdldSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.grzjzbdld || secretKey();
      this.form.grzjzbdld = data.kzzd1;
      this.photoNum4 = fileList.length;
      addImg(data).then(res => {
        file.id = res.data.id;
        this.ifPhotoLimit(this.photoNum4);
      });
    },
    rydjzsSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.rydjzs || secretKey();
      this.form.rydjzs = data.kzzd1;
      this.photoNum5 = fileList.length;
      addImg(data).then(res => {
        file.id = res.data.id;
        this.ifPhotoLimit(this.photoNum5);
      });
    },
    jszgzSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.jszgz || secretKey();
      this.form.jszgz = data.kzzd1;
      this.photoNum6 = fileList.length;
      addImg(data).then(res => {
        file.id = res.data.id;
        this.ifPhotoLimit(this.photoNum6);
      });
    },
    qtzsSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.qtzs || secretKey();
      this.form.qtzs = data.kzzd1;
      this.photoNum7 = fileList.length;
      addImg(data).then(res => {
        file.id = res.data.id;
        this.ifPhotoLimit(this.photoNum7);
      });
    },
    // 图片限制判断
    ifPhotoLimit(num) {
      if (num >= this.maxPhotoNum) {
        this.$message({
          message: "最多上传 3 张图片",
          type: "warning"
        });
      } else {
        this.$message({
          message: "新增成功",
          type: "success"
        });
      }
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
