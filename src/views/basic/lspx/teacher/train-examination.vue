<template>
  <div class="train-examination">
    <div class="content">
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
      wenda: []
    };
  },
  created() {
    this.studyList = JSON.parse(this.$route.query.list);
    topicTypeList({ sjid: this.studyList.id }).then(res => {
      this.getTrainPaperTopicListTem = res.data;
    });
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
          value.sjid = this.studyList.id;
        }
      });
      if (count == 0) {
        this.getTrainPaperTopicListTemForm.danxuan.push({
          index,
          tmid: item.tmid,
          content: item.kzzd1,
          tmlx: rows.tmlx,
          sjid: this.studyList.id
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
          value.sjid = this.studyList.id;
        }
      });
      if (count == 0) {
        this.getTrainPaperTopicListTemForm.panduan.push({
          index,
          tmid: item.tmid,
          content: item.kzzd1,
          tmlx: rows.tmlx,
          sjid: this.studyList.id
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
            sjid: this.studyList.id,
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
            sjid: this.studyList.id,
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
            tmlx: value.tmlx,
            sjid: this.studyList.id
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
      console.log(resultArr);
      if (resultArr.length == 0) {
        this.msgError("提示 : 不能交白卷,请认真作答");
        return;
      } else {
        handPaper(resultArr).then(res => {
          this.msgSuccess(res.msg);
          this.reset();
          this.$router.go(-1);
        });
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
  }
}
</style>
