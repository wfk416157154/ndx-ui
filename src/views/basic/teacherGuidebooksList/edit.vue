<template>
  <div class="edit">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>{{kcItem.jdmc}}</span>
        </div>
      </template>
      <div class="view-item">
        <div>
          <h2>建议</h2>
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="建议列表" name="1">
              <div class="item-content" v-for="(item,index) in suggestList" :key="index">
                <span>{{item.userName}} {{item.suggestContent}} {{item.createTime}}</span>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  style="margin-left : 20px"
                  circle
                  size="mini"
                  @click="deleteSuggest(item)"
                ></el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div>
          <el-tabs type="card" @tab-click="handleClick" v-model="activeTabName">
            <el-tab-pane
              :name="JSON.stringify(item)"
              :label="item.referenceName"
              v-for="(item,index) in referenceList"
              :key="index"
            ></el-tab-pane>
            <el-tab-pane label="查看修改记录" name="ls"></el-tab-pane>
          </el-tabs>
          <div>
            <div v-if="templateItem">
              <editor
                v-model="templateItem.referenceContent"
                :disabled="templateItem.status == '1' && referenceList.length == 2"
                :min-height="300"
              />
            </div>
            <div v-if="recordList.length > 0 && !templateItem">
              <el-collapse>
                <el-collapse-item
                  :title="`${item.userName} ${item.createTime}`"
                  v-for="(item,index) in recordList"
                  :key="index"
                >
                  <template slot="title">
                    <div>
                      <span style="margin-right : 10px">{{item.userName}} {{item.createTime}}</span>
                      <el-tag size="mini" type="success" v-if="item.kzzd1 == '1'">启 用</el-tag>
                      <el-tag size="mini" type="danger" v-else-if="item.kzzd1 == '0'">关 闭</el-tag>
                      <el-tag size="mini" type="info" v-else>修 改</el-tag>
                    </div>
                  </template>
                  <div>
                    <h4>教参内容</h4>
                    <div style="margin-left : 20px" v-html="item.referenceContent"></div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
          <div style="width:100%;height:60px;margin-top:20px">
            <el-button
              type="primary"
              size="mini"
              style="float:right;margin-left:20px"
              @click="handelEnableReference('1')"
              v-if=" templateItem && templateItem.enableStatus == '0' && templateItem.status != '1'"
            >启用</el-button>
            <el-button
              type="danger"
              size="mini"
              style="float:right;margin-left:20px"
              @click="handelEnableReference('0')"
              v-if=" templateItem && templateItem.enableStatus == '1' && templateItem.status != '1'"
            >关闭</el-button>
            <el-button
              type="primary"
              size="mini"
              style="float:right"
              @click="saveSubmit"
              v-if="(referenceList.length == 2 && templateItem && templateItem.status == '2') || (referenceList.length == 1 && templateItem && templateItem.status == '1') "
            >保 存</el-button>
            <el-button
              size="mini"
              type="info"
              @click="handleExport"
              style="float:right;margin-right : 10px"
              :disabled=" activeTabName == 'ls'"
            >导出</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  listSuggest,
  saveReference,
  updateSuggest,
  listReference,
  listRecord,
  enableReference
} from "@/api/basic/teacherGuidebooksList";

export default {
  data() {
    return {
      kcItem: {},
      suggestList: [],
      referenceList: [],
      recordList: [],
      tabsContent: "",
      templateItem: null,
      activeName: "1",
      activeTabName: ""
    };
  },
  created() {
    this.kcItem = JSON.parse(this.$route.query.row);
    this.getList();
  },
  methods: {
    // 查询
    getList() {
      listSuggest({ kzzd1: this.kcItem.id, status: "1" }).then(res => {
        this.suggestList = res.rows;
      });
      listReference({ templateId: this.kcItem.id }).then(res => {
        this.referenceList = res.rows;
        if (this.referenceList.length == 1) {
          this.activeTabName = JSON.stringify(this.referenceList[0]);
          this.templateItem = this.referenceList[0];
        } else {
          this.activeTabName = JSON.stringify(this.referenceList[1]);
          this.templateItem = this.referenceList[1];
        }
      });
    },

    // 删除建议
    deleteSuggest(item) {
      updateSuggest({ id: item.id, status: "0" }).then(res => {
        if (res.code == 200) {
          this.msgSuccess("操作成功");
          this.getList();
        }
      });
    },
    // 导出
    handleExport() {
      console.log(this.kcItem.kcmc);
      this.download(
        "basic/reference/exportReference",
        {
          ...this.templateItem
        },
        `${this.kcItem.kcmc}-${this.templateItem.referenceName}.doc`
      );
    },
    // 保存按钮
    saveSubmit() {
      this.templateItem.templateId = this.kcItem.id;
      saveReference(this.templateItem).then(res => {
        if (res.code == 200) {
          this.msgSuccess("操作成功");
          this.$router.go(-1);
          this.getList();
        }
      });
    },
    // 历史
    handleClick(tab) {
      if (tab.name == "ls") {
        this.templateItem = null;
        listRecord({ templateId: this.kcItem.id }).then(res => {
          this.recordList = res.rows;
        });
      } else {
        this.templateItem = JSON.parse(tab.name);
      }
    },
    // 启用教参
    handelEnableReference(status) {
      this.templateItem.enableStatus = status;
      enableReference(this.templateItem).then(res => {
        if (res.code == 200) {
          this.msgSuccess("操作成功");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.edit {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .view-item {
    width: 100%;
    border: 1px solid #ccc;
    padding: 10px 20px;
    box-sizing: border-box;
    .item-content {
      display: flex;
      align-items: center;
      margin: 10px 0px;
      margin-left: 60px;
    }
  }
}
</style>
