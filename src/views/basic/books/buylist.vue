<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryParams" label-width="80px" :inline="true">
      <!-- 时间 -->
      <el-form-item label="时间范围" label-width="80px" prop="postDateArr">
        <el-date-picker
          type="daterange"
          @change="changeDataArr"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          v-model="queryParams.postDateArr"
        ></el-date-picker>
      </el-form-item>
      <!-- 资料名称 -->
      <el-form-item label="资料名称" prop="materialName">
        <el-select placeholder="请选择资料名称" clearable v-model="queryParams.materialName">
          <el-option
            v-for="dict in materialName"
            :label="dict.dictLabel"
            :key="dict.dictValue"
            :value="dict.dictLabel"
          />
        </el-select>
      </el-form-item>
      <!-- 使用班级 -->
      <el-form-item label="使用班级" prop="className">
        <el-input placeholder="请选择班级" clearable v-model="queryParams.className"></el-input>
      </el-form-item>
      <!-- 方式 -->
      <el-form-item label="方式" prop="postType">
        <el-select placeholder="请选择方式" clearable v-model="queryParams.postType">
          <el-option
            v-for="dict in postType"
            :label="dict.dictLabel"
            :key="dict.dictValue"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- 分类 -->
      <el-form-item label="分类" prop="materialType">
        <el-select placeholder="请选择分类" clearable v-model="queryParams.materialType">
          <el-option
            v-for="dict in materialType"
            :label="dict.dictLabel"
            :key="dict.dictValue"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="toEdits">新增</el-button>
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="postExport"
          v-hasPermi="['basic:post:export']"
        >导出</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table style="width: 100%;font-size:18px" border :data="tableData">
      <el-table-column label="快递单号" align="center" prop="trackingNumber" />
      <el-table-column label="邮寄时间" align="center" prop="postDate" />
      <el-table-column label="收件人" align="center" prop="recipientName" />
      <el-table-column label="资料名称" align="center" prop="materialName" />
      <el-table-column label="使用班级" align="center" prop="className" />
      <el-table-column label="分类" align="center" prop="materialType" :formatter="getMaterialType" />
      <el-table-column label="方式" align="center" prop="postType" :formatter="getPostType" />
      <el-table-column label="收件地址" align="center" prop="recipientAddress" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status==0?isshow=true:isshow=false"
            type="text"
            icon="el-icon-edit"
            size="mini"
            @click="update(scope.row)"
            v-hasPermi="['basic:buydata:edit']"
          >修改</el-button>
          <el-button
            v-if="scope.row.status==0?isshow=true:isshow=false"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="disagree(scope.row)"
            v-hasPermi="['basic:buydata:put']"
          >不同意</el-button>
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
  addPost,
  checkPostList,
  updatePost,
  exportPost,
  postDetails
} from "../../../api/basic/buydata";
import { parseTime } from "@/utils/ruoyi";
export default {
  data() {
    return {
      // 显示不同意按钮
      isshow: "",
      // 表单校验
      rules: {},
      // 表单参数
      form: {},
      // 资料名称字典
      materialName: [],
      // 快递方式字典
      postType: [],
      // 资料分类字典
      materialType: [],
      // 记录总数据条数的数据源
      total: 0,
      // 表单数据源
      queryParams: {},
      // 表格数据源
      tableData: [
        {
          basicPostMaterialList: []
        }
      ],
      // 查询参数
      queryParams: {
        postDateArr: [],
        pageNum: 1,
        pageSize: 10,
        ksrq: null,
        jzrq: null
      }
    };
  },

  created() {
    this.getList();
    // 快递方式使用字典
    this.getDicts("express_type").then(response => {
      this.postType = response.data;
    });
    // 资料分类使用字典
    this.getDicts("post_material_tpye").then(response => {
      this.materialType = response.data;
    });
    // 资料名称使用字典
    this.getDicts("material_price_list").then(response => {
      this.materialName = response.data;
    });
  },

  methods: {
    // 表单重置
    reset() {
      this.queryParams = {
        postDateArr: [],
        materialName: null,
        className: null,
        postType: null,
        materialType: null
      };
      this.resetForm("queryParams");
    },
    // 日期时间
    changeDataArr(date) {
      if(date&&date.length>1){
        this.queryParams.ksrq = parseTime(date[0], "{y}-{m}-{d}");
        this.queryParams.jzrq = parseTime(date[1], "{y}-{m}-{d}");
      }
    },
    // 查询按钮操作
    async getList() {
      let res = await checkPostList(this.queryParams);
      let { rows, total } = res;
      this.tableData = rows;
      this.total = total;
    },
    // 重置按钮操作
    resetQuery() {
      this.resetForm("queryParams");
      this.getList();
    },
    // 新增按钮跳转操作
    toEdits() {
      this.getConfigKey("Mail-purchase-Information-form").then(resp => {
        let router = resp.msg;
        this.$router.push({
          path: router
        });
      })
    },
    // 导出按钮操作
    postExport() {
      this.download(
        "basic/post/export",
        {
          ...this.queryParams
        },
        `邮寄表.xlsx`
      );
    },
    // 修改按钮操作
    update(row) {
      postDetails(row.id).then(response => {
        this.getConfigKey("Mail-purchase-Information-form").then(resp => {
          let router = resp.msg;
          this.$router.push({
            path: router,
            query: response.data
          });
        })
      });
    },
    // 不同意按钮操作
    disagree(row) {
      let json = {
        id: row.id,
        status: "2" //不同意状态
      };
      updatePost(json).then(response => {
        this.msgSuccess("已发送，请等待");
      });
      // this.getList()
    },

    // 字典解码
    getMaterialType(row, column) {
      return this.selectDictLabel(this.materialType, row.materialType);
    },
    getPostType(row, column) {
      return this.selectDictLabel(this.postType, row.postType);
    }
  }
};
</script>

<style>
.el-form-item__label {
  text-align: right;
}
</style>
