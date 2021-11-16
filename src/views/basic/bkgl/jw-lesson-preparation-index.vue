<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="分配人" prop="fplsid">
        <el-select v-model="queryParams.fplsid" placeholder="请选择审核人" filterable>
          <el-option
            :label="item.leader"
            :value="item.lsid"
            v-for="(item,index) in assignorList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教案状态" prop="shzt">
        <el-select v-model="queryParams.shzt" placeholder="请选择教案状态" clearable size="small">
          <el-option
            v-for="dict in preparelesoonsStatus"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="教案审核状态" prop="jashzt" label-width="120px">
        <el-select v-model="queryParams.jashzt" placeholder="请选择教案审核状态" clearable size="small">
          <el-option
            v-for="dict in prepareLessonAuditStatus"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="success" size="mini">已审核</el-button>
        <el-button type="danger" size="mini">未审核</el-button>-->
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      style="width: 100%;font-size : 18px"
      v-loading="loading"
      :height="$root.tableHeight"
      border
      :data="lessonPreparationDataList"
    >
      <el-table-column label="班级" align="center" prop="rybjmc" />
      <el-table-column label="备课老师" align="center" prop="lsxm" />
      <el-table-column label="教材" align="center" prop="jcmc" />
      <el-table-column label="课程安排 / 知识点" align="center" prop="kcrwmc">
        <template slot-scope="scope">
          <span>{{scope.row.kcrwmc}} {{scope.row.zsdmc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分配时间" align="center" prop="fpsj" />
      <el-table-column label="审核时间" align="center" prop="shsj" />
      <el-table-column label="分配人" align="center" prop="fplsxm" />
      <el-table-column label="审核人" align="center" prop="shlsxm" />
      <el-table-column
        label="教案审核状态"
        align="center"
        :formatter="getPrepareLessonAuditStatus"
        prop="jashzt"
      />
      <el-table-column
        label="教案状态"
        align="center"
        :formatter="getPreparelesoonsStatus"
        prop="shzt"
      />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="viewRowData(scope.row)">审 核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog title="查看备课信息" :visible.sync="viewDialogFormVisible">
      <div
        style="width : 100%;height : 100%;padding : 40px; box-sizing : border-box;text-align : center"
      >
        <div>
          <table style="width : 100%;" border="1" cellspacing="0">
            <thead>
              <tr>
                <th>课程</th>
                <th>{{form.kcmc}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>课程安排</td>
                <td>{{form.name}}</td>
              </tr>
              <tr v-if="form.kzzd2 == '1'">
                <td>课程教学参考</td>
                <td>
                  <editor v-model="form.kcjxck" :disabled="true" :min-height="192" />
                </td>
              </tr>
              <tr v-if="form.kzzd2 == '1'">
                <td>教参内容</td>
                <td style="text-align : left">
                  <editor v-model="form.kcapjxck" :disabled="true" :min-height="192" />
                </td>
              </tr>
              <tr>
                <td>备课</td>
                <td style="text-align : left">
                  <h3>已上传的图片</h3>
                  <div class="clearfix">
                    <div
                      v-for="(item,index) in form.bkTpArr"
                      :key="index"
                      style="float : left;margin-right : 10px"
                    >
                      <img style="width : 200px" :src="item" alt />
                    </div>
                  </div>
                  <h3>已上传的文件</h3>
                  <div class="clearfix">
                    <div v-for="(item,index) in form.bkWjArr" :key="index">
                      <a :href="item" style="color : #409EFF">{{++index}} ) {{item}}</a>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>备注</td>
                <td>
                  <editor v-model="form.remark" :disabled="true" :min-height="192" />
                </td>
              </tr>
              <tr>
                <td>审核</td>
                <td style="padding : 40px;text-align : left">
                  <el-select
                    v-model="form.shzt"
                    placeholder="请选择教案状态"
                    :disabled="form.shzt != '1'"
                    clearable
                    size="small"
                  >
                    <el-option
                      v-for="dict in preparelesoonsStatus"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { secretKey } from "@/utils/tools";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
import {
  listAcdemicDean,
  prepareLessonsDetails,
  getSubLeaderIds,
  editPrepareLessons
} from "@/api/basic/bkgl";
export default {
  name: "prepareLessons",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 查询列表数据
      lessonPreparationDataList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        shzt: "",
        jashzt: "",
        fplsid: ""
      },
      form: {},
      // 教案状态
      preparelesoonsStatus: [],
      // 教案审核状态
      prepareLessonAuditStatus: [],
      // 查看编辑
      viewDialogFormVisible: false,
      assignorList: [],
      // 审核状态
      shzt: ""
    };
  },
  created() {
    this.getList();

    // 教案状态
    this.getDicts("preparelesoons_status").then(response => {
      this.preparelesoonsStatus = response.data;
    });

    // 教案审核状态
    this.getDicts("prepareLessonAuditStatus").then(response => {
      this.prepareLessonAuditStatus = response.data;
    });

    // 分配人
    getSubLeaderIds({}).then(res => {
      if (res.code == 200) {
        this.assignorList = res.data;
      }
    });
  },
  methods: {
    /** 查询备课列表 */
    getList() {
      this.loading = true;
      listAcdemicDean(this.queryParams).then(response => {
        this.lessonPreparationDataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 教案审核状态字典翻译
    getPrepareLessonAuditStatus(row, column) {
      return this.selectDictLabel(this.prepareLessonAuditStatus, row.jashzt);
    },
    // 教案状态字典翻译
    getPreparelesoonsStatus(row, column) {
      return this.selectDictLabel(this.preparelesoonsStatus, row.shzt);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 查看
    viewRowData(row) {
      this.viewDetailsData(row.id)
        ? (this.viewDialogFormVisible = true)
        : (this.viewDialogFormVisible = false);
    },
    // 详细数据
    async viewDetailsData(id) {
      let result = await prepareLessonsDetails(id);
      if (result.code == 200) {
        this.form = result.data;
        return true;
      } else {
        return false;
      }
    },
    // 审核
    editSubmit() {
      let { shzt, id } = this.form;
      editPrepareLessons({ shzt, id }).then(res => {
        if (res.code == 200) {
          this.viewDialogFormVisible = false;
          this.getList();
        }
      });
    }
  }
};
</script>
