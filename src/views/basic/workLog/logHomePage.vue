<template>
  <div class="Log-home-page">
    <el-form ref="queryParams" :inline="true" :model="queryParams" label-width="100px">
      <el-form-item label="校区">
        <el-select
          width="80px"
          height="“10px"
          v-model="queryParams.xqid"
          @change="getSchoolId"
          placeholder="请选择校区"
        >
          <el-option
            v-for="(item,index) in getListSchool"
            :label="item.xxmc"
            :value="item.id"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日语班级">
        <el-select width="80px" height="“10px" v-model="queryParams.bjid" placeholder="请选择班级">
          <el-option
            v-for="(item,index) in getBjClass"
            :label="item.rybjmc"
            :value="item.id"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师姓名">
        <el-input v-model="queryParams.lsid" placeholder="请输入老师姓名"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="queryParams.rq"
          type="datetimerange"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-button type="primary" class="el-btn" plain @click="getLog">查询</el-button>
      <el-button type="primary" class="el-btn" plain @click="handleExport">导出日志</el-button>
    </el-form>
    <div class="wrap-log-list">
      <ul>
        <li>
          <div class="personal-information __float">
            <div class="personal-information-content">
              <div class="information-box">
                <span>姓名 :</span>
                <span>张</span>
              </div>
            </div>
            <div class="personal-information-content">
              <div class="information-box">
                <span>日语班级 :</span>
                <span>1801</span>
              </div>
            </div>
            <div class="personal-information-content">
              <div class="information-box">
                <span>校区 :</span>
                <span>武汉校区</span>
              </div>
            </div>
          </div>
          <div class="log-information __float">
            <div class="log-header">
              <div class="log-header-left __float">
                <span>日期 :</span>
                <span>2021/6/31</span>
              </div>
              <div class="log-header-right __float">
                <el-tag type="success">已读</el-tag>
                <!-- <el-tag type="warning">未读</el-tag> -->
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { listSchool } from "@/api/basic/school";
import { listBjclass } from "@/api/basic/bjclass";
export default {
  data() {
    return {
      // 查询条件
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 校区
      getListSchool: [],
      // 班级
      getBjClass: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取校区
    async getList() {
      let listSchoolResult = await listSchool();
      this.getListSchool = listSchoolResult.rows;
    },
    // 获取班级
    getSchoolId(schoolId) {
      listBjclass({ kzzd1: schoolId }).then(res => {
        this.getBjClass = res.rows;
      });
    },
    // 查询按钮
    getLog() {},
    // 导出按钮操作
    handleExport() {
      this.download(
        "basic/teacher/export",
        {
          ...this.queryParams
        },
        `basic_teacher.xlsx`
      );
    }
  }
};
</script>

<style lang="scss">
.Log-home-page {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  .wrap-log-list {
    width: 100%;
    height: 100%;
    ul {
      width: 100%;
      height: 100%;
      li {
        list-style: none;
        width: 100%;
        height: 200px;
        .__float {
          float: left;
        }
        .personal-information {
          width: 20%;
          height: 100%;
          padding: 20px;
          box-sizing: border-box;
          .personal-information-content {
            width: 100%;
            height: 33%;
            font-size: 14px;
            position: relative;
            .information-box {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              line-height: 100%;
              span {
                line-height: 20px;
              }
            }
          }
        }
        .log-information {
          width: 50%;
          height: 100%;
          background-color: aquamarine;
          .log-header {
            width: 100%;
            height: 50px;
            .log-header-left {
              width: 90%;
              height: 100%;
              line-height: 50px;
            }
            .log-header-right {
              width: 10%;
              line-height: 50px;
            }
          }
        }
      }
    }
  }
}
</style>