<template>
    <div class="sc-wrap">
        <el-tabs
            type="border-card"
            v-model="activeName"
            @tab-click="handleClick"
        >
            <el-button size="mini" type="success" @click="handelUpload"
                >上 传</el-button
            >
            <el-tab-pane label="图片" name="image"></el-tab-pane>
            <el-tab-pane label="音频" name="voice"></el-tab-pane>
            <el-tab-pane label="视频" name="video"></el-tab-pane>
            <!-- 列表 -->
            <div style="margin: 20px 0px">
                <el-table :data="scTableData" border style="width: 100%">
                    <el-table-column type="index" label="序号" width="55">
                    </el-table-column>
                    <el-table-column prop="scbt" label="音频标题" width="180">
                    </el-table-column>
                    <el-table-column prop="spscbt" label="视频标题" width="180">
                    </el-table-column>
                    <el-table-column prop="scmc" label="素材名称" width="180">
                    </el-table-column>
                    <el-table-column prop="fmtpscMediaId" label="MediaId">
                    </el-table-column>
                    <el-table-column prop="createTime" label="上传时间">
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.status == 1"
                                >正 常</el-tag
                            >
                            <el-tag type="danger" v-if="scope.row.status == 0"
                                >删 除</el-tag
                            >
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="操作" width="200px">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="danger"
                                :disabled="scope.row.status == 0"
                                @click="handelDelete(scope.row)"
                                >删 除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-tabs>

        <el-dialog :title="uploadName" :visible.sync="dialogFormVisible">
            <div v-if="uploadTp">
                <el-upload
                    ref="upload"
                    :headers="upload.headers"
                    :action="upload.fileUrl"
                    :on-success="handleFileSuccess"
                    :auto-upload="false"
                    :data="{
                        ...uploadForm,
                        sclx: 'image',
                        status: 1,
                        userId: $store.state.user.userId,
                        author: $store.state.user.nickName,
                    }"
                    drag
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                        将文件拖到此处，或
                        <em>点击上传</em>
                    </div>
                </el-upload>
            </div>
            <div v-if="uploadYp">
                <table style="width: 100%" border="1" cellspacing="0">
                    <tbody>
                        <tr>
                            <td
                                style="
                                    padding: 20px;
                                    box-sizing: border-box;
                                    text-align: center;
                                "
                            >
                                上传音频
                            </td>
                            <td style="padding: 20px; box-sizing: border-box">
                                <el-upload
                                    ref="upload"
                                    :headers="upload.headers"
                                    :action="upload.fileUrl"
                                    :on-success="handleFileSuccess"
                                    :auto-upload="false"
                                    :data="{
                                        ...uploadForm,
                                        sclx: 'voice',
                                        status: 1,
                                        userId: $store.state.user.userId,
                                        author: $store.state.user.nickName,
                                    }"
                                    drag
                                >
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">
                                        将文件拖到此处，或
                                        <em>点击上传</em>
                                    </div>
                                </el-upload>
                            </td>
                        </tr>
                        <tr>
                            <td
                                style="
                                    padding: 20px;
                                    box-sizing: border-box;
                                    text-align: center;
                                "
                            >
                                标题
                            </td>
                            <td style="padding: 20px; box-sizing: border-box">
                                <el-input v-model="uploadForm.scbt" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="uploadSp">
                <table style="width: 100%" border="1" cellspacing="0">
                    <tbody>
                        <tr>
                            <td
                                style="
                                    padding: 20px;
                                    box-sizing: border-box;
                                    text-align: center;
                                "
                            >
                                上传视频
                            </td>
                            <td style="padding: 20px; box-sizing: border-box">
                                <el-upload
                                    ref="upload"
                                    :headers="upload.headers"
                                    :action="upload.fileUrl"
                                    :on-success="handleFileSuccess"
                                    :auto-upload="false"
                                    accept=".mp4"
                                    :data="{
                                        ...uploadForm,
                                        sclx: 'video',
                                        status: 1,
                                        userId: $store.state.user.userId,
                                        author: $store.state.user.nickName,
                                    }"
                                    drag
                                >
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">
                                        将文件拖到此处，或
                                        <em>点击上传</em>
                                    </div>
                                </el-upload>
                            </td>
                        </tr>
                        <tr>
                            <td
                                style="
                                    padding: 20px;
                                    box-sizing: border-box;
                                    text-align: center;
                                "
                            >
                                封面
                            </td>
                            <td style="padding: 20px; box-sizing: border-box">
                                <el-select
                                    v-model="uploadForm.fmtpscMediaId"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in imgOptions"
                                        :key="item.value"
                                        :label="item.scmc"
                                        :value="item.mediaId"
                                    >
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td
                                style="
                                    padding: 20px;
                                    box-sizing: border-box;
                                    text-align: center;
                                "
                            >
                                标题
                            </td>
                            <td style="padding: 20px; box-sizing: border-box">
                                <el-input v-model="uploadForm.spscbt" />
                            </td>
                        </tr>
                        <tr>
                            <td
                                style="
                                    padding: 20px;
                                    box-sizing: border-box;
                                    text-align: center;
                                "
                            >
                                视频介绍
                            </td>
                            <td style="padding: 20px; box-sizing: border-box">
                                <el-input v-model="uploadForm.spscms" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUploadMaterial"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import {
    listWxMessage,
    getWxMessage,
    addWxMessage,
    updateWxMessage,
    delWxMessage,
} from "@/api/basic/messageCenter";
import {
    listWxMaterial,
    getWxMaterial,
    addWxMaterial,
    updateWxMaterial,
    delWxMaterial,
} from "@/api/basic/wxMaterial";
export default {
    data() {
        return {
            scTableData: [],
            activeName: "image",
            uploadName: "",
            dialogFormVisible: false,
            uploadTp: true,
            uploadYp: false,
            uploadSp: false,
            uploadForm: {},
            imgOptions: [],
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
                // 上传考试成绩地址
                // fileUrl: this.wecharServerUrl + "wxMaterial",
                fileUrl: "http://ndx-wxgzh-server.natapp1.cc/wxMaterial",
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            listWxMaterial("http://ndx-wxgzh-server.natapp1.cc/", {
                sclx: this.activeName,
            }).then((res) => {
                this.scTableData = res.rows;
            });
            listWxMaterial("http://ndx-wxgzh-server.natapp1.cc/", {
                sclx: "image",
            }).then((res) => {
                this.imgOptions = res.rows;
            });
        },
        handelDelete(row) {
            this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    delWxMaterial("http://ndx-wxgzh-server.natapp1.cc/", {
                        ids: [row.id],
                        mediaIds: [row.mediaId],
                    }).then((res) => {
                        if (res.code == 200) {
                            this.$message({
                                type: "success",
                                message: "删除成功!",
                            });
                            this.getList();
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        handelUpload() {
            switch (this.activeName) {
                case "image":
                    this.uploadName = "图片上传";
                    this.uploadYp = false;
                    this.uploadSp = false;
                    this.uploadTp = true;
                    break;
                case "voice":
                    this.uploadName = "音频上传";
                    this.uploadTp = false;
                    this.uploadSp = false;
                    this.uploadYp = true;
                    break;
                case "video":
                    this.uploadName = "视频上传";
                    this.uploadTp = false;
                    this.uploadYp = false;
                    this.uploadSp = true;
                    break;
                default:
                    break;
            }
            this.uploadForm = {};
            this.dialogFormVisible = true;
        },
        handleClick() {
            this.getList();
        },
        handleFileSuccess(response, file, fileList) {
            this.getList();
        },
        addUploadMaterial() {
            this.$refs.upload.submit();
            this.dialogFormVisible = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.sc-wrap {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
}
</style>