<template>
  <div class="attendanceDetails">
    <div class="wrap-title">
      <span>{{courseInformation.date}}</span>
      <span>{{courseInformation.kcType}}</span>
    </div>

    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="日语班级">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="一班" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="显示头像">
        <el-switch v-model="seeImg"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="wrap-no-sign">
      <div class="nav-sign clearfix">
        <div>
          <h4>未签到学生</h4>
        </div>
        <div>
          <el-button v-if="!selectAllData" type="info" @click="selectAll" plain>全选</el-button>
          <el-button v-else type="info" @click="selectAll" plain>不全选</el-button>
        </div>
        <div>
          <el-button type="success" @click="signIn" icon="el-icon-check">签到</el-button>
        </div>
        <div>
          <el-button type="warning" icon="el-icon-edit" @click="showAbnormal">标记</el-button>
        </div>
      </div>
      <div class="wrap-student-list" v-if="noSignItem.length > 0">
        <ul>
          <li v-for="(item,index) in noSignItem" :key="index">
            <el-image
              v-if="seeImg"
              style="width : 80px; height : 100px; margin-bottom: 10px;"
              :src="item.img"
              :preview-src-list="[item.img]"
            ></el-image>
            <span>{{item.name}}</span>
            <span>{{item.nj}}</span>
            <el-checkbox v-model="item.checkbox"></el-checkbox>
          </li>
        </ul>
      </div>
      <div v-else style="text-align : center; color : #e6a23c;margin-top : 20px">暂时还没有未签到的学生</div>
    </div>

    <div class="wrap-abnormal-sign">
      <div class="nav-sign clearfix">
        <div>
          <h4>考勤异常学生</h4>
        </div>
      </div>
      <div class="wrap-student-list" v-if="abnormalSignItem.length > 0">
        <ul>
          <li v-for="(item,index) in abnormalSignItem" :key="index">
            <div class="left-data">
              <el-image
                v-if="seeImg"
                style="width : 80px; height : 100px; margin-bottom: 10px;"
                :src="item.img"
                :preview-src-list="[item.img]"
              ></el-image>
              <span>{{item.name}}</span>
              <span>{{item.nj}}</span>
              <span>上课时间6:30</span>
              <span>签到时间7:21</span>
            </div>
            <div class="right-data">
              <div class="kq-type">
                <span>考勤类型 :</span>
                <span>迟到</span>
              </div>
              <div>
                <el-input disabled type="textarea" :rows='7' v-model="item.abnormalForm.yy"></el-input>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else style="text-align : center; color : #f56c6c">暂时还没有签到异常的学生</div>
    </div>

    <div class="wrap-already-Signed">
      <div class="nav-sign clearfix">
        <div>
          <h4>已签到学生</h4>
        </div>
      </div>
      <div class="wrap-student-list" v-if="alreadySignedItem.length > 0">
        <ul>
          <li v-for="(item,index) in alreadySignedItem" :key="index">
            <el-image
              v-if="seeImg"
              style="width : 80px; height : 100px; margin-bottom: 10px;"
              :src="item.img"
              :preview-src-list="[item.img]"
            ></el-image>
            <span>{{item.name}}</span>
            <span>{{item.nj}}</span>
          </li>
        </ul>
      </div>
      <div v-else style="text-align : center; color : #67c23a">暂时还没有签到的学生</div>
    </div>

    <el-dialog title="标记信息" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="abnormalForm" label-width="80px">
        <el-form-item label="考勤类型">
          <el-select v-model="abnormalForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因">
          <el-input type="textarea" v-model="abnormalForm.yy"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="abnormalForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAbnormal">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 课程信息
      courseInformation: {},
      // 表单
      formInline: {},
      // 异常
      abnormalForm: {},
      dialogVisible: false,
      // 查看头像
      seeImg: true,
      // 未签到数据
      noSignItem: [
        {
          img:
            "https://img0.baidu.com/it/u=3564045895,2010464973&fm=26&fmt=auto&gp=0.jpg",
          name: "老王",
          nj: "高三(1)",
          checkbox: false,
          signStatus: 1
        },
        {
          img:
            "https://img0.baidu.com/it/u=3564045895,2010464973&fm=26&fmt=auto&gp=0.jpg",
          name: "老张",
          nj: "高三(2)",
          checkbox: false,
          signStatus: 1
        },
        {
          img:
            "https://img0.baidu.com/it/u=3564045895,2010464973&fm=26&fmt=auto&gp=0.jpg",
          name: "老张",
          nj: "高三(2)",
          checkbox: false,
          signStatus: 1
        },
        {
          img:
            "https://img0.baidu.com/it/u=3564045895,2010464973&fm=26&fmt=auto&gp=0.jpg",
          name: "老张",
          nj: "高三(2)",
          checkbox: false,
          signStatus: 1
        },
        {
          img:
            "https://img0.baidu.com/it/u=3564045895,2010464973&fm=26&fmt=auto&gp=0.jpg",
          name: "老刘",
          nj: "高三(3)",
          checkbox: false,
          signStatus: 1
        }
      ],
      // 已经签到数据
      alreadySignedItem: [],
      // 签到异常
      abnormalSignItem: [],
      // 全选复制
      selectAllData: false
    };
  },
  created() {
    this.courseInformation = JSON.parse(this.$route.query.query);
  },
  mounted() {
    this.selectAll();
  },
  methods: {
    // 查学生
    getList() {},
    // 全选
    selectAll() {
      this.selectAllData = !this.selectAllData;
      this.noSignItem.map(value => {
        value.checkbox = this.selectAllData;
      });
    },
    // 查询
    onSubmit() {},
    //签到
    signIn() {
      this.noSignItem.forEach((value, index) => {
        if (value.checkbox) {
          value.signStatus = 3;
          this.alreadySignedItem.push(this.noSignItem.splice(index, 1)[0]);
        }
      });
    },
    showAbnormal() {
      this.dialogVisible = true;
      this.abnormalForm = {}
    },
    // 异常添加
    addAbnormal() {
      this.dialogVisible = false;
      this.noSignItem.forEach((value, index) => {
        if (value.checkbox) {
          let arr = this.noSignItem.splice(index, 1)[0];
          this.abnormalSignItem.push(arr);
          arr.abnormalForm = this.abnormalForm
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.attendanceDetails {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  .wrap-title {
    margin-bottom: 20px;
    span {
      margin-right: 20px;
    }
  }
  .wrap-no-sign {
    width: 100%;
    height: 100%;
    .nav-sign {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      div {
        margin-right: 10px;
        h4 {
          background: #e6a23c;
          display: inline-block;
          color: #fff;
          padding: 6px;
          box-sizing: border-box;
          border-radius: 10px;
          margin: 0;
        }
      }
    }
    .wrap-student-list {
      width: 100%;
      background: #eee;
      margin-top: 20px;
      border-radius: 30px;
      border: 2px #dcdfe6 solid;
      ul {
        width: 100%;
        height: 100%;
        list-style-type: none;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: 0 20px;
        box-sizing: border-box;
        li:hover {
          -webkit-transition: all 0.1s linear;
          transition: all 0.1s linear;
          box-shadow: 2px 2px 5px 2px rgba(90, 19, 19, 0.2);
        }
        li {
          width: 120px;
          background: #fff;
          padding: 10px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-top: 2px #e6a23c solid;
          margin: 0 10px 10px 0;
          img {
            // width: 100%;
            height: 80px;
            margin-bottom: 5px;
          }
          span {
            margin-bottom: 5px;
          }
        }
      }
    }
  }
  .wrap-abnormal-sign {
    width: 100%;
    height: 100%;
    margin: 30px 0px;
    .nav-sign {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      div {
        margin-right: 10px;
        h4 {
          background: #f56c6c;
          display: inline-block;
          color: #fff;
          padding: 6px;
          box-sizing: border-box;
          border-radius: 10px;
          margin: 0;
        }
      }
    }
    .wrap-student-list {
      width: 100%;
      height: 100%;
      background: #eee;
      margin-top: 20px;
      border-radius: 30px;
      border: 2px #dcdfe6 solid;
      ul {
        width: 100%;
        height: 100%;
        list-style-type: none;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: 0 20px;
        box-sizing: border-box;
        li:hover {
          -webkit-transition: all 0.1s linear;
          transition: all 0.1s linear;
          box-shadow: 2px 2px 5px 2px rgba(90, 19, 19, 0.2);
        }
        li {
          width: 240px;
          display: flex;
          padding: 10px;
          box-sizing: border-box;
          font-size: 14px;
          border-top: 2px #f56c6c solid;
          background: #fff;
          margin-right: 10px;
          .left-data {
            width: 120px;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 10px 10px 0;
            span {
              line-height: 20px;
            }
            img {
              height: 80px;
              margin-bottom: 5px;
            }
          }
          .right-data {
            width: 120px;
            .kq-type {
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  }
  .wrap-already-Signed {
    width: 100%;
    height: 100%;
    .nav-sign {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      div {
        margin-right: 10px;
        h4 {
          background: #67c23a;
          display: inline-block;
          color: #fff;
          padding: 6px;
          box-sizing: border-box;
          border-radius: 10px;
          margin: 0;
        }
      }
    }
    .wrap-student-list {
      width: 100%;
      background: #eee;
      margin-top: 20px;
      border-radius: 30px;
      border: 2px #dcdfe6 solid;
      ul {
        width: 100%;
        height: 100%;
        list-style-type: none;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: 0 20px;
        box-sizing: border-box;
        li:hover {
          -webkit-transition: all 0.1s linear;
          transition: all 0.1s linear;
          box-shadow: 2px 2px 5px 2px rgba(90, 19, 19, 0.2);
        }
        li {
          width: 120px;
          background: #fff;
          padding: 10px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-top: 2px #67c23a solid;
          margin: 0 10px 10px 0;
          img {
            height: 80px;
            margin-bottom: 5px;
          }
          span {
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
</style>