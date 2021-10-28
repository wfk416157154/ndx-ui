<template>
  <div class="app-container home">
    <el-dialog title="消息通知" :visible.sync="dialogTableVisible">
      <el-table
        v-loading="loading"
        :height="$root.tableHeight"
        width="90%"
        border
        :data="messageList"
      >
        <el-table-column label="id" align="center" prop="id" v-if="false" />
        <el-table-column label="消息类型" align="center" prop="xxlx">
          <template slot-scope="scope">
            <dict-tag :options="xxlxOptions" :value="scope.row.xxlx" />
          </template>
        </el-table-column>
        <el-table-column label="消息标题" align="center" prop="xxbt" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="提交人名称" align="center" prop="userName" />
        <el-table-column label="发送时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="messageStatus">
          <template slot-scope="scope">
            <dict-tag :options="confirmOptions" :value="scope.row.messageStatus" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="messageCheck(scope.row)"
            >查看内容</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="messageConfirm(scope.row)"
              v-if="scope.row.messageStatus=='0'"
            >确认</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="messageReply(scope.row)"
              v-if="scope.row.messageStatus=='3'"
            >回复</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog width="80%" :title="innerTitle" :visible.sync="innerVisible" append-to-body>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="消息类型" prop="xxlx">
            <el-select v-model="form.xxlx" placeholder="请选择消息类型">
              <el-option
                v-for="dict in xxlxOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消息标题" prop="xxbt">
            <el-input v-model="form.xxbt" maxlength="100" placeholder="请输入消息标题" />
          </el-form-item>
          <el-form-item label="消息内容" prop="xxnr">
            <div v-html="form.xxnr" style="padding: 10px;"></div>
          </el-form-item>
          <el-form-item label="文件下载" prop="wjidFile">
            <el-button
              size="mini"
              type="text"
              v-for="(item,index) in wjidFile"
              :key="index"
              @click="downloadFileName(item.wjmc)"
            >{{item.wjmc}}</el-button>
          </el-form-item>
          <el-form-item
            label="回复内容"
            prop="messageHfnr"
            v-if="messageConfirmStatus=='3'||messageConfirmStatus=='2'"
          >
            <el-input
              type="textarea"
              v-model="form.messageHfnr"
              :disabled="messageConfirmStatus=='2'"
              maxlength="400"
              placeholder="请输入"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            v-prevent-re-click
            @click="submitForm"
            v-if="messageConfirmStatus=='3'"
          >回复</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {
  listMessage,
  getMessage,
  delMessage,
  addMessage,
  updateMessage
} from "@/api/basic/message";
import {
  listMessageReceive,
  getMessageReceive,
  delMessageReceive,
  addMessageReceive,
  updateMessageReceive
} from "@/api/basic/messageReceive";
export default {
  name: "index",
  data() {
    return {
      // 版本号
      version: "2.5.0",
      // 遮罩层
      loading: true,
      // 消息管理表格数据
      messageList: [],
      // 消息类型字典
      xxlxOptions: [],
      // 显示弹窗
      dialogTableVisible: false,
      // 内层弹窗
      innerVisible: false,
      // 内层弹窗标题
      innerTitle: "",
      // 文件数组
      wjidFile: [],
      // 表单内容
      form: {},
      // 接收人消息-确认状态码表
      confirmOptions: [],
      // 接收人消息-确认状态数据
      messageConfirmStatus: ""
    };
  },
  created() {
    this.getDicts("messageType").then(response => {
      this.xxlxOptions = response.data;
    });
    this.getDicts("confirmStatus").then(response => {
      this.confirmOptions = response.data;
    });
    this.getList();
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    /** 查询消息管理列表 */
    getList() {
      this.loading = true;
      // 是否查询个人的-消息（1：是，0：否）
      listMessage({ sfcxgr: "1" }).then(response => {
        this.messageList = response.rows;
        if (this.messageList.length > 0) {
          let num = 0;
          for (let i = 0; i < response.total; i++) {
            // 如果有消息通知处于 0=待确认；3=待回复  的状态，则弹出提示框
            if (
              "0" == response.rows[i].messageStatus ||
              "3" == response.rows[i].messageStatus
            ) {
              num++;
            }
          }
          if (num > 0) {
            // 如果有消息则弹出提示框
            this.reminder(num);
          }
        }
        this.loading = false;
      });
    },
    // 右下角的提示框
    reminder(num) {
      let _that = this;
      this.$notify({
        title: "消息通知",
        dangerouslyUseHTMLString: true,
        position: "bottom-right",
        message:
          "<a href='#'>" + "您有" + num + "条消息需要处理！请点击查看消息</a>",
        duration: 0,
        onClick() {
          _that.checkMessageNotify();
        }
      });
    },
    checkMessageNotify() {
      this.dialogTableVisible = true;
    },
    // 消息查看
    messageCheck(row) {
      this.messageConfirmStatus = row.messageStatus;
      this.innerTitle = "查看消息详情";
      this.innerVisible = true;
      getMessage(row.id).then(response => {
        this.form = response.data;
        this.wjidFile = this.ifNullToNewArray(response.data.fileArr);
      });
    },
    ifNullToNewArray(arr) {
      if (null == arr) {
        return [];
      }
      return arr;
    },
    // 消息确认
    messageConfirm(row) {
      let obj = {
        messageId: row.id,
        status: "1" // 状态：1=确认
      };
      this.$confirm("是否确认?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return addMessageReceive(obj);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 消息回复
    messageReply(row) {
      this.messageConfirmStatus = row.messageStatus;
      this.innerTitle = "回复消息";
      this.innerVisible = true;
      getMessage(row.id).then(response => {
        this.form = response.data;
        this.wjidFile = this.ifNullToNewArray(response.data.fileArr);
      });
    },
    /** 下载操作 */
    downloadFileName(fileName) {
      this.download(
        "file/filetable/download",
        {
          wjmc: fileName
        },
        fileName
      );
    },
    // 取消按钮
    cancel() {
      this.innerVisible = false;
      this.reset();
    },
    submitForm() {
      if (!this.form.messageHfnr) {
        this.msgError("请填写回复内容！");
        return;
      }
      let obj = {
        messageId: this.form.id,
        status: "2", // 回复=2
        hfnr: this.form.messageHfnr
      };
      addMessageReceive(obj).then(res => {
        if (200 == res.code) {
          this.msgSuccess("操作成功！");
          this.getList();
          this.innerVisible = false;
        } else {
          this.msgError("操作失败！请联系管理员！");
        }
        this.messageHfnr = null;
      });
    },
    reset() {
      this.form = {
        id: null,
        xxlx: null,
        xxbt: null,
        xxnr: null,
        sfqbfs: null,
        xxqrlx: "0",
        remark: null,
        userId: null,
        userName: null,
        status: "0",
        dataOrder: null,
        createTime: null,
        updateTime: null,
        kzzd1: null,
        kzzd2: null,
        kzzd3: null,
        kzzd4: null,
        kzzd5: null,
        messageHfnr: null,
        messageStatus: null
      };
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

