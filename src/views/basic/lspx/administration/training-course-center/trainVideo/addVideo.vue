<template>
  <div class="add-video">
    <div>
      <h3>添加视频</h3>
    </div>
    <div>
      <table style="width : 100%;" border="1" cellspacing="0">
        <tbody>
          <tr>
            <td class="tds">视频名称</td>
            <td>
              <el-input v-model="addVideoForm.videoName" placeholder="请输入内容"></el-input>
            </td>
          </tr>
          <tr>
            <td class="tds">视频类别</td>
            <td>
              <el-select v-model="addVideoForm.videoType" placeholder="请选择">
                <el-option
                  v-for="dict in videoTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td class="tds">视频上传</td>
            <td>
              <div>
                <el-upload
                  ref="uploadvideo"
                  :headers="upload.headers"
                  :action="upload.url"
                  :on-progress="vHandleFileUploadProgress"
                  :on-success="vHandleFileSuccess"
                  :on-error="vHandleFileError"
                  :auto-upload="false"
                  drag
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                  </div>
                </el-upload>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="vsubmitFileForm">确 定</el-button>
                <el-button @click="dialogUploadVideoisible = false">取 消</el-button>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tds">
              视频介绍
              (选填）
            </td>
            <td>
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="addVideoForm.videoIntroduction"
              ></el-input>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-template">
      <el-table :data="listVideoQuestionData" border style="width: 100%">
        <el-table-column label="题目">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.topic }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项A">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.optionA }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项B">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.optionB }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项C">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.optionC }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项D">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.optionD }}</span>
          </template>
        </el-table-column>
        <el-table-column label="正确答案">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.answer }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="margin : 20px 0px;padding-bottom : 60px">
      <el-row>
        <el-button type="primary" @click="saveVideo">保存</el-button>
        <el-button type="success" :disabled="!this.addVideoForm.id" @click="addTestQuestions">添加测试题</el-button>
      </el-row>
    </div>

    <el-dialog title="添加题目" :visible.sync="dialogFormVisible">
      <el-form :model="addSubjectForm">
        <el-form-item label="题目" :label-width="formLabelWidth">
          <el-input v-model="addSubjectForm.topic" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选项A" :label-width="formLabelWidth">
          <el-input v-model="addSubjectForm.optionA" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选项B" :label-width="formLabelWidth">
          <el-input v-model="addSubjectForm.optionB" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选项C" :label-width="formLabelWidth">
          <el-input v-model="addSubjectForm.optionC" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选项D" :label-width="formLabelWidth">
          <el-input v-model="addSubjectForm.optionD" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="正确答案" :label-width="formLabelWidth">
          <el-input v-model="addSubjectForm.answer" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addSubjectSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTrainVideo,
  getTrainVideo,
  delTrainVideo,
  addTrainVideo,
  updateTrainVideo
} from "@/api/basic/trainVideo";
import {
  updateVideoQuestion,
  listVideoQuestion,
  deleteVideoQuestion,
  getVideoQuestion,
  addVideoQuestion
} from "@/api/basic/test-questions";
import { getToken } from "@/utils/auth";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
export default {
  data() {
    return {
      addVideoForm: {
        videoFile: ""
      },
      addSubjectForm: {},
      // 视频类别字典
      videoTypeOptions: [],
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
        url: process.env.VUE_APP_BASE_API + "/file/upload"
      },
      listVideoQuestionData: [],
      dialogFormVisible: false,
      formLabelWidth: "120px"
    };
  },
  created() {
    this.getDicts("videoType").then(response => {
      this.videoTypeOptions = response.data;
    });
    if (this.$route.query.name == "app-container") {
      this.addVideoForm = this.$route.query.list;
      this.getList();
    }
  },
  methods: {
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    cancel() {
      this.dialogFormVisible = false;
    },
    // 视频上传中处理
    vHandleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 视频上传失败
    vHandleFileError(err, file, fileList) {
      this.msgError("上传失败");
    },
    // 视频上传成功处理
    vHandleFileSuccess(response, file, fileList) {
      if (response.code == 200) {
        let data = response.data;
        data.kzzd1 = this.addVideoForm.videoFile || secretKey();
        this.addVideoForm.videoFile = data.kzzd1;
        addImg(data).then(res => {
          file.id = res.data.id;
          this.msgSuccess("上传成功");
        });
      } else {
        this.msgError("上传失败");
      }
    },
    // 提交上传文件
    vsubmitFileForm() {
      this.$refs.uploadvideo.submit();
    },
    // 保存视频
    saveVideo() {
      if (this.addVideoForm.id != null) {
        updateTrainVideo(this.addVideoForm).then(response => {
          if (200 == response.code) {
            this.getList();
            this.msgSuccess(response.msg);
          } else {
            this.msgError(response.msg);
          }
        });
      } else {
        this.addVideoForm.id = secretKey();
        addTrainVideo(this.addVideoForm).then(response => {
          if (200 == response.code) {
            this.msgSuccess(response.msg);
          } else {
            this.msgError(response.msg);
          }
        });
      }
    },
    // 添加测试题
    addTestQuestions() {
      this.dialogFormVisible = true;
    },
    // 修改测试题
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.addSubjectForm = row;
    },
    // 查询测试题
    getList() {
      if (!this.addVideoForm.id) {
        return;
      }
      listVideoQuestion({ trainVideoId: this.addVideoForm.id }).then(res => {
        this.listVideoQuestionData = res.rows;
      });
    },
    // 保存测试题
    addSubjectSubmit() {
      if (this.addVideoForm.id) {
        this.addSubjectForm.trainVideoId = this.addVideoForm.id;
      } else {
        return;
      }
      if (this.addSubjectForm.id != null) {
        updateVideoQuestion(this.addSubjectForm).then(res => {
          if (200 == res.code) {
            this.getList();
            this.msgSuccess(res.msg);
            this.dialogFormVisible = false;
          } else {
            this.msgError(res.msg);
          }
        });
      } else {
        addVideoQuestion(this.addSubjectForm).then(res => {
          if (200 == res.code) {
            this.msgSuccess(res.msg);
            this.dialogFormVisible = false;

            this.getList();
          } else {
            this.msgError(res.msg);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.add-video {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  th,
  td {
    padding: 40px;
  }
  .tds {
    width: 13%;
  }
  .table-template {
    margin-top: 40px;
  }
}
</style>
