<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="题目类型" prop="tmlx">
        <el-select v-model="queryParams.tmlx" placeholder="请选择题目类型" clearable size="small">
          <el-option
            v-for="dict in tmlxOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="视频类别" prop="splb">
        <el-select v-model="queryParams.splb" placeholder="请选择视频类别" clearable size="small">
          <el-option
            v-for="dict in splbOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="题目分值" prop="tmfz">
        <el-input
          v-model="queryParams.tmfz"
          placeholder="请输入题目分值"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basic:trainPaperTopic:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basic:trainPaperTopic:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basic:trainPaperTopic:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :height="$root.tableHeight" border :data="trainPaperTopicList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="id" v-if="false"/>
      <el-table-column label="题目类型" align="center" prop="tmlx">
        <template slot-scope="scope">
          <dict-tag :options="tmlxOptions" :value="scope.row.tmlx"/>
        </template>
      </el-table-column>
      <el-table-column label="题目标题" align="center" prop="tmbt"/>
      <el-table-column label="视频类别" align="center" prop="splb">
        <template slot-scope="scope">
          <dict-tag :options="splbOptions" :value="scope.row.splb"/>
        </template>
      </el-table-column>
      <el-table-column label="题目分值" align="center" prop="tmfz"/>
      <el-table-column label="题目答案" align="center" prop="tmda"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:trainPaperTopic:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:trainPaperTopic:remove']"
          >删除
          </el-button>
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

    <!-- 添加或修改培训试卷-题目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="题目类型" prop="tmlx">
              <el-select v-model="form.tmlx" :disabled="null!=form.tmlx" placeholder="请选择题目类型" @change="tmlxOnChange">
                <el-option
                  v-for="dict in tmlxOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="视频类别" prop="splb">
              <el-select v-model="form.splb" placeholder="请选择视频类别">
                <el-option
                  v-for="dict in splbOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="题目分值" prop="tmfz">
              <el-input-number v-model="form.tmfz" :min="1" :max="50" placeholder="请输入题目分值"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="题目标题" prop="tmbt">
              <el-input v-model="form.tmbt" type="textarea" :rows="8" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isDanxuan">
          <el-col style="margin-bottom: 10px">
            <el-button icon="el-icon-plus" type="primary"  @click="insertEvent(-1)">新增选项</el-button>
          </el-col>
          <el-col>
            <vxe-table
              border
              show-overflow
              keep-source
              ref="xTable"
              max-height="400px"
              :data="topicOptionData"
              :edit-config="{trigger: 'click', mode: 'row', icon: 'fa fa-pencil', showStatus: true}">
              <vxe-column type="checkbox" width="60" v-if="false"></vxe-column>
              <vxe-column type="seq" title="序号" width="60"></vxe-column>
              <vxe-column field="kzzd1" title="选项" align="center" width="150px" sortable :edit-render="{autofocus: '.vxe-input--inner'}">
                <template #edit="{ row }">
                  <vxe-input v-model="row.kzzd1" type="text"></vxe-input>
                </template>
              </vxe-column>
              <vxe-column field="xxbt" title="选项标题" align="center" v-if="'1'==form.tmlx" :edit-render="{}">
                <template #edit="{ row }">
                  <vxe-input v-model="row.xxbt" type="text"></vxe-input>
                </template>
              </vxe-column>

              <vxe-column field="zdcd" title="最大长度" align="center" v-if="'3'==form.tmlx" :edit-render="{}">
                <template #edit="{ row }">
                  <el-input-number v-model="row.zdcd" :min="1" :max="20" />
                </template>
              </vxe-column>
              <vxe-column field="xxda" title="填空答案" align="center" v-if="'3'==form.tmlx" :edit-render="{}">
                <template #edit="{ row }">
                  <vxe-input v-model="row.xxbt" type="text"></vxe-input>
                </template>
              </vxe-column>
              <vxe-column field="dfgz" title="得分规则" align="center" v-if="'3'==form.tmlx" :edit-render="{}">
                <template slot-scope="scope">
                  <dict-tag :options="dfgzOptions" :value="scope.row.dfgz"/>
                </template>
                <template #edit="{ row }">
                  <el-radio-group v-model="row.dfgz">
                    <el-radio
                      v-for="(item,index) in dfgzOptions"
                      :key="index"
                      :label="item.dictValue"
                    >{{item.dictLabel}}</el-radio>
                  </el-radio-group>
                </template>
              </vxe-column>
            </vxe-table>
          </el-col>
          <el-col style="margin-top: 20px" v-if="'3'!=form.tmlx">
            <el-form-item label="题目答案" prop="tmda">
              <el-select v-model="form.tmda" :disabled="topicOptionData.length<1" placeholder="请先新增选项再选择答案" clearable
                         size="small">
                <el-option
                  v-for="(item,index) in topicOptionData"
                  :key="index"
                  :label="item.kzzd1"
                  :value="item.kzzd1"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!--<el-row v-if="isWenda">
          <el-col>
            <el-form-item label="题目答案" prop="tmda">
              <el-input v-model="form.tmda" type="textarea" :rows="8" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col style="margin-top: 20px">
            <el-form-item label="排序号" prop="dataOrder">
              <el-input-number v-model="form.dataOrder" placeholder="请输入排序号"/>
            </el-form-item>
          </el-col>
        </el-row>

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
    listTrainPaperTopic,
    getTrainPaperTopic,
    delTrainPaperTopic,
    addTrainPaperTopic,
    updateTrainPaperTopic,
    addOrUpdateTrainPaperTopic
  } from "@/api/basic/trainPaperTopic";
  import {
    listTrainPaperOption,
    getTrainPaperOption,
    delTrainPaperOption,
    addTrainPaperOption,
    updateTrainPaperOption
  } from "@/api/basic/trainPaperOption";
  import {getToken} from "@/utils/auth";

  export default {
    name: "TrainPaperTopic",
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 培训试卷-题目表格数据
        trainPaperTopicList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 题目类型字典
        tmlxOptions: [],
        // 视频类别字典
        splbOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          tmlx: null,
          tmbt: null,
          splb: null,
          tmfz: null,
          tmda: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          tmlx: [{required: true, message: "不能为空", trigger: "change"}],
          splb: [{required: true, message: "不能为空", trigger: "change"}],
          tmbt: [{required: true, message: "不能为空", trigger: "blur"}],
          tmda: [{required: true, message: "不能为空", trigger: "change"}],
        },
        // 是否单选
        isDanxuan: false,
        // 是否判断
        isPanduan: false,
        // 是否填空
        isTiankong: false,
        // 是否问答
        isWenda: false,
        // 题目选项内容数据
        topicOptionData: [],
        // 得分规则码表数据
        dfgzOptions:[],
        // 填空题数量
        tiankongCount:0
      };
    },
    created() {
      this.getList();
      this.getDicts("trainPaperTopicType").then(response => {
        this.tmlxOptions = response.data;
      });
      this.getDicts("videoType").then(response => {
        this.splbOptions = response.data;
      });
      this.getDicts("paperTopicDfgz").then(response => {
        this.dfgzOptions = response.data;
      });
    },
    methods: {
      // 新增选项按钮
      async insertEvent(row) {
        const $table = this.$refs.xTable
        let record = {}
        if("2"==this.form.tmlx){ // 判断题
          record = {kzzd1:"对"}
          await $table.insertAt(record, row)
          record = {kzzd1:"错"}
          await $table.insertAt(record, row)
        }else if("3"==this.form.tmlx){
          this.tiankongCount++;
          let title="第"+this.tiankongCount+"空"
          record = {
            kzzd1:title,
            dataOrder:this.tiankongCount
          }
          await $table.insertAt(record, row)
          this.form.tmbt=this.form.tmbt+"(     )"
        }else{
          const {row: newRow} = await $table.insertAt(record, row)
          await $table.setActiveCell(newRow, 'kzzd1')
        }
        this.topicOptionData=$table.getTableData().tableData
      },
      // 选择题目类型触发
      tmlxOnChange(val) {
        this.topicOptionData=[]// 切换为其他题型后清空题目选项数组
        switch (val) {
          case "4":// 问答
            this.switchToFalse(false, false, false, true)
            break
          default:// 单选 判断 填空
            this.switchToFalse(true, false, false, false)
            break
        }
      },
      // 切换隐藏显示状态
      switchToFalse(danxuan, panduan, tiankong, wenda) {
        this.isDanxuan = danxuan // 单选
        this.isPanduan = panduan // 判断
        this.isTiankong = tiankong //填空
        this.isWenda = wenda // 问答
      },

      /** 查询培训试卷-题目列表 */
      getList() {
        this.loading = true;
        listTrainPaperTopic(this.queryParams).then(response => {
          this.trainPaperTopicList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.topicOptionData=[]
        this.tiankongCount=0
        this.switchToFalse(false,false,false,false)
        this.form = {
          id: null,
          tmlx: null,
          tmbt: "",
          splb: null,
          tmfz: null,
          tmda: null,
          ssjc: null,
          tmbq: null,
          tmkd: null,
          tmnyd: null,
          userId: null,
          status: "0",
          dataOrder: null,
          createTime: null,
          updateTime: null,
          kzzd1: null,
          kzzd2: null,
          kzzd3: null,
          kzzd4: null,
          kzzd5: null,
          optionList:[]
        };
        this.resetForm("form");
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
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加培训试卷-题目";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getTrainPaperTopic(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改培训试卷-题目";
          if("4"!=this.form.tmlx){// 非问答题
            this.topicOptionData = response.data.optionList;
          }
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            const $table = this.$refs.xTable
            const records = $table.getTableData().tableData
            if (records.length < 1) {
              this.msgError("请先新增题目选项！")
              return
            }
            addOrUpdateTrainPaperTopic(this.form).then(response => {
              if (200 == response.code) {
                this.getList();
                this.msgSuccess(response.msg);
              } else {
                this.msgError(response.msg);
              }
              this.open = false;
              this.getList();
            });
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除选中的数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delTrainPaperTopic(ids);
        }).then((res) => {
          if (200 == res.code) {
            this.getList();
            this.msgSuccess("删除成功");
          } else {
            this.msgError("删除失败");
          }
        }).catch((e) => {
          console.log(e);
        })

      },


    }
  };
</script>
