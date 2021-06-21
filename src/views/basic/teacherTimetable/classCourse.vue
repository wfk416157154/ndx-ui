<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="年份" prop="nf">
        <el-select v-model="queryParams.kzzd2" placeholder="请选择年份" clearable size="small">
          <el-option
            v-for="dict in yearList"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictLabel"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课表类型" prop="kbType">
        <el-select v-model="queryParams.kbType" placeholder="请选择课表类型" clearable size="small">
          <el-option
            v-for="dict in kbTypeOptionsEL"
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
            <span>{{kbName}}</span>
          </div>
          <el-tabs v-model="tabsActiveTab">
            <el-tab-pane label="班级课表" name="kb">
              <div style="margin-bottom: 10px">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="insertTimetable()"
                >新增课表</el-button>
                <el-button
                  type="success"
                  icon="el-icon-check"
                  size="mini"
                  @click="submitTimetable()"
                >保存课表</el-button>

                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteData"
                >删除选中行</el-button>
              </div>

              <vxe-table
                border
                show-overflow
                keep-source
                ref="xTable"
                max-height="700"
                :cell-style="renderColor"
                :data="classCourseList"
                :edit-config="{trigger: 'click', mode: 'cell', icon: 'fa fa-pencil', showStatus: true}"
              >
                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                <vxe-table-column title="id" align="center" field="id" :visible="true" />
                <vxe-table-column title="班级id" align="center" field="bjid" :visible="true" />
                <vxe-table-column title="课表类型" align="center" field="kbType" :edit-render="{name: '$select' , options: kbTypeOptions}" />
                <vxe-table-column title="课程类型" align="center" field="kcType" :edit-render="{name: '$select', options: kcType}" />
                <vxe-table-column title="周一" align="center" field="monday"  :edit-render="{name: '$select', options: isCourse}"  />
                <vxe-table-column title="周二" align="center" field="tuesday" :edit-render="{name: '$select', options: isCourse}"  />
                <vxe-table-column title="周三" align="center" field="wednesday" :edit-render="{name: '$select', options: isCourse}"  />
                <vxe-table-column title="周四" align="center" field="thursday" :edit-render="{name: '$select', options: isCourse}"  />
                <vxe-table-column title="周五" align="center" field="friday" :edit-render="{name: '$select', options: isCourse}"  />
                <vxe-table-column title="周六" align="center" field="saturday" :edit-render="{name: '$select', options: isCourse}"  />
                <vxe-table-column title="周日" align="center" field="sunday" :edit-render="{name: '$select', options: isCourse}"  />
                <vxe-table-column title="备注" align="center" field="remark" />
              </vxe-table>


            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

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
import {delClassCourse} from "../../../api/basic/classCourse";
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
      form: {
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
      },
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
        kzzd2: null,
        bjid: null
      },
      // 年份字典
      yearList: [],
      // 课表类型
      kbTypeOptions: [],
      kbTypeOptionsEL:[],
      // 是否有课
      isCourse: [],
      // 课程类型
      kcType: [],
      // 课表名字
      kbName: ""
    };
  },
  created() {
    this.getDicts("year-list").then(response => {
      this.yearList = response.data;
    });
    this.getDicts("kb_type").then(response => {
      this.kbTypeOptions=this.renderDict(response.data);
      this.kbTypeOptionsEL=response.data;
    });
    this.getDicts("is_course").then(response => {
      this.isCourse = this.renderDict(response.data);
    });
    this.getDicts("kc_type").then(response => {
      this.kcType = this.renderDict(response.data);
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 班级列表基础信息
    getList() {
      listBjclass({ kzzd2: this.$store.state.user.glrid }).then(res => {
        this.listBjclass = res.rows;
        this.activeTab = this.listBjclass[0].id;
        this.switchingClasses(this.activeTab);
      });
      this.getCourse();
    },
    getCourse(){
      /** 查询班级课程列表 */
      this.loading = true;
      listClassCourse(this.queryParams).then(response => {
        this.classCourseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //查询课表
    handleQuery() {
      this.getCourse();
    },
    //新增课表
    insertTimetable(row){
      const $table = this.$refs.xTable
      const record = {
      }
      const { row: newRow } = $table.insertAt(record, row)
    },
    // 保存课表
    submitTimetable() {
      const $table = this.$refs.xTable
      const result = $table.getRecordset()
      console.log(`insertRecords=`,result)
      if(result.insertRecords.length>0){
        for (let i = 0; i < result.insertRecords.length; i++) {
            result.insertRecords[i].bjid=this.queryParams.bjid
            addClassCourse(result.insertRecords[i]).then(response => {
          });
        }
        this.msgSuccess("新增成功");
      }
      if(result.updateRecords.length>0){
        for (let i = 0; i < result.insertRecords.length; i++) {
            updateClassCourse(result.insertRecords[i]).then(response => {
          });
        }
        this.msgSuccess("修改成功");
      }
      this.getList();
    },
    // 删除选中行
    deleteData(){
      const $table = this.$refs.xTable
      const removeRecords = $table.getCheckboxRecords()

      this.$confirm('是否确认删除?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        let arr=[]
        for (let i = 0; i < removeRecords.length; i++) {
          arr.push(removeRecords[i].id);
        }
        return delClassCourse(arr);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch((e)=>{
        console.log(e);
      })

    },
    // 切换班级课表
    switchingClasses(bjid) {
      this.queryParams.bjid = bjid;
      this.getCourse();
    },
    renderColor ({ row, rowIndex, column }) {
      if("monday"==column.property){
        return this.rtnCellType(row.monday);
      }
      if("tuesday"==column.property){
        return this.rtnCellType(row.tuesday);
      }
      if("wednesday"==column.property){
        return this.rtnCellType(row.wednesday);
      }
      if("thursday"==column.property){
        return this.rtnCellType(row.thursday);
      }
      if("friday"==column.property){
        return this.rtnCellType(row.friday);
      }
      if("saturday"==column.property){
        return this.rtnCellType(row.saturday);
      }
      if("sunday"==column.property){
        return this.rtnCellType(row.sunday);
      }
    },
    rtnCellType(value){
      if("1"==value){
        return {backgroundColor: '#187',color: '#ffffff'};
      }
    }
  }
};
</script>

