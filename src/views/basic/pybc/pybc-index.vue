<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="班级" prop="bjid">
                <el-select v-model="queryParams.bjid" filterable placeholder="请选择班级">
                    <el-option
                        v-for="item in bjclassList "
                        :key="item.id"
                        :label="item.rybjmc"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="老师姓名"
                prop="lsxm"
                v-if="this.$store.state.user.dataRoleWeightId != 50"
            >
                <el-input
                    v-model="queryParams.lsxm"
                    placeholder="请输入老师姓名(可模糊查询)"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="主题" prop="theme">
                <el-input
                    v-model="queryParams.theme"
                    placeholder="请输入主题(可模糊查询)"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="时间" prop="dateArr">
                <el-date-picker
                    v-model="dateArr"
                    type="daterange"
                    align="right"
                    unlink-panels
                    @change="changeDataArr"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                ></el-date-picker>
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
                    v-hasPermi="['basic:excellentTraining:add']"
                >新增</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basic:excellentTraining:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basic:excellentTraining:remove']"
        >删除</el-button>
            </el-col>-->
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table
            v-loading="loading"
            :height="$root.tableHeight"
            border
            :data="excellentTrainingList"
            @selection-change="handleSelectionChange"
        >
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="主键" align="center" prop="id" v-if="false" />
            <el-table-column label="班级id" align="center" prop="bjid" v-if="false" />
            <el-table-column label="老师id" align="center" prop="lsid" v-if="false" />
            <el-table-column label="班级名称" align="center" prop="bjmc" />
            <el-table-column label="老师姓名" align="center" prop="lsxm" />
            <el-table-column label="主题" align="center" prop="theme" />
            <el-table-column label="针对学生id" align="center" prop="zdxsid" v-if="false" />
            <el-table-column label="图片id" align="center" prop="tpid" v-if="false" />
            <el-table-column label="培优内容" align="center" prop="content">
                <template slot-scope="scope">
                    <div ref="pyrn" class="pyrn" v-html="scope.row.content"></div>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark">
                <template slot-scope="scope">
                    <div v-html="scope.row.remark"></div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['basic:excellentTraining:edit']"
                    >修改</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleDetails(scope.row)"
                    >详情</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['basic:excellentTraining:remove']"
                    >删除</el-button>
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

        <!-- 添加或修改培优补差对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="班级id" prop="bjid">
                    <el-input v-model="form.bjid" placeholder="请输入班级id" />
                </el-form-item>
                <el-form-item label="老师id" prop="lsid">
                    <el-input v-model="form.lsid" placeholder="请输入老师id" />
                </el-form-item>
                <el-form-item label="主题" prop="theme">
                    <el-input v-model="form.theme" placeholder="请输入主题" />
                </el-form-item>
                <el-form-item label="内容">
                    <editor v-model="form.content" :min-height="192" />
                </el-form-item>
                <el-form-item label="针对学生id" prop="zdxsid">
                    <el-input v-model="form.zdxsid" placeholder="请输入针对学生id" />
                </el-form-item>
                <el-form-item label="图片id" prop="tpid">
                    <el-input v-model="form.tpid" placeholder="请输入图片id" />
                </el-form-item>
                <el-form-item label="备注">
                    <editor v-model="form.remark" :min-height="192" />
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
    listExcellentTraining,
    getExcellentTraining,
    delExcellentTraining,
    addExcellentTraining,
    updateExcellentTraining,
} from "@/api/basic/excellentTraining";
import { getToken } from "@/utils/auth";
import { listBjclass } from "@/api/basic/bjclass";
import { parseTime } from "@/utils/ruoyi";
export default {
    name: "ExcellentTraining",
    components: {},
    data() {
        return {
            pickerOptions: {
                shortcuts: [
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            );
                            picker.$emit("pick", [start, end]);
                        },
                    },
                ],
            },

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
            // 培优补差表格数据
            excellentTrainingList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                bjid: null,
                lsid: null,
                lsxm: null,
                theme: null,
                ksrq: null,
                jzrq: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            // 日期范围
            dateArr: [],
            // 班级选择
            bjclassList: [],
        };
    },
    created() {
        this.getList();
        listBjclass().then((response) => {
            this.bjclassList = response.rows;
            // 日语班级选项 -当老师角色登录
            if (this.$store.state.user.dataRoleWeightId == 50) {
                if (response.rows.length == 1) {
                    this.queryParams.bjid = response.rows[0].id;
                }
            }
        });
    },
    methods: {
        changeDataArr(date) {
            this.queryParams.ksrq = parseTime(date[0], "{y}-{m}-{d}");
            this.queryParams.jzrq = parseTime(date[1], "{y}-{m}-{d}");
        },
        /** 查询培优补差列表 */
        getList() {
            this.loading = true;
            listExcellentTraining(this.queryParams).then((response) => {
                this.excellentTrainingList = response.rows;
                this.total = response.total;
                this.loading = false;
                this.$nextTick(() => {
                    this.domReset(document.getElementsByClassName("pyrn"));
                });
            });
        },
        domReset(domList) {
            for (let i = 0; i < domList.length; i++) {
                if (
                    domList[i].nodeName != "IMG" &&
                    domList[i].children &&
                    domList[i].children.length > 0
                ) {
                    this.domReset(domList[i].children);
                } else if (domList[i].nodeName == "IMG") {
                    domList[i].style.width = "300px";
                }
            }
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
                bjid: null,
                lsid: null,
                theme: null,
                content: null,
                zdxsid: null,
                tpid: null,
                remark: null,
                userId: null,
                dataOrder: null,
                createTime: null,
                updateTime: null,
                kzzd1: null,
                kzzd2: null,
                kzzd3: null,
                kzzd4: null,
                kzzd5: null,
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
            this.ids = selection.map((item) => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            let obj = {
                pageType: "update",
                id: row.id,
            };
            this.getConfigKey("pybc-edit").then((res) => {
                this.router = res.msg;
                this.$router.push({
                    path: this.router,
                    query: obj,
                });
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.getConfigKey("pybc-edit").then((res) => {
                this.router = res.msg;
                this.$router.push({
                    path: this.router,
                    query: { pageType: "add" },
                });
            });
        },
        handleDetails(row) {
            this.getConfigKey("pybc-details").then((res) => {
                this.$router.push({
                    path: res.msg,
                    query: row,
                });
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        updateExcellentTraining(this.form).then((response) => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addExcellentTraining(this.form).then((response) => {
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
            const ids = row.id || this.ids;
            this.$confirm("是否确认删除选中的数据?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return delExcellentTraining(ids);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
                .catch((e) => {
                    console.log(e);
                });
        },
    },
};
</script>
