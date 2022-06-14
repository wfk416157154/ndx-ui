<template>
    <div class="class-progress-statistics">
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="试卷名称">
                <el-input v-model="form.ksmc"></el-input>
            </el-form-item>
            <el-form-item label="考试类型">
                <el-select v-model="form.kslx" filterable placeholder="考试类型" clearable>
                    <el-option
                        v-for="item in examinationType"
                        :key="item.id"
                        :label="item.dictLabel"
                        :value="item.dictValue"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="考试时间">
                <el-date-picker
                    v-model="form.sjArr"
                    type="daterange"
                    clearable
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="省份">
                <el-input v-model="form.sf"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getList">查询</el-button>
                <el-button type="warning" plain icon="el-icon-download" @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="groupGradeEveryTimeData" border style="width: 100%">
            <el-table-column type="index" label="序号" width="55"></el-table-column>
            <el-table-column prop="rybjmc" label="班级" width="200"></el-table-column>
            <el-table-column prop="lsxm" label="老师"></el-table-column>
            <el-table-column prop="ksmc" label="考试名称"></el-table-column>
            <el-table-column prop="zgf" label="最高分"></el-table-column>
            <el-table-column prop="zdf" label="最低分"></el-table-column>
            <el-table-column prop="pjf" label="平均分"></el-table-column>
            <el-table-column prop="xssl" label="学生数量"></el-table-column>
            <el-table-column prop="kslx" label="考试类型">
                <template slot-scope="scope">
                    <dict-tag :options="examinationType" :value="scope.row.kslx" />
                </template>
            </el-table-column>
            <el-table-column prop="kssj" label="时间" width="180">
                <template slot-scope="scope">{{ parseTime(scope.row.kssj, "{y}-{m}-{d}") }}</template>
            </el-table-column>
            <el-table-column prop="lsxm" label="操作人" width="180"></el-table-column>
        </el-table>

        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="form.pageNum"
            :limit.sync="form.pageSize"
            @pagination="getList"
        />
    </div>
</template>

<script>
import { groupGradeEveryTime } from "@/api/basic/performance-analysis-class";
export default {
    data() {
        return {
            groupGradeEveryTimeData: [],
            form: {
                pageNum: 1,
                pageSize: 10,
            },
            total: 0,
            examinationType: [],
        };
    },
    created() {
        this.getList();
        this.getDicts("examination_type").then((res) => {
            this.examinationType = res.data;
        });
    },
    methods: {
        getList() {
            groupGradeEveryTime(this.form).then((res) => {
                if (res.code == 200) {
                    this.groupGradeEveryTimeData = res.rows;
                    this.total = res.total;
                }
            });
        },
        handleExport() {
            this.download(
                "/basic/everytime/exportGroupExam",
                {
                    ...this.form,
                },
                `考试成绩分析.xlsx`
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.class-progress-statistics {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
}
</style>

