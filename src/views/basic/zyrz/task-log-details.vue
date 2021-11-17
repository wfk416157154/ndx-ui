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
          <td class="td-left-box">作业主题</td>
          <td style="text-align : center">
            <span>{{zyrzDetailsData.zyzt}}</span>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">作业类型</td>
          <td style="text-align : center">
            <el-select
              v-model="zyrzDetailsData.zylx"
              disabled
              placeholder="请选择作业类型"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in zylxOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="td-left-box">内容</td>
          <td>
            <editor :disabled="true" v-model="zyrzDetailsData.zynr" :min-height="200" />
          </td>
        </tr>
        <tr>
          <td class="td-left-box">针对学生</td>
          <td>
            <div v-for="(item,index) in zyrzDetailsData.homeworkLogStudentList" :key="index">
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
import { getHomework } from "@/api/basic/homework";
import { getToken } from "@/utils/auth";
import { secretKey } from "@/utils/tools";
import { addImg, addFile, selectFileList, deleteImg } from "@/api/tool/common";
export default {
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      value1: "",
      input: "",
      radio: "",
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      srcList: [
        "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
        "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg"
      ],
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
    this.getDicts("homework_type").then(response => {
      this.zylxOptions = response.data;
    });
    if (this.$route.query && this.$route.query.id) {
      getHomework(this.$route.query.id).then(res => {
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
