<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="年份" prop="nf">
        <el-select v-model="queryParams.nf" placeholder="请选择年份" clearable size="small">
          <el-option
            v-for="dict in yearList"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictLabel"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label-width="80px" label="学期" prop="xq">
        <el-select v-model="queryParams.sfyjszgz" placeholder="请选择学期" clearable size="small">
          <el-option
            v-for="dict in sfyjszgzOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>-->
      <el-form-item label="课表类型" prop="kbType">
        <el-select v-model="queryParams.kbType" placeholder="请选择课表类型" clearable size="small">
          <el-option
            v-for="dict in kbTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card>
          <el-tabs v-model="activeTab" @tab-click="switchingClasses(activeTab)">
            <el-tab-pane
              v-for="(item,index) in listBjclass"
              :key="index"
              :label="item.rybjmc"
              :name="item.id"
            >
              <div class="wrap-info">
                <ul class="list-group list-group-striped">
                  <li style="padding-bottom : 10px; font-size : 14px">
                    日语班级
                    <div class="pull-right">{{item.rybjmc}}</div>
                  </li>
                  <li class="list-group-item">
                    姓名
                    <div class="pull-right">{{item.lsxm}}</div>
                  </li>
                  <li class="list-group-item">
                    校区
                    <div class="pull-right">{{item.xqmc}}</div>
                  </li>
                  <li class="list-group-item">
                    开班时间
                    <div class="pull-right">{{item.kbsj}}</div>
                  </li>
                  <li class="list-group-item">
                    班级人数
                    <div class="pull-right">{{item.bjrs}}</div>
                  </li>
                  <li class="list-group-item">
                    录入时间
                    <div class="pull-right">{{item.kzzd3}}</div>
                  </li>
                </ul>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>课表</span>
          </div>
          <el-tabs v-model="tabsActiveTab">
            <el-tab-pane label="班级课表" name="kb">
              <div>
                <el-button
                  type="primary"
                  icon="el-icon-check"
                  size="mini"
                  @click="submitTimetable"
                >新增课表</el-button>
              </div>
              <div class="class-table">
                <div class="table-wrapper">
                  <div class="tabel-container">
                    <table>
                      <thead>
                        <tr>
                          <th>时间</th>
                          <th>课时</th>
                          <th>周一</th>
                          <th>周二</th>
                          <th>周三</th>
                          <th>周四</th>
                          <th>周五</th>
                          <th>周六</th>
                          <th>周日</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          @click="submitOpen(item)"
                          v-for="(item,index) in classCourseList"
                          :key="index"
                        >
                          <td>
                            <div
                              style="width : 100%; height : 60px; line-height : 60px;"
                            >{{item.kssj}} - {{item.jssj}}</div>
                          </td>
                          <td>
                            <div style="width : 100%; height : 100%">
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                              >{{item.kcType}}</div>
                            </div>
                          </td>
                          <td :class="[item.monday == '有课' ? 'yesClass' : 'noClass']">
                            <div style="width : 100%; height : 100%">
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                              >{{item.monday}}</div>
                            </div>
                          </td>
                          <td :class="[item.tuesday == '有课' ? 'yesClass' : 'noClass']">
                            <div style="width : 100%; height : 100%">
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                              >{{item.tuesday}}</div>
                            </div>
                          </td>
                          <td :class="[item.wednesday == '有课' ? 'yesClass' : 'noClass']">
                            <div style="width : 100%; height : 100%">
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                              >{{item.wednesday}}</div>
                            </div>
                          </td>
                          <td :class="[item.thursday == '有课' ? 'yesClass' : 'noClass']">
                            <div style="width : 100%; height : 100%">
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                              >{{item.thursday}}</div>
                            </div>
                          </td>
                          <td :class="[item.friday == '有课' ? 'yesClass' : 'noClass']">
                            <div style="width : 100%; height : 100%">
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                              >{{item.friday}}</div>
                            </div>
                          </td>
                          <td :class="[item.saturday == '有课' ? 'yesClass' : 'noClass']">
                            <div style="width : 100%; height : 100%">
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                              >{{item.saturday}}</div>
                            </div>
                          </td>
                          <td :class="[item.sunday == '有课' ? 'yesClass' : 'noClass']">
                            <div style="width : 100%; height : 100%">
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                              >{{item.sunday}}</div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="上课时间" prop="sj">
          <el-time-picker
            v-model="startTime"
            :picker-options="{
            selectableRange: '18:30:00 - 20:30:00'
           }"
            value-format=" yyyy-MM-dd HH:mm"
            format="HH:mm"
            placeholder="任意时间点"
          ></el-time-picker>
          <el-time-picker
            @change="getTime"
            v-model="getDate"
            arrow-control
            value-format=" yyyy-MM-dd HH:mm"
            format="HH:mm"
            :picker-options="{
            selectableRange: '18:30:00 - 20:30:00'
           }"
            placeholder="任意时间点"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="课程类型" prop="wednesday">
          <el-select v-model="form.kcType" placeholder="请选择">
            <el-option
              v-for="item in kcType"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周一" prop="monday">
          <el-select v-model="form.monday" placeholder="请选择">
            <el-option
              v-for="item in isCourse"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周二" prop="tuesday">
          <el-select v-model="form.tuesday" placeholder="请选择">
            <el-option
              v-for="item in isCourse"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周三" prop="wednesday">
          <el-select v-model="form.wednesday" placeholder="请选择">
            <el-option
              v-for="item in isCourse"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周四" prop="thursday">
          <el-select v-model="form.thursday" placeholder="请选择">
            <el-option
              v-for="item in isCourse"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周五" prop="friday">
          <el-select v-model="form.friday" placeholder="请选择">
            <el-option
              v-for="item in isCourse"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周六" prop="saturday">
          <el-select v-model="form.saturday" placeholder="请选择">
            <el-option
              v-for="item in isCourse"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周日" prop="sunday">
          <el-select v-model="form.sunday" placeholder="请选择">
            <el-option
              v-for="item in isCourse"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBjclass } from "@/api/basic/bjclass";
import {
  listClassCourse,
  saveList,
  addClassCourse,
  updateClassCourse
} from "@/api/basic/classCourse";
export default {
  data() {
    return {
      startTime: "",
      // 班级id
      activeTab: "",
      // 班级课表选择
      tabsActiveTab: "kb",
      // 遮罩
      open: false,
      // 数据切换
      show: {},
      // 班级信息
      listBjclass: [],
      // 表单参数
      form: {},
      // 班级课程表格数据
      classCourseList: [],
      // 标记编辑的第几行
      rowNum: null,
      // 上课时间
      getDate: null,
      // 提交课表json数据;
      jsonFrom: {},
      // 查询课表
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        kbType: null,
        nf: null,
        xq: null
      },
      // 年份字典
      yearList: [],
      // 课表类型
      kbTypeOptions: [],
      // 是否有课
      isCourse: [],
      // 课程类型
      kcType: []
    };
  },
  created() {
    this.getDicts("year-list").then(response => {
      this.yearList = response.data;
    });
    this.getDicts("kb_type").then(response => {
      this.kbTypeOptions = response.data;
    });
    this.getDicts("is_course").then(response => {
      this.isCourse = response.data;
    });
    this.getDicts("kc_type").then(response => {
      this.kcType = response.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 班级列表基础信息
    getList() {
      listBjclass({ lsxm: this.$store.state.user.nickName }).then(res => {
        this.listBjclass = res.rows;
        this.activeTab = this.listBjclass[0].id;
        this.switchingClasses(this.activeTab);
      });
    },
    //查询课表
    handleQuery() {},
    //新增
    submitTimetable() {
      this.reset();
      this.open = true;
    },
    // 时间处理
    getTime(date) {
      let arr = [this.startTime, date];
      this.form.sj = [];
      arr.forEach(value => {
        let index = value.lastIndexOf(" ");
        value = value.substring(index + 1, value.length);
        this.form.sj.push(value);
      });
    },
    // 切换班级课表
    switchingClasses(bjid) {
      this.classCourseList = [];
      // 获取班级课表
      listClassCourse({ bjid: bjid }).then(res => {
        if (res.rows.length > 0) {
          res.rows.map((value, index) => {
            for (let i = 0; i < this.kcType.length; i++) {
              if (this.kcType[i].dictValue == value.kcType) {
                value.kcType = this.kcType[i].dictLabel;
              }
            }
            value.monday = this.formatterDict(value.monday);
            value.tuesday = this.formatterDict(value.tuesday);
            value.wednesday = this.formatterDict(value.wednesday);
            value.thursday = this.formatterDict(value.thursday);
            value.friday = this.formatterDict(value.friday);
            value.saturday = this.formatterDict(value.saturday);
            value.sunday = this.formatterDict(value.sunday);
            this.classCourseList.push(value);
          });
        }
      });
    },
    formatterDict(obj) {
      //console.log("formatterDict", obj);

      for (let i = 0; i < this.isCourse.length; i++) {
        if (this.isCourse[i].dictValue == obj) {
          return (obj = this.isCourse[i].dictLabel);
        }
      }
    },
    submitOpen(row) {
      this.form = row;
      this.open = true;
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        bjid: null,
        kbType: null,
        kssj: null,
        jssj: null,
        kcType: null,
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
        remark: null,
        userId: null,
        userName: null,
        createTime: null,
        updateTime: null,
        kzzd1: null,
        kzzd2: null,
        kzzd3: null,
        kzzd4: null,
        kzzd5: null
      };
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.bjid = this.activeTab;
          if (this.form.id != null) {
            updateClassCourse(this.form).then(response => {
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success"
              });
              this.open = false;
              this.switchingClasses(this.activeTab);
            });
          } else {
            addClassCourse(this.form).then(response => {
              this.$notify({
                title: "成功",
                message: "新增成功",
                type: "success"
              });
              this.open = false;
              this.switchingClasses(this.activeTab);
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap-info {
  position: relative;
  .text-center {
    width: 150px;
    height: 150px;
    text-align: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.class-table {
  .table-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .tabel-container {
    margin: 7px;
    border: 15px solid rgb(102, 84, 87);
    border-radius: 15px;
    table {
      table-layout: fixed;
      width: 100%;

      thead {
        background-color: rgb(9, 94, 89);
        th {
          color: #fff;
          line-height: 17px;
          font-weight: normal;
        }
      }
      tbody {
        width: 100%;
        background-color: rgb(9, 94, 89);
        .yesClass {
          background-color: rgba(19, 206, 102, 0.8);
        }
        .noClass {
          background-color: rgb(9, 94, 89);
        }
        td {
          width: 100%;
          height: 100%;
          color: #fff;
          line-height: 12px;
          cursor: pointer;
          .inputStyle {
            width: 100%;
            height: auto;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
            border-style: none;
            outline: none;
            text-align: center;
            color: #fff;
            background-color: rgba(19, 206, 102, 0.8);
          }
        }
      }
      th,
      td {
        width: 100%;
        height: auto;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        padding: 12px 2px;
        box-sizing: border-box;
        font-size: 12px;
        text-align: center;
      }

      tr td:first-child {
        color: #fff;
        .period {
          font-size: 8px;
        }
      }
    }
  }
}
</style>
