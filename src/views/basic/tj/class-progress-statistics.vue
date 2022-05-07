<template>
    <div class="class-progress-statistics">
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="班级">
                <el-select v-model="form.rybjid" filterable @change="onSelectClass" clearable placeholder="班级">
                    <el-option v-for="item in queryBjclassList " :key="item.id" :label="item.rybjmc" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="老师">
                <el-select v-model="form.lsid" filterable placeholder="老师" clearable>
                    <el-option v-for="item in getListTeacher " :key="item.id" :label="item.lsxm" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间区间">
                <el-date-picker v-model="form.sjArr" type="daterange" clearable value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getList">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="progressStatisticsList" border style="width: 100%">
            <el-table-column prop="rybjmc" label="班级" width="200">
            </el-table-column>
            <el-table-column prop="kzzd1" label="课程">
            </el-table-column>
            <el-table-column prop="kzzd3" label="课程安排名称">
            </el-table-column>
            <el-table-column prop="createTime" label="时间" width="180">
                <template slot-scope="scope">
                    {{parseTime(scope.row.createTime,"{y}-{m}-{d}")}}
                </template>
            </el-table-column>
            <el-table-column prop="lsxm" label="操作人" width="180">
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="getList" />
    </div>
</template>

<script>
import { listBjclass } from "@/api/basic/bjclass";
import { listTeacher } from "@/api/basic/teacher"
import { ListPlanProgress } from "@/api/basic/tj"
export default {
    data() {
        return {
            progressStatisticsList: [],
            form: {
                pageNum: 1,
                pageSize: 10
            },
            total: 0,
            queryBjclassList: [],
            getListTeacher: [],
        }
    },
    created() {
        listBjclass().then(response => {
            this.queryBjclassList = response.rows;
        });
        listTeacher().then(res => {
            this.getListTeacher = res.rows
        })
        this.getList()
    },
    methods: {
        getList() {
            ListPlanProgress(this.form).then(res => {
                if (res.code == 200) {
                    this.progressStatisticsList = res.rows;
                    this.total = res.total;
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.class-progress-statistics {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
}
</style>

