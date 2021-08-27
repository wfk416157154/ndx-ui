<template>
  <div class="creditReview">
    <el-form ref="creditReviewForm" :inline="true" :model="creditReviewForm" label-width="80px">
      <el-form-item label="负责人">
        <el-select v-model="creditReviewForm.fzrid" placeholder="请选择区域负责人">
          <el-option
            v-for="item in areaManagerList"
            :key="item.id"
            :label="item.xm"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学校">
        <el-select
          v-model="creditReviewForm.xxid"
          filterable
          placeholder="请选择校区"
          @change="xqmcOnChange"
        >
          <el-option v-for="item in schoolList" :key="item.id" :label="item.xxmc" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="creditReviewForm.bjid" placeholder="请选择班级">
          <el-option
            :label="item.rybjmc"
            :value="item.id"
            v-for="(item,index) in classList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="减免状态">
        <el-select v-model="creditReviewForm.jmlx" placeholder="请选择减免类型">
          <el-option
            :label="item.dictLabel"
            :value="item.dictValue"
            v-for="(item,index) in specialStatus"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getList(1)">通过</el-button>
        <el-button type="primary" size="mini" @click="getList(0)">不通过</el-button>
        <el-button type="primary" size="mini" @click="getList(2)">待审核</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="creditReviewData" :border="true" stripe style="width: 100%">
      <el-table-column prop="xxmc" label="学校"></el-table-column>
      <el-table-column prop="rybjmc" label="班级"></el-table-column>
      <el-table-column prop="lsxm" label="老师"></el-table-column>
      <el-table-column prop="xsxm" label="学生姓名"></el-table-column>
      <el-table-column prop="jmqs" label="减免期数"></el-table-column>
      <el-table-column prop="jmje" label="减免金额/每期"></el-table-column>
      <el-table-column prop="jmhje" label="减免后金额/每期">
        <template slot-scope="scope">
          <div v-html="scope.row.jmhje"></div>
        </template>
      </el-table-column>
      <el-table-column prop="shzt" label="审核状态">
        <template slot-scope="scope">
          <div>
            <dict-tag :options="auditStatus" :value="scope.row.shzt" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="wjlj" label="审核文件"></el-table-column>
      <el-table-column prop="cz" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="tsSubmit(scope.row,1)">通过</el-button>
          <el-button size="mini" type="primary" @click="tsSubmit(scope.row,0)">不通过</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="creditReviewForm.pageNum"
      :limit.sync="creditReviewForm.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listSchool } from "@/api/basic/school";
import { listAreaManager } from "@/api/basic/areaManager";
import { listBjclass } from "@/api/basic/bjclass";
import { exemptAuditQuery, paymentSpecial } from "@/api/basic/creditReview";
export default {
  data() {
    return {
      creditReviewForm: {
        pageNum: 1,
        pageSize: 10
      },
      creditReviewData: [],
      // 区域负责人列表
      areaManagerList: [],
      // 校区列表
      schoolList: [],
      // 班级
      classList: [],
      // 减免状态
      specialStatus: [],
      total: 0,
      auditStatus: []
    };
  },
  created() {
    listAreaManager().then(res => {
      this.areaManagerList = res.rows;
    });
    listSchool().then(response => {
      this.schoolList = response.rows;
    });
    this.getDicts("special_status").then(res => {
      this.specialStatus = res.data;
    });
    this.getDicts("payment_special_audit_status").then(res => {
      this.auditStatus = res.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取班级
    xqmcOnChange(xqid) {
      listBjclass({ kzzd1: xqid }).then(res => {
        this.classList = res.rows;
      });
    },
    // 查询数据列表
    getList(status) {
      if (String(status)) {
        this.creditReviewForm.shzt = status;
      }
      exemptAuditQuery(this.creditReviewForm).then(res => {
        this.creditReviewData = res.rows;
        for (let i = 0; i < this.creditReviewData.length; i++) {
          this.creditReviewData[i].jmhje = this.creditReviewData[
            i
          ].jmhje.replace(/[,]/g, "<br>");
        }
        this.total = res.total;
      });
    },
    // 是否通过
    tsSubmit(row, status) {
      paymentSpecial({ id: row.specialId, shzt: status }).then(res => {
        if (res.code == 200) {
          this.msgSuccess("成功 : 操作成功");
          this.getList();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.creditReview {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>