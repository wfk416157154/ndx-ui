<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item label="节点路径" prop="nodePath">
        <el-input
          v-model="queryParams.nodePath"
          placeholder="请输入节点路径"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="节点名称" prop="jdmc">
        <el-input
          v-model="queryParams.jdmc"
          placeholder="请输入节点名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="层级类型" prop="cjlx">
        <el-select v-model="queryParams.cjlx" placeholder="请选择层级类型" clearable size="small">
          <el-option
            v-for="dict in cjlxOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basic:teachingReview:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      border
      v-loading="loading"
      :data="teachingReviewList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="节点名称" align="center" prop="jdmc"/>
      <el-table-column label="层级类型" align="center" prop="cjlx" :formatter="cjlxFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:teachingReview:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-if="scope.row.cjlx!=='4'"
            v-hasPermi="['basic:teachingReview:add']"
          >新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:teachingReview:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改教学计划总复习对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="归属节点" prop="parentId">
          <treeselect v-model="form.parentId" :disabled="true" :options="teachingReviewOptions" :normalizer="normalizer"
                      placeholder="请选择父节点id"/>
        </el-form-item>
        <el-form-item label="层级类型" prop="cjlx">
          <el-select v-model="form.cjlx" placeholder="请选择层级类型">
            <el-option
              v-for="dict in addCjlxOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节点名称" prop="jdmc">
          <el-input v-model="form.jdmc" placeholder="请输入节点名称"/>
        </el-form-item>
        <el-form-item label="选项类型" prop="jdmc">
          <el-select v-model="form.kzzd1" placeholder="请选择选项类型">
            <el-option
              v-for="dict in optionTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 添加或修改教学计划总复习对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="归属节点" prop="parentId">
          <treeselect v-model="form.parentId" :disabled="true" :options="teachingReviewOptions" :normalizer="normalizer"
                      placeholder="请选择父节点id"/>
        </el-form-item>
        <el-form-item label="层级类型" prop="cjlx">
          <el-select v-model="form.cjlx" placeholder="请选择层级类型">
            <el-option
              v-for="dict in addCjlxOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节点名称" prop="jdmc">
          <el-input v-model="form.jdmc" placeholder="请输入节点名称"/>
        </el-form-item>
        <el-form-item label="选项类型" prop="jdmc">
          <el-select v-model="form.kzzd1" placeholder="非必选">
            <el-option
              v-for="dict in optionTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listTeachingReview,
    getTeachingReview,
    delTeachingReview,
    addTeachingReview,
    updateTeachingReview,
    exportTeachingReview
  } from "@/api/basic/teachingReview";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  export default {
    name: "TeachingReview",
    components: {
      Treeselect
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 教学计划总复习表格数据
        teachingReviewList: [],
        // 教学计划总复习树选项
        teachingReviewOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 层级类型(复习资料名称/章/节/知识点)字典
        cjlxOptions: [],
        addCjlxOptions: [], //新增修改时取下级
        optionTypeOptions: [], //选项类型
        // 查询参数
        queryParams: {
          nodePath: null,
          jdmc: null,
          cjlx: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      this.getDicts("review_level").then(response => {
        this.cjlxOptions = response.data;
      });
      this.getDicts("option_type").then(response => {
        this.optionTypeOptions = response.data;
      });
    },
    methods: {
      /** 查询教学计划总复习列表 */
      getList() {
        this.loading = true;
        listTeachingReview(this.queryParams).then(response => {
          this.teachingReviewList = this.handleTree(response.data, "id", "parentId");
          this.loading = false;
        });
      },
      /** 转换教学计划总复习数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.jdmc,
          children: node.children
        };
      },
      /** 查询教学计划总复习下拉树结构 */
      getTreeselect() {
        listTeachingReview().then(response => {
          this.teachingReviewOptions = [];
          const data = {id: 0, jdmc: '顶级节点', children: []};
          data.children = this.handleTree(response.data, "id", "parentId");
          this.teachingReviewOptions.push(data);
        });
      },
      // 层级类型(复习资料名称/章/节/知识点)字典翻译
      cjlxFormat(row, column) {
        return this.selectDictLabel(this.cjlxOptions, row.cjlx);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          parentId: null,
          nodePath: null,
          jdmc: null,
          type: null,
          cjlx: null,
          status: "0",
          remark: null,
          userId: null,
          dataOrder: null,
          createTime: null,
          updateTime: null,
          kzzd1: null,
          kzzd2: null,
          kzzd3: null,
          kzzd4: null,
          kzzd5: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset();
        this.getTreeselect();
        this.addCjlxOptions = JSON.parse(JSON.stringify(this.cjlxOptions));
        for (let i = this.addCjlxOptions.length - 1; i >= 0; i--) {
          if (this.addCjlxOptions[i].dictValue <= row.cjlx) {
            this.addCjlxOptions.splice(i, 1);
          }
        }
        if (row != null && row.id) {
          this.form.parentId = row.id;
          this.form.nodePath = row.nodePath;
        } else {
          this.form.parentId = 0;
        }

        this.open = true;
        this.title = "添加教学计划总复习";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.getTreeselect();
        this.addCjlxOptions = JSON.parse(JSON.stringify(this.cjlxOptions));
        for (let i = this.addCjlxOptions.length - 1; i >= 0; i--) {
          if (this.addCjlxOptions[i].dictValue < row.cjlx) {
            this.addCjlxOptions.splice(i, 1);
          }
        }
        if (row != null) {
          this.form.parentId = row.id;
        }

        getTeachingReview(row.id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改教学计划总复习";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateTeachingReview(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addTeachingReview(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$confirm('是否确认删除选中数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delTeachingReview(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e) => {
          console.log(e);
        })
      }
    }
  };
</script>
