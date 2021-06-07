<template>
  <div class="contentListForm">
    <el-button icon="el-icon-plus" size="mini" type="primary" @click="addContentList">新增</el-button>
    <br />
    <br />
    <el-table :data="contentList">
      <el-table-column label="选项名称" align="center" prop="xxmc" />
      <el-table-column label="组件名称" align="center" :formatter="getResult1" prop="zjmc" />
      <el-table-column label="是否默认选中" align="center" :formatter="getResult3" prop="sfmrxz" />
      <el-table-column label="是否必填" align="center" :formatter="getResult4" prop="sfbt" />
      <el-table-column label="字数长度限制" align="center" prop="zdcdxz" />
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
            icon="el-icon-edit"
            @click.stop="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click.stop="handleDelete(scope.row)"
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

    <!-- 培训内容多选 -->
    <div v-if="content" class="contentStyle clearfix">
      <el-form :model="contentListForm" ref="content" label-width="120px">
        <el-form-item label="培训内容">
          <el-input v-model="contentListForm.xxmc"></el-input>
        </el-form-item>
        <el-form-item label="组件名称">
          <el-select v-model="contentListForm.zjmc" placeholder="请选择">
            <el-option
              v-for="item in ele"
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
          <el-input v-model="contentListForm.zdcdxz"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch active-value="1" inactive-value="0" v-model="contentListForm.sfqy"></el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="contentListForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="contentSubmitForm">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  listTrainMultiple,
  addTrainMultiple,
  updateTrainMultiple,
  delTrainMultiple
} from "@/api/basic/trainMultiple";
export default {
  data() {
    return {
      // 表格数据
      contentList: [],
      // 表单
      contentForm: {
        xxmc: "",
        zjmc: "",
        sfmrxz: "",
        sfbt: "",
        zscdxz: "",
        sfqy: ""
      },
      // 添加培训内容 多选
      contentListForm: {
        xxmc: "",
        sjpxnr: "",
        pxnr: "",
        zjmc: "",
        sfydgxx: "",
        sfmrxz: "",
        sfbt: "",
        zdcdxz: "",
        sfqy: "",
        pxh: "",
        tjsj: "",
        remark: ""
      },
      // 遮罩
      content: false,
      //字典 是否选项
      whetherList: "",
      // 字典 dom 选项
      ele: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      contentList: []
    };
  },
  created() {
    this.getDicts("train_select").then(res => {
      this.whetherList = res.data;
    });
    this.getDicts("train_ele").then(res => {
      this.ele = res.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 查询培训内容（多选）列表
    getList() {
      listTrainMultiple(this.queryParams).then(response => {
        this.contentList = response.rows;
        this.total1 = response.total;
        console.log(response);
      });
    },
    // 新增
    addContentList() {
      this.content = true;
    },
    // 编辑
    handleUpdate(row) {
      console.log(row);
      this.content = true;
      this.contentListForm = row
    },
    // 删除
    handleDelete(row) {
      console.log(row);
      const xxmc = row.xxmc;
      this.$confirm('是否确认删除培训主题为"' + xxmc + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delTrainMultiple(row.id);
        })
        .then(() => {
          this.getList()
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
    // 提交按钮
    contentSubmitForm() {
      this.$refs["content"].validate(valid => {
        if (valid) {
          if (this.contentListForm.id != null) {
            updateTrainMultiple(this.contentListForm).then(response => {
              if (response.code == 200) {
                this.content = false;
                this.getList();
                this.$notify({
                  title: "成功",
                  message: response.msg,
                  type: "success"
                });
              }
            });
          } else {
            addTrainMultiple(this.contentListForm).then(response => {
              if (response.code == 200) {
                this.content = false;
                this.getList();
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
    // form 取消按钮
    cancel() {
      this.content = false;
      this.reset();
    },
    // 置空
    reset() {
      // 添加培训内容 多选
      this.contentListForm = {
        sjpxnr: "",
        pxnr: "",
        zjmc: "",
        sfmrxz: "",
        sfbt: "",
        zscdxz: "",
        sfqy: "",
        pxh: "",
        tjsj: "",
        remark: ""
      };
    },
    // 主题开关事件
    getSwitch(row) {
      let json = {
        id: row.id,
        sfqy: row.sfqy
      };
      updateTrainMultiple(json).then(res => {
        if (res.code == 200) {
          this.getList();
        }
      });
    },
    // 状态字典翻译 组件名称
    getResult1(row, column) {
      return this.selectDictLabel(this.ele, row.zjmc);
    },
    // 状态字典翻译 是否有多个选项
    getResult2(row, column) {
      return this.selectDictLabel(this.whetherList, row.sfydgxx);
    },
    // 状态字典翻译 是否默认选中
    getResult3(row, column) {
      return this.selectDictLabel(this.whetherList, row.sfmrxz);
    },
    // 状态字典翻译 是否必填
    getResult4(row, column) {
      return this.selectDictLabel(this.whetherList, row.sfbt);
    }
  }
};
</script>

<style lang="scss">
.contentListForm {
  padding: 20px;
  box-sizing: border-box;
  .contentStyle {
    background-color: #ccc;
    padding: 30px;
    box-sizing: border-box;
    margin-top: 30px;
    .dialog-footer {
      float: right;
    }
  }
}
</style>