<template>
  <div class="teacher-training-completed-edit">
    <table style="width : 100%;" border="1" cellspacing="0">
      <tbody>
        <tr>
          <td class="tds">老师姓名</td>
          <td>{{parentTiem.lsxm}}</td>
        </tr>
        <tr>
          <td class="tds">高考试卷分数</td>
          <td>
            <el-input-number v-model="parentTiem.gksjfs" placeholder="请输入内容" :max="150" :min="0" ></el-input-number>
          </td>
        </tr>
        <tr>
          <td class="tds">培训过程</td>
          <td>
            <div>
              <h4>视频上传</h4>
              <div>
                <el-upload
                  ref="uploadvideo"
                  :headers="upload.headers"
                  :action="upload.imgUrl"
                  :on-progress="vHandleFileUploadProgress"
                  :on-success="vHandleFileSuccess"
                  :on-error="vHandleFileError"
                  :on-remove="handleRemove"
                  :auto-upload="true"
                  :file-list="spList"
                  drag
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                  </div>
                </el-upload>
              </div>
            </div>
            <div>
              <h4>图片上传</h4>
              <div>
                <el-upload
                  :action="upload.imgUrl"
                  :headers="upload.headers"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :on-success="bxgcBjSuccess"
                  :file-list="tpList"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="tds">备注</td>
          <td>
            <editor v-model="parentTiem.remark" :min-height="300" />
          </td>
        </tr>
        <tr>
          <td class="tds">操作</td>
          <td>
            <div style="text-align : center">
              <el-button @click="saveSubmit" type="primary" >保存</el-button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
import { addOrUpdate } from "@/api/basic/teacher-training-completed";
export default {
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        user: "",
        region: ""
      },
      form: {},
      total: 0,
      // 文件图片上传
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传图片地址
        imgUrl: process.env.VUE_APP_BASE_API + "/file/upload"
      },
      dialogVisible: false,
      dialogImageUrl: null,
      parentTiem:{
        lsid:null,
        lsxm:null,
        gksjfs:null,
        tpid:null,
        spid:null,
        remark:null
      },
      tpList:[],
      spList:[],
    };
  },
  created() {
    if (this.$route.query.list) {
      let parentObj = JSON.parse(this.$route.query.list);
      this.parentTiem.lsid=parentObj.lsid
      this.parentTiem.lsxm=parentObj.lsxm
      this.parentTiem.gksjfs=parentObj.gksjfs
      this.parentTiem.tpid=parentObj.tpid
      this.parentTiem.spid=parentObj.spid
      this.parentTiem.remark=parentObj.remark
      this.getSelectFileList(parentObj.tpid,"tpList")
      this.getSelectFileList(parentObj.spid,"spList")
    }
  },
  methods: {

    // 文件上传中处理
    vHandleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 上传失败
    vHandleFileError(err, file, fileList) {},
    // 文件上传成功处理
    vHandleFileSuccess(response, file, fileList) {
      if (response.code == 200) {
        let data = response.data;
        data.kzzd1 = this.parentTiem.spid || secretKey();
        this.parentTiem.spid = data.kzzd1;
        addImg(data).then(res => {
          file.id = res.data.id;
        });
        this.msgSuccess("上传成功");
      } else {
        this.msgError("上传失败");
      }
    },
    // 图片预览 大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片删除
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
    bxgcBjSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.parentTiem.tpid || secretKey();
      this.parentTiem.tpid = data.kzzd1;
      addImg(data).then(res => {
        file.id = res.data.id;
      });
    },
    saveSubmit() {
      addOrUpdate(this.parentTiem).then(res => {
        this.$router.go(-1);
      });
    },
    // 给对应的图片和视频进行赋值
    getSelectFileList(id,tempName){
      if(id){// 当id不为空
        selectFileList({kzzd1 : id}).then(res=>{
          this[tempName]=res.rows
        })
      }
     },

  }
};
</script>

<style lang="scss" scoped>
.teacher-training-completed-edit {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  th,
  td {
    padding: 40px;
  }
  .tds {
    width: 20%;
  }
}
</style>
