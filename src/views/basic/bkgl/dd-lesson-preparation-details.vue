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
      <el-form-item label="分配周时间区间" prop="fpzsjqj" label-width="120px">
        <el-date-picker
          v-model="queryParams.fpzsjqj"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="success" size="mini" @click="getStatus('1')">已完成</el-button>
      <el-button type="danger" size="mini" @click="getStatus('0')">未完成</el-button>
    </div>
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
      <el-table-column label="分配人" align="center" prop="fplsxm" />
      <el-table-column label="分配周" align="center" prop="fpzStr">
        <template slot-scope="scope">
          <div>{{scope.row.fpzStartDate}} {{scope.row.fpzEndDate}}</div>
        </template>
      </el-table-column>
      <el-table-column label="教材" align="center" prop="jcmc" />
      <el-table-column label="教案数" align="center" prop="dymc">
        <template slot-scope="scope">
          <div>{{scope.row.hgs}} / {{scope.row.zs}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="zt">
        <template slot-scope="scope">
          <p v-if="scope.row.zt == 0">未完成</p>
          <p v-else>已完成</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="viewSecondaryMenu(scope.row)">查看</el-button>
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
              <!-- <tr v-if="form.kzzd2 == '1'">
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
              </tr>-->
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
            </tbody>
          </table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="viewDialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { getToken } from "@/utils/auth";
import { secretKey } from "@/utils/tools";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
import { prepareSupervisorData, getSubLeaderIds } from "@/api/basic/bkgl";
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
        fplsid: null,
        zt: null,
        fpzsjqj: []
      },
      form: {},
      // 查看编辑
      viewDialogFormVisible: false,
      assignorList: []
    };
  },
  created() {
    this.getList();
    // 分配人
    getSubLeaderIds({ leaderName: this.$store.state.user.nickName }).then(
      res => {
        if (res.code == 200) {
          this.assignorList = res.data;
        }
      }
    );
  },
  methods: {
    /** 查询备课列表 */
    getList() {
      this.loading = true;
      prepareSupervisorData(this.queryParams).then(response => {
        this.lessonPreparationDataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 状态
    getStatus(zt) {
      prepareSupervisorData({ zt }).then(response => {
        this.lessonPreparationDataList = response.rows;
        this.total = response.total;
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
    viewSecondaryMenu(row) {
      this.getConfigKey("dd-zz-lesson-preparation-index").then(res => {
        this.router = res.msg;
        this.$router.push({
          path: this.router,
          query: {
            list: row
          }
        });
      });
    }
  }
};
</script>
