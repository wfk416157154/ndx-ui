<template>
  <div class="question-board">
    <div class="title">答题详情</div>
    <div class="content">
      <div class="single-choice">
        <h2>单选题</h2>
        <div>
          <ul>
            <li>
              <h3>1) 试卷清晰，单题单答，且有答题卡，可检查漏答题目或修改答案</h3>
              <div class="answer">
                <el-radio-group v-model="radio">
                  <el-radio :label="3">A备选项</el-radio>
                  <el-radio :label="6">B备选项</el-radio>
                  <el-radio :label="9">C备选项</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div style="margin: 10px 0px">
                  <span>填写答案 :</span>
                  <span>A</span>
                </div>
                <div style="margin: 10px 0px">
                  <span>正确答案 :</span>
                  <span>A</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="judgment-question">
        <h2>判断题</h2>
        <div>
          <ul>
            <li>
              <h3>1) 试卷清晰，单题单答，且有答题卡，可检查漏答题目或修改答案</h3>
              <div class="answer">
                <el-radio-group v-model="radio">
                  <el-radio :label="3">A备选项</el-radio>
                  <el-radio :label="6">B备选项</el-radio>
                  <el-radio :label="9">C备选项</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div style="margin: 10px 0px">
                  <span>填写答案 :</span>
                  <span>A</span>
                </div>
                <div style="margin: 10px 0px">
                  <span>正确答案 :</span>
                  <span>A</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="blanks-topic">
        <h2>填空题</h2>
        <div>
          <ul>
            <li>
              <div>1) , 试卷清晰，1 单题单答，2 且有答题卡，3 可检查漏答题目或修改答案</div>
              <div>
                <ul>
                  <li style="margin : 20px 0px;align-items : center">
                    <div>
                      <el-form>
                        <el-form-item label="第一空" label-width="70px">
                          <el-input v-model="formInline" placeholder="未答" disabled></el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                  </li>
                  <li style="margin : 20px 0px;align-items : center">
                    <div>
                      <el-form>
                        <el-form-item label="第二空" label-width="70px">
                          <el-input v-model="formInline" placeholder="未答" disabled></el-input>
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
      <div class="questions-answers">
        <h2>问答题</h2>
        <div>
          <ul>
            <li>
              <h3>1) くらいではありません（くらい（这点，这些，表示程度小，数量少）。不是这么点）</h3>
              <div class="answer">
                <div>
                  <p>答题</p>
                  <editor v-model="getKscjzj" :disabled="true" :min-height="300" />
                </div>
                <div>
                  <p>评语</p>
                  <editor v-model="getKscjzj" :disabled="true" :min-height="300" />
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
    return {};
  }
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
