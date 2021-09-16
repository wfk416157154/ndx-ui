<template>
  <div style="width : 100%; height : 100%; padding : 40px; box-sizing : border-box">
    <el-form ref="exemptionListForm" :model="exemptionListForm" :inline="true" label-width="80px">
      <el-form-item label="学校" prop="xqid">
        <el-select
          v-model="exemptionListForm.xqid"
          filterable
          placeholder="请选择校区"
          @change="xqmcOnChange"
        >
          <el-option v-for="item in schoolList" :key="item.id" :label="item.xxmc" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级" prop="rybjid">
        <el-select v-model="exemptionListForm.rybjid" placeholder="请选择班级">
          <el-option
            :label="item.rybjmc"
            :value="item.id"
            v-for="(item,index) in classList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学生" prop="xsxm">
        <el-input v-model="exemptionListForm.xsxm" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="休学状态" prop="shzt">
        <el-select v-model="exemptionListForm.shzt" placeholder="请选择班级状态">
          <el-option
            :label="item.dictLabel"
            :value="item.dictValue"
            v-for="(item,index) in mzStatusList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList()">查询</el-button>
        <el-button type="danger" @click="getList([1])">未审批</el-button>
        <el-button type="success" @click="getList([2,3])">已审批</el-button>
        <el-button icon="el-icon-refresh" @click="resetForm('exemptionListForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="offShiftListList" border style="width: 100%">
      <el-table-column prop="xxmc" label="学校" width="180"></el-table-column>
      <el-table-column prop="rybjmc" label="班级" width="180"></el-table-column>
      <el-table-column prop="lsxm" label="老师"></el-table-column>
      <el-table-column prop="xsxm" label="学生"></el-table-column>
      <el-table-column prop="mzyy" label="免责原因"></el-table-column>
      <el-table-column prop="shwj" label="审核文件" :width="flexColumnWidth('shwj',offShiftListList)">
        <template slot-scope="scope">
          <div class="block" style="display : flex; width : 100% ; height : 100%">
            <el-image
              style="width: 60px; height: 60px; margin : 0px 5px"
              v-for="(item,index) in scope.row.shwj"
              :key="index"
              :src="item"
              :preview-src-list="[item]"
            >
              <div
                slot="error"
                style="width : 100%; height : 100%; display : flex; align-items : center;background : #eee; font-size : 12px;justify-content:center;color : #c0c4cc"
                class="image-slot"
              >
                <span>加载失败</span>
              </div>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleDdopt(scope.$index, scope.row)"
            :disabled="scope.row.shzt != 1"
          >同意</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            :disabled="scope.row.shzt != 1"
          >驳回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="exemptionListForm.pageNum"
      :limit.sync="exemptionListForm.pageSize"
      @pagination="getList"
    />

    <el-dialog title="免责驳回" :visible.sync="dialogVisible" width="30%">
      <div>
        <el-input type="textarea" :rows="4" placeholder="请输入驳回原因" v-model="exemptionListForm.kzzd1"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="bhSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listMianze, updateMianze } from "@/api/basic/mianze";
import { listSchool } from "@/api/basic/school";
import { listBjclass } from "@/api/basic/bjclass";
export default {
  data() {
    return {
      exemptionListForm: {
        pageNum: 1,
        pageSize: 10,
        xqid: "",
        rybjid: "",
        xsxm: "",
        shzt: "",
        shztArr: []
      },
      total: 0,
      offShiftListList: [],
      dialogVisible: false,
      mzStatusList: [],
      schoolList: [],
      classList: []
    };
  },
  created() {
    listSchool().then(response => {
      this.schoolList = response.rows;
    });
    this.getDicts("mianze_status").then(res => {
      this.mzStatusList = res.data;
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
    // 数据
    getList(shztArr = false) {
      if (shztArr) {
        this.exemptionListForm.shztArr = shztArr;
      } else {
        this.exemptionListForm.shztArr = [];
      }
      listMianze(this.exemptionListForm).then(res => {
        this.offShiftListList = res.rows;
        this.total = res.total;
      });
    },
    // 驳回
    handleDelete(i, row) {
      this.__row = row;
      this.dialogVisible = true;
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getList();
    },
    // 宽度适配
    flexColumnWidth(str, tableData) {
      let arr = [];
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i] && tableData[i][str] && tableData[i][str].length > 0) {
          tableData.forEach(obj => {
            if (obj[str] && obj[str].length) arr.push(obj[str].length);
          });
        } else {
          continue;
        }
      }
      return Math.max.call(null, ...arr) * 75;
    },
    // 同意
    handleDdopt(i, row) {
      this.exemptionListForm.id = row.id;
      this.exemptionListForm.xsbh = row.xsbh;
      this.exemptionListForm.shzt = 2;
      updateMianze(this.exemptionListForm).then(res => {
        if (res.code == 200) {
          this.msgSuccess("成功 : 申请已通过");
          this.reset();
          this.getList();
        }
      });
    },
    //驳回
    bhSubmit() {
      this.exemptionListForm.id = this.__row.id;
      this.exemptionListForm.shzt = 3;
      updateMianze(this.exemptionListForm).then(res => {
        if (res.code == 200) {
          this.msgSuccess("成功 : 申请已驳回");
          this.reset();
          this.getList();
        }
      });
      this.dialogVisible = false;
    },
    reset() {
      this.exemptionListForm = {
        pageNum: 1,
        pageSize: 10,
        xqid: "",
        rybjid: "",
        xsxm: "",
        shzt: "",
        shztArr: []
      };
    }
  }
};
</script>
