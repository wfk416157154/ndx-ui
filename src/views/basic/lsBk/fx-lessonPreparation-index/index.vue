
<template>
  <div
    style="width : 100%;height : 100%;padding : 40px; box-sizing : border-box;text-align : center"
  >
    <div>
      <table style="width : 100%;" border="1" cellspacing="0">
        <thead>
          <tr>
            <th>课程</th>
            <th>{{title.fxzlmc}} / {{title.zmc}} / {{title.jmc}} / {{title.zsdmc}}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>课程安排</td>
            <td>{{paramsList.name}}</td>
          </tr>
          <tr>
            <td>备课</td>
            <td style="text-align : left">
              <h3>已上传的图片</h3>
              <div class="clearfix">
                <div
                  v-for="(item,index) in itemResult.bkTpArr"
                  :key="index"
                  style="float : left;margin-right : 10px"
                >
                  <img style="width : 200px" :src="item" alt />
                </div>
              </div>
              <h3>已上传的文件</h3>
              <div class="clearfix">
                <div v-for="(item,index) in itemResult.bkWjArr" :key="index">
                  <a :href="item" style="color : #409EFF">{{++index}} ) {{item}}</a>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <editor v-model="itemResult.remark" :disabled="true" :min-height="192" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { fxlxVOQuery, prepareLessons } from "@/api/basic/lessonPreparationHome";
export default {
  data() {
    return {
      form: {},
      paramsList: null,
      itemResult: {},
      title: {}
    };
  },
  created() {
    if (this.$route.query.list) {
      this.paramsList = JSON.parse(this.$route.query.list);
      fxlxVOQuery({ id: this.paramsList.id }).then(res => {
        this.title = res.data;
      });
    }
  },
  mounted() {
    this.getPrepareLessons();
  },
  methods: {
    getPrepareLessons() {
      prepareLessons(this.paramsList.prepareLessonsId).then(res => {
        if (res.code == 200) {
          this.itemResult = res.data;
        }
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
