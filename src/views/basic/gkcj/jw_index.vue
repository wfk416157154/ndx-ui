<template>
    <div style="width:100%,height:100%;padding:40px;box-sizing:border-box">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="班级">
                <el-select v-model="queryParams.region" filterable="" placeholder="班级">
                    <el-option label="班级一" value="shanghai"></el-option>
                    <el-option label="班级二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="老师">
                <el-select v-model="queryParams.region" filterable="" placeholder="老师">
                    <el-option label="老师一" value="shanghai"></el-option>
                    <el-option label="老师二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">已完成</el-button>
                <el-button type="primary" @click="onSubmit">未完成</el-button>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="gkcjList" border style="width: 100%">
            <el-table-column prop="date" label="班级" width="180">
            </el-table-column>
            <el-table-column prop="name" label="老师" width="180">
            </el-table-column>
            <el-table-column prop="address" label="老师电话">
            </el-table-column>
            <el-table-column prop="address" label="已收集/整数">
            </el-table-column>
            <el-table-column prop="address" label="最高分">
            </el-table-column>
            <el-table-column prop="address" label="最低分">
            </el-table-column>
            <el-table-column prop="address" label="状态">
            </el-table-column>
            <el-table-column prop="address" label="导出">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button @click="handleViews(scope.row)" type="text" size="small">查看</el-button>
                    <el-button @click="handleRemind(scope.row)" type="text" size="small">提醒</el-button>
                    <el-button @click="handleClick(scope.row)" type="text" size="small"> 设置本科线</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <el-dialog title="高考成绩" :visible.sync="dialogFormVisible">
            <el-form :model="form" label-width="120px">
                <el-form-item label="一本线">
                    <el-input v-model="form.value" />
                </el-form-item>
                <el-form-item label="二本线">
                    <el-input v-model="form.value" />
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

        },
        handleViews() {
            this.getConfigKey("teacher_index").then(res => {
                this.$router.push({ path: res.msg })
            })
        },
        handleRemind() {

        }
    }
}
</script>
