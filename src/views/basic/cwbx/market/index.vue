<template>
  <div class="public-reimbursement">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="报销类型">
        <el-select v-model="queryParams.expenseType">
          <el-option
            v-for="(item,index) in expenseType"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.auditStatus" placeholder="状态">
          <el-option
            v-for="(item,index) in expenseAuditStatus"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发生时间">
        <el-date-picker
          v-model="queryParams.happenTimeArr"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker
          v-model="queryParams.applyTimeArr"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button type="primary" @click="addReimbursement">添加报销</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="listExpense" border style="width: 100%">
      <el-table-column label="报销人" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.applyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.departName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报销类型" width="180" prop="expenseType">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
          >{{ statusFormat(scope.row.expenseType)}}/{{statusFormatData(scope.row.expenseData)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发生时间" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.happenTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报销金额" width="180">
        <template slot-scope="scope">
          <p style="margin-left: 10px">{{ scope.row.cost }}</p>
          <p style="margin-left: 10px">{{ scope.row.costUpper }}</p>
        </template>
      </el-table-column>
      <el-table-column label="报销说明">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.costExplain }}</span>
        </template>
      </el-table-column>
      <el-table-column label="附件" width="200">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.attachmentFileList" :key="index">
            <el-link
              type="primary"
              @click="openDocument(item.wjlj)"
              v-if="item.fileType == 'pdf'"
            >{{item.wjmc}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发票状态" width="180">
        <template slot-scope="scope">
          <p v-if="scope.row.invoiceFormat == 1" style="margin-left: 10px">电子发票</p>
          <div v-else style="margin-left: 10px">
            <span>纸质发票</span>
            <p v-if="scope.row.invoiceStatusPaper == 1">(需寄回)</p>
            <p v-if="scope.row.invoiceStatusPaper == 2">(已收回)</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="审批状态"
        width="180"
        prop="auditStatus"
        :formatter="getExpenseAuditStatus"
      ></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.$index, scope.row)">查 看</el-button>
          <el-button size="mini" @click="handleViewProcess(scope.$index, scope.row)">查看流程</el-button>
          <el-button
            size="mini"
            v-if="scope.row.auditStatus == 1 || scope.row.auditStatus == 2 || scope.row.auditStatus == 4"
            @click="handleWithdraw(scope.$index, scope.row)"
          >撤 回</el-button>
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

    <el-dialog title="添加报销" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        :rules="rules"
        ref="formName"
        label-width="100px"
        class="demo-ruleForm"
      >
        <table style="width : 100%;" border="1" cellspacing="0">
          <tbody>
            <tr>
              <td class="tds">报销人</td>
              <td>{{form.applyName}}</td>
            </tr>
            <tr>
              <td class="tds">区域负责人</td>
              <td>
                <el-form-item prop="areaId" label-width="0">
                  <el-select filterable v-model="form.areaId" placeholder="请选择区域负责人">
                    <el-option
                      v-for="(item,index) in getListAreaManager"
                      :key="index"
                      :label="item.xm"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="rolesName == '市场部'">
              <td class="tds">是否已开班</td>
              <td>
                <el-radio-group v-model="form.isClassCreate">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr v-if="rolesName == 'marketing'">
              <td class="tds">所用校区/班级</td>
              <td>
                <el-select
                  v-if="form.isClassCreate == 1"
                  @change="getDepartName"
                  v-model="form.xqbj"
                >
                  <el-option
                    v-for="(item,index) in bjlist"
                    :key="index"
                    :label="item.rybjmc"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-input v-else v-model="form.departName"></el-input>
              </td>
            </tr>
            <tr v-if="rolesName == 'teachingResearch' || rolesName == 'academicAdministrator'">
              <td class="tds">所用校区/班级</td>
              <td>
                <el-select @change="getDepartName" v-model="form.xqbj">
                  <el-option
                    v-for="(item,index) in bjlist"
                    :key="index"
                    :label="item.rybjmc"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="tds">报销类型</td>
              <td>
                <el-form-item prop="expenseCode" label-width="0">
                  <el-select v-model="form.expenseCode" @change="getExpenseData">
                    <el-option
                      v-for="(item,index) in expenseType"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="expenseData" label-width="0">
                  <el-select v-model="form.expenseData">
                    <el-option
                      v-for="(item,index) in expenseData"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="tds">发生时间</td>
              <td>
                <el-form-item prop="happenTime" label-width="0">
                  <el-date-picker v-model="form.happenTime" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="tds">
                费用金额
                大写
              </td>
              <td>
                <el-form-item prop="cost" label-width="0">
                  <el-input v-model="form.cost" @input="getDigitToChinese" placeholder="请输入金额"></el-input>
                </el-form-item>
                <br />
                <br />
                <span>{{form.costUpper}}</span>
              </td>
            </tr>
            <tr>
              <td class="tds">费用说明</td>
              <td>
                <el-popover placement="right" width="400" trigger="click">
                  <div>
                    <p>7.15武汉-随州 火车票 50元</p>
                    <p>7.18随州-武汉 火车票50元</p>
                    <p>7.15-7.17随州住宿费3晚 住宿费300元</p>
                    <p>随县二中23届3-10课打印费50元</p>
                    <p>随县二中23届 21年下半年期中考试试卷打印费60元</p>
                  </div>
                  <el-button slot="reference" type="primary">查看填写模板</el-button>
                </el-popover>
                <br />
                <br />
                <el-form-item prop="costExplain" label-width="0">
                  <el-input
                    type="textarea"
                    v-model="form.costExplain"
                    :rows="5"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="tds">附件</td>
              <td>
                <el-form-item prop="invoiceFormat" label-width="0">
                  <el-select v-model="form.invoiceFormat">
                    <el-option
                      v-for="(item,index) in invoiceFormat"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <br />
                <br />
                <!-- <h3>图片</h3>
                <div v-if="form.auditStatus == 1 ||form.auditStatus == 2 || form.auditStatus == 4">
                  <el-upload
                    :action="upload.imgUrl"
                    :headers="upload.headers"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="imgSuccess"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt />
                  </el-dialog>
                </div>-->
                <div v-for="(item,index) in form.photoFileList" :key="index">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="item.wjlj"
                    :preview-src-list="[item.wjlj]"
                  ></el-image>
                </div>
                <h3>文件</h3>
                <div v-if="form.auditStatus == 1 ||form.auditStatus == 2 || form.auditStatus == 4">
                  <el-upload
                    class="upload-demo"
                    drag
                    :action="upload.imgUrl"
                    :headers="upload.headers"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="fileSuccess"
                    :before-upload="beforeFile"
                    :data="fileForm"
                    multiple
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                      将文件拖到此处，或
                      <em>点击上传</em>
                    </div>
                    <!-- <div class="el-upload__tip" slot="tip">只能上传.doc,.docx文件，且不超过500kb</div> -->
                  </el-upload>
                </div>
                <div v-else v-for="(item,index) in form.attachmentFileList" :key="++index">
                  <el-link type="primary" @click="openDocument(item.wjlj)">{{item.wjmc}}</el-link>
                </div>
              </td>
            </tr>
            <tr>
              <td class="tds">审批</td>
              <td>
                <h3>初审审批人 : {{form.auditInitName}}</h3>
                <h3>审批意见</h3>
                <div v-html="form.auditInitOpinion"></div>
                <br />
                <br />
                <h3>复审审批人 : {{form.auditReviewName}}</h3>
                <h3>审批意见</h3>
                <div v-html="form.auditReviewOpinion"></div>
              </td>
            </tr>
            <tr>
              <td class="tds">操作</td>
              <td>
                <el-button
                  type="success"
                  v-if="form.auditStatus == 1 ||form.auditStatus == 2 ||form.auditStatus == 4"
                  @click="saveSubit"
                >提 交</el-button>
                <p v-else>已复审完成,不可修改</p>
              </td>
            </tr>
          </tbody>
        </table>
      </el-form>
    </el-dialog>

    <el-dialog title="查看流程" :visible.sync="dialogTableVisible">
      <el-table :data="listExpenseProcess">
        <el-table-column property="auditName" label="审批人" width="150"></el-table-column>
        <el-table-column property="createTime" label="审批时间" width="200"></el-table-column>
        <el-table-column property="auditOpinion" label="审核意见"></el-table-column>
        <el-table-column property="auditStatus" :formatter="getExpenseAuditStatus" label="审批状态"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  addExpense,
  editExpense,
  listExpense,
  digitToChinese,
  listExpenseProcess,
  listAreaManager
} from "@/api/basic/cw-teacher";
import { listBjclass } from "@/api/basic/bjclass";
import { listData } from "@/api/system/dict/data";
import { getToken } from "@/utils/auth";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
export default {
  data() {
    return {
      form: {
        applyId: this.$store.state.user.userId,
        applyName: this.$store.state.user.nickName,
        applyType: 2,
        costUpper: null,
        auditStatus: 1,
        expenseCode: null,
        happenTime: null,
        cost: null,
        costExplain: null,
        invoiceFormat: null,
        photoFileId: null,
        attachmentFileId: null
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        applyType: 2,
        applyId: this.$store.state.user.userId
      },
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
        imgUrlOLd: process.env.VUE_APP_BASE_API + "/file/upload",
        // 上传图片地址
        imgUrl: process.env.VUE_APP_BASE_API + "/file/renameUpload"
      },
      total: 0,
      dialogFormVisible: false,
      dialogImageUrl: false,
      dialogVisible: false,
      dialogTableVisible: false,
      expenseType: [],
      expenseDataList: [],
      expenseData: [],
      expenseDataName: "",
      invoiceFormat: [],
      expenseAuditStatus: [],
      bjlist: [],
      listExpense: [],
      listExpenseProcess: [],
      getListAreaManager: [],
      rolesName: this.$store.state.user.roles[0],
      fileForm: {
        renameFileName: ""
      },
      expenseExplainTemplate: "",
      rules: {
        areaId: [{ required: true, message: "请选择", trigger: "change" }],
        departName: [{ required: true, message: "请选择", trigger: "change" }],
        expenseCode: [{ required: true, message: "请选择", trigger: "change" }],
        expenseData: [{ required: true, message: "请选择", trigger: "change" }],
        happenTime: [{ required: true, message: "请选择", trigger: "change" }],
        invoiceFormat: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        cost: [{ required: true, message: "请填写", trigger: "change" }],
        costExplain: [{ required: true, message: "请填写", trigger: "change" }]
      }
    };
  },
  created() {
    this.getDicts("expense_type").then(response => {
      this.expenseType = response.data;
    });
    this.getDicts("expense_data").then(response => {
      this.expenseDataList = response.data;
    });
    this.getDicts("invoice_format").then(response => {
      this.invoiceFormat = response.data;
    });
    this.getDicts("expense_audit_status").then(response => {
      this.expenseAuditStatus = response.data;
    });
    this.getConfigKey("expenseExplainTemplate").then(res => {
      this.expenseExplainTemplate = res.msg;
    });
    listAreaManager().then(res => {
      this.getListAreaManager = res.rows;
    });
    listBjclass().then(res => {
      this.bjlist = res.rows;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      listExpense(this.queryParams).then(res => {
        this.listExpense = res.rows;
        this.total = res.total;
      });
    },
    openDocument(path) {
      // window.open(`https://view.officeapps.live.com/op/view.aspx?src=${path}`);
      window.open(path);
    },
    handleView(index, row) {
      this.form = row;
      this.expenseType.forEach(value => {
        if (value.dictValue == this.form.expenseType) {
          this.form.expenseCode = value.dictCode;
          this.getExpenseData();
        }
      });
      this.dialogFormVisible = true;
    },
    addReimbursement(index, row) {
      this.reset();
      this.dialogFormVisible = true;
    },
    reset() {
      this.form = {
        applyId: this.$store.state.user.userId,
        applyName: this.$store.state.user.nickName,
        applyType: 2,
        costUpper: null,
        auditStatus: 1,
        expenseCode: null,
        happenTime: null,
        cost: null,
        costExplain: null,
        invoiceFormat: null
      };
    },
    getExpenseData(value) {
      this.expenseData = [];
      this.expenseType.forEach(value => {
        if (value.dictCode == this.form.expenseCode) {
          this.form.expenseType = value.dictValue;
        }
      });
      this.expenseDataList.forEach(value => {
        if (value.remark == this.form.expenseCode) {
          this.expenseData.push(value);
        }
      });
    },
    getDigitToChinese() {
      if (this.form.cost) {
        let num = parseFloat(this.form.cost).toFixed(2);
        digitToChinese(num).then(res => {
          this.form.costUpper = res.data;
        });
      } else {
        this.form.costUpper = null;
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
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
    beforeFile(file) {
      let regImg = /image/g;
      let regPdf = /pdf/g;
      if (regImg.test(file.type) || regPdf.test(file.type)) {
        this.fileForm.renameFileName = "";
        let hz = file.name.substr(file.name.lastIndexOf("."));
        this.fileForm.renameFileName =
          this.form.applyName + this.parseTime(new Date()) + hz;
      } else {
        this.msgError("只能上传图片或者pdf格式文件");
        return false;
      }
    },
    imgSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.photoFileId || secretKey();
      this.form.photoFileId = data.kzzd1;
      addImg(data).then(res => {
        file.id = res.data.id;
      });
    },
    fileSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.form.attachmentFileId || secretKey();
      this.form.attachmentFileId = data.kzzd1;
      addImg(data).then(res => {
        file.id = res.data.id;
      });
    },
    statusFormat(expenseType) {
      return this.selectDictLabel(this.expenseType, expenseType);
    },
    statusFormatData(expenseData) {
      return this.selectDictLabel(this.expenseDataList, expenseData);
    },
    getExpenseAuditStatus(row, column) {
      return this.selectDictLabel(this.expenseAuditStatus, row.auditStatus);
    },
    saveSubit() {
      this.$refs.formName.validate(valid => {
        if (valid) {
          // if (this.form.invoiceFormat == 1) {
          //   if (!this.form.photoFileId || !this.form.attachmentFileId) {
          //     this.msgError("错误 : 附件必须上传图片和文件");
          //     return;
          //   }
          // }
          if (this.form.id) {
            editExpense(this.form).then(res => {
              this.msgSuccess("成功 : 保存成功");
              this.getList();
              this.dialogFormVisible = false;
            });
          } else {
            addExpense(this.form).then(res => {
              this.msgSuccess("成功 : 保存成功");
              this.getList();
              this.dialogFormVisible = false;
            });
          }
        } else {
          this.msgError("错误 : 请填写完整数据");
          return false;
        }
      });
    },
    handleWithdraw(index, row) {
      this.$confirm("此操作将不可恢复,只能重新申请, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.form = row;
          this.form.auditStatus = 7;
          editExpense(this.form).then(res => {
            this.msgSuccess("成功 : 撤回成功");
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回"
          });
        });
    },
    handleViewProcess(index, row) {
      listExpenseProcess({ expenseId: row.id }).then(res => {
        this.listExpenseProcess = res.rows;
        this.dialogTableVisible = true;
      });
    },
    getDepartName() {
      this.bjlist.forEach(value => {
        if (this.form.xqbj == value.id) {
          this.form.departName = `${value.xqmc}/${value.rybjmc}`;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.public-reimbursement {
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
