<template>
    <div class="fixedAssetsRegistration">
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
            <el-form-item label="老师">
                <el-select
                    v-model="queryParams.teacherId"
                    @change="getClass1(queryParams.teacherId)"
                    clearable
                    placeholder="物品类别"
                >
                    <el-option
                        v-for="item in getListTeacher"
                        :key="item.id"
                        :label="item.lsxm"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="使用班级">
                <el-select v-model="queryParams.classId" clearable filterable>
                    <el-option
                        v-for="(item, index) in getListBjclass1"
                        :key="index"
                        :label="item.rybjmc"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="queryParams.status" clearable placeholder="物品类别">
                    <el-option
                        v-for="(item,index) in goodsLibraryRegisterStatus"
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
                <el-button type="success" icon="el-icon-plus" @click="handleRegister">登记</el-button>
                <el-button type="warning" icon="el-icon-download" @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="fixedAssetsRegistrationTableData" border style="width: 100%">
            <el-table-column type="index" label="序号" width="55"></el-table-column>
            <el-table-column prop="goodsType" label="物品类别" width="180">
                <template slot-scope="scope">
                    <DictTag :options="goodsType" :value="scope.row.goodsType" />
                </template>
            </el-table-column>
            <el-table-column prop="kaad1" label="物品名称">
                <template slot-scope="scope">
                    <DictTag :options="goodsName" :value="scope.row.kzzd1" />
                </template>
            </el-table-column>
            <el-table-column prop="classId" label="使用班级"></el-table-column>
            <el-table-column prop="teacherId" label="老师"></el-table-column>
            <el-table-column prop="createTime" label="登记时间"></el-table-column>
            <el-table-column prop="updateBy" label="处理人"></el-table-column>
            <el-table-column prop="updateTime" label="处理时间"></el-table-column>
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    <DictTag :options="goodsLibraryRegisterStatus" :value="scope.row.status" />
                </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" width="200px">
                <template slot-scope="scope">
                    <el-button @click="handleView(scope.row)" type="text" size="small">查看</el-button>
                    <el-button
                        @click="handleEdit(scope.row)"
                        type="text"
                        v-if="scope.row.status == '1'"
                        size="small"
                    >编辑</el-button>
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
            <el-form ref="fixedAssetsRegistrationForm" :model="fixedAssetsRegistrationForm">
                <el-form-item
                    label="发放公司"
                    label-width="100px"
                    prop="giveCompany"
                    :rules="[{
                    required: true,
                    message: '请选择发放公司',
                    trigger: 'change',
                     }]"
                >
                    <el-select
                        v-model="fixedAssetsRegistrationForm.giveCompany"
                        :disabled="fixedAssetsRegistrationForm.id ? true : false"
                        placeholder="请选择发放公司"
                    >
                        <el-option
                            v-for="(item,index) in giveCompany"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                        ></el-option>
                    </el-select>
                </el-form-item>
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
                    <el-select
                        v-model="fixedAssetsRegistrationForm.goodsType"
                        :disabled="fixedAssetsRegistrationForm.id ? true : false"
                        placeholder="请选择物品类别"
                    >
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
                    prop="kzzd1"
                    :rules="[{
                    required: true,
                    message: '请选择物品名称',
                    trigger: 'change',
               }]"
                >
                    <el-select
                        v-model="fixedAssetsRegistrationForm.kzzd1"
                        @change="onGetStock(fixedAssetsRegistrationForm.kzzd1)"
                        :disabled="fixedAssetsRegistrationForm.id ? true : false"
                        placeholder="请选择物品名称"
                    >
                        <el-option
                            v-for="(item,index) in goodsName"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="数量"
                    label-width="100px"
                    prop="quantity"
                    :rules="[{
                    required: true,
                    message: '请填写数量',
                    trigger: 'blur',
               }]"
                >
                    <el-input
                        :disabled="fixedAssetsRegistrationForm.id ? true : false"
                        v-model="fixedAssetsRegistrationForm.quantity"
                        autocomplete="off"
                    ></el-input>
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
                    <el-input v-model="fixedAssetsRegistrationForm.goodsPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    label="申请老师"
                    label-width="100px"
                    prop="teacherId"
                    :rules="[{
                    required: true,
                    message: '请选择老师',
                    trigger: 'change',
               }]"
                >
                    <el-select
                        v-model="fixedAssetsRegistrationForm.teacherId"
                        @change="getClass2(fixedAssetsRegistrationForm.teacherId)"
                        :disabled="fixedAssetsRegistrationForm.id ? true : false"
                        placeholder="请选择申请老师"
                    >
                        <el-option
                            v-for="item in getListTeacher"
                            :key="item.id"
                            :label="item.lsxm"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="使用班级"
                    label-width="100px"
                    prop="classId"
                    :rules="[{
                    required: true,
                    message: '请选择班级',
                    trigger: 'change',
               }]"
                >
                    <el-select
                        v-model="fixedAssetsRegistrationForm.classId"
                        :disabled="fixedAssetsRegistrationForm.id ? true : false"
                        placeholder="请选择使用班级"
                    >
                        <el-option
                            v-for="(item, index) in getListBjclass2"
                            :key="index"
                            :label="item.rybjmc"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="发放途径"
                    label-width="100px"
                    prop="distributionWay"
                    :rules="[{
                    required: true,
                    message: '请选择发放途径',
                    trigger: 'change',
               }]"
                >
                    <el-row :gutter="10">
                        <el-col :span="10">
                            <el-select
                                v-model="fixedAssetsRegistrationForm.distributionWay"
                                :disabled="fixedAssetsRegistrationForm.id ? true : false"
                                placeholder="请选择发放途径"
                            >
                                <el-option
                                    v-for="(item,index) in giveWay"
                                    :key="index"
                                    :label="item.dictLabel"
                                    :value="item.dictValue"
                                ></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="6">
                            <div>库存 : {{getStockNum}}</div>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="目前状态" label-width="100px">
                    <el-radio-group v-model="fixedAssetsRegistrationForm.status">
                        <el-radio
                            :disabled="fixedAssetsRegistrationForm.id ? true : false"
                            v-for="(item,index) in goodsLibraryRegisterStatus"
                            :key="index"
                            :label="item.dictValue"
                        >{{item.dictLabel}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    v-if="fixedAssetsRegistrationForm.status == '2'"
                    label="最终去向"
                    label-width="100px"
                >
                    <el-radio-group v-model="fixedAssetsRegistrationForm.destination">
                        <el-radio
                            v-for="(item,index) in endTransfer"
                            :key="index"
                            :label="item.dictValue"
                        >{{item.dictLabel}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    v-if="fixedAssetsRegistrationForm.destination == '4' && fixedAssetsRegistrationForm.status == '2'"
                    label="移交信息"
                    label-width="100px"
                >
                    <el-form-item label="申请老师" style="margin-top:10px" label-width="100px">
                        <el-select
                            v-model="fixedAssetsRegistrationForm.transferTeacherId"
                            @change="getClass3(fixedAssetsRegistrationForm.transferTeacherId)"
                            placeholder="请选择申请老师"
                        >
                            <el-option
                                v-for="item in getListTeacher"
                                :key="item.id"
                                :label="item.lsxm"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="使用班级" label-width="100px">
                        <el-select
                            v-model="fixedAssetsRegistrationForm.transferClassId"
                            placeholder="请选择使用班级"
                        >
                            <el-option
                                v-for="(item, index) in getListBjclass3"
                                :key="index"
                                :label="item.rybjmc"
                                :value="item.id"
                            ></el-option>
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
import { listBjclass } from "@/api/basic/bjclass";
import { listTeacher } from "@/api/basic/teacher";
import { getStock } from "@/api/basic/fixedAssetsLibrary";
import {
    listGoodsRegister,
    addGoodsLibraryRegister,
    updateRegister,
} from "@/api/basic/fixedAssetsRegistration";
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
                classId: null,
            },
            // 表格数据
            fixedAssetsRegistrationTableData: [],
            // 表单数据
            fixedAssetsRegistrationForm: {
                status: "1",
                classId: null,
                transferClassId: null,
            },
            // 遮罩
            dialogFormVisible: false,
            // 查看还是编辑
            open: false,
            //物品类型
            goodsType: [],
            // 班级
            getListBjclass1: [],
            getListBjclass2: [],
            getListBjclass3: [],
            // 老师
            getListTeacher: [],
            // 物品名称
            goodsName: [],
            // 状态
            goodsLibraryRegisterStatus: [],
            // 发放途径
            giveWay: [],
            // 库存数量
            getStockNum: 0,
            // 发放公司
            giveCompany: [],
            // 最终去向
            endTransfer: [],
        };
    },
    created() {
        this.getDicts("goodsType").then((response) => {
            this.goodsType = response.data;
        });
        this.getDicts("goodsName").then((response) => {
            this.goodsName = response.data;
        });
        this.getDicts("goodsLibraryRegisterStatus").then((response) => {
            this.goodsLibraryRegisterStatus = response.data;
        });
        this.getDicts("giveWay").then((response) => {
            this.giveWay = response.data;
        });
        this.getDicts("giveCompany").then((response) => {
            this.giveCompany = response.data;
        });
        this.getDicts("endTransfer").then((response) => {
            this.endTransfer = response.data;
        });
        // 老师
        listTeacher().then((res) => {
            this.getListTeacher = res.rows;
        });
    },
    methods: {
        // 列表数据查询
        getList() {
            listGoodsRegister(this.queryParams).then((res) => {
                this.fixedAssetsRegistrationTableData = res.rows;
                this.total = this.total;
            });
        },
        // 获取班级
        getClass1(lsid) {
            this.getListBjclass1 = [];
            // 获取班级信息lsid
            listBjclass({ lsid }).then((res) => {
                this.queryParams.classId = res.rows[0].id;
                this.getListBjclass1 = res.rows;
            });
        },
        // 重置
        reset() {
            this.fixedAssetsRegistrationForm = {
                status: "1",
                classId: null,
                transferClassId: null,
            };
        },
        // 获取班级
        getClass2(lsid, bjid = "") {
            this.getListBjclass2 = [];
            // 获取班级信息lsid
            listBjclass({ lsid }).then((res) => {
                if (bjid) {
                    this.fixedAssetsRegistrationForm.classId = bjid;
                } else {
                    this.fixedAssetsRegistrationForm.classId = res.rows[0].id;
                }
                this.getListBjclass2 = res.rows;
            });
        },
        // 获取班级
        getClass3(lsid, bjid = "") {
            this.getListBjclass3 = [];
            // 获取班级信息lsid
            listBjclass({ lsid }).then((res) => {
                if (bjid) {
                    this.fixedAssetsRegistrationForm.transferClassId = bjid;
                } else {
                    this.fixedAssetsRegistrationForm.transferClassId =
                        res.rows[0].id;
                }

                this.getListBjclass3 = res.rows;
            });
        },
        // 登记
        handleRegister() {
            this.reset();
            this.dialogFormVisible = true;
            this.open = true;
        },
        // 导出
        handleExport() {
            this.download(
                "/basic/goodsLibrary/register/export",
                {
                    ...this.queryParams,
                },
                `固定资产登记.xlsx`
            );
        },
        // 获取库存
        onGetStock(goodsName) {
            getStock({ goodsName }).then((res) => {
                this.getStockNum = res.data;
            });
        },
        // 查看
        handleView(row) {
            this.fixedAssetsRegistrationForm = row;
            this.getClass2(row.teacherId, row.classId);
            this.getClass3(row.transferTeacherId, row.transferClassId);
            this.dialogFormVisible = true;
            this.open = false;
            this.onGetStock(this.fixedAssetsRegistrationForm.kzzd1);
        },
        // 编辑
        handleEdit(row) {
            this.fixedAssetsRegistrationForm = row;
            this.getClass2(row.teacherId, row.classId);
            this.dialogFormVisible = true;
            this.open = true;
        },
        // 提交
        onSubmit() {
            this.$refs["fixedAssetsRegistrationForm"].validate((valid) => {
                if (valid) {
                    if (this.fixedAssetsRegistrationForm.id) {
                        updateRegister(this.fixedAssetsRegistrationForm).then(
                            (res) => {
                                if (res.code == 200) {
                                    this.dialogFormVisible = false;
                                    this.getList();
                                    this.msgSuccess(res.msg);
                                }
                            }
                        );
                    } else {
                        addGoodsLibraryRegister(
                            this.fixedAssetsRegistrationForm
                        ).then((res) => {
                            if (res.code == 200) {
                                this.dialogFormVisible = false;
                                this.getList();
                                this.msgSuccess(res.msg);
                            }
                        });
                    }
                }
            });
        },
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