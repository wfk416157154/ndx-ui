<template>
  <div class="semester-view">
    <div class="wrap-left-tar">
      <ul>
        <li
          v-for="(item,index) in MonthList.xueqiDict"
          :class="[item.flag == '1' ? 'back' : '']"
          :key="index"
          @click="dataWwitching(item)"
        >{{item.dictLabel}}</li>
      </ul>
    </div>
    <div class="wrap-right-item">
      <div class="wrap-ksItem">
        <ul class="ksItem">
          <li style="margin : 10px 0px" v-for="(item,index) in monthitemTemplate" :key="index">
            <h2>{{item.title}}</h2>
            <div
              v-for="(itemson,j) in item.list"
              :key="j"
              style=" display: flex;
          justify-content: space-between;
          align-items: center; margin : 10px 0px;margin-left : 20px"
            >
              <el-divider content-position="left">
                <div v-if="itemson.cjlx == '2'">
                  <el-link type="danger">
                    <span
                      :style="itemson.styles"
                      @click="showUpdatePage(itemson,index)"
                    >{{itemson.jdmc}}</span>
                  </el-link>
                </div>
                <div v-else>
                  <span :style="itemson.styles">{{itemson.jdmc}}</span>
                </div>
              </el-divider>
              <div style="width : 34%">
                <el-link
                  type="primary"
                  v-if="itemson.cjlx == '100'"
                  @click="editSj(itemson,index)"
                >{{itemson.ksrq}} - {{itemson.jzrq}}</el-link>
                <el-link
                  type="success"
                  v-if="itemson.cjlx == '101'"
                  @click="editSj(itemson,index)"
                >{{itemson.ksrq}} - {{itemson.jzrq}}</el-link>
                <el-link
                  type="warning"
                  v-if="itemson.cjlx == '1'"
                  @click="editSj(itemson,index)"
                >{{itemson.ksrq}} - {{itemson.jzrq}}</el-link>
                <el-link
                  type="danger"
                  v-if="itemson.cjlx == '2'"
                  @click="editSj(itemson,index)"
                >{{itemson.ksrq}} - {{itemson.jzrq}}</el-link>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog title="????????????" :visible.sync="dialogFormVisible">
      <el-form :model="sjForm" :rules="rules" ref="sjForm">
        <el-form-item label="????????????" label-width="100px" prop="biangengDate">
          <el-date-picker
            v-model="biangengDate"
            value-format="yyyy-MM-dd"
            @change="onCalcBgts"
            type="date"
            placeholder="????????????"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="????????????" label-width="100px" prop="yshts">
          <el-input v-model="sjForm.yshts" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="????????????" label-width="100px" prop="chooseStartDate">
          <el-date-picker
            v-model="sjForm.chooseStartDate"
            value-format="yyyy-MM-dd"
            type="date"
            disabled
            placeholder="????????????"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="????????????" label-width="100px" prop="chooseEndDate">
          <el-date-picker
            v-model="sjForm.chooseEndDate"
            value-format="yyyy-MM-dd"
            @change="changeTime(sjForm)"
            type="date"
            placeholder="????????????"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="????????????" label-width="100px">
          <el-input v-model="difference" disabled autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">??? ???</el-button>
        <el-button type="primary" v-prevent-re-click @click="editDateSubmit">??? ???</el-button>
      </div>
    </el-dialog>

    <el-dialog title="??????????????????" :visible.sync="dialogCourseFormVisible">
      <el-form :model="courseForm" :rules="rules" ref="refCourseForm">
        <el-form-item label="????????????" label-width="100px" prop="chooseStartDate">
          <el-date-picker
            v-model="courseForm.chooseStartDate"
            value-format="yyyy-MM-dd"
            type="date"
            disabled
            placeholder="????????????"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="????????????" label-width="100px" prop="chooseEndDate">
          <el-date-picker
            v-model="courseForm.chooseEndDate"
            value-format="yyyy-MM-dd"
            @change="changeTime(courseForm)"
            type="date"
            placeholder="????????????"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCourseFormVisible = false">??? ???</el-button>
        <el-button type="primary" v-prevent-re-click @click="editCourseDateSubmit">??? ???</el-button>
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
      MonthList: {},
      monthitemTemplate: [],
      sjForm: {
        chooseEndDate: null,
        chooseStartDate: null,
        yshts: null
      },
      dialogFormVisible: false,
      difference: null,
      rules: {
        yshts: [{ required: true, message: "?????????????????????", trigger: "blur" }],
        chooseStartDate: [
          { required: true, message: "?????????????????????", trigger: "blur" }
        ],
        chooseEndDate: [
          { required: true, message: "?????????????????????", trigger: "blur" }
        ]
      },
      // ????????????????????????
      dialogCourseFormVisible: false,
      courseForm: {
        jdid: null,
        chooseEndDate: null,
        chooseStartDate: null
      },
      // ????????????
      biangengDate: null,
      chooseTerm: null
    };
  },
  props: ["item"],
  methods: {
    onCalcBgts(date) {
      let startTime = new Date(this.sjForm.chooseStartDate).getTime();
      let endTime = new Date(date).getTime();
      if (endTime - startTime < 1000 * 60 * 60 * 24) {
        this.msgError("?????? : ??????????????????????????????????????????");
        this.biangengDate = null;
      } else {
        this.sjForm.yshts = (endTime - startTime) / (1000 * 60 * 60 * 24) + 1;
      }
    },
    showUpdatePage(item, index) {
      this.dialogCourseFormVisible = true;
      this.courseForm.jdid = item.id;
      this.courseForm.chooseStartDate = item.ksrq;
      this.courseForm.chooseEndDate = item.jzrq;
      this.chooseTerm = this.monthitemTemplate[index].dictValue;
    },
    toGrade() {
      this.itemForm = JSON.parse(JSON.stringify(this.item));
      if (this.itemForm && typeof this.itemForm.zfx == "object") {
        this.itemForm.zfx = this.itemForm.zfx.join(",");
      }
      if (this.itemForm.rybjid) {
        this.itemForm.chooseTerm = this.chooseTerm;
        queryGenerateTeachingPlanData(this.itemForm).then(res => {
          if (res.code == 200 && res.data.allData.length > 0) {
            this.MonthList = res.data.monthMap;
            this.MonthList.xueqiDict.forEach(value => {
              if (value.flag == "1") {
                this.dataWwitching(value);
              }
            });
          } else {
            this.MonthList = [];
          }
        });
      }
    },
    dataWwitching(row) {
      let dic = row.dictValue;
      let monthitem = this.MonthList.monthList;
      this.MonthList.xueqiDict.forEach(value => {
        if (value.dictValue === row.dictValue) {
          value.flag = "1";
        } else {
          value.flag = "0";
        }
      });
      this.$nextTick(() => {
        this.monthitemTemplate = [];
        let count = [];
        for (const key in monthitem) {
          if (monthitem.hasOwnProperty(key)) {
            if (row.remark === key) {
              count.push(key);
              for (const name in monthitem[key]) {
                if (monthitem[key].hasOwnProperty(name)) {
                  monthitem[key][name].forEach(value => {
                    value.cjlx = Number(value.cjlx);
                    switch (value.cjlx) {
                      case 100:
                        value.styles = {
                          "font-size": "22px",
                          color: "#409EFF"
                        };
                        break;
                      case 101:
                        value.styles = {
                          "font-size": "20px",
                          color: "#67C23A"
                        };
                        break;
                      case 1:
                        value.styles = {
                          "font-size": "18px",
                          color: "#E6A23C"
                        };
                        break;
                      case 2:
                        value.styles = {
                          "font-size": "16px",
                          color: "#F56C6C"
                        };
                        break;
                      case 3:
                        value.styles = {
                          "font-size": "14px",
                          color: "#909399"
                        };
                        break;
                    }
                  });
                  this.monthitemTemplate.push({
                    dictValue: dic,
                    title: `${name}`,
                    list: monthitem[key][name]
                  });
                }
              }
            }
          }
        }
        if (count.length == 0) {
          this.msgError("?????? : ??????????????????");
        }
      });
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
    editSj(row, index) {
      this.biangengDate = null;
      this.sjForm.chooseStartDate = row.ksrq;
      this.sjForm.chooseEndDate = row.jzrq;
      this.sjForm.yshts = null;
      this.chooseTerm = this.monthitemTemplate[index].dictValue;
      this.changeTime(this.sjForm);
      this.dialogFormVisible = true;
    },
    changeTime(times) {
      let endTime = new Date(times.chooseEndDate).getTime();
      let startTime = new Date(times.chooseStartDate).getTime();
      if (endTime - startTime < 1000 * 60 * 60 * 24) {
        this.msgError("?????? : ??????????????????????????????????????????");
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
              this.msgSuccess("?????? : ??????????????????");
              this.dialogFormVisible = false;
              this.toGrade();
            } else {
              this.msgError("?????? : ??????????????????,???????????????");
            }
          });
        } else {
          this.msgError("?????? : ?????????????????????");
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
          this.msgError("?????? : ?????????????????????");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.semester-view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .wrap-left-tar {
    width: 30%;
    ul {
      width: 100%;
      list-style: none;
      li {
        width: 80%;
        height: 40px;
        border: 2px solid #ccc;
        margin: 5px 0px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }
      li:hover {
        background: #409eff;
        color: #fff;
      }
      .back {
        background: #409eff;
        color: #fff;
      }
    }
  }
  .wrap-right-item {
    width: 70%;
    .wrap-ksItem {
      width: 100%;
      .ksItem {
        width: 100%;
        list-style: none;
        li {
          border: 3px solid #ccc;
          padding: 20px;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>

