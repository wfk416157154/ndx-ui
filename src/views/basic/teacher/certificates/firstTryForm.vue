<template>
  <div class="firstTryForm">
    <div class="firstTry-add">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="dialogVisible = true"
      >编辑</el-button>
    </div>
    <el-dialog title="增加证件" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.region" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="form.dhhm"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="form.dq"></el-input>
        </el-form-item>
        <el-form-item label="期望">
          <el-input v-model="form.qw"></el-input>
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
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  methods: {
    onSubmit() {
      this.dialogVisible = false;
      console.log("submit!");
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