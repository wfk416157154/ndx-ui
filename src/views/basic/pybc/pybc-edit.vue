<template>
  <div class="wrap-pybc">
    <table border="1" style="width : 100%" cellspacing="0">
      <tbody>
        <tr>
          <td class="td-left-box">班级</td>
          <td>
            <el-select
              v-model="queryParams.bjid"
              @change="getListStudentData"
              filterable
              placeholder="请选择班级"
              :disabled="queryParams.id != null"
            >
              <el-option
                v-for="item in bjclassList "
                :key="item.id"
                :label="item.rybjmc"
                :value="item.id"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">老师</td>
          <td style="text-align : center">{{queryParams.lsxm}}</td>
        </tr>
        <tr>
          <td class="td-left-box">培优主题</td>
          <td>
            <el-input v-model="queryParams.theme" placeholder="请输入内容"></el-input>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">内容</td>
          <td>
            <editor v-model="queryParams.content" :min-height="200" />
          </td>
        </tr>
        <tr>
          <td class="td-left-box">针对学生</td>
          <td>
            <el-checkbox-group v-model="zdxsArr" @change="chooseStudent">
              <el-checkbox
                v-for="(item,index) in getListStudent"
                :label="item.xsbh"
                :key="index"
              >{{item.xsxm}}</el-checkbox>
            </el-checkbox-group>
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
    <div style="margin-top :20px;text-align: center;">
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>

    <el-dialog title="培优" :visible.sync="dialogFormVisible" @close="closePybcDialog">
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
          <el-button type="danger" @click="xsDelete(form.id)">删 除</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="xsSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {
  listExcellentTraining,
  getExcellentTraining,
  delExcellentTraining,
  addExcellentTraining,
  updateExcellentTraining,
  listExcellentTrainingStudent,
  getExcellentTrainingStudent,
  addExcellentTrainingStudent,
  updateExcellentTrainingStudent,
  delExcellentTrainingStudent
} from "@/api/basic/excellentTraining";
import { getToken } from "@/utils/auth";
import { secretKey } from "@/utils/tools";
import { listBjclass } from "@/api/basic/bjclass";
import { listStudent } from "@/api/basic/student";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
export default {
  data() {
    return {
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
        imgUrl: process.env.VUE_APP_BASE_API + "/file/upload"
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
        bjid: null,
        lsid: this.$store.state.user.glrid,
        lsxm: this.$store.state.user.nickName,
        theme: null,
        ksrq: null,
        jzrq: null
      },
      form: {},
      bjclassList: [],
      getListStudent: [],
      getImages: [],
      // 针对学生
      zdxsGetImage: [],
      // 针对学生选择的数组
      zdxsArr: [],
      // 上次勾选的数组
      lastDataArr: [],
      // 针对学生-表单是否提交
      isZdxsSubmit: false
    };
  },
  created() {
    listBjclass().then(response => {
      this.bjclassList = response.rows;
      if (response.rows.length == 1) {
        this.queryParams.bjid = response.rows[0].id;
        this.getListStudentData();
      }
    });
    // 从父页面点击编辑按钮进入
    if (this.$route.query.pageType=="update") {
      getExcellentTraining(this.$route.query.id).then(res=>{
        this.queryParams = res.data
        if(this.queryParams.tpid){
          // 图片集合赋值
          this.getSelectFileList({ kzzd1: this.queryParams.tpid }, "getImages");
        }
        // 查询该班级下的学生
        this.getListStudentData();
      });
    }
  },
  methods: {
    // 当关闭弹窗触发的事件
    closePybcDialog() {
      // 当关闭弹窗时判断是否需要取消勾选
      if (!this.isZdxsSubmit) {
        this.zdxsArr.pop();
      }
    },
    // 给针对学生的集合进行勾选
    setChooseStudent(zdxsObjList) {
      this.zdxsArr = [];
      if (null != zdxsObjList) {
        let obj;
        for (let i = 0; i < zdxsObjList.length; i++) {
          obj = zdxsObjList[i];
          this.zdxsArr.push(obj.xsbh);
        }
        this.lastDataArr = this.zdxsArr;
      }
    },
    // 当勾选学生时触发
    chooseStudent(chooseArr) {
      let chooseXsbh = this.rtnChooseId(chooseArr);
      let stu = this.getStudentObject(chooseXsbh);
      if (chooseXsbh) {
        // 不为空时，当勾选后触发弹窗，取消勾选不触发
        this.addStudentInfo(stu);
      }
    },
    /* 根据学生编号获取该学生的对象信息 */
    getStudentObject(xsbh) {
      let obj = null;
      for (let i = 0; i < this.getListStudent.length; i++) {
        obj = this.getListStudent[i];
        if (xsbh === obj.xsbh) {
          break;
        }
      }
      return obj;
    },
    // 返回当前勾选的id
    rtnChooseId(chooseArr) {
      let id;
      let lastId;
      let chooseId = null;
      if (chooseArr.length > this.lastDataArr.length) {
        // 当勾选的数据大于上次勾选的数据选项，则可以认定该操作是勾选的操作；反之是取消勾选的操作
        if (chooseArr.length > 1) {
          // 当勾选一个时
          // 当前选择的数据选项
          for (let i = 0; i < chooseArr.length; i++) {
            id = chooseArr[i];
            // 上一次选择的数据选项
            for (let j = 0; j < this.lastDataArr.length; j++) {
              lastId = this.lastDataArr[j];
              if (id != lastId) {
                chooseId = id;
                break;
              }
            }
          }
        } else if (chooseArr.length == 1) {
          chooseId = chooseArr[0];
        }
      }
      this.lastDataArr = chooseArr;
      return chooseId;
    },
    // 如果传入的参数是null则转成空数组
    ifNullToArr(obj) {
      if (null == obj) {
        return [];
      } else {
        return obj;
      }
    },

    // 获取班级下的学生信息
    getListStudentData() {
      listStudent({ ryb: this.queryParams.bjid }).then(res => {
        this.getListStudent = res.rows;
        this.setChooseStudent(this.queryParams.zdxsObjList);
      });
    },
    // 查询图片
    getSelectFileList(id, templateName) {
      selectFileList(id).then(res => {
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
    // 图片上传成功回调
    zyrzSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.queryParams.tpid || secretKey();
      this.queryParams.tpid = data.kzzd1;
      addImg(data).then(res => {
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
    // 图片上传成功回调(学生)
    xsZyrzSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.tpid || secretKey();
      this.form.tpid = data.kzzd1;
      addImg(data).then(res => {
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
        updateExcellentTraining(this.queryParams).then(response => {
          this.msgSuccess("修改成功");
          this.$router.go(-1);
        });
      } else {
        addExcellentTraining(this.queryParams).then(response => {
          this.msgSuccess("新增成功");
          this.$router.go(-1);
        });
      }
    },
    // 勾选学生后触发的方法-针对学生数据
    addStudentInfo(item) {
      this.isZdxsSubmit = false; // 初始化为：未提交=false
      this.dialogFormVisible = true;
      if (!this.queryParams.zdxsid) {
        // 如果是添加，可能该针对学生id为空，则生成
        this.queryParams.zdxsid = secretKey();
      }
      this.form = {}; // 初始化
      this.form.xsbh = item.xsbh;
      this.form.xsxm = item.xsxm;
      this.zdxsGetImage = [];
      listExcellentTrainingStudent({
        glid: this.queryParams.zdxsid,
        xsbh: item.xsbh
      }).then(res => {
        if (res.code == 200 && res.rows.length > 0) {
          this.isZdxsSubmit = true; // 如果查询到有数据，则修改为 已提交=true
          this.form = res.rows[0];
          if (this.form.tpid) {
            this.getSelectFileList({ kzzd1: this.form.tpid }, "zdxsGetImage");
          }
        }
      });
    },
    // 针对学生提交
    xsSubmit() {
      // 设置为已提交=true
      this.isZdxsSubmit = true; // 当点击提交按钮，则修改为 已提交=true
      if (this.queryParams.zdxsid) {
        // 关联id赋值
        this.form.glid = this.queryParams.zdxsid;
      }
      if (this.form.id != null) {
        updateExcellentTrainingStudent(this.form).then(response => {
          this.msgSuccess("修改成功");
          this.dialogFormVisible = false;
        });
      } else {
        addExcellentTrainingStudent(this.form).then(response => {
          this.msgSuccess("新增成功");
          this.dialogFormVisible = false;
        });
      }
    },
    //针对学生 删除
    xsDelete(id) {
      delExcellentTrainingStudent(id).then(res => {
        if (res.code == 200) {
          this.isZdxsSubmit = true; // 如果删除数据，则修改为 已提交=true
          this.msgSuccess("成功 : 删除成功");
          this.dialogFormVisible = false;
        }
      });
    }
  }
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
