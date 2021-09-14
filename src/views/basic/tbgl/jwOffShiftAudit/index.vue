<template>
  <div style="width : 100%; height : 100%; padding : 40px; box-sizing : border-box">
    <el-form
      ref="jwOffShiftAuditForm"
      :model="jwOffShiftAuditForm"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="学校">
        <el-select v-model="jwOffShiftAuditForm.region" placeholder="请选择学校">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="jwOffShiftAuditForm.region" placeholder="请选择班级">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师">
        <el-select v-model="jwOffShiftAuditForm.region" placeholder="请选择老师">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退班规则">
        <el-select v-model="jwOffShiftAuditForm.region" placeholder="请选择退班规则">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="jwOffShiftAuditForm.region" placeholder="请选择状态">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button type="danger">未审批</el-button>
        <el-button type="success">已审批</el-button>
        <el-button icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="jwOffShiftAuditList" border style="width: 100%">
      <el-table-column prop="date" label="班级" width="180"></el-table-column>
      <el-table-column prop="name" label="老师" width="180"></el-table-column>
      <el-table-column prop="address" label="学生姓名"></el-table-column>
      <el-table-column prop="address" label="入班时间-申请退班时间"></el-table-column>
      <el-table-column prop="address" label="退班规则"></el-table-column>
      <el-table-column prop="address" label="教与学质量协议"></el-table-column>
      <el-table-column prop="address" label="收据"></el-table-column>
      <el-table-column prop="address" label="银行账号"></el-table-column>
      <el-table-column prop="address" label="审核资料"></el-table-column>
      <el-table-column prop="address" label="状态"></el-table-column>
      <el-table-column label="操作" width="260px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">审核</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">驳回</el-button>
          <el-button size="mini" type="success" @click="handleSuccess(scope.$index, scope.row)">结算</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="初审" :visible.sync="dialogVisible" width="30%">
      <div>
        <el-form
          ref="preliminaryExaminationForm"
          :model="preliminaryExaminationForm"
          label-width="80px"
        >
          <el-form-item label="退还金额">
            <el-input placeholder="请输入内容" v-model="preliminaryExaminationForm.textarea"></el-input>
          </el-form-item>
          <el-form-item label="退还规则">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="preliminaryExaminationForm.textarea"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="对费用有异议" :visible.sync="BHdialogVisible" width="30%">
      <div>
        <el-form
          ref="BHpreliminaryExaminationForm"
          :model="BHpreliminaryExaminationForm"
          label-width="80px"
        >
          <el-form-item label="异议">
            <el-input
              disabled
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="BHpreliminaryExaminationForm.textarea"
            ></el-input>
          </el-form-item>
          <el-form-item label="退还金额">
            <el-input placeholder="请输入内容" v-model="BHpreliminaryExaminationForm.textarea"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="BHpreliminaryExaminationForm.textarea"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="BHdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="BHdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jwOffShiftAuditForm: {},
      jwOffShiftAuditList: [{}],
      dialogVisible: false,
      BHdialogVisible: false,
      preliminaryExaminationForm: {},
      BHpreliminaryExaminationForm: {}
    };
  },
  methods: {
    handleDelete() {
      this.dialogVisible = true;
    },
    handleEdit() {
      this.dialogVisible = true;
    },
    handleDelete() {
      this.BHdialogVisible = true;
    }
  }
};
</script>
