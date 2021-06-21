<template>
  <div class="trainIndex">
    <el-form :model="queryParams" ref="trainIndex" :inline="true" label-width="68px">
      <el-form-item label="参训人" prop="xxmc">
        <el-input v-model="queryParams.cxr" placeholder="请输入学校名称" clearable size="small" />
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
            v-hasPermi="['basic:teacherTrain:edit']"
          >查看培训内容</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="trainIndexUpdate(scope.row)"
            v-hasPermi="['basic:teacherTrain:edit']"
          >修改</el-button>>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :close-on-click-modal="false"
      :title="themeName"
      :visible.sync="lastDialogFormVisible"
    >
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
          <tr align="left" v-for="(item,index) in projectList.trainProjectList" :key="index">
            <td style="text-align : center">{{item.pxxm}}</td>
            <td style="padding: 5px; box-sizing: border-box">
              <!-- 培训内容集合 -->
              <div v-for="(items,j) in item.pxnrList" :key="j">
                <span
                  style="margin: 10px 10px;display : inline-block"
                  v-if="items.sjpxnrid == null"
                >{{j + 1}} {{items.pxnr}}</span>
                <span
                  style="margin : 10px 10px;display : inline-block"
                  v-else
                >{{j + 1}} {{items.pxnr}}</span>
                <el-checkbox
                  v-if="items.zjmc == '1'"
                  style="float : right;margin-right : 10px; margin : 10px 10px;"
                  v-model="trainIndexList[index + '' + j]"
                  :true-label="1"
                  :false-label="0"
                  :checked="trainIndexList.oneOne == 1 ? true : false"
                  @change="trainingContent(trainIndexList[index + '' + j])"
                ></el-checkbox>
                <el-checkbox
                  v-if="items.zjmc == '2'"
                  style="float : right;margin-right : 10px; margin : 10px 10px;"
                  v-model="trainIndexList[index + '' + j]"
                  :true-label="1"
                  :false-label="0"
                  :checked="trainIndexList.oneOne == 1 ? true : false"
                ></el-checkbox>
                <el-input
                  style="margin-left : 10px; width : 95%"
                  v-if="items.zjmc == '3'"
                  v-model="trainIndexList[index + '' + j]"
                  placeholder="请输入内容"
                ></el-input>
                <el-input
                  style="margin-left : 10px; width : 95%"
                  v-if="items.zjmc == '4'"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="trainIndexList[index + '' + j]"
                ></el-input>
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
  addStaticform,
  updateStaticform
} from "@/api/basic/staticform";
import { listTrainTheme } from "@/api/basic/trainTheme";
import { queryTrainContentAffirm } from "@/api/basic/trainSingle";
import { getSaveList} from "@/api/basic/trainContentRecord";
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
      trainIndexList: {},
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
      },
      // 主题名称
      themeName: "",
      // 培训项目列表
      projectList: [],
      // 内容列表
      contentResult: {}
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
      // 获取主题启用的主题
      queryTrainContentAffirm().then(res => {
        this.projectList = res.data;
        this.themeName = this.projectList.ztmc;
      });
      // 保存培训内容记录集合
      listTrainContentRecord().then(res => {
        console.log(res);
      });
    },
    // 提交按钮
    contentSubmitForm() {
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
          for (const key in this.trainIndexList) {
            if (this.trainIndexList.hasOwnProperty(key)) {
              if (
                parseInt(this.trainIndexList[key]) == 0 ||
                parseInt(this.trainIndexList[key]) == 1
              ) {
                this.$set(
                  this.trainIndexList,
                  key,
                  parseInt(this.trainIndexList[key])
                );
              }
            }
          }
        }
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
      this.trainIndexList = {};
    },
    // 选中培训内容
    trainingContent() {
      console.log(this.trainIndexList[index + "" + j]);
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
