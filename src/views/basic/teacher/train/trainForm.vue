<template>
  <div class="trainForm">
    <div class="time-add">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="dialogVisible = true"
      > 编辑 </el-button>
    </div>
    <el-dialog title="增加面试老师" @close="cancel" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.xm"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.xb" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="form.dh"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="form.dq"></el-input>
        </el-form-item>
        <el-form-item label="期望">
          <el-input v-model="form.qw"></el-input>
        </el-form-item>
        <el-form-item label="来汉时间">
          <el-input v-model="form.lhsj"></el-input>
        </el-form-item>
        <el-form-item label="派遣地区">
          <el-input v-model="form.pqdq"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        xm: "",
        dh: null,
        lr: "",
        xb: "",
        qw: "",
        dq: "",
        tag: "",
        lhsj: "",
        pqdq: ""
      }
    };
  },
  methods: {
    // 提交按钮
    onSubmit() {
      this.$refs["form"].validate(valid => {
        this.dialogVisible = false;
        if (valid) {
          if (this.form.id != null) {
            console.log("add");
          } else {
            console.log("edit");
          }
        }
      });
    },
    // 编辑数据渲染
    edittiemForm(value) {
      this.dialogVisible = true;
      this.form = value;
    },
    // 数据初始化
    cancel() {
      this.form = {
        xm: "",
        dh: null,
        lr: "",
        xb: "",
        qw: "",
        dq: "",
        tag: "",
        lhsj: "",
        pqdq: ""
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.trainForm {
  width: 100%;
  height: 100%;
}
</style>