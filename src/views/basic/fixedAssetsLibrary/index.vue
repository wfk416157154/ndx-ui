<template>
    <div class="fixedAssetsLibrary">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="物品类别">
                <el-select v-model="queryParams.region" placeholder="物品类别">
                    <el-option label="物品类别一" value="shanghai"></el-option>
                    <el-option label="物品类别二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间">
                <el-date-picker
                    v-model="queryParams.sjArr"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
                <el-button type="success" icon="el-icon-plus" @click="handleAdd">添加</el-button>
                <el-button type="warning" icon="el-icon-download" @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="FixedAssetsLibraryTableData" border style="width: 100%">
            <el-table-column type="index" label="序号" width="55"></el-table-column>
            <el-table-column prop="name" label="物品类别" width="180"></el-table-column>
            <el-table-column prop="address" label="物品名称"></el-table-column>
            <el-table-column prop="address" label="物品数量"></el-table-column>
            <el-table-column prop="address" label="物品价格"></el-table-column>
        </el-table>

        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />

        <el-dialog title="添加" :visible.sync="dialogFormVisible" width="50%">
            <el-form :model="FixedAssetsLibraryForm">
                <el-form-item label="物品类别" label-width="100px">
                    <el-input v-model="FixedAssetsLibraryForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="物品名称" label-width="100px">
                    <el-row :gutter="10">
                        <el-col :span="10">
                            <el-input v-model="FixedAssetsLibraryForm.name" autocomplete="off"></el-input>
                        </el-col>
                        <el-col :span="7">
                            <el-input-number
                                style="width:150px"
                                v-model="FixedAssetsLibraryForm.num"
                                :min="1"
                                :max="10000"
                                label="数量"
                            ></el-input-number>
                        </el-col>
                        <el-col :span="6">
                            <div>库存 : 20</div>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="物品来源" label-width="100px">
                    <el-select v-model="FixedAssetsLibraryForm.region" placeholder="请选择物品来源">
                        <el-option label="物品来源一" value="shanghai"></el-option>
                        <el-option label="物品来源二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="价格" label-width="100px">
                    <el-input v-model="FixedAssetsLibraryForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="100px">
                    <el-input
                        v-model="FixedAssetsLibraryForm.remark"
                        type="textarea"
                        rows="3"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
 
<script>
export default {
    name: "FixedAssetsLibrary",
    data() {
        return {
            // 总条数
            total: 0,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
            },
            // 表格数据
            FixedAssetsLibraryTableData: [],
            // 遮罩关闭控制
            dialogFormVisible: false,
            // 表单数据
            FixedAssetsLibraryForm: {},
        };
    },
    methods: {
        // 列表查询
        getList() {},
        // 添加
        handleAdd() {
            this.dialogFormVisible = true;
        },
        // 提交
        onSubmit() {
            this.dialogFormVisible = false;
        },
        // 导出
        handleExport() {
            this.download(
                "basic/examSummary/export",
                {
                    ...this.queryParams,
                },
                `考试分析总结.xlsx`
            );
        },
    },
};
</script>
 
<style lang="scss" scoped>
.fixedAssetsLibrary {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
}
</style>