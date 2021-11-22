<template>
  <div class="wrap-pybc">
    <table border="1" style="width : 100%" cellspacing="0">
      <tbody>
        <tr>
          <td class="td-left-box">班级</td>
          <td style="text-align : center">
            <span>{{zyrzDetailsData.bjmc}}</span>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">老师</td>
          <td style="text-align : center">{{zyrzDetailsData.lsxm}}</td>
        </tr>
        <tr>
          <td class="td-left-box">培优主题</td>
          <td style="text-align : center">
            <span>{{zyrzDetailsData.theme}}</span>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">内容</td>
          <td>
            <editor :disabled="true" v-model="zyrzDetailsData.content" :min-height="200" />
          </td>
        </tr>
        <tr>
          <td class="td-left-box">针对学生</td>
          <td>
            <div v-for="(item,index) in zyrzDetailsData.zdxsObjList" :key="index">
              <h3>{{item.xsxm}}</h3>
              <el-image
                v-for="(imgItem,index) in item.tpObjList"
                :key="index"
                style="width: 100px; height: 100px;margin : 5px"
                :src="imgItem.url"
              ></el-image>
            </div>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">文件</td>
          <td>
            <img
              style="width : 200px; margin : 10px"
              v-for="(item,index) in zyrzDetailsData.tpObjList"
              :src="item.url"
              :key="index"
              alt
            />
          </td>
        </tr>
        <tr>
          <td class="td-left-box">备注</td>
          <td>
            <editor :disabled="true" v-model="zyrzDetailsData.remark" :min-height="200" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import { getExcellentTraining } from "@/api/basic/excellentTraining";
import { getToken } from "@/utils/auth";
import { secretKey } from "@/utils/tools";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      dialogVisibleForm: false,
      dialogFormVisible: true,
      dialogImageFormUrl: "",
      zyrzDetailsData: {},
      zylxOptions: []
    };
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      getExcellentTraining(this.$route.query.id).then(res => {
        if (res.code == 200) {
          this.zyrzDetailsData = res.data;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap-pybc {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  th,
  td {
    padding: 20px;
  }
  .td-left-box {
    width: 20%;
    text-align: center;
  }
}
</style>
