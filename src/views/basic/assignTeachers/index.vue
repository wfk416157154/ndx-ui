<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="校区">
        <el-select v-model="formInline.xxmc" @change="listSchoolId" filterable placeholder="请选择校区">
          <el-option
            v-for="(item,index) in listSchool"
            :key="index"
            :label="item.xxmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日语班" prop="ryb">
        <el-select
          v-model="formInline.bjid"
          @change="onRybChange"
          filterable
          :disabled="queryRybDisabled"
          placeholder="请选择日语班级"
        >
          <el-option
            v-for="item in bjclassList "
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师姓名">
        <el-select
          style="width : 200px; height : 20px;margin-right : 40px"
          v-model="formInline.lsid"
          filterable
          placeholder="请选择老师"
          :disabled="queryLsxmDisabled"
        >
          <el-option
            v-for="item in teacherListOption"
            :key="item.id"
            :label="item.lsxm"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="onAddTeacher">添加</el-button>
      </el-form-item>
    </el-form>
    <div class="wrap-class clearfix">
      <h3>待分配老师的班级</h3>
      <ul>
        <li v-for="(classItem,index) in optionalClasses" :key="index">
          <span>学校名称 :</span>
          <span>{{classItem.xxmc}}</span>
          <br />
          <span>班级名称 :</span>
          <span>{{classItem.rybjmc}}</span>
          <br />
          <span>班级人数 :</span>
          <span>{{classItem.bjrs}}</span>
          <br />
          <span>开班时间 :</span>
          <span>{{classItem.kbsj}}</span>
          <br />
          <el-select
            style="margin-bottom : 10px"
            v-model="classItem.lsidArr"
            filterable
            multiple
            placeholder="请选择老师"
          >
            <el-option
              v-for="item in teacherListOption"
              :key="item.id"
              :label="item.lsxm"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="fenpei(classItem.bjid,classItem.lsidArr)">确定</el-button>
        </li>
      </ul>
    </div>
    <div class="wrap-class clearfix">
      <h3>已分配老师的班级</h3>
      <ul>
        <li v-for="(item,index) in optionalClasses1" :key="index">
          <span>学校名称 :</span>
          <span>{{item.xxmc}}</span>
          <br />
          <span>班级名称 :</span>
          <span>{{item.rybjmc}}</span>
          <br />
          <span>班级人数 :</span>
          <span>{{item.bjrs}}</span>
          <br />
          <span>开班时间 :</span>
          <span>{{item.kbsj}}</span>
          <br />
          <span>已分配的老师姓名 :</span>
          <span>
            {{item.lsxm}}
            <!--<el-select v-model="item.lsxm" filterable multiple placeholder="当前老师" disabled>
              <el-option
                v-for="item in teacherListOption"
                :key="item.id"
                :label="item.lsxm"
                :value="item.lsxm"
              ></el-option>
            </el-select>-->
          </span>
          <br />
          <el-select
            style="margin-bottom : 10px"
            v-model="item.lsidArr"
            filterable
            multiple
            placeholder="请选择替换老师"
          >
            <el-option
              v-for="item in teacherListOption"
              :key="item.id"
              :label="item.lsxm"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="fenpei(item.bjid,item.lsidArr)">替换</el-button>
        </li>
      </ul>
    </div>

      <el-button type="warning" icon="el-icon-download" style="margin-bottom: 10px" @click="exportTeacher">导出数据</el-button>
      <el-table :data="optionalClassesAll" border style="width: 100%">
        <el-table-column prop="xxmc" label="学校名称" width="180"></el-table-column>
        <el-table-column prop="rybjmc" label="班级名称" width="180"></el-table-column>
        <el-table-column prop="bjrs" label="班级人数"></el-table-column>
        <el-table-column prop="kbsj" label="开班时间"></el-table-column>
        <el-table-column prop="updateTime" label="分配时间"></el-table-column>
        <el-table-column prop="lsxm" label="已分配的老师姓名"></el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="allQueryParams.pageNum"
        :limit.sync="allQueryParams.pageSize"
        @pagination="selectAllAllotTeacherList"
      />
  </div>
</template>
<script>
import { listSchool } from "@/api/basic/school";
import { listBjclass } from "@/api/basic/bjclass";
import {
  teacherList,
  editBjclass,
  classAllotTeacher,
  classAllotList
} from "@/api/basic/assignTeachers";
export default {
  data() {
    return {
      formInline: {
        xxmc: ""
      },
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 班级基础信息表格数据
      bjclassList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态字典
      statusOptions: [],
      //年级字典
      selectNj: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xqmc: null,
        nj: null,
        rybjmc: null,
        lsxm: null,
        status: null,
        kzzd1: null,
        xqid: null
      },
      // 查询所有已分配的老师
      allQueryParams: {
        pageNum: 1,
        pageSize: 10,
        isAllot: 1
      },
      // 老师姓名
      teacherNames: {},
      // 校区
      listSchool: [],
      //未分配班级
      optionalClasses: [],
      //已分配班级
      optionalClasses1: [],
      // 所有学校所有日语班级分配的老师
      optionalClassesAll:[],
      // 分配老师班级
      json: {},
      // 班级选择
      bjclassList: [],
      // 查询日语班选项 是否禁用
      queryRybDisabled: true,
      // 查询老师选项 是否禁用
      queryLsxmDisabled: true,
      // 获取老师列表
      teacherListOption: []
    };
  },
  created() {
    this.getList();
    this.getTeacherList();
    this.selectAllAllotTeacherList()
  },
  methods: {
    onRybChange(id) {
      if (id) {
        this.queryLsxmDisabled = false;
      } else {
        this.queryLsxmDisabled = true;
      }
    },
    /** 校区列表 */
    getList() {
      this.loading = true;
      listSchool().then(response => {
        this.listSchool = response.rows;
        this.loading = false;
      });
    },
    // 获取老师列表
    getTeacherList() {
      teacherList().then(response => {
        this.teacherListOption = response.rows;
      });
    },
    // 获取校区id
    listSchoolId(id) {
      this.queryParams.kzzd1 = id;
      if (id) {
        listBjclass({ kzzd1: id }).then(response => {
          this.bjclassList = response.rows;
        });
        this.queryRybDisabled = false;
      } else {
        this.queryRybDisabled = true;
      }
      this.onSubmit();
    },
    // 查询班级
    onSubmit() {
      if (this.queryParams.kzzd1 == "") {
        this.$notify.error({
          title: "无法查询",
          message: "请选择校区"
        });
        return;
      }
      this.queryParams.xqid = this.queryParams.kzzd1;
      // 未分配老师的班级
      this.queryParams.isAllot = 0;
      let param = {
        xqid: this.queryParams.kzzd1,
        isAllot: this.queryParams.isAllot
      };
      classAllotList(param).then(res => {
        this.optionalClasses = res.rows;
        if (res.code == 200) {
          //已分配老师的班级
          param.isAllot = 1;
          classAllotList(param).then(res => {
            this.optionalClasses1 = res.rows;
          });
        }
      });
    },
    // 查询所有学校已分配的老师信息
    selectAllAllotTeacherList(){
      classAllotList(this.allQueryParams).then(res => {
        this.optionalClassesAll = res.rows;
        this.total = res.total
      });
    },
    // 单独给某个日语班添加老师
    onAddTeacher() {
      let lsidArr=[this.formInline.lsid]
      this.fenpei(this.formInline.bjid,lsidArr);
    },
    // 分配老师
    fenpei(bjid, lsidArr) {
      if (!lsidArr || lsidArr.length == 0) {
        this.$notify({
          title: "警告",
          message: "请选择替换的老师",
          type: "warning"
        });
        return;
      }
      let json = {
        bjid,
        lsidArr
      };
      if (undefined != json.bjid) {
        classAllotTeacher(json).then(res => {
            if (res.code != 200) {
              this.$notify.error({
                title: "失败",
                message: "老师分配失败"
              });
            } else {
              this.$notify.success({
                title: "成功",
                message: "老师分配成功"
              });
              this.onSubmit();
            }
          }).catch(e => {
            console.log(e);
          });
      } else {
        this.$notify.error({
          title: "无法分配",
          message: "请选择老师"
        });
      }
    },
    // 导出已分配的老师信息
    exportTeacher(){
      this.download(
        "basic/bjclass/exportAllAllotTeacher", {},
        `已分配的老师信息.xlsx`
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap-el-form {
  padding-right: 30px;
  box-sizing: border-box;
}
.el-col {
  float: none;
  display: inline-block;
}
.wrap-class {
  width: 100%;
  height: 100%;
  background-color: #eee;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 50px;
  ul {
    list-style: none;
    padding: 20px;
    box-sizing: border-box;
    li {
      width: 250px;
      height: 100%;
      background-color: #fff;
      padding: 10px;
      box-sizing: border-box;
      float: left;
      font-size: 14px;
      margin-right: 20px;
      margin-bottom: 20px;
      border-top: 2px rgb(70, 176, 250) solid;
      cursor: pointer;
      span {
        display: inline-block;
        line-height: 20px;
        margin-bottom: 10px;
      }
    }
    li:hover {
      -webkit-transition: all 0.2s linear;
      transition: all 0.2s linear;
      box-shadow: 2px 2px 10px 2px rgba(90, 19, 19, 0.2);
    }
  }
}
</style>
