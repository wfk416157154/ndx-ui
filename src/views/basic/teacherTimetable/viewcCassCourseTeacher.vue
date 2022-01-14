<template>
  <div class="studentAttendance">
    <h2 style="color : #606266">课表</h2>
    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">课表导出</el-button>
    <el-form>
      <el-form-item label="日语班" label-width="100px">
        <el-select v-model="queryParams.bjid" @change="getList" filterable placeholder="请选择班级名称">
          <el-option
            v-for="item in listBjclass"
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      :data="listClassEnableCourse"
      border
      style="width: 100%;font-size : 18px"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column prop="kssj" label="开始时间" width="180"></el-table-column>
      <el-table-column prop="jssj" label="结束时间" width="180"></el-table-column>
      <el-table-column prop="kcTypeName" label="课程类型" :formatter="statusFormat" width="180"></el-table-column>
      <el-table-column prop="monday" title="周一" label="周一" width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.monday">
            <el-link type="success" style="color : #67C23A">{{scope.row.one}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tuesday" label="周二" width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.tuesday">
            <el-link type="success" style="color : #67C23A">{{scope.row.two}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="wednesday" label="周三" width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.wednesday">
            <el-link type="success" style="color : #67C23A">{{scope.row.three}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="thursday" label="周四" width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.thursday">
            <el-link type="success" style="color : #67C23A">{{scope.row.four}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="friday" label="周五" width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.friday">
            <el-link type="success" style="color : #67C23A">{{scope.row.five}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="saturday" label="周六" width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.saturday">
            <el-link type="success" style="color : #67C23A">{{scope.row.six}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sunday" label="周日" width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.sunday">
            <el-link type="success" style="color : #67C23A">{{scope.row.seven}}</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getClassEnableCourse } from "@/api/basic/classCourseBasic";
import { listBjclass } from "@/api/basic/bjclass";
export default {
  data() {
    return {
      // 课表数据
      listClassEnableCourse: [],
      // 课程类型
      kcType: [],
      listBjclass: [],
      queryParams: {
        bjid: this.$route.query.bjid
      },
      classNmae:""
    };
  },
  created() {
    this.getDicts("kc_type").then(response => {
      this.kcType = response.data;
    });
    listBjclass().then(res => {
      this.listBjclass = res.rows;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      getClassEnableCourse(this.queryParams.bjid).then(res => {
        this.listClassEnableCourse = res.data;
      });
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.kcType, row.kcType);
    },
    handleExport() {
      this.listBjclass.forEach(value=>{
        if(value.id == this.$route.query.bjid){
           this.classNmae = value.rybjmc
        }
      })
      this.download(
        "basic/classCourse/exportClassCourse",
        {
          bjid: this.$route.query.bjid,
          enableOnly: 1
        },
        `${this.classNmae}-课表.xlsx`
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.studentAttendance {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  //   cursor: pointer;
}
</style>
