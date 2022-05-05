<template>
    <div style="width:100%,height:100%;padding:40px;box-sizing:border-box">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="班级">
                <el-select v-model="queryParams.bjid" filterable @change="onSelectClass" placeholder="班级">
                    <el-option v-for="item in queryBjclassList " :key="item.id" :label="item.rybjmc" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="学生">
                <el-select v-model="queryParams.studentId" filterable @change="onSelectClass" placeholder="学生">
                    <el-option v-for="item in getListStudent " :key="item.id" :label="item.xsxm" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onAddGkcj">添加</el-button>
                <el-button type="primary" @click="onExport">导出</el-button>
                <el-button type="primary" @click="onGetList('1')">已上传</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="gkcjList" border style="width: 100%">
            <el-table-column prop="xsxm" label="学生" width="180">
            </el-table-column>
            <el-table-column prop="gradeMath" label="数学" width="180">
            </el-table-column>
            <el-table-column prop="gradeChinese" label="语文">
            </el-table-column>
            <el-table-column prop="gradeJapanese" label="外语">
            </el-table-column>
            <el-table-column prop="gradeSynthesis" label="综合">
            </el-table-column>
            <el-table-column prop="fullMarks" label="满分">
            </el-table-column>
            <el-table-column prop="kzzd1" label="高考截图">
                <template slot-scope="scope">
                    <el-image style="width: 100px; height: 100px" :src="scope.row.kzzd1" :preview-src-list="[scope.row.kzzd1]"></el-image>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看并编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" /> -->

        <el-dialog title="高考成绩" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="bkForm" label-width="120px">
                <el-form-item label="学生" prop="studentId" :rules="[{ required: true, message: '请选择',trigger: 'change'}]">
                    <el-select v-model="form.studentId" filterable="" placeholder="学生">
                        <el-option v-for="item in getListStudent " :key="item.id" :label="item.xsxm" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="语文" prop="gradeChinese" :rules="[{ required: true, message: '请填写'}]">
                    <el-input v-model.number="form.gradeChinese" @input="computedAchievement" />
                </el-form-item>
                <el-form-item label="数学" prop="gradeMath" :rules="[{ required: true, message: '请填写'}]">
                    <el-input v-model.number="form.gradeMath" @input="computedAchievement" />
                </el-form-item>
                <el-form-item label="外语" prop="gradeJapanese" :rules="[{ required: true, message: '请填写'}]">
                    <el-input v-model.number="form.gradeJapanese" @input="computedAchievement" />
                </el-form-item>
                <el-form-item label="综合" prop="gradeSynthesis" :rules="[{ required: true, message: '请填写'}]">
                    <el-input v-model.number="form.gradeSynthesis" @input="computedAchievement" />
                </el-form-item>
                <el-form-item label="满分" prop="fullMarks" :rules="[{ required: true, message: '请填写'},{type:'number',message: '请填写数字'}]">
                    <el-input v-model.number="form.fullMarks" />
                </el-form-item>
                <el-form-item label="高考成绩截图">
                    <el-upload :headers="upload.headers" :action="upload.imgUrl" list-type="picture-card" :on-success="handleFileSuccess" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model.number="form.remark" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSaveSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listBjclass,
} from "@/api/basic/bjclass";
import {
    listStudent,
} from "@/api/basic/student";
import { getToken } from "@/utils/auth";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
import { listForAcdemicDean, listForTeacher, addCollegeEntranceExam, updateCollegeEntranceExam } from "@/api/basic/gkcj"
export default {
    data() {
        return {
            gkcjList: [],
            form: {

            },
            dialogFormVisible: false,
            dialogImageUrl: '',
            dialogVisible: false,
            total: 0,
            queryParams: {
                pageNum: 0,
                pageSize: 10
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
                // 上传考试成绩地址
                fileUrl:
                    process.env.VUE_APP_BASE_API +
                    "/basic/examinationPaper/importClassGradeData",
                // 上传图片地址
                imgUrl: process.env.VUE_APP_BASE_API + "/file/upload",
            },
            formLabelWidth: 200,
            // 校区数据
            queryBjclassList: [],
            // 学生
            getListStudent: []
        }
    },
    created() {
        listBjclass().then(response => {
            this.queryBjclassList = response.rows;
            if (this.$route.query.bjid) {
                this.queryParams.bjid = this.$route.query.bjid;
                this.onSelectClass()
                this.getList()
            } else {
                this.queryParams.bjid = this.queryBjclassList[0].id;
                this.onSelectClass()
                this.getList()
            }
        });
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 保存
        onSaveSubmit() {
            this.$refs["bkForm"].validate((valid) => {
                if (valid) {
                    this.form.bjid = this.queryParams.bjid
                    if (this.form.gkId) {
                        updateCollegeEntranceExam(this.form).then(res => {
                            this.msgSuccess(res.msg)
                            this.dialogFormVisible = false
                            this.getList();
                        })
                    } else {
                        addCollegeEntranceExam(this.form).then(res => {
                            this.msgSuccess(res.msg)
                            this.dialogFormVisible = false
                            this.getList();
                        })

                    }
                }
            });
        },
        // 计算满分
        computedAchievement() {
            if (typeof this.form.gradeChinese == "string") {
                this.msgError("成绩只能输入数字")
                this.form.gradeChinese = null
                return
            }
            if (typeof this.form.gradeMath == "string") {
                this.msgError("成绩只能输入数字")
                this.form.gradeMath = null
                return
            }
            if (typeof this.form.gradeJapanese == "string") {
                this.msgError("成绩只能输入数字")
                this.form.gradeJapanese = null
                return
            }
            if (typeof this.form.gradeSynthesis == "string") {
                this.msgError("成绩只能输入数字")
                this.form.gradeSynthesis = null
                return
            }
            if (this.form.gradeChinese && this.form.gradeMath && this.form.gradeJapanese && this.form.gradeSynthesis) {
                this.form.fullMarks = this.form.gradeChinese + this.form.gradeMath + this.form.gradeJapanese + this.form.gradeSynthesis
            } else {
                this.form.fullMarks = null
            }

        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            if (response.code == 200) {
                let data = response.data;
                data.kzzd1 = this.form.photoFileId || secretKey();
                this.form.photoFileId = data.kzzd1;
                this.form.kzzd1 = data.url;
                addImg(data).then((res) => {
                    file.id = res.data.id;
                    this.getList();
                });
                this.msgSuccess("上传成功");
            } else {
                this.msgError("上传失败");
            }
        },
        // 查看
        handleClick(row) {
            this.form = row;
            this.form.id = row.gkId
            this.dialogFormVisible = true
        },
        //导出
        onExport() {
            this.download('basic/collegeEntranceExam/exportCollegeEntranceExam', {
                bjid: this.queryParams.bjid
            }, `班级高考成绩.xlsx`)
        },
        // 添加
        onAddGkcj() {
            this.form = {}
            this.dialogFormVisible = true
        },
        // 已上传
        onGetList(status) {
            this.queryParams.isUpload = status;
            this.getList()
        },
        getList() {
            listForTeacher({ bjid: this.queryParams.bjid, isUpload: this.queryParams.isUpload, studentId: this.queryParams.studentId }).then(res => {
                this.gkcjList = res.rows
            })
        },
        // 选择学生
        onSelectClass() {
            this.getList();
            listStudent({ ryb: this.queryParams.bjid }).then(res => {
                this.getListStudent = res.rows
            })
        }
    }
}
</script>
