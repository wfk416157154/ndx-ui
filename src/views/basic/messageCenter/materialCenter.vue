<template>
  <div class="sc-wrap">
    <el-tabs type="border-card" v-model="activeName">
      <el-button size="mini" type="success" @click="handelUpload"
        >上 传</el-button
      >
      <el-tab-pane label="图片" name="tp"></el-tab-pane>
      <el-tab-pane label="音频" name="yp"></el-tab-pane>
      <el-tab-pane label="视频" name="sp"></el-tab-pane>
      <!-- 列表 -->
      <div style="margin: 20px 0px">
        <el-table :data="scTableData" border style="width: 100%">
          <el-table-column type="index" label="序号" width="55">
          </el-table-column>
          <el-table-column prop="date" label="主题" width="180">
          </el-table-column>
          <el-table-column prop="name" label="图片" width="180">
          </el-table-column>
          <el-table-column prop="address" label="MediaId"> </el-table-column>
          <el-table-column prop="address" label="上传时间"> </el-table-column>
          <el-table-column prop="address" label="状态"> </el-table-column>
          <el-table-column prop="address" label="操作" width="200px">
            <!-- <template slot-scope="scope">
              <el-button size="mini" type="info" @click="handelViews"
                >查 看</el-button
              >
              <el-button size="mini" type="success" @click="handelSend"
                >再 次 发 送</el-button
              >
            </template> -->
          </el-table-column>
        </el-table>
      </div>
    </el-tabs>

    <el-dialog :title="uploadName" :visible.sync="dialogFormVisible">
      <div v-if="uploadType">
        <el-upload
          ref="upload"
          :limit="1"
          :headers="upload.headers"
          :action="upload.fileUrl"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </div>
      <div v-else>
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
                上传视频
              </td>
              <td style="padding: 20px; box-sizing: border-box">
                <el-upload
                  ref="upload"
                  :limit="1"
                  :headers="upload.headers"
                  :action="upload.fileUrl"
                  :on-success="handleFileSuccess"
                  :auto-upload="false"
                  drag
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                  </div>
                </el-upload>
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
                封面
              </td>
              <td style="padding: 20px; box-sizing: border-box">1231</td>
            </tr>
            <tr>
              <td
                style="
                  padding: 20px;
                  box-sizing: border-box;
                  text-align: center;
                "
              >
                主题
              </td>
              <td style="padding: 20px; box-sizing: border-box">1231</td>
            </tr>
            <tr>
              <td
                style="
                  padding: 20px;
                  box-sizing: border-box;
                  text-align: center;
                "
              >
                视频介绍
              </td>
              <td style="padding: 20px; box-sizing: border-box">1231</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import {
  listWxMessage,
  getWxMessage,
  addWxMessage,
  updateWxMessage,
  delWxMessage,
} from "@/api/basic/messageCenter";
import {
  listWxMaterial,
  getWxMaterial,
  addWxMaterial,
  updateWxMaterial,
  delWxMaterial,
} from "@/api/basic/wxMaterial";
import {
  listWxMsgUser,
  getWxMsgUser,
  addWxMsgUser,
  updateWxMsgUser,
  delWxMsgUser,
} from "@/api/basic/msgUser";
export default {
  data() {
    return {
      scTableData: [{}],
      activeName: "tp",
      uploadName: "",
      dialogFormVisible: false,
      uploadType: true,
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传考试成绩地址
        fileUrl:
          process.env.VUE_APP_BASE_API +
          "/basic/examinationPaper/importClassGradeData",
      },
    };
  },
  methods: {
    handelUpload() {
      this.handleClick();
    },
    handleClick() {
      console.log(this.activeName);
      switch (this.activeName) {
        case "tp":
          this.uploadName = "图片上传";
          this.dialogFormVisible = true;
          break;
        case "yp":
          this.uploadName = "音频上传";
          this.dialogFormVisible = true;
          break;
        case "sp":
          this.uploadName = "视频上传";
          this.uploadType = false;
          this.dialogFormVisible = true;
          break;
        default:
          break;
      }
    },
    handleFileSuccess(response, file, fileList) {},
  },
};
</script>

<style lang="scss" scoped>
.sc-wrap {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>