<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :rules="queryParamsRules" :inline="true" label-width="68px">
      <el-form-item label="校区名称" prop="xqid" v-has-permi="['basic:school:list']" label-width="100px" >
        <el-select v-model="queryParams.xqid" filterable @change="onChooseSchool" placeholder="请选择校区名称" >
          <el-option
            v-for="item in schoolList"
            :key="item.id"
            :label="item.xxmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="年份" prop="kzzd2">
        <el-select v-model="queryParams.kzzd2" placeholder="请选择年份"  clearable size="small">
          <el-option
            v-for="dict in yearList"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictLabel"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课表类型" prop="kbType" label-width="100px" >
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
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="color: #00afff">所有课表</span>
          </div>
          <div v-for="(item,index) in classCourseBasicList" :key="index" class="list-group-item">
              <el-switch
                v-model="item.sfqy"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
                <div v-if="item.sfqy==1" style="color: #13ce66;float: right"  >
                  {{item.nd}} 年度-
                  {{selectDictLabel(kbTypeOptionsEL,item.kbType)}}
                </div>
                <div v-else style="float: right">
                  {{item.nd}} 年度-
                  {{selectDictLabel(kbTypeOptionsEL,item.kbType)}}
                </div>
          </div>
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
                  @click="insertTimetable(-1)"
                >新增课表
                </el-button>
                <el-button
                  type="success"
                  icon="el-icon-check"
                  size="mini"
                  @click="submitTimetable()"
                >保存课表
                </el-button>

                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  :disabled="btnDisabled"
                  @click="deleteData"
                >删除选中行
                </el-button>
              </div>

              <vxe-table
                border
                show-overflow
                keep-source
                ref="xTable"
                max-height="700"
                @checkbox-change="onselectionchange"
                :cell-style="renderColor"
                :data="classCourseList"
                :edit-config="{trigger: 'click', mode: 'cell', icon: 'fa fa-pencil', showStatus: true}"
                :edit-rules="{kbType:[{required:true,trigger:'change'}],kcType:[{required:true,trigger:'change'}]}"
                :valid-config="{autoPos:true,showMessage:true}"
              >
                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                <vxe-table-column title="id" align="center" field="id" :visible="false"/>
                <vxe-table-column title="班级id" align="center" field="bjid" :visible="false"/>
                <vxe-table-column title="课表类型" align="center" field="kbType" :visible="false"
                                  :edit-render="{name: '$select' , options: kbTypeOptions}"/>
                <vxe-table-column title="课程类型" align="center" field="kcType"
                                  :edit-render="{name: '$select', options: kcType}"/>
                <vxe-table-column title="周一" align="center" field="monday"
                                  :edit-render="{name: '$select', options: isCourse, events: {change: mondayChangeEvent}}"/>
                <vxe-table-column title="周二" align="center" field="tuesday"
                                  :edit-render="{name: '$select', options: isCourse}"/>
                <vxe-table-column title="周三" align="center" field="wednesday"
                                  :edit-render="{name: '$select', options: isCourse}"/>
                <vxe-table-column title="周四" align="center" field="thursday"
                                  :edit-render="{name: '$select', options: isCourse}"/>
                <vxe-table-column title="周五" align="center" field="friday"
                                  :edit-render="{name: '$select', options: isCourse}"/>
                <vxe-table-column title="周六" align="center" field="saturday"
                                  :edit-render="{name: '$select', options: isCourse}"/>
                <vxe-table-column title="周日" align="center" field="sunday"
                                  :edit-render="{name: '$select', options: isCourse}"/>
                <vxe-table-column title="备注" align="center" field="remark"/>
              </vxe-table>

            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>


    <!-- 添加或修改课程对话框 -->
    <el-dialog :title="courseTitle" :visible.sync="courseOpen" width="500px" append-to-body>
      <el-table :data="ybjQueryList" @selection-change="courseHandleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column property="ybj" label="原班级"></el-table-column>
        <el-table-column property="rs" label="班级人数"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="courseSubmitForm">确 定</el-button>
        <el-button @click="courseCancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {listBjclass} from "@/api/basic/bjclass";
  import {
    listClassCourse,
    saveList,
    addClassCourse,
    updateClassCourse,
    ybjQuery
  } from "@/api/basic/classCourse";
  import { listSchool } from "@/api/basic/school";
  import {delClassCourse} from "@/api/basic/classCourse";
  import { listClassCourseBasic, getClassCourseBasic, delClassCourseBasic, addClassCourseBasic, updateClassCourseBasic } from "@/api/basic/classCourseBasic";

  export default {
    data() {
      return {
        courseTitle:"",
        courseOpen:false,
        startTime: "",
        btnDisabled: true,
        // 班级id
        activeTab: "",
        // 班级课表选择
        tabsActiveTab: "kb",
        // 遮罩
        open: false,
        // 数据切换
        show: {},
        //校区信息
        schoolList: [],
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
        queryParamsRules:{
          xqid: [
            { required: true, message: "请选择", trigger: "change" }
          ],
          kzzd2: [
            { required: true, message: "请选择该课表对应的年份", trigger: "change" }
          ],
          kbType: [
            { required: true, message: "请选择该课表对应的课表类型", trigger: "change" }
          ],
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
          bjid: null,
          xqid:null
        },
        // 年份字典
        yearList: [],
        // 课表类型
        kbTypeOptions: [],
        kbTypeOptionsEL: [],
        // 是否有课
        isCourse: [],
        // 课程类型
        kcType: [],
        // 课表名字
        kbName: "",
        classCourseBasicList:[],
        switchControl:true,
        ybjQueryList:[]
      };
    },
    created() {
      this.getDicts("year-list").then(response => {
        this.yearList = response.data;
      });
      this.getDicts("kb_type").then(response => {
        this.kbTypeOptions = this.renderDict(response.data);
        this.kbTypeOptionsEL = response.data;
      });
      this.getDicts("is_course").then(response => {
        this.isCourse = this.renderDict(response.data);
      });
      this.getDicts("kc_type").then(response => {
        this.kcType = this.renderDict(response.data);
      });
      listSchool().then(response => {
        this.schoolList = response.rows;
      });
    },
    mounted() {
      //this.getList();
    },
    methods: {
      // 班级列表基础信息
      getList(flag) {
        let obj={// 根据关联校区id进行查询
          kzzd1:this.queryParams.xqid
        }
        listBjclass(obj).then(res => {
          this.listBjclass = res.rows;
          if(res.rows.length>0){
            this.activeTab = this.listBjclass[0].id;
            if(flag){
              this.switchingClasses(this.activeTab);
            }
          }
        });
      },
      getCourse() {
        this.$refs.queryForm.validate(res=>{
        });
        if (null == this.queryParams.kzzd2) {
          this.msgError("请选择该新增课表的所属年份！")
          return;
        }
        if (null == this.queryParams.kbType) {
          this.msgError("请选择该新增课表的课表类型！")
          return;
        }
        /** 查询班级课程列表 */
        this.loading = true
        listClassCourse(this.queryParams).then(response => {
          this.classCourseList = response.rows
          this.total = response.total
          this.loading = false
        });
      },
      //查询课表
      handleQuery() {
        this.$refs.queryForm.validate(res=>{
          if(res){
            this.getList(true);
          }else{
            this.msgError("请选择查询条件！")
          }
        });

      },
      onChooseSchool(xqid){
        this.getList(false);
      },
      onselectionchange(row) {
        if (row.records.length > 0) {
          this.btnDisabled = false
        } else {
          this.btnDisabled = true
        }
      },
      //新增课表
      insertTimetable(row) {
        this.$refs.queryForm.validate(res=>{
        });
        if (null == this.queryParams.kzzd2) {
          this.msgError("请选择该新增课表的所属年份！")
          return;
        }
        if (null == this.queryParams.kbType) {
          this.msgError("请选择该新增课表的课表类型！")
          return;
        }
        const $table = this.$refs.xTable
        const record = {
          kbType:this.queryParams.kbType,
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0,
        }
        const {row: newRow} = $table.insertAt(record, row)
      },
      // 保存课表
      async submitTimetable() {
        const $table = this.$refs.xTable
        const result = $table.getRecordset()
        let flag = false;
        await $table.fullValidate(result.insertRecords, res => {
          console.log("res=",res)
          if (undefined != res) {
            flag = true;
          }
        })
        if (flag) {
          this.msgError("请选择课表类型和课程类型！")
          return;
        }
        if (result.insertRecords.length > 0) {
          for (let i = 0; i < result.insertRecords.length; i++) {
            result.insertRecords[i].bjid = this.queryParams.bjid
            result.insertRecords[i].kzzd2 = this.queryParams.kzzd2
            await addClassCourse(result.insertRecords[i]).then(response => {
            });
          }
          this.msgSuccess("新增成功");
        }
        if (result.updateRecords.length > 0) {
          for (let i = 0; i < result.updateRecords.length; i++) {
            await updateClassCourse(result.updateRecords[i]).then(response => {
            });
          }
          this.msgSuccess("修改成功");
        }
        this.getCourse();
      },
      // 删除选中行
      deleteData() {
        const $table = this.$refs.xTable
        const removeRecords = $table.getCheckboxRecords()
        this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          $table.removeCheckboxRow();
          let arr = []
          for (let i = 0; i < removeRecords.length; i++) {
            if (undefined == removeRecords[i].id) {
              continue;
            }
            arr.push(removeRecords[i].id);
          }
          if (arr.length > 0) {
            return delClassCourse(arr);
          }
        }).then(() => {
          this.getList(true);
          this.msgSuccess("数据删除成功");
        }).catch((e) => {
          console.log(e);
        })

      },
      // 切换班级课表
      switchingClasses(bjid) {
        this.queryParams.bjid = bjid;
        this.getCourse();
        this.getClassCourseBasicList(bjid);
      },
      renderColor({row, rowIndex, column}) {
        if ("monday" == column.property) {
          return this.rtnCellType(row.monday);
        }
        if ("tuesday" == column.property) {
          return this.rtnCellType(row.tuesday);
        }
        if ("wednesday" == column.property) {
          return this.rtnCellType(row.wednesday);
        }
        if ("thursday" == column.property) {
          return this.rtnCellType(row.thursday);
        }
        if ("friday" == column.property) {
          return this.rtnCellType(row.friday);
        }
        if ("saturday" == column.property) {
          return this.rtnCellType(row.saturday);
        }
        if ("sunday" == column.property) {
          return this.rtnCellType(row.sunday);
        }
      },
      rtnCellType(value) {
        if ("1" == value) {
          return {backgroundColor: '#187', color: '#ffffff'};
        }
      },
      /* 拿到该班级的所有课表 */
      getClassCourseBasicList(rybjid){
        let obj={
          bjid:rybjid
        }
        listClassCourseBasic(obj).then(response => {
          this.classCourseBasicList = response.rows;
        });
        ybjQuery(rybjid).then(res=>{
          this.ybjQueryList=res.rows
        });
      },
       async mondayChangeEvent({row,column}){// 星期一选项
         console.log("==",row.monday)
         if(row.monday=="1"){// 表示有课
           let flag= await this.ifKclxFlag()
           console.log("=flag=",flag)
          if(!flag){// 当校验通过
            this.courseTitle="请选择上该节课所属的原班级"
            this.courseOpen=true
          }
        }
      },
      /* 校验新增的数据 */
       ifKclxFlag(){
        const $table = this.$refs.xTable
        const result = $table.getRecordset()
        let flag = false;
        $table.fullValidate(result.insertRecords, res => {
          console.log("res:",res)
          if (undefined != res) {
           return  flag = true;
          }else {
            return flag;
          }
        })
         if (flag) {
           this.msgError("请先选择课程类型！")
         }

      },
      courseSubmitForm(){
        this.courseOpen=false
      },
      courseCancel(){
        this.courseOpen=false
      },
      courseHandleSelectionChange(selection){
        selection.map(item => {
          console.log("item:",item)
        });
        console.log("selection:",selection)
      }
    }

  };
</script>

<style>
</style>

