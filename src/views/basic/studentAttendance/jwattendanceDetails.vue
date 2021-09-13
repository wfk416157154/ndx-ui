<template>
  <div class="attendanceDetails">
    <div
      class="wrap-title"
    >{{courseInformation.rqName}} - {{courseInformation.kssj}} - {{courseInformation.jssj}} - {{courseInformation.kcTypeName}}</div>

    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="是否显示头像">
        <el-switch v-model="seeImg"></el-switch>
      </el-form-item>
    </el-form>

    <div class="wrap-no-sign">
      <div class="nav-sign clearfix">
        <div>
          <h4>未签到学生</h4>
        </div>
      </div>
      <div class="wrap-student-list" v-if="noSignItem.length > 0">
        <ul>
          <li v-for="(item,index) in noSignItem" :key="index">
            <el-image
              v-if="seeImg"
              style="width : 80px; height : 100px; margin-bottom: 10px;"
              :src="item.xstx"
              :preview-src-list="[item.img]"
            ></el-image>
            <span>{{item.xsxm}}</span>
            <span>{{item.ybj}}</span>
            <el-checkbox disabled v-model="item.checkbox"></el-checkbox>
          </li>
        </ul>
      </div>
      <div v-else style="text-align : center; color : #e6a23c;margin-top : 20px">暂无未签到的学生</div>
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
                :src="item.xstx"
                :preview-src-list="[item.xstx]"
              ></el-image>
              <span>{{item.xsxm}}</span>
              <span>{{item.ybj}}</span>
              <span>上课时间 : {{courseInformation.kssj}}</span>
              <span>签到时间 : {{item.qdsj}}</span>
            </div>
            <div class="right-data">
              <div class="kq-type">
                <span>考勤类型 :</span>
                <span>{{item.qdyclxName}}</span>
              </div>
              <div>
                <el-input disabled type="textarea" :rows="7" v-model="item.ycyy"></el-input>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else style="text-align : center; color : #f56c6c">暂无签到异常的学生</div>
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
              :src="item.xstx"
              :preview-src-list="[item.img]"
            ></el-image>
            <span>{{item.xsxm}}</span>
            <span>{{item.ybj}}</span>
          </li>
        </ul>
      </div>
      <div v-else style="text-align : center; color : #67c23a">暂无签到的学生</div>
    </div>

    <el-dialog title="标记信息" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="abnormalForm" label-width="80px">
        <el-form-item label="异常类型">
          <el-select v-model="abnormalForm.qdyclx" placeholder="请选择活动区域">
            <el-option
              v-for="item in signStuCheckIN"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因">
          <el-input type="textarea" v-model="abnormalForm.ycyy"></el-input>
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
import {
  stuQiandaoHomePageQuery,
  batchCheckIn,
  batchYiChang
} from "@/api/basic/classCourseBasic";
export default {
  data() {
    return {
      // 课程信息
      courseInformation: {},
      // 表单
      formInline: {},
      // 异常
      abnormalForm: {
        qdyclx: null,
        ycyy: null,
        remark: null
      },
      dialogVisible: false,
      // 查看头像
      seeImg: true,
      // 未签到数据
      noSignItem: [],
      // 已经签到数据
      alreadySignedItem: [],
      // 签到异常
      abnormalSignItem: [],
      // 全选复制
      selectAllData: false,
      // 签到异常类型
      stuCheckIN: [],
      // 标记里的签到异常类型
      signStuCheckIN: [],
      // 签到id 集合
      stuQdIds: [],
      weeksOptions: [],
      statusOptions: []
    };
  },
  created() {
    this.courseInformation = JSON.parse(this.$route.query.query);
    this.courseInformation.kssj = this.courseInformation.sksj
      .split("-")[2]
      .replace(/[(]|[)]/g, "");
    this.courseInformation.jssj = this.courseInformation.sksj
      .split("-")[3]
      .replace(/[(]|[)]/g, "");
    this.courseInformation.kcType = this.courseInformation.sksj.split("-")[1];
    this.courseInformation.rq = this.courseInformation.sksj.split("-")[0];
    this.getDicts("kc_type").then(res => {
      this.statusOptions = res.data;
      this.statusOptions.forEach(value => {
        if (value.dictValue == this.courseInformation.kcType) {
          this.courseInformation.kcTypeName = value.dictLabel;
        }
      });
    });
    this.getDicts("weeks").then(res => {
      this.weeksOptions = res.data;
      this.weeksOptions.forEach(value => {
        if (value.dictValue == this.courseInformation.rq) {
          this.courseInformation.rqName = value.dictLabel;
        }
      });
    });
    this.getDicts("stuYcChenIn").then(response => {
      this.stuCheckIN = response.data;
      //克隆一份
      response.data = JSON.parse(JSON.stringify(response.data));
      //只留异常的
      for (let i = 0; i < response.data.length; i++) {
        if (
          response.data[i].dictLabel == "未签到" ||
          response.data[i].dictLabel == "正常" ||
          response.data[i].dictLabel == "迟到"
        ) {
          response.data.splice(i, 1);
          i--;
        }
      }
      this.signStuCheckIN = response.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 查学生
    getList() {
      console.log(this.courseInformation);
      stuQiandaoHomePageQuery({
        bjid: this.courseInformation.rybjid,
        kbxqid: this.courseInformation.dqkcid,
        kcType: this.courseInformation.kcType,
        xq: this.courseInformation.rq
      }).then(res => {
        this.noSignItem = res.data.wqdList;
        this.abnormalSignItem = res.data.ycList;
        this.alreadySignedItem = res.data.yqdList;
        this.abnormalSignItem.map(value => {
          value.qdsj = value.qdsj.slice(0, 5);
          this.stuCheckIN.forEach(content => {
            if (value.qdyclx == content.dictValue) {
              value.qdyclxName = content.dictLabel;
            }
          });
        });
        this.selectAll();
      });
    },
    // 全选
    selectAll() {
      this.selectAllData = !this.selectAllData;
      this.noSignItem.map(value => {
        value.checkbox = this.selectAllData;
      });
      this.abnormalSignItem.map(value => {
        value.checkbox = this.selectAllData;
      });
      this.alreadySignedItem.map(value => {
        value.checkbox = this.selectAllData;
      });
    },
    //签到
    signIn() {
      this.getStuQdIds();
      if (this.stuQdIds.length > 0) {
        batchCheckIn({ stuQdIds: this.stuQdIds }).then(res => {
          if (res.code == 200) {
            this.getList();
            this.msgSuccess("签到成功");
          } else {
            this.msgError("签到失败");
          }
        });
      } else {
        this.msgError("请选择签到学生");
      }
    },
    // 弹出标记框
    showAbnormal() {
      this.getStuQdIds();
      if (this.stuQdIds.length == 0) {
        this.msgError("请选择学生");
        return;
      }
      this.dialogVisible = true;
      this.abnormalForm = {};
    },
    // 异常添加
    addAbnormal() {
      this.dialogVisible = false;
      this.getStuQdIds();
      batchYiChang(
        Object.assign({ stuQdIds: this.stuQdIds }, this.abnormalForm)
      ).then(res => {
        if (res.code == 200) {
          this.getList();
          this.msgSuccess("异常签到标记成功");
        }
      });
    },
    // 获取选中学生id
    getStuQdIds() {
      this.stuQdIds = [];
      this.noSignItem.forEach((value, index) => {
        if (value.checkbox) {
          this.stuQdIds.push(value.stuQdId);
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
      font-size: 14px;
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
            font-size: 14px;
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
      font-size: 14px;
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
