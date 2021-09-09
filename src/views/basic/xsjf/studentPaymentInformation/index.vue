<template>
  <div class="studentPaymentInformation">
    <el-form ref="classForm" :model="classForm" label-width="80px">
      <el-form-item label="班级">
        <el-select v-model="classForm.bjid" @change="replaceClass" placeholder="请选择班级">
          <el-option
            :label="item.rybjmc"
            :value="item.id"
            v-for="(item,index) in classList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style="text-align : center">
      <h4>{{columnNameItem.bjbt}}</h4>
      <h5>{{columnNameItem.wzsm}}</h5>
    </div>

    <div style="margin-bottom : 20px">
      <el-button type="primary" size="mini" @click="paymentAll">批量缴费</el-button>
      <el-button type="primary" size="mini" @click="specialAdd">特殊情况申请</el-button>
    </div>

    <el-table
      ref="multipleTable"
      :data="paymentStudentData"
      tooltip-effect="dark"
      style="width: 100%"
      :border="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        v-for="(item,index) in columnNameItem.columnNameList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      >
        <template slot-scope="scope">
          <div v-if="item.prop == 'bqjfzt'">
            <dict-tag :options="paymentStatus" :value="scope.row[item.prop]" />
          </div>
          <div v-else-if="item.prop == 'specialKey'">
            <dict-tag :options="specialStatus" :value="scope.row[item.prop]" />
          </div>
          <div v-else-if="item.prop == 'handle'">
            <el-button
              size="mini"
              v-if="scope.row['bqjfzt'] == '0'"
              type="primary"
              @click="queryData(scope.row)"
            >缴费</el-button>
            <el-button
              size="mini"
              v-if="scope.row['bqjfzt'] == '1'"
              type="primary"
              @click="queryData(scope.row)"
            >补缴</el-button>
          </div>
          <div v-else>
            <span>{{ scope.row[item.prop] }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="缴费" :visible.sync="dialogVisible" width="40%">
      <el-form
        ref="studentPaymentInformationForm"
        :model="studentPaymentInformationForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="姓名">
          <div>
            <span v-for="(item,index) in studentPaymentInformationForm.xsxm" :key="index">{{item}} -</span>
          </div>
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="className" disabled></el-input>
        </el-form-item>
        <el-form-item label="期数">
          <el-input v-model="studentPaymentInformationForm.bqqsValue" disabled></el-input>
        </el-form-item>
        <el-form-item label="缴费金额" prop="jfje">
          <el-input v-model="studentPaymentInformationForm.jfje" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="jffs">
          <el-select v-model="studentPaymentInformationForm.jffs" placeholder="请选择支付方式">
            <el-option
              :label="item.dictLabel"
              :value="item.dictValue"
              v-for="(item,index) in paymentWay"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费凭证">
          <el-upload
            :action="upload.imgUrl"
            :headers="upload.headers"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="pzSuccess"
            :file-list="files1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <img width="100%" :src="dialogImageUrl" alt />
        </el-form-item>
        <el-form-item label="转账时间" prop="zzsj">
          <el-date-picker
            type="date"
            v-model="studentPaymentInformationForm.zzsj"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="studentPaymentInformationForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelPayment">取 消</el-button>
        <el-button type="primary" @click="submitPayment">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="特殊情况申请" :visible.sync="specialVisible" width="30%">
      <el-form ref="specialForm" :rules="rules1" :model="specialForm" label-width="80px">
        <el-form-item label="班级">
          <div>
            <span>{{className}}</span>
          </div>
        </el-form-item>
        <el-form-item label="老师">
          <div>
            <span>{{this.$store.state.user.nickName}}</span>
          </div>
        </el-form-item>
        <el-form-item label="姓名">
          <div>
            <span>{{specialForm.xsxm}}</span>
          </div>
        </el-form-item>
        <el-form-item label="减免类型" prop="jmlx">
          <el-select v-model="specialForm.jmlx" placeholder="请选择减免类型">
            <el-option
              :label="item.dictLabel"
              :value="item.dictValue"
              v-for="(item,index) in specialStatus"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="减免金额" prop="jmje">
          <el-input v-model="specialForm.jmje" placeholder="请输入减免总金额"></el-input>
        </el-form-item>
        <el-form-item
          :label="['第' + item + '期']"
          prop="jmqsSz"
          v-for="(item,index) in exemptPeriodsQueryList"
          :key="index"
        >
          <!-- <el-checkbox-group v-model="specialForm.jmqsSz">
            <el-checkbox
              :label="item"
              v-for="(item,index) in exemptPeriodsQueryList"
              :key="index"
            >第{{item}}期</el-checkbox>
          </el-checkbox-group>-->
          <el-input v-model="specialForm.jmqsSz[index]" placeholder="请输入每期减免的金额"></el-input>
        </el-form-item>
        <el-form-item label="申请原因" prop="sqyy">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="specialForm.sqyy"></el-input>
        </el-form-item>
        <el-form-item label="申请资料">
          <el-upload
            accept="*"
            :action="upload.imgUrl"
            :headers="upload.headers"
            list-type="picture-card"
            :on-preview="jmPictureCardPreview"
            :on-remove="jmRemove"
            :on-success="jmSuccess"
            :file-list="files2"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <img width="100%" :src="dialogImageUrl1" alt />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="specialCancel">取 消</el-button>
        <el-button type="primary" @click=" specialSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listBjclass } from "@/api/basic/bjclass";
import {
  paymentStudent,
  paymentStudentColumnNamelist,
  addBatchStuPayment,
  exemptApply,
  exemptPeriodsQuery,
  bujiaoStuPayment,
  ifIsNowPayment
} from "@/api/basic/studentPaymentInformation";
import { listPaymentSpecial } from "@/api/basic/paymentSpecial";
import { secretKey } from "@/utils/tools";
import { getToken } from "@/utils/auth";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
export default {
  data() {
    return {
      paymentStudentData: [],
      columnNameItem: [],
      studentPaymentInformationForm: {
        jffs: "",
        jfje: 0,
        jfpzid: "",
        qsid: "",
        rybjid: "",
        xsbh: [],
        xsxm: [],
        zzsj: "",
        remark: ""
      },
      dialogImageUrl: "",
      dialogImageUrl1: "",
      dialogVisible: false,
      specialVisible: false,
      specialForm: {},
      classForm: {
        bjid: ""
      },
      classList: [],
      classTitle: {},
      paymentStatus: [],
      paymentWay: [],
      className: "",
      // 文件图片上传
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
      files1: [],
      files2: [],
      paymentAllList: [],
      rules: {
        jfje: [{ required: true, message: "请输入总费用", trigger: "blur" }],
        jffs: [
          { required: true, message: "请选择支付方式", trigger: "change" }
        ],
        zzsj: [{ required: true, message: "请选择日期", trigger: "change" }]
      },
      rules1: {
        jmje: [{ required: true, message: "请输入减免金额", trigger: "blur" }],
        sqyy: [{ required: true, message: "请输入申请原因", trigger: "blur" }],
        jmlx: [
          { required: true, message: "请选择减免类型", trigger: "change" }
        ],
        jmqsSz: [
          { required: true, message: "请选择减免期数", trigger: "change" }
        ],
        zzsj: [{ required: true, message: "请选择日期", trigger: "change" }]
      },
      isDisabled: true,
      specialStatus: [],
      exemptPeriodsQueryList: [],
      $yjje: 0
    };
  },
  created() {
    listBjclass().then(res => {
      this.classList = res.rows;
      if (this.classList.length >= 1) {
        this.classForm.bjid = this.classList[0].id;
        this.className = this.classList[0].rybjmc;
        this.getList(this.classForm.bjid);
      }
    });
    this.getDicts("payment_status").then(res => {
      this.paymentStatus = res.data;
    });
    this.getDicts("payment_way").then(res => {
      this.paymentWay = res.data;
    });
    this.getDicts("special_status").then(res => {
      this.specialStatus = res.data;
    });
  },
  mounted() {},
  methods: {
    // 替换班级
    replaceClass(bjid) {
      this.classList.forEach(value => {
        if (value.id == bjid) {
          this.className = value.rybjmc;
        }
      });
      this.getList(bjid);
    },
    // 获取缴费信息列表
    getList(bjid) {
      ifIsNowPayment({ bjid }).then(res => {
        if (res.data) {
          paymentStudent({ bjid }).then(res => {
            if (res.code == 200) {
              this.paymentStudentData = res.data;
            }
          });
          paymentStudentColumnNamelist({ bjid }).then(res => {
            if (res.code == 200) {
              this.columnNameItem = res.data;
            }
          });
        } else {
          this.msgError("警告 : 当前不在缴费时间内");
          this.columnNameItem = [];
          this.paymentStudentData = [];
        }
      });
    },
    // 选中数据
    handleSelectionChange(val) {
      this.paymentAllList = val;
    },
    // 缴费按钮
    queryData(row) {
      if (row.bqjfzt == "0") {
        this.dtPayment(row, row.bqYjje);
      } else if (row.bqjfzt == "1") {
        this.dtPayment(row, row.bqwjf);
      } else {
        this.msgError("当前学生已缴费,请勿重复操作");
        return;
      }
    },
    // 动态缴费
    dtPayment(row, jfje) {
      this.dialogVisible = true;
      this.isDisabled = false;
      this.studentPaymentInformationForm = {
        rybjid: this.classForm.bjid,
        bqqsValue: row.bqqsValue,
        jfpzid: row.jfpzid,
        jfje: jfje,
        qsid: row.bqqsKey,
        remark: row.remark,
        bqjfzt: row.bqjfzt,
        xsbh: [row.xsbh],
        xsxm: [row.xsxm]
      };
      this.$yjje = this.studentPaymentInformationForm.jfje;
    },
    // 图片删除(缴费凭证)
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
    // 图片预览(缴费凭证)
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传图片成功回调(缴费凭证)
    pzSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.studentPaymentInformationForm.jfpzid || secretKey();
      this.studentPaymentInformationForm.jfpzid = data.kzzd1;
      addImg(data).then(res => {
        if (res.code == 200) {
          this.msgSuccess("上传成功");
          this.selectPhotoList(data.kzzd1, "files1");
        }
      });
    },
    // 批量缴费
    paymentAll() {
      if (this.paymentAllList.length == 0) {
        this.msgError("错误 : 请选择学生");
        return;
      }
      this.reset();
      this.studentPaymentInformationForm = {
        rybjid: this.classForm.bjid,
        bqqsValue: this.paymentAllList[0].bqqsValue,
        qsid: this.paymentAllList[0].bqqsKey,
        xsbh: [],
        xsxm: [],
        jfje: 0
      };
      for (let i = 0; i < this.paymentAllList.length; i++) {
        if (this.paymentAllList[i].bqjfzt != "0") {
          this.msgError("错误 : 当前有部分学生已缴费,请勿重复操作");
          return;
        }
        this.studentPaymentInformationForm.xsbh[i] = this.paymentAllList[
          i
        ].xsbh;
        this.studentPaymentInformationForm.xsxm[i] = this.paymentAllList[
          i
        ].xsxm;
        this.studentPaymentInformationForm.jfje += this.paymentAllList[
          i
        ].bqYjje;
      }
      this.$yjje = this.studentPaymentInformationForm.jfje;
      this.isDisabled = true;
      this.dialogVisible = true;
    },
    //提交缴费
    submitPayment() {
      if (this.studentPaymentInformationForm.jfje.length == 1) {
        let reg = /[1-9]/g;
        if (!reg.test(this.studentPaymentInformationForm.jfje)) {
          this.msgError("错误 : 缴费金额不能为负数和0,且只能输入数字");
        }
      } else {
        let reg = /^[1-9][0-9]*[0-9]$/g;
        if (!reg.test(this.studentPaymentInformationForm.jfje)) {
          this.msgError("错误 : 缴费金额不能为负数和0,且只能输入数字");
        }
      }
      if (this.studentPaymentInformationForm.jfje > this.$yjje) {
        this.msgError("错误 : 缴费金额不能大于应缴金额");
        return;
      }
      if (!this.studentPaymentInformationForm.jfpzid) {
        this.msgError("错误 : 请上传缴费凭证");
        return;
      }
      this.$refs["studentPaymentInformationForm"].validate(valid => {
        if (valid) {
          if (this.studentPaymentInformationForm.bqjfzt == "1") {
            bujiaoStuPayment(this.studentPaymentInformationForm).then(res => {
              if (res.code == 200) {
                this.msgSuccess("缴费成功");
                this.getList(this.classForm.bjid);
                this.reset();
              }
            });
          } else {
            addBatchStuPayment(this.studentPaymentInformationForm).then(res => {
              if (res.code == 200) {
                this.msgSuccess("缴费成功");
                this.getList(this.classForm.bjid);
                this.reset();
              }
            });
          }
          this.dialogVisible = false;
        } else {
          this.msgError("错误 : 请填写完数据再提交");
        }
      });
    },
    // 取消缴费
    cancelPayment() {
      this.dialogVisible = false;
    },
    // 重置
    reset() {
      this.studentPaymentInformationForm = {
        jffs: "",
        jfje: 0,
        jfpzid: "",
        qsid: "",
        rybjid: "",
        xsbh: [],
        xsxm: [],
        zzsj: ""
      };
      this.specialForm = [];
      this.files1 = [];
      this.files2 = [];
    },
    // 特殊情况申请
    specialAdd() {
      if (this.paymentAllList.length == 0) {
        this.msgError("错误 : 请选择需要减免的学生");
        return;
      }
      if (this.paymentAllList.length > 1) {
        this.msgError("错误 : 每次只能选择一位减免的学生");
        return;
      }
      let obj = this.paymentAllList[0];
      listPaymentSpecial({ xsbh: obj.xsbh }).then(res => {
        if (res.rows.length > 0) {
          this.msgError("错误 : 你已提交过减免申请,请勿重复操作");
        } else {
          exemptPeriodsQuery(obj.xsbh).then(res => {
            if (res.code == 200) {
              this.exemptPeriodsQueryList = res.data;
            }
          });
          this.specialForm = {
            xsbh: obj.xsbh,
            xsxm: obj.xsxm,
            rybjid: this.classForm.bjid,
            jmqsSz: []
          };
          this.specialVisible = true;
        }
      });
    },
    // 减免提交
    specialSubmit() {
      if (this.specialForm.jmje.length == 1) {
        let reg = /[1-9]/g;
        if (!reg.test(this.specialForm.jmje)) {
          this.msgError("错误 : 缴费金额不能为负数和0,且只能输入数字");
        }
      } else {
        let reg = /^[1-9][0-9]*[0-9]$/g;
        if (!reg.test(this.specialForm.jmje)) {
          this.msgError("错误 : 缴费金额不能为负数和0,且只能输入数字");
        }
      }
      if (!this.specialForm.jmzjfileid) {
        this.msgError("错误 : 请上传申请资料");
        return;
      }
      this.$refs["specialForm"].validate(valid => {
        if (valid) {
          exemptApply(this.specialForm).then(res => {
            if (res.code == 200) {
              this.msgSuccess("成功 : 减免申请提交成功");
              this.specialVisible = false;
            }
          });
        } else {
          this.msgError("错误 : 请填写完数据再提交");
        }
      });
    },
    // 取消减免
    specialCancel() {
      this.specialVisible = false;
    },
    // 大图预览(减免)
    jmPictureCardPreview(file, fileList) {
      this.dialogImageUrl1 = file.url;
      this.dialogVisible = true;
    },
    // 删除图片(减免)
    jmRemove(file, fileList) {
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
    // 查询照片
    selectPhotoList(jmzjfileid, file) {
      let kzzdJson = {
        kzzd1: jmzjfileid
      };
      selectFileList(kzzdJson).then(res => {
        this[file] = res.rows;
      });
    },
    // 成功回调(减免)
    jmSuccess(response, file, fileList) {
      let data = response.data;
      data.kzzd1 = this.specialForm.jmzjfileid || secretKey();
      this.specialForm.jmzjfileid = data.kzzd1;
      addImg(data).then(res => {
        if (res.code == 200) {
          this.msgSuccess("上传成功");
          this.selectPhotoList(data.kzzd1, "files2");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.studentPaymentInformation {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>
