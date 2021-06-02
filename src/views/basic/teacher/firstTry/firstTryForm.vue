<template>
  <div class="firstTryForm">
    <div class="firstTry-add">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="dialogVisible = true"
      >新增</el-button>
    </div>
    <el-dialog title="增加面试老师" @close="cancel" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.xm"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.xb" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input maxlength="11" v-model="form.dhhm"></el-input>
        </el-form-item>
        <el-form-item label="家庭住址">
          <el-input v-model="form.jtzz"></el-input>
        </el-form-item>
        <el-form-item label="期望">
          <el-input v-model="form.yxdq"></el-input>
        </el-form-item>
        <!-- <el-form-item label="初试结果">
          <el-select v-model="form.mszt" clearable placeholder="请选择">
            <el-option
              v-for="item in resultList"
              :key="item.value"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="录入">
          <el-input disabled v-model="form.lrrid"></el-input>
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
import { teacherPersonnel, editTeacherPersonnel } from "@/api/basic/firstTry";
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        xm: "",
        dhhm: null,
        lrrid: this.$store.state.user.name,
        xb: "",
        yxdq: "",
        jtzz: "",
      },
      // 初试结果
      resultList: []
    };
  },
  created() {
    this.getDicts("preliminary_test_results").then(response => {
      this.resultList = response.data;
    });
  },
  methods: {
    // 提交按钮
    onSubmit() {
      this.$refs["form"].validate(valid => {
        this.dialogVisible = false;
        if (valid) {
          if (this.form.id != null) {
            editTeacherPersonnel(this.form).then(res => {
              this.$notify({
                title: "成功",
                message: res.msg,
                type: "success"
              });
              this.cancel();
            });
          } else {
            teacherPersonnel(this.form).then(res => {
              this.$notify({
                title: "成功",
                message: res.msg,
                type: "success"
              });
              this.cancel();
            });
          }
        }
      });
    },
    // 编辑数据渲染
    editFirstTryForm(value) {
      this.dialogVisible = true;
      this.form = value;
    },
    // 数据初始化
    cancel() {
      this.$emit("getList");
      this.form = {
        xm: "",
        dhhm: null,
        lrrid: this.$store.state.user.name,
        xb: "",
        yxdq: "",
        jtzz: "",
        id: null,
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.firstTryForm {
  width: 100%;
  height: 100%;
}
</style>