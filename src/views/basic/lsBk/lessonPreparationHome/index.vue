<template>
    <div class="lessonHome">
        <el-form ref="form" :model="form" :inline="true" label-width="80px">
            <!-- <el-form-item label="班级">
                <el-select v-model="form.bjid" placeholder="请选择日语班级" @change="rybjOnChange" filterable>
                    <el-option v-for="item in bjclassList" :key="item.id" :label="item.rybjmc" :value="item.id"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="年份">
                <el-select v-model="form.region" placeholder="请选择年份">
                    <el-option v-for="(item, index) in bjkbStartDate" :label="item" :value="item" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item label="月份">
                <el-select v-model="form.region" placeholder="请选择月份">
                    <el-option v-for="(item,index) in 12" :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="学期">
                <el-select v-model="form.region" placeholder="请选择学期">
                    <el-option v-for="(item,index) in nianji" :label="item.dictLabel" :value="item.dictValue" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getList">查询</el-button>
            </el-form-item>
        </el-form>

        <div class="Information-bar" v-if="false">
            <div class="bar-top">
                <div class="bar-item">
                    <div class="bar-info">
                        <img style="height : 100%;margin-right : 10px" src="https://img2.baidu.com/it/u=3872949038,3863745906&fm=26&fmt=auto" alt />
                        <div class="info-item">
                            <h4 style="line-height : 30px;margin : 5px 0">正常进度</h4>
                            <ul style="list-style : none">
                                <li>
                                    <span>姓名:</span>
                                    <span>吴珂</span>
                                </li>
                                <li>
                                    <span>班级:</span>
                                    <span>曾都二中21班</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="step-item">
                    <ul>
                        <li>
                            <div style="display:flex;justify-content: space-around; margin-bottom : 10px">
                                <span style="color : #67c23a;" v-for="(item,index) in arr" :key="index">{{item.name}}</span>
                            </div>
                            <el-progress :text-inside="true" color="#67c23a" :stroke-width="20" :percentage="100" status="success"></el-progress>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="bar-bottom">
                <div class="bar-item">
                    <div class="bar-info">
                        <img style="height : 100%;margin-right : 10px" src="https://img2.baidu.com/it/u=3872949038,3863745906&fm=26&fmt=auto" alt />
                        <div class="info-item">
                            <h4 style="line-height : 30px;margin : 5px 0">目前进度</h4>
                            <Ul style="list-style : none">
                                <li>
                                    <span>姓名:</span>
                                    <span>吴珂</span>
                                </li>
                                <li>
                                    <span>班级:</span>
                                    <span>曾都二中21班</span>
                                </li>
                            </Ul>
                        </div>
                    </div>
                </div>
                <div class="step-item">
                    <ul>
                        <li>
                            <div style="display:flex;justify-content: space-around; margin-bottom : 10px">
                                <span style="color : #f56c6c;" v-for="(item,index) in arr" :key="index">{{item.name}}</span>
                            </div>
                            <el-progress :text-inside="true" color="#f56c6c" :stroke-width="20" :percentage="100" status="success"></el-progress>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="outline">
            <el-tabs v-model="form.bjid" type="card" @tab-click="rybjOnChange">
                <el-tab-pane v-for="item in bjclassList" :key="item.id" :label="item.rybjmc" :name="item.id">
                </el-tab-pane>
                <h4>课程大纲</h4>
                <div v-if="false">
                    <el-button size="mini" type="primary">课程补充</el-button>
                    <el-button size="mini" type="danger">删除补充</el-button>
                    <el-button size="mini" type="info">默认课程</el-button>
                    <el-button size="mini" type="warning">手动添加</el-button>
                </div>
                <div class="outline-list">
                    <ul style="list-style : none">
                        <li class="list">
                            <h4>当前进度教学计划</h4>
                            <div class="current-course-progress">
                                <div class="left">
                                    <el-tree node-key="id" ref="dqtree" :highlight-current="true" :default-expanded-keys="dqDefaultExpandedKeys" :data="dqTreeListTeacherData" :props="dqDefaultProps" @node-click="dqHandleNodeClick"></el-tree>
                                </div>
                                <div class="right">
                                    <div class="right-main" v-for="(item,index) in dqTemplatetreeListTeacher" :key="index">
                                        <template v-if="dqTemplatetreeListTeacher">
                                            <span style="color :#67C23A;margin : 0;padding : 0" v-if="item.isLastkc == '1'">{{item.name}}</span>
                                            <span style="color : #303133;margin : 0;padding : 0" v-else>{{item.name}}</span>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="list">
                            <h4>当前备课进度</h4>
                            <div class="wrap-item">
                                <div class="left">
                                    <el-tree node-key="id" ref="bktree" :highlight-current="true" :default-expanded-keys="defaultExpandedKeys" :data="treeListTeacherData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                                </div>
                                <div class="right">
                                    <ul style="list-style : none">
                                        <li class="right-item" v-for="(item,index) in templatetreeListTeacher" :key="index">
                                            <template v-if="templatetreeListTeacher">
                                                <div style="width : 55%">
                                                    <span style="color : #303133;margin : 0;padding : 0">{{item.name}}</span>
                                                </div>
                                                <div style=" display : flex; justify-content : space-between;width : 180px">
                                                    <el-button style="width : 80px;text-align : center" type="info" size="mini" effect="dark" v-if="item.sfbk == '1'" @click="toEdit(item,'lessonPreparationIndex')">查看</el-button>
                                                    <el-tag style="width : 80px;text-align : center" type="success" effect="dark" v-if="item.sfbk == '1'">已备课</el-tag>
                                                    <el-button style="width : 80px;text-align : center" size="mini" v-else type="danger" @click="toEdit(item,'lessonPreparationEdit')">去备课</el-button>
                                                </div>
                                            </template>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li class="list">3</li>
                        <li class="list">
                            <h4>当前复习进度</h4>
                            <div class="wrap-item">
                                <div class="left">
                                    <el-tree node-key="id" ref="fxtree" :highlight-current="true" :default-expanded-keys="fxDefaultExpandedKeys" :data="fxTreeListTeacherData" :props="fxDefaultProps" @node-click="fxHandleNodeClick"></el-tree>
                                </div>
                                <div class="right">
                                    <ul style="list-style : none">
                                        <li class="right-item" v-for="(item,index) in fxTemplatetreeListTeacher" :key="index">
                                            <template v-if="fxTemplatetreeListTeacher">
                                                <div style="width : 55%">
                                                    <span style="color : #303133;margin : 0;padding : 0">{{item.name}}</span>
                                                </div>
                                                <div style=" display : flex; justify-content : space-between;width : 180px">
                                                    <el-button style="width : 80px;text-align : center" type="info" size="mini" effect="dark" v-if="item.sfbk == '1'" @click="toEdit(item,'fx-lessonPreparation-index')">查看</el-button>
                                                    <el-tag style="width : 80px;text-align : center" type="success" effect="dark" v-if="item.sfbk == '1'">已备课</el-tag>
                                                    <el-button style="width : 80px;text-align : center" size="mini" v-else type="danger" @click="toEdit(item,'fx-lessonPreparation-edit')">去备课</el-button>
                                                </div>
                                            </template>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { listBjclass } from "@/api/basic/bjclass";
import { topHalfQuery, lowerHalf } from "@/api/teaching/generate";
import {
    treeListTeacher,
    prepareLessons,
    fxTreeListTeacher,
    treeListTeacherForReview
} from "@/api/basic/lessonPreparationHome";
export default {
    data() {
        return {
            form: {
                lsid: this.$store.state.user.glrid,
                bjid: null,
                jcid: null
            },
            arr: [
                {
                    num: 100,
                    name: "第一课"
                },
                {
                    num: 100,
                    name: "第二课"
                },
                {
                    num: 100,
                    name: "第三课"
                },
                {
                    num: 100,
                    name: "第四课"
                }
            ],
            treeListTeacherData: [],
            fxTreeListTeacherData: [],
            defaultProps: {
                children: "children",
                label: "label"
            },
            fxDefaultProps: {
                children: "children",
                label: "name"
            },
            bjclassList: [],
            bjkbStartDate: [],
            nianji: [],
            defaultExpandedKeys: [],
            fxDefaultExpandedKeys: [],
            dqTreeListTeacherData: [],
            dqDefaultExpandedKeys: [],
            dqTemplatetreeListTeacher: [],
            dqDefaultProps: {
                children: "children",
                label: "name"
            },
            templatetreeListTeacher: null,
            fxTemplatetreeListTeacher: null
        };
    },
    created() {
        this.getConfigKey("bjkbStartDate").then(res => {
            let date = new Date().getFullYear() + 1;
            for (let i = res.msg; i <= date; i++) {
                this.bjkbStartDate.push(i);
            }
        });
        this.getDicts("nianji").then(response => {
            this.nianji = response.data;
        });
        listBjclass({ lsid: this.form.lsid }).then(response => {
            this.bjclassList = response.rows;
            if (response.rows.length == 1) {
                this.form.bjid = response.rows[0].id;
                this.form.jcid = response.rows[0].uname;
                this.getList();
            } else {
                this.form.bjid = null;
            }
        });
    },
    mounted() {},
    methods: {
        getList() {
            treeListTeacher(this.form).then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    res.data[i].children = res.data[i].treeTeachingTemplateList;
                    delete res.data[i].treeTeachingTemplateList;
                }
                this.treeListTeacherData = JSON.parse(JSON.stringify(res.data));
                this.dataProcessing(this.treeListTeacherData);
            });
            treeListTeacherForReview(this.form).then(res => {
                this.fxTreeListTeacherData = [];
                this.fxTemplatetreeListTeacher = null;
                if (res.code == 200 && res.data.length > 0) {
                    this.fxTreeListTeacherData = res.data;
                    this.fxDataProcessing(this.fxTreeListTeacherData);
                }
            });
            lowerHalf({
                bjid: this.form.bjid,
                lx: 1
            }).then(res => {
                if (res.code == 200 && res.data) {
                    this.dqTreeListTeacherData = JSON.parse(
                        JSON.stringify(res.data.dqTreeTeachingClassPlan)
                    );
                    this.dqDataProcessing(
                        this.dqTreeListTeacherData,
                        "dqDefaultExpandedKeys",
                        "dqTemplatetreeListTeacher",
                        "dqtree"
                    );
                }
            });
        },
        dqDataProcessing(item, key, templates, trees) {
            for (let i = 0; i < item.length; i++) {
                if (item[i].children && item[i].children.length > 0) {
                    if (item[i].weight == "1") {
                        if (item[i].isLastdy == "1") {
                            this.$nextTick(() => {
                                this.$refs[trees].setCurrentKey(item[i].id);
                                this[key].push(item[i].id);
                            });
                            this[templates] = item[i].children;
                        }
                        item[i].ifChildren = item[i].children;
                        delete item[i].children;
                    } else {
                        this.dqDataProcessing(item[i].children, key, templates, trees);
                    }
                }
            }
        },
        dqHandleNodeClick(data) {
            if (data.weight == "1") {
                this.dqTemplatetreeListTeacher = data.ifChildren;
            } else {
                this.dqTemplatetreeListTeacher = null;
            }
        },
        dataProcessing(item) {
            for (let i = 0; i < item.length; i++) {
                item[i].label = item[i].name;
                if (item[i].children && item[i].children.length > 0) {
                    if (item[i].weight == "2") {
                        if (item[i].isLastPrepare == "1") {
                            this.$nextTick(() => {
                                this.$refs.bktree.setCurrentKey(item[i].id);
                                this.defaultExpandedKeys.push(item[i].id);
                            });
                            this.templatetreeListTeacher = item[i].children;
                        }
                        item[i].ifChildren = item[i].children;
                        delete item[i].children;
                    } else {
                        this.dataProcessing(item[i].children);
                    }
                } else {
                    item[i].xzid = item[i].id;
                }
            }
        },
        fxDataProcessing(item) {
            for (let i = 0; i < item.length; i++) {
                item[i].label = item[i].name;
                if (item[i].children && item[i].children.length > 0) {
                    if (item[i].weight == "2") {
                        if (item[i].isLastPrepare == "1") {
                            this.$nextTick(() => {
                                this.$refs.fxtree.setCurrentKey(item[i].id);
                                this.fxDefaultExpandedKeys.push(item[i].id);
                            });
                            this.fxTemplatetreeListTeacher = item[i].children;
                        }
                        item[i].ifChildren = item[i].children;
                        delete item[i].children;
                    } else {
                        this.fxDataProcessing(item[i].children);
                    }
                } else {
                    item[i].xzid = item[i].id;
                }
            }
        },
        format(percentage) {
            return percentage === 100 ? "完成" : `${percentage}%`;
        },
        // 获取备课的详细信息
        handleNodeClick(data) {
            if (data.weight == "2") {
                this.templatetreeListTeacher = data.ifChildren;
            } else {
                this.templatetreeListTeacher = null;
            }
        },
        // 复习
        fxHandleNodeClick(data) {
            if (data.weight == "2") {
                this.fxTemplatetreeListTeacher = data.ifChildren;
            } else {
                this.fxTemplatetreeListTeacher = null;
            }
        },
        // 切换班级
        rybjOnChange() {
            this.bjclassList.forEach(value => {
                if (value.id == this.form.bjid) {
                    this.form.bjid = value.id;
                    this.form.jcid = value.uname;
                    this.getList();
                }
            });
        },
        // 去备课
        toEdit(item, path) {
            item = Object.assign(item, this.form);
            this.getConfigKey(path).then(res => {
                this.$router.push({
                    path: res.msg + `?list=${JSON.stringify(item)}`
                });
            });
        }
    }
};
</script>

<style lang="scss">
.lessonHome {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
    .Information-bar {
        width: 100%;
        -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        border: 1px solid #e6ebf5;
        padding: 20px;
        box-sizing: border-box;
        .bar-top {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .bar-item {
                width: 30%;
                height: 120px;
                background: #67c23a;
                color: #fff;
                padding: 10px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                .bar-info {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    .info-item {
                        ul {
                            width: 100%;
                            margin: 0px;
                            padding: 0px;
                            li {
                                width: 100%;
                                line-height: 30px;
                            }
                        }
                    }
                }
            }
            .step-item {
                width: 68%;
                height: 120px;
                ul {
                    width: 100%;
                    display: flex;
                    list-style: none;
                    // justify-content: space-between;
                    li {
                        width: 100%;
                    }
                }
            }
        }
        .bar-bottom {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 30px;
            .bar-item {
                width: 30%;
                height: 120px;
                background: #f56c6c;
                padding: 10px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                color: #fff;
                .bar-info {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    .info-item {
                        ul {
                            width: 100%;
                            margin: 0px;
                            padding: 0px;
                            li {
                                width: 100%;
                                line-height: 30px;
                            }
                        }
                    }
                }
            }
            .step-item {
                width: 68%;
                height: 120px;
                ul {
                    width: 100%;
                    display: flex;
                    list-style: none;
                    // justify-content: space-between;
                    li {
                        width: 100%;
                    }
                }
            }
        }
    }
    .outline {
        width: 100%;
        -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        border: 1px solid #e6ebf5;
        padding: 20px;
        box-sizing: border-box;
        margin-top: 20px;
        .outline-list {
            width: 100%;
            ul {
                width: 100%;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                margin: 0;
                padding: 0;
                .list {
                    width: 49%;
                    // height: 400px;
                    // background: coral;
                    border: 2px solid #eee;
                    margin-top: 30px;
                    padding: 20px;
                    box-sizing: border-box;
                    .current-course-progress {
                        display: flex;
                        justify-content: space-between;
                        .left {
                            width: 30%;
                        }
                        .right {
                            width: 68%;
                            .right-main {
                                display: flex;
                                justify-content: space-between;
                                margin: 5px 0px;
                            }
                        }
                    }
                    .wrap-item {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        border: 2px solid #ddd;
                        padding: 20px;
                        box-sizing: border-box;
                        .left {
                            width: 40%;
                        }
                        .right {
                            width: 58%;
                            ul {
                                width: 100%;
                                .right-item {
                                    width: 100%;
                                    display: flex;
                                    margin-bottom: 10px;
                                    justify-content: space-between;
                                    align-items: center;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
