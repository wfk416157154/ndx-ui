<template>
  <div class="mark-exam-papers">
    <div class="subject">
      <UL style="list-style : none">
        <li v-for="(item,index) in subjectList" :key="index">
          <div>
            <p>{{++index}} ), {{item.tmbt}}</p>
          </div>
          <br />
          <div>
            <h3>答案解析</h3>
            <editor :disabled="true" v-model="item.tmda" :min-height="200" />
            <h3>填写答案</h3>
            <editor :disabled="true" v-model="item.txda" :min-height="200" />
          </div>
          <div class="score">
            <h3>评分</h3>
            <el-form label-width="80px" :rules="rules" :model="formLabelAlign">
              <el-form-item label="得分" prop="df">
                <el-input v-model="item.score"></el-input>
              </el-form-item>
              <el-form-item label="评语">
                <editor v-model="item.remark" :min-height="300" />
              </el-form-item>
            </el-form>
          </div>
        </li>
      </UL>
      <div style="text-align : center">
        <el-button type="primary" @click="saveSubmit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryPaperGradeTopicDetailList,
  batchEdit
} from "@/api/basic/trainGrade";
export default {
  data() {
    return {
      formLabelAlign: {},
      treasonPaper: {},
      rules: {
        df: [{ required: true, message: "得分不能为空" }]
      },
      subjectList: []
    };
  },
  created() {
    this.treasonPaper = JSON.parse(this.$route.query.list);
    this.getList();
  },
  methods: {
    getList() {
      queryPaperGradeTopicDetailList({
        gradeId: this.treasonPaper.id,
        tmlx: "4"
      }).then(res => {
        this.subjectList = res.data.topicList;
      });
    },
    saveSubmit() {
      let reg = /^[0-9]*$/;
      let optionArr = [];
      for (let i = 0; i < this.subjectList.length; i++) {
        if (!this.subjectList[i].score || !this.subjectList[i].remark) {
          this.msgError("请填写完整数据");
          return;
        } else {
          if (!reg.test(this.subjectList[i].score)) {
            this.msgError("得分只能输入数字");
            return;
          } else {
            optionArr.push({
              id: this.subjectList[i].id,
              score: this.subjectList[i].score,
              remark: this.subjectList[i].remark
            });
          }
        }
      }
      batchEdit(optionArr).then(res => {
        this.msgSuccess(res.msg);
        this.$router.go(-1);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.mark-exam-papers {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  .subject {
  }
  .score {
    margin-top: 40px;
  }
}
</style>
