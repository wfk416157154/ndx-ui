<template>
  <div class="trainIndex">
    <el-form :model="queryParams" ref="trainIndex" :inline="true" label-width="68px">
      <el-form-item label="参训人" prop="xxmc">
        <el-input
          v-model="queryParams.cxr"
          placeholder="请输入学校名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label-width="100px" label="状态" prop="xqfzr">
        <el-select v-model="queryParams.remark">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

      <!-- 培训主页table -->
    <el-table :data="trainIndexList">
      <el-table-column label="参训人" align="center" prop="cxr" />
      <el-table-column label="培训时间" align="center" prop="pxsj" />
      <el-table-column label="实习班级" align="center" prop="sxbj" />
      <el-table-column label="上岗班级" align="center" prop="sgbj" />
      <el-table-column label="培训目标" align="center" prop="pxmb" />
      <el-table-column label="培训要求" align="center" prop="pxyq" />
      <el-table-column label="状态" align="center" prop="zt" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        width="200px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="getTrainIndex(scope.row)"
            v-hasPermi="['basic:school:edit']"
          >查看培训内容</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="trainIndexUpdate(scope.row)"
            v-hasPermi="['basic:school:edit']"
          >修改</el-button>>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cxr: null,
        remark: null
      },
      form: {},
      // 初试结果
      resultList: [],
      // 主页数据列表
      trainIndexList : [{
         cxr : "张小刚",
         pxsj : "2021/6/4",
         sxbj : "日语一班",
         sgbj : "日语1091",
         pxmb : "熟悉课程",
         pxyq : "全部需要合格",
         zt : "合格",
         remark : "老师合格",
      }]
    };
  },
  created() {},
  methods: {
    // 提交按钮
    onSubmit() {
      this.$refs["form"].validate(valid => {
        this.dialogVisible = false;
        if (valid) {
          if (this.form.id != null) {
            // 人事主管复试完成
            if (1 == this.form.zt) {
              this.form.mszt = 5; // 对应字典的 复试通过
            } else {
              this.form.mszt = 9; // 对应字典的 面试不通过
            }
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
    // 查询参训人
    handleQuery() {},
    // 查看培训内容
    getTrainIndex(){

    },
    // 编辑
    trainIndexUpdate(){

    }
  }
};
</script>

<style lang="scss" scoped>
.trainIndex {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
}
</style>