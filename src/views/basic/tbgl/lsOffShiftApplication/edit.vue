<template>
    <div
        style="
            width: 100%;
            height: 100%;
            padding: 10px;
            box-sizing: border-box;
            text-align: center;
        "
    >
        <h3>{{ form.xsxm }}-退班申请</h3>
        <div>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <table style="width: 100%" border="1" cellspacing="0">
                    <thead>
                        <tr>
                            <th>班级</th>
                            <th>{{ form.rybjmc }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td width="200px">老师</td>
                            <td>{{ this.$store.state.user.nickName }}</td>
                        </tr>
                        <tr>
                            <td>入班时间</td>
                            <td>{{ form.rbsj }}</td>
                        </tr>
                        <tr>
                            <td>退班规则</td>
                            <td class="clearfix">
                                <el-form-item
                                    label="退班类型"
                                    prop="tblx"
                                    align="left"
                                >
                                    <el-radio
                                        v-model="form.tblx"
                                        v-for="dict in tbgzlxOption"
                                        :key="dict.dictValue"
                                        :label="dict.dictValue"
                                        @change="onTblxChange"
                                        >{{ dict.dictLabel }}</el-radio
                                    >
                                </el-form-item>
                                <el-form-item label="退班原因" prop="tbyy">
                                    <el-input
                                        type="textarea"
                                        :rows="4"
                                        style="width: 100%"
                                        placeholder="请输入退班原因"
                                        v-model="form.tbyy"
                                    ></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>教与学质量协议</td>
                            <td class="clearfix" align="left">
                                <el-form-item label="请选择" prop="yyxzlxyZt">
                                    <el-radio
                                        v-model="form.yyxzlxyZt"
                                        v-for="dict in jyxzlxyStatusOption"
                                        :key="dict.dictValue"
                                        :label="dict.dictValue"
                                        >{{ dict.dictLabel }}</el-radio
                                    >
                                </el-form-item>
                                <el-form-item label="上传图片">
                                    <el-upload
                                        :limit="uploadMaxNum"
                                        :action="upload.url"
                                        :headers="upload.headers"
                                        list-type="picture-card"
                                        :on-preview="handlePictureCardPreview"
                                        :on-remove="handleRemove"
                                        :on-success="jyxzlxyUploadSuccess"
                                        :file-list="jyxzlxyPhotoArr"
                                        :before-upload="beforeFile"
                                        :data="fileForm"
                                    >
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible">
                                        <img
                                            width="100%"
                                            :src="dialogImageUrl"
                                            alt
                                        />
                                    </el-dialog>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="isShow">
                            <td>收据</td>
                            <td class="clearfix" align="left">
                                <el-form-item label="请选择" prop="sjZt">
                                    <el-radio
                                        v-model="form.sjZt"
                                        v-for="dict in sjStatusOption"
                                        :key="dict.dictValue"
                                        :label="dict.dictValue"
                                        >{{ dict.dictLabel }}</el-radio
                                    >
                                </el-form-item>
                                <el-form-item label="上传图片">
                                    <el-upload
                                        :limit="uploadMaxNum"
                                        :action="upload.url"
                                        :headers="upload.headers"
                                        list-type="picture-card"
                                        :on-preview="handlePictureCardPreview"
                                        :on-remove="handleRemove"
                                        :on-success="sjUploadSuccess"
                                        :file-list="tpslPhotoArr"
                                        :before-upload="beforeFile"
                                        :data="fileForm"
                                    >
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible">
                                        <img
                                            width="100%"
                                            :src="dialogImageUrl"
                                            alt
                                        />
                                    </el-dialog>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="isShow">
                            <td>银行卡号</td>
                            <td>
                                <el-form-item
                                    label="(如需退费则输入)"
                                    prop="yhkh"
                                >
                                    <el-input
                                        type="textarea"
                                        :rows="3"
                                        placeholder="请输入银行卡号"
                                        v-model="form.yhkh"
                                    ></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>退班申请资料</td>
                            <td>
                                <div
                                    style="
                                        width: 180px;
                                        height: 270px;
                                        margin-top: 10px;
                                        margin-left: 80px;
                                    "
                                >
                                    <el-upload
                                        ref="upload"
                                        :limit="uploadMaxNum"
                                        accept=".*"
                                        :headers="upload.headers"
                                        :action="upload.url"
                                        :on-remove="handleRemove"
                                        :on-success="tbsqzlUploadSuccess"
                                        :auto-upload="true"
                                        :file-list="tbsqzlFileArr"
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
                                                style="color: red"
                                                slot="tip"
                                            >
                                                提示：上传的文件大小不能超过50M！
                                            </div>
                                        </div>
                                    </el-upload>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>备注</td>
                            <td>
                                <el-form-item prop="remark">
                                    <el-input
                                        type="textarea"
                                        :rows="4"
                                        placeholder="请输入备注"
                                        v-model="form.remark"
                                    ></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>操作</td>
                            <td>
                                <el-button
                                    icon="el-icon-close"
                                    @click="$router.go(-1)"
                                    >返回上个页面</el-button
                                >
                                <el-button
                                    type="primary"
                                    icon="el-icon-check"
                                    v-prevent-re-click
                                    @click="submitForm"
                                    >提交申请</el-button
                                >
                            </td>
                        </tr>
                    </tbody>
                </table>
            </el-form>
        </div>
    </div>
</template>

<script>
import { addImg, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
import { getToken } from "@/utils/auth";
import { updateStuTuiban } from "@/api/basic/stuTuiban";
export default {
    data() {
        return {
            upload: {
                // 是否显示弹出层
                open: false,
                // 弹出层标题
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传地址
                url: process.env.VUE_APP_BASE_API + "/file/renameUpload",
            },
             fileForm: {
                    renameFileName: ""
                },
            dialogVisible: false,
            dialogImageUrl: null,
            form: {
                id: null,
                xsbh: null,
                rybjid: null,
                lsid: null,
                rbsj: null,
                tblx: "2",
                tbyy: null,
                yyxzlxyZt: null,
                yyxzlxyTpid: null,
                sjZt: null,
                sjTpid: null,
                yhkh: null,
                tbsqzlTpid: null,
                shzt: null,
                tbsj: null,
                remark: null,
                userId: null,
                createTime: null,
                updateTime: null,
                kzzd1: null,
                kzzd2: null,
                kzzd3: null,
                kzzd4: null,
                kzzd5: null,
            },
            rules: {
                tblx: [
                    // 退班类型
                    {
                        required: true,
                        message: "不能为空",
                        trigger: "blur",
                    },
                ],
                tbyy: [
                    // 退班原因
                    {
                        required: true,
                        message: "不能为空",
                        trigger: "blur",
                    },
                ],
                yyxzlxyZt: [
                    // 教与学质量协议-必填
                    {
                        required: true,
                        message: "不能为空",
                        trigger: "blur",
                    },
                ],
                sjZt: [
                    // 收据-状态
                    {
                        required: true,
                        message: "不能为空",
                        trigger: "blur",
                    },
                ],
            },
            // 教与学质量协议-状态码表
            jyxzlxyStatusOption: [],
            // 收据-状态码表
            sjStatusOption: [],
            // 退班规则-类型码表
            tbgzlxOption: [],
            // 教与学质量协议图片数组
            jyxzlxyPhotoArr: [],
            // 收据图片数组
            tpslPhotoArr: [],
            // 退班申请资料-文件数组
            tbsqzlFileArr: [],
            // 最多上传的数量
            uploadMaxNum: 3,
            // 父页面跳转过来所带的行对象
            parentRowData: null,
            // 默认显示 【收据】、【银行卡号】；点击[只退班]则收据+银行卡号不出现
            isShow: true,
        };
    },
    created() {
        // 教与学质量协议-状态码表
        this.getDicts("jyxzlxy-status").then((response) => {
            this.jyxzlxyStatusOption = response.data;
        });
        // 收据-状态码表
        this.getDicts("sj-status").then((response) => {
            this.sjStatusOption = response.data;
        });
        // 退班规则-类型码表
        this.getDicts("tbgzlx").then((response) => {
            this.tbgzlxOption = response.data;
        });
        this.form = JSON.parse(this.$route.query.row);
    },
    methods: {
        //  文件上传修改名称
       beforeFile(file) {
        this.fileForm.renameFileName ='退班管理-'+file.name
    },
        // 图片预览 大图
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        //图片删除
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
        // 退班类型选择-1表示只退班，2 退班退费
        onTblxChange(val) {
            if (1 == val) {
                this.isShow = false;
            } else {
                this.isShow = true;
            }
        },
        // 教与学质量协议-图片上传成功回调
        jyxzlxyUploadSuccess(response, file, fileList) {
            this.form.yyxzlxyTpid = this.getFileAddResp(
                response,
                file,
                fileList,
                this.form.yyxzlxyTpid,
                "个图片"
            );
        },
        // 收据-图片上传成功回调
        sjUploadSuccess(response, file, fileList) {
            this.form.sjTpid = this.getFileAddResp(
                response,
                file,
                fileList,
                this.form.sjTpid,
                "个图片"
            );
        },
        // 退班申请资料-上传成功回调
        tbsqzlUploadSuccess(response, file, fileList) {
            this.form.tbsqzlTpid = this.getFileAddResp(
                response,
                file,
                fileList,
                this.form.tbsqzlTpid,
                "个文件"
            );
        },
        // 获取上传成功后的回调
        getFileAddResp(response, file, fileList, tpid, msg) {
            if (response.code == 500) {
                this.$notify({
                    message: "上传失败",
                    type: "error",
                });
                return;
            }
            let data = response.data;
            data.kzzd1 = tpid || secretKey();
            tpid = data.kzzd1;
            addImg(data).then((res) => {
                file.id = res.data.id;
                this.ifPhotoLimit(fileList.length, msg);
            });
            return tpid;
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    updateStuTuiban(this.form).then((response) => {
                        if ((response.code = 200)) {
                            // 获取页面中参数配置的路由
                            this.getConfigKey("tblb").then((resp) => {
                                this.router = resp.msg;
                                this.$router.push({
                                    path: this.router,
                                });
                            });
                            this.msgSuccess("提交成功");
                        } else {
                            this.msgError("提交失败！请联系管理员");
                        }
                    });
                }
            });
        },
        // 图片限制判断
        ifPhotoLimit(num, msg) {
            if (num >= this.uploadMaxNum) {
                this.$message({
                    message: "最多上传 " + this.uploadMaxNum + msg,
                    type: "warning",
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
th,
td {
    padding: 15px;
    box-sizing: border-box;
}
</style>
