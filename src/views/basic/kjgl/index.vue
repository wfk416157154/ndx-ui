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
          <div style="margin:10px 0px 10px 10px" v-for="(vo,index) in kcrwList" :key="index">{{vo.jdmc}}
            <el-button style="margin-left: 20px" type="primary" size="small" round @click="checkKj(vo)"
                       v-if="vo.courseware.status&&'0'!=vo.courseware.status">上传修改课件
            </el-button>
            <el-button style="margin-left: 20px" type="success" size="small" @click="previewPPT(vo.courseware.ybkjUrl)"
                       v-if="vo.courseware.status&&'0'!=vo.courseware.status">查看原版课件
            </el-button>
            <el-button style="margin-left: 20px" type="warning" size="small" @click="showUpload(vo.id)" circle
                       v-if="null==vo.courseware.status">上传原版课件
            </el-button>
          </div>

        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="上传原版课件" :visible.sync="ybdialogShow" width="30%">
      <div>
        <el-upload
          ref="kjUpload"
          :limit="1"
          accept="*"
          :headers="upload.headers"
          :action="upload.url"
          :on-remove="handleRemove"
          :on-progress="handleFileUploadProgress"
          :on-success="handleKjFileSuccess"
          :auto-upload="true"
          :file-list="ybWjidFile"
          :before-upload="beforeFile"
          :data="fileForm"
          drag
          v-loading="fullscreenLoading"
          element-loading-text="正在进行上传·······"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ybdialogShow = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>


</template>


<script>
  import {queryKjTreeList, queryTeachingTemplateList} from "@/api/basic/kjgl";
  import {listTeachingMaterial} from "@/api/basic/teachingMaterial";
  import {getToken} from "@/utils/auth";
  import {addFile, selectFileList, delFile} from "@/api/tool/common";
  import {secretKey} from "@/utils/tools";
  import {listCourseware, getCourseware, delCourseware, addCourseware, updateCourseware} from "@/api/basic/courseware";
  import { addOperatingRecord } from "@/api/basic/operatingRecord";
  let Base64 = require("js-base64").Base64;
  export default {
    data() {
      return {
        fullscreenLoading: false,
        ybdialogShow: false,// 是否显示上传原版课件的弹窗
        kjTreeList: [],// 课件树结构列表
        materaialList: [],// 教材列表
        inputContent: "",// 输入的课程内容
        activeTab: "",// 激活的tabs
        defaultProps: { // 树结构默认配置
          children: 'children',
          label: 'name'
        },
        kcrwList: [],// 课程任务数据集合
        // 导入参数
        upload: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "上传",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: {Authorization: "Bearer " + getToken()},
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/file/renameUpload"
        },
        fileForm: {
            renameFileName: ""
          },
        // 文件id数组
        ybWjidFile: [],
        ybkjWjid: secretKey(),// 原版课件id
        kcrwId: "",// 课程任务id
        currentChooseKcId: "",// 当前选择的课程id
      };
    },
    created() {
      /* 查询教材 */
      listTeachingMaterial({parentId: 0}).then(res => {
        this.materaialList = res.data;
        this.activeTab = res.data[0].id + ""
        this.getKjTreeList(parseInt(res.data[0].id));
      });
    },
    methods: {
      //  文件上传修改名称
       beforeFile(file) {
        this.fileForm.renameFileName ='课件列表-'+file.name
    },
      /* 查看课件 */
      checkKj(vo) {
        this.getConfigKey("kjglForm").then(resp => {
          this.$router.push({
            path: resp.msg,
            query: vo
          });
        })
      },
      /* 显示上传控件 */
      showUpload(kcrwId) {
        this.kcrwId = kcrwId;
        this.ybdialogShow = true
      },
      /* 预览PPT */
      previewPPT(url) {
        let encodeurl = Base64.encode(url);
        this.getConfigKey("onlinePreviewUrl").then((res) => {
          window.open(res.msg + encodeURIComponent(encodeurl));
        });
      },
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
        this.currentChooseKcId = data.id;
        this.kcrwList = [];
        queryTeachingTemplateList({parentId: data.id, isFilterNotNumber: true}).then(res => {
          this.kcrwList = res.data;
        });
      },
      //文件删除
      handleRemove(file, fileList) {
        delFile(file.id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message.error("删除失败");
          }
        });
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 课件上传成功处理
      handleKjFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        let data = response.data;
        data.kzzd1 = this.ybkjWjid;
        addFile(data).then(res => {
          file.id = res.data.id;
          this.msgSuccess("文件上传成功");
          this.ybWjidFile = fileList;
          this.ybdialogShow = false;
          this.saveCourseware(data);
        });
        let record={
          glid:this.kcrwId,// 课程任务id
          ssmk:"课件模块",
          cznrms:"上传原版课件",
          czrid:this.$store.state.user.userId,
          czrsjh:this.$store.state.user.name,
          czrxm:this.$store.state.user.nickName,
        }
        /* 添加到操作记录 */
        addOperatingRecord(record).then(res=>{
        });
        this.$refs.kjUpload.clearFiles();
      },
      /* 保存课件信息 */
      saveCourseware(data) {
        let obj = {
          kcrwId: this.kcrwId,// 课程任务id
          ybkjWjid: this.ybkjWjid,// 原版课件-文件id
          ybkjUrl: data.url,// 原版课件-文件路径
          status: "1",// 原版课件已上传
        }
        addCourseware(obj).then(res => {
          this.handleNodeClick({id: this.currentChooseKcId})
        });
      },

    }
  };
</script>
