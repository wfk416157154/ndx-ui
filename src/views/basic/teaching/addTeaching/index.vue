<template>
  <div class="add-teaching">
    <div class="wrap-header">
      <div class="left-from">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-row>
            <el-col :span="11">
              <el-form-item label="校区" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="开班时间" prop="name">
                <el-date-picker v-model="ruleForm.value1" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="日语班级" prop="name">
                <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="高考时间" prop="name">
                <el-date-picker v-model="ruleForm.value1" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="老师姓名" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="班级人数" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="原有效课时" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="现有效课时" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="总复习" prop="name">
                <el-checkbox v-model="checked">备选项</el-checkbox>
                <el-checkbox v-model="checked">备选项</el-checkbox>
                <el-checkbox v-model="checked">备选项</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="系数" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="教学计划模板" prop="name">
                <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="dialogTableVisible = true">点击查看该班课表</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right-tabel">
        <div>
          <el-button type="primary" @click="dialogFormVisible = true">添加</el-button>
        </div>
        <div>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column label="名称" width="120">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column label="开始日期" width="120">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>姓名: {{ scope.row.name }}</p>
                  <p>住址: {{ scope.row.address }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="结束日期" width="120">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>姓名: {{ scope.row.name }}</p>
                  <p>住址: {{ scope.row.address }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog title="添加" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="名称" label-width="120px">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" label-width="120px">
              <el-date-picker v-model="form.value1" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" label-width="120px">
              <el-date-picker v-model="form.value1" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div style="width : 100%;text-align : center;margin: 20px 0px">
      <el-button type="primary">生成教学计划</el-button>
      <el-button type="info">更新教学计划</el-button>
    </div>
    <div class="wrap-teaching-content">
      <div class="teaching-top-tar">
        <div>
          <h4>生成计划</h4>
        </div>
        <div style="display : flex; align-items: center;">
          <div style="margin-right : 20px">
            <h5>教学计划</h5>
          </div>
          <div>
            <span
              style="cursor: pointer;"
              :class="['SemesterView' == ifContent ? 'active-color' : '']"
              @click="toComponent('SemesterView')"
            >学期</span>
            <el-divider direction="vertical"></el-divider>
            <span
              style="cursor: pointer;"
              :class="['MonthView' == ifContent ? 'active-color' : '']"
              @click="toComponent('MonthView')"
            >月</span>
            <el-divider direction="vertical"></el-divider>
            <span
              style="cursor: pointer;"
              :class="['WholeView' == ifContent ? 'active-color' : '']"
              @click="toComponent('WholeView')"
            >全部</span>
          </div>
        </div>
      </div>
      <div class="teaching-content-item">
        <SemesterView v-if="'SemesterView' == ifContent" />
        <MonthView v-if="'MonthView' == ifContent" />
        <WholeView v-if="'WholeView' == ifContent" />
      </div>
    </div>

    <el-dialog title="课表" :visible.sync="dialogTableVisible">
      <el-table :data="gridData" border>
        <el-table-column property="date" label="日期" width="150"></el-table-column>
        <el-table-column property="name" label="姓名" width="200"></el-table-column>
        <el-table-column property="address" label="地址"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SemesterView from "./components/semesterView";
import MonthView from "./components/monthView";
import WholeView from "./components/wholeView";
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogTableVisible: false,
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      form: {},
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
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
      ],
      ifContent: null
    };
  },
  components: {
    SemesterView,
    MonthView,
    WholeView
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    // 组件
    toComponent(value) {
      this.ifContent = value;
    }
  }
};
</script>


<style lang="scss">
.add-teaching {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  .wrap-header {
    width: 100%;
    -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 1px solid #e6ebf5;
    display: flex;
    justify-content: space-between;
    .left-from {
      width: 65%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      // background: burlywood;
    }
    .right-tabel {
      width: 35%;
      height: 100%;
      // background: cornflowerblue;
      padding: 20px;
      box-sizing: border-box;
    }
  }
  .wrap-teaching-content {
    width: 100%;
    // height: 400px;
    -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 1px solid #e6ebf5;
    padding: 20px 30px;
    box-sizing: border-box;
    .teaching-top-tar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .active-color {
        color: #409eff;
      }
    }
    .teaching-content-item {
      width: 100%;
    }
  }
}
</style>
