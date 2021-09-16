<template>
  <div
    style="width : 100%;height : 100%;padding : 40px; box-sizing : border-box;text-align : center"
  >
    <h3>休学信息</h3>
    <div>
      <table style="width : 100%;" border="1" cellspacing="0">
        <thead>
          <tr>
            <th>班级</th>
            <th>{{getXiuxueitem.rybjmc}}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>学生</td>
            <td>{{getXiuxueitem.xsxm}}</td>
          </tr>
          <tr>
            <td>老师</td>
            <td>{{getXiuxueitem.lsxm}}</td>
          </tr>
          <tr>
            <td>入班时间</td>
            <td>{{getXiuxueitem.rbsj}}</td>
          </tr>
          <tr>
            <td>休学时间</td>
            <td>{{getXiuxueitem.xskssj}} - {{getXiuxueitem.xsjssj}}</td>
          </tr>
          <tr>
            <td>休学原因</td>
            <td class="clearfix">{{getXiuxueitem.xxyy}}</td>
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
              <span>{{getXiuxueitem.remark}}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
    
<script>
import { selectFileList } from "@/api/tool/common";
import { getXiuxue } from "@/api/basic/xiuxue.js";
export default {
  data() {
    return {
      getXiuxueitem: null,
      imgList : []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getXiuxue(this.$route.query.id).then(res => {
        this.getXiuxueitem = res.data;
        selectFileList({ kzzd1: this.getXiuxueitem.id }).then(res => {
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