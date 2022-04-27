<template>
    <div class="class-distribution">

        <el-table :data="distributionTableData" border style="width: 100%">
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column prop="address" label="角色">
            </el-table-column>
            <el-table-column prop="address" label="姓名/称呼">
            </el-table-column>
            <el-table-column prop="address" label="手机号">
            </el-table-column>
            <el-table-column prop="address" label="操作" width="200px">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="ondistribution(scope.row)">分 配</el-button>
                    <el-button type="danger" size="mini" @click="onView(scope.row)">查 看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <el-dialog title="分配班级" :visible.sync="dialogFormVisible">
            <el-form :model="form" :inline="true">
                <el-form-item label="校区" label-width="120px">
                    <el-select v-model="form.xqid" filterable placeholder="请选择" clearable @change="onChangeSchool">
                        <el-option v-for="item in schoolList" :key="item.value" :label="item.xxmc" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级" label-width="120px">
                    <el-select v-model="form.bjid" filterable placeholder="请选择" clearable @change="onChangeClass">
                        <el-option v-for="item in classList" :key="item.value" :label="item.rybjmc" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div style="width:100%;background:#eee;">
                <el-radio-group v-model="form.radio">
                    <el-radio style="padding: 20px" :label="item.id" v-for="(item,index) in classTemplateList" :key="index">{{item.rybjmc}}</el-radio>
                </el-radio-group>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onHandleSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listBjclass,
} from "@/api/basic/bjclass";
import {
    listSchool,
} from "@/api/basic/school";
export default {
    data() {
        return {
            distributionTableData: [{}],
            queryParams: {
                pageNum: 1,
                pageSize: 10,
            },
            form: {},
            total: 0,
            dialogFormVisible: false,
            classList: [],
            schoolList: [],
            classTemplateList: []
        }
    },
    created() {
        listBjclass().then(res => {
            this.classList = res.rows
        })
        listSchool().then(res => {
            this.schoolList = res.rows
        })
    },
    methods: {
        // 分配
        ondistribution(row) {
            this.dialogFormVisible = true
        },
        // 查看
        onView(row) {

        },
        // 确定分配
        onHandleSubmit() {
            this.dialogFormVisible = false
        },
        onChangeSchool() {
            this.form.bjid = null
            listBjclass({ kzzd1: this.form.xqid }).then(res => {
                this.classTemplateList = res.rows
            })
        },
        onChangeClass() {
            this.form.xqid = null
            listBjclass({ id: this.form.bjid }).then(res => {
                this.classTemplateList = res.rows
            })

        }
    }
}
</script>

<style lang="scss" scoped>
.class-distribution {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
}
</style>
