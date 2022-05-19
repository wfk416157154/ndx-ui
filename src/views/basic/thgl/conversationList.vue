<template>
  <div class="conversation">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="班级">
        <el-select
          v-model="queryParams.kzzd2"
          @change="getStudent"
          clearable
          filterable
          placeholder="班级"
        >
          <el-option
            v-for="item in queryBjclassList"
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-date-picker
          v-model="queryParams.thsjArr"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查 询</el-button>
        <el-button type="success" @click="conversation">添 加 谈 话</el-button>
      </el-form-item>
    </el-form>

    <el-table border :data="teacherTalkList">
      <el-table-column type="selection" width="55" v-if="false" align="center" />
      <el-table-column label="id" align="center" v-if="false" prop="id" />
      <el-table-column label="老师姓名" align="center" prop="lsxm" />
      <el-table-column label="学生姓名" align="center" prop="xsxm" />
      <el-table-column label="谈话时间" align="center" prop="thsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.thsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="谈话原因" align="center" prop="thyy" />
      <el-table-column label="谈话内容" align="center" prop="thnr" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" prop="remark">
        <template slot-scope="scope">
          <a href="#" v-if="null!=scope.row.kzzd1">
            <span
              style="margin-left: 10px;color: dodgerblue"
              @click="downloadTalkUploadFile(scope.row)"
            >下载谈话文件</span>
          </a>
          <a href="#" v-else>
            <span style="margin-left: 10px;color: red">未上传</span>
          </a>
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

    <el-dialog title="老师谈话" :visible.sync="openStu" width="500px" append-to-body>
      <el-form ref="stuform" :model="formStu" label-width="80px">
        <el-form-item label="老师姓名" prop="lsxm">
          <el-input v-model="formStu.lsxm" readonly placeholder="请输入老师姓名" />
        </el-form-item>
        <el-form-item label="学生姓名" prop="xsxm">
          <el-select v-model="formStu.xsid" filterable @change="getStudentName" placeholder="班级">
            <el-option
              v-for="item in studentList "
              :key="item.id"
              :label="item.xsxm"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="谈话时间" prop="thsj">
          <el-date-picker
            clearable
            size="small"
            v-model="formStu.thsj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择谈话时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="谈话原因" prop="thyy">
          <el-input v-model="formStu.thyy" placeholder="请输入谈话原因" />
        </el-form-item>
        <el-form-item label="谈话内容" prop="thnr">
          <el-input v-model="formStu.thnr" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formStu.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="文件上传" prop="kzzd1">
          <el-upload
            class="upload-demo"
            ref="uploadFile"
            drag
            :limit="1"
            :headers="uploadFile.headers"
            :action="uploadFile.fileUrl"
            :before-upload="beforeFileUpload"
            :on-progress="handleFileUploadProgress"
            :on-success="handleXsthFileSuccess"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">仅限上传一个文件，且文件大小不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-prevent-re-click
          :disabled="submitStuFormButton"
          @click="submitStuForm"
        >确 定</el-button>
        <el-button @click="cancelStu">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { listBjclass } from "@/api/basic/bjclass";
import { listTeacherTalk, addTeacherTalk } from "@/api/basic/teacherTalk";
import { addImg, addFile } from "@/api/tool/common";
import { getToken } from "@/utils/auth";
import { secretKey } from "@/utils/tools";
import { listStudent } from "@/api/basic/student";
import { clearCache } from "@/api/system/config";
export default {
  data() {
    return {
      queryBjclassList: [],
      teacherTalkList: [],
      studentList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      submitStuFormButton: false,
      openStu: false,
      formStu: {},
      uploadFile: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        fileUrl: process.env.VUE_APP_BASE_API + "/file/upload"
      }
    };
  },
  created() {
    listBjclass().then(response => {
      this.queryBjclassList = response.rows;
      this.queryParams.kzzd2 = this.queryBjclassList[0].id;
      this.getStudent();
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      listTeacherTalk(this.queryParams).then(response => {
        this.teacherTalkList = response.rows;
        this.total = response.total;
      });
    },
    getStudent() {
      listStudent({ ryb: this.queryParams.kzzd2 }).then(response => {
        this.studentList = response.rows;
      });
    },
    conversation() {
      this.resetStu()
      this.openStu = true;
      let loginUser = this.$store.state.user;
      this.formStu.lsid = loginUser.glrid;
      this.formStu.lsxm = loginUser.nickName;
      this.formStu.kzzd2 = this.queryParams.kzzd2;
    },
    getStudentName() {
      this.studentList.forEach(val => {
        if (val.id == this.formStu.xsid) {
          this.formStu.xsxm = val.xsxm;
        }
      });
    },
    // 表单重置
    resetStu() {
      this.formStu = {
        id: null,
        lsid: null,
        lsxm: null,
        xsid: null,
        xsxm: null,
        thsj: null,
        thyy: null,
        thnr: null,
        remark: null,
        userId: null,
        userName: null,
        createTime: null,
        updateTime: null,
        kzzd1: null,
        kzzd2: null,
        kzzd3: null,
        kzzd4: null,
        kzzd5: null
      };
      this.resetForm("formStu");
    },
    beforeFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.submitStuFormButton = true;
    },
    // 学生谈话文件上传成功处理
    handleXsthFileSuccess(response, file, fileList) {
      this.formStu.id = secretKey();
      let obj = response.data;
      obj.kzzd1 = this.formStu.id;
      addFile(obj).then(res => {
        this.$notify({
          title: "上传成功",
          message: response.msg,
          type: "success"
        });
        this.formStu.kzzd1 = obj.name;
        this.submitStuFormButton = false;
      });
    },
    /** 提交按钮 */
    submitStuForm() {
      this.$refs["stuform"].validate(valid => {
        if (valid) {
          addTeacherTalk(this.formStu).then(response => {
            this.msgSuccess("新增谈话内容成功");
            this.openStu = false;
            this.getList()
          });
        }
      });
    },
    // 取消按钮
    cancelStu() {
      this.openStu = false;
      this.resetStu();
    },
    // 下载谈话文件
    downloadTalkUploadFile(row) {
      this.download(
        "file/filetable/download",
        {
          wjmc: row.kzzd1,
          ssmk: "老师谈话"
        },
        row.kzzd1
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.conversation {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>