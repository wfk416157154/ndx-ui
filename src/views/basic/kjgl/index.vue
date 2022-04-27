<template>
  <div class="app-container">
    <el-tabs type="border-card" v-model="activeTab" @tab-click="tabClick">
      <el-tab-pane :label="item.jcmc" :name="item.id+''" v-for="(item,index) in materaialList" :key="index">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-input v-model="inputContent" placeholder="请输入课程"></el-input>
          </el-col>
          <el-col :span="12">
            <el-button icon="el-icon-search" type="primary" @click="searchTreeList">搜索</el-button>
          </el-col>
        </el-row>
        <div style="width: 50%;margin-top: 20px;float: left">
          <el-tree :ref="'tree'+item.id" :data="kjTreeList" :props="defaultProps" :filter-node-method="filterNode"
                   :highlight-current="true" :default-expand-all="true" @node-click="handleNodeClick"></el-tree>
        </div>
        <div style="width: 50%;margin-top: 20px;float: left;border: 2px solid gray;border-radius: 5px;">
          <div style="margin:10px 0px 10px 10px" v-for="(vo,index) in kcrwList">{{vo.jdmc}}
            <el-button style="margin-left: 20px" type="primary" size="small" round>查看或编辑</el-button>
            <el-button style="margin-left: 20px" type="warning" size="small" circle>上传</el-button>
          </div>

        </div>
      </el-tab-pane>
    </el-tabs>
  </div>


</template>

<script>
  import {queryKjTreeList, queryTeachingTemplateList} from "@/api/basic/kjgl";
  import {listTeachingMaterial} from "@/api/basic/teachingMaterial";

  export default {
    data() {
      return {
        kjTreeList: [],// 课件树结构列表
        materaialList: [],// 教材列表
        inputContent: "",// 输入的课程内容
        activeTab: "",// 激活的tabs
        defaultProps: { // 树结构默认配置
          children: 'children',
          label: 'name'
        },
        kcrwList: [],// 课程任务数据集合
      };
    },
    created() {
      listTeachingMaterial({parentId: 0}).then(res => {
        this.materaialList = res.data;
        this.activeTab = res.data[0].id + ""
        this.getKjTreeList(parseInt(res.data[0].id));
      });
    },
    methods: {
      /* 查询树结构的某个节点 */
      searchTreeList() {
        this.$refs['tree' + this.activeTab][0].filter(this.inputContent);
      },
      /* 过滤节点的函数 */
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      /* 点击tab后触发  */
      tabClick(e) {
        let jcid = parseInt(e.name);
        this.getKjTreeList(jcid);
      },
      /* 查询课件列表 */
      getKjTreeList(jcid) {
        queryKjTreeList({glid: jcid}).then(res => {
          this.kjTreeList = res.data.treeList;
        });
      },
      /* 点击某个节点后触发 */
      handleNodeClick(data) {
        this.kcrwList = [];
        queryTeachingTemplateList({parentId: data.id, isFilterNotNumber: true}).then(res => {
          this.kcrwList = res.data;
        });
      },


    }
  };
</script>
