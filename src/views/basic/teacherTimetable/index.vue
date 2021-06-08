<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="年份" prop="nf">
        <el-select v-model="queryParams.nf" placeholder="请选择年份" clearable size="small">
          <el-option
            v-for="dict in xbOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label-width="80px" label="学期" prop="xq">
        <el-select v-model="queryParams.sfyjszgz" placeholder="请选择学期" clearable size="small">
          <el-option
            v-for="dict in sfyjszgzOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label-width="80px" label="月份" prop="yf">
        <el-select v-model="queryParams.yf" placeholder="请选择月份" clearable size="small">
          <el-option
            v-for="dict in sfyjszgzOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label-width="80px" label="周" prop="z">
        <el-select v-model="queryParams.z" placeholder="请选择" clearable size="small">
          <el-option
            v-for="dict in sfyjszgzOptions"
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
        <el-tabs v-model="activeTab">
          <el-tab-pane v-for="(item,index) in listBjclass" :key="index" :label="item.rybjmc" name="yb">
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
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>课表</span>
          </div>
          <div>
            <el-button type="primary" icon="el-icon-check" size="mini" @click="handleQuery">提交课表</el-button>
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
                    <tr>
                      <td>
                        <div
                          style="width : 100%; height : 100%"
                          @click="dataPicker"
                        >{{timetableList.date[0]}} - {{timetableList.date[1]}}</div>
                      </td>
                      <td>
                        <div style="width : 100%; height : 100%" @click="textSwitch('show1')">
                          <div v-if="show1">{{timetableList.text}}</div>
                          <textarea
                            ref="show1"
                            @blur="show1 = true"
                            v-if="!show1"
                            id="TextArea1"
                            class="inputStyle"
                            v-model="timetableList.text"
                            style="width : 100%"
                            rows="2"
                          />
                        </div>
                      </td>
                      <td>
                        <div style="width : 100%; height : 100%" @click="textSwitch('show2')">
                          <div v-if="show2">{{timetableList.text}}</div>
                          <textarea
                            ref="show2"
                            @blur="show2 = true"
                            v-if="!show2"
                            id="TextArea1"
                            class="inputStyle"
                            v-model="timetableList.text"
                            style="width : 100%; height :100%"
                            rows="2"
                          />
                        </div>
                      </td>
                      <td>
                        <div style="width : 100%; height : 100%" @click="textSwitch('show3')">
                          <div v-if="show3">{{timetableList.text}}</div>
                          <textarea
                            ref="show3"
                            @blur="show3 = true"
                            v-if="!show3"
                            id="TextArea1"
                            class="inputStyle"
                            v-model="timetableList.text"
                            style="width : 100%; height :100%"
                            rows="2"
                          />
                        </div>
                      </td>
                      <td>
                        <div style="width : 100%; height : 100%" @click="textSwitch('show4')">
                          <div v-if="show4">{{timetableList.text}}</div>
                          <textarea
                            ref="show4"
                            @blur="show4 = true"
                            v-if="!show4"
                            id="TextArea1"
                            class="inputStyle"
                            v-model="timetableList.text"
                            style="width : 100%; height :100%"
                            rows="2"
                          />
                        </div>
                      </td>
                      <td>
                        <div style="width : 100%; height : 100%" @click="textSwitch('show5')">
                          <div v-if="show5">{{timetableList.text}}</div>
                          <textarea
                            ref="show5"
                            @blur="show5 = true"
                            v-if="!show5"
                            id="TextArea1"
                            class="inputStyle"
                            v-model="timetableList.text"
                            style="width : 100%; height :100%"
                            rows="2"
                          />
                        </div>
                      </td>
                      <td>
                        <div style="width : 100%; height : 100%" @click="textSwitch('show6')">
                          <div v-if="show6">{{timetableList.text}}</div>
                          <textarea
                            ref="show6"
                            @blur="show6 = true"
                            v-if="!show6"
                            id="TextArea1"
                            class="inputStyle"
                            v-model="timetableList.text"
                            style="width : 100%; height :100%"
                            rows="2"
                          />
                        </div>
                      </td>
                      <td>
                        <div style="width : 100%; height : 100%" @click="textSwitch('show7')">
                          <div v-if="show7">{{timetableList.text}}</div>
                          <textarea
                            ref="show7"
                            @blur="show7 = true"
                            v-if="!show7"
                            id="TextArea1"
                            class="inputStyle"
                            v-model="timetableList.text"
                            style="width : 100%; height :100%"
                            rows="2"
                          />
                        </div>
                      </td>
                      <td>
                        <div style="width : 100%; height : 100%" @click="textSwitch('show8')">
                          <div v-if="show8">{{timetableList.text}}</div>
                          <textarea
                            ref="show8"
                            @blur="show8 = true"
                            v-if="!show8"
                            id="TextArea1"
                            class="inputStyle"
                            v-model="timetableList.text"
                            style="width : 100%; height :100%"
                            rows="2"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="上课时间" :close-on-click-modal="false" :visible.sync="open" width="40%">
      <el-date-picker
        v-model="timetableList.date"
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
import {listBjclass} from "@/api/basic/bjclass"
export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        nf: "",
        xq: "",
        yf: "",
        z: ""
      },
      activeTab: "yb",
      // 遮罩
      open: false,
      // 课表数据
      timetableList: {
        date: "",
        text: "第一课11111111111111111111111111111111111111"
      },
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true,
      show6: true,
      show7: true,
      show8: true,
      // 班级信息
      listBjclass : [],
    };
  },
  created() {},
  mounted() {
    //   console.log(this.$store.state.user.userId)
    this.getList()
  },
  methods: {
    // 班级列表基础信息
    getList(){
      listBjclass({userId : this.$store.state.user.userId}).then( res => {
          this.listBjclass = res.rows
      })
    },
    // 搜索课表
    handleQuery() {},
    dataPicker() {
      this.open = true;
    },
    // 时间处理
    getPicker() {
      this.open = false;
      let arr = [];
      this.timetableList.date.forEach(value => {
        let index = value.lastIndexOf(" ");
        value = value.substring(index + 1, value.length);
        arr.push(value);
      });
      this.timetableList.date = arr;
    },
    textSwitch(value) {
      this[value] = false;
      // textarea 自动聚焦
      this.$nextTick(() => {
        this.$refs[value].focus();
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
            background-color: rgb(9, 94, 89);
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
