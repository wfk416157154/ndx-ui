<template>
  <div class="teachingParameterAlocation">
    <el-form :inline="true" :model="teachingParameterAlocationForm" class="demo-form-inline">
      <el-form-item label="老师">
        <el-input v-model="teachingParameterAlocationForm.nickName" clearable placeholder="老师"></el-input>
      </el-form-item>
      <el-form-item label="分配类型">
        <el-select v-model="teachingParameterAlocationForm.category" placeholder="请选择">
          <el-option label="教参分配" value="1"></el-option>
          <el-option label="课件分配" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="teachingParameterAlocationData" border style="width: 100%">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column prop="userName" label="姓名" width="180"></el-table-column>
      <el-table-column prop="kcmc" label="课程"></el-table-column>
      <el-table-column prop="cz" label="操作" width="180px">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleDistribution(scope.row)">分 配</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="teachingParameterAlocationForm.pageNum"
      :limit.sync="teachingParameterAlocationForm.pageSize"
      @pagination="getList"
    />

    <el-dialog title="分配" :visible.sync="dialogFormVisible">
      <el-form :model="distributionForm">
        <el-form-item label="教材" width="120px">
          <treeselect
            v-model="distributionForm.parentId"
            :options="teachingMaterialList"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
      </el-form>
      <div>
        <el-checkbox-group v-model="distributionCheckList">
          <el-checkbox
            :label="item.id"
            v-for="(item,index) in unallocatedData"
            :key="index"
          >{{item.kcmc}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handledistributionSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  templateAllotList,
  unallocatedList,
  templateAllot
} from "../../../api/basic/teachingParameterAlocation";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { watch } from "vue";
import { clearCache } from "@/api/system/config";
import {
  listTeachingMaterial,
  getTeachingMaterial
} from "@/api/basic/teachingMaterial";
export default {
  data() {
    return {
      teachingParameterAlocationForm: {
        pageNum: 1,
        pageSize: 10,
        category: "1"
      },
      total: 0,
      teachingParameterAlocationData: [],
      distributionForm: {},
      dialogFormVisible: false,
      distributionCheckList: [],
      teachingMaterialList: [],
      userId: "",
      unallocatedData: []
    };
  },
  components: {
    Treeselect
  },
  watch: {
    "distributionForm.parentId": function(news, odl) {
      unallocatedList({
        materialId: this.distributionForm.parentId,
        userId: this.userObj.userId
      }).then(res => {
        this.unallocatedData = res.data;
      });
    }
  },
  mounted() {
    listTeachingMaterial().then(response => {
      this.teachingMaterialList = this.handleTree(
        response.data,
        "id",
        "parentId"
      );
    });
    this.getList();
  },
  methods: {
    getList() {
      templateAllotList(this.teachingParameterAlocationForm).then(res => {
        this.teachingParameterAlocationData = res.rows;
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.jcmc,
        children: node.children
      };
    },
    handleDistribution(row) {
      this.dialogFormVisible = true;
      this.userObj = row;
    },
    handledistributionSubmit() {
      let templateAllotArr = [];
      this.unallocatedData.forEach(val => {
        if (this.distributionCheckList.indexOf(val.id) != -1) {
          templateAllotArr.push({
            templateId: val.id,
            kcmc: val.kcmc
          });
        }
      });
      templateAllot({
        userId: this.userObj.userId,
        userName: this.userObj.userName,
        category: this.teachingParameterAlocationForm.category,
        sysUserTemplateList: templateAllotArr
      }).then(res => {
        if (res.code == 200) {
          this.msgSuccess("分配成功");
          this.distributionForm.parentId = null;
          this.unallocatedData = [];
          this.dialogFormVisible = false;
          this.getList();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.teachingParameterAlocation {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>