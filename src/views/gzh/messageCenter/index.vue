<template>
    <div class="msgHome">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="接收者">
                <el-select filterable v-model="queryParams.receiver">
                    <el-option
                        v-for="(dic, index) in userList"
                        :key="index"
                        :label="dic.name"
                        :value="dic.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="消息类型">
                <el-select v-model="queryParams.messageType">
                    <el-option
                        v-for="(dic, index) in wechatMsgType"
                        :key="index"
                        :label="dic.dictLabel"
                        :value="dic.dictValue"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="消息模块">
                <el-input v-model="queryParams.messageModule" />
            </el-form-item>
            <el-form-item label="发送时间">
                <el-date-picker v-model="queryParams.sjArr" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getList">查 询</el-button>
                <el-button type="success" @click="addMsg">添 加 消 息</el-button>
            </el-form-item>
            <el-form-item>
                <el-popover placement="bottom" width="600" trigger="click">
                    <el-table :data="userTable" height="400px">
                        <el-table-column width="100" property="name" label="姓名"></el-table-column>
                        <el-table-column property="phone" label="手机号"></el-table-column>
                        <el-table-column property="kzzd4" label="微信昵称"></el-table-column>
                        <el-table-column property="phone" label="状态">
                            <template slot-scope="scope">
                                <el-tag type="warning" v-if="scope.row.status == ''||scope.row.status == null">未进行角色绑定</el-tag>
                                <el-tag type="success" v-if="scope.row.status == 1">正 常</el-tag>
                                <el-tag type="info" v-if="scope.row.status == 0">待审核</el-tag>
                                <el-tag type="danger" v-if="scope.row.status == 2">不通过</el-tag>
                            </template>
                        </el-table-column>
                      <el-table-column property="createTime" label="添加时间" width="150px">
                        <template slot-scope="scope">
                          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-button type="danger" slot="reference" @click="getNoFollowed">查看未关注用户</el-button>
                </el-popover>
            </el-form-item>
        </el-form>

        <el-table :data="msgTableData" border style="width: 100%">
            <el-table-column type="index" label="序号" width="55">
            </el-table-column>
            <el-table-column prop="msgTitle" label="消息主题" width="180">
            </el-table-column>
            <el-table-column prop="messageType" label="消息类型" width="180">
              <template slot-scope="scope">
                <dict-tag :options="wechatMsgType" :value="scope.row.messageType" />
              </template>
            </el-table-column>
            <el-table-column prop="messageModule" label="消息模块">
            </el-table-column>
            <el-table-column prop="createTime" label="发送时间">
            </el-table-column>
            <el-table-column prop="address" label="操作" width="200px">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="info"
                        @click="handelViews(scope.row)"
                        >查 看</el-button
                    >
                    <el-button size="mini" type="success" @click="handelSend"
                        >再 次 发 送</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 查看 -->
        <el-dialog title="消息" :visible.sync="dialogFormVisible">
            <div style="text-align: center">
                <h1 style="margin: 10px 0px; padding: 0">{{ msgTitle }}</h1>
            </div>
            <el-table :data="wxMsgUserTable" border style="width: 100%">
                <el-table-column type="index" label="序号" width="55">
                </el-table-column>
                <el-table-column prop="wxName" label="接收人" width="180">
                </el-table-column>
                <el-table-column prop="phone" label="接收人电话" width="180">
                </el-table-column>
                <el-table-column prop="status" label="消息状态">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.status == 1"
                            >发送成功</el-tag
                        >
                        <el-tag type="danger" v-if="scope.row.status == 0"
                            >发送失败</el-tag
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
        <!-- 添加消息 -->
        <el-dialog title="消息" :visible.sync="msgDialogFormVisible">
            <table style="width: 100%" border="1" cellspacing="0">
                <tbody>
                    <tr>
                        <td
                            style="
                                padding: 20px;
                                box-sizing: border-box;
                                text-align: center;
                            "
                        >
                            消息模块
                        </td>
                        <td style="padding: 20px; box-sizing: border-box">
                            <el-input v-model="msgHomeForm.messageModule" />
                        </td>
                    </tr>
                    <tr>
                        <td
                            style="
                                padding: 20px;
                                box-sizing: border-box;
                                text-align: center;
                            "
                        >
                            消息类型
                        </td>
                        <td style="padding: 20px; box-sizing: border-box">
                            <el-select
                                filterable
                                v-model="msgHomeForm.messageType"
                                @change="getTemplateShow"
                            >
                                <el-option
                                    v-for="(dic, index) in wechatMsgType"
                                    :key="index"
                                    :label="dic.dictLabel"
                                    :value="dic.dictValue"
                                ></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td
                            style="
                                padding: 20px;
                                box-sizing: border-box;
                                text-align: center;
                            "
                        >
                            接收人
                        </td>
                        <td style="padding: 20px; box-sizing: border-box">
                            <div>
                                <el-input
                                    v-model="msgHomeForm.receiver"
                                    @input="getReceiverName"
                                />
                                <el-checkbox
                                    v-model="isSelectAll"
                                    @change="selectAll"
                                    >全 选</el-checkbox
                                >
                            </div>
                            <div style="margin: 20px 0px">
                                <el-checkbox-group
                                    v-model="msgHomeForm.receiverArr"
                                >
                                    <el-checkbox
                                        v-for="(dic, index) in userNameList"
                                        :key="index"
                                        :label="dic.openId"
                                    >
                                        {{ dic.name }}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="showArr.includes(1)">
                        <td style="padding: 20px;box-sizing: border-box;text-align: center;">
                            消息标题
                        </td>
                        <td style="padding: 20px; box-sizing: border-box">
                            <el-input v-model="msgHomeForm.msgTitle" />
                        </td>
                    </tr>
                    <tr v-if="showArr.includes(2)">
                        <td
                            style="
                                padding: 20px;
                                box-sizing: border-box;
                                text-align: center;
                            "
                        >
                            消息内容
                        </td>
                        <td style="padding: 20px; box-sizing: border-box">
                            <el-input
                                type="textarea"
                                :rows="4"
                                placeholder="请输入内容"
                                v-model="msgHomeForm.msgContent"
                            >
                            </el-input>
                        </td>
                    </tr>
                    <tr v-if="showArr.includes(1)">
                      <td style="padding: 20px;box-sizing: border-box;text-align: center;">
                        跳转链接
                      </td>
                      <td style="padding: 20px; box-sizing: border-box">
                        <el-input type="textarea" :rows="4" v-model="msgHomeForm.kzzd1" />
                      </td>
                    </tr>
                    <tr v-if="showArr.includes(1)">
                      <td style="padding: 20px;box-sizing: border-box;text-align: center;">
                        备注
                      </td>
                      <td style="padding: 20px; box-sizing: border-box">
                        <el-input type="textarea" :rows="4" v-model="msgHomeForm.remark" />
                      </td>
                    </tr>
                    <tr v-if="showArr.includes(3)">
                        <td
                            style="
                                padding: 20px;
                                box-sizing: border-box;
                                text-align: center;
                            "
                        >
                            素材id
                        </td>
                        <td style="padding: 20px; box-sizing: border-box">
                            <el-select filterable v-model="msgHomeForm.scid">
                                <el-option
                                    v-for="item in scOptions"
                                    :key="item.value"
                                    :label="item.scmc"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="msgDialogFormVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="handelSave">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listWxMessage,
    getWxMessage,
    addWxMessage,
    updateWxMessage,
    delWxMessage,
} from "@/api/basic/messageCenter";
import {
    listWxMsgUser,
    getWxMsgUser,
    addWxMsgUser,
    updateWxMsgUser,
    delWxMsgUser,
} from "@/api/basic/msgUser";
import { getUserList } from "@/api/basic/msgUser";
import { listWxMaterial } from "@/api/basic/wxMaterial";
export default {
    data() {
        return {
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                sjArr: [],
            },
            total: 0,
            dialogFormVisible: false,
            msgDialogFormVisible: false,
            msgHomeForm: {
                userId: this.$store.state.user.userId,
                userName: this.$store.state.user.nickName,
                receiverArr: [],
                lsidArr: [],
                messageType: "2",
            },
            msgTableData: [],
            wechatMsgType: [],
            userList: [],
            userNameList: [],
            wxMsgUserTable: [],
            scOptions: [],
            msgTitle: "",
            isSelectAll: false,
            showArr: [],
            userTable: [],
        };
    },
    created() {
        getUserList(this.wecharServerUrl, {
            isDel: 1,
            status: 1,
        }).then((res) => {
            this.userList = res.rows;
        });
        this.getDicts("wechatMsgType").then((res) => {
            this.wechatMsgType = res.data;
        });
        this.getReceiverName();
    },
    methods: {
        // 查看未关注用户
        getNoFollowed() {
            getUserList(this.wecharServerUrl, {
                isDel: 0,
            }).then((res) => {
                this.userTable = res.rows;
            });
        },
        // 获取素材数据
        getListWxMaterial(type) {
            listWxMaterial(this.wecharServerUrl, {
                sclx: type,
            }).then((res) => {
                this.scOptions = res.rows;
            });
        },
        // 数据初始化查询
        getList() {
            if (this.queryParams.sjArr && this.queryParams.sjArr.length > 0) {
                this.queryParams.startDate = this.queryParams.sjArr[0];
                this.queryParams.endDate = this.queryParams.sjArr[1];
            } else {
                this.queryParams.startDate = null;
                this.queryParams.endDate = null;
            }
            listWxMessage(this.wecharServerUrl, this.queryParams).then(
                (res) => {
                    this.msgTableData = res.rows;
                    this.total = res.total;
                }
            );
        },
        // 添加消息
        addMsg() {
            this.msgHomeForm = {
                userId: this.$store.state.user.userId,
                userName: this.$store.state.user.nickName,
                receiverArr: [],
                lsidArr: [],
                messageType: "1",
                messageModule:"系统后台",
            };
            this.getTemplateShow();
            this.msgDialogFormVisible = true;
        },
        // 查看
        handelViews(row) {
            this.msgTitle =
                row.msgTitle + "-" + row.messageModule + "-" + row.createTime;
            listWxMsgUser(this.wecharServerUrl, {
                glid: row.id,
            }).then((res) => {
                this.wxMsgUserTable = res.rows;
            });
            this.dialogFormVisible = true;
        },
        // 再次发送
        handelSend() {},
        // 保存
        handelSave() {
            this.userNameList.forEach((val) => {
                if (
                    this.msgHomeForm.receiverArr.indexOf(val.openId) != -1 &&
                    this.msgHomeForm.lsidArr.indexOf(val.userId) == -1
                ) {
                    this.msgHomeForm.lsidArr.push(val.userId);
                }
            });
            addWxMessage(this.wecharServerUrl, this.msgHomeForm).then((res) => {
                if (res.code == 200) {
                    this.msgDialogFormVisible = false;
                    this.getList();
                    this.msgSuccess("添加成功");
                }
            });
        },
        //动态搜索接收者
        getReceiverName() {
            getUserList(this.wecharServerUrl, {
                isDel: 1,
                status: 1,
                name: this.msgHomeForm.receiver,
            }).then((res) => {
                this.userNameList = res.rows;
            });
        },
        // 全选
        selectAll() {
            if (this.isSelectAll) {
                this.userNameList.forEach((val) => {
                    this.msgHomeForm.receiverArr.push(val.openId);
                });
                this.isSelectAll = true;
            } else {
                this.msgHomeForm.receiverArr = [];
            }
            if (
                this.msgHomeForm.receiverArr.length < this.userNameList.length
            ) {
                this.isSelectAll = false;
            }
        },
        // 消息类型选择
        getTemplateShow() {
            switch (this.msgHomeForm.messageType) {
                // 模板
                case "1":
                    this.showArr = [1, 2];
                    break;
                // 普通文本
                case "2":
                    this.showArr = [2];
                    break;
                // 图片
                case "3":
                    this.showArr = [3];
                    this.getListWxMaterial("image");
                    break;
                // 音频
                case "4":
                    this.showArr = [3];
                    this.getListWxMaterial("voice");
                    break;
                // 视频
                case "5":
                    this.showArr = [3];
                    this.getListWxMaterial("video");
                    break;
                // 图文
                case "6":
                    this.showArr = [3];
                    this.getListWxMaterial("news");
                    break;
                default:
                    break;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.msgHome {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
}
</style>
