<template>
  <div class="train-examination">
    <div class="content">
      <!-- <div class="count">
        考试剩余时间 :
        <span>{{h}}</span> :
        <span>{{m}}</span> :
        <span>{{s}}</span>
      </div>-->
      <div class="single-choice" v-if="getTrainPaperTopicListTem.danxuan.length > 0">
        <h2>单选题</h2>
        <div>
          <ul>
            <li v-for="(item,index) in getTrainPaperTopicListTem.danxuan" :key="index">
              <div style="display : flex ;justify-content: space-between;">
                <h3 style="width : 95%">{{++index}} ) {{item.tmbt}}</h3>
                <h4>{{item.tmfz}} 分</h4>
              </div>
              <div
                class="answer"
                @click="danxuanFun(list,index,item)"
                v-for="(list,j) in item.optionList"
                :key="j"
              >
                <el-radio-group v-model="danxuan[index]">
                  <el-radio :label="list.kzzd1">
                    <span>{{list.kzzd1}} {{list.xxbt}}</span>
                  </el-radio>
                </el-radio-group>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="judgment-question" v-if="getTrainPaperTopicListTem.panduan.length > 0">
        <h2>判断题</h2>
        <div>
          <ul>
            <li v-for="(item,index) in getTrainPaperTopicListTem.panduan" :key="index">
              <div style="display : flex ;justify-content: space-between;">
                <h3 style="width : 95%">{{++index}} ) {{item.tmbt}}</h3>
                <h4>{{item.tmfz}} 分</h4>
              </div>
              <div
                class="answer"
                @click="panduanFun(list,index,item)"
                v-for="(list,j) in item.optionList"
                :key="j"
              >
                <el-radio-group v-model="panduan[index]">
                  <el-radio :label="list.kzzd1">{{list.kzzd1}} {{list.xxbt}}</el-radio>
                </el-radio-group>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="blanks-topic" v-if="getTrainPaperTopicListTem.tiankong.length > 0">
        <h2>填空题</h2>
        <div>
          <ul>
            <li v-for="(item,index) in getTrainPaperTopicListTem.tiankong" :key="index">
              <div style="display : flex ;justify-content: space-between;">
                <h3 style="width : 95%">{{++index}} ) {{item.tmbt}}</h3>
                <h4>{{item.tmfz}} 分</h4>
              </div>
              <div>
                <ul>
                  <li
                    style="margin : 20px 0px;align-items : center"
                    v-for="(list,j) in item.optionList"
                    :key="j"
                  >
                    <div>
                      <el-form>
                        <el-form-item :label="list.kzzd1" label-width="70px">
                          <el-input
                            @change="tiankongFun(list,index,j,item)"
                            v-model="list['content']"
                          ></el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="questions-answers" v-if="getTrainPaperTopicListTem.wenda.length > 0">
        <h2>问答题</h2>
        <div>
          <ul>
            <li v-for="(item,index) in getTrainPaperTopicListTem.wenda" :key="index">
              <div style="display : flex ;justify-content: space-between;">
                <h3 style="width : 95%">{{++index}} ) {{item.tmbt}}</h3>
                <div>
                  <h4>{{item.tmfz}} 分</h4>
                </div>
              </div>
              <div class="answer">
                <h3>答题区</h3>
                <editor v-model="item['content']" :min-height="300" />
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div style="text-align : center">
        <el-button type="primary" @click="testPaperSubmit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { topicTypeList, handPaper } from "@/api/basic/trainPaper";
export default {
  data() {
    return {
      studyList: {},
      getTrainPaperTopicListTem: {
        danxuan: [],
        panduan: [],
        tiankong: [],
        wenda: []
      },
      getTrainPaperTopicListTemForm: {
        danxuan: [],
        panduan: [],
        tiankong: [],
        wenda: []
      },
      danxuan: [],
      panduan: [],
      tiankong: [],
      wenda: [],
      h: 0,
      m: 1,
      s: 5,
      endTime: null,
      timer: null,
      examinationTime: null,
      examinationEndTime: null
    };
  },
  created() {
    this.studyList = JSON.parse(this.$route.query.list);
    topicTypeList({ sjid: this.studyList.id }).then(res => {
      this.getTrainPaperTopicListTem = res.data;
    });
  },
  mounted() {
    let oldTime = new Date().getTime();
    this.endTime = oldTime + 60 * 1000 * 120;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.s -= 1;
      if (this.m && this.s == 0) {
        this.m -= 1;
        this.s = 59;
      }
      if (this.h && this.m == 0) {
        this.h -= 1;
        this.m = 59;
      }
      if (this.h == 0 && this.m == 0 && this.s == 0) {
        clearInterval(this.timer);
        // this.testPaperSubmit();
      }
      this.getNewDate();
    }, 1000);
    this.examinationTime = new Date().getTime();
    // console.log(this.examinationTime);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    // this.testPaperSubmit();
  },
  methods: {
    danxuanFun(item, index, rows) {
      let count = 0;
      this.getTrainPaperTopicListTemForm.danxuan.forEach(value => {
        if (value.index == index) {
          ++count;
          value.tmid = item.tmid;
          value.content = item.kzzd1;
          value.tmlx = rows.tmlx;
        }
      });
      if (count == 0) {
        this.getTrainPaperTopicListTemForm.danxuan.push({
          index,
          tmid: item.tmid,
          content: item.kzzd1,
          tmlx: rows.tmlx
        });
      }
    },
    panduanFun(item, index, rows) {
      let count = 0;
      this.getTrainPaperTopicListTemForm.panduan.forEach(value => {
        if (value.index == index) {
          ++count;
          value.tmid = item.tmid;
          value.content = item.kzzd1;
          value.tmlx = rows.tmlx;
        }
      });
      if (count == 0) {
        this.getTrainPaperTopicListTemForm.panduan.push({
          index,
          tmid: item.tmid,
          content: item.kzzd1,
          tmlx: rows.tmlx
        });
      }
    },
    tiankongFun(item, index, j, rows) {
      if (this.tiankong.length == 0) {
        if (item.content && item) {
          this.tiankong.push({
            index: index,
            optionId: item.id,
            j: j,
            tmid: item.tmid,
            tmlx: rows.tmlx,
            ["content"]: item.content
          });
        }
      } else {
        let count = 0;
        this.tiankong.forEach(value => {
          if (value.index == index && value.j == j) {
            value["content"] = item.content;
            ++count;
          }
        });
        if (count == 0) {
          this.tiankong.push({
            index: index,
            optionId: item.id,
            j: j,
            tmid: item.tmid,
            tmlx: rows.tmlx,
            ["content"]: item.content
          });
        }
      }
      for (let index = 0; index < this.tiankong.length; index++) {
        if (!this.tiankong[index].content) {
          this.tiankong.splice(index, 1);
        }
      }
      this.getTrainPaperTopicListTemForm.tiankong = this.tiankong;
    },
    reset() {
      this.getTrainPaperTopicListTemForm = {
        danxuan: [],
        panduan: [],
        tiankong: [],
        wenda: []
      };
      (this.danxuan = []),
        (this.panduan = []),
        (this.tiankong = []),
        (this.wenda = []);
    },
    testPaperSubmit() {
      this.getTrainPaperTopicListTem.wenda.forEach(value => {
        if (value.content) {
          this.getTrainPaperTopicListTemForm.wenda.push({
            content: value.content,
            tmid: value.id,
            tmlx: value.tmlx
          });
        }
      });
      let {
        danxuan,
        panduan,
        tiankong,
        wenda
      } = this.getTrainPaperTopicListTemForm;
      let resultArr = [];
      resultArr = resultArr.concat(danxuan, panduan, tiankong, wenda);
      // if (resultArr.length == 0) {
      //   this.msgError("提示 : 不能交白卷,请认真作答");
      //   return;
      // } else {
      this.examinationEndTime = new Date().getTime();
      let date = (
        (this.examinationEndTime - this.examinationTime) /
        60000
      ).toFixed(2);
      handPaper({
        sjid: this.studyList.paperId,
        allocateId: this.studyList.allocateId,
        param: resultArr,
        examinationTime: date.toString()
      }).then(res => {
        this.msgSuccess(res.msg);
        this.reset();
        this.$router.go(-1);
      });
      // }
    },
    getNewDate() {
      let time = new Date().getTime();
      if (this.endTime <= time) {
        clearInterval(this.timer);
        // this.testPaperSubmit();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.train-examination {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  .content {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    .single-choice {
      ul {
        list-style: none;
        li {
          .answer {
            margin: 30px;
          }
        }
      }
    }
    .judgment-question {
      ul {
        list-style: none;
        li {
          .answer {
            margin: 30px;
          }
        }
      }
    }
    .blanks-topic {
      ul {
        list-style: none;
      }
    }
    .questions-answers {
      ul {
        list-style: none;
      }
    }
    .count {
      // float: right;
      position: fixed;
      top: 80px;
      right: 50px;
      z-index: 1000;
      width: 260px;
      height: 50px;
      color: #fff;
      text-align: center;
      line-height: 50px;
      background-color: #000;
      // opacity: .6;
      border: 1px solid #fff;
      box-shadow: 5px 5px 5px #888888;
    }
  }
}
</style>
