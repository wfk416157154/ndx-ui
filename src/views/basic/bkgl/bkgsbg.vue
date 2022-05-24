<template>
  <div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
      :rules="rules"
      style="margin-top: 20px"
    >
      <el-form-item label="老师姓名" label-width="80px" prop="newLsid">
        <el-select
          v-model="queryParams.oldLsid"
          filterable
          placeholder="请选择老师姓名"
        >
          <el-option
            v-for="item in teacherList"
            :key="item.id"
            :label="item.lsxm"
            :value="item.id"
          ></el-option>
        </el-select>
        <span style="margin: 0px 20px">
          <i class="el-icon-right"></i>
        </span>
        <el-select
          v-model="queryParams.newLsid"
          filterable
          placeholder="请选择老师姓名"
        >
          <el-option
            v-for="item in teacherList"
            :key="item.id"
            :label="item.lsxm"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button
          style="margin-left: 20px"
          type="primary"
          icon="el-icon-s-custom"
          @click="replaceTeacher"
          >确定</el-button
        >
      </el-form-item>
      <el-form-item label="日语班" label-width="80px" prop="newBjid">
        <el-select
          v-model="queryParams.oldBjid"
          filterable
          placeholder="请选择日语班级"
        >
          <el-option
            v-for="item in bjclassList"
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
        <span style="margin: 0px 20px">
          <i class="el-icon-right"></i>
        </span>
        <el-select
          v-model="queryParams.newBjid"
          filterable
          placeholder="请选择日语班级"
        >
          <el-option
            v-for="item in bjclassList"
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button
          style="margin-left: 20px"
          type="primary"
          icon="el-icon-school"
          @click="replaceClass"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { listBjclass } from "@/api/basic/bjclass";
import { listTeacher } from "@/api/basic/teacher";
import { affiliationUpdate } from "@/api/basic/bkgl";
export default {
  data() {
    return {
      queryParams: {},
      // 班级选择
      bjclassList: [],
      //老师选择
      teacherList: [],
      value: "",
      // 表单校验
      rules: {
        newBjid: [
          { required: true, message: "请选择新班级", trigger: "change" },
        ],
        newLsid: [
          { required: true, message: "请选择新老师", trigger: "change" },
        ],
      },
    };
  },
  created() {
    //查询老师
    listTeacher().then((response) => {
      this.teacherList = response.rows;
    });
    //查询班级
    listBjclass().then((response) => {
      this.bjclassList = response.rows;
    });
  },
  methods: {
    //更换老师
    replaceTeacher() {
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          affiliationUpdate(this.queryParams).then((response) => {});
        }
      });
    },
    //更换班级
    replaceClass() {
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          affiliationUpdate(this.queryParams).then((response) => {});
        } else {
        }
      });
    },
  },
};
</script>
    
   
<style lang="scss">
.el-form--inline .el-form-item {
  display: block;
}

.el-form-item {
  margin-left: 40px;
}
</style>