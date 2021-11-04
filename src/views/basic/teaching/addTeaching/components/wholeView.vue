<template>
  <div class="Whole-view">
    <div class="Whole-right-item">
      <div class="wrap-Whole" v-for="(item,index) in WholeList.children" :key="index">
        <ul class="ksItem">
          <li>
            <div style="display :flex; align-items : center">
              <i class="el-icon-d-arrow-left"></i>
              <h3 style="margin :5px 5px">{{ WholeList.name}} {{item.name}}</h3>
              <i class="el-icon-d-arrow-right"></i>
            </div>
            <br />
            <div v-for="(list,index) in item.children" :key="index">
              <h4
                style="margin :5px 0px ;color : #67C23A; margin-left : 20px"
              >{{++index}} ) {{list.name}}</h4>
              <div
                style="display: flex;justify-content: space-between;align-items: center"
                v-for="(items,j) in list.children"
                :key="j"
              >
                <div style="width : 98%;">
                  <div
                    style=" display: flex;justify-content: space-between;align-items: center;margin-left : 60px"
                  >
                    <div>
                      <el-link type="warning">
                        <h4
                          style="margin : 10px 0px ;color : #E6A23C;font-size:16px"
                          @click="showUpdatePage(items)"
                        >{{items.name}}</h4>
                      </el-link>
                    </div>
                    <div>
                      <el-link
                        type="primary"
                        @click="editSj(items)"
                      >{{formatTime(items.ksrq)}} - {{formatTime(items.jzrq)}}</el-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog title="编辑时间" :visible.sync="dialogFormVisible">
      <el-form :model="sjForm" :rules="rules" ref="sjForm">
        <el-form-item label="变更天数" label-width="100px" prop="yshts">
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
            @change="changeTime(sjForm)"
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
    <el-dialog title="编辑时间" :visible.sync="dialogCourseFormVisible">
      <el-form :model="courseForm" :rules="rules" ref="refCourseForm">
        <el-form-item label="开始日期" label-width="100px" prop="chooseStartDate">
          <el-date-picker
            v-model="courseForm.chooseStartDate"
            value-format="yyyy-MM-dd"
            type="date"
            disabled
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" label-width="100px" prop="chooseEndDate">
          <el-date-picker
            v-model="courseForm.chooseEndDate"
            value-format="yyyy-MM-dd"
            @change="changeTime(courseForm)"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCourseFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCourseDateSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryGenerateTeachingPlanData,
  adjustTeachingPlan,
  aloneUpdateTeachingPlan
} from "@/api/teaching/generate";
export default {
  data() {
    return {
      WholeList: {},
      itemForm: {},
      sjForm: {
        chooseEndDate: null,
        chooseStartDate: null,
        yshts: null
      },
      dialogFormVisible: false,
      difference: null,
      rules: {
        yshts: [
          { required: true, message: "请输入变更天数", trigger: "blur" }
        ],
        chooseStartDate: [
          { required: true, message: "请选择开始日期", trigger: "blur" }
        ],
        chooseEndDate: [
          { required: true, message: "请选择结束日期", trigger: "blur" }
        ]
      },
      dialogCourseFormVisible: false,
      courseForm: {
        jdid: null,
        chooseEndDate: null,
        chooseStartDate: null
      }
    };
  },
  props: ["item"],
  methods: {
    showUpdatePage(item) {
      this.dialogCourseFormVisible = true;
      this.courseForm.jdid = item.id;
      this.courseForm.chooseStartDate = item.ksrq;
      this.courseForm.chooseEndDate = item.jzrq;
    },
    toGrade() {
      this.itemForm = JSON.parse(JSON.stringify(this.item));
      if (this.itemForm && typeof this.itemForm.zfx == "object") {
        this.itemForm.zfx = this.itemForm.zfx.join(",");
      }
      if (this.itemForm.rybjid) {
        queryGenerateTeachingPlanData(this.itemForm).then(res => {
          if (res.code == 200 && res.data.allData.length > 0) {
            this.WholeList = res.data.allData[0];
          } else {
            this.WholeList = [];
          }
        });
      }
    },
    formatTime(time) {
      time = new Date(time);
      let F = time.getFullYear().toString();
      let M = String(time.getMonth() + 1);
      let D = time.getDate().toString();
      M = M.length == 1 ? `0${M}` : M;
      D = D.length == 1 ? `0${D}` : D;
      return F + "-" + M + "-" + D;
    },
    editSj(row) {
      this.sjForm.chooseStartDate = row.ksrq;
      this.sjForm.chooseEndDate = row.jzrq;
      this.sjForm.yshts = null;
      this.changeTime(this.sjForm);
      this.dialogFormVisible = true;
    },
    changeTime(times) {
      let endTime = new Date(times.chooseEndDate).getTime();
      let startTime = new Date(times.chooseStartDate).getTime();
      if (endTime - startTime < 1000 * 60 * 60 * 24) {
        this.msgError("提示 : 结束时间不能小于等于开始时间");
        times.chooseEndDate = null;
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
    },
    editCourseDateSubmit() {
      this.$refs["refCourseForm"].validate(valid => {
        if (valid) {
          let finalForm = Object.assign(this.itemForm, this.courseForm);
          aloneUpdateTeachingPlan(finalForm).then(res => {
            if (res.code == 200) {
              this.msgSuccess(res.msg);
              this.dialogCourseFormVisible = false;
              this.toGrade();
            } else {
              this.msgError(res.msg);
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

<style lang="scss" scoped>
.Whole-view {
  width: 100%;
  height: 100%;
  .Whole-right-item {
    width: 100%;
    .wrap-Whole {
      width: 100%;
      .ksItem {
        width: 100%;
        list-style: none;
        margin: 0;
        padding: 0;
        li {
          // display: flex;
          // justify-content: space-between;
          // align-items: center;
        }
      }
    }
  }
}
</style>

