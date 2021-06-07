<template>
  <div class="trainIndex">
    <el-form :model="queryParams" ref="trainIndex" :inline="true" label-width="68px">
      <el-form-item label="参训人" prop="xxmc">
        <el-input
          v-model="queryParams.cxr"
          placeholder="请输入学校名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label-width="100px" label="状态" prop="xqfzr">
        <el-select v-model="queryParams.remark">
          <el-option
            v-for="item in whetherList"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 培训主页table -->
    <el-table :data="teacherList">
      <el-table-column label="参训人" align="center" prop="cxr" />
      <el-table-column label="培训时间" align="center" prop="pxsj" />
      <el-table-column label="实习班级" align="center" prop="sxbj" />
      <el-table-column label="上岗班级" align="center" prop="sgbj" />
      <el-table-column label="培训目标" align="center" prop="pxmb" />
      <el-table-column label="培训要求" align="center" prop="pxyq" />
      <el-table-column label="培训状态" :formatter="getResult" align="center" prop="zt" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        width="200px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="getTrainIndex(scope.row)"
            v-hasPermi="['basic:school:edit']"
          >查看培训内容</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="trainIndexUpdate(scope.row)"
            v-hasPermi="['basic:school:edit']"
          >修改</el-button>>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal="false" title="培训内容确认表" :visible.sync="lastDialogFormVisible">
      <table border="1" cellspacing="0">
        <thead style="width : 900px">
          <tr>
            <th
              style="width : 455px ; height : 80px; background-color : #eee; font-size : 20px"
            >培训项目</th>
            <th
              style="width : 455px ; height : 80px; background-color : #eee; font-size : 20px"
            >培训内容</th>
          </tr>
        </thead>
        <tbody>
          <tr align="left">
            <td style="text-align : center">认识教师岗位</td>
            <td>
              <div>
                <span>1.岗位职责</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model=" trainIndexList.oneOne ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>2.教师成长要求</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.oneTwo ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>3.南斗星公司介绍</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.oneThree ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>4.教师专业用语</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.oneFour ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
            </td>
          </tr>
          <tr align="left">
            <td style="text-align : center">班级管理规范</td>
            <td>
              <div>
                <span>1.认识班级管理重要性</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.twoOne ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>2.班级管理的规范动作</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.twoTwo ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>3.教室环境和卫生管理</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.twoThree ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>4.试听课期间的班级管理</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.twoFour ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>5.组班后的班级管理</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.twoFive ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
                <div style="padding-left : 20px ; box-sizing : border-box;">
                  <span>1)教材发放</span>
                  <el-checkbox
                    style="float : right;margin-right : 10px"
                    v-model="trainIndexList.woFiveOne ? true : false"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </div>
                <div style="padding-left : 20px ; box-sizing : border-box;">
                  <span>2)班干部的选择</span>
                  <el-checkbox
                    style="float : right;margin-right : 10px"
                    v-model="trainIndexList.twoFiveTwo ? true : false"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </div>
                <div style="padding-left : 20px ; box-sizing : border-box;">
                  <span>3)班级事务的制定</span>
                  <el-checkbox
                    style="float : right;margin-right : 10px"
                    v-model="trainIndexList.twoFiveThree ? true : false"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </div>
                <div style="padding-left : 20px ; box-sizing : border-box;">
                  <span>4)学生信息收集</span>
                  <el-checkbox
                    style="float : right;margin-right : 10px"
                    v-model="trainIndexList.twoFiveFour ? true : false"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </div>
                <div style="padding-left : 20px ; box-sizing : border-box;">
                  <span>5)学生退班</span>
                  <el-checkbox
                    style="float : right;margin-right : 10px"
                    v-model="trainIndexList.twoFiveFive ? true : false"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </div>
                <div style="padding-left : 20px ; box-sizing : border-box;">
                  <span>6）学生中途进班</span>
                  <el-checkbox
                    style="float : right;margin-right : 10px"
                    v-model="trainIndexList.kzzd1 ? true : false"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </div>
              </div>
            </td>
          </tr>
          <tr align="left">
            <td style="text-align : center">班级管理规范</td>
            <td>
              <div>
                <span>1.教学要求</span>
                <div style="padding-left : 20px ; box-sizing : border-box;">
                  <span>1)教资教态与板书</span>
                  <el-checkbox
                    style="float : right;margin-right : 10px"
                    v-model="trainIndexList.threeOneOne ? true : false"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </div>
                <div style="padding-left : 20px ; box-sizing : border-box;">
                  <span>2)教材，课表和课时安排</span>
                  <el-checkbox
                    style="float : right;margin-right : 10px"
                    v-model="trainIndexList.threeOneTwo ? true : false"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </div>
                <div style="padding-left : 20px ; box-sizing : border-box;">
                  <span>3)教参与视频课</span>
                  <el-checkbox
                    style="float : right;margin-right : 10px"
                    v-model="trainIndexList.threeOneThree ? true : false"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </div>
                <div style="padding-left : 20px ; box-sizing : border-box;">
                  <span>4)教学模式</span>
                  <el-checkbox
                    style="float : right;margin-right : 10px"
                    v-model="trainIndexList.threeOneFour ? true : false"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </div>
                <div style="padding-left : 20px ; box-sizing : border-box;">
                  <span>5)课堂用语</span>
                  <el-checkbox
                    style="float : right;margin-right : 10px"
                    v-model="trainIndexList.threeOneFive ? true : false"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </div>
                <div style="padding-left : 20px ; box-sizing : border-box;">
                  <span>6)作业布置</span>
                  <el-checkbox
                    style="float : right;margin-right : 10px"
                    v-model="trainIndexList.threeOneSix ? true : false"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </div>
                <div style="padding-left : 20px ; box-sizing : border-box;">
                  <span>7)兴趣教学活动的开展</span>
                  <el-checkbox
                    style="float : right;margin-right : 10px"
                    v-model="trainIndexList.threeOneSeven ? true : false"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </div>
                <div style="padding-left : 20px ; box-sizing : border-box;">
                  <span>8)考试制度</span>
                  <el-checkbox
                    style="float : right;margin-right : 10px"
                    v-model="trainIndexList.threeOneEight ? true : false"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </div>
              </div>
              <div>
                <span>2. 高考真题测试</span>
                <div>
                  <input type="text" v-model="trainIndexList.threeTwo" />
                  <button style="margin-left : 20px">请输入成绩</button>
                </div>
              </div>
              <div>
                <span>3. 宣讲和问答</span>
                <div>
                  <textarea
                    name="description"
                    id="description"
                    v-model="trainIndexList.threeThree"
                    cols="60"
                    rows="5"
                  ></textarea>
                </div>
              </div>
              <div>
                <span>4. 试听课第一节</span>
                <div>
                  <textarea
                    name="description"
                    id="description"
                    v-model="trainIndexList.threeFour"
                    cols="60"
                    rows="5"
                  ></textarea>
                </div>
              </div>
              <div>
                <span>5. 试听课第二节</span>
                <div>
                  <textarea
                    name="description"
                    id="description"
                    v-model="trainIndexList.threeFive"
                    cols="60"
                    rows="5"
                  ></textarea>
                </div>
              </div>
              <div>
                <span>6. 某篇课文的教案</span>
                <div>
                  <textarea
                    name="description"
                    id="description"
                    v-model="trainIndexList.threeSix"
                    cols="60"
                    rows="5"
                  ></textarea>
                </div>
              </div>
            </td>
          </tr>
          <tr align="left">
            <td style="text-align : center">公司管理规范</td>
            <td>
              <div>
                <span>1.请假制度</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.fourOne ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>2.工作汇报</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.fourTwo ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>3.教学总结和教学简报</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.fourThree ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>4.绩效考核</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.fourFour ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>5.督导组</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.fourFive ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>6.保密制度和奖金发放</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.fourSix ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>7.财务制度</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.fourSeven ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>8.APP及后台操作</span>
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.fourEight ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
            </td>
          </tr>
          <tr align="left">
            <td style="text-align : center">资料包领取</td>
            <td>
              <div>
                <span>教材</span>
                <br />
                <input type="text" v-model="trainIndexList.fiveOne" placeholder="请输入教材名称" />
              </div>
              <div>
                <span>扩音器</span>
                <br />
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.fiveTwo ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>试听手册</span>
                <br />
                <el-checkbox
                  style="float : right;margin-right : 10px"
                  v-model="trainIndexList.fiveThree ? true : false"
                  :true-label="1"
                  :false-label="0"
                ></el-checkbox>
              </div>
              <div>
                <span>相关文件</span>
                <br />
                <input type="text" v-model="trainIndexList.fiveFour" placeholder="请输入相关文件名称" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="contentSubmitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 老师列表 -->
    <el-dialog :close-on-click-modal="false" title="编辑培训老师" :visible.sync="DialogFormVisible">
      <el-form :model="trainIndexForm" ref="contentList" label-width="120px">
        <el-form-item label="参训人" label-width="120px">
          <el-input v-model="trainIndexForm.cxr" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="培训时间">
          <el-date-picker v-model="trainIndexForm.pxsj" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="实习班级">
          <el-input v-model="trainIndexForm.sxbj"></el-input>
        </el-form-item>
        <el-form-item label="上岗班级">
          <el-input v-model="trainIndexForm.sgbj"></el-input>
        </el-form-item>
        <el-form-item label="培训目标">
          <el-input v-model="trainIndexForm.pxmb"></el-input>
        </el-form-item>
        <el-form-item label="培训要求">
          <el-input v-model="trainIndexForm.pxyq"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="trainIndexForm.pxzt" placeholder="请选择状态">
            <el-option
              v-for="item in whetherList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="trainIndexForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTeacherTrain, updateTeacherTrain } from "@/api/basic/teacherTrain";
import {
  listStaticform,
  getStaticform,
  delStaticform,
  addStaticform,
  updateStaticform
} from "@/api/basic/staticform";
export default {
  data() {
    return {
      dialogVisible: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cxr: null,
        remark: null
      },
      form: {},
      // 初试结果
      resultList: [],
      // 主页数据列表
      trainIndexList: {
        id: null,
        glid: null,
        oneOne: null,
        oneTwo: null,
        oneThree: null,
        oneFour: null,
        oneFive: null,
        twoOne: null,
        twoTwo: null,
        twoThree: null,
        twoFour: null,
        twoFive: null,
        twoFiveOne: null,
        twoFiveTwo: null,
        twoFiveThree: null,
        twoFiveFour: null,
        twoFiveFive: null,
        kzzd1: null,
        threeOne: null,
        threeOneOne: null,
        threeOneTwo: null,
        threeOneThree: null,
        threeOneFour: null,
        threeOneFive: null,
        threeOneSix: null,
        threeOneSeven: null,
        threeOneEight: null,
        threeTwo: null,
        threeThree: null,
        threeFour: null,
        threeFive: null,
        threeSix: null,
        threeSeven: null,
        threeEight: null,
        fourOne: null,
        fourTwo: null,
        fourThree: null,
        fourFour: null,
        fourFive: null,
        fourSix: null,
        fourSeven: null,
        fourEight: null,
        fiveOne: null,
        fiveTwo: null,
        fiveThree: null,
        fiveFour: null,
        fiveFive: null,
        fiveSix: null,
        fiveSeven: null,
        fiveEight: null,
        userId: null,
        userName: null,
        dataOrder: null,
        createTime: null,
        updateTime: null,
        kzzd1: null,
        kzzd2: null,
        kzzd3: null,
        kzzd4: null,
        kzzd5: null
      },
      // 遮罩
      lastDialogFormVisible: false,
      DialogFormVisible: false,
      // 状态
      whetherList: [],
      // 老师列表
      teacherList: [],
      // 老师培训列表form
      trainIndexForm: {
        cxr: "",
        pxsj: "",
        sxbj: "",
        sgbj: "",
        pxmb: "",
        pxyq: "",
        pxzt: "",
        remark: ""
      }
    };
  },
  created() {
    this.getDicts("tea_per_type").then(res => {
      this.whetherList = res.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      listTeacherTrain(this.queryParams).then(res => {
        this.teacherList = res.rows;
      });
    },
    // 提交按钮
    contentSubmitForm() {
      console.log(this.trainIndexList.id);
      if (this.trainIndexList.id != null) {
        updateStaticform(this.trainIndexList).then(res => {
          this.$notify({
            title: "成功",
            message: res.msg,
            type: "success"
          });
          this.lastDialogFormVisible = false;
          this.getList();
        });
      } else {
        addStaticform(this.trainIndexList).then(res => {
          console.log(res);
          this.$notify({
            title: "成功",
            message: res.msg,
            type: "success"
          });
          this.lastDialogFormVisible = false;
          this.getList();
        });
      }
    },
    // 查询参训人
    handleQuery() {},
    // 查看培训内容
    getTrainIndex(row) {
      this.lastDialogFormVisible = true;
      this.queryParams.glid = row.id;
      this.trainIndexList.glid = row.id;
      listStaticform(this.queryParams).then(res => {
        if (res.rows && res.rows.length > 0) {
          this.trainIndexList = res.rows[0];
          this.trainIndexList.glid = row.id;
        }
        console.log(res);
      });
    },
    // 编辑
    trainIndexUpdate(row) {
      this.DialogFormVisible = true;
      this.trainIndexForm = row;
    },
    // 取消按钮
    cancel() {
      this.DialogFormVisible = false;
      this.lastDialogFormVisible = false;
      this.reset();
    },
    // 培训老师提交按钮
    submitForm() {
      updateTeacherTrain(this.trainIndexForm).then(res => {
        if (res.code == 200) {
          this.DialogFormVisible = false;
          this.getList();
          this.$notify({
            title: "成功",
            message: res.msg,
            type: "success"
          });
        }
      });
    },
    // 状态字典翻译 状态
    getResult(row, column) {
      return this.selectDictLabel(this.whetherList, row.pxzt);
    },
    //置空
    reset() {
      trainIndexList = {
        id: null,
        glid: null,
        oneOne: null,
        oneTwo: null,
        oneThree: null,
        oneFour: null,
        oneFive: null,
        twoOne: null,
        twoTwo: null,
        twoThree: null,
        twoFour: null,
        twoFive: null,
        twoFiveOne: null,
        twoFiveTwo: null,
        twoFiveThree: null,
        twoFiveFour: null,
        twoFiveFive: null,
        kzzd1: null,
        threeOne: null,
        threeOneOne: null,
        threeOneTwo: null,
        threeOneThree: null,
        threeOneFour: null,
        threeOneFive: null,
        threeOneSix: null,
        threeOneSeven: null,
        threeOneEight: null,
        threeTwo: null,
        threeThree: null,
        threeFour: null,
        threeFive: null,
        threeSix: null,
        threeSeven: null,
        threeEight: null,
        fourOne: null,
        fourTwo: null,
        fourThree: null,
        fourFour: null,
        fourFive: null,
        fourSix: null,
        fourSeven: null,
        fourEight: null,
        fiveOne: null,
        fiveTwo: null,
        fiveThree: null,
        fiveFour: null,
        fiveFive: null,
        fiveSix: null,
        fiveSeven: null,
        fiveEight: null,
        userId: null,
        userName: null,
        dataOrder: null,
        createTime: null,
        updateTime: null,
        kzzd1: null,
        kzzd2: null,
        kzzd3: null,
        kzzd4: null,
        kzzd5: null
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.trainIndex {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
}
</style>