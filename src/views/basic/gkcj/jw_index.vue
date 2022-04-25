<template>
    <div style="width:100%,height:100%;padding:40px;box-sizing:border-box">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="班级">
                <el-select v-model="queryParams.bjid" filterable @change="onSelectClass" placeholder="班级">
                    <el-option v-for="item in queryBjclassList " :key="item.id" :label="item.rybjmc" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="老师">
                <el-select v-model="queryParams.lsid" filterable="" placeholder="老师">
                    <el-option v-for="item in getListTeacher " :key="item.id" :label="item.lsxm" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onGetList('1')">已完成</el-button>
                <el-button type="primary" @click="onGetList('0')">未完成</el-button>
                <el-button type="primary" @click="getList">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="gkcjList" border style="width: 100%">
            <el-table-column prop="rybjmc" label="班级" width="180">
            </el-table-column>
            <el-table-column prop="lsxm" label="老师" width="180">
            </el-table-column>
            <el-table-column prop="lsdh" label="老师电话">
            </el-table-column>
            <el-table-column prop="ysj" label="已收集/整数">
                <template slot-scope="scope">
                    <span>{{scope.row.ysj}}/{{scope.row.zs}}</span>
                </template>
            </el-table-column>
            </el-table-column>
            <el-table-column prop="gradeMax" label="最高分">
            </el-table-column>
            <el-table-column prop="gradeMin" label="最低分">
            </el-table-column>
            <el-table-column prop="address" label="状态">
            </el-table-column>
            <el-table-column prop="address" label="导出">
                <template slot-scope="scope">
                    <el-button @click="onExport(scope.row)">导出</el-button>
                </template>
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

        <el-dialog title="设置本科线" :visible.sync="dialogFormVisible">
            <el-form :model="bkfsForm" label-width="120px">
                <el-form-item label="一本线">
                    <el-input v-model="bkfsForm.bkfs1" />
                </el-form-item>
                <el-form-item label="二本线">
                    <el-input v-model="bkfsForm.bkfs2" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="bkxSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listBjclass,
    updateBjclass,
} from "@/api/basic/bjclass";
import {
    listStudent,
} from "@/api/basic/student";
import { listTeacher } from "@/api/basic/teacher"
import { listForAcdemicDean, listForTeacher, addCollegeEntranceExam, updateCollegeEntranceExam } from "@/api/basic/gkcj"
export default {
    data() {
        return {
            gkcjList: [],
            form: {},
            dialogFormVisible: false,
            dialogVisible: false,
            total: 0,
            queryParams: {
                pageNum: 0,
                pageSize: 10
            },
            formLabelWidth: 200,
            queryBjclassList: [],
            getListTeacher: [],
            bkfsForm: {
                bkfs1: null,
                bkfs2: null
            }
        }
    },
    created() {
        listBjclass().then(response => {
            this.queryBjclassList = response.rows;
        });
        listTeacher({ rybj: this.queryParams.bjid }).then(res => {
            this.getListTeacher = res.rows
        })
    },
    methods: {
        onExport(row) {
            this.download('basic/collegeEntranceExam/exportCollegeEntranceExam', {
                bjid: row.bjid
            }, `班级高考成绩.xlsx`)
        },
        // 选择老师
        onSelectClass() {
            this.getList()
        },
        onGetList(status) {
            this.queryParams.isComplete = status;
            listForAcdemicDean(this.queryParams).then(res => {
                console.log(res)
                this.gkcjList = res.rows;
                this.total = res.total
            })
        },
        getList() {
            this.queryParams.isComplete = null
            listForAcdemicDean(this.queryParams).then(res => {
                console.log(res)
                this.gkcjList = res.rows;
                this.total = res.total
            })
        },
        handleClick(row) {
            this.bkfsForm.id = row.bjid
            this.dialogFormVisible = true
        },
        bkxSubmit() {
            updateBjclass(this.bkfsForm).then(res => {
                this.dialogFormVisible = false;
                this.msgSuccess(res.msg)
            })
        },
        handleViews(row) {
            this.getConfigKey("teacher_index").then(res => {
                this.$router.push({ path: res.msg, query: { bjid: row.bjid } })
            })
        },
        handleRemind() {

        }
    }
}
</script>
