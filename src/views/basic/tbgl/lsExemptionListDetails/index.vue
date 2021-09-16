<template>
  <div
    style="width : 100%;height : 100%;padding : 40px; box-sizing : border-box;text-align : center"
  >
    <h3>免责信息</h3>
    <div>
      <table style="width : 100%;" border="1" cellspacing="0">
        <thead>
          <tr>
            <th>班级</th>
            <th>{{getMianzeitem.rybjmc}}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>学生</td>
            <td>{{getMianzeitem.xsxm}}</td>
          </tr>
          <tr>
            <td>老师</td>
            <td>{{getMianzeitem.lsxm}}</td>
          </tr>
          <tr>
            <td>入班时间</td>
            <td>{{getMianzeitem.rbsj}}</td>
          </tr>
          <tr>
            <td>免责原因</td>
            <td class="clearfix">{{getMianzeitem.mzyy}}</td>
          </tr>
          <tr>
            <td>免责资料</td>
            <td>
              <div class="block" style="display : flex; width : 100% ; height : 100%">
                <el-image
                  style="width: 200px; height: 200px; margin : 0px 5px"
                  v-for="(item,index) in imgList"
                  :key="index"
                  :src="item.url"
                  :preview-src-list="[item.url]"
                >
                  <div
                    slot="error"
                    style="width : 100%; height : 100%; display : flex; align-items : center;background : #eee; font-size : 12px;justify-content:center;color : #c0c4cc"
                    class="image-slot"
                  >
                    <span>加载失败</span>
                  </div>
                </el-image>
              </div>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <span>{{getMianzeitem.remark}}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
    
<script>
import { selectFileList } from "@/api/tool/common";
import { getMianze } from "@/api/basic/mianze.js";
export default {
  data() {
    return {
      getMianzeitem: null,
      imgList : []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getMianze(this.$route.query.id).then(res => {
        this.getMianzeitem = res.data;
        selectFileList({ kzzd1: this.getMianzeitem.id }).then(res => {
            this.imgList = res.rows
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
th,
td {
  padding: 20px;
  box-sizing: border-box;
}
</style>