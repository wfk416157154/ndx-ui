<template>
  <div class="teacher-allocation">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="主题名称" prop="xxmc">
        <el-input
          v-model="queryParams.ztmc"
          placeholder="请输入学校名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label-width="100px" label="是否启用" prop="xqfzr">
        <el-select v-model="queryParams.sfqy">
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
        <el-button icon="el-icon-plus" size="mini" @click="addTheme">新增主题</el-button>
      </el-form-item>
    </el-form>
    <!-- 添加主题 -->
    <el-dialog
      v-loading="loading"
      :close-on-click-modal="false"
      title="新增主题"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="themeListForm" ref="themeList" label-width="80px">
        <el-form-item label="主题名称">
          <el-input v-model="themeListForm.ztmc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="themeListForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel1">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 主题 -->
    <div>
      <!-- 主题列表 -->
      <el-table :data="themeList" @row-click.self="getProject">
        <el-table-column label="主题名称" align="center" prop="ztmc" />
        <el-table-column label="是否启用" align="center" prop="sfqy">
          <template slot-scope="scope">
            <div @click.stop>
              <el-switch
                active-value="1"
                inactive-value="0"
                @change="getSwitch(scope.row)"
                v-model=" scope.row.sfqy"
              ></el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" align="center" prop="tjsj" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click.stop="handleAdd(scope.row)"
            >添加下级选项</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click.stop="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click.stop="handleDelete(scope.row)"
              v-hasPermi="['basic:school:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total1>0"
        :total="total1"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <!-- 添加项目form -->
      <el-dialog :close-on-click-modal="false" title="新增项目" :visible.sync="themeDialogFormVisible">
        <el-form :model="projectListForm" ref="projectList" label-width="120px">
          <el-form-item label="培训主题名称" label-width="120px">
            <el-input v-model="projectListForm.ztmc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="培训项目名称">
            <el-input type="textarea" v-model="projectListForm.pxxm"></el-input>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch active-value="1" inactive-value="0" v-model="projectListForm.sfqy"></el-switch>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="projectListForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel2">取 消</el-button>
          <el-button type="primary" @click="projectSubmitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <br />
    <br />
    <!-- 项目 -->
    <div v-show="projectShow">
      <!-- 项目列表 -->
      <el-table :data="projectList" @row-click="getContent">
        <el-table-column label="培训项目" align="center" prop="pxxm" />
        <el-table-column label="是否启用" align="center" prop="sfqy">
          <template slot-scope="scope">
            <div @click.stop>
              <el-switch
                active-value="1"
                inactive-value="0"
                @change="getSwitch2(scope.row)"
                v-model=" scope.row.sfqy"
              ></el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" align="center" prop="tjsj" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click.stop="projectAdd(scope.row)"
              v-hasPermi="['basic:school:edit']"
            >添加下级选项</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click.stop="projectUpdate(scope.row)"
              v-hasPermi="['basic:school:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click.stop="projectDelete(scope.row)"
              v-hasPermi="['basic:school:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total2>0"
        :total="total2"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <!-- 培训内容form -->
      <el-dialog
        :close-on-click-modal="false"
        title="新增培训内容"
        :visible.sync="contentListDialogFormVisible"
        width="80%"
      >
        <el-form :model="contentListForm" ref="contentList" label-width="120px">
          <el-form-item label="培训项目标题" label-width="120px">
            <el-input v-model="contentListForm.pxxm" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="上级培训内容">
            <el-input v-model="contentListForm.sjpxnr"></el-input>
          </el-form-item>
          <el-form-item label="培训内容">
            <el-input v-model="contentListForm.pxnr"></el-input>
          </el-form-item>
          <el-form-item label="是否有多个选项">
            <el-select v-model="contentListForm.sfydgxx" @change="whetherSelect" placeholder="请选择">
              <el-option
                v-for="item in whetherList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 子组件 -->
          <contentListForm v-if="whetherListSelect" />
          <el-form-item label="组件名称">
            <el-select v-model="contentListForm.zjmc" placeholder="请选择">
              <el-option
                v-for="item in whetherList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否默认选中">
            <el-select v-model="contentListForm.sfmrxz" placeholder="请选择">
              <el-option
                v-for="item in whetherList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否必填">
            <el-select v-model="contentListForm.sfbt" placeholder="请选择">
              <el-option
                v-for="item in whetherList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字数长度限制">
            <el-input v-model="contentListForm.zscdxz"></el-input>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch active-value="1" inactive-value="0" v-model="contentListForm.sfqy"></el-switch>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="contentListForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel3">取 消</el-button>
          <el-button type="primary" @click="projectSubmitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <br />
    <br />
    <!-- 培训内容 -->
    <div v-show="contentShow">
      <!-- 培训内容列表 -->
      <el-table :data="contentList">
        <el-table-column label="上级培训内容" align="center" prop="sjpxnr" />
        <el-table-column label="培训内容" align="center" prop="pxnr" />
        <el-table-column label="组件名称" align="center" prop="zjmc" />
        <el-table-column label="是否有多个选项" align="center" prop="sfydgxx" />
        <el-table-column label="是否默认选中" align="center" prop="sfmrxz" />
        <el-table-column label="是否必填" align="center" prop="sfbt" />
        <el-table-column label="字数长度限制" align="center" prop="zscdxz" />
        <el-table-column label="是否启用" align="center" prop="sfqy" />
        <el-table-column label="排序号" align="center" prop="pxh" />
        <el-table-column label="添加时间" align="center" prop="tjsj" />
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
              @click.stop="contentAdd(scope.row)"
              v-hasPermi="['basic:school:edit']"
            >添加下级选项</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click.stop="contentUpdate(scope.row)"
              v-hasPermi="['basic:school:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click.stop="contentDelete(scope.row)"
              v-hasPermi="['basic:school:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="1" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" />
      <!-- 培训内容列表add -->
      <el-dialog
        :close-on-click-modal="false"
        title="添加培训内容下级"
        :visible.sync="lastDialogFormVisible"
      >
        <el-form :model="lastForm" ref="contentList" label-width="120px">
          <el-form-item label="培训项目名称" label-width="120px">
            <el-input v-model="lastForm.pxxmmc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="上级培训内容">
            <el-input v-model="lastForm.sjpxnr"></el-input>
          </el-form-item>
          <el-form-item label="培训内容">
            <el-input v-model="lastForm.pxnr"></el-input>
          </el-form-item>
          <el-form-item label="是否有多个选项">
            <el-select v-model="lastForm.sfydgxx" placeholder="请选择">
              <el-option
                v-for="item in whetherList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组件名称">
            <el-select v-model="lastForm.zjmc" placeholder="请选择">
              <el-option
                v-for="item in whetherList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否默认选中">
            <el-select v-model="lastForm.sfmrxz" placeholder="请选择">
              <el-option
                v-for="item in whetherList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否必填">
            <el-select v-model="lastForm.sfbt" placeholder="请选择">
              <el-option
                v-for="item in whetherList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字数长度限制">
            <el-input v-model="lastForm.zscdxz"></el-input>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch active-value="1" inactive-value="0" v-model="lastForm.sfqy"></el-switch>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="lastForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel4">取 消</el-button>
          <el-button type="primary" @click="contentSubmitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import contentListForm from "./contentListForm"
import {
  listTrainTheme,
  addTrainTheme,
  updateTrainTheme,
  delTrainTheme
} from "@/api/basic/trainTheme";
import {
  listTrainProject,
  addTrainProject,
  updateTrainProject,
  delTrainProject
} from "@/api/basic/trainProject";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ztmc: null,
        sfqy: null,
        tjsj: null
      },
      // 主题
      themeList: [],
      // 添加主题
      themeListForm: {
        ztmc: "",
        remark: ""
      },
      dialogFormVisible: false,
      themeDialogFormVisible: false,
      // 项目
      projectList: [],
      // 添加培训内容
      projectListForm: {
        pxxm: "",
        sfqy: null,
        tjsj: "",
        remark: ""
      },
      contentListDialogFormVisible: false,
      // 内容
      contentList: [
        {
          sjpxnr: "5.组班后的班级管理",
          pxnr: "1）教材发放",
          zjmc: "复选框",
          sfydgxx: "是",
          sfmrxz: "是",
          sfbt: "是",
          zscdxz: "12",
          sfqy: "是",
          pxh: "1",
          tjsj: "2021/6/3",
          remark: "培训时间"
        }
      ],
      // 添加培训内容 table下 form
      contentListForm: {
        sjpxnr: "",
        pxnr: "",
        zjmc: "",
        sfydgxx: "",
        sfmrxz: "",
        sfbt: "",
        zscdxz: "",
        sfqy: "",
        pxh: "",
        tjsj: "",
        remark: ""
      },
      lastDialogFormVisible: false,
      // 培训项目内容内部form
      lastForm: {
        pxxmmc: null,
        sjpxnr: null,
        pxnr: null,
        sfydgxx: null,
        zjmc: null,
        sfmrxz: null,
        sfbt: null,
        zscdxz: null,
        sfqy: null,
        remark: null
      },
      // 是否选项通用功能
      whetherList: [],
      // 是否显示project表格数据,
      projectShow: true,
      // 是否显示content表格数据
      contentShow: true,
      // 主题总条数
      total1: 0,
      // 项目总条数
      total2: 0,
      // 内容总条数
      total3: 0,
      // 是否有多个选项
      whetherListSelect : ""
    };
  },
  components : {
    contentListForm
  },
  created() {
    this.getDicts("train_select").then(res => {
      this.whetherList = res.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取主题列表
    getList() {
      this.loading = true;
      listTrainTheme(this.queryParams).then(response => {
        this.themeList = response.rows;
        this.total1 = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /* 新增一级主题按钮 */
    addTheme() {
      this.reset();
      this.dialogFormVisible = true;
    },
    /* 增加项目选项 */
    handleAdd(row) {
      this.reset();
      this.themeDialogFormVisible = true;
      this.projectListForm.ztmc = row.ztmc;
      this.projectListForm.glid = row.glid;
    },
    /* 编辑一级主题选项 */
    handleUpdate(row) {
      (this.dialogFormVisible = true), (this.themeListForm = row);
    },
    /* 删除一级主题选项 */
    handleDelete(row) {
      const ztmc = row.ztmc;
      this.$confirm('是否确认删除培训主题为"' + ztmc + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delTrainTheme(row.id);
        })
        .then(() => {
          this.getList();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success"
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    /** 添加主题提交按钮 */
    submitForm() {
      this.$refs["themeList"].validate(valid => {
        if (valid) {
          if (this.themeListForm.id != null) {
            updateTrainTheme(this.themeListForm).then(response => {
              if (response.code == 200) {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                  title: "成功",
                  message: response.msg,
                  type: "success"
                });
              }
            });
          } else {
            addTrainTheme(this.themeListForm).then(response => {
              if (response.code == 200) {
                this.getList();
                this.dialogFormVisible = false;
                this.$notify({
                  title: "成功",
                  message: response.msg,
                  type: "success"
                });
              }
            });
          }
        }
      });
    },
    /* 主题提交按钮 */
    themeForm() {
      this.$refs["themeList"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            console.log("edit");
          } else {
            console.log("add");
          }
        }
      });
    },
    /* 添加二级下级选项 */
    projectAdd(row) {
      this.contentListDialogFormVisible = true;
      this.contentListForm.pxxm = row.pxxm;
    },
    /* 编辑二级项目选项 */
    projectUpdate(row) {
      this.themeDialogFormVisible = true;
      this.projectListForm = row;
    },
    /* 删除二级项目选项 */
    projectDelete(row) {
      const pxxm = row.pxxm;
      this.$confirm('是否确认删除培训项目为"' + pxxm + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delTrainProject(row.id);
        })
        .then(() => {
          this.getProject({ glid: row.glid });
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success"
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    /** 项目提交按钮 */
    projectSubmitForm() {
      this.$refs["projectList"].validate(valid => {
        if (valid) {
          if (this.projectListForm.id != null) {
            updateTrainProject(this.projectListForm).then(response => {
              if (response.code == 200) {
                this.themeDialogFormVisible = false;
                this.getProject({ glid: this.projectListForm.glid });
                this.$notify({
                  title: "成功",
                  message: response.msg,
                  type: "success"
                });
              }
            });
          } else {
            addTrainProject(this.projectListForm).then(response => {
              if (response.code == 200) {
                this.themeDialogFormVisible = false;
                this.getProject({ glid: this.projectListForm.glid });
                this.$notify({
                  title: "成功",
                  message: response.msg,
                  type: "success"
                });
              }
            });
          }
        }
      });
    },
    /* 添加三级下级选项 */
    contentAdd(row) {
      console.log("contentAdd");
      this.lastDialogFormVisible = true;
      this.lastForm.pxxmmc = row.sjpxnr;
    },
    /* 编辑三级主题选项 */
    contentUpdate() {
      console.log("contentUpdate");
    },
    /* 删除三级主题选项 */
    contentDelete() {
      console.log("contentDelete");
    },
    /** 培训提交按钮 */
    contentSubmitForm() {
      this.$refs["contentList"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            console.log("edit");
          } else {
            console.log("add");
          }
        }
      });
    },
    // 获取项目数据
    getProject(row, column, event) {
      listTrainProject({ glid: row.id }).then(response => {
        if (response.rows.length > 0) {
          this.projectList = response.rows;
          this.total2 = response.total;
          this.projectShow = true;
        }
      });
    },
    // 获取培训内容数据
    getContent(row, column, event) {
      console.log(row, column, event);
      listTrainSingle({ glid: row.id }).then(response => {
        if (response.rows.length > 0) {
          this.projectList = response.rows;
          this.total2 = response.total;
          this.projectShow = true;
        }
      });
    },
    // 主题开关事件
    getSwitch(row) {
      let json = {
        id: row.id,
        sfqy: row.sfqy
      };
      updateTrainTheme(json).then(res => {
        if (res.code == 200) {
          this.getList();
        }
      });
    },
    // 项目开关事件
    getSwitch2(row) {
      let json = {
        id: row.id,
        sfqy: row.sfqy
      };
      updateTrainProject(json).then(res => {
        if (res.code == 200) {
          this.getProject({ glid: this.projectListForm.glid });
        }
      });
    },
    // 置空
    reset() {
      // 添加主题
      this.themeListForm = {
        ztmc: "",
        remark: ""
      };
      // 添加培训内容
      this.projectListForm = {
        pxxm: "",
        sfqy: null,
        tjsj: "",
        remark: ""
      };
      // 添加培训内容 table下 form
      this.contentListForm = {
        sjpxnr: "",
        pxnr: "",
        zjmc: "",
        sfydgxx: "",
        sfmrxz: "",
        sfbt: "",
        zscdxz: "",
        sfqy: "",
        pxh: "",
        tjsj: "",
        remark: ""
      };
      // 培训项目内容内部form
      this.lastForm = {
        pxxmmc: null,
        sjpxnr: null,
        pxnr: null,
        sfydgxx: null,
        zjmc: null,
        sfmrxz: null,
        sfbt: null,
        zscdxz: null,
        sfqy: null,
        remark: null
      };
    },
    // 取消遮罩数据置空
    cancel1() {
      this.dialogFormVisible = false;
      this.reset();
    },
    cancel2() {
      this.themeDialogFormVisible = false;
      this.reset();
    },
    cancel3() {
      this.contentListDialogFormVisible = false;
      this.reset();
    },
    cancel4() {
      this.lastDialogFormVisible = false;
      this.reset();
    },
    // 是否有多个选项
    whetherSelect(value){
      this.whetherListSelect = parseInt(value)
    }
  }
};
</script>

<style lang="scss" scoped>
.teacher-allocation {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
}
</style>
