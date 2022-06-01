<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="班级" prop="bjid">
                <el-select v-model="queryParams.bjid" placeholder="请选择班级id" clearable size="small">
                    <el-option v-for="item in bjclassList" :key="item.id" :label="item.rybjmc" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="老师姓名" prop="lsxm">
                <el-input v-model="queryParams.lsxm" placeholder="请输入老师姓名" />
            </el-form-item>
            <el-form-item label="日期" prop="lsxm">
                <el-date-picker v-model="queryParams.scrqArr" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['basic:composition:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['basic:composition:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['basic:composition:remove']">删除</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :height="$root.tableHeight" border :data="compositionList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="班级名称" align="center" prop="bjmc" />
            <el-table-column label="老师姓名" align="center" prop="lsxm" />
            <el-table-column label="作文类型" align="center" prop="type" />
            <el-table-column label="文件" align="center" prop="kzzd1">
                <template slot-scope="scope">
                    <a :href="scope.row.kzzd1" style="color:#409EFF" download>点击下载</a>
                </template>
            </el-table-column>
            <el-table-column label="上传日期" align="center" prop="scrq" />
            <el-table-column label="备注" align="center" prop="remark" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['basic:composition:edit']">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['basic:composition:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改作文对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="班级" prop="bjid">
                    <el-select v-model="form.bjid" placeholder="请选择班级" clearable size="small">
                        <el-option v-for="item in bjclassList" :key="item.id" :label="item.rybjmc" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="老师" prop="lsxm">
                    <el-input v-model="form.lsxm" />
                </el-form-item>
                <el-form-item label="作文类型" prop="type">
                    <el-input v-model="form.type" placeholder="请输入作文类型" />
                </el-form-item>
                <el-form-item label="文件" prop="wjid">
                    <el-upload ref="uploadvideo" :headers="upload.headers" :action="upload.imgUrl" :on-success="handleFileSuccess" :before-upload="beforeFile" :data="fileForm" drag>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listComposition, getComposition, delComposition, addComposition, updateComposition } from "@/api/basic/composition";
import { getToken } from "@/utils/auth";
import { listBjclass } from "@/api/basic/bjclass";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";

export default {
    name: "Composition",
    components: {
    },
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
            // 作文表格数据
            compositionList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                bjid: null,
                bjmc: null,
                lsid: null,
                lsxm: null,
                type: null,
                wjid: null,
                scrq: null,
            },
            // 文件图片上传
            upload: {
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的用户数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传图片地址
                imgUrl: process.env.VUE_APP_BASE_API + "/file/renameUpload",
            },
            fileForm: {
                renameFileName: ""
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
            },
            bjclassList: []
        };
    },
    created() {
        this.getList();
        let classJson = {}
        if (this.$store.state.user.dataRoleWeightId == 50) {
            classJson.lsid = this.$store.state.user.glrid
        }
        listBjclass(classJson).then((response) => {
            this.bjclassList = response.rows;
        });
    },
    methods: {
        //  文件上传修改名称
       beforeFile(file) {
        this.fileForm.renameFileName ='南斗星作文-'+file.name
    },
        /** 查询作文列表 */
        getList() {
            this.loading = true;
            listComposition(this.queryParams).then(response => {
                this.compositionList = response.rows;
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
                bjid: null,
                bjmc: null,
                lsid: null,
                lsxm: null,
                type: null,
                wjid: null,
                scrq: null,
                status: "0",
                remark: null,
                userId: null,
                userName: null,
                createTime: null,
                updateTime: null,
                kzzd1: null,
                kzzd2: null,
                kzzd3: null,
                kzzd4: null
            };
            this.resetForm("form");
        },
        // 上传成功
        handleFileSuccess(response, file, fileList) {
            if (response.code == 200) {
                let data = response.data;
                data.kzzd1 = secretKey();
                this.form.wjid = data.kzzd1;
                this.form.kzzd1 = data.wjlj;
                this.form.scrq = this.parseTime(new Date(), "{y}-{m}-{d}");
                addImg(data).then((res) => {
                    if (res.code == 200) {
                        this.msgSuccess("上传成功");
                    }
                });
            } else {
                this.msgError("上传失败");
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
            this.form.lsxm = this.$store.state.user.nickName
            this.title = "添加作文";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids
            getComposition(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改作文";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.form.lsid = this.$store.state.user.glrid
                    if (this.form.id != null) {
                        updateComposition(this.form).then(response => {
                            if (200 == response.code) {
                                this.getList();
                                this.msgSuccess(response.msg);
                            } else {
                                this.msgError(response.msg);
                            }
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addComposition(this.form).then(response => {
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
                return delComposition(ids);
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
