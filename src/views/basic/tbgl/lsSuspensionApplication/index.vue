<template>
  <div
    style="width : 100%;height : 100%;padding : 40px; box-sizing : border-box;text-align : center"
  >
    <h3>休学申请</h3>
    <div v-if="ifELE">
      <table style="width : 100%;" border="1" cellspacing="0">
        <thead>
          <tr>
            <th>班级</th>
            <th>{{getInfo.rybjmc}}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>学生</td>
            <td>{{getInfo.xsxm}}</td>
          </tr>
          <tr>
            <td>老师</td>
            <td>{{lsName}}</td>
          </tr>
          <tr>
            <td>入班时间</td>
            <td>{{getInfo.rbsj}}</td>
          </tr>
          <tr>
            <td>休学时间</td>
            <td>
              <el-date-picker
                v-model="xXform.sj"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </td>
          </tr>
          <tr>
            <td>休学原因</td>
            <td class="clearfix">
              <div>
                <el-input type="textarea" :rows="4" placeholder="请输入休学原因" v-model="xXform.xxyy"></el-input>
              </div>
            </td>
          </tr>
          <tr>
            <td>休学申请资料</td>
            <td>
              <div style="margin-top : 30px;float : left">
                <el-upload
                  :action="upload.imgUrl"
                  :headers="upload.headers"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :on-success="xxSuccess"
                  :before-upload="beforeFile"
                  :data="fileForm"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
              </div>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <el-input type="textarea" :rows="4" placeholder="请输入备注" v-model="xXform.remark"></el-input>
            </td>
          </tr>
          <tr>
            <td>操作</td>
            <td>
              <el-button type="primary" @click="addSuspension">提交申请</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <table style="width : 100%;" border="1" cellspacing="0">
        <thead>
          <tr>
            <th>班级</th>
            <th>{{getInfo.rybjmc}}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>学生</td>
            <td>{{getInfo.xsxm}}</td>
          </tr>
          <tr>
            <td>老师</td>
            <td>{{lsName}}</td>
          </tr>
          <tr>
            <td>入班时间</td>
            <td>{{getInfo.rbsj}}</td>
          </tr>
          <tr>
            <td>休学时间</td>
            <td>
              <el-date-picker
                v-model="getInfo.sj"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </td>
          </tr>
          <tr>
            <td>休学原因</td>
            <td class="clearfix">
              <div>
                <el-input type="textarea" :rows="4" placeholder="请输入休学原因" v-model="getInfo.xxyy"></el-input>
              </div>
            </td>
          </tr>
          <tr>
            <td>退班申请资料</td>
            <td>
              <div style="margin-top : 30px;float : left">
                <el-upload
                  :action="upload.imgUrl"
                  :headers="upload.headers"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreviewEdit"
                  :on-remove="handleRemoveEdit"
                  :on-success="xxSuccessEdit"
                  :file-list="files1"
                  :before-upload="beforeFile"
                  :data="fileForm"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
              </div>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <el-input type="textarea" :rows="4" placeholder="请输入备注" v-model="getInfo.remark"></el-input>
            </td>
          </tr>
          <tr>
            <td>操作</td>
            <td>
              <el-button type="primary" @click="editupdateXiuxue">提交修改申请</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { addXiuxue, updateXiuxue } from "@/api/basic/xiuxue.js";
import { secretKey } from "@/utils/tools";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
export default {
  data() {
    return {
      radio: "1",
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
        // 上传考试成绩地址
        fileUrl:
          process.env.VUE_APP_BASE_API +
          "/basic/examinationPaper/importClassGradeData",
        // 上传图片地址
        imgUrl: process.env.VUE_APP_BASE_API + "/file/renameUpload"
      },
      fileForm: {
           renameFileName: ""
      },
      dialogVisible: false,
      files1: null,
      dialogImageUrl: null,
      getInfo: null,
      lsid: null,
      lsName: null,
      xXform: {
        id: ""
      },
      ifELE: true
    };
  },
  created() {
    if (this.$route.query.query) {
      this.ifELE = true;
      this.getInfo = JSON.parse(this.$route.query.query);
    } else {
      this.ifELE = false;
      this.getInfo = JSON.parse(this.$route.query.row);
      this.getImg();
    }
    this.lsid = this.$store.state.user.glrid;
    this.lsName = this.$store.state.user.nickName;
  },
  methods: {
    //  文件上传修改名称
       beforeFile(file) {
            this.fileForm.renameFileName ='休学管理-'+file.name
        },
    // 获取图片
    getImg() {
      selectFileList({ kzzd1: this.getInfo.id }).then(res => {
        this["files1"] = res.rows;
      });
    },
    // 休学图片预览
    handlePictureCardPreviewEdit(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //休学图片删除
    handleRemoveEdit(file) {
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
    // 休学成功回调
    xxSuccessEdit(response, file) {
      if (response.code == 500) {
        this.msgError("错误 : 上传失败");
        return;
      }
      let data = response.data;
      data.kzzd1 = this.getInfo.id || secretKey();
      this.getInfo.id = data.kzzd1;
      addImg(data).then(res => {
        file.id = res.data.id;
      });
    },
    editupdateXiuxue() {
      this.getImg();
      if (!this.getInfo.sj) {
        this.msgError("错误 : 请选择休学时间");
        return;
      }
      if (!this.getInfo.xxyy) {
        this.msgError("错误 : 请填写休学原因");
        return;
      }
      if (this.files1.length == 0) {
        this.msgError("错误 : 请上传休学申请资料");
        return;
      }
      this.getInfo.shzt = 1;
      updateXiuxue(this.getInfo).then(res => {
        if (res.code == 200) {
          this.msgSuccess("成功 : 修改成功");
          this.$router.push({
            path: "/tbgl/lsSuspensionList"
          });
        }
      });
    },
    // 休学图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //休学图片删除
    handleRemove(file) {
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
    // 休学成功回调
    xxSuccess(response, file) {
      if (response.code == 500) {
        this.msgError("错误 : 上传失败");
        return;
      }
      let data = response.data;
      data.kzzd1 = this.xXform.id || secretKey();
      this.xXform.id = data.kzzd1;
      addImg(data).then(res => {
        file.id = res.data.id;
      });
    },
    addSuspension() {
      if (!this.xXform.sj) {
        this.msgError("错误 : 请选择休学时间");
        return;
      }
      if (!this.xXform.xxyy) {
        this.msgError("错误 : 请填写休学原因");
        return;
      }
      if (!this.xXform.id) {
        this.msgError("错误 : 请上传休学申请资料");
        return;
      }
      let jsonList = {
        id: this.xXform.id || secretKey(),
        lsid: this.lsid,
        remark: this.xXform.remark,
        rybjid: this.getInfo.ryb,
        xsbh: this.getInfo.xsbh,
        sj: this.xXform.sj,
        xxyy: this.xXform.xxyy
      };
      addXiuxue(jsonList).then(res => {
        if(res.code=200){
          // 获取页面中参数配置的路由
          this.getConfigKey("xxlb").then(resp => {
            this.router = resp.msg;
            this.$router.push({
              path: this.router
            });
          });
          this.msgSuccess("提交成功");
        }else{
          this.msgError("提交失败！请联系管理员")
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
th,
td {
  padding: 20px;
  box-sizing: border-box;
}
</style>
