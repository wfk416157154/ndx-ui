<template>
  <div style="width : 100%; height : 100%; padding : 40px; box-sizing : border-box">
    <el-form ref="offShiftListForm" :model="offShiftListForm" :inline="true" label-width="80px">
      <el-form-item label="负责人">
        <el-select v-model="offShiftListForm.region" placeholder="请选择负责人">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学校">
        <el-select v-model="offShiftListForm.region" placeholder="请选择负责人">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="offShiftListForm.region" placeholder="请选择负责人">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="offShiftListForm.region" placeholder="请选择负责人">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退班时间">
        <el-date-picker
          v-model="offShiftListForm.sj"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button type="danger">未审批</el-button>
        <el-button type="success">已审批</el-button>
        <el-button icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="offShiftListList" border style="width: 100%">
      <el-table-column prop="date" label="班级" width="180"></el-table-column>
      <el-table-column prop="name" label="老师" width="180"></el-table-column>
      <el-table-column prop="address" label="学生姓名"></el-table-column>
      <el-table-column prop="address" label="入班时间-申请退班时间"></el-table-column>
      <el-table-column prop="address" label="退班规则"></el-table-column>
      <el-table-column prop="address" label="教与学质量协议"></el-table-column>
      <el-table-column prop="address" label="收据"></el-table-column>
      <el-table-column prop="address" label="审核资料"></el-table-column>
      <el-table-column prop="address" label="状态"></el-table-column>
      <el-table-column label="操作" width="260px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">学生同意</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">对费用有异议</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="异议" :visible.sync="dialogVisible" width="30%">
      <div>
        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="textarea"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      offShiftListForm: {},
      offShiftListList: [{}],
      dialogVisible: false
    };
  },
  methods: {
    handleDelete() {
      this.dialogVisible = true;
    }
  }
};
</script>
