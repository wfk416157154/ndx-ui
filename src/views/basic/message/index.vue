<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="消息类型" prop="xxlx">
                <el-select v-model="queryParams.xxlx" placeholder="请选择消息类型" clearable size="small">
                    <el-option
                        v-for="dict in xxlxOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="消息标题" prop="xxbt">
                <el-input
                    v-model="queryParams.xxbt"
                    placeholder="请输入消息标题"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="消息确认方式" prop="xxqrlx" label-width="100px">
                <el-select
                    v-model="queryParams.xxqrlx"
                    placeholder="请选择消息确认方式"
                    clearable
                    size="small"
                >
                    <el-option
                        v-for="dict in xxqrlxOptions"
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
                    v-hasPermi="['basic:message:add']"
                >新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    :disabled="single"
                    @click="handleUpdate"
                    v-hasPermi="['basic:message:edit']"
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
                    v-hasPermi="['basic:message:remove']"
                >删除</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table
            v-loading="loading"
            :height="$root.tableHeight"
            border
            :data="messageList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="查看" align="center" width="200px" prop="id">
                <template slot-scope="scope">
                    <a href="#">
                        <span
                            style="margin-left: 10px;color: dodgerblue"
                            @click="showJsrPage(scope.row)"
                        >查看(确认/回复)人员</span>
                    </a>
                    <br />
                    <a href="#">
                        <span
                            style="margin-left: 10px;color: red"
                            @click="showNoReplyPage(scope.row)"
                        >查看(未确认/未回复)人员</span>
                    </a>
                </template>
            </el-table-column>
            <el-table-column label="消息类型" align="center" prop="xxlx">
                <template slot-scope="scope">
                    <dict-tag :options="xxlxOptions" :value="scope.row.xxlx" />
                </template>
            </el-table-column>
            <el-table-column label="消息标题" align="center" prop="xxbt" />
            <el-table-column label="消息内容" align="center" prop="xxnr" v-if="false" />
            <el-table-column label="是否全部发送" align="center" prop="sfqbfs">
                <template slot-scope="scope">
                    <dict-tag :options="sfqbfsOptions" :value="scope.row.sfqbfs" />
                </template>
            </el-table-column>
            <el-table-column label="消息确认方式" align="center" prop="xxqrlx">
                <template slot-scope="scope">
                    <dict-tag :options="xxqrlxOptions" :value="scope.row.xxqrlx" />
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark" />
            <el-table-column label="提交人名称" align="center" prop="userName" />
            <el-table-column label="发送时间" align="center" prop="createTime" width="180px"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['basic:message:edit']"
                    >修改</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['basic:message:remove']"
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

        <!-- 添加或修改消息管理对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="消息类型" prop="xxlx">
                    <el-select v-model="form.xxlx" placeholder="请选择消息类型">
                        <el-option
                            v-for="dict in xxlxOptions"
                            :key="dict.dictValue"
                            :label="dict.dictLabel"
                            :value="dict.dictValue"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="消息标题" prop="xxbt">
                    <el-input v-model="form.xxbt" maxlength="100" placeholder="请输入消息标题" />
                </el-form-item>
                <el-form-item label="消息内容" prop="xxnr">
                    <editor v-model="form.xxnr" :min-height="192" />
                </el-form-item>
                <el-form-item label="全部发送" prop="sfqbfs">
                    <el-select v-model="form.sfqbfs" placeholder="请选择是否发送给所有用户">
                        <el-option
                            v-for="dict in sfqbfsOptions"
                            :key="dict.dictValue"
                            :label="dict.dictLabel"
                            :value="dict.dictValue"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="接收人" prop="jsrArr" v-if="form.sfqbfs=='0'">
                    <el-select
                        v-model="form.kzzd1"
                        filterable
                        placeholder="请选择校区名称"
                        @change="xqmcOnChange"
                    >
                        <el-option
                            v-for="(item,index) in selectXqmc"
                            :key="index"
                            :label="item.xxmc"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                    <el-select
                        v-model="lsphone"
                        filterable
                        placeholder="请选择老师"
                        @change="teacherOnChange"
                    >
                        <el-option
                            v-for="(item,index) in teacherList"
                            :key="index"
                            :label="item.lsxm+'-'+item.dhhm"
                            :value="item.lsxm+'-'+item.dhhm"
                        ></el-option>
                    </el-select>

                    <el-checkbox-group v-model="form.jsrArr" @change="mulTecherChange">
                        <el-checkbox
                            v-for="(item,index) in teacherList"
                            :key="index"
                            :label="item.lsxm+'-'+item.dhhm"
                            name="jsrArr"
                        ></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="文件" prop="id">
                    <el-upload
                        ref="upload"
                        :limit="maxPhotoNum"
                        accept=".*"
                        :headers="upload.headers"
                        :action="upload.url"
                        :disabled="upload.isUploading"
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
                        </div>
                        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许上传50M以内的文件！</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="消息确认" prop="xxqrlx">
                    <el-radio-group v-model="form.xxqrlx">
                        <el-radio
                            v-for="dict in xxqrlxOptions"
                            :key="dict.dictValue"
                            :label="dict.dictValue"
                        >{{dict.dictLabel}}</el-radio>
                    </el-radio-group>
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

        <!-- 消息接收人-确认表表格数据 -->
        <el-dialog :title="title" :visible.sync="receiveOpen" width="800px" append-to-body>
            <el-table v-loading="loading" border :data="messageReceiveList">
                <el-table-column label="id" align="center" prop="id" v-if="false" />
                <el-table-column label="关联消息表id" align="center" prop="messageId" v-if="false" />
                <el-table-column label="用户手机号" align="center" prop="userId" width="150px" />
                <el-table-column label="用户名称" align="center" prop="userName" />
                <el-table-column label="回复内容" align="center" prop="hfnr" />
                <el-table-column label="备注" align="center" prop="remark" />
                <el-table-column label="状态" align="center" prop="status">
                    <template slot-scope="scope">
                        <dict-tag :options="confirmOptions" :value="scope.row.status" />
                    </template>
                </el-table-column>
                <el-table-column label="确认/回复时间" align="center" prop="createTime" width="180px"></el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDeleteReceive(scope.row)"
                            v-hasPermi="['basic:messageReceive:remove']"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 消息接收人-未确认表表格数据 -->
        <el-dialog :title="title" :visible.sync="noReplyOpen" width="500px" append-to-body>
            <el-table v-loading="noReplyLoading" border :data="messageNoReplyList">
                <el-table-column type="index" width="50" />
                <el-table-column label="用户手机号" align="center" prop="nickName" />
                <el-table-column label="用户名称" align="center" prop="userName" />
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import {
    listMessage,
    getMessage,
    delMessage,
    addMessage,
    updateMessage,
    listNoReplyMessage,
} from "@/api/basic/message";
import {
    listMessageReceive,
    delMessageReceive,
} from "@/api/basic/messageReceive";
import { listTeacher } from "@/api/basic/teacher";
import { getToken } from "@/utils/auth";
import { addImg, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
import { listSchool } from "@/api/basic/school";
import { messageInform } from "@/api/basic/weixin";

export default {
    name: "Message",
    components: {},
    data() {
        return {
            lsidList: [],
            // 原始老师列表
            originTeacherList: [],
            teacherMap: new Map(), //全局定义
            // 遮罩层
            loading: true,
            loadingReceive: true,
            noReplyLoading: true,
            importBtn: false,
            fullscreenLoading: false,
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
            // 消息管理表格数据
            messageList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            noReplyOpen: false,
            // 消息类型字典
            xxlxOptions: [],
            // 是否发送给所有用户(0:否，1:是)字典
            sfqbfsOptions: [],
            // 消息确认方式字典
            xxqrlxOptions: [],
            //校区名称
            selectXqmc: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                xxlx: null,
                xxbt: null,
                xxqrlx: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                xxlx: [
                    { required: true, message: "必填项", trigger: "change" },
                ],
                xxbt: [{ required: true, message: "必填项", trigger: "blur" }],
                sfqbfs: [
                    { required: true, message: "必填项", trigger: "change" },
                ],
                xxqrlx: [
                    { required: true, message: "必填项", trigger: "change" },
                ],
            },
            // 上传参数
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
            // 文件id数组
            wjidFile: [],
            // 最多上传的文件数量
            maxPhotoNum: 3,
            // 校区id
            xqid: null,
            wjid: null,
            // 老师列表
            teacherList: [],
            //老师电话
            lsphone: null,
            // 消息接收人-确认表表格数据
            messageReceiveList: [],
            // 消息接收人-确认表表格数据-对话框
            receiveOpen: false,
            // 接收人消息-确认状态
            confirmOptions: [],
            // 未确认/未回复人员信息
            messageNoReplyList: [],
        };
    },
    created() {
        this.getList();
        // 消息类型
        this.getDicts("messageType").then((response) => {
            this.xxlxOptions = response.data;
        });
        // 是/否选项
        this.getDicts("isOrNot").then((response) => {
            this.sfqbfsOptions = response.data;
        });
        // 消息确认方式
        this.getDicts("messageConfirmWay").then((response) => {
            this.xxqrlxOptions = response.data;
        });
        // 消息接收人-消息确认状态
        this.getDicts("confirmStatus").then((response) => {
            this.confirmOptions = response.data;
        });
        // 获取校区
        listSchool().then((response) => {
            this.selectXqmc = response.rows;
        });
        //获取老师
        listTeacher().then((response) => {
            this.originTeacherList = response.rows; //获取所有老师
            this.originTeacherList.forEach((vo) => {
                //遍历数组
                this.teacherMap.set(vo.dhhm, vo.id); //获取所有的电话号码和老师id  key：老师电话号码  value：老师id
            });
        });
    },
    methods: {
        //  文件上传修改名称
        beforeFile(file) {
            this.fileForm.renameFileName = "消息管理-" + file.name;
        },
        /** 查询消息管理列表 */
        getList() {
            this.loading = true;
            listMessage(this.queryParams).then((response) => {
                this.messageList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        /** 查询消息接收人-确认表列表 */
        getReceiveList(obj) {
            this.loadingReceive = true;
            listMessageReceive(obj).then((response) => {
                this.messageReceiveList = response.rows;
                this.loadingReceive = false;
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
                xxlx: null,
                xxbt: null,
                xxnr: null,
                sfqbfs: null,
                xxqrlx: null,
                remark: null,
                userId: null,
                userName: null,
                status: "0",
                dataOrder: null,
                createTime: null,
                updateTime: null,
                kzzd1: null,
                kzzd2: null,
                kzzd3: null,
                kzzd4: null,
                kzzd5: null,
                jsrArr: [],
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
            this.wjidFile = [];
            this.wjid = null;
            this.open = true;
            this.title = "添加消息管理";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getMessage(id).then((response) => {
                this.form = response.data;
                this.xqmcOnChange(response.data.kzzd1);
                this.wjid = this.form.id;
                this.form.jsrArr = this.ifNullToNewArray(response.data.jsrArr);
                this.wjidFile = this.ifNullToNewArray(response.data.fileArr);
                this.open = true;
                this.title = "修改消息管理";
            });
        },
        ifNullToNewArray(arr) {
            if (null == arr) {
                return [];
            }
            return arr;
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if ("1" == this.form.sfqbfs) {
                        // 如果发送给全部用户，则接收人数组置空
                        this.form.jsrArr = [];
                    }
                    if (this.form.id != null) {
                        updateMessage(this.form).then((response) => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        this.form.id = this.wjid;
                        addMessage(this.form).then((response) => {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                            //微信发送提醒消息
                            let messageObj = {
                                sfqbfs: this.form.sfqbfs, //是否全部发送
                                xxlx: this.form.xxlx, //消息类型
                                xxbt: this.form.xxbt, //消息标题
                                lsidList: this.lsidList, //老师id集合
                                userId: this.$store.state.user.userId,
                                userName: this.$store.state.user.nickName,
                            };
                            this.getConfigKey("wecharServerUrl").then(
                                (resp) => {
                                    messageInform(resp.msg, messageObj)
                                        .then((res) => {})
                                        .catch((e) => {
                                            this.$message({
                                                type: "error",
                                                message:
                                                    "操作失败，请联系管理员！",
                                            });
                                        });
                                }
                            );
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
                    return delMessage(ids);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        /** 删除按钮操作 */
        handleDeleteReceive(row) {
            const ids = row.id || this.ids;
            this.$confirm("是否确认删除选中的数据?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return delMessageReceive(ids);
                })
                .then(() => {
                    this.getReceiveList({ messageId: row.messageId });
                    this.msgSuccess("删除成功");
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "basic/message/export",
                {
                    ...this.queryParams,
                },
                `消息管理-${new Date().getTime()}.xlsx`
            );
        },

        /** 导入按钮操作 */
        handleImport() {
            this.importBtn = false;
            this.upload.title = "消息管理数据导入";
            this.upload.open = true;
            this.$nextTick(() => {
                // 页面元素加载完成后执行该方法
                this.$refs.upload.clearFiles();
            });
        },
        /** 下载模板操作 */
        importTemplate() {
            this.download(
                "basic/message/importTemplate",
                {
                    ...this.queryParams,
                },
                `消息管理-导入模板-${new Date().getTime()}.xlsx`
            );
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
            data.kzzd1 = this.wjid || secretKey();
            this.wjid = data.kzzd1;
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
        // 选择校区触发
        xqmcOnChange(xqid) {
            this.lsphone = null;
            listTeacher({ xqmc: xqid }).then((response) => {
                this.teacherList = response.rows;
            });
        },
        // 选择老师触发
        teacherOnChange(lsdh) {
            this.form.jsrArr = [lsdh];
            let dhhm = lsdh.split("-")[1]; //获取老师电话
            let lsid = this.teacherMap.get(dhhm); //根据老师电话查找老师id
            this.lsidList.push(lsid); //将老师id放到lsidList中
        },
        //老师多选框
        mulTecherChange(arr) {
            this.lsidList = [];
            for (let i = 0; i < arr.length; i++) {
                let dhhm = arr[i].split("-")[1]; //获取老师电话
                let lsid = this.teacherMap.get(dhhm); //根据老师电话查找老师id
                this.lsidList.push(lsid); //将老师id放到lsidList中
            }
        },
        // 点击查看(确认/回复)人员按钮触发
        showJsrPage(row) {
            this.receiveOpen = true;
            this.getReceiveList({ messageId: row.id });
        },
        // 点击查看未回复未确认的人员信息
        showNoReplyPage(row) {
            this.noReplyOpen = true;
            this.title = "未回复/未确认消息的人员信息";
            this.noReplyLoading = true;
            listNoReplyMessage({ id: row.id }).then((res) => {
                this.messageNoReplyList = res.rows;
                this.noReplyLoading = false;
            });
        },
    },
};
</script>
