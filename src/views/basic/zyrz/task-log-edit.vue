<template>
  <div class="wrap-pybc">
    <table border="1" style="width: 100%" cellspacing="0">
      <tbody>
        <tr>
          <td class="td-left-box">班级</td>
          <td>
            <el-select
              v-model="queryParams.bjid"
              @change="getListStudentData"
              filterable
              placeholder="请选择班级"
            >
              <el-option
                v-for="item in bjclassList"
                :key="item.id"
                :label="item.rybjmc"
                :value="item.id"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">老师</td>
          <td style="text-align: center">
            {{ this.$store.state.user.nickName }}
          </td>
        </tr>
        <tr>
          <td class="td-left-box">作业类型</td>
          <td>
            <el-select
              v-model="queryParams.zylx"
              placeholder="请选择作业类型"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in zylxOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">作业主题</td>
          <td>
            <el-input
              v-model="queryParams.zyzt"
              placeholder="请输入内容"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">内容</td>
          <td>
            <editor v-model="queryParams.zynr" :min-height="200" />
          </td>
        </tr>
        <tr>
          <td class="td-left-box">针对学生</td>
          <td>
            <template v-if="queryParams.id">
              <el-checkbox
                :ref="'c' + index"
                @change="addStudentInfo(item, index)"
                v-for="(item, index) in getListStudent"
                :key="index"
                :label="item.xsbh"
                :checked="queryParams.xsList.includes(item.xsbh)"
              >
                <span v-if="!queryParams.id">{{ item.xsxm }}</span>
                <el-link v-else type="success" @click="getStudentLog(item)">{{
                  item.xsxm
                }}</el-link>
              </el-checkbox>
            </template>
            <template v-else>
              <el-checkbox
                v-model="cForm[index]"
                @change="addStudentInfo(item, index)"
                v-for="(item, index) in getListStudent"
                :key="index"
                :label="item.xsbh"
              >
                <span v-if="!queryParams.id">{{ item.xsxm }}</span>
                <el-link v-else type="success" @click="getStudentLog(item)">{{
                  item.xsxm
                }}</el-link>
              </el-checkbox>
            </template>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">文件</td>
          <td>
            <p>图片上传</p>
            <el-upload
              :action="upload.imgUrl"
              :headers="upload.headers"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="zyrzSuccess"
              :file-list="getImages"
              :before-upload="beforeFile"
              :data="fileForm"
              :multiple="true"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">备注</td>
          <td>
            <editor v-model="queryParams.remark" :min-height="200" />
          </td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top: 20px; text-align: center">
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>

    <el-dialog
      title="作业日志"
      :visible.sync="dialogFormVisible"
      :before-close="cancel"
    >
      <el-form>
        <el-form-item label="图片上传" label-width="120px">
          <el-upload
            :action="upload.imgUrl"
            :headers="upload.headers"
            list-type="picture-card"
            :on-preview="xsHandlePictureCardPreview"
            :on-remove="xsHandleRemove"
            :on-success="xsZyrzSuccess"
            :file-list="zdxsGetImage"
            :before-upload="beforeFile"
            :data="fileForm"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleForm">
            <img width="100%" :src="dialogImageFormUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="内容" label-width="120px">
          <editor v-model="form.remark" :min-height="200" />
        </el-form-item>
        <el-form-item label="操作" label-width="120px" v-if="form.id">
          <el-button type="danger" @click="xsDeleteSubmit(form)"
            >删 除</el-button
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="xsSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {
  listHomework,
  getHomework,
  delHomework,
  addHomework,
  updateHomework,
  addHomeworkLogStudent,
  updateHomeworkLogStudent,
  getHomeworkLogStudent,
  listHomeworkLogStudent,
  delHomeworkLogStudent,
} from "@/api/basic/homework";
import { getToken } from "@/utils/auth";
import { secretKey } from "@/utils/tools";
import { listBjclass } from "@/api/basic/bjclass";
import { listStudent } from "@/api/basic/student";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
export default {
  data() {
    return {
      fileForm: {
        renameFileName: "",
      },
      cForm: {},
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
        // 上传图片地址
        imgUrl: process.env.VUE_APP_BASE_API + "/file/renameUpload",
      },
      dialogVisible: false,
      dialogImageUrl: "",
      dialogVisibleForm: false,
      dialogFormVisible: false,
      dialogImageFormUrl: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        zdxsid: null,
        xsList: [],
        bjid: null,
        lsid: this.$store.state.user.glrid,
        lsxm: this.$store.state.user.nickName,
        zylx: null,
        zyzt: null,
        zynr: null,
        ksrq: null,
        jzrq: null,
      },
      form: {},
      bjclassList: [],
      getListStudent: [],
      zylxOptions: [],
      getImages: [],
      // 正对学生
      zdxsGetImage: [],
      cancelIndex: null,
    };
  },
  created() {
    this.getDicts("homework_type").then((response) => {
      this.zylxOptions = response.data;
    });
    if (JSON.parse(this.$route.query.list).id) {
      this.queryParams = JSON.parse(this.$route.query.list);
      if (this.queryParams && this.queryParams.id) {
        this.queryParams.xsList = [];
        if (this.queryParams.homeworkLogStudentList) {
          // 当该学生-作业日志对象集合不为空
          this.queryParams.homeworkLogStudentList.forEach((value) => {
            this.queryParams.xsList.push(value.xsbh);
          });
        }
        if (this.queryParams.tpid) {
          // 如果没上传过图片，则不去查询图片列表
          this.getSelectFileList({ kzzd1: this.queryParams.tpid }, "getImages");
        }
        this.getListStudentData();
      }
    }
    listBjclass().then((response) => {
      this.bjclassList = response.rows;
      // 当id为空,且只有一个班级时
      if (!this.queryParams.id && response.total == 1) {
        this.queryParams.bjid = response.rows[0].id;
        this.getListStudentData();
      }
    });
  },
  methods: {
    beforeFile(file) {
      this.fileForm.renameFileName = "作业日志—" +file.name
    },
    // 获取班级
    getListStudentData() {
      listStudent({ ryb: this.queryParams.bjid }).then((res) => {
        this.getListStudent = res.rows;
      });
    },
    // 查询图片
    getSelectFileList(id, templateName) {
      selectFileList(id).then((res) => {
        if (res.code == 200) {
          this[templateName] = res.rows;
        }
      });
    },
    // 图片预览 大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片删除
    handleRemove(file, fileList) {
      deleteImg(file.id).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    // 学生表现图片上传成功回调
    zyrzSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.queryParams.tpid || secretKey();
      this.queryParams.tpid = data.kzzd1;
      addImg(data).then((res) => {
        if (res.code == 200) {
          this.msgSuccess("成功 : 上传成功");
        } else {
          this.msgError("错误 : 上传失败");
        }
      });
    },
    // 图片预览 大图(学生)
    xsHandlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片删除(学生)
    xsHandleRemove(file, fileList) {
      deleteImg(file.id).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    // 学生表现图片上传成功回调(学生)
    xsZyrzSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.tpid || secretKey();
      this.form.tpid = data.kzzd1;
      addImg(data).then((res) => {
        if (res.code == 200) {
          this.msgSuccess("成功 : 上传成功");
        } else {
          this.msgError("错误 : 上传失败");
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      if (this.queryParams.id != null) {
        updateHomework(this.queryParams).then((response) => {
          this.msgSuccess("修改成功");
          this.$router.go(-1);
        });
      } else {
        addHomework(this.queryParams).then((response) => {
          this.msgSuccess("新增成功");
          this.$router.go(-1);
        });
      }
    },
    // 针对学生
    addStudentInfo(item, index) {
      if (this.queryParams.id) {
        this.dialogFormVisible = true;
      } else {
        if (this.cForm[index]) {
          this.dialogFormVisible = true;
        }
      }
      this.cancelIndex = index;
      this.zdxsGetImage = [];
      this.form = {};
      this.form.xsbh = item.xsbh;
      this.form.xsxm = item.xsxm;
      if (!this.queryParams.zdxsid) {
        this.queryParams.zdxsid = secretKey();
      }
      this.form.zdxsglid = this.queryParams.zdxsid;
      if (typeof index == "number") {
        listHomeworkLogStudent(this.form).then((res) => {
          if (res.rows.length > 0) {
            this.form = res.rows[0];
            if (this.form.tpid) {
              // 如果没上传过图片，则不去查询图片列表
              this.getSelectFileList({ kzzd1: this.form.tpid }, "zdxsGetImage");
            }
          }
        });
      }
    },
    // 获取针对学生数据
    getStudentLog(item) {
      let { zdxsid } = this.queryParams;
      let { xsbh } = item;
      this.form = {};
      this.zdxsGetImage = [];
      listHomeworkLogStudent({ zdxsglid: zdxsid, xsbh }).then((res) => {
        if (res.code == 200 && res.rows.length > 0) {
          this.form = res.rows[0];
          if (this.form.tpid) {
            // 如果没上传过图片，则不去查询图片列表
            this.getSelectFileList({ kzzd1: this.form.tpid }, "zdxsGetImage");
          }
        }
      });
    },
    // 取消
    cancel() {
      this.dialogFormVisible = false;
      if (this.queryParams.id) {
        this.getListStudent = [];
        this.getListStudentData();
      }
      if (!this.form.id) {
        this.cForm[this.cancelIndex] = false;
      }
    },
    // 针对学生提交
    xsSubmit() {
      if (this.queryParams.zdxsid) {
        this.form.zdxsglid = this.queryParams.zdxsid;
      }
      if (this.form.id != null) {
        updateHomeworkLogStudent(this.form).then((response) => {
          this.msgSuccess("修改成功");
          this.dialogFormVisible = false;
        });
      } else {
        addHomeworkLogStudent(this.form).then((response) => {
          this.msgSuccess("新增成功");
          this.dialogFormVisible = false;
        });
      }
    },
    //针对学生 删除
    xsDeleteSubmit(item) {
      delHomeworkLogStudent(item.id).then((res) => {
        if (res.code == 200) {
          this.msgSuccess("成功 : 删除成功");
          this.dialogFormVisible = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap-pybc {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  th,
  td {
    padding: 20px;
  }
  .td-left-box {
    width: 20%;
    text-align: center;
  }
}
</style>
