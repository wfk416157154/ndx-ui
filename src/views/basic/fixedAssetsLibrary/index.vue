<template>
    <div class="fixedAssetsLibrary">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="物品类别">
                <el-select v-model="queryParams.goodsType" clearable placeholder="物品类别">
                    <el-option
                        v-for="(item,index) in goodsType"
                        :key="index"
                        :label="item.dictLabel"
                        :value="item.dictValue"
                    ></el-option>
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
            <el-table-column prop="goodsType" label="物品类别" width="180">
                <template slot-scope="scope">
                    <DictTag :options="goodsType" :value="scope.row.goodsType" />
                </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="物品名称">
                <template slot-scope="scope">
                    <DictTag :options="goodsName" :value="scope.row.goodsName" />
                </template>
            </el-table-column>
            <el-table-column prop="goodsStock" label="物品数量"></el-table-column>
            <!-- <el-table-column prop="goodsPrice" label="物品价格"></el-table-column> -->
            <el-table-column prop="goodsPrice" label="操作" width="200px">
                <template slot-scope="scope">
                    <el-popover placement="right" width="500" trigger="click">
                        <el-table :data="gridData">
                            <el-table-column property="goodsType" label="物品类型">
                                <template slot-scope="scope">
                                    <DictTag :options="goodsType" :value="scope.row.goodsType" />
                                </template>
                            </el-table-column>
                            <el-table-column property="goodsName" label="物品名称">
                                <template slot-scope="scope">
                                    <DictTag :options="goodsName" :value="scope.row.goodsName" />
                                </template>
                            </el-table-column>
                            <el-table-column width="100" property="quantity" label="收/支">
                                <template slot-scope="scope">
                                    <p v-if="scope.row.type == 1">新增 {{scope.row.quantity}}</p>
                                    <p v-else>减少 {{scope.row.quantity}}</p>
                                </template>
                            </el-table-column>
                            <el-table-column width="100" property="goodsStock" label="库存"></el-table-column>
                            <el-table-column prop="goodsPrice" label="物品价格"></el-table-column>
                        </el-table>
                        <el-button
                            slot="reference"
                            @click="handleView(scope.row)"
                            type="text"
                            size="small"
                        >查看</el-button>
                    </el-popover>
                    <el-button
                        style="margin-left : 10px"
                        @click="handleRowsExport(scope.row)"
                        type="text"
                        size="small"
                    >导出</el-button>
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

        <el-dialog title="添加" :visible.sync="dialogFormVisible" width="50%">
            <el-form ref="formName" :model="fixedAssetsLibraryForm">
                <el-form-item
                    label="物品类别"
                    label-width="100px"
                    prop="goodsType"
                    :rules="[{
                    required: true,
                    message: '请选择物品类别',
                    trigger: 'change',
               }]"
                >
                    <el-select v-model="fixedAssetsLibraryForm.goodsType" placeholder="物品类别">
                        <el-option
                            v-for="(item,index) in goodsType"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="物品名称"
                    label-width="100px"
                    prop="goodsType"
                    :rules="[{
                    required: true,
                    message: '请选择物品名称',
                    trigger: 'change',
               }]"
                >
                    <el-row :gutter="10">
                        <el-col :span="10">
                            <el-select
                                v-model="fixedAssetsLibraryForm.goodsName"
                                placeholder="物品名称"
                                @change="onGetStock(fixedAssetsLibraryForm.goodsName)"
                            >
                                <el-option
                                    v-for="(item,index) in goodsName"
                                    :key="index"
                                    :label="item.dictLabel"
                                    :value="item.dictValue"
                                ></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item
                                prop="changeNum"
                                :rules="[{
                                required: true,
                                message: '添加数量',
                                trigger: 'blur',
                              }]"
                            >
                                <el-input-number
                                    style="width:150px"
                                    v-model="fixedAssetsLibraryForm.changeNum"
                                    :min="1"
                                    :max="10000"
                                    label="数量"
                                ></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <div>库存 : {{getStockNum}}</div>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item
                    label="物品来源"
                    label-width="100px"
                    prop="goodsSource"
                    :rules="[{
                    required: true,
                    message: '请选择物品来源',
                    trigger: 'change',
               }]"
                >
                    <el-select v-model="fixedAssetsLibraryForm.goodsSource" placeholder="物品来源">
                        <el-option
                            v-for="(item,index) in goodsSource"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="价格"
                    label-width="100px"
                    prop="goodsPrice"
                    :rules="[{
                    required: true,
                    message: '请填写价格',
                    trigger: 'blur',
               }]"
                >
                    <el-input v-model="fixedAssetsLibraryForm.goodsPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="100px">
                    <el-input
                        v-model="fixedAssetsLibraryForm.remark"
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
import {
    listGoodsLibrary,
    addGoodsLibrary,
    getStock,
    listBylibrary,
} from "@/api/basic/fixedAssetsLibrary";
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
                goodsType: null,
                sjArr: [],
            },
            // 表格数据
            FixedAssetsLibraryTableData: [],
            // 查看详情表格
            gridData: [],
            // 遮罩关闭控制
            dialogFormVisible: false,
            // 表单数据
            fixedAssetsLibraryForm: {
                changeNum: 1,
                goodsType: null,
                goodsName: null,
                goodsSource: null,
                goodsPrice: null,
                remark: null,
            },
            //物品类型
            goodsType: [],
            //物品来源
            goodsSource: [],
            //物品名称
            goodsName: [],
            // 库存数据
            getStockNum: 0,
        };
    },
    created() {
        this.getDicts("goodsType").then((response) => {
            this.goodsType = response.data;
        });
        this.getDicts("goodsSource").then((response) => {
            this.goodsSource = response.data;
        });
        this.getDicts("goodsName").then((response) => {
            this.goodsName = response.data;
        });
        this.getList();
    },
    methods: {
        // 列表查询
        getList() {
            listGoodsLibrary(this.queryParams).then((res) => {
                this.FixedAssetsLibraryTableData = res.rows;
                this.total = res.total;
            });
        },
        // 添加
        handleAdd() {
            this.reset();
            this.dialogFormVisible = true;
        },
        // 获取库存
        onGetStock(goodsName) {
            getStock({ goodsName }).then((res) => {
                this.getStockNum = res.data;
            });
        },
        // 提交
        onSubmit() {
            this.$refs["formName"].validate((valid) => {
                if (valid) {
                    addGoodsLibrary(this.fixedAssetsLibraryForm).then((res) => {
                        if (res.code == 200) {
                            this.dialogFormVisible = false;
                            this.getList();
                            this.msgSuccess(res.msg);
                        }
                    });
                }
            });
        },
        // 查看
        handleView(row) {
            listBylibrary({ goodsLibraryId: row.id }).then((res) => {
                this.gridData = res.rows;
            });
        },
        // 单条导出
        handleRowsExport(row) {
            this.download(
                "/basic/goodsLibrary/flowing/export",
                {
                    goodsLibraryId: row.id,
                },
                `固定资产库历史记录.xlsx`
            );
        },
        // 重置
        reset() {
            this.fixedAssetsLibraryForm = {
                changeNum: 1,
                goodsType: null,
                goodsName: null,
                goodsSource: null,
                goodsPrice: null,
                remark: null,
            };
        },
        // 导出
        handleExport() {
            this.download(
                "/basic/goodsLibrary/export",
                {
                    ...this.queryParams,
                },
                `固定资产库.xlsx`
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