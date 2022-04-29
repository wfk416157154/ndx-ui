<template>
    <div class="wrap-examine">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="姓名">
                <el-input v-model="queryParams.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="queryParams.user" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="家长手机号">
                <el-input v-model="queryParams.phone" placeholder="家长手机号"></el-input>
            </el-form-item>
            <el-form-item label="学号">
                <el-input v-model="queryParams.userId" placeholder="学号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onQuerySubmit">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="examineTableData" border style="width: 100%">
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column prop="openId" label="微信id" width="180">
            </el-table-column>
            <el-table-column prop="wxNickName" label="微信昵称" width="180">
            </el-table-column>
            <el-table-column prop="type" label="角色">
            </el-table-column>
            <el-table-column prop="name" label="姓名/称呼">
            </el-table-column>
            <el-table-column prop="userId" label="学号/手机号">
            </el-table-column>
            <el-table-column prop="phone" label="家长手机号">
            </el-table-column>
            <el-table-column prop="kzzd3" label="系统匹配数据">
            </el-table-column>
            <el-table-column prop="address" label="是否通过" width="200px">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="onAgree(scope.row)" :disabled="scope.row.status == '1'">同 意</el-button>
                    <el-button type="danger" size="mini" @click="onReject(scope.row)" v-if="scope.row.status != '1'">驳 回</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="onQuerySubmit" />

        <el-dialog title="驳回原因" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="驳回原因" label-width="120px">
                    <el-input v-model="form.kzzd2" type="textarea" rows="8" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onHandleSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryParams: {
                pageNum: 1,
                pageSize: 10,
            },
            form: {},
            total: 0,
            examineTableData: [],
            dialogFormVisible: false,
        }
    },
    created() {

    },
    methods: {
        // 查询列表数据
        onQuerySubmit() {
            this.$axios.get("/wxapi/weChar/getUserList", {
                params: this.queryParams
            }).then(res => {
                if (res.data.code == 200) {
                    this.examineTableData = res.data.rows;
                    this.total = res.data.total
                }
            })
        },
        // 同意
        onAgree(row) {
            row.status = "1"
            this.$axios.post("/wxapi/weChar/checkUser", row).then(res => {
                if (res.data.code == 200) {
                    this.msgSuccess("操作成功")
                }
            })
        },
        // 驳回
        onReject(row) {
            this.form = row
            this.dialogFormVisible = true
        },
        // 驳回确定按钮
        onHandleSubmit() {
            this.form.status = "0"
            this.$axios.post("/wxapi/weChar/checkUser", this.form).then(res => {
                if (res.data.code == 200) {
                    this.msgSuccess("操作成功")
                    this.dialogFormVisible = false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap-examine {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
}
</style>
