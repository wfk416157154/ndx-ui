<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="文件名称" prop="wjmc">
        <el-input
          v-model="queryParams.wjmc"
          placeholder="请输入文件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下载人手机号" prop="xzrsjh" label-width="200px">
        <el-input
          v-model="queryParams.xzrsjh"
          placeholder="请输入下载人手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下载人名称" prop="xzrmc" label-width="200px">
        <el-input
          v-model="queryParams.xzrmc"
          placeholder="请输入下载人名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      border
      :data="downloadHistoryList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="文件表id" align="center" prop="wjbid" />
      <el-table-column label="文件名称" align="center" prop="wjmc" />
      <el-table-column label="文件大小" align="center" prop="wjdx" />
      <el-table-column label="所属模块" align="center" prop="ssmk" />
      <el-table-column label="下载人id" align="center" prop="xzrid" />
      <el-table-column label="下载人手机号" align="center" prop="xzrsjh" />
      <el-table-column label="下载人名称" align="center" prop="xzrmc" />
      <el-table-column label="下载时间" align="center" prop="downloadTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.downloadTime, '{y}-{m}-{d}') }}</span>
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
  </div>
</template>

<script>
import {
  listDownloadHistory,
  getDownloadHistory,
  delDownloadHistory,
  addDownloadHistory,
  updateDownloadHistory
} from "@/api/basic/downloadHistory";
import { getToken } from "@/utils/auth";

export default {
  name: "DownloadHistory",
  components: {},
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 下载历史记录表格数据
      downloadHistoryList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        wjmc: null,
        ssmk: null,
        xzrsjh: null,
        xzrmc: null
      }
    };
  },
  props: ["ssmk"],
  created() {
    this.getList();
  },
  methods: {
    /** 查询下载历史记录列表 */
    getList() {
      if (this.ssmk) {
        this.queryParams.ssmk = this.ssmk;
        this.loading = true;
        listDownloadHistory(this.queryParams).then(response => {
          this.downloadHistoryList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>
