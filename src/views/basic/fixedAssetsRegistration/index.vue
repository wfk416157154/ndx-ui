<template>
    <div class="fixedAssetsRegistration">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="物品类别">
                <el-select v-model="queryParams.region" placeholder="物品类别">
                    <el-option label="物品类别一" value="shanghai"></el-option>
                    <el-option label="物品类别二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="使用班级">
                <el-select v-model="queryParams.region" placeholder="物品类别">
                    <el-option label="物品类别一" value="shanghai"></el-option>
                    <el-option label="物品类别二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="老师">
                <el-select v-model="queryParams.region" placeholder="物品类别">
                    <el-option label="物品类别一" value="shanghai"></el-option>
                    <el-option label="物品类别二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="queryParams.status" placeholder="物品类别">
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
                <el-button type="success" icon="el-icon-plus" @click="handleRegister">登记</el-button>
                <el-button type="warning" icon="el-icon-download" @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="fixedAssetsRegistrationTableData" border style="width: 100%">
            <el-table-column type="index" label="序号" width="55"></el-table-column>
            <el-table-column prop="name" label="物品类别" width="180"></el-table-column>
            <el-table-column prop="address" label="物品名称"></el-table-column>
            <el-table-column prop="address" label="使用班级"></el-table-column>
            <el-table-column prop="address" label="老师"></el-table-column>
            <el-table-column prop="address" label="登记时间"></el-table-column>
            <el-table-column prop="address" label="处理人"></el-table-column>
            <el-table-column prop="address" label="处理时间"></el-table-column>
            <el-table-column prop="address" label="状态"></el-table-column>
            <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleView(scope.row)" type="text" size="small">查看</el-button>
                    <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />

        <el-dialog title="登记" :visible.sync="dialogFormVisible" width="50%">
            <el-form :model="fixedAssetsRegistrationForm">
                <el-form-item label="发放公司" label-width="100px">
                    <el-select v-model="fixedAssetsRegistrationForm.region" placeholder="请选择发放公司">
                        <el-option label="发放公司一" value="shanghai"></el-option>
                        <el-option label="发放公司二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物品类别" label-width="100px">
                    <el-select v-model="fixedAssetsRegistrationForm.region" placeholder="请选择物品类别">
                        <el-option label="物品类别一" value="shanghai"></el-option>
                        <el-option label="物品类别二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物品名称" label-width="100px">
                    <el-select v-model="fixedAssetsRegistrationForm.region" placeholder="请选择物品名称">
                        <el-option label="物品名称一" value="shanghai"></el-option>
                        <el-option label="物品名称二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量" label-width="100px">
                    <el-input v-model="fixedAssetsRegistrationForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="价格" label-width="100px">
                    <el-input v-model="fixedAssetsRegistrationForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="申请老师" label-width="100px">
                    <el-select v-model="fixedAssetsRegistrationForm.region" placeholder="请选择申请老师">
                        <el-option label="申请老师一" value="shanghai"></el-option>
                        <el-option label="申请老师二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="使用班级" label-width="100px">
                    <el-select v-model="fixedAssetsRegistrationForm.region" placeholder="请选择使用班级">
                        <el-option label="使用班级一" value="shanghai"></el-option>
                        <el-option label="使用班级二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发放途径" label-width="100px">
                    <el-row :gutter="10">
                        <el-col :span="10">
                            <el-select
                                v-model="fixedAssetsRegistrationForm.region"
                                placeholder="请选择发放途径"
                            >
                                <el-option label="发放途径一" value="shanghai"></el-option>
                                <el-option label="发放途径二" value="beijing"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="6">
                            <div>库存 : 20</div>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="目前状态" label-width="100px">
                    <el-radio-group v-model="fixedAssetsRegistrationForm.radio">
                        <el-radio :label="1">正常使用</el-radio>
                        <el-radio :label="0">已处理</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    v-if="fixedAssetsRegistrationForm.radio == 0"
                    label="最终去向"
                    label-width="100px"
                >
                    <el-radio-group v-model="fixedAssetsRegistrationForm.zzqx">
                        <el-radio :label="1">寄回总部入库</el-radio>
                        <el-radio :label="2">卖掉</el-radio>
                        <el-radio :label="3">损坏</el-radio>
                        <el-radio :label="4">移交其他老师使用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    v-if="fixedAssetsRegistrationForm.zzqx == 4 && fixedAssetsRegistrationForm.radio == 0"
                    label="移交信息"
                    label-width="100px"
                >
                    <el-form-item label="使用班级" label-width="100px">
                        <el-select
                            v-model="fixedAssetsRegistrationForm.region"
                            placeholder="请选择使用班级"
                        >
                            <el-option label="使用班级一" value="shanghai"></el-option>
                            <el-option label="使用班级二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申请老师" style="margin-top:10px" label-width="100px">
                        <el-select
                            v-model="fixedAssetsRegistrationForm.region"
                            placeholder="请选择申请老师"
                        >
                            <el-option label="申请老师一" value="shanghai"></el-option>
                            <el-option label="申请老师二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="备注" label-width="100px">
                    <el-input
                        v-model="fixedAssetsRegistrationForm.remark"
                        type="textarea"
                        rows="3"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit" v-if="open">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
 
<script>
export default {
    name: "FixedAssetsRegistration",
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
            fixedAssetsRegistrationTableData: [{}],
            // 表单数据
            fixedAssetsRegistrationForm: {},
            // 遮罩
            dialogFormVisible: false,
            // 查看还是编辑
            open: false,
        };
    },
    methods: {
        // 列表数据查询
        getList() {},
        // 登记
        handleRegister() {
            this.dialogFormVisible = true;
            this.open = true;
        },
        // 导出
        handleExport() {},
        // 查看
        handleView(row) {
            this.dialogFormVisible = true;
            this.open = false;
        },
        // 编辑
        handleEdit(row) {
            this.dialogFormVisible = true;
            this.open = true;
        },
        // 提交
        onSubmit() {},
    },
};
</script>
 
<style lang="scss" scoped>
.fixedAssetsRegistration {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
}
</style>