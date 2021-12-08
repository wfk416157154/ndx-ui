<template>
  <div class="edit-test paper">
    <div class="train-examination">
      <div>
        <el-button type="primary" @click="addTestPaper">添加试卷</el-button>
      </div>
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
                            <el-input v-model="formInline"></el-input>
                          </el-form-item>
                        </el-form>
                      </div>
                    </li>
                    <li style="margin : 20px 0px;align-items : center">
                      <div>
                        <el-form>
                          <el-form-item label="第二空" label-width="70px">
                            <el-input v-model="formInline"></el-input>
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
                  <h3>答题区</h3>
                  <editor v-model="getKscjzj" :min-height="300" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="添加试卷" :visible.sync="dialogFormVisible">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="全部分类">
          <el-select v-model="queryParams.region" placeholder="请选择活动区域">
            <el-option label="分类一" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="全部考点">
          <el-select v-model="queryParams.region" placeholder="请选择活动区域">
            <el-option label="分类一" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="全部题型">
          <el-select v-model="queryParams.region" placeholder="请选择活动区域">
            <el-option label="分类一" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="全部难易点">
          <el-select v-model="queryParams.region" placeholder="请选择活动区域">
            <el-option label="分类一" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EditTestPaper",
  data() {
    return {
      dialogFormVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  methods: {
    getList() {},
    addTestPaper() {
      this.dialogFormVisible = true;
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
