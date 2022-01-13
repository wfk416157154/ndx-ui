<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item>
        <el-select
          v-model="queryParams.shzt"
          @change="getList"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option
            v-for="(dict,index) in preparelesoonsStatus"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      style="width: 100%;font-size : 18px"
      v-loading="loading"
      :height="$root.tableHeight"
      border
      :data="lessonPreparationDataList"
    >
      <el-table-column label="班级" align="center" prop="rybjmc" />
      <el-table-column label="老师" align="center" prop="lsxm" />
      <el-table-column label="教材" align="center" prop="jcmc" />
      <el-table-column label="课程" align="center" prop="kcrwmc">
        <template slot-scope="scope">
          <span>{{scope.row.kcmc}}</span>
          <span>{{scope.row.zmc}}</span>
          <span v-if="!scope.row.zsdmc">{{scope.row.jmc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程安排 / 知识点" align="center" prop="kcrwmc">
        <template slot-scope="scope">
          <span>{{scope.row.kcrwmc}} {{scope.row.zsdmc}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="教案审核状态"
        align="center"
        :formatter="getPrepareLessonAuditStatus"
        prop="jashzt"
      />
      <el-table-column
        label="教案状态"
        align="center"
        :formatter="getPreparelesoonsStatus"
        prop="shzt"
      />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="viewRowData(scope.row)">查看</el-button>
          <el-button
            type="danger"
            size="mini"
            v-if="['1','4'].includes(scope.row.shzt)"
            @click="editRowData(scope.row)"
          >修改</el-button>
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

    <el-dialog title="查看备课信息" :visible.sync="viewDialogFormVisible">
      <div
        style="width : 100%;height : 100%;padding : 40px; box-sizing : border-box;text-align : center"
      >
        <div>
          <table style="width : 100%;" border="1" cellspacing="0">
            <thead>
              <tr>
                <th>课程</th>
                <th v-if="form.kzzd2 == '1'">{{form.kcmc}}</th>
                <th v-else>{{form.fxzlmc}} / {{form.zmc}} / {{form.jmc}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-if="form.kzzd2 == '1'">课程安排</td>
                <td v-else>知识点</td>
                <td v-if="form.kzzd2 == '1'">{{form.kcrwmc}}</td>
                <td>{{form.zsdmc}}</td>
              </tr>
              <!-- <tr v-if="form.kzzd2 == '1'">
                <td>课程教学参考</td>
                <td>
                  <editor v-model="form.kcjxck" :disabled="true" :min-height="192" />
                </td>
              </tr>
              <tr v-if="form.kzzd2 == '1'">
                <td>教参内容</td>
                <td style="text-align : left">
                  <editor v-model="form.kcapjxck" :disabled="true" :min-height="192" />
                </td>
              </tr>-->
              <tr>
                <td>备课</td>
                <td style="text-align : left">
                  <h3>已上传的图片</h3>
                  <div class="clearfix">
                    <div
                      v-for="(item,index) in form.bkTpArr"
                      :key="index"
                      style="float : left;margin-right : 10px"
                    >
                      <img style="width : 200px" :src="item" alt />
                    </div>
                  </div>
                  <h3>已上传的文件</h3>
                  <div class="clearfix">
                    <div v-for="(item,index) in form.bkWjArr" :key="index">
                      <a :href="item" style="color : #409EFF">{{++index}} ) {{item}}</a>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>教案状态</td>
                <td>
                  <el-select v-model="queryParams.shzt" size="small" :disabled="true">
                    <el-option
                      v-for="(dict,index) in preparelesoonsStatus"
                      :key="index"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>审核意见</td>
                <td>
                  <editor v-model="form.kzzd4" :disabled="true" :min-height="192" />
                </td>
              </tr>
              <tr>
                <td>备注</td>
                <td>
                  <editor v-model="form.remark" :disabled="true" :min-height="192" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="viewDialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑备课信息" :visible.sync="dialogFormVisible">
      <div
        style="width : 100%;height : 100%;padding : 40px; box-sizing : border-box;text-align : center"
      >
        <div>
          <table style="width : 100%;" border="1" cellspacing="0">
            <thead>
              <tr>
                <th>课程</th>
                <th v-if="form.kzzd2 == '1'">{{form.kcmc}}</th>
                <th v-else>{{form.fxzlmc}} / {{form.zmc}} / {{form.jmc}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-if="form.kzzd2 == '1'">课程安排</td>
                <td v-else>知识点</td>
                <td v-if="form.kzzd2 == '1'">{{form.kcrwmc}}</td>
                <td>{{form.zsdmc}}</td>
              </tr>
              <tr v-if="form.kzzd2 == '1'">
                <td>课程教学参考</td>
                <td>
                  <editor v-model="form.kcjxck" :disabled="true" :min-height="192" />
                </td>
              </tr>
              <tr v-if="form.kzzd2 == '1'">
                <td>教参内容</td>
                <td style="text-align : left">
                  <editor v-model="form.kcapjxck" :disabled="true" :min-height="192" />
                </td>
              </tr>
              <tr>
                <td>备课</td>
                <td style="text-align : left">
                  <p>图片上传</p>
                  <el-upload
                    :action="upload.imgUrl"
                    :headers="upload.headers"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="bkSuccess"
                    :file-list="getImages"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt />
                  </el-dialog>
                  <p>文件上传</p>
                  <el-upload
                    ref="upload"
                    :limit="1"
                    accept="*"
                    :headers="upload.headers"
                    :action="upload.imgUrl"
                    :disabled="upload.isUploading"
                    :before-upload="beforeAvatarUploadZIP"
                    :on-success="addFileSuccess"
                    :on-remove="handleRemoveFiles"
                    :auto-upload="false"
                    :file-list="getFiles"
                    drag
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                      将文件拖到此处，或
                      <em>点击上传</em>
                    </div>
                    <div
                      class="el-upload__tip"
                      style="color:red"
                      slot="tip"
                    >提示：仅允许导入"{{upload.type}}"格式文件！</div>
                  </el-upload>
                  <br />
                  <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitFileForm">确 定</el-button>
                    <el-button @click="upload.open = false">取 消</el-button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>教案状态</td>
                <td>
                  <el-select v-model="queryParams.shzt" size="small" :disabled="true">
                    <el-option
                      v-for="(dict,index) in preparelesoonsStatus"
                      :key="index"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>审核意见</td>
                <td>
                  <editor v-model="form.kzzd4" :disabled="true" :min-height="192" />
                </td>
              </tr>
              <tr>
                <td>备注</td>
                <td>
                  <editor v-model="form.remark" :min-height="192" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { secretKey } from "@/utils/tools";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
import { addPrepareLessons } from "@/api/basic/lessonPreparationHome"; // ?
import {
  listAcdemicDean,
  prepareLessonsDetails,
  lsEditPrepareLessons
} from "@/api/basic/bkgl";
export default {
  name: "prepareLessons",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 查询列表数据
      lessonPreparationDataList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        lsid: this.$store.state.user.glrid,
        rybjid: null,
        shzt: "4"
      },
      form: {},
      // 教案状态
      preparelesoonsStatus: [],
      // 教案审核状态
      prepareLessonAuditStatus: [],
      // 查看编辑
      dialogFormVisible: false,
      viewDialogFormVisible: false,
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
        imgUrl: process.env.VUE_APP_BASE_API + "/file/upload"
      },
      dialogVisible: false,
      dialogImageUrl: "",
      getImages: [],
      getFiles: []
    };
  },
  created() {
    this.getList();

    // 教案状态
    this.getDicts("preparelesoons_status").then(response => {
      this.preparelesoonsStatus = response.data;
    });

    // 教案审核状态
    this.getDicts("prepareLessonAuditStatus").then(response => {
      this.prepareLessonAuditStatus = response.data;
    });
  },
  methods: {
    /** 查询备课列表 */
    getList() {
      this.loading = true;
      listAcdemicDean(this.queryParams).then(response => {
        this.lessonPreparationDataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 教案审核状态字典翻译
    getPrepareLessonAuditStatus(row, column) {
      return this.selectDictLabel(this.prepareLessonAuditStatus, row.jashzt);
    },
    // 教案状态字典翻译
    getPreparelesoonsStatus(row, column) {
      return this.selectDictLabel(this.preparelesoonsStatus, row.shzt);
    },
    // 查看
    viewRowData(row) {
      this.viewDetailsData(row.id)
        ? (this.viewDialogFormVisible = true)
        : (this.viewDialogFormVisible = false);
    },
    // 查看
    editRowData(row) {
      this.viewDetailsData(row.id)
        ? (this.dialogFormVisible = true)
        : (this.dialogFormVisible = false);
    },
    // 详细数据
    async viewDetailsData(id) {
      let result = await prepareLessonsDetails(id);
      if (result.code == 200) {
        this.form = result.data;
        if (this.form.bkTpid) {
          this.getSelectFileList({ kzzd1: this.form.bkTpid }, "getImages");
        } else {
          this.dialogImageUrl = null;
          this.getImages = [];
        }
        if (this.form.bkWjid) {
          this.getSelectFileList({ kzzd1: this.form.bkWjid }, "getFiles");
        } else {
          this.getFiles = [];
        }
        return true;
      } else {
        return false;
      }
    },
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
    //文件删除
    handleRemoveFiles(file, fileList) {
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
    // 学生表现图片上传成功回调
    bkSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.bkTpid || secretKey();
      this.form.bkTpid = data.kzzd1;
      addImg(data).then(res => {
        if (res.code == 200) {
          this.msgSuccess("成功 : 上传成功");
        } else {
          this.msgError("错误 : 上传失败");
        }
      });
    },
    // 文件上传前验证
    beforeAvatarUploadZIP(file) {
      const isLt40M = file.size / 1024 / 1024 < 40;
      if (!isLt40M) {
        this.$message.error("上传文件大小不能超过 40MB!");
      }
      return isLt40M;
    },
    // 文件上传成功处理压缩包
    addFileSuccess(response, file, fileList) {
      if (response.code == 200) {
        let data = response.data;
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        data.kzzd1 = this.form.bkWjid || secretKey();
        this.form.bkWjid = data.kzzd1;
        // 保存文件上传地址
        addFile(data).then(res => {
          if (res.code == 200) {
            this.msgSuccess("成功 : 上传成功");
          } else {
            this.msgError("错误 : 上传失败");
          }
        });
      } else {
        this.msgError("错误 : 上传失败");
      }
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 保存编辑
    editSubmit() {
      let { bkTpid, bkWjid, remark, id, kzzd4 } = this.form;
      lsEditPrepareLessons({ bkTpid, bkWjid, remark, id }).then(res => {
        if (res.code == 200) {
          this.dialogFormVisible = false;
          this.form = {};
          this.msgSuccess("成功 : 保存成功");
          this.getList();
        }
      });
    }
  }
};
</script>
