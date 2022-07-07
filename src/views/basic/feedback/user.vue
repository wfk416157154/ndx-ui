<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="问题类型" prop="problemType">
                <el-select
                    v-model="queryParams.problemType"
                    placeholder="请选择问题类型"
                    clearable
                    size="small"
                >
                    <el-option
                        v-for="dict in problemTypesOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间" prop="sjArr">
                <el-date-picker
                    size=" mini"
                    v-model="queryParams.sjArr"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="标题" prop="kzzd1">
                <el-input v-model="queryParams.kzzd1" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
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
                >添加问题</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table
            style="width: 100%;font-size : 18px"
            v-loading="loading"
            :height="$root.tableHeight"
            border
            :data="feedbackList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="班级" align="center" prop="rybjmc" />
            <el-table-column label="姓名" align="center" prop="problemUserNickname" />
            <el-table-column label="标题" align="center" prop="kzzd1" />
            <el-table-column prop="problemType" label="问题类型">
                <template slot-scope="scope">
                    <dict-tag :options="problemTypesOptions" :value="scope.row.problemType" />
                </template>
            </el-table-column>
            <el-table-column label="提问时间" align="center" prop="createTime" width="180"></el-table-column>
            <el-table-column label="问题描述" align="center" prop="problemDescribe" v-if="false" />
            <el-table-column label="文件下载" align="center" prop="wjidArr">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        v-for="(item,index) in scope.row.wjidArr"
                        :key="index"
                        @click="downloadFileName(item.wjmc)"
                    >{{item.wjmc}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="解决方法" align="center" prop="solution">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="checkJjbf(scope.row)">点击查看</el-button>
                </template>
            </el-table-column>
            <el-table-column label="问题解决时间" align="center" prop="solutionTime" width="180"></el-table-column>

            <el-table-column prop="solutionStatus" label="问题解决状态">
                <template slot-scope="scope">
                    <dict-tag :options="problemStatusOptions" :value="scope.row.solutionStatus" />
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        v-if="scope.row.solutionStatus == 2"
                        @click="handleUpdate(scope.row)"
                    >修改</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-s-flag"
                        @click="handleCheck(scope.row)"
                    >查看</el-button>
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

        <!-- 添加或修改问题反馈对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="班级" prop="rybjid">
                    <el-select v-model="form.rybjid" placeholder="请选择" disabled>
                        <el-option
                            v-for="dict in bjclassList"
                            :key="dict.id"
                            :label="dict.rybjmc"
                            :value="dict.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名" prop="problemUserNickname">
                    <el-input v-model="form.problemUserNickname" disabled />
                </el-form-item>
                <el-form-item label="标题" prop="kzzd1">
                    <el-input v-model="form.kzzd1" maxlength="200" placeholder="不能超过200个字" />
                </el-form-item>
                <el-form-item label="问题类型" prop="problemType">
                    <el-select v-model="form.problemType" placeholder="请选择问题类型">
                        <el-option
                            v-for="dict in problemTypesOptions"
                            :key="dict.dictValue"
                            :label="dict.dictLabel"
                            :value="dict.dictValue"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题描述" prop="problemDescribe">
                    <editor v-model="form.problemDescribe" :min-height="192" />
                </el-form-item>
                <el-form-item label="文件上传" prop="wjid">
                    <el-upload
                        ref="upload"
                        :limit="maxPhotoNum"
                        accept=".*"
                        :headers="upload.headers"
                        :action="upload.url"
                        :disabled="isCheck"
                        :on-remove="handleRemove"
                        :on-progress="handleFileUploadProgress"
                        :on-success="handleFileSuccess"
                        :auto-upload="true"
                        :file-list="wjidFile"
                        :before-upload="beforeFile"
                        :data="fileForm"
                        drag
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                            <div
                                class="el-upload__tip"
                                style="color:red"
                                slot="tip"
                            >提示：仅允许上传50M以内文件！</div>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="备注">
                    <editor v-model="form.remark" :min-height="192" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    v-prevent-re-click
                    :disabled="isCheck"
                    @click="submitForm"
                >确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 弹出解决办法对话框 -->
        <el-dialog :title="title" :visible.sync="jjbfOpen" width="80%">
            <div v-html="form.solution" style="padding: 10px"></div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listFeedback,
    getFeedback,
    delFeedback,
    addFeedback,
    updateFeedback,
} from "@/api/basic/feedback";
import { getToken } from "@/utils/auth";
import { listBjclass } from "@/api/basic/bjclass";
import { addImg, selectFileList, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
export default {
    name: "Feedback",
    components: {},
    data() {
        return {
            isCheck: false,
            // 遮罩层
            loading: true,
            jjbfOpen: false,
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
            // 问题反馈表格数据
            feedbackList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                problemType: null,
                solutionStatus: null,
                sjArr: [],
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                kzzd1: [
                    {
                        required: true,
                        message: "标题不能为空",
                        trigger: "blur",
                    },
                ],
            },
            // 导入参数
            upload: {
                // 是否显示弹出层
                open: false,
                // 弹出层标题
                title: "上传文件",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/file/renameUpload",
            },
            fileForm: {
                renameFileName: "",
            },
            problemTypesOptions: [], // 问题类型字典类型
            problemStatusOptions: [], // 问题解决状态字典类型
            bjclassList: [], // 班级集
            bjid: null,
            // 文件id数组
            wjidFile: [],
            // 最多上传的图片数量
            maxPhotoNum: 3,
        };
    },
    created() {
        this.getList();
        this.getDicts("problem_types").then((response) => {
            this.problemTypesOptions = response.data;
        });
        this.getDicts("problem_status").then((response) => {
            this.problemStatusOptions = response.data;
        });
        this.getListBjclass();
    },
    methods: {
        //  文件上传修改名称
        beforeFile(file) {
            this.fileForm.renameFileName = "用户问题反馈列表-" + file.name;
        },
        getListBjclass() {
            listBjclass().then((response) => {
                this.bjclassList = response.rows;
                if (
                    this.$store.state.user.dataRoleWeightId == 50 &&
                    response.rows.length >= 1
                ) {
                    this.bjid = response.rows[0].id; // 获取老师所带班级
                }
            });
        },
        /** 查询问题反馈列表 */
        getList() {
            this.loading = true;
            listFeedback(this.queryParams).then((response) => {
                this.feedbackList = response.rows;
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
            this.form = {
                id: null,
                rybjid: null,
                problemUserId: null,
                problemUserNickname: null,
                problemType: null,
                problemDescribe: null,
                wjid: null,
                solution: null,
                solutionUserId: null,
                solutionTime: null,
                solutionStatus: null,
                remark: null,
                userId: null,
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
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.form.problemUserId = this.$store.state.user.userId;
            this.form.problemUserNickname = this.$store.state.user.nickName;
            this.form.rybjid = this.bjid;
            this.form.problemType = "1"; // 避免问题类型不选为空
            this.title = "问题反馈中心";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getFeedback(id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = "修改问题反馈";
            });
        },
        // 查看
        handleCheck(row) {
            this.reset();
            this.isCheck = true;
            const id = row.id || this.ids;
            getFeedback(id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = "查看问题反馈";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        updateFeedback(this.form).then((response) => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addFeedback(this.form).then((response) => {
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
                    return delFeedback(ids);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.ifPhotoLimit(fileList.length, " 个文件");
            this.upload.open = false;
            this.upload.isUploading = false;
            let data = response.data;
            data.kzzd1 = this.form.wjid || secretKey();
            this.form.wjid = data.kzzd1;
            addImg(data).then((res) => {
                file.id = res.data.id;
                this.msgSuccess("文件上传成功");
                this.wjidFile = fileList;
            });
            this.$refs.upload.clearFiles();
        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.upload.submit();
        },
        // 文件限制判断
        ifPhotoLimit(num, msg) {
            if (num >= this.maxPhotoNum) {
                this.$message({
                    message: "最多上传 " + this.maxPhotoNum + msg,
                    type: "warning",
                });
            }
        },
        //公共图片删除
        handleRemove(file, fileList) {
            deleteImg(file.id).then((res) => {
                if (res.code == 200) {
                    this.$message({
                        message: "删除成功",
                        type: "success",
                    });
                } else {
                    this.$message.error("删除失败");
                }
            });
        },
        /** 下载模板操作 */
        downloadFileName(fileName) {
            this.download(
                "file/filetable/download",
                {
                    wjmc: fileName,
                    ssmk: "退班列表-老师模块",
                },
                fileName
            );
        },
        // 查看解决办法
        checkJjbf(row) {
            this.reset();
            const id = row.id || this.ids;
            getFeedback(id).then((response) => {
                this.form = response.data;
                this.jjbfOpen = true;
                this.title = "查看解决办法";
            });
        },
    },
};
</script>
