<template>
    <div style="width:100%,height:100%;padding:40px;box-sizing:border-box">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="学生">
                <el-select v-model="queryParams.region" filterable="" placeholder="学生">
                    <el-option label="学生一" value="shanghai"></el-option>
                    <el-option label="学生二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">添加</el-button>
                <el-button type="primary" @click="onSubmit">导出</el-button>
                <el-button type="primary" @click="onSubmit">已上传</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="gkcjList" border style="width: 100%">
            <el-table-column prop="date" label="学生" width="180">
            </el-table-column>
            <el-table-column prop="name" label="数学" width="180">
            </el-table-column>
            <el-table-column prop="address" label="语文">
            </el-table-column>
            <el-table-column prop="address" label="外语">
            </el-table-column>
            <el-table-column prop="address" label="综合">
            </el-table-column>
            <el-table-column prop="address" label="满分">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看并编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <el-dialog title="高考成绩" :visible.sync="dialogFormVisible">
            <el-form :model="form" label-width="120px">
                <el-form-item label="学生">
                    <el-select v-model="form.region" filterable placeholder="请选择学生">
                        <el-option label="学生一" value="shanghai"></el-option>
                        <el-option label="学生二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="语文">
                    <el-input v-model="form.value" />
                </el-form-item>
                <el-form-item label="数学">
                    <el-input v-model="form.value" />
                </el-form-item>
                <el-form-item label="外语">
                    <el-input v-model="form.value" />
                </el-form-item>
                <el-form-item label="综合">
                    <el-input v-model="form.value" />
                </el-form-item>
                <el-form-item label="满分">
                    <el-input v-model="form.value" />
                </el-form-item>
                <el-form-item label="高考成绩截图">
                    <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.value" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            gkcjList: [{}],
            form: {},
            dialogFormVisible: false,
            dialogImageUrl: '',
            dialogVisible: false,
            total: 0,
            queryParams: {
                pageNum: 0,
                pageSize: 10
            },
            formLabelWidth: 200
        }
    },
    methods: {
        handleClick(row) {
            console.log(row);
            this.dialogFormVisible = true
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        onSubmit() {

        },
        getList() {

        }
    }
}
</script>
