<template>
    <div class="wrap-examine">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="姓名">
                <el-input v-model="queryParams.user" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="queryParams.user" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="家长手机号">
                <el-input v-model="queryParams.user" placeholder="家长手机号"></el-input>
            </el-form-item>
            <el-form-item label="学号">
                <el-input v-model="queryParams.user" placeholder="学号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onQuerySubmit">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="examineTableData" border style="width: 100%">
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column prop="date" label="微信id" width="180">
            </el-table-column>
            <el-table-column prop="name" label="微信昵称" width="180">
            </el-table-column>
            <el-table-column prop="address" label="角色">
            </el-table-column>
            <el-table-column prop="address" label="姓名/称呼">
            </el-table-column>
            <el-table-column prop="address" label="学号/手机号">
            </el-table-column>
            <el-table-column prop="address" label="家长手机号">
            </el-table-column>
            <el-table-column prop="address" label="系统匹配数据">
            </el-table-column>
            <el-table-column prop="address" label="是否通过" width="200px">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="onAgree(scope.row)">同 意</el-button>
                    <el-button type="danger" size="mini" @click="onReject(scope.row)">驳 回</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
            
        <el-dialog title="驳回原因" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="驳回原因" label-width="120px">
                    <el-input v-model="form.name" type="textarea" rows="8" autocomplete="off"></el-input>
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
            examineTableData: [{}],
            dialogFormVisible: false,
        }
    },
    methods: {
        // 查询列表数据
        onQuerySubmit() {

        },
        // 同意
        onAgree(row) {
          this.$axios.get("http://192.168.0.7:8888/weChar/getToken").then(res=>{
              console.log("11111111111",res)
          })
        },
        // 驳回
        onReject(row) {
            this.dialogFormVisible = true
        },
        // 驳回确定按钮
        onHandleSubmit() {
            this.dialogFormVisible = false
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
