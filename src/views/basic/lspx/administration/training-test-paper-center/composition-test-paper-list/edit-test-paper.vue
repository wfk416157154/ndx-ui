<template>
  <div class="edit-test paper">
    <div class="train-examination">
      <div>
        <el-button type="primary" @click="getAddTestPaper">添加试卷</el-button>
      </div>
      <div class="content">
        <div class="single-choice" v-if="getTrainPaperTopicListTem.danxuan.length > 0">
          <h2>单选题</h2>
          <div>
            <ul>
              <li v-for="(item,index) in getTrainPaperTopicListTem.danxuan" :key="index">
                <h3>{{++index}} ) {{item.tmbt}}</h3>
                <div class="answer">
                  <el-radio-group>
                    <el-radio
                      disabled
                      v-for="(list,j) in item.optionList"
                      :key="j"
                      :label="3"
                    >{{list.kzzd1}} {{list.xxbt}}</el-radio>
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
                <h3>{{++index}} ) {{item.tmbt}}</h3>
                <div class="answer">
                  <el-radio-group>
                    <el-radio
                      disabled
                      v-for="(list,j) in item.optionList"
                      :key="j"
                      :label="3"
                    >{{list.kzzd1}} {{list.xxbt}}</el-radio>
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
                <h3>{{++index}} ) {{item.tmbt}}</h3>
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
                            <el-input disabled></el-input>
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
                <h3>{{++index}} ) {{item.tmbt}}</h3>
                <div class="answer">
                  <h3>答题区</h3>
                  <editor :disabled="true" :min-height="300" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="添加试卷" :visible.sync="dialogFormVisible">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="试题名称">
          <el-input v-model="queryParams.tmbt" placeholder="请输入试题名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="success">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="getTrainPaperTopicList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="题目" prop="tmbt"></el-table-column>
        <el-table-column label="题目类型" prop="tmlx" :formatter="tmlxFormat"></el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getAddTestPaper"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPaperWithTopic">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTrainPaper,
  getTrainPaper,
  delTrainPaper,
  addTrainPaper,
  updateTrainPaper,
  trainPaperTopicList,
  addPaperWithTopic,
  topicTypeList
} from "@/api/basic/trainPaper";
export default {
  name: "EditTestPaper",
  data() {
    return {
      dialogFormVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tmbt: null
      },
      total: 0,
      multipleSelection: [],
      sjid: {},
      getTrainPaperTopicList: [],
      trainPaperTopicType: [],
      getTrainPaperTopicListTem: {
        danxuan: [],
        panduan: [],
        tiankong: [],
        wenda: []
      }
    };
  },
  created() {
    this.getDicts("trainPaperTopicType").then(response => {
      this.trainPaperTopicType = response.data;
    });
    if (this.$route.query.name == "composition-test-paper-list") {
      this.sjid = this.$route.query.id;
      console.log("id", this.$route.query.id);
      this.getList();
    }
  },
  methods: {
    getList() {
      topicTypeList({ sjid: this.sjid }).then(res => {
        this.getTrainPaperTopicListTem = res.data;
      });
    },
    getAddTestPaper() {
      this.dialogFormVisible = true;
      trainPaperTopicList(this.queryParams).then(res => {
        this.getTrainPaperTopicList = res.rows;
        this.total = res.total;
      });
    },
    tmlxFormat(row, column) {
      return this.selectDictLabel(this.trainPaperTopicType, row.tmlx);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let jsonArr = [];
      this.multipleSelection.forEach(value => {
        jsonArr.push({
          sjid: this.sjid,
          tmid: value.id
        });
      });
      this.multipleSelection = jsonArr;
    },
    addPaperWithTopic() {
      addPaperWithTopic(this.multipleSelection).then(res => {
        this.msgSuccess("添加成功");
        this.getList()
        this.dialogFormVisible = false;
      });
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
