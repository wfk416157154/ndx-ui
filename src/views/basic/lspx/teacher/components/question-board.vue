<template>
  <div class="question-board">
    <div class="title">答题详情</div>
    <div class="content">
      <div class="single-choice">
        <h2>单选题</h2>
        <div>
          <ul>
            <li v-for="(item,index) in subjectData.topicList1" :key="index">
              <h3>{{item.tmbt}}</h3>
              <div class="answer">
                <el-radio-group>
                  <el-radio
                    v-for="(list,j) in item.optionList"
                    :key="j"
                    :label="list.kzzd1"
                  >{{list.kzzd1}} {{list.xxbt}}</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div style="margin: 10px 0px">
                  <span>填写答案 :</span>
                  <span>{{item.txda}}</span>
                </div>
                <!-- <div style="margin: 10px 0px">
                  <span>正确答案 :</span>
                  <span>{{item.tmda}}</span>
                </div> -->
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="judgment-question">
        <h2>判断题</h2>
        <div>
          <ul>
            <li v-for="(item,index) in subjectData.topicList2" :key="index">
              <h3>{{item.tmbt}}</h3>
              <div class="answer">
                <el-radio-group>
                  <el-radio
                    v-for="(list,j) in item.optionList"
                    :key="j"
                    :label="list.kzzd1"
                  >{{list.kzzd1}} {{list.xxbt}}</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div style="margin: 10px 0px">
                  <span>填写答案 :</span>
                  <span>{{item.txda}}</span>
                </div>
                <!-- <div style="margin: 10px 0px">
                  <span>正确答案 :</span>
                  <span>{{item.tmda}}</span>
                </div> -->
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="blanks-topic">
        <h2>填空题</h2>
        <div>
          <ul>
            <li v-for="(item,index) in subjectData.topicList3" :key="index">
              <h3>{{item.tmbt}}</h3>
              <div>
                <ul>
                  <li style="margin : 20px 0px;align-items : center">
                    <div>
                      <el-form>
                        <div v-for="(list,j) in item.optionList" :key="j">
                          <el-form-item :label="list.kzzd1" label-width="70px">
                            <el-input v-model="list.txda" placeholder="未答" disabled></el-input>
                          </el-form-item>
                          <!-- <el-form-item label="正确答案" label-width="70px">
                            <el-input v-model="list.xxda" placeholder="未答" disabled></el-input>
                          </el-form-item> -->
                        </div>
                      </el-form>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="questions-answers">
        <h2>问答题</h2>
        <div>
          <ul>
            <li v-for="(item,index) in subjectData.topicList4" :key="index">
              <h3>{{item.tmbt}}</h3>
              <div class="answer">
                <div>
                  <p>答题</p>
                  <editor v-model="item.txda" :disabled="true" :min-height="300" />
                </div>
                <div>
                  <p>评语</p>
                  <editor v-model="item.remark" :disabled="true" :min-height="300" />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: null
    };
  },
  props: ["subjectData"]
};
</script>

<style lang="scss" scoped>
.question-board {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background-color: #fff;
  .title {
    font-size: 18px;
  }
  .content {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
    // box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
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
