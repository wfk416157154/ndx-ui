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
                >提交课表</el-button>
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
                        <tr v-for="(item,index) in classCourseList" :key="index">
                          <td>
                            <div
                              style="width : 100%; height : 60px; line-height : 60px;"
                              @click="dataPicker(index)"
                            >{{item.kssj}} - {{item.jssj}}</div>
                          </td>
                          <td>
                            <div
                              style="width : 100%; height : 100%"
                              @click="textSwitch(item,'kcType' + index,'kcType',index)"
                            >
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                                v-if="item['kcType' + index]"
                              >{{item.kcType}}</div>
                              <el-select
                                :class="[item.kcType == 1 ? 'yesClass' : '']"
                                :ref="'kcType' + index"
                                @change="blurForm(item,'kcType' + index,'kcType')"
                                v-if="!item['kcType' + index] "
                                id="TextArea1"
                                class="inputStyle"
                                v-model="form.kcType"
                                style="width : 100%; height :100%"
                              >
                                <el-option
                                  v-for="item in kcType"
                                  :key="item.dictValue"
                                  :label="item.dictLabel"
                                  :value="item.dictValue"
                                ></el-option>
                              </el-select>
                            </div>
                          </td>
                          <td :class="[item.monday == 1 ? 'yesClass' : 'noClass']">
                            <div
                              style="width : 100%; height : 100%"
                              @click="textSwitch(item,'monday' + index,'monday',index)"
                            >
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                                v-if="item['monday' + index]"
                              >{{item.monday}}</div>
                              <el-select
                                :class="[item.monday == 1 ? 'yesClass' : '']"
                                :ref="'monday' + index"
                                @blur="blurForm(item,'monday' + index,'monday')"
                                v-if="!item['monday' + index] "
                                id="TextArea1"
                                class="inputStyle"
                                v-model="form.monday"
                                style="width : 100%; height :100%"
                              >
                                <el-option
                                  v-for="item in isCourse"
                                  :key="item.dictValue"
                                  :label="item.dictLabel"
                                  :value="item.dictValue"
                                ></el-option>
                              </el-select>
                            </div>
                          </td>
                          <td :class="[item.tuesday == 1 ? 'yesClass' : 'noClass']">
                            <div
                              style="width : 100%; height : 100%"
                              @click="textSwitch(item,'tuesday' + index,'tuesday',index)"
                            >
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                                v-if="item['tuesday' + index]"
                              >{{item.tuesday}}</div>
                              <el-select
                                :class="[item.tuesday == 1 ? 'yesClass' : '']"
                                :ref="'tuesday' + index"
                                @blur="blurForm(item,'tuesday' + index,'tuesday')"
                                v-if="!item['tuesday' + index] "
                                id="TextArea1"
                                class="inputStyle"
                                v-model="form.tuesday"
                                style="width : 100%; height :100%"
                              >
                                <el-option
                                  v-for="item in isCourse"
                                  :key="item.dictValue"
                                  :label="item.dictLabel"
                                  :value="item.dictValue"
                                ></el-option>
                              </el-select>
                            </div>
                          </td>
                          <td :class="[item.wednesday == 1 ? 'yesClass' : 'noClass']">
                            <div
                              style="width : 100%; height : 100%"
                              @click="textSwitch(item,'wednesday' + index,'wednesday',index)"
                            >
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                                v-if="item['wednesday' + index]"
                              >{{item.wednesday}}</div>
                              <el-select
                                :class="[item.wednesday == 1 ? 'yesClass' : '']"
                                :ref="'wednesday' + index"
                                @blur="blurForm(item,'wednesday' + index,'wednesday')"
                                v-if="!item['wednesday' + index] "
                                id="TextArea1"
                                class="inputStyle"
                                v-model="form.wednesday"
                                style="width : 100%; height :100%"
                              >
                                <el-option
                                  v-for="item in isCourse"
                                  :key="item.dictValue"
                                  :label="item.dictLabel"
                                  :value="item.dictValue"
                                ></el-option>
                              </el-select>
                            </div>
                          </td>
                          <td :class="[item.thursday == 1 ? 'yesClass' : 'noClass']">
                            <div
                              style="width : 100%; height : 100%"
                              @click="textSwitch(item,'thursday' + index,'thursday',index)"
                            >
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                                v-if="item['thursday' + index]"
                              >{{item.thursday}}</div>
                              <el-select
                                :class="[item.thursday == 1 ? 'yesClass' : '']"
                                :ref="'thursday' + index"
                                @blur="blurForm(item,'thursday' + index,'thursday')"
                                v-if="!item['thursday' + index] "
                                id="TextArea1"
                                class="inputStyle"
                                v-model="form.thursday"
                                style="width : 100%; height :100%"
                              >
                                <el-option
                                  v-for="item in isCourse"
                                  :key="item.dictValue"
                                  :label="item.dictLabel"
                                  :value="item.dictValue"
                                ></el-option>
                              </el-select>
                            </div>
                          </td>
                          <td :class="[item.friday == 1 ? 'yesClass' : 'noClass']">
                            <div
                              style="width : 100%; height : 100%"
                              @click="textSwitch(item,'friday' + index,'friday',index)"
                            >
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                                v-if="item['friday' + index]"
                              >{{item.friday}}</div>
                              <el-select
                                :class="[item.friday == 1 ? 'yesClass' : '']"
                                :ref="'friday' + index"
                                @blur="blurForm(item,'friday' + index,'friday')"
                                v-if="!item['friday' + index] "
                                id="TextArea1"
                                class="inputStyle"
                                v-model="form.friday"
                                style="width : 100%; height :100%"
                              >
                                <el-option
                                  v-for="item in isCourse"
                                  :key="item.dictValue"
                                  :label="item.dictLabel"
                                  :value="item.dictValue"
                                ></el-option>
                              </el-select>
                            </div>
                          </td>
                          <td :class="[item.saturday == 1 ? 'yesClass' : 'noClass']">
                            <div
                              style="width : 100%; height : 100%"
                              @click="textSwitch(item,'saturday' + index,'saturday',index)"
                            >
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                                v-if="item['saturday' + index]"
                              >{{item.saturday}}</div>
                              <el-select
                                :class="[item.saturday == 1 ? 'yesClass' : '']"
                                :ref="'saturday' + index"
                                @blur="blurForm(item,'saturday' + index,'saturday')"
                                v-if="!item['saturday' + index] "
                                id="TextArea1"
                                class="inputStyle"
                                v-model="form.saturday"
                                style="width : 100%; height :100%"
                              >
                                <el-option
                                  v-for="item in isCourse"
                                  :key="item.dictValue"
                                  :label="item.dictLabel"
                                  :value="item.dictValue"
                                ></el-option>
                              </el-select>
                            </div>
                          </td>
                          <td :class="[item.sunday == 1 ? 'yesClass' : 'noClass']">
                            <div
                              style="width : 100%; height : 100%"
                              @click="textSwitch(item,'sunday' + index,'sunday',index)"
                            >
                              <div
                                style="width : 100%; height : 60px; line-height : 60px"
                                v-if="item['sunday' + index]"
                              >{{item.sunday}}</div>
                              <el-select
                                :class="[item.sunday == 1 ? 'yesClass' : '']"
                                :ref="'sunday' + index"
                                @blur="blurForm(item,'sunday' + index,'sunday')"
                                v-if="!item['sunday' + index] "
                                id="TextArea1"
                                class="inputStyle"
                                v-model="form.sunday"
                                style="width : 100%; height :100%"
                              >
                                <el-option
                                  v-for="item in isCourse"
                                  :key="item.dictValue"
                                  :label="item.dictLabel"
                                  :value="item.dictValue"
                                ></el-option>
                              </el-select>
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

    <el-dialog title="上课时间" :close-on-click-modal="false" :visible.sync="open" width="40%">
      <el-date-picker
        v-model="getDate"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00']"
        value-format=" yyyy-MM-dd HH:mm"
        format="yyyy-MM-dd HH:mm"
      ></el-date-picker>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getPicker">确 定</el-button>
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
      // console.log(this.isCourse)
    });
    this.getDicts("kc_type").then(response => {
      this.kcType = response.data;
      // console.log(this.isCourse)
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
    // 提交课表
    submitTimetable() {
      updateClassCourse(this.form[this.rowNum]).then(res => {
        if (res.code == 200) {
          this.switchingClasses(this.form[this.rowNum].bjid);
          this.rowNum = null;
        }
      });
    },
    // 打开时间选择遮罩
    dataPicker(index) {
      if (this.rowNum == null || this.rowNum == index) {
        this.rowNum = index;
        this.open = true;
      } else {
        this.textSwitch();
      }
    },
    // 时间处理
    getPicker() {
      this.open = false;
      let arr = [];
      if (this.getDate == null) {
        this.rowNum = null;
        return;
      }
      this.getDate.forEach(value => {
        let index = value.lastIndexOf(" ");
        value = value.substring(index + 1, value.length);
        arr.push(value);
      });
      this.getDate = null;
      this.form[this.rowNum].sj = arr;
      this.classCourseList[this.rowNum].kssj = this.form[this.rowNum].sj[0];
      this.classCourseList[this.rowNum].jssj = this.form[this.rowNum].sj[1];
    },
    // 课表编辑标签自动聚集
    textSwitch(value, ref, name, index) {
      if (this.rowNum == null) {
        this.rowNum = index;
      } else if (this.rowNum != index) {
        this.$notify({
          title: "警告",
          message: `请先提交第${this.rowNum + 1}行编辑数据`,
          type: "warning"
        });
        return;
      }
      // console.log(this.form[name])
      // console.log(value[name])
      // this.form[name] = value[name];
      value[ref] = false;
      // 自动聚焦
      this.$nextTick(() => {
        this.$refs[ref][0].focus();
      });
    },
    // 切换班级课表
    switchingClasses(bjid) {
      this.classCourseList = [];
      // 获取班级课表
      listClassCourse({ bjid: bjid }).then(res => {
        if (res.rows.length > 0) {
          res.rows.map((value, index) => {
            value["kcType" + index] = true;
            value["monday" + index] = true;
            value["tuesday" + index] = true;
            value["wednesday" + index] = true;
            value["thursday" + index] = true;
            value["friday" + index] = true;
            value["saturday" + index] = true;
            value["sunday" + index] = true;
            value.bjid = bjid;
            this.classCourseList.push(value);
          });
          this.form = res.rows;
        }
      });
    },
    // 选择编辑的行
    controlForm(num) {
      if (this.rowNum == null) {
        this.rowNum = num;
      } else if (this.rowNum != num) {
        this.$notify({
          title: "警告",
          message: `请先提交第${this.rowNum + 1}行编辑数据`,
          type: "warning"
        });
      }
    },
    // 数据编辑后回显
    blurForm(value, ref, name) {
      value[name] = this.form[name];
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap-info {
  position: relative;
  //  box-shadow: 2px 2px 10px 2px rgba(90, 19, 19, 0.2);
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
            // background-color: rgb(9, 94, 89);
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
