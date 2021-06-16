<template>
  <div class="work-log">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="clearfix" style="margin-bottom : 10px">
        <el-button style="float: right" type="primary" icon="el-icon-search" size="medium">查看工作日志</el-button>
      </div>
      <!-- 课程 -->
      <div class="wrap-log">
        <div class="curriculum-title">
          <span>课程 :</span>
        </div>
        <div class="log-content">
          <el-input
            resize="none"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 5}"
            placeholder="请输入内容"
            v-model="ruleForm.kc"
          ></el-input>
        </div>
      </div>
      <!-- 备课 -->
      <div class="wrap-preparation clearfix">
        <div class="preparation-title">
          <span>备课 :</span>
        </div>
        <div class="preparation-list">
          <div class="wrap-history">
            <div class="history-log-content">
              <el-form-item label="系统生成的日志" label-width="120px">
                <el-input
                  resize="none"
                  disabled
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5}"
                  v-model="ruleForm.lsrz"
                ></el-input>
              </el-form-item>
            </div>
            <div class="history-log-content">
              <el-form-item label="补充日志" label-width="120px">
                <el-input
                  resize="none"
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5}"
                  v-model="ruleForm.bcrz"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
      <!-- 课中 -->
      <div class="in-class clearfix">
        <div class="in-class-title clearfix">
          <span>课中 :</span>
        </div>
        <div class="in-class-list">
          <div class="in-class-content">
            <ul>
              <li v-for="(item,index) in 10" :key="index">
                <el-form-item label="早自习">
                  <el-input v-model="ruleForm.kbrz"></el-input>
                </el-form-item>
              </li>
            </ul>
            <el-form-item label="补充" label-width="120px">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="ruleForm.bc"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <!-- 课后 -->
      <div class="wrap-preparation clearfix">
        <div class="preparation-title">
          <span>课后 :</span>
        </div>
        <div class="preparation-list">
          <div class="wrap-history">
            <div class="history-log-content">
              <el-form-item label="系统生成的日志" label-width="120px">
                <el-input
                  resize="none"
                  disabled
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5}"
                  v-model="ruleForm.lsrz"
                ></el-input>
              </el-form-item>
            </div>
            <div style="margin-left : 120px ;margin-bottom : 10px">
              <el-checkbox v-model="ruleForm.tx">听写</el-checkbox>
              <el-checkbox v-model="ruleForm.kwbs">课文背诵</el-checkbox>
              <el-checkbox v-model="ruleForm.tl">听力</el-checkbox>
            </div>
            <div class="history-log-content">
              <el-form-item label="补充日志" label-width="120px">
                <el-input
                  resize="none"
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5}"
                  v-model="ruleForm.bcrz"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
      <!-- 个人日志 -->
      <div class="personal-log clearfix">
        <div class="personal-title">
          <span>个人日志</span>
        </div>
        <div class="personal-log-list">
          <!-- 是否有考试 -->
          <div class="wrap-examination clearfix">
            <div class="examination-text">
              <el-form-item label="是否有考试" label-width="100px">
                <el-radio-group
                  style="width : 200px"
                  @change="examinationStatus"
                  v-model="ruleForm.sfyks"
                >
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div v-if="ifExamination" class="examination-upload">
              <div style="width : 50%; display: inline-block">
                <el-form-item label="状态">
                  <el-select v-model="ruleForm.remark">
                    <el-option label="区域一" value="shanghai"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="考试类型">
                  <el-select v-model="ruleForm.kslx">
                    <el-option label="区域一" value="shanghai"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="考试名称">
                  <el-input style="width :90%" v-model="ruleForm.ksmc"></el-input>
                </el-form-item>
              </div>
              <div class="button">
                <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">上传</el-button>
              </div>
            </div>
          </div>
          <!-- 课堂照片 -->
          <div class="class-photos">
            <div>
              <h4>教室卫生</h4>
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
            </div>
            <div>
              <h4>学生表现</h4>
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
            </div>
          </div>
          <!-- 备注 -->
          <div class="bz">
            <el-form-item label="备注">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 4}"
                placeholder="请输入内容"
                v-model="ruleForm.bz"
              ></el-input>
            </el-form-item>
          </div>
          <!-- 发送到人 -->
          <div class="send-out">
            <h4>发送到人</h4>
            <el-select v-model="ruleForm.fsr" filterable multiple placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button type="primary">发送</el-button>
          </div>
        </div>
      </div>
    </el-form>

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
import { workLogListQuery } from "../../../api/basic/basicTeacherWorkLog";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "导入老师学生谈话数据",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "basic/teacherTalk/importData"
      },
      // 教室图片
      dialogImageUrl: "",
      dialogVisible: false,
      // 是否有考试
      ifExamination: false,
      // 发送人
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ]
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取课中课表信息
    getList() {
      let json = {
        lsid: "202106158174553586164977e3534f46dba4673f3bbc6da884",
        kzzd1: "202106158170307455f835e6850ed84b93a019c65f4b0234c4"
      };
      workLogListQuery(json).then(res => {
        console.log(res);
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "考试成绩导入";
      this.upload.open = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 下载模板操作
    importTemplate() {
      this.download(
        "basic/teacherTalk/importTemplate",
        {
          ...this.queryParams
        },
        `考试-导入模板.xlsx`
      );
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
    //是否有考试
    examinationStatus(value) {
      this.ifExamination = value ? true : false;
    }
  }
};
</script>

<style lang="scss">
.work-log {
  padding: 20px;
  box-sizing: border-box;
  .wrap-log {
    width: 100%;
    height: 150px;
    position: relative;
    border: 2px #ccc solid;
    .curriculum-title {
      width: 20%;
      height: 100%;
      text-align: center;
      border-right: 2px #ccc solid;
      float: left;
      span {
        line-height: 150px;
      }
    }
    .log-content {
      padding: 10px;
      box-sizing: border-box;
      float: right;
      width: 80%;
      height: 100%;
      padding-left: 20px;
      box-sizing: border-box;
    }
  }
  .wrap-preparation {
    width: 100%;
    height: 300px;
    position: relative;
    border: 2px #ccc solid;
    border-top: none;
    .preparation-title {
      width: 20%;
      height: 100%;
      text-align: center;
      border-right: 2px #ccc solid;
      float: left;
      span {
        line-height: 300px;
      }
    }
    .preparation-list {
      float: right;
      width: 80%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      .wrap-history {
        width: 100%;
        .history-log-content {
          float: right;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .in-class {
    width: 100%;
    height: 100%;
    position: relative;
    border: 2px #ccc solid;
    border-top: none;
    position: relative;
    .in-class-title {
      width: 20%;
      height: 100%;
      text-align: center;
      float: left;
      border-right: 2px #ccc solid;
      position: absolute;
      top: 0;
      bottom: 0;
      span {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        transform: translateX(-50%);
      }
    }
    .in-class-list {
      float: right;
      width: 80%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      .in-class-content {
        width: 100%;
        height: 100%;
        ul {
          list-style: none;
          padding-left: 20px;
          box-sizing: border-box;
          li {
            width: 100%;
            height: 40px;
            padding-left: 10px;
            box-sizing: border-box;
            margin-bottom: 5px;
            span {
              line-height: 40px;
            }
          }
        }
      }
    }
  }
  .personal-log {
    width: 100%;
    height: 300%;
    position: relative;
    border: 2px #ccc solid;
    border-top: none;
    position: relative;
    .personal-title {
      width: 20%;
      height: 100%;
      text-align: center;
      float: left;
      border-right: 2px #ccc solid;
      position: absolute;
      top: 0;
      bottom: 0;
      span {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        transform: translateX(-50%);
      }
    }
    .personal-log-list {
      width: 80%;
      height: 100%;
      float: right;
      .wrap-examination {
        width: 100%;
        height: 100%;
        .examination-text {
          float: left;
          width: 20%;
        }
        .examination-upload {
          width: 60%;
          height: 160px;
          float: right;
          background-color: #ccc;
          .button {
            display: inline-block;
          }
        }
      }
      .class-photos {
        width: 100%;
        height: 100%;
        padding-left: 20px;
        box-sizing: border-box;
      }
      .bz {
        margin: 10px;
      }
      .send-out {
        margin: 10px;
      }
    }
  }
}
</style>