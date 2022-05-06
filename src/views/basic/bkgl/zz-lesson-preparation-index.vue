<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item>
        <el-button type="success" size="mini" @click="getStatus([2,3,4])">已审核</el-button>
        <el-button type="danger" size="mini" @click="getStatus([1])">未审核</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      style="width: 100%;font-size : 18px"
      :height="$root.tableHeight"
      border
      :data="lessonPreparationDataList"
    >
      <el-table-column label="班级" align="center" prop="rybjmc" />
      <el-table-column label="老师" align="center" prop="lsxm" />
      <el-table-column label="教材" align="center" prop="jcmc" />
      <el-table-column label="课程" align="center" prop="kcrwmc">
        <template slot-scope="scope">
          <span>{{scope.row.kcmc}}</span>
          <span>{{scope.row.zmc}}</span>
          <span v-if="!scope.row.zsdmc">{{scope.row.jmc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程安排 / 知识点" align="center" prop="kcrwmc">
        <template slot-scope="scope">
          <span>{{scope.row.kcrwmc}} {{scope.row.zsdmc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" align="center" prop="createTime"/>
      <el-table-column
        label="教案审核状态"
        align="center"
        prop="jashzt"
        :formatter="getPrepareLessonAuditStatus"
      />
      <el-table-column
        label="教案状态"
        align="center"
        prop="shzt"
        :formatter="getPreparelesoonsStatus"
      />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="viewSecondaryMenu(scope.row)">审核</el-button>
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

    <el-dialog title="审核" :visible.sync="viewDialogFormVisible">
      <div
        style="width : 100%;height : 100%;padding : 40px; box-sizing : border-box;text-align : center"
      >
        <div>
          <table style="width : 100%;" border="1" cellspacing="0">
            <thead>
              <tr>
                <th>课程</th>
                <th v-if="form.kzzd2 == '1'">{{form.kcmc}}</th>
                <th v-else>{{form.fxzlmc}} / {{form.zmc}} / {{form.jmc}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-if="form.kzzd2 == '1'">课程安排</td>
                <td v-else>知识点</td>
                <td v-if="form.kzzd2 == '1'">{{form.kcrwmc}}</td>
                <td>{{form.zsdmc}}</td>
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
                      <el-image
                        style="width: 100px; height: 100px"
                        :src="item"
                        :preview-src-list="[item]"
                      ></el-image>
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
                  <el-select v-model="form.shzt" placeholder="请选择教案状态" clearable size="small">
                    <el-option
                      v-for="dict in preparelesoonsStatus"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>审核意见</td>
                <td>
                  <editor v-model="form.kzzd4" :min-height="192" />
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
import {
  listAcdemicDean,
  editPrepareLessons,
  prepareLessonsDetails
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
        fplsid: this.$store.state.user.glrid
      },
      form: {},
      // 查看编辑
      viewDialogFormVisible: false,
      assignorList: [],
      // 教案状态
      preparelesoonsStatus: [],
      // 教案审核状态
      prepareLessonAuditStatus: []
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
  },
  methods: {
    /** 查询备课列表 */
    getList() {
      listAcdemicDean(this.queryParams).then(response => {
        this.lessonPreparationDataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 状态
    getStatus(zt) {
      this.queryParams.shztArr = zt;
      this.getList();
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
    viewSecondaryMenu(row) {
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
    // 保存审核
    editSubmit() {
      let { shzt, id ,kzzd4} = this.form;
      editPrepareLessons({ shzt, id, kzzd4 }).then(res => {
        if (res.code == 200) {
          this.viewDialogFormVisible = false;
          this.form = {}
          this.getList();
        }
      });
    }
  }
};
</script>
