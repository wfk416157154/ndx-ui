<template>
  <div class="semester-view">
    <div class="wrap-right-item">
      <el-table border :data="xueqiMap" :span-method="objectSpanMethod" style="width: 100%">
        <el-table-column prop="xqmc" label="学期名称"></el-table-column>
        <el-table-column prop="ssyf" label="月份"></el-table-column>
        <el-table-column prop="yxz" label="有效周"></el-table-column>
        <el-table-column prop="jincheng" label="进程"></el-table-column>
        <el-table-column prop="kclx" label="课程类型" :formatter="getKclx"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="时间" width="200px">
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="editSj(scope.row)"
            >{{scope.row.ksrq}} - {{scope.row.jzrq}}</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑时间" :visible.sync="dialogFormVisible">
      <el-form :model="sjForm" :rules="rules" ref="sjForm">
        <el-form-item label="压缩后天数" label-width="100px" prop="yshts">
          <el-input v-model="sjForm.yshts" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始日期" label-width="100px" prop="chooseStartDate">
          <el-date-picker
            v-model="sjForm.chooseStartDate"
            value-format="yyyy-MM-dd"
            type="date"
            disabled
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" label-width="100px" prop="chooseEndDate">
          <el-date-picker
            v-model="sjForm.chooseEndDate"
            value-format="yyyy-MM-dd"
            @change="changeTime"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="相差天数" label-width="100px">
          <el-input v-model="difference" disabled autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDateSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryGenerateTeachingPlanData,
  adjustTeachingPlan
} from "@/api/teaching/generate";
export default {
  data() {
    return {
      itemForm: {},
      sjForm: {
        chooseEndDate: null,
        chooseStartDate: null,
        yshts: null
      },
      xueqiMap: [],
      teachingCourseType: [],
      typeNameArr: [],
      typeNamePos: 0,
      dialogFormVisible: false,
      difference: null,
      rules: {
        yshts: [
          { required: true, message: "请输入压缩后天数", trigger: "blur" }
        ],
        chooseStartDate: [
          { required: true, message: "请选择开始日期", trigger: "blur" }
        ],
        chooseEndDate: [
          { required: true, message: "请选择结束日期", trigger: "blur" }
        ]
      }
    };
  },
  props: ["item"],
  created() {
    this.getDicts("teachingCourseType").then(response => {
      this.teachingCourseType = response.data;
    });
  },
  methods: {
    toGrade() {
      this.xueqiMap = [];
      this.itemForm = JSON.parse(JSON.stringify(this.item));
      if (this.itemForm && typeof this.itemForm.zfx == "object") {
        this.itemForm.zfx = this.itemForm.zfx.join(",");
      }
      if (this.itemForm.rybjid) {
        queryGenerateTeachingPlanData(this.itemForm).then(res => {
          if (res.code == 200) {
            this.xueqiMap = res.data.xueqiMap;
            this.merageData();
          }
        });
      }
    },
    getKclx(row, column) {
      return this.selectDictLabel(this.teachingCourseType, row.kclx);
    },
    merageData() {
      this.typeNameArr = [];
      this.typeNamePos = 0;
      for (let i = 0; i < this.xueqiMap.length; i += 1) {
        if (i === 0) {
          this.typeNameArr.push(1);
          this.typeNamePos = 0;
        } else {
          if (this.xueqiMap[i].xqmc === this.xueqiMap[i - 1].xqmc) {
            this.typeNameArr[this.typeNamePos] += 1;
            this.typeNameArr.push(0);
          } else {
            this.typeNameArr.push(1);
            this.typeNamePos = i;
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const row1 = this.typeNameArr[rowIndex];
        const col1 = row1 > 0 ? 1 : 0;
        return {
          rowspan: row1,
          colspan: col1
        };
      }
    },
    editSj(row) {
      this.sjForm.chooseStartDate = row.ksrq;
      this.sjForm.chooseEndDate = row.jzrq;
      this.sjForm.yshts = null;
      this.changeTime();
      this.dialogFormVisible = true;
    },
    changeTime() {
      let endTime = new Date(this.sjForm.chooseEndDate).getTime();
      let startTime = new Date(this.sjForm.chooseStartDate).getTime();
      if (endTime - startTime < 1000 * 60 * 60 * 24) {
        this.msgError("提示 : 结束时间不能小于等于开始时间");
        this.sjForm.chooseEndDate = null;
      } else {
        this.difference = (endTime - startTime) / (1000 * 60 * 60 * 24) + 1;
      }
    },
    editDateSubmit() {
      this.$refs["sjForm"].validate(valid => {
        if (valid) {
          let finalForm = Object.assign(this.itemForm, this.sjForm);
          adjustTeachingPlan(finalForm).then(res => {
            if (res.code == 200) {
              this.msgSuccess("成功 : 数据修改成功");
              this.dialogFormVisible = false;
              this.toGrade();
            } else {
              this.msgError("提示 : 修改数据失败,请重新修改");
            }
          });
        } else {
          this.msgError("提示 : 请填写完整数据");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.semester-view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .wrap-right-item {
    width: 100%;
  }
}
</style>

