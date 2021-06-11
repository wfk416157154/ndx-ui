<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="校区">
        <el-select v-model="formInline.xxmc" @change="listSchoolId" placeholder="请选择校区">
          <el-option
            v-for="(item,index) in listSchool"
            :key="index"
            :label="item.xxmc"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="日语班级">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师姓名">
        <el-input v-model="formInline.user" placeholder="审批人"></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="wrap-class clearfix">
      <h3>待分配老师的班级</h3>
      <ul>
        <li v-for="(classItem,index) in optionalClasses" :key="index">
          <span>学校名称 :</span>
          <span>{{classItem.xqmc}}</span>
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
            style="width : 120px; height : 20px;margin-right : 40px"
            v-model="teacherNames[index]"
            placeholder="请选择老师"
            @change="getIeacherName(teacherNames[index],index,classItem)"
          >
            <el-option v-for="item in teacherList" :key="item.id" :label="item.lsxm" :value="item"></el-option>
          </el-select>
          <el-button type="primary" @click="assignTeachers">确定</el-button>
        </li>
      </ul>
      <pagination
        style="display : inline"
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <div class="wrap-class clearfix">
      <h3>已分配老师的班级</h3>
      <ul>
        <li v-for="(item,index) in optionalClasses1" :key="index">
          <span>学校名称 :</span>
          <span>{{item.xqmc}}</span>
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
          <span>老师姓名 :</span>
          <span>{{item.lsxm}}</span>
        </li>
      </ul>
      <pagination
        style="display : inline"
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import { listSchool } from "@/api/basic/school";
import { listBjclass } from "@/api/basic/bjclass";
import { teacherList, editBjclass } from "@/api/basic/assignTeachers";
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
        kzzd1: ""
      },
      // 老师姓名
      teacherNames: {},
      // 校区
      listSchool: [],
      //未分配班级
      optionalClasses: [],
      //已分配班级
      optionalClasses1: [],
      //获取老师列表
      teacherItem: [],
      // 分配老师班级
      json: {}
    };
  },
  created() {
    this.getList();
    this.getTeacherList();
  },
  methods: {
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
        this.teacherList = response.rows;
      });
    },
    // 选中老师
    getIeacherName(ls, num, bjclass) {
      console.log(ls)
      this.json = {
        id: bjclass.id,
        lsxm: ls.lsxm,
        lsdh: ls.dhhm,
        kzzd2 : ls.id
      };
      this.teacherNames[num] = ls.lsxm;
    },
    // 获取校区id
    listSchoolId(value) {
      this.queryParams.kzzd1 = value.id;
      this.formInline.xxmc = value.xxmc;
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
      // 未分配老师的班级
      this.queryParams.sffp = 0;
      listBjclass(this.queryParams).then(res => {
        this.optionalClasses = res.rows;
        if(res.code==200){
          //已分配老师的班级
          this.queryParams.sffp = 1;
          listBjclass(this.queryParams).then(res => {
            this.optionalClasses1 = res.rows;
          });
        }
      });
    },
    // 分配老师
    assignTeachers() {
      if(undefined!=this.json.id){
        editBjclass(this.json).then(res => {
          this.onSubmit();
        });
      }else{
        this.$notify.error({
          title: "无法分配",
          message: "请选择老师"
        });
      }
    },
    getChecked(index) {
      console.log(index);
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
      height: 180px;
      background-color: #fff;
      padding: 10px;
      box-sizing: border-box;
      float: left;
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
